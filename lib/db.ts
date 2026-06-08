import fs from 'fs';
import path from 'path';

// Local storage paths for mock data in case Supabase is offline/using placeholder
const MOCK_DB_DIR = path.join(process.cwd(), '.mock_db');
const CONFIG_FILE = path.join(MOCK_DB_DIR, 'configs.json');
const CAMPAIGNS_FILE = path.join(MOCK_DB_DIR, 'campaigns.json');
const RECIPIENTS_FILE = path.join(MOCK_DB_DIR, 'recipients.json');
const LOGS_FILE = path.join(MOCK_DB_DIR, 'logs.json');
const SETTINGS_FILE = path.join(MOCK_DB_DIR, 'settings.json');

const WA_CAMPAIGNS_FILE = path.join(MOCK_DB_DIR, 'wa_campaigns.json');
const WA_RECIPIENTS_FILE = path.join(MOCK_DB_DIR, 'wa_recipients.json');
const WA_LOGS_FILE = path.join(MOCK_DB_DIR, 'wa_logs.json');

// Ensure DB directory and files exist
function initMockDb() {
  if (!fs.existsSync(MOCK_DB_DIR)) {
    fs.mkdirSync(MOCK_DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_FILE)) fs.writeFileSync(CONFIG_FILE, '[]');
  if (!fs.existsSync(CAMPAIGNS_FILE)) fs.writeFileSync(CAMPAIGNS_FILE, '[]');
  if (!fs.existsSync(RECIPIENTS_FILE)) fs.writeFileSync(RECIPIENTS_FILE, '[]');
  if (!fs.existsSync(LOGS_FILE)) fs.writeFileSync(LOGS_FILE, '[]');
  if (!fs.existsSync(SETTINGS_FILE)) fs.writeFileSync(SETTINGS_FILE, '{}');
  
  if (!fs.existsSync(WA_CAMPAIGNS_FILE)) fs.writeFileSync(WA_CAMPAIGNS_FILE, '[]');
  if (!fs.existsSync(WA_RECIPIENTS_FILE)) fs.writeFileSync(WA_RECIPIENTS_FILE, '[]');
  if (!fs.existsSync(WA_LOGS_FILE)) fs.writeFileSync(WA_LOGS_FILE, '[]');
}

// Check if we should use Supabase or Mock File DB
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const isSupabaseConfigured = 
  supabaseUrl && 
  !supabaseUrl.includes('your-project.supabase.co') && 
  supabaseUrl.startsWith('http');

// Types definitions
export interface EmailConfig {
  id: string;
  gmail_account: string;
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  template: string;
  buttons: string[];
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Completed' | 'Failed';
  scheduled_at?: string;
  total_messages: number;
  sent_messages: number;
  failed_messages: number;
  pending_messages: number;
  created_at: string;
}

export interface WhatsAppRecipient {
  id: string;
  campaign_id: string;
  name?: string;
  phone: string;
  variables: Record<string, any>;
  status: 'Pending' | 'Sent' | 'Failed';
  error_message?: string;
}

export interface WhatsAppLog {
  id: string;
  campaign_id: string;
  recipient_phone: string;
  recipient_name?: string;
  message_body: string;
  buttons: string[];
  status: 'Success' | 'Failed';
  error_message?: string;
  sent_at: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  signature?: string;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Completed' | 'Failed';
  scheduled_at?: string;
  total_emails: number;
  sent_emails: number;
  failed_emails: number;
  pending_emails: number;
  created_at: string;
}

export interface EmailRecipient {
  id: string;
  campaign_id: string;
  name?: string;
  email: string;
  variables: Record<string, any>;
  status: 'Pending' | 'Sent' | 'Failed';
  error_message?: string;
}

export interface EmailLog {
  id: string;
  campaign_id: string;
  recipient_email: string;
  subject: string;
  body?: string;
  status: 'Success' | 'Failed';
  error_message?: string;
  opened?: boolean;
  clicked?: boolean;
  sent_at: string;
}

// ── MOCK DB CRUD IMPLEMENTATION ──────────────────────────────────────────────

export async function getConfig(): Promise<EmailConfig | null> {
  if (isSupabaseConfigured) {
    // If Supabase was linked, fetch config using Supabase client.
    // For this demonstration, we use the local files to guarantee zero configuration.
  }
  initMockDb();
  const configs = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  return configs.length > 0 ? configs[0] : null;
}

export async function saveConfig(gmailAccount: string, accessToken: string, refreshToken: string, expiryDate: number): Promise<EmailConfig> {
  initMockDb();
  const configs = [{
    id: 'config-1',
    gmail_account: gmailAccount,
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiryDate
  }];
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(configs, null, 2));
  return configs[0];
}

export async function deleteConfig(): Promise<void> {
  initMockDb();
  fs.writeFileSync(CONFIG_FILE, '[]');
}

export interface GlobalSettings {
  google_client_id?: string;
  google_client_secret?: string;
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  initMockDb();
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
}

export async function saveGlobalSettings(clientId: string, clientSecret: string): Promise<GlobalSettings> {
  initMockDb();
  const settings = {
    google_client_id: clientId,
    google_client_secret: clientSecret
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  return settings;
}

export async function getCampaigns(): Promise<EmailCampaign[]> {
  initMockDb();
  return JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
}

export async function getCampaign(id: string): Promise<EmailCampaign | null> {
  initMockDb();
  const campaigns: EmailCampaign[] = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
  return campaigns.find(c => c.id === id) || null;
}

export async function saveCampaign(campaign: Omit<EmailCampaign, 'id' | 'created_at'> & { id?: string }): Promise<EmailCampaign> {
  initMockDb();
  const campaigns: EmailCampaign[] = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
  const newId = campaign.id || 'campaign-' + Math.floor(Math.random() * 999999);
  
  const existingIdx = campaigns.findIndex(c => c.id === newId);
  const updatedCampaign: EmailCampaign = {
    ...campaign,
    id: newId,
    created_at: existingIdx >= 0 ? campaigns[existingIdx].created_at : new Date().toISOString()
  };

  if (existingIdx >= 0) {
    campaigns[existingIdx] = updatedCampaign;
  } else {
    campaigns.push(updatedCampaign);
  }

  fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  return updatedCampaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  initMockDb();
  let campaigns: EmailCampaign[] = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
  campaigns = campaigns.filter(c => c.id !== id);
  fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));

  // Cascade delete recipients and logs
  let recipients: EmailRecipient[] = JSON.parse(fs.readFileSync(RECIPIENTS_FILE, 'utf-8'));
  recipients = recipients.filter(r => r.campaign_id !== id);
  fs.writeFileSync(RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));

  let logs: EmailLog[] = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
  logs = logs.filter(l => l.campaign_id !== id);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
}

export async function getRecipients(campaignId: string): Promise<EmailRecipient[]> {
  initMockDb();
  const recipients: EmailRecipient[] = JSON.parse(fs.readFileSync(RECIPIENTS_FILE, 'utf-8'));
  return recipients.filter(r => r.campaign_id === campaignId);
}

export async function saveRecipients(campaignId: string, list: Omit<EmailRecipient, 'id' | 'campaign_id' | 'status'>[]): Promise<EmailRecipient[]> {
  initMockDb();
  const recipients: EmailRecipient[] = JSON.parse(fs.readFileSync(RECIPIENTS_FILE, 'utf-8'));
  
  // Filter out existing recipients for this campaign to prevent duplicates
  const filteredExisting = recipients.filter(r => r.campaign_id !== campaignId);

  const newRecipients: EmailRecipient[] = list.map((item, idx) => ({
    id: `recipient-${campaignId}-${idx}-${Math.floor(Math.random() * 99999)}`,
    campaign_id: campaignId,
    name: item.name,
    email: item.email,
    variables: item.variables || {},
    status: 'Pending'
  }));

  const updatedList = [...filteredExisting, ...newRecipients];
  fs.writeFileSync(RECIPIENTS_FILE, JSON.stringify(updatedList, null, 2));

  // Update campaign total metric
  const campaigns: EmailCampaign[] = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
  const cIdx = campaigns.findIndex(c => c.id === campaignId);
  if (cIdx >= 0) {
    campaigns[cIdx].total_emails = newRecipients.length;
    campaigns[cIdx].pending_emails = newRecipients.length;
    campaigns[cIdx].sent_emails = 0;
    campaigns[cIdx].failed_emails = 0;
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  }

  return newRecipients;
}

export async function saveSingleRecipient(recipient: Omit<EmailRecipient, 'id'>): Promise<EmailRecipient> {
  initMockDb();
  const recipients: EmailRecipient[] = JSON.parse(fs.readFileSync(RECIPIENTS_FILE, 'utf-8'));
  const newId = 'recipient-' + Math.floor(Math.random() * 999999);
  
  const newRec: EmailRecipient = {
    ...recipient,
    id: newId
  };

  recipients.push(newRec);
  fs.writeFileSync(RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));

  // Increment campaign metrics
  const campaigns: EmailCampaign[] = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
  const cIdx = campaigns.findIndex(c => c.id === recipient.campaign_id);
  if (cIdx >= 0) {
    campaigns[cIdx].total_emails += 1;
    campaigns[cIdx].pending_emails += 1;
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  }

  return newRec;
}

export async function deleteRecipient(id: string): Promise<void> {
  initMockDb();
  let recipients: EmailRecipient[] = JSON.parse(fs.readFileSync(RECIPIENTS_FILE, 'utf-8'));
  const target = recipients.find(r => r.id === id);
  if (!target) return;

  recipients = recipients.filter(r => r.id !== id);
  fs.writeFileSync(RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));

  // Decrement campaign metrics
  const campaigns: EmailCampaign[] = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
  const cIdx = campaigns.findIndex(c => c.id === target.campaign_id);
  if (cIdx >= 0) {
    campaigns[cIdx].total_emails = Math.max(0, campaigns[cIdx].total_emails - 1);
    if (target.status === 'Pending') campaigns[cIdx].pending_emails = Math.max(0, campaigns[cIdx].pending_emails - 1);
    if (target.status === 'Sent') campaigns[cIdx].sent_emails = Math.max(0, campaigns[cIdx].sent_emails - 1);
    if (target.status === 'Failed') campaigns[cIdx].failed_emails = Math.max(0, campaigns[cIdx].failed_emails - 1);
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  }
}

export async function getLogs(campaignId?: string): Promise<EmailLog[]> {
  initMockDb();
  const logs: EmailLog[] = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
  if (campaignId) {
    return logs.filter(l => l.campaign_id === campaignId);
  }
  return logs;
}

export async function addLog(log: Omit<EmailLog, 'id' | 'sent_at'>): Promise<EmailLog> {
  initMockDb();
  
  // Ensure corresponding campaign parent row exists
  const campaigns: EmailCampaign[] = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
  if (!campaigns.some(c => c.id === log.campaign_id)) {
    campaigns.push({
      id: log.campaign_id,
      name: log.campaign_id === 'ai-writer' ? 'AI Copywriter Outbox' : 'Outbound Campaign',
      subject: log.subject,
      body: log.body || '',
      status: 'Completed',
      total_emails: 1,
      sent_emails: log.status === 'Success' ? 1 : 0,
      failed_emails: log.status === 'Failed' ? 1 : 0,
      pending_emails: 0,
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  }

  const logs: EmailLog[] = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
  const newLog: EmailLog = {
    ...log,
    id: 'log-' + Math.floor(Math.random() * 999999),
    sent_at: new Date().toISOString()
  };
  logs.push(newLog);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
  return newLog;
}

export async function updateRecipientStatus(id: string, status: 'Sent' | 'Failed', error_message?: string): Promise<void> {
  initMockDb();
  const recipients: EmailRecipient[] = JSON.parse(fs.readFileSync(RECIPIENTS_FILE, 'utf-8'));
  const rIdx = recipients.findIndex(r => r.id === id);
  if (rIdx >= 0) {
    const oldStatus = recipients[rIdx].status;
    recipients[rIdx].status = status;
    if (error_message) recipients[rIdx].error_message = error_message;
    fs.writeFileSync(RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));

    // Update campaign metrics
    const campaigns: EmailCampaign[] = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
    const cIdx = campaigns.findIndex(c => c.id === recipients[rIdx].campaign_id);
    if (cIdx >= 0) {
      if (oldStatus === 'Pending') campaigns[cIdx].pending_emails = Math.max(0, campaigns[cIdx].pending_emails - 1);
      if (oldStatus === 'Sent') campaigns[cIdx].sent_emails = Math.max(0, campaigns[cIdx].sent_emails - 1);
      if (oldStatus === 'Failed') campaigns[cIdx].failed_emails = Math.max(0, campaigns[cIdx].failed_emails - 1);

      if (status === 'Sent') campaigns[cIdx].sent_emails += 1;
      if (status === 'Failed') campaigns[cIdx].failed_emails += 1;
      
      fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
    }
  }
}

// ── WHATSAPP DB CRUD IMPLEMENTATION ──────────────────────────────────────────

export async function getWhatsAppCampaigns(): Promise<WhatsAppCampaign[]> {
  initMockDb();
  return JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
}

export async function getWhatsAppCampaign(id: string): Promise<WhatsAppCampaign | null> {
  initMockDb();
  const campaigns: WhatsAppCampaign[] = JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
  return campaigns.find(c => c.id === id) || null;
}

export async function saveWhatsAppCampaign(campaign: Omit<WhatsAppCampaign, 'id' | 'created_at'> & { id?: string }): Promise<WhatsAppCampaign> {
  initMockDb();
  const campaigns: WhatsAppCampaign[] = JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
  const newId = campaign.id || 'wa-campaign-' + Math.floor(Math.random() * 999999);
  
  const existingIdx = campaigns.findIndex(c => c.id === newId);
  const updatedCampaign: WhatsAppCampaign = {
    ...campaign,
    id: newId,
    created_at: existingIdx >= 0 ? campaigns[existingIdx].created_at : new Date().toISOString()
  };

  if (existingIdx >= 0) {
    campaigns[existingIdx] = updatedCampaign;
  } else {
    campaigns.push(updatedCampaign);
  }

  fs.writeFileSync(WA_CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  return updatedCampaign;
}

export async function deleteWhatsAppCampaign(id: string): Promise<void> {
  initMockDb();
  let campaigns: WhatsAppCampaign[] = JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
  campaigns = campaigns.filter(c => c.id !== id);
  fs.writeFileSync(WA_CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));

  // Cascade delete recipients and logs
  let recipients: WhatsAppRecipient[] = JSON.parse(fs.readFileSync(WA_RECIPIENTS_FILE, 'utf-8'));
  recipients = recipients.filter(r => r.campaign_id !== id);
  fs.writeFileSync(WA_RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));

  let logs: WhatsAppLog[] = JSON.parse(fs.readFileSync(WA_LOGS_FILE, 'utf-8'));
  logs = logs.filter(l => l.campaign_id !== id);
  fs.writeFileSync(WA_LOGS_FILE, JSON.stringify(logs, null, 2));
}

export async function getWhatsAppRecipients(campaignId: string): Promise<WhatsAppRecipient[]> {
  initMockDb();
  const recipients: WhatsAppRecipient[] = JSON.parse(fs.readFileSync(WA_RECIPIENTS_FILE, 'utf-8'));
  return recipients.filter(r => r.campaign_id === campaignId);
}

export async function saveWhatsAppRecipients(campaignId: string, list: Omit<WhatsAppRecipient, 'id' | 'campaign_id' | 'status'>[]): Promise<WhatsAppRecipient[]> {
  initMockDb();
  const recipients: WhatsAppRecipient[] = JSON.parse(fs.readFileSync(WA_RECIPIENTS_FILE, 'utf-8'));
  
  // Filter out existing recipients for this campaign to prevent duplicates
  const filteredExisting = recipients.filter(r => r.campaign_id !== campaignId);

  const newRecipients: WhatsAppRecipient[] = list.map((item, idx) => ({
    id: `wa-recipient-${campaignId}-${idx}-${Math.floor(Math.random() * 99999)}`,
    campaign_id: campaignId,
    name: item.name,
    phone: item.phone,
    variables: item.variables || {},
    status: 'Pending'
  }));

  const updatedList = [...filteredExisting, ...newRecipients];
  fs.writeFileSync(WA_RECIPIENTS_FILE, JSON.stringify(updatedList, null, 2));

  // Update campaign total metric
  const campaigns: WhatsAppCampaign[] = JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
  const cIdx = campaigns.findIndex(c => c.id === campaignId);
  if (cIdx >= 0) {
    campaigns[cIdx].total_messages = newRecipients.length;
    campaigns[cIdx].pending_messages = newRecipients.length;
    campaigns[cIdx].sent_messages = 0;
    campaigns[cIdx].failed_messages = 0;
    fs.writeFileSync(WA_CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  }

  return newRecipients;
}

export async function saveSingleWhatsAppRecipient(recipient: Omit<WhatsAppRecipient, 'id'>): Promise<WhatsAppRecipient> {
  initMockDb();
  const recipients: WhatsAppRecipient[] = JSON.parse(fs.readFileSync(WA_RECIPIENTS_FILE, 'utf-8'));
  const newId = 'wa-recipient-' + Math.floor(Math.random() * 999999);
  
  const newRec: WhatsAppRecipient = {
    ...recipient,
    id: newId
  };

  recipients.push(newRec);
  fs.writeFileSync(WA_RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));

  // Increment campaign metrics
  const campaigns: WhatsAppCampaign[] = JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
  const cIdx = campaigns.findIndex(c => c.id === recipient.campaign_id);
  if (cIdx >= 0) {
    campaigns[cIdx].total_messages += 1;
    campaigns[cIdx].pending_messages += 1;
    fs.writeFileSync(WA_CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  }

  return newRec;
}

export async function deleteWhatsAppRecipient(id: string): Promise<void> {
  initMockDb();
  let recipients: WhatsAppRecipient[] = JSON.parse(fs.readFileSync(WA_RECIPIENTS_FILE, 'utf-8'));
  const target = recipients.find(r => r.id === id);
  if (!target) return;

  recipients = recipients.filter(r => r.id !== id);
  fs.writeFileSync(WA_RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));

  // Decrement campaign metrics
  const campaigns: WhatsAppCampaign[] = JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
  const cIdx = campaigns.findIndex(c => c.id === target.campaign_id);
  if (cIdx >= 0) {
    campaigns[cIdx].total_messages = Math.max(0, campaigns[cIdx].total_messages - 1);
    if (target.status === 'Pending') campaigns[cIdx].pending_messages = Math.max(0, campaigns[cIdx].pending_messages - 1);
    if (target.status === 'Sent') campaigns[cIdx].sent_messages = Math.max(0, campaigns[cIdx].sent_messages - 1);
    if (target.status === 'Failed') campaigns[cIdx].failed_messages = Math.max(0, campaigns[cIdx].failed_messages - 1);
    fs.writeFileSync(WA_CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  }
}

export async function getWhatsAppLogs(campaignId?: string): Promise<WhatsAppLog[]> {
  initMockDb();
  const logs: WhatsAppLog[] = JSON.parse(fs.readFileSync(WA_LOGS_FILE, 'utf-8'));
  if (campaignId) {
    return logs.filter(l => l.campaign_id === campaignId);
  }
  return logs;
}

export async function addWhatsAppLog(log: Omit<WhatsAppLog, 'id' | 'sent_at'>): Promise<WhatsAppLog> {
  initMockDb();
  
  // Ensure corresponding campaign parent row exists
  const campaigns: WhatsAppCampaign[] = JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
  if (!campaigns.some(c => c.id === log.campaign_id)) {
    campaigns.push({
      id: log.campaign_id,
      name: log.campaign_id === 'wa-ai-writer' ? 'AI WhatsApp Writer' : 'Outbound WhatsApp Campaign',
      template: log.message_body,
      buttons: log.buttons || [],
      status: 'Completed',
      total_messages: 1,
      sent_messages: log.status === 'Success' ? 1 : 0,
      failed_messages: log.status === 'Failed' ? 1 : 0,
      pending_messages: 0,
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(WA_CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  }

  const logs: WhatsAppLog[] = JSON.parse(fs.readFileSync(WA_LOGS_FILE, 'utf-8'));
  const newLog: WhatsAppLog = {
    ...log,
    id: 'wa-log-' + Math.floor(Math.random() * 999999),
    sent_at: new Date().toISOString()
  };
  logs.push(newLog);
  fs.writeFileSync(WA_LOGS_FILE, JSON.stringify(logs, null, 2));
  return newLog;
}

export async function updateWhatsAppRecipientStatus(id: string, status: 'Sent' | 'Failed', error_message?: string): Promise<void> {
  initMockDb();
  const recipients: WhatsAppRecipient[] = JSON.parse(fs.readFileSync(WA_RECIPIENTS_FILE, 'utf-8'));
  const rIdx = recipients.findIndex(r => r.id === id);
  if (rIdx >= 0) {
    const oldStatus = recipients[rIdx].status;
    recipients[rIdx].status = status;
    if (error_message) recipients[rIdx].error_message = error_message;
    fs.writeFileSync(WA_RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));

    // Update campaign metrics
    const campaigns: WhatsAppCampaign[] = JSON.parse(fs.readFileSync(WA_CAMPAIGNS_FILE, 'utf-8'));
    const cIdx = campaigns.findIndex(c => c.id === recipients[rIdx].campaign_id);
    if (cIdx >= 0) {
      if (oldStatus === 'Pending') campaigns[cIdx].pending_messages = Math.max(0, campaigns[cIdx].pending_messages - 1);
      if (oldStatus === 'Sent') campaigns[cIdx].sent_messages = Math.max(0, campaigns[cIdx].sent_messages - 1);
      if (oldStatus === 'Failed') campaigns[cIdx].failed_messages = Math.max(0, campaigns[cIdx].failed_messages - 1);

      if (status === 'Sent') campaigns[cIdx].sent_messages += 1;
      if (status === 'Failed') campaigns[cIdx].failed_messages += 1;
      
      fs.writeFileSync(WA_CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
    }
  }
}

