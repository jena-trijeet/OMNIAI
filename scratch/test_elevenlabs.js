const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

async function testElevenLabs() {
  try {
    const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Sarah
    console.log(`ElevenLabs TTS: Generating audio with Voice ID: ${voiceId}`);
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: "Calibrating premium audio synthesis. System online.",
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    console.log(`ElevenLabs Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      console.log(`Success! Generated audio buffer of size: ${audioBuffer.byteLength} bytes.`);
    } else {
      const errText = await response.text();
      console.error("ElevenLabs Error response:", errText);
    }
  } catch (e) {
    console.error("Connection Error:", e.message);
  }
}

testElevenLabs();
