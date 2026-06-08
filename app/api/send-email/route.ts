import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { addLog } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const bodyPayload = await req.json();
    const { 
      type, 
      name, 
      email, 
      phone, 
      itemName, 
      date, 
      time, 
      guests, 
      notes, 
      paymentMethod,
      hotelSuite,
      endDate,
      subject,
      body
    } = bodyPayload;

    if (!email) {
      return NextResponse.json({ error: "Email is required to dispatch confirmation protocols." }, { status: 400 });
    }

    if (type === 'raw') {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || `"OMNIAI Core Hub" <${smtpUser}>`;

      let emailSentRealWorld = false;
      let mailError = "";

      if (smtpHost && smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          });

          await transporter.sendMail({
            from: smtpFrom,
            to: email,
            subject: subject || "OMNIAI Outbound Message",
            text: body ? body.replace(/<[^>]*>/g, '') : '',
            html: body
          });

          emailSentRealWorld = true;
        } catch (err: any) {
          mailError = err.message;
        }
      }

      if (emailSentRealWorld) {
        try {
          await addLog({
            campaign_id: 'ai-writer',
            recipient_email: email,
            subject: subject || "OMNIAI Outbound Message",
            body: body || "",
            status: 'Success'
          });
        } catch (logErr) {}

        return NextResponse.json({ 
          success: true, 
          delivered: true, 
          message: `Outbound email delivered successfully to ${email}!` 
        });
      } else {
        try {
          await addLog({
            campaign_id: 'ai-writer',
            recipient_email: email,
            subject: subject || "OMNIAI Outbound Message",
            body: body || "",
            status: 'Failed',
            error_message: mailError || 'Simulation Mode (No SMTP credentials defined in .env.local)'
          });
        } catch (logErr) {}

        return NextResponse.json({ 
          success: true, 
          delivered: false, 
          message: `Outbound email transmission simulated successfully. Define SMTP credentials in .env.local for live delivery.`,
          details: mailError
        });
      }
    }

    const transactionHash = `TXN-OMNI-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const isHotel = type === 'hotel';

    // Build futuristic, premium HTML email template
    const htmlEmailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OMNIAI Booking Confirmation</title>
  <style>
    body {
      background-color: #04050e;
      color: #cbd5e1;
      font-family: 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 40px 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #0a0b1c;
      border: 1px solid rgba(0, 209, 255, 0.15);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 209, 255, 0.05);
    }
    .header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
      margin-bottom: 30px;
      text-align: center;
    }
    .logo {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #00d1ff;
      margin: 0 0 8px 0;
    }
    .subtitle {
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #64748b;
      text-transform: uppercase;
    }
    .headline {
      font-size: 22px;
      font-weight: 900;
      color: #ffffff;
      margin: 20px 0 10px 0;
      letter-spacing: 1px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 99px;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 10px;
      background-color: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.25);
      color: #4ade80;
    }
    .grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 20px;
      margin: 30px 0;
    }
    .grid-item {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      padding: 16px;
      border-radius: 16px;
    }
    .label {
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .value {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
    }
    .notes-box {
      background: rgba(139, 92, 246, 0.03);
      border: 1px solid rgba(139, 92, 246, 0.1);
      padding: 20px;
      border-radius: 16px;
      margin: 30px 0;
    }
    .notes-title {
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #a78bfa;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .notes-content {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.6;
      color: #cbd5e1;
    }
    .footer {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 24px;
      margin-top: 30px;
      text-align: center;
      font-size: 9px;
      font-weight: 600;
      color: #475569;
      letter-spacing: 1px;
    }
    .hash {
      font-family: monospace;
      color: #00d1ff;
      font-weight: 700;
      background: rgba(0, 209, 255, 0.05);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">OMNIAI SYSTEM GATEWAY</div>
      <div class="subtitle">Secure Outbound Mail Terminal</div>
    </div>
    
    <div style="text-align: center;">
      <div class="headline">Booking Synchronization Complete</div>
      <p style="font-size: 12px; color: #94a3b8; margin: 0 0 15px 0;">Hi ${name}, your luxury reservation has been locked into the secure database grid.</p>
      <div class="status-badge">Locked & Confirmed</div>
    </div>
    
    <div class="grid">
      <div class="grid-item">
        <div class="label">Secure Client</div>
        <div class="value">${name}</div>
      </div>
      <div class="grid-item">
        <div class="label">Communication Vector</div>
        <div class="value">${phone}</div>
      </div>
      <div class="grid-item" style="grid-column: span 2;">
        <div class="label">Client Email Node</div>
        <div class="value" style="color: #00d1ff;">${email}</div>
      </div>
      <div class="grid-item">
        <div class="label">Target Venue / Resort</div>
        <div class="value">${itemName}</div>
      </div>
      <div class="grid-item">
        <div class="label">Booking Type</div>
        <div class="value" style="text-transform: uppercase;">${type} Booking</div>
      </div>
      
      ${isHotel ? `
        <div class="grid-item">
          <div class="label">Lodging Suite</div>
          <div class="value">${hotelSuite}</div>
        </div>
        <div class="grid-item">
          <div class="label">Stay Duration</div>
          <div class="value">${date} to ${endDate}</div>
        </div>
      ` : `
        <div class="grid-item">
          <div class="label">Schedule Coordinates</div>
          <div class="value">${date} @ ${time} PM</div>
        </div>
        <div class="grid-item">
          <div class="label">Party/Guest Density</div>
          <div class="value">${guests} Guests</div>
        </div>
      `}
      
      <div class="grid-item" style="grid-column: span 2;">
        <div class="label">Payment Protocol</div>
        <div class="value" style="color: #4ade80; text-transform: uppercase;">
          ${paymentMethod === 'upi' ? 'Direct UPI Transfer (Confirmed)' : isHotel ? 'Cash / POS Card On Arrival' : 'Verified Seat'}
        </div>
      </div>
    </div>
    
    ${notes ? `
      <div class="notes-box">
        <div class="notes-title">AI Custom Directives / Requests</div>
        <div class="notes-content">"${notes}"</div>
      </div>
    ` : ''}
    
    <div style="text-align: center; margin: 30px 0 10px 0;">
      <div class="label" style="margin-bottom: 8px;">Quantum Transaction Signature</div>
      <span class="hash">${transactionHash}</span>
    </div>
    
    <div class="footer">
      This is a secure automated notification dispatched by the OMNIAI Neural Hub. <br/>
      System Node ID: fa0ea7a1-7c82-486d-ba76-dc7c3ffa63ec. All connections are encrypted.
    </div>
  </div>
</body>
</html>
    `;

    // 1. Trigger outgoing query to n8n email sync node (optional workflow setup)
    const n8nEmailWebhookUrl = "https://trijeet12.app.n8n.cloud/webhook-test/omniai-email";
    try {
      fetch(n8nEmailWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name,
          email,
          phone,
          itemName,
          date,
          time,
          guests,
          notes,
          paymentMethod,
          hotelSuite,
          endDate,
          transactionHash,
          htmlBody: htmlEmailBody
        })
      }).catch(() => {});
    } catch(e) {}

    // 2. Check for active SMTP configurations in .env.local
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"OMNIAI Core Hub" <${smtpUser}>`;

    let emailSentRealWorld = false;
    let mailError = "";

    if (smtpHost && smtpUser && smtpPass) {
      try {
        console.log(`Neural Uplink: Direct SMTP send initiated via ${smtpHost}:${smtpPort}...`);
        
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for 587/other
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: `[SECURED] OMNIAI Booking Confirmation: ${itemName}`,
          html: htmlEmailBody
        });

        console.log(`[SMTP Secure Sync Successful]: Outbound mail delivered directly to ${email}.`);
        emailSentRealWorld = true;
      } catch (err: any) {
        console.error("Direct SMTP Outbound Mail Dispatch Failed:", err.message);
        mailError = err.message;
      }
    }

    // Print to the Next.js dev server terminal standard logs
    console.log(`
=============================================================================
             📧 OMNIAI SYNAPSE MAIL TERMINAL - OUTBOUND TRANSMISSION 📧
=============================================================================
[Timestamp]   : ${new Date().toISOString()}
[Client Email]: ${email}
[Client Name] : ${name}
[Venue]       : ${itemName}
[Subject]     : [SECURED] OMNIAI Booking Protocol: ${itemName}
[Signature]   : ${transactionHash}
[Real Sent]   : ${emailSentRealWorld ? "YES (SMTP Delivered)" : "NO (Simulation Only)"}
${mailError ? `[SMTP Error]  : ${mailError}` : ""}
-----------------------------------------------------------------------------
HTML E-MAIL SOURCE SYNTHESIZED SUCCESSFULLY:
${htmlEmailBody}
=============================================================================
    `);

    if (emailSentRealWorld) {
      return NextResponse.json({ 
        success: true, 
        delivered: true,
        message: `Secure booking confirmation email has been dispatched and delivered to your inbox at ${email}!`,
        transactionHash 
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        delivered: false,
        message: `Outbound email simulated successfully. To deliver actual emails to your real-world mailbox, please define SMTP environment variables in your .env.local file.`,
        transactionHash,
        setupGuide: {
          step1: "Add SMTP credentials to your omniai/.env.local file:",
          variables: [
            "SMTP_HOST=smtp.gmail.com (or your SMTP host)",
            "SMTP_PORT=587 (or 465)",
            "SMTP_USER=your-email@gmail.com",
            "SMTP_PASS=your-gmail-app-password (or credentials)",
            "SMTP_FROM=\"OMNIAI Hub\" <your-email@gmail.com>"
          ],
          step2: "Save and reload. Next time you book, a real email will land in your mailbox instantly!"
        }
      });
    }

  } catch (err: any) {
    console.error("[Email Sync compilation failed]:", err);
    return NextResponse.json({ error: "System fault compiles email dispatch.", details: err.message }, { status: 500 });
  }
}
