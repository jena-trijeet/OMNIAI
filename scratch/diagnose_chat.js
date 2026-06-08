const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    const key = match[1];
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[key] = val;
  }
});

console.log("=== Testing Production n8n Webhook ===");
const prodUrl = "https://trijeet12.app.n8n.cloud/webhook/omniai-chat";
console.log("Production URL:", prodUrl);

async function testProd() {
  try {
    const res = await fetch(prodUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Hello", chatInput: "Hello", sessionId: "test-session" })
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log("Response:", text.slice(0, 500));
  } catch (e) {
    console.log("Error:", e.message);
  }
}

testProd();
