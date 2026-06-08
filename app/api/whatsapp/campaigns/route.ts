import { NextResponse } from 'next/server';
import { 
  getWhatsAppCampaigns, 
  getWhatsAppCampaign, 
  saveWhatsAppCampaign, 
  deleteWhatsAppCampaign, 
  getWhatsAppRecipients, 
  saveSingleWhatsAppRecipient, 
  deleteWhatsAppRecipient 
} from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || '';

    const twilioConfigured = !!(
      accountSid &&
      authToken &&
      accountSid !== 'your-twilio-account-sid' &&
      authToken !== 'your-twilio-auth-token'
    );

    if (id) {
      const campaign = await getWhatsAppCampaign(id);
      if (!campaign) {
        return NextResponse.json({ error: 'WhatsApp Campaign not found.' }, { status: 404 });
      }
      const recipients = await getWhatsAppRecipients(id);
      return NextResponse.json({ 
        campaign, 
        recipients,
        twilio_configured: twilioConfigured,
        twilio_number: twilioNumber
      });
    }

    const campaigns = await getWhatsAppCampaigns();
    return NextResponse.json({ 
      campaigns,
      twilio_configured: twilioConfigured,
      twilio_number: twilioNumber
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, name, template, buttons, status, scheduled_at } = body;

    // Manual Recipient Add Action
    if (action === 'add_recipient') {
      const { campaignId, name: recName, phone: recPhone, variables = {} } = body;
      if (!campaignId || !recPhone) {
        return NextResponse.json({ error: 'campaignId and phone number are required.' }, { status: 400 });
      }
      const newRec = await saveSingleWhatsAppRecipient({
        campaign_id: campaignId,
        name: recName,
        phone: recPhone,
        variables,
        status: 'Pending'
      });
      return NextResponse.json({ success: true, recipient: newRec });
    }

    // Default Campaign Create/Update Action
    if (!name || !template) {
      return NextResponse.json({ error: 'name and template are required to save a WhatsApp campaign.' }, { status: 400 });
    }

    const campaignData = {
      id,
      name,
      template,
      buttons: buttons || [],
      status: (status || 'Draft') as any,
      scheduled_at: scheduled_at || null,
      total_messages: body.total_messages || 0,
      sent_messages: body.sent_messages || 0,
      failed_messages: body.failed_messages || 0,
      pending_messages: body.pending_messages || 0
    };

    const saved = await saveWhatsAppCampaign(campaignData);
    return NextResponse.json({ success: true, campaign: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('id');
    const recipientId = searchParams.get('recipientId');

    if (recipientId) {
      await deleteWhatsAppRecipient(recipientId);
      return NextResponse.json({ success: true, message: 'Recipient removed.' });
    }

    if (campaignId) {
      await deleteWhatsAppCampaign(campaignId);
      return NextResponse.json({ success: true, message: 'WhatsApp Campaign deleted.' });
    }

    return NextResponse.json({ error: 'id (campaign) or recipientId parameter is required.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
