import { NextResponse } from 'next/server';
import { 
  getCampaigns, 
  getCampaign, 
  saveCampaign, 
  deleteCampaign, 
  getRecipients, 
  saveSingleRecipient, 
  deleteRecipient 
} from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const campaign = await getCampaign(id);
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 });
      }
      const recipients = await getRecipients(id);
      return NextResponse.json({ campaign, recipients });
    }

    const campaigns = await getCampaigns();
    return NextResponse.json({ campaigns });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, name, subject, body: emailBody, signature, status, scheduled_at } = body;

    // Manual Recipient Add Action
    if (action === 'add_recipient') {
      const { campaignId, name: recName, email: recEmail, variables = {} } = body;
      if (!campaignId || !recEmail) {
        return NextResponse.json({ error: 'campaignId and email are required.' }, { status: 400 });
      }
      const newRec = await saveSingleRecipient({
        campaign_id: campaignId,
        name: recName,
        email: recEmail,
        variables,
        status: 'Pending'
      });
      return NextResponse.json({ success: true, recipient: newRec });
    }

    // Default Campaign Create/Update Action
    if (!name || !subject || !emailBody) {
      return NextResponse.json({ error: 'name, subject, and body are required to save a campaign.' }, { status: 400 });
    }

    const campaignData = {
      id,
      name,
      subject,
      body: emailBody,
      signature: signature || '',
      status: (status || 'Draft') as any,
      scheduled_at: scheduled_at || null,
      total_emails: body.total_emails || 0,
      sent_emails: body.sent_emails || 0,
      failed_emails: body.failed_emails || 0,
      pending_emails: body.pending_emails || 0
    };

    const saved = await saveCampaign(campaignData);
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
      await deleteRecipient(recipientId);
      return NextResponse.json({ success: true, message: 'Recipient removed.' });
    }

    if (campaignId) {
      await deleteCampaign(campaignId);
      return NextResponse.json({ success: true, message: 'Campaign deleted.' });
    }

    return NextResponse.json({ error: 'id (campaign) or recipientId parameter is required.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
