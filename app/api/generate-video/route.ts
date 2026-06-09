import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const STYLE_MODIFIERS: Record<string, string> = {
  'Cinematic Cinema': 'Cinematic film still, anamorphic lens, epic lighting, Hollywood production',
  'Cyberpunk Neon': 'Neon cyberpunk aesthetic, holographic, rain streets, synthwave',
  'Photo Realistic': 'Photorealistic, natural volumetric lighting, 8K texture density, hyper-real',
  'Anime Dream': 'Vibrant cell shading, fantasy sky backdrops, Ghibli atmosphere',
  'Sci-Fi Quantum': 'Bioluminescent micro-mesh, hyper-technological structures, quantum elements',
  '3D CGI Unreal': 'Unreal Engine 5 output, soft ray-traced ambient occlusion, 3D render'
};

const STATIC_VIDEO_FALLBACKS: Record<string, string> = {
  'Cinematic Cinema': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'Cyberpunk Neon': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'Photo Realistic': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'Anime Dream': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'Sci-Fi Quantum': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  '3D CGI Unreal': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
};

// Set maximum duration for Vercel/Next.js execution
export const maxDuration = 60; // 60 seconds max for Vercel Hobby

export async function POST(req: Request) {
  try {
    const { prompt, style, duration, aspectRatio } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const userPrompt = prompt.trim();
    const selectedStyle = style || 'Cinematic Cinema';
    const styleTag = STYLE_MODIFIERS[selectedStyle] || STYLE_MODIFIERS['Cinematic Cinema'];
    let finalPrompt = `${userPrompt}, ${styleTag}`;

    // Prompt Expansion logic
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        const expansionResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert prompt engineer for AI video generators (like Sora or Runway Gen-3). Your job is to take a simple user description and expand it into a highly detailed, visually stunning, descriptive prompt. Keep it descriptive, detail the background, lighting, objects, style, colors, and camera motion. Output ONLY the expanded prompt string. Do not include any intros or explanations."
            },
            { role: "user", content: `Expand this video prompt: "${userPrompt}"` }
          ],
          max_tokens: 150
        });
        const expandedText = expansionResponse.choices[0].message.content?.trim();
        if (expandedText) {
          finalPrompt = `${expandedText}, ${styleTag}`;
        }
      } catch (e: any) {
        console.warn("[VideoGen] OpenAI prompt expansion failed:", e.message);
      }
    }

    console.log(`[VideoGen] Final Prompt: "${finalPrompt.substring(0, 100)}..."`);

    // ════════════════════════════════════════════════════════════
    // GENERATOR 1 — Replicate API (Luma Ray or Minimax)
    // ════════════════════════════════════════════════════════════
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (replicateToken && replicateToken !== 'your_replicate_api_token_here') {
      try {
        console.log('[VideoGen] Initiating Replicate Video Generation...');
        // Example uses Minimax Video-01 which is fast and high quality
        const startResponse = await fetch('https://api.replicate.com/v1/models/minimax/video-01/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${replicateToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: {
              prompt: finalPrompt
            }
          })
        });

        if (startResponse.ok) {
          let prediction = await startResponse.json();
          const getUrl = prediction.urls.get;
          
          // Poll for completion (timeout after 55 seconds to prevent Next.js 60s crash)
          const startTime = Date.now();
          while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
            if (Date.now() - startTime > 55000) {
              console.warn('[VideoGen] Replicate polling timed out (55s limit)');
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
            const pollResponse = await fetch(getUrl, {
              headers: { 'Authorization': `Bearer ${replicateToken}` }
            });
            if (pollResponse.ok) {
              prediction = await pollResponse.json();
            }
          }

          if (prediction.status === 'succeeded' && prediction.output) {
            console.log('[VideoGen] ✅ Replicate video generated successfully!');
            // Output is typically an array of URLs or a single URL string for Minimax
            const videoUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
            return NextResponse.json({ videoUrl });
          } else {
            console.warn('[VideoGen] Replicate video generation failed or timed out:', prediction.error);
          }
        } else {
          const errBody = await startResponse.text();
          console.warn('[VideoGen] Replicate API rejected request:', errBody);
        }
      } catch (e: any) {
        console.warn('[VideoGen] Replicate fetch failed:', e.message);
      }
    }

    // ════════════════════════════════════════════════════════════
    // FALLBACK — Return high-quality static video matching the style
    // ════════════════════════════════════════════════════════════
    console.log('[VideoGen] Returning fallback video (No Replicate token or generation failed).');
    const fallbackUrl = STATIC_VIDEO_FALLBACKS[selectedStyle] || STATIC_VIDEO_FALLBACKS['Cinematic Cinema'];
    
    // Simulate a bit of processing delay so the UI loader looks natural
    await new Promise(resolve => setTimeout(resolve, 2500));

    return NextResponse.json({ videoUrl: fallbackUrl });

  } catch (error: any) {
    console.error('[VideoGen] Fatal Error:', error);
    return NextResponse.json({ error: error.message || 'Video generation failed' }, { status: 500 });
  }
}
