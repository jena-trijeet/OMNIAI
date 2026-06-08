import { NextResponse } from 'next/server';
import { 
  getWhatsAppCampaign, 
  getWhatsAppRecipients, 
  saveWhatsAppCampaign, 
  updateWhatsAppRecipientStatus, 
  addWhatsAppLog
} from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { campaignId } = body;

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required.' }, { status: 400 });
    }

    const campaign = await getWhatsAppCampaign(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'WhatsApp Campaign not found.' }, { status: 404 });
    }

    const recipients = await getWhatsAppRecipients(campaignId);
    const pendingRecipients = recipients.filter(r => r.status === 'Pending' || r.status === 'Failed');

    if (pendingRecipients.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No pending or failed recipients to send to.' 
      });
    }

    // Update campaign status to "Sending"
    campaign.status = 'Sending';
    campaign.total_messages = recipients.length;
    campaign.pending_messages = pendingRecipients.length;
    await saveCampaignMetrics(campaign);

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';

    const isTwilioConfigured = !!(
      accountSid &&
      authToken &&
      accountSid !== 'your-twilio-account-sid' &&
      authToken !== 'your-twilio-auth-token'
    );

    // Run the broadcast queue in the background
    const runBroadcast = async () => {
      let sentCount = campaign.sent_messages;
      let failedCount = campaign.failed_messages;
      let pendingCount = pendingRecipients.length;

      for (const recipient of pendingRecipients) {
        // Substitute variables
        let personalizedBody = campaign.template;
        personalizedBody = personalizedBody.replace(/\{\{\s*name\s*\}\}/gi, recipient.name || '');
        personalizedBody = personalizedBody.replace(/\{\{\s*phone\s*\}\}/gi, recipient.phone || '');

        // Additional custom variables
        Object.entries(recipient.variables || {}).forEach(([key, val]) => {
          const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
          personalizedBody = personalizedBody.replace(regex, String(val));
        });

        let success = true;
        let errorMsg = '';

        if (isTwilioConfigured) {
          try {
            // Clean up destination phone number to make sure it's E.164.
            let toPhone = recipient.phone.trim();
            toPhone = toPhone.replace(/[\s\-()]/g, '');
            if (!toPhone.startsWith('whatsapp:')) {
              if (!toPhone.startsWith('+')) {
                toPhone = '+' + toPhone;
              }
              toPhone = `whatsapp:${toPhone}`;
            }

            // Clean up sender phone number
            let fromPhone = twilioNumber.trim();
            if (!fromPhone.startsWith('whatsapp:')) {
              fromPhone = fromPhone.replace(/[\s\-()]/g, '');
              if (!fromPhone.startsWith('+')) {
                fromPhone = '+' + fromPhone;
              }
              fromPhone = `whatsapp:${fromPhone}`;
            }

            const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
            const authString = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

            const params = new URLSearchParams();
            params.append('To', toPhone);
            params.append('From', fromPhone);
            params.append('Body', personalizedBody);

            const twilioRes = await fetch(url, {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: params.toString(),
            });

            if (!twilioRes.ok) {
              const errData = await twilioRes.json();
              success = false;
              errorMsg = errData.message || `Twilio error status ${twilioRes.status}`;
            }
          } catch (e: any) {
            success = false;
            errorMsg = e.message || 'Twilio connection failed.';
          }
        } else {
          // Simulate network latency (e.g. 350ms)
          await new Promise(resolve => setTimeout(resolve, 350));

          // Simulate random carrier delivery failures (e.g. 6%)
          // Also fail if number contains '9999' (test trigger)
          const isFailingNumber = recipient.phone.includes('9999');
          const randomFailure = Math.random() < 0.06;

          if (isFailingNumber || randomFailure) {
            success = false;
            errorMsg = isFailingNumber 
              ? 'Carrier reject: Invalid destination handset node.' 
              : 'GatewayTimeout: Handset unreachable or disconnected.';
          }
        }

        if (success) {
          await updateWhatsAppRecipientStatus(recipient.id, 'Sent');
          await addWhatsAppLog({
            campaign_id: campaignId,
            recipient_phone: recipient.phone,
            recipient_name: recipient.name || '',
            message_body: personalizedBody,
            buttons: campaign.buttons || [],
            status: 'Success'
          });
          sentCount++;
        } else {
          await updateWhatsAppRecipientStatus(recipient.id, 'Failed', errorMsg);
          await addWhatsAppLog({
            campaign_id: campaignId,
            recipient_phone: recipient.phone,
            recipient_name: recipient.name || '',
            message_body: personalizedBody,
            buttons: campaign.buttons || [],
            status: 'Failed',
            error_message: errorMsg
          });
          failedCount++;
        }

        pendingCount--;

        // Update campaign state in db file
        const currentCampaign = await getWhatsAppCampaign(campaignId);
        if (currentCampaign) {
          currentCampaign.sent_messages = sentCount;
          currentCampaign.failed_messages = failedCount;
          currentCampaign.pending_messages = pendingCount;
          
          if (pendingCount === 0) {
            currentCampaign.status = failedCount === currentCampaign.total_messages ? 'Failed' : 'Completed';
          }
          await saveCampaignMetrics(currentCampaign);
        }
      }
    };

    runBroadcast().catch(err => {
      console.error('WhatsApp background broadcast failed:', err);
    });

    return NextResponse.json({
      success: true,
      message: `WhatsApp campaign broadcast initiated in background. Processing ${pendingRecipients.length} nodes.`,
      campaign: {
        ...campaign,
        status: 'Sending'
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper to save metrics safely using saveWhatsAppCampaign
async function saveCampaignMetrics(campaign: any) {
  await saveWhatsAppCampaign(campaign);
}
