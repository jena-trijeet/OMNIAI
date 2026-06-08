import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to extract text from diverse n8n response structures
function extractResponseText(data: any, prompt: string = ""): string {
  const pLower = prompt.toLowerCase();
  
  const getFallbackImage = () => {
    if (pLower.includes("city") || pLower.includes("skyline") || pLower.includes("metropolis") || pLower.includes("street")) {
      return "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=1024&auto=format&fit=crop"; // Cyberpunk Tokyo streets
    } else if (pLower.includes("robot") || pLower.includes("machine") || pLower.includes("cyborg") || pLower.includes("android") || pLower.includes("ai")) {
      return "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1024&auto=format&fit=crop"; // Mechanical robot node
    } else if (pLower.includes("car") || pLower.includes("vehicle") || pLower.includes("cyber")) {
      return "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1024&auto=format&fit=crop"; // Cyber supercar glowing neon
    } else if (pLower.includes("space") || pLower.includes("galaxy") || pLower.includes("star") || pLower.includes("cosmos")) {
      return "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1024&auto=format&fit=crop"; // Abstract purple cosmos
    } else if (pLower.includes("food") || pLower.includes("restaurant") || pLower.includes("dine") || pLower.includes("hotel")) {
      return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1024&auto=format&fit=crop"; // Luxury dining
    }
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop"; // Abstract neon waves
  };

  const getFallbackText = () => {
    const imageUrl = getFallbackImage();
    return `I encountered a neural synchronization delay while generating your image. Deploying a pre-curated futuristic visual fallback:\n\n![Synthesized Visual](${imageUrl})`;
  };

  if (!data) return "";
  if (typeof data === 'string') {
    if (data.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && (parsed.x402Version || (parsed.error && String(parsed.error).includes("Queue full")))) {
          return getFallbackText();
        }
      } catch (e) {}
    }
    return data;
  }
  
  if (Array.isArray(data)) {
    if (data.length > 0) {
      return extractResponseText(data[0], prompt);
    }
    return "";
  }
  
  if (typeof data === 'object') {
    if (data.x402Version || (data.error && (String(data.error).includes("Queue full") || String(data.error).includes("pollinations.ai")))) {
      console.warn("Intercepted Pollinations rate limit error in Chat response extraction. Engaging premium fallback.");
      return getFallbackText();
    }

    // Check for n8n AI Agent format (e.g. data.output which can be string or array/object)
    if (data.output !== undefined) {
      return extractResponseText(data.output, prompt);
    }
    
    // Check content property (often an array of text/image blocks)
    if (data.content !== undefined) {
      if (Array.isArray(data.content)) {
        for (const item of data.content) {
          if (item && typeof item === 'object') {
            if (item.text !== undefined) return String(item.text);
            if (item.content !== undefined) return extractResponseText(item.content, prompt);
          }
        }
      } else {
        return extractResponseText(data.content, prompt);
      }
    }
    
    if (data.text !== undefined) return String(data.text);
    if (data.response !== undefined) return extractResponseText(data.response, prompt);
    if (data.message !== undefined) return extractResponseText(data.message, prompt);
    if (data.reply !== undefined) return extractResponseText(data.reply, prompt);
    
    // If it has only one key, try to extract that
    const keys = Object.keys(data);
    if (keys.length === 1) {
      return extractResponseText(data[keys[0]], prompt);
    }
  }
  
  return JSON.stringify(data);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    // 1. Primary Cognitive Core: n8n Workflow Webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://trijeet12.app.n8n.cloud/webhook-test/omniai-chat";
    console.log("Neural Uplink: Querying Primary n8n Cognitive Core...");
    
    const payload = {
      message: lastMessage,
      chatInput: lastMessage,
      sessionId: "omniai-session",
      messages: messages,
      chatHistory: messages
    };

    let response;
    let n8nErrorOccurred = false;

    try {
      response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (e: any) {
      console.warn("Primary n8n Webhook fetch failed:", e.message);
      n8nErrorOccurred = true;
    }

    // Fallback logic if primary failed or returned 404/5xx
    if (n8nErrorOccurred || (response && (response.status === 404 || response.status >= 500))) {
      let fallbackUrl = "";
      if (n8nWebhookUrl.includes('/webhook-test/')) {
        fallbackUrl = n8nWebhookUrl.replace('/webhook-test/', '/webhook/');
      } else if (n8nWebhookUrl.includes('/webhook/')) {
        fallbackUrl = n8nWebhookUrl.replace('/webhook/', '/webhook-test/');
      }

      if (fallbackUrl && fallbackUrl !== n8nWebhookUrl) {
        try {
          console.log(`n8n primary failed. Attempting fallback rewrite: ${fallbackUrl}`);
          const fallbackResponse = await fetch(fallbackUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          if (fallbackResponse.ok) {
            response = fallbackResponse;
            n8nErrorOccurred = false;
          }
        } catch (fallbackErr: any) {
          console.error("n8n fallback fetch also failed:", fallbackErr.message);
        }
      }
    }

    try {
      if (response && response.ok && !n8nErrorOccurred) {
        const contentType = response.headers.get('content-type');
        let assistantResponse = "";

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          assistantResponse = extractResponseText(data, lastMessage);
        } else {
          assistantResponse = await response.text();
        }

        console.log("n8n Core response retrieved and parsed successfully.");
        return NextResponse.json({ content: assistantResponse });
      } else {
        console.warn(`n8n Core returned status ${response ? response.status : 'unknown'}. Falling back...`);
      }
    } catch (parseError: any) {
      console.error("n8n Response parsing failed:", parseError.message);
    }

    // 2. Failover: Direct OpenAI Logic Node
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        console.log("Neural Uplink: Querying OpenAI Failover Node...");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are OmniAI, a futuristic Jarvis-style assistant. Respond concisely, elegantly, and intelligently." },
            ...messages
          ],
        });
        
        const assistantResponse = response.choices[0].message.content || "";
        return NextResponse.json({ content: assistantResponse });
      } catch (error: any) {
        console.error("OpenAI Logic Node Failed:", error.message);
      }
    }

    // 3. Failover: Direct Gemini Logic Node
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      console.log("Neural Uplink: Querying Gemini Failover Node...");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(lastMessage);
      const response = await result.response;
      return NextResponse.json({ content: response.text() });
    }

    return NextResponse.json(
      { error: "Neural link offline: n8n webhook and failover keys are unconfigured or failed. Please check your n8n workflow or set active API keys in .env.local." },
      { status: 500 }
    );

  } catch (error: any) {
    console.error("Neural Uplink Failure:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
