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

async function getVoices() {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": env.ELEVENLABS_API_KEY }
    });
    console.log(`Voices Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (res.ok) {
      console.log("\n=== Available Voices on your account ===");
      const available = data.voices || [];
      available.slice(0, 10).forEach(v => {
        console.log(`- Name: ${v.name} | Voice ID: ${v.voice_id} | Category: ${v.category}`);
      });
    } else {
      console.log("Error:", data);
    }
  } catch (e) {
    console.error(e.message);
  }
}

getVoices();
