const fs = require('fs');
const path = require('path');

// Mock request and response to test the API route directly
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const { POST } = require('../app/api/chat/route.ts');

async function testRoute() {
  console.log("=== Testing Next.js Chat Route ===");
  try {
    const mockReq = {
      json: async () => ({
        messages: [{ role: 'user', content: 'Hello' }]
      }),
      url: 'http://localhost:3000/api/chat'
    };

    const res = await POST(mockReq);
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response Data:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Route execution threw exception:", e);
  }
}

testRoute();
