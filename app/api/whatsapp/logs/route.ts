import { NextResponse } from 'next/server';
import { getWhatsAppLogs } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId') || undefined;
    const search = searchParams.get('search') || '';
    const exportFormat = searchParams.get('export');

    let logs = await getWhatsAppLogs(campaignId);

    // Apply search filter if specified
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l => 
        l.recipient_phone.toLowerCase().includes(q) || 
        (l.recipient_name && l.recipient_name.toLowerCase().includes(q)) || 
        l.message_body.toLowerCase().includes(q) ||
        (l.error_message && l.error_message.toLowerCase().includes(q))
      );
    }

    // Sort logs by sent_at descending (newest first)
    logs.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

    // Export as CSV if requested
    if (exportFormat === 'csv') {
      const headers = ['Log ID', 'Campaign ID', 'Recipient Phone', 'Recipient Name', 'Message Body', 'Buttons', 'Status', 'Error Message', 'Sent At'];
      
      const csvRows = [headers.join(',')];
      
      for (const log of logs) {
        const row = [
          log.id,
          log.campaign_id,
          `"${log.recipient_phone.replace(/"/g, '""')}"`,
          `"${(log.recipient_name || '').replace(/"/g, '""')}"`,
          `"${log.message_body.replace(/"/g, '""')}"`,
          `"${(log.buttons || []).join(' | ').replace(/"/g, '""')}"`,
          log.status,
          `"${(log.error_message || '').replace(/"/g, '""')}"`,
          log.sent_at
        ];
        csvRows.push(row.join(','));
      }
      
      const csvContent = csvRows.join('\n');
      
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=omniai_whatsapp_logs.csv',
        },
      });
    }

    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
