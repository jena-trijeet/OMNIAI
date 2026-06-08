import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId = "EXAVITQu4vr4xnSDxMaL" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text parameter is required." }, { status: 400 });
    }

    // ElevenLabs API Key — must be set in .env.local as ELEVENLABS_API_KEY
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      console.warn("ElevenLabs API key not set. Returning 503 to trigger browser fallback.");
      return NextResponse.json(
        { error: "ElevenLabs API key not configured. Using browser synthesis fallback." },
        { status: 503 }
      );
    }

    console.log(`ElevenLabs TTS: Generating audio for "${text.slice(0, 40)}..." using Voice ID: ${voiceId}`);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs API failure:", errText);
      return NextResponse.json(
        { error: "ElevenLabs API failed.", details: errText },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
