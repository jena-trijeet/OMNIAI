import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function speak(text: string, voiceType: 'male' | 'female' = 'male', onEnd?: () => void) {
  if (typeof window === 'undefined') return;
  
  const synth = window.speechSynthesis;
  
  const performSpeak = async () => {
    let cleanText = text.replace(/```[\s\S]*?```/g, '');

    // 2. Remove inline code backticks
    cleanText = cleanText.replace(/`([^`]+)`/g, '$1');

    // 3. Remove Markdown formatting symbols
    cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1');
    cleanText = cleanText.replace(/__([^_]+)__/g, '$1');
    cleanText = cleanText.replace(/_([^_]+)_/g, '$1');
    cleanText = cleanText.replace(/~~([^~]+)~~/g, '$1');
    cleanText = cleanText.replace(/^#+\s+/gm, '');
    cleanText = cleanText.replace(/^[\s]*[-*+]\s+/gm, '');
    cleanText = cleanText.replace(/^[\s]*\d+\.\s+/gm, '');
    cleanText = cleanText.replace(/^[\s]*>\s+/gm, '');
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    cleanText = cleanText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any active synthesis / audio
    synth.cancel();
    if ((window as any)._currentActiveAudio) {
      try { (window as any)._currentActiveAudio.pause(); } catch (e) {}
    }

    // ---------- Browser SpeechSynthesis fallback ----------
    const runLocalSynthesis = () => {
      console.log("🔊 Running browser speech synthesis...");

      const doSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = synth.getVoices();

        const chosen =
          voices.find(v => v.name.includes('(Natural)') && v.lang.startsWith('en')) ||
          voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('en')) ||
          voices.find(v => ['Microsoft David', 'Microsoft Mark', 'Microsoft Zira'].some(n => v.name.includes(n))) ||
          voices.find(v => v.lang.startsWith('en'));

        if (chosen) {
          utterance.voice = chosen;
          console.log("🔊 Voice selected:", chosen.name);
        }

        utterance.pitch  = voiceType === 'female' ? 1.15 : 0.95;
        utterance.rate   = 0.97;
        utterance.volume = 1.0;

        utterance.onend  = () => { if (onEnd) onEnd(); };
        utterance.onerror = (e) => { console.warn("SpeechSynthesis error:", e); if (onEnd) onEnd(); };

        synth.speak(utterance);

        // Chrome/Brave stall fix
        setTimeout(() => { if (synth.speaking && synth.paused) synth.resume(); }, 250);
      };

      if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = () => { synth.onvoiceschanged = null; doSpeak(); };
      } else {
        doSpeak();
      }
    };

    // ---------- Try ElevenLabs first ----------
    try {
      const voiceId = voiceType === 'female' ? 'EXAVITQu4vr4xnSDxMaL' : 'JBFqnCBsd6RMkjVDRZzb';
      console.log(`🎙️ Attempting ElevenLabs TTS via /api/tts with Voice ID: ${voiceId} (${voiceType})...`);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voiceId })
      });

      if (!response.ok) throw new Error(`TTS API returned ${response.status}`);

      const audioBlob = await response.blob();
      if (audioBlob.size < 100) throw new Error("Empty audio from TTS API.");

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => { URL.revokeObjectURL(audioUrl); if (onEnd) onEnd(); };
      audio.onerror = () => { URL.revokeObjectURL(audioUrl); runLocalSynthesis(); };
      (window as any)._currentActiveAudio = audio;

      await audio.play().catch(() => runLocalSynthesis());
      console.log("🔊 ElevenLabs audio playing!");
      return;

    } catch (err: any) {
      console.warn("ElevenLabs unavailable:", err.message, "→ browser synthesis.");
      runLocalSynthesis();
    }
  };

  performSpeak();
}

export function stopSpeaking() {
  if (typeof window === 'undefined') return;
  
  const synth = window.speechSynthesis;
  if (synth) {
    try {
      synth.cancel();
    } catch (e) {
      console.warn("Error canceling SpeechSynthesis:", e);
    }
  }
  
  if ((window as any)._currentActiveAudio) {
    try {
      (window as any)._currentActiveAudio.pause();
    } catch (e) {
      console.warn("Error pausing active audio:", e);
    }
  }
}

export async function generateImage(
  prompt: string,
  style: string = 'Realistic',
  aspectRatio: string = '1:1',
  resolution: string = 'HD'
): Promise<string> {
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

  const RESOLUTION_MODIFIERS: Record<string, string> = {
    'HD': 'high quality, 4k resolution, sharp focus, detailed',
    '2K': 'ultra high definition, 8k resolution, extremely detailed, masterwork, sharp focus',
    '4K': 'masterpiece, 8k resolution, flawless ultra-detailed textures, award-winning photography, hyper-detailed, sharp focus'
  };

  let imageUrl = '';
  let preloadSuccess = false;

  // Phase 1: Try server-side generation via Next.js backend
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt,
        style,
        aspectRatio,
        resolution
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.imageUrl) {
        imageUrl = data.imageUrl;
        console.log("[generateImage] Server returned image URL. Preloading...");
        const img = new globalThis.Image();
        img.src = imageUrl;
        preloadSuccess = await new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      }
    }
  } catch (err: any) {
    console.warn("[generateImage] Server-side generation failed:", err.message);
  }

  // Phase 2: Client-side Puter.js fallback
  if (!preloadSuccess || !imageUrl) {
    console.log("[generateImage] Attempting client-side image synthesis via Puter.js...");
    try {
      if (!(window as any).puter) {
        console.log("[Puter] Loading SDK dynamically...");
        const script = document.createElement("script");
        script.src = "https://js.puter.com/v2/";
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((res) => {
          script.onload = res;
          script.onerror = res;
        });
      }

      if (!(window as any).puter) {
        throw new Error("Puter SDK load failed");
      }

      const puter = (window as any).puter;
      const styleTag = STYLE_MODIFIERS[style] || STYLE_MODIFIERS['Realistic'];
      const resolutionTag = RESOLUTION_MODIFIERS[resolution] || RESOLUTION_MODIFIERS['HD'];
      const fullPrompt = `${prompt}, ${styleTag}, ${resolutionTag}`;
      
      console.log("[Puter] Synthesizing image client-side for prompt:", fullPrompt);
      let imgElement;
      try {
        console.log("[Puter] Trying model: dall-e-3 (high quality)...");
        imgElement = await puter.ai.txt2img(fullPrompt, { model: "dall-e-3", quality: "high" });
      } catch (e) {
        console.warn("[Puter] dall-e-3 failed, trying stable-diffusion-xl (high quality)...", e);
        try {
          imgElement = await puter.ai.txt2img(fullPrompt, { model: "stable-diffusion-xl", quality: "high" });
        } catch (e2) {
          console.warn("[Puter] stable-diffusion-xl failed, trying gpt-image-1-mini (high quality)...", e2);
          imgElement = await puter.ai.txt2img(fullPrompt, { model: "gpt-image-1-mini", quality: "high" });
        }
      }

      if (imgElement && imgElement.src) {
        console.log("[Puter] ✅ Client-side image ready");
        imageUrl = imgElement.src;
        preloadSuccess = true;
      } else {
        throw new Error("Puter did not return a valid image source");
      }
    } catch (err: any) {
      console.error("[generateImage] Puter.js client-side fallback failed:", err);
      throw new Error(`Image synthesis failed: ${err.message || err}`);
    }
  }

  if (preloadSuccess && imageUrl) {
    return imageUrl;
  }
  throw new Error("Image generation failed");
}



