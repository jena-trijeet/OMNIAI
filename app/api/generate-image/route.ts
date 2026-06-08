import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const STYLE_MODIFIERS: Record<string, string> = {
  'Realistic':   'photorealistic, DSLR photo, cinematic lighting, ultra detailed, 8k, sharp focus',
  'Anime':       'anime illustration style, vibrant colors, detailed, studio quality, masterwork',
  'Cyberpunk':   'neon cyberpunk aesthetic, holographic, rain streets, synthwave, futuristic glow',
  '3D Render':   'Octane Render 3D CGI, Unreal Engine 5, raytraced shadows, glossy surfaces',
  'Pixar':       'Pixar 3D animation style, colorful, glossy eyes, warm volumetric lighting',
  'Cinematic':   'cinematic film still, anamorphic lens, dramatic epic lighting, movie quality',
  'Ghibli':      'Studio Ghibli watercolor style, lush scenery, soft pastel, hand-painted look',
  'Fantasy':     'epic fantasy digital art, magical particles, glowing runes, atmospheric depth',
  'Neon':        'ultra-vibrant neon glow, electric blue and pink highlights, bioluminescent dark',
  'Watercolor':  'elegant watercolor painting, soft pigment washes, delicate paper texture'
};

export async function POST(req: Request) {
  try {
    const { prompt, style, aspectRatio } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const userPrompt    = prompt.trim();
    const selectedStyle = style       || 'Realistic';
    const selectedRatio = aspectRatio || '1:1';
    const styleTag      = STYLE_MODIFIERS[selectedStyle] || STYLE_MODIFIERS['Realistic'];
    const fullPrompt    = `${userPrompt}, ${styleTag}`;

    let finalPrompt = fullPrompt;

    // Expand the prompt using LLM for premium detailed generation (like ChatGPT and Gemini do)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
      try {
        console.log(`[ImageGen] Enhancing prompt via OpenAI LLM...`);
        const openai = new OpenAI({ apiKey: openaiKey });
        const expansionResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert prompt engineer for AI image generators (like DALL-E 3, Flux, and Imagen). Your job is to take a simple user description and expand it into a highly detailed, visually stunning, descriptive prompt. Keep it descriptive, detail the background, lighting, objects, style, colors, and camera angle. Output ONLY the expanded prompt string. Do not include any intros or explanations."
            },
            { role: "user", content: `Expand this image prompt: "${userPrompt}"` }
          ],
          max_tokens: 150
        });
        const expandedText = expansionResponse.choices[0].message.content?.trim();
        if (expandedText) {
          finalPrompt = `${expandedText}, ${styleTag}`;
          console.log(`[ImageGen] Enhanced prompt successfully: "${finalPrompt}"`);
        }
      } catch (e: any) {
        console.warn("[ImageGen] OpenAI prompt expansion failed:", e.message);
      }
    }

    // Or try Google Gemini fallback for prompt expansion
    const geminiKey = process.env.GEMINI_API_KEY;
    if (finalPrompt === fullPrompt && geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        console.log(`[ImageGen] Enhancing prompt via Gemini LLM...`);
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(
          `You are an expert prompt engineer for AI image generators (like DALL-E 3, Flux, and Imagen). Your job is to take a simple user description and expand it into a highly detailed, visually stunning, descriptive prompt. Keep it descriptive, detail the background, lighting, objects, style, colors, and camera angle. Output ONLY the expanded prompt string. Do not include any intros or explanations.\n\nExpand this image prompt: "${userPrompt}"`
        );
        const responseText = result.response.text()?.trim();
        if (responseText) {
          finalPrompt = `${responseText}, ${styleTag}`;
          console.log(`[ImageGen] Enhanced prompt successfully via Gemini: "${finalPrompt}"`);
        }
      } catch (e: any) {
        console.warn("[ImageGen] Gemini prompt expansion failed:", e.message);
      }
    }

    let width = 1024, height = 1024;
    if (selectedRatio === '16:9') { width = 1344; height = 768; }
    else if (selectedRatio === '9:16') { width = 768; height = 1344; }
    else if (selectedRatio === '4:3')  { width = 1024; height = 768; }
    else if (selectedRatio === '3:4')  { width = 768; height = 1024; }

    console.log(`\n[ImageGen] Prompt: "${userPrompt.substring(0, 80)}" | Style: ${selectedStyle} | Ratio: ${selectedRatio}`);

    // ════════════════════════════════════════════════════════════
    // GENERATOR 1 — Flask/Gemini server (localhost:5000)
    // ════════════════════════════════════════════════════════════
    try {
      const r = await fetch('http://localhost:5005/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
        signal: AbortSignal.timeout(60000)
      });
      if (r.ok) {
        const d = await r.json();
        if (d.success && d.imageUrl) {
          console.log('[Gen-1] ✅ Flask/Gemini success!');
          return NextResponse.json({ imageUrl: d.imageUrl });
        }
      }
    } catch (e: any) { console.warn('[Gen-1] Flask offline —', e.message); }

    // ════════════════════════════════════════════════════════════
    // GENERATOR 1.5 — OpenAI DALL-E 3 API
    // ════════════════════════════════════════════════════════════
    if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
      try {
        console.log('[Gen-1.5] Attempting OpenAI DALL-E 3...');
        const openai = new OpenAI({ apiKey: openaiKey });
        
        // Map selected aspect ratio to DALL-E 3 supported dimensions
        let size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024";
        if (selectedRatio === '16:9') {
          size = "1792x1024";
        } else if (selectedRatio === '9:16') {
          size = "1024x1792";
        }
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: finalPrompt,
          n: 1,
          size: size,
          quality: "standard"
        });
        
        const dallEUrl = response.data?.[0]?.url;
        if (dallEUrl) {
          console.log('[Gen-1.5] ✅ OpenAI DALL-E 3 success!');
          return NextResponse.json({ imageUrl: dallEUrl });
        }
      } catch (e: any) {
        console.warn('[Gen-1.5] OpenAI DALL-E 3 failed:', e.message);
      }
    }

    // ════════════════════════════════════════════════════════════
    // GENERATOR 2 — Gemini / Imagen 3 REST API
    // ════════════════════════════════════════════════════════════
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      // Try Imagen 3 first
      try {
        console.log('[Gen-2] Attempting Imagen 3 model...');
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instances: [{ prompt: finalPrompt }],
              parameters: {
                sampleCount: 1,
                outputMimeType: "image/jpeg",
                aspectRatio: selectedRatio === '1:1' ? '1:1' : selectedRatio === '16:9' ? '16:9' : selectedRatio === '4:3' ? '4:3' : selectedRatio === '3:4' ? '3:4' : selectedRatio === '9:16' ? '9:16' : '1:1'
              }
            }),
            signal: AbortSignal.timeout(45000)
          }
        );
        if (r.ok) {
          const d = await r.json();
          const base64Bytes = d?.predictions?.[0]?.bytesBase64Encoded || d?.predictions?.[0]?.image?.imageBytes;
          if (base64Bytes) {
            console.log('[Gen-2] ✅ Gemini Imagen 3 success!');
            return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${base64Bytes}` });
          }
        }
      } catch (e: any) {
        console.warn('[Gen-2] Imagen 3 failed:', e.message);
      }

      // Fallback to older generation preview models
      for (const model of [
        'gemini-2.0-flash-exp-image-generation',
        'gemini-2.0-flash-preview-image-generation',
        'gemini-2.5-flash-preview-05-20'
      ]) {
        try {
          const r = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: finalPrompt }] }],
                generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
              }),
              signal: AbortSignal.timeout(45000)
            }
          );
          if (r.ok) {
            const d = await r.json();
            for (const p of (d?.candidates?.[0]?.content?.parts || [])) {
              if (p.inlineData?.data) {
                console.log(`[Gen-2] ✅ Gemini ${model} success!`);
                return NextResponse.json({ imageUrl: `data:${p.inlineData.mimeType || 'image/png'};base64,${p.inlineData.data}` });
              }
            }
          }
        } catch (e: any) { /* continue to next model */ }
      }
    }

    // ════════════════════════════════════════════════════════════
    // GENERATOR 3 — Pollinations AI (direct URL — works in browser img tag)
    // Using flux model — most prompt-accurate, free, no key needed
    // ════════════════════════════════════════════════════════════
    const seed    = Math.floor(Math.random() * 9999999);
    const encoded = encodeURIComponent(finalPrompt.substring(0, 800));
    const fluxUrl = `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

    console.log('[Gen-3] ✅ Returning Pollinations Flux URL (prompt-accurate)');
    return NextResponse.json({ imageUrl: fluxUrl });

  } catch (error: any) {
    console.error('[ImageGen] Fatal:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
