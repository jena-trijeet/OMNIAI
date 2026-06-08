import { NextResponse } from 'next/server';
import { saveRecipients } from '@/lib/db';

// Regex for email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple CSV parser supporting double quotes
function parseCsv(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/);
  const result: string[][] = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const row: string[] = [];
    let insideQuote = false;
    let current = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    result.push(row);
  }
  
  return result;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaignId, sheetUrl, emailColumn = 'Email', nameColumn = 'Name', mockType = 'customers' } = body;

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required.' }, { status: 400 });
    }

    // Generate/import lists based on input or mock settings
    let importedList: Array<{ name: string; email: string; variables: Record<string, any> }> = [];

    if (mockType === 'leads') {
      importedList = [
        { name: 'Sarah Connor', email: 'sarah.connor@cyberdyne.io', variables: { company: 'Skynet', role: 'Lead Defender', city: 'Los Angeles' } },
        { name: 'Tony Stark', email: 'tony@starkindustries.com', variables: { company: 'Stark Industries', role: 'Chief Architect', city: 'Malibu' } },
        { name: 'Bruce Wayne', email: 'bruce@waynecorp.org', variables: { company: 'Wayne Enterprises', role: 'Executive Officer', city: 'Gotham' } },
        { name: 'Clark Kent', email: 'clark@dailyplanet.com', variables: { company: 'Daily Planet', role: 'Senior Journalist', city: 'Metropolis' } },
        { name: 'Tony Stark', email: 'tony@starkindustries.com', variables: { company: 'Stark Industries', role: 'Chief Architect', city: 'Malibu' } } // intentional duplicate to test filter
      ];
    } else if (mockType === 'customers') {
      importedList = [
        { name: 'John Doe', email: 'john.doe@gmail.com', variables: { company: 'Nova Corp', tier: 'Enterprise', signup_date: '2026-01-15' } },
        { name: 'Alex Smith', email: 'alex.smith@example.com', variables: { company: 'AeroTech', tier: 'Pro', signup_date: '2026-03-02' } },
        { name: 'Emma Watson', email: 'emma.watson@gmail.com', variables: { company: 'Quantum Leap', tier: 'Enterprise', signup_date: '2026-05-10' } },
        { name: 'John Doe', email: 'john.doe@gmail.com', variables: { company: 'Nova Corp', tier: 'Enterprise', signup_date: '2026-01-15' } }, // intentional duplicate
        { name: 'Michael Jordan', email: 'michael.jordan@sports.com', variables: { company: 'Air Athletics', tier: 'Basic', signup_date: '2026-05-20' } },
        { name: 'Sophia Loren', email: 'sophia.loren@cinema.it', variables: { company: 'Bella Vista', tier: 'Pro', signup_date: '2026-05-22' } }
      ];
    } else {
      // Real Google Sheet or script.google.com or generic URL Fetcher
      if (sheetUrl && sheetUrl.startsWith('http')) {
        let targetUrl = sheetUrl;
        const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (sheetIdMatch) {
          const sheetId = sheetIdMatch[1];
          targetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
          
          // Check for gid parameter in URL (either in query string or hash)
          const gidMatch = sheetUrl.match(/[?&]gid=([0-9]+)/);
          if (gidMatch) {
            targetUrl += `&gid=${gidMatch[1]}`;
          }
        }

        try {
          console.log(`Sheets Integration: Fetching from target URL: ${targetUrl}`);
          const fetchRes = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (OmniAI Sheets Import Engine)' }
          });
          
          if (!fetchRes.ok) {
            if (fetchRes.status === 401 || fetchRes.status === 403) {
              throw new Error("Access Denied (401/403). Make sure your Google Sheet is set to 'Anyone with the link can view' under the Share settings, or that your Web App is public.");
            }
            throw new Error(`Endpoint responded with status ${fetchRes.status}`);
          }
          
          const rawText = await fetchRes.text();
          const cleanText = rawText.trim();
          
          let parsedSuccessfully = false;
          
          // Try JSON Parsing first
          if (cleanText.startsWith('[') || cleanText.startsWith('{')) {
            try {
              const jsonData = JSON.parse(cleanText);
              const items = Array.isArray(jsonData) ? jsonData : (jsonData.data || jsonData.rows || jsonData.recipients || []);
              if (Array.isArray(items) && items.length > 0) {
                importedList = items.map((item: any) => {
                  const email = String(item.email || item.Email || item.mail || item.Mail || '');
                  const name = String(item.name || item.Name || item.contact || item.Contact || '');
                  
                  const variables: Record<string, any> = {};
                  Object.entries(item).forEach(([key, val]) => {
                    const lKey = key.toLowerCase();
                    if (lKey !== 'email' && lKey !== 'name' && lKey !== 'mail') {
                      variables[key.toLowerCase().replace(/[^a-z0-9_]/g, '_')] = val;
                    }
                  });
                  return {
                    name: name.trim(),
                    email: email.trim(),
                    variables
                  };
                });
                parsedSuccessfully = true;
              }
            } catch (jsonErr) {
              console.log("JSON parsing fallback, trying CSV", jsonErr);
            }
          }
          
          // Try CSV Parsing
          if (!parsedSuccessfully) {
            const rows = parseCsv(rawText);
            
            if (rows.length > 1) {
              const headers = rows[0].map(h => h.replace(/^"|"$/g, '').trim());
              
              // Resolve Email Column
              let emailIdx = headers.findIndex(h => h.toLowerCase().includes('email') || h.toLowerCase().includes('mail'));
              if (emailIdx === -1) {
                for (let col = 0; col < headers.length; col++) {
                  const sample = rows.slice(1, 6).map(r => r[col] || '');
                  if (sample.some(val => val.includes('@'))) {
                    emailIdx = col;
                    break;
                  }
                }
              }
              
              // Resolve Name Column
              let nameIdx = headers.findIndex(h => h.toLowerCase().includes('name') || h.toLowerCase().includes('contact') || h.toLowerCase().includes('recipient'));
              if (nameIdx === -1) {
                nameIdx = emailIdx === 0 ? 1 : 0;
              }
              
              const dataRows = rows.slice(1);
              importedList = dataRows.map(row => {
                const email = row[emailIdx] || '';
                const name = nameIdx !== -1 ? (row[nameIdx] || '') : '';
                
                const variables: Record<string, any> = {};
                headers.forEach((header, idx) => {
                  if (idx !== emailIdx) {
                    const cleanKey = header.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '');
                    variables[cleanKey || `col_${idx}`] = row[idx] || '';
                  }
                });
                
                return {
                  name: name.replace(/^"|"$/g, '').trim(),
                  email: email.replace(/^"|"$/g, '').trim(),
                  variables
                };
              });
              parsedSuccessfully = true;
            } else {
              throw new Error('Spreadsheet content appears to be empty or missing rows.');
            }
          }
        } catch (fetchErr: any) {
          console.error('Real Google Sheets fetch failure:', fetchErr);
          return NextResponse.json({ 
            error: `Failed to import spreadsheet data: ${fetchErr.message}. Make sure your sheet or endpoint is active and public.` 
          }, { status: 400 });
        }
      } else {
        // Mock fallback if URL not supplied
        importedList = [
          { name: 'Alice Cooper', email: 'alice@rock.com', variables: { company: 'Rock Inc', custom_val: 'VIP' } },
          { name: 'Bob Marley', email: 'bob@reggae.org', variables: { company: 'One Love', custom_val: 'Standard' } },
          { name: 'Charlie Chaplin', email: 'charlie@silentfilm.net', variables: { company: 'United Artists', custom_val: 'VIP' } },
          { name: 'Bob Marley', email: 'bob@reggae.org', variables: { company: 'One Love', custom_val: 'Standard' } } // duplicate
        ];
      }
    }

    // Process variables mapping depending on configured columns if any
    const totalFound = importedList.length;
    
    // 1. Email validation
    const validRecipients = importedList.filter(item => {
      if (!item.email) return false;
      return EMAIL_REGEX.test(item.email.trim());
    });

    const invalidCount = totalFound - validRecipients.length;

    // 2. Remove duplicate emails
    const uniqueMap = new Map<string, typeof validRecipients[0]>();
    validRecipients.forEach(item => {
      const cleanEmail = item.email.trim().toLowerCase();
      if (!uniqueMap.has(cleanEmail)) {
        uniqueMap.set(cleanEmail, {
          name: item.name ? item.name.trim() : '',
          email: cleanEmail,
          variables: item.variables || {}
        });
      }
    });

    const uniqueRecipients = Array.from(uniqueMap.values());
    const duplicatesCount = validRecipients.length - uniqueRecipients.length;

    // 3. Save to database
    const savedRecipients = await saveRecipients(campaignId, uniqueRecipients);

    return NextResponse.json({
      success: true,
      total_found: totalFound,
      total_imported: savedRecipients.length,
      invalid_emails: invalidCount,
      duplicates_removed: duplicatesCount,
      recipients: savedRecipients
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
