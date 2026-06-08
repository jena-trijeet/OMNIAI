"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Link2, 
  UserPlus, 
  Play, 
  RefreshCw, 
  Download, 
  Trash2, 
  Save, 
  FileSpreadsheet, 
  Check, 
  Send, 
  AlertCircle, 
  Search, 
  Plus, 
  Loader2,
  Sparkles,
  FileText,
  HelpCircle,
  Database,
  Users,
  Shield
} from 'lucide-react';

interface Campaign {
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

interface Recipient {
  id: string;
  campaign_id: string;
  name?: string;
  email: string;
  variables: Record<string, any>;
  status: 'Pending' | 'Sent' | 'Failed';
  error_message?: string;
}

interface LogEntry {
  id: string;
  campaign_id: string;
  recipient_email: string;
  subject: string;
  body?: string;
  status: 'Success' | 'Failed';
  error_message?: string;
  sent_at: string;
}

export function EmailAutomationHub() {
  // Auth state
  const [gmailConnected, setGmailConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSmtpConfigured, setIsSmtpConfigured] = useState(false);

  // Campaigns & Drafts state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  
  // Composer Form
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [signature, setSignature] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Sheet Sync Form
  const [sheetUrl, setSheetUrl] = useState('');
  const [mockType, setMockType] = useState<'customers' | 'leads' | 'parse'>('customers');
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    total: number;
    imported: number;
    invalid: number;
    duplicates: number;
  } | null>(null);

  // Recipients State
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  // Queue & Progress
  const [isSending, setIsSending] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  // Logs state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // AI Assistant states inside composer
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Selected log for detailed dialog view
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Error/Success Alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Portal & Admin States
  const [activePortal, setActivePortal] = useState<'user' | 'admin'>('admin');
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // 1. Fetch Initials (Auth state, Campaigns list, Delivery Logs)
  useEffect(() => {
    fetchAuthState();
    fetchCampaigns();
    fetchLogs();
  }, []);

  // Synchronize with global portal state in local storage
  useEffect(() => {
    const syncPortal = () => {
      try {
        const saved = localStorage.getItem('omniai_active_portal') as 'user' | 'admin' | null;
        if (saved) {
          setActivePortal(saved);
        }
      } catch (e) {}
    };
    syncPortal();
    window.addEventListener('omniai_portal_update', syncPortal);
    return () => window.removeEventListener('omniai_portal_update', syncPortal);
  }, []);

  const handlePortalSwitch = (portal: 'user' | 'admin') => {
    setActivePortal(portal);
    try {
      localStorage.setItem('omniai_active_portal', portal);
      window.dispatchEvent(new Event('omniai_portal_update'));
    } catch (e) {}
  };

  // Poll campaign status when sending
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSending && selectedCampaignId) {
      const pollCampaign = async () => {
        try {
          const res = await fetch(`/api/email-automation/campaigns?id=${selectedCampaignId}`);
          const data = await res.json();
          if (data.campaign) {
            setCurrentCampaign(data.campaign);
            setRecipients(data.recipients || []);
            
            // Refresh logs list in real-time during campaign execution
            fetchLogs();
            
            // Check if sending completed
            if (data.campaign.status !== 'Sending') {
              setIsSending(false);
              showNotification('success', `Outbound campaign broadcast ${data.campaign.status.toLowerCase()}!`);
              fetchCampaigns();
            }
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      };

      timer = setInterval(pollCampaign, 800);
    }
    return () => clearInterval(timer);
  }, [isSending, selectedCampaignId]);

  const showNotification = (type: 'success' | 'error', msg: string) => {
    setAlert({ type, message: msg });
    setTimeout(() => setAlert(null), 5000);
  };

  const fetchAuthState = async () => {
    try {
      const res = await fetch('/api/email-automation');
      const data = await res.json();
      if (data.connected) {
        setGmailConnected(true);
        setConnectedEmail(data.gmail_account);
      } else {
        setGmailConnected(false);
        setConnectedEmail('');
      }
      setIsSmtpConfigured(!!data.smtp_configured);
      if (data.global_settings) {
        setGoogleClientId(data.global_settings.google_client_id || '');
        setGoogleClientSecret(data.global_settings.google_client_secret || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/email-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          google_client_id: googleClientId,
          google_client_secret: googleClientSecret
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Global OAuth credentials updated successfully.');
        fetchAuthState();
      } else {
        showNotification('error', data.error || 'Failed to update settings.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/email-automation/campaigns');
      const data = await res.json();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/email-automation/logs');
      const data = await res.json();
      if (data && Array.isArray(data.logs)) {
        setLogs(data.logs);
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error(e);
      setLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Google OAuth Auth Simulator
  const handleConnectGmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/email-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', email: emailInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setGmailConnected(true);
        setConnectedEmail(data.gmail_account);
        setEmailInput('');
        showNotification('success', `Connected: ${data.gmail_account} via Sandbox Secure.`);
      } else {
        showNotification('error', data.error || 'Failed to connect Gmail.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleDisconnectGmail = async () => {
    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/email-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' })
      });
      const data = await res.json();
      if (data.success) {
        setGmailConnected(false);
        setConnectedEmail('');
        showNotification('success', 'Gmail node disconnected.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 2. Campaign Save/Draft Actions
  const handleSaveCampaign = async () => {
    if (!campaignName.trim() || !subject.trim() || !body.trim()) {
      showNotification('error', 'Please fill in Campaign Name, Subject, and Body.');
      return;
    }
    setIsSavingDraft(true);
    try {
      const res = await fetch('/api/email-automation/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCampaignId || undefined,
          name: campaignName.trim(),
          subject: subject.trim(),
          body: body.trim(),
          signature: signature.trim(),
          status: 'Draft'
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Campaign draft saved successfully.');
        setSelectedCampaignId(data.campaign.id);
        setCurrentCampaign(data.campaign);
        fetchCampaigns();
      } else {
        showNotification('error', data.error || 'Failed to save campaign.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSelectCampaign = async (id: string) => {
    if (!id) {
      // Clear composer
      setSelectedCampaignId('');
      setCampaignName('');
      setSubject('');
      setBody('');
      setSignature('');
      setRecipients([]);
      setCurrentCampaign(null);
      setImportSummary(null);
      return;
    }
    setSelectedCampaignId(id);
    try {
      const res = await fetch(`/api/email-automation/campaigns?id=${id}`);
      const data = await res.json();
      if (data.campaign) {
        const c = data.campaign;
        setCampaignName(c.name);
        setSubject(c.subject);
        setBody(c.body);
        setSignature(c.signature || '');
        setRecipients(data.recipients || []);
        setCurrentCampaign(c);
        if (c.status === 'Sending') {
          setIsSending(true);
        } else {
          setIsSending(false);
        }
      }
    } catch (e) {
      showNotification('error', 'Failed to retrieve campaign details.');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This deletes all associated recipients and logs.')) return;
    try {
      const res = await fetch(`/api/email-automation/campaigns?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Campaign deleted.');
        if (selectedCampaignId === id) {
          handleSelectCampaign('');
        }
        fetchCampaigns();
        fetchLogs();
      }
    } catch (e) {
      showNotification('error', 'Failed to delete campaign.');
    }
  };

  // 3. Google Sheets Importing Sync
  const handleImportSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let activeCampaignId = selectedCampaignId;
    
    if (!activeCampaignId) {
      setIsImporting(true);
      try {
        const defaultName = `Import Campaign - ${new Date().toLocaleDateString()}`;
        const defaultSubject = `Welcome to OMNIAI Outbound`;
        const defaultBody = `Hello {{name}},\n\nThis is an automated campaign synchronization.`;
        
        const res = await fetch('/api/email-automation/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: defaultName,
            subject: defaultSubject,
            body: defaultBody,
            status: 'Draft'
          })
        });
        const data = await res.json();
        if (data.success) {
          activeCampaignId = data.campaign.id;
          setSelectedCampaignId(activeCampaignId);
          setCurrentCampaign(data.campaign);
          setCampaignName(data.campaign.name);
          setSubject(data.campaign.subject);
          setBody(data.campaign.body);
          fetchCampaigns();
        } else {
          showNotification('error', data.error || 'Failed to auto-create campaign for import.');
          setIsImporting(false);
          return;
        }
      } catch (err: any) {
        showNotification('error', 'Auto-creating campaign failed: ' + err.message);
        setIsImporting(false);
        return;
      }
    }

    setIsImporting(true);
    try {
      const res = await fetch('/api/email-automation/sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: activeCampaignId,
          sheetUrl: sheetUrl.trim() || undefined,
          mockType: mockType
        })
      });
      const data = await res.json();
      if (data.success) {
        setImportSummary({
          total: data.total_found,
          imported: data.total_imported,
          invalid: data.invalid_emails,
          duplicates: data.duplicates_removed
        });
        setRecipients(data.recipients);
        showNotification('success', `Successfully imported ${data.total_imported} unique email nodes!`);
        // Refresh campaign to update total count metric
        handleSelectCampaign(activeCampaignId);
        fetchCampaigns();
      } else {
        showNotification('error', data.error || 'Failed to import sheet.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsImporting(false);
    }
  };

  // 4. Manually Add/Delete Recipients
  const handleAddManualRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) {
      showNotification('error', 'Create a campaign first.');
      return;
    }
    if (!newContactEmail.trim()) return;

    try {
      const res = await fetch('/api/email-automation/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_recipient',
          campaignId: selectedCampaignId,
          name: newContactName.trim(),
          email: newContactEmail.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Recipient added manually.');
        setNewContactName('');
        setNewContactEmail('');
        setIsAddingContact(false);
        // Refresh list
        handleSelectCampaign(selectedCampaignId);
      } else {
        showNotification('error', data.error || 'Failed to add recipient.');
      }
    } catch (e) {
      showNotification('error', 'Request failed.');
    }
  };

  const handleDeleteRecipient = async (recId: string) => {
    try {
      const res = await fetch(`/api/email-automation/campaigns?recipientId=${recId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setRecipients(recipients.filter(r => r.id !== recId));
        // Refresh campaign details
        if (selectedCampaignId) {
          const campaignRes = await fetch(`/api/email-automation/campaigns?id=${selectedCampaignId}`);
          const cData = await campaignRes.json();
          if (cData.campaign) setCurrentCampaign(cData.campaign);
        }
        fetchCampaigns();
      }
    } catch (e) {
      showNotification('error', 'Failed to remove recipient.');
    }
  };

  // 5. Broadcast Executor Trigger
  const handleSendBroadcast = async () => {
    if (!gmailConnected) {
      showNotification('error', 'Configure and connect your Gmail outbound node first.');
      return;
    }
    if (!selectedCampaignId) {
      showNotification('error', 'Select or save a campaign before broadcasting.');
      return;
    }
    if (recipients.length === 0) {
      showNotification('error', 'Recipient list is empty. Import from a Google Sheet first.');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/email-automation/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: selectedCampaignId })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Outbound email queue initiated.');
        // Fast update
        if (data.campaign) setCurrentCampaign(data.campaign);
      } else {
        showNotification('error', data.error || 'Failed to start sending queue.');
        setIsSending(false);
      }
    } catch (err: any) {
      showNotification('error', err.message);
      setIsSending(false);
    }
  };

  // Export Delivery logs to CSV file
  const handleExportCSV = (forceAll: boolean = false) => {
    const filterParam = (!forceAll && selectedCampaignId) ? `?campaignId=${selectedCampaignId}&export=csv` : '?export=csv';
    window.open(`/api/email-automation/logs${filterParam}`, '_blank');
  };

  // 6. AI copy assistant using backend /api/chat with client-side Puter fallback
  const handleGenerateAICopy = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAI(true);
    
    const systemPrompt = `
      You are OMNIAI Copywriter. Draft a persuasive outbound cold marketing email copy.
      Objective/Topic: ${aiPrompt}
      
      Formatting parameters:
      - Provide the Subject line in the first line as: Subject: [Text]
      - Add a clean blank line.
      - Write the body text.
      - Incorporate template variables like {{name}} or {{company}} naturally in the text.
      - Do not add conversational intro/outro text, just output the subject and email body.
    `;

    let responseText = '';
    let success = false;

    // 1. Try backend OpenAI chat API first
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: systemPrompt }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          responseText = data.content;
          success = true;
        }
      }
    } catch (apiErr) {
      console.warn("Backend chat API failed for AI copywriter, trying Puter fallback:", apiErr);
    }

    // 2. Fall back to client-side Puter SDK if backend failed
    if (!success) {
      try {
        if (!(window as any).puter) {
          const script = document.createElement("script");
          script.src = "https://js.puter.com/v2/";
          script.async = true;
          document.body.appendChild(script);
          await new Promise((res) => {
            script.onload = res;
            script.onerror = res;
          });
        }

        if (!(window as any).puter) {
          throw new Error('Puter AI Engine unavailable.');
        }

        const puter = (window as any).puter;
        const puterResponse = await puter.ai.chat(systemPrompt, { model: 'gpt-4o-mini' });
        if (puterResponse) {
          responseText = puterResponse;
          success = true;
        } else {
          throw new Error("Empty response from Puter AI");
        }
      } catch (err: any) {
        showNotification('error', err.message || 'AI Copy generation failed.');
        setIsGeneratingAI(false);
        return;
      }
    }

    if (success && responseText) {
      // Parse subject and body
      const lines = responseText.split('\n');
      const subjectLine = lines.find((l: string) => l.toLowerCase().startsWith('subject:'));
      if (subjectLine) {
        setSubject(subjectLine.replace(/subject:\s*/i, '').trim());
        const bodyLines = lines.filter((l: string) => !l.toLowerCase().startsWith('subject:'));
        setBody(bodyLines.join('\n').trim());
      } else {
        // Fallback: first line as subject if it's short, else use it as body
        const firstLine = lines.find(l => l.trim().length > 0) || '';
        if (firstLine.length > 0 && firstLine.length < 100) {
          setSubject(firstLine.trim());
          setBody(lines.filter(l => l !== firstLine).join('\n').trim());
        } else {
          setSubject("OMNIAI Outbound Message");
          setBody(responseText.trim());
        }
      }
      showNotification('success', 'AI Copy synthesized and inserted into composer.');
      setAiPrompt('');
    }
    setIsGeneratingAI(false);
  };

  // Dynamic filter for recipients view
  const filteredRecipients = recipients.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      r.email.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  });

  // Dynamic filter for logs views
  const displayLogs = (logs || [])
    .filter(l => l && (!selectedCampaignId || l.campaign_id === selectedCampaignId))
    .filter(l => {
      if (!l) return false;
      const q = (logSearch || '').toLowerCase();
      return (
        (l.recipient_email && l.recipient_email.toLowerCase().includes(q)) ||
        (l.subject && l.subject.toLowerCase().includes(q)) ||
        (l.error_message && l.error_message.toLowerCase().includes(q))
      );
    });

  const displayAdminLogs = (logs || [])
    .filter(l => {
      if (!l) return false;
      const q = (logSearch || '').toLowerCase();
      return (
        (l.recipient_email && l.recipient_email.toLowerCase().includes(q)) ||
        (l.subject && l.subject.toLowerCase().includes(q)) ||
        (l.error_message && l.error_message.toLowerCase().includes(q))
      );
    });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Dynamic Alert Banner */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
              alert.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <AlertCircle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal Selection Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-purple-950/20 via-black/40 to-indigo-950/20 border border-white/5 p-4.5 rounded-2xl gap-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Database size={16} className="text-purple-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-purple-400 block">Workspace Portal</span>
            <span className="text-xs font-black text-white/95">Outbound Campaign Engine</span>
          </div>
        </div>
        <div className="flex gap-2.5 p-1 bg-black/60 border border-white/5 rounded-xl">
          <button
            onClick={() => handlePortalSwitch('user')}
            className={`px-4.5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activePortal === 'user'
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)] scale-[1.02]'
                : 'text-white/40 border border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={12} className={activePortal === 'user' ? 'text-purple-400' : ''} />
            User Panel
          </button>
          <button
            onClick={() => handlePortalSwitch('admin')}
            className={`px-4.5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activePortal === 'admin'
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)] scale-[1.02]'
                : 'text-white/40 border border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield size={12} className={activePortal === 'admin' ? 'text-purple-400 animate-pulse' : ''} />
            Admin Panel
          </button>
        </div>
      </div>

      {activePortal === 'user' ? (
        <>

      {/* Grid: Left Composer & Settings (8 Cols) | Right Roster & Progress (4 Cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Controls */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Card 1: Outbound Node Setup (Gmail Connection) */}
          <div className="glass-panel border-white/5 p-6 rounded-3xl relative overflow-hidden bg-black/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <Mail size={14} className="text-purple-400" />
                  1. Gmail Node Authentication
                </h4>
                <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                  Authenticate your sender account. If client secret keys are omitted, the module operates in Sandbox Simulation.
                </p>
              </div>

              {gmailConnected ? (
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold">{connectedEmail} {isSmtpConfigured ? '(SMTP Server)' : ''}</span>
                  </div>
                  {!isSmtpConfigured && (
                    <button
                      onClick={handleDisconnectGmail}
                      disabled={isAuthLoading}
                      className="px-4 py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleConnectGmail} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter Gmail address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="px-4 py-2.5 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors w-60"
                  />
                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="px-5 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                  >
                    {isAuthLoading ? <Loader2 size={12} className="animate-spin" /> : 'Connect Node'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Card 2: Campaign Composer */}
          <div className="glass-panel border-white/5 p-8 rounded-[32px] bg-black/40 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 gap-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <FileText size={14} className="text-purple-400" />
                  2. Campaign Composer Studio
                </h4>
                <p className="text-[10px] text-white/40 mt-1">
                  Draft email subject and message body. Add dynamic tags to inject custom spreadsheet variables.
                </p>
              </div>

              {/* Drafts Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCampaignId}
                  onChange={(e) => handleSelectCampaign(e.target.value)}
                  className="px-3 py-2 bg-black/50 border border-white/5 rounded-xl text-[10px] text-white/70 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="">-- [ New Campaign Draft ] --</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                  ))}
                </select>
                
                {selectedCampaignId && (
                  <button
                    onClick={() => handleDeleteCampaign(selectedCampaignId)}
                    className="p-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl transition-all"
                    title="Delete Draft"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* AI Synthesizer Bar */}
            <div className="p-4 bg-purple-500/[0.02] border border-purple-500/10 rounded-2xl space-y-3">
              <label className="text-[8px] font-mono font-black uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Sparkles size={11} className="animate-pulse" />
                Synthesize Copy with AI Copywriter
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. cold sales pitch to invite CEOs to try OMNIAI visual automation studio..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/30 transition-colors"
                />
                <button
                  onClick={handleGenerateAICopy}
                  disabled={isGeneratingAI || !aiPrompt.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
                >
                  {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : 'Synthesize'}
                </button>
              </div>
            </div>

            {/* Main Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Product Launch June"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g. Grow your tech stack, {{name}}!"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Email Content Body</label>
                <div className="flex gap-2">
                  {['{{name}}', '{{email}}', '{{company}}', '{{role}}'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setBody(prev => prev + ' ' + tag)}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[8px] font-mono text-white/50 hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Compose outbound campaign message here. You can use markdown and variable tags..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="px-4 py-3.5 bg-black/40 border border-white/5 rounded-2xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors h-64 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Outbound Signature (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Best regards, OMNIAI Outbound Team"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={handleSaveCampaign}
                  disabled={isSavingDraft}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSavingDraft ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save Draft
                </button>

                <button
                  onClick={handleSendBroadcast}
                  disabled={isSending}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  <Send size={12} />
                  Send to All Recipients
                </button>
              </div>
            </div>

          </div>

          {/* Card 3: Google Sheets Integration */}
          <div className="glass-panel border-white/5 p-8 rounded-[32px] bg-black/40 space-y-6">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                <FileSpreadsheet size={14} className="text-purple-400" />
                3. Google Sheets Integration Grid
              </h4>
              <p className="text-[10px] text-white/40 mt-1">
                Enter your Google Sheet URL. The system automatically reads, validates, and deduplicates the emails in the dataset.
              </p>
            </div>

            <form onSubmit={handleImportSheet} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6 flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Spreadsheet URL</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSheetUrl(val);
                      if (val.trim().startsWith('http')) {
                        setMockType('parse');
                      }
                    }}
                    className="w-full pl-9 pr-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors"
                  />
                  <Link2 size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Sandbox Dataset</label>
                <select
                  value={mockType}
                  onChange={(e) => setMockType(e.target.value as any)}
                  className="px-3 py-3 bg-black/50 border border-white/5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-purple-500/40 w-full"
                >
                  <option value="customers">Mock Customer base (Dedupe check)</option>
                  <option value="leads">Tech Leads outreach</option>
                  <option value="parse">Sheet URL Parsing Mode</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={isImporting}
                  className="w-full py-3.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-500/20 transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                >
                  {isImporting ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                  Sync Sheet Nodes
                </button>
              </div>
            </form>

            {/* Import Summary Results */}
            {importSummary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white/[0.01] border border-white/5 rounded-2xl"
              >
                <div className="space-y-1">
                  <span className="text-[7.5px] font-mono uppercase text-white/30 tracking-widest">Total Found</span>
                  <div className="text-xl font-bold text-white">{importSummary.total}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[7.5px] font-mono uppercase text-emerald-400/50 tracking-widest">Imported (Unique)</span>
                  <div className="text-xl font-bold text-emerald-400">{importSummary.imported}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[7.5px] font-mono uppercase text-amber-500/50 tracking-widest">Duplicates Removed</span>
                  <div className="text-xl font-bold text-amber-400">{importSummary.duplicates}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[7.5px] font-mono uppercase text-red-400/50 tracking-widest">Invalid Formats</span>
                  <div className="text-xl font-bold text-red-400">{importSummary.invalid}</div>
                </div>
              </motion.div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: Recipient management, Logs & Live Progress */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Progress Monitor */}
          {currentCampaign && (currentCampaign.status === 'Sending' || currentCampaign.status === 'Completed' || currentCampaign.status === 'Failed' || isSending) && (
            <div className="glass-panel border-[var(--accent-cyan)]/20 p-6 rounded-3xl bg-[var(--accent-cyan)]/[0.01] shadow-[0_0_20px_rgba(0,209,255,0.02)] space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-cyan)] flex items-center gap-1.5">
                  <Play size={12} className="animate-pulse" />
                  Live Campaign Queue
                </h5>
                <span className={`px-2 py-0.5 rounded-full text-[7.5px] font-mono font-bold border uppercase ${
                  currentCampaign.status === 'Sending' 
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse'
                    : currentCampaign.status === 'Completed'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {currentCampaign.status}
                </span>
              </div>

              {/* Counts Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-black/25 p-2.5 border border-white/5 rounded-xl">
                  <div className="text-xs font-mono font-black text-white/50">TOT</div>
                  <div className="text-sm font-bold text-white mt-1">{currentCampaign.total_emails}</div>
                </div>
                <div className="bg-emerald-500/5 p-2.5 border border-emerald-500/10 rounded-xl">
                  <div className="text-xs font-mono font-black text-emerald-400/50">SENT</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{currentCampaign.sent_emails}</div>
                </div>
                <div className="bg-red-500/5 p-2.5 border border-red-500/10 rounded-xl">
                  <div className="text-xs font-mono font-black text-red-400/50">FAIL</div>
                  <div className="text-sm font-bold text-red-400 mt-1">{currentCampaign.failed_emails}</div>
                </div>
                <div className="bg-white/5 p-2.5 border border-white/5 rounded-xl">
                  <div className="text-xs font-mono font-black text-white/30">PEND</div>
                  <div className="text-sm font-bold text-white/60 mt-1">{currentCampaign.pending_emails}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-mono text-white/40">
                  <span>Broadcast Sync Rate</span>
                  <span>{Math.round(((currentCampaign.sent_emails + currentCampaign.failed_emails) / (currentCampaign.total_emails || 1)) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-[var(--accent-cyan)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentCampaign.sent_emails + currentCampaign.failed_emails) / (currentCampaign.total_emails || 1)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Roster Panel */}
          <div className="glass-panel border-white/5 p-6 rounded-3xl bg-black/40 space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-wider text-white/80">Recipient Roster</h5>
                <span className="text-[8px] text-white/40 font-mono mt-0.5 block">{recipients.length} entries parsed</span>
              </div>

              <button
                onClick={() => setIsAddingContact(!isAddingContact)}
                disabled={!selectedCampaignId}
                className="p-2 border border-white/5 bg-white/5 hover:border-purple-500/30 text-white hover:text-purple-400 rounded-xl transition-all disabled:opacity-20"
                title="Add Contact Manually"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Manual Add Form Toggle */}
            <AnimatePresence>
              {isAddingContact && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddManualRecipient}
                  className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Contact name..."
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-xs text-white"
                  />
                  <input
                    type="email"
                    placeholder="Contact email..."
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-black/50 border border-white/5 rounded-lg text-xs text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-purple-500/30 transition-all"
                    >
                      Add Node
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[9px]"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Search filter for roster */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-black/35 border border-white/5 rounded-xl text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/30"
              />
              <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar select-none">
              {filteredRecipients.length === 0 ? (
                <div className="text-center py-8 text-[9px] text-white/25">No entries mapped.</div>
              ) : (
                filteredRecipients.map(r => (
                  <div 
                    key={r.id}
                    className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between gap-3 group transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-white/95 truncate">
                        {r.name || 'Anonymous Recipient'}
                      </span>
                      <span className="text-[8.5px] font-mono text-white/40 mt-0.5 truncate">
                        {r.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[6.5px] font-mono uppercase font-black ${
                        r.status === 'Sent'
                          ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                          : r.status === 'Failed'
                          ? 'bg-red-500/10 border border-red-500/25 text-red-400'
                          : 'bg-white/5 border border-white/10 text-white/40'
                      }`}>
                        {r.status}
                      </span>

                      <button
                        onClick={() => handleDeleteRecipient(r.id)}
                        className="p-1.5 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/15 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Contact"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: Delivery Ledger Logs */}
      <div className="glass-panel border-white/5 p-8 rounded-[32px] bg-black/40 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 gap-4">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
              <Database size={14} className="text-purple-400" />
              Campaign Outbound Log Ledger
            </h4>
            <p className="text-[10px] text-white/40 mt-1">
              Verify real-time delivery status logs. Export metrics directly into secure CSV reports.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ledger entries..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="pl-8 pr-4 py-2 bg-black/50 border border-white/5 rounded-xl text-[10px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 w-52"
              />
              <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            </div>

            <button
              onClick={() => fetchLogs()}
              disabled={isLoadingLogs}
              className="px-3.5 py-2.5 bg-white/5 border border-white/10 hover:border-purple-500/30 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
              title="Refresh Log Ledger"
            >
              <RefreshCw size={11} className={isLoadingLogs ? "animate-spin" : ""} />
            </button>

            <button
              onClick={() => handleExportCSV(false)}
              disabled={!logs || logs.length === 0}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-purple-500/30 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-20"
            >
              <Download size={11} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Logs Grid Table */}
        <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-2xl bg-black/25">
          <table className="w-full border-collapse text-left text-[10px] select-text">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 font-black uppercase tracking-wider text-white/40">Timestamp</th>
                <th className="p-4 font-black uppercase tracking-wider text-white/40">Recipient</th>
                <th className="p-4 font-black uppercase tracking-wider text-white/40">Subject Line</th>
                <th className="p-4 font-black uppercase tracking-wider text-white/40">Status</th>
                <th className="p-4 font-black uppercase tracking-wider text-white/40">Outbound Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light text-white/70">
              {isLoadingLogs && (!logs || logs.length === 0) ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/30">
                    <Loader2 size={16} className="animate-spin mx-auto mb-2" />
                    Fetching system logs...
                  </td>
                </tr>
              ) : displayLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/30">No delivery logs recorded in ledger.</td>
                </tr>
              ) : (
                displayLogs
                  .slice(0, 50) // Limit display to top 50 log records
                  .map(log => (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors cursor-pointer"
                      title="Click to view full email details and message body"
                    >
                      <td className="p-4 font-mono text-[9px] text-white/40 whitespace-nowrap">
                        {new Date(log.sent_at).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-white/90 whitespace-nowrap">
                        {log.recipient_email}
                      </td>
                      <td className="p-4 max-w-xs truncate text-white/80">
                        {log.subject}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[7.5px] font-mono uppercase font-black ${
                          log.status === 'Success'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {log.status === 'Success' ? 'delivered' : 'failed'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[8px] max-w-xs truncate text-white/40">
                        {log.status === 'Success' ? 'Mail synchronized successfully.' : log.error_message || 'SMTP Connection Fail.'}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
        /* ADMIN PORTAL PANEL */
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 border-white/5 bg-black/40 rounded-2xl">
              <span className="text-[8px] font-mono uppercase text-white/35 tracking-widest block">System Campaigns</span>
              <div className="text-2xl font-bold text-white mt-1.5">{campaigns.length} Campaigns</div>
            </div>
            <div className="glass-panel p-6 border-white/5 bg-black/40 rounded-2xl">
              <span className="text-[8px] font-mono uppercase text-emerald-400/55 tracking-widest block">Global Sent Outbox</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1.5">
                {campaigns.reduce((acc, c) => acc + c.sent_emails, 0)} Emails
              </div>
            </div>
            <div className="glass-panel p-6 border-white/5 bg-black/40 rounded-2xl">
              <span className="text-[8px] font-mono uppercase text-red-400/55 tracking-widest block">Global Fault Outbox</span>
              <div className="text-2xl font-bold text-red-400 mt-1.5">
                {campaigns.reduce((acc, c) => acc + c.failed_emails, 0)} Failures
              </div>
            </div>
            <div className="glass-panel p-6 border-white/5 bg-black/40 rounded-2xl">
              <span className="text-[8px] font-mono uppercase text-purple-400/55 tracking-widest block">Active Outbound Nodes</span>
              <div className="text-2xl font-bold text-purple-400 mt-1.5">{gmailConnected ? 1 : 0} Connected</div>
            </div>
          </div>

          {/* Admin Configuration & Credentials */}
          <div className="glass-panel border-white/5 p-8 rounded-[32px] bg-black/40 space-y-6">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400 animate-pulse" />
                Global Google OAuth Setup Terminal
              </h4>
              <p className="text-[10px] text-white/40 mt-1">
                Configure your system-wide Google OAuth Client Credentials. When saved, all User Panels leverage these parameters to links their Google/Gmail Accounts.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Google Client ID</label>
                <input
                  type="text"
                  placeholder="e.g. 1092834-ab12cd...apps.googleusercontent.com"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors w-full"
                />
              </div>

              <div className="md:col-span-5 flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Google Client Secret</label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••"
                  value={googleClientSecret}
                  onChange={(e) => setGoogleClientSecret(e.target.value)}
                  className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors w-full"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  {isSavingSettings ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save Keys
                </button>
              </div>
            </form>
          </div>

          {/* Admin Campaigns Directory */}
          <div className="glass-panel border-white/5 p-8 rounded-[32px] bg-black/40 space-y-6">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                <Database size={14} className="text-purple-400" />
                Global Outbound Campaign Registry
              </h4>
              <p className="text-[10px] text-white/40 mt-1">
                Monitor and manage all active, drafted, and completed outbound email campaigns.
              </p>
            </div>

            <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-2xl bg-black/25">
              <table className="w-full border-collapse text-left text-[10px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Campaign Name</th>
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Subject Line</th>
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Status</th>
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Stats (Success/Fail/Total)</th>
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  {campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-white/30">No system campaigns recorded.</td>
                    </tr>
                  ) : (
                    campaigns.map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white">{c.name}</td>
                        <td className="p-4 truncate max-w-xs">{c.subject}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[7.5px] font-mono uppercase font-black ${
                            c.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : c.status === 'Sending'
                              ? 'bg-blue-500/10 text-blue-400 animate-pulse'
                              : 'bg-white/5 text-white/40'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono">
                          <span className="text-emerald-400">{c.sent_emails}</span> / <span className="text-red-400">{c.failed_emails}</span> / <span className="text-white/40">{c.total_emails}</span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteCampaign(c.id)}
                            className="p-1.5 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/15 rounded-lg transition-colors"
                            title="Delete Campaign"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs Grid */}
          <div className="glass-panel border-white/5 p-8 rounded-[32px] bg-black/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 gap-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <Database size={14} className="text-purple-400" />
                  System-Wide Audit Delivery Ledger
                </h4>
                <p className="text-[10px] text-white/40 mt-1">
                  Global ledger log of all email deliveries. Filter or export metrics system-wide.
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search all logs..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-8 pr-4 py-2 bg-black/50 border border-white/5 rounded-xl text-[10px] text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 w-52"
                  />
                  <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                </div>

                <button
                  onClick={() => fetchLogs()}
                  disabled={isLoadingLogs}
                  className="px-3.5 py-2.5 bg-white/5 border border-white/10 hover:border-purple-500/30 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                  title="Refresh Log Ledger"
                >
                  <RefreshCw size={11} className={isLoadingLogs ? "animate-spin" : ""} />
                </button>

                <button
                  onClick={() => handleExportCSV(true)}
                  disabled={!logs || logs.length === 0}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:border-purple-500/30 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-20"
                >
                  <Download size={11} />
                  Export All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-2xl bg-black/25">
              <table className="w-full border-collapse text-left text-[10px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Timestamp</th>
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Recipient</th>
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Subject Line</th>
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Status</th>
                    <th className="p-4 font-black uppercase tracking-wider text-white/40">Outbound Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70 font-light">
                  {isLoadingLogs && (!logs || logs.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-white/30">
                        <Loader2 size={16} className="animate-spin mx-auto mb-2" />
                        Fetching system logs...
                      </td>
                    </tr>
                  ) : displayAdminLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-white/30">No delivery logs recorded in ledger.</td>
                    </tr>
                  ) : (
                    displayAdminLogs
                      .slice(0, 50)
                      .map(log => (
                        <tr 
                          key={log.id} 
                          onClick={() => setSelectedLog(log)}
                          className="hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors cursor-pointer"
                          title="Click to view full email details and message body"
                        >
                          <td className="p-4 font-mono text-[9px] text-white/40 whitespace-nowrap">
                            {new Date(log.sent_at).toLocaleString()}
                          </td>
                          <td className="p-4 font-bold text-white/90 whitespace-nowrap">
                            {log.recipient_email}
                          </td>
                          <td className="p-4 max-w-xs truncate text-white/80">
                            {log.subject}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[7.5px] font-mono uppercase font-black ${
                              log.status === 'Success'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {log.status === 'Success' ? 'delivered' : 'failed'}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[8px] max-w-xs truncate text-white/40">
                            {log.status === 'Success' ? 'Mail synchronized successfully.' : log.error_message || 'SMTP Connection Fail.'}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      )}

      {/* Log Details Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0c1e] border border-white/10 p-6 rounded-[24px] max-w-2xl w-full relative z-10 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <span className="text-[8px] font-mono font-black uppercase tracking-wider text-purple-400">Transmission Diagnostics</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white mt-0.5">Outbound Message Payload</h4>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="text-white/40 hover:text-white text-sm"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-white/40 block font-mono">Recipient Node</span>
                  <span className="text-white font-bold mt-1 block truncate select-text">{selectedLog.recipient_email}</span>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-white/40 block font-mono">Dispatched At</span>
                  <span className="text-white font-bold mt-1 block select-text">{new Date(selectedLog.sent_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px]">
                <span className="text-white/40 block font-mono">Subject Coordinate</span>
                <span className="text-white font-bold mt-1 block select-text">{selectedLog.subject}</span>
              </div>

              <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-xs space-y-1">
                <span className="text-[8px] font-mono font-black uppercase tracking-widest text-purple-400 block mb-2">Message Body</span>
                <div className="text-white/80 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap select-text pr-2 no-scrollbar font-light">
                  {selectedLog.body || "(No message body content captured in logs.)"}
                </div>
              </div>

              {selectedLog.error_message && (
                <div className="p-3.5 bg-red-500/5 border border-red-500/10 rounded-xl text-[10px] text-red-400 flex items-start gap-2 select-text">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono block uppercase font-black tracking-widest">Error Log Payload</span>
                    <span className="mt-1 block font-light leading-relaxed">{selectedLog.error_message}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Close Diagnostics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

