import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId') || undefined;
    const search = searchParams.get('search') || '';
    const exportFormat = searchParams.get('export');

    let logs = await getLogs(campaignId);

    // Apply search filter if specified
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l => 
        l.recipient_email.toLowerCase().includes(q) || 
        l.subject.toLowerCase().includes(q) ||
        (l.error_message && l.error_message.toLowerCase().includes(q))
      );
    }

    // Sort logs by sent_at descending (newest first)
    logs.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

    // Export as CSV if requested
    if (exportFormat === 'csv') {
      const headers = ['Log ID', 'Campaign ID', 'Recipient Email', 'Subject', 'Body', 'Status', 'Error Message', 'Sent At'];
      
      const csvRows = [headers.join(',')];
      
      for (const log of logs) {
        const row = [
          log.id,
          log.campaign_id,
          `"${log.recipient_email.replace(/"/g, '""')}"`,
          `"${log.subject.replace(/"/g, '""')}"`,
          `"${(log.body || '').replace(/"/g, '""')}"`,
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
          'Content-Disposition': 'attachment; filename=omniai_email_logs.csv',
        },
      });
    }

    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
