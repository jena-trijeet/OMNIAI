import { NextResponse } from 'next/server';
import { saveWhatsAppRecipients } from '@/lib/db';

// Regex for phone validation (flexible for spaces, symbols, and international codes)
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,25}$/;

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
    const { campaignId, sheetUrl, phoneColumn = 'Phone', nameColumn = 'Name', mockType = 'customers' } = body;

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required.' }, { status: 400 });
    }

    let importedList: Array<{ name: string; phone: string; variables: Record<string, any> }> = [];

    if (mockType === 'leads') {
      importedList = [
        { name: 'Sarah Connor', phone: '+1 (555) 012-3456', variables: { company: 'Skynet', role: 'Lead Defender', city: 'Los Angeles' } },
        { name: 'Tony Stark', phone: '+1 (555) 987-6543', variables: { company: 'Stark Industries', role: 'Chief Architect', city: 'Malibu' } },
        { name: 'Bruce Wayne', phone: '+1 (555) 555-0199', variables: { company: 'Wayne Enterprises', role: 'Executive Officer', city: 'Gotham' } },
        { name: 'Clark Kent', phone: '+1 (555) 444-0100', variables: { company: 'Daily Planet', role: 'Senior Journalist', city: 'Metropolis' } },
        { name: 'Tony Stark', phone: '+1 (555) 987-6543', variables: { company: 'Stark Industries', role: 'Chief Architect', city: 'Malibu' } } // duplicate to check filter
      ];
    } else if (mockType === 'customers') {
      importedList = [
        { name: 'John Doe', phone: '+91 98765 43210', variables: { company: 'Nova Corp', tier: 'Enterprise', signup_date: '2026-01-15' } },
        { name: 'Alex Smith', phone: '+44 7911 123456', variables: { company: 'AeroTech', tier: 'Pro', signup_date: '2026-03-02' } },
        { name: 'Emma Watson', phone: '+1 (555) 302-0948', variables: { company: 'Quantum Leap', tier: 'Enterprise', signup_date: '2026-05-10' } },
        { name: 'John Doe', phone: '+91 98765 43210', variables: { company: 'Nova Corp', tier: 'Enterprise', signup_date: '2026-01-15' } }, // duplicate
        { name: 'Michael Jordan', phone: '+1 (555) 232-2323', variables: { company: 'Air Athletics', tier: 'Basic', signup_date: '2026-05-20' } },
        { name: 'Sophia Loren', phone: '+39 06 1234567', variables: { company: 'Bella Vista', tier: 'Pro', signup_date: '2026-05-22' } }
      ];
    } else {
      // Real Google Sheet Fetcher
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
          console.log(`WhatsApp Sheets Sync: Fetching from target URL: ${targetUrl}`);
          const fetchRes = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (OmniAI Sheets Import Engine)' }
          });
          
          if (!fetchRes.ok) {
            if (fetchRes.status === 401 || fetchRes.status === 403) {
              throw new Error("Access Denied (401/403). Make sure your Google Sheet is set to 'Anyone with the link can view' under the Share settings.");
            }
            throw new Error(`Endpoint responded with status ${fetchRes.status}`);
          }
          
          const rawText = await fetchRes.text();
          const cleanText = rawText.trim();
          
          let parsedSuccessfully = false;
          
          // Try JSON Parsing first (just in case)
          if (cleanText.startsWith('[') || cleanText.startsWith('{')) {
            try {
              const jsonData = JSON.parse(cleanText);
              const items = Array.isArray(jsonData) ? jsonData : (jsonData.data || jsonData.rows || jsonData.recipients || []);
              if (Array.isArray(items) && items.length > 0) {
                importedList = items.map((item: any) => {
                  const phone = String(item.phone || item.Phone || item.mobile || item.Mobile || item.tel || '');
                  const name = String(item.name || item.Name || item.contact || item.Contact || '');
                  
                  const variables: Record<string, any> = {};
                  Object.entries(item).forEach(([key, val]) => {
                    const lKey = key.toLowerCase();
                    if (lKey !== 'phone' && lKey !== 'name' && lKey !== 'mobile') {
                      variables[key.toLowerCase().replace(/[^a-z0-9_]/g, '_')] = val;
                    }
                  });
                  return {
                    name: name.trim(),
                    phone: phone.trim(),
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
              
              // Resolve Phone Column
              let phoneIdx = headers.findIndex(h => {
                const lh = h.toLowerCase();
                return lh.includes('phone') || lh.includes('mobile') || lh.includes('tel') || lh.includes('whatsapp') || lh.includes('num');
              });
              if (phoneIdx === -1) {
                for (let col = 0; col < headers.length; col++) {
                  const sample = rows.slice(1, 6).map(r => r[col] || '');
                  if (sample.some(val => /^[+\d]/.test(val.trim()) && val.replace(/[^\d]/g, '').length >= 7)) {
                    phoneIdx = col;
                    break;
                  }
                }
              }
              
              // Resolve Name Column
              let nameIdx = headers.findIndex(h => {
                const lh = h.toLowerCase();
                return lh.includes('name') || lh.includes('contact') || lh.includes('recipient');
              });
              if (nameIdx === -1) {
                nameIdx = phoneIdx === 0 ? 1 : 0;
              }
              
              const dataRows = rows.slice(1);
              importedList = dataRows.map(row => {
                const phone = row[phoneIdx] || '';
                const name = nameIdx !== -1 ? (row[nameIdx] || '') : '';
                
                const variables: Record<string, any> = {};
                headers.forEach((header, idx) => {
                  if (idx !== phoneIdx) {
                    const cleanKey = header.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '');
                    variables[cleanKey || `col_${idx}`] = row[idx] || '';
                  }
                });
                
                return {
                  name: name.replace(/^"|"$/g, '').trim(),
                  phone: phone.replace(/^"|"$/g, '').trim(),
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
        // Fallback default
        importedList = [
          { name: 'Alice Cooper', phone: '+1 (555) 888-0000', variables: { company: 'Rock Inc', custom_val: 'VIP' } },
          { name: 'Bob Marley', phone: '+1 (555) 777-1111', variables: { company: 'One Love', custom_val: 'Standard' } }
        ];
      }
    }

    const totalFound = importedList.length;
    
    // 1. Phone validation
    const validRecipients = importedList.filter(item => {
      if (!item.phone) return false;
      const cleanPhone = item.phone.trim();
      return PHONE_REGEX.test(cleanPhone) && cleanPhone.replace(/[^\d]/g, '').length >= 7;
    });

    const invalidCount = totalFound - validRecipients.length;

    // 2. Remove duplicates by normalized digits
    const uniqueMap = new Map<string, typeof validRecipients[0]>();
    validRecipients.forEach(item => {
      const digitsOnly = item.phone.replace(/[^\d]/g, '');
      if (!uniqueMap.has(digitsOnly)) {
        uniqueMap.set(digitsOnly, {
          name: item.name ? item.name.trim() : '',
          phone: item.phone.trim(),
          variables: item.variables || {}
        });
      }
    });

    const uniqueRecipients = Array.from(uniqueMap.values());
    const duplicatesCount = validRecipients.length - uniqueRecipients.length;

    // 3. Save to database
    const savedRecipients = await saveWhatsAppRecipients(campaignId, uniqueRecipients);

    return NextResponse.json({
      success: true,
      total_found: totalFound,
      total_imported: savedRecipients.length,
      invalid_emails: invalidCount, // naming kept consistent with frontend JSON expects
      duplicates_removed: duplicatesCount,
      recipients: savedRecipients
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
