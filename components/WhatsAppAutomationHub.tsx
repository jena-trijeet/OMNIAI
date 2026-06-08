"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
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
  Smartphone,
  Users,
  Shield
} from 'lucide-react';

interface WhatsAppCampaign {
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

interface WhatsAppRecipient {
  id: string;
  campaign_id: string;
  name?: string;
  phone: string;
  variables: Record<string, any>;
  status: 'Pending' | 'Sent' | 'Failed';
  error_message?: string;
}

interface WhatsAppLog {
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

export function WhatsAppAutomationHub() {
  // Campaigns & Drafts state
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  
  // Twilio Gateway Config State
  const [twilioConfigured, setTwilioConfigured] = useState(false);
  const [twilioNumber, setTwilioNumber] = useState('');
  
  // Composer Form
  const [campaignName, setCampaignName] = useState('');
  const [template, setTemplate] = useState('');
  const [buttons, setButtons] = useState<string[]>(["I'm Interested!", "Unsubscribe"]);
  const [newButtonText, setNewButtonText] = useState("");
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
  const [recipients, setRecipients] = useState<WhatsAppRecipient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Queue & Progress
  const [isSending, setIsSending] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<WhatsAppCampaign | null>(null);

  // Logs state
  const [logs, setLogs] = useState<WhatsAppLog[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // AI Assistant states inside composer
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Selected log for detailed dialog view
  const [selectedLog, setSelectedLog] = useState<WhatsAppLog | null>(null);

  // Error/Success Alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Portal switch context
  const [activePortal, setActivePortal] = useState<'user' | 'admin'>('admin');

  // 1. Fetch Initials
  useEffect(() => {
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

  // Poll campaign status when sending
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSending && selectedCampaignId) {
      const pollCampaign = async () => {
        try {
          const res = await fetch(`/api/whatsapp/campaigns?id=${selectedCampaignId}`);
          const data = await res.json();
          if (data.campaign) {
            setCurrentCampaign(data.campaign);
            setRecipients(data.recipients || []);
            
            // Refresh logs
            fetchLogs();
            
            if (data.campaign.status !== 'Sending') {
              setIsSending(false);
              showNotification('success', `WhatsApp campaign broadcast completed with status: ${data.campaign.status.toLowerCase()}`);
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

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/whatsapp/campaigns');
      const data = await res.json();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
      }
      if (data.twilio_configured !== undefined) {
        setTwilioConfigured(data.twilio_configured);
      }
      if (data.twilio_number !== undefined) {
        setTwilioNumber(data.twilio_number);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/whatsapp/logs');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // 2. Campaign Save Actions
  const handleSaveCampaign = async () => {
    if (!campaignName.trim() || !template.trim()) {
      showNotification('error', 'Please fill in Campaign Name and Message Template.');
      return;
    }
    setIsSavingDraft(true);
    try {
      const res = await fetch('/api/whatsapp/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCampaignId || undefined,
          name: campaignName.trim(),
          template: template.trim(),
          buttons: buttons,
          status: 'Draft'
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'WhatsApp campaign draft saved successfully.');
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
      setSelectedCampaignId('');
      setCampaignName('');
      setTemplate('');
      setButtons(["I'm Interested!", "Unsubscribe"]);
      setRecipients([]);
      setCurrentCampaign(null);
      setImportSummary(null);
      return;
    }
    setSelectedCampaignId(id);
    try {
      const res = await fetch(`/api/whatsapp/campaigns?id=${id}`);
      const data = await res.json();
      if (data.campaign) {
        const c = data.campaign;
        setCampaignName(c.name);
        setTemplate(c.template);
        setButtons(c.buttons || []);
        setRecipients(data.recipients || []);
        setCurrentCampaign(c);
        setIsSending(c.status === 'Sending');
      }
      if (data.twilio_configured !== undefined) {
        setTwilioConfigured(data.twilio_configured);
      }
      if (data.twilio_number !== undefined) {
        setTwilioNumber(data.twilio_number);
      }
    } catch (e) {
      showNotification('error', 'Failed to retrieve campaign details.');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This deletes all associated recipients and logs.')) return;
    try {
      const res = await fetch(`/api/whatsapp/campaigns?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'WhatsApp campaign deleted.');
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

  // Buttons Configuration Helper
  const handleAddButton = () => {
    if (newButtonText.trim() && buttons.length < 3) {
      setButtons([...buttons, newButtonText.trim()]);
      setNewButtonText("");
    }
  };

  const handleRemoveButton = (idx: number) => {
    setButtons(buttons.filter((_, i) => i !== idx));
  };

  // 3. Google Sheets Sync
  const handleImportSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let activeCampaignId = selectedCampaignId;
    
    if (!activeCampaignId) {
      setIsImporting(true);
      try {
        const defaultName = `Import WA Campaign - ${new Date().toLocaleDateString()}`;
        const defaultTemplate = `Hello {{name}},\n\nThis is an automated WhatsApp notification.`;
        
        const res = await fetch('/api/whatsapp/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: defaultName,
            template: defaultTemplate,
            buttons: buttons,
            status: 'Draft'
          })
        });
        const data = await res.json();
        if (data.success) {
          activeCampaignId = data.campaign.id;
          setSelectedCampaignId(activeCampaignId);
          setCurrentCampaign(data.campaign);
          setCampaignName(data.campaign.name);
          setTemplate(data.campaign.template);
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
      const res = await fetch('/api/whatsapp/sheets/import', {
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
        showNotification('success', `Successfully imported ${data.total_imported} WhatsApp contact nodes!`);
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
    if (!newContactPhone.trim()) return;

    try {
      const res = await fetch('/api/whatsapp/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_recipient',
          campaignId: selectedCampaignId,
          name: newContactName.trim(),
          phone: newContactPhone.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Recipient added manually.');
        setNewContactName('');
        setNewContactPhone('');
        setIsAddingContact(false);
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
      const res = await fetch(`/api/whatsapp/campaigns?recipientId=${recId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setRecipients(recipients.filter(r => r.id !== recId));
        if (selectedCampaignId) {
          const campaignRes = await fetch(`/api/whatsapp/campaigns?id=${selectedCampaignId}`);
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
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: selectedCampaignId })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Outbound WhatsApp campaign broadcast initiated.');
        if (data.campaign) setCurrentCampaign(data.campaign);
      } else {
        showNotification('error', data.error || 'Failed to start broadcast queue.');
        setIsSending(false);
      }
    } catch (err: any) {
      showNotification('error', err.message);
      setIsSending(false);
    }
  };

  // Export Delivery logs to CSV
  const handleExportCSV = (forceAll: boolean = false) => {
    const filterParam = (!forceAll && selectedCampaignId) ? `?campaignId=${selectedCampaignId}&export=csv` : '?export=csv';
    window.open(`/api/whatsapp/logs${filterParam}`, '_blank');
  };

  // 6. AI copy assistant using Puter.js
  const handleGenerateAICopy = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAI(true);
    try {
      const puter = (window as any).puter;
      if (!puter) {
        throw new Error("Puter SDK is not loaded. Make sure your internet is active.");
      }

      const promptText = `
        You are OMNIAI Mobile Growth Assistant. Write a short, engaging WhatsApp Broadcast message.
        Topic: ${aiPrompt}
        
        Instructions:
        - Include relevant emojis.
        - Use WhatsApp markdown (*bold*, _italics_).
        - Keep it under 150 words.
        - Do not output any markdown code blocks, just raw conversational message.
      `;

      const response = await puter.ai.chat(promptText, { model: "gpt-4o-mini" });
      if (response) {
        setTemplate(response.trim());
        showNotification('success', 'AI Copywriter synthesized template successfully!');
        setAiPrompt('');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'AI copy synthesis failed.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Filter recipients in UI list
  const filteredRecipients = recipients.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) || 
      r.phone.includes(q)
    );
  });

  // Filter logs for the ledger
  const displayLogs = activePortal === 'user' && selectedCampaignId 
    ? logs.filter(l => l.campaign_id === selectedCampaignId)
    : logs;

  const filteredLogs = displayLogs.filter(l => {
    const q = logSearch.toLowerCase();
    return (
      l.recipient_phone.includes(q) ||
      (l.recipient_name && l.recipient_name.toLowerCase().includes(q)) ||
      l.message_body.toLowerCase().includes(q) ||
      (l.error_message && l.error_message.toLowerCase().includes(q))
    );
  });

  // Compute stats for current campaign
  const campaignToDisplay = currentCampaign || campaigns.find(c => c.id === selectedCampaignId);
  const total = campaignToDisplay?.total_messages || recipients.length;
  const sent = campaignToDisplay?.sent_messages || 0;
  const failed = campaignToDisplay?.failed_messages || 0;
  const pending = campaignToDisplay?.pending_messages || 0;
  const percentComplete = total > 0 ? Math.round(((sent + failed) / total) * 100) : 0;

  // Substitute variables helper for live preview
  const getSubstitutedPreview = () => {
    if (!template) return '';
    let preview = template;
    const sampleRecipient = filteredRecipients[0] || { name: 'Recipient Name', phone: '+1234567890', variables: {} };

    preview = preview.replace(/\{\{\s*name\s*\}\}/gi, sampleRecipient.name || 'John Doe');
    preview = preview.replace(/\{\{\s*phone\s*\}\}/gi, sampleRecipient.phone || '+1234567890');

    // Substituting custom variables if present
    Object.entries(sampleRecipient.variables || {}).forEach(([key, val]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
      preview = preview.replace(regex, String(val));
    });

    return preview;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Alerts */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl ${
              alert.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {alert.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span className="text-xs font-bold uppercase tracking-wider">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid 1: Selector, Composer, Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Composer and config (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Selection & Settings */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden bg-black/40">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Campaign Matrix Select</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${twilioConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500 animate-pulse'}`} />
                <span className={`text-[7.5px] font-mono font-bold uppercase ${twilioConfigured ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {twilioConfigured ? `Connected (Twilio Gateway: ${twilioNumber})` : 'Simulation Mode'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedCampaignId}
                onChange={(e) => handleSelectCampaign(e.target.value)}
                className="flex-1 px-4 py-3 bg-black/60 border border-white/5 rounded-xl text-xs text-white/80 focus:outline-none focus:border-cyan-500/40"
              >
                <option value="">[ New Campaign Draft ]</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status})
                  </option>
                ))}
              </select>

              {selectedCampaignId && (
                <button
                  onClick={() => handleDeleteCampaign(selectedCampaignId)}
                  className="px-4 py-3 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Campaign Composer */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden bg-black/40">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                <MessageSquare size={14} className="text-cyan-400" />
                Campaign Template Composer
              </h4>
              <button
                onClick={handleSaveCampaign}
                disabled={isSavingDraft}
                className="px-3 py-1.5 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5"
              >
                {isSavingDraft ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                Save Draft
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. June Launch Notification"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition-colors"
                />
              </div>

              {/* Puter AI Copywriter integration inside composer */}
              <div className="border border-white/5 bg-black/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles size={11} />
                    OMNIAI Copywriter Assistant
                  </span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Ask AI writer: Write a promo text for 30% off automated services..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 px-3 py-2 bg-black/40 border border-white/5 rounded-lg text-[10px] text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40"
                  />
                  <button
                    onClick={handleGenerateAICopy}
                    disabled={isGeneratingAI || !aiPrompt.trim()}
                    className="px-3 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all disabled:opacity-35 flex items-center justify-center gap-1"
                  >
                    {isGeneratingAI ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                    Generate
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Message Template</label>
                  <span className="text-[8px] font-mono text-white/30">Use {"{{name}}"} and {"{{phone}}"} for variables</span>
                </div>
                <textarea 
                  placeholder="Hey {{name}},\n\nGet ready for a massive update! *OMNIAI Outbound* is now live. Click below to secure your spot."
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition-colors resize-none h-44"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Interactive Quick Reply Buttons (Max: 3)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter reply button text... (e.g. Yes, please!)"
                    value={newButtonText}
                    onChange={(e) => setNewButtonText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-black/40 border border-white/5 rounded-xl text-[10px] text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition-colors"
                  />
                  <button
                    onClick={handleAddButton}
                    disabled={buttons.length >= 3 || !newButtonText.trim()}
                    className="px-4 bg-white/5 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl text-[10px] transition-all disabled:opacity-20 flex items-center justify-center font-bold"
                  >
                    Add
                  </button>
                </div>
                {buttons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {buttons.map((btn, idx) => (
                      <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[8.5px] font-bold text-cyan-400">
                        {btn}
                        <button onClick={() => handleRemoveButton(idx)} className="text-white/30 hover:text-white text-[10px]">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Smartphone Live Preview Simulator (Col 5) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-[300px] h-[580px] rounded-[44px] border-4 border-white/10 bg-[#070b12] p-3 flex flex-col relative shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-50 flex justify-center items-center">
              <div className="w-12 h-1 bg-white/10 rounded-full" />
            </div>

            {/* Simulated WhatsApp Header */}
            <div className="bg-[#0f172a] border-b border-white/5 pt-7 pb-3 px-4 flex items-center justify-between text-white relative z-40">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400 font-black">OM</div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold">OMNIAI Outbound</span>
                  <span className="text-[6.5px] text-emerald-400 font-mono">online</span>
                </div>
              </div>
              <Smartphone size={12} className="text-white/40" />
            </div>

            {/* Simulated Messages Screen */}
            <div className="flex-1 p-3 overflow-y-auto no-scrollbar flex flex-col gap-3 relative z-30 select-none bg-[radial-gradient(rgba(6,182,212,0.02)_1px,transparent_1px)] [background-size:16px_16px]">
              
              {template ? (
                <div className="self-start max-w-[85%] bg-[#1e293b] border border-white/5 rounded-2xl rounded-tl-none p-3 shadow-md">
                  <div className="text-[10.5px] text-white/90 leading-relaxed font-light whitespace-pre-wrap select-text">
                    {getSubstitutedPreview()}
                  </div>
                  <span className="text-[6px] text-white/30 font-mono text-right block mt-2">Just now</span>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <MessageSquare size={24} className="text-white/5 mb-3 animate-bounce" />
                  <span className="text-[9px] text-white/20 leading-relaxed max-w-[150px]">
                    Configure your template on the left to see live mockup preview...
                  </span>
                </div>
              )}

              {/* Simulator Reply Buttons */}
              {template && buttons.length > 0 && (
                <div className="flex flex-col gap-2 mt-4 self-center w-full px-2">
                  {buttons.map((btn, idx) => (
                    <button
                      key={idx}
                      className="w-full py-2 bg-[#0f172a] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-white/70 hover:text-cyan-400 text-[8.5px] font-black uppercase tracking-wider rounded-xl transition-all"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 pb-2 text-center text-[7px] text-white/10 select-none font-mono">
              OMNIAI SIMULATOR NODE V1.2
            </div>
          </div>
        </div>

      </div>

      {/* Grid 2: Importer & Recipients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Importer Grid (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 3: Sheets Importer */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden bg-black/40">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
            <div className="mb-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                <FileSpreadsheet size={14} className="text-purple-400" />
                Google Sheets Integration Grid
              </h4>
              <p className="text-[10px] text-white/40 mt-1">
                Enter your Google Sheet URL. The system automatically reads, validates, and deduplicates phone nodes.
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
              <div className="grid grid-cols-4 gap-4 mt-6 border-t border-white/5 pt-4">
                {[
                  { label: 'Found', count: importSummary.total, color: 'text-white' },
                  { label: 'Imported', count: importSummary.imported, color: 'text-purple-400' },
                  { label: 'Duplicates', count: importSummary.duplicates, color: 'text-amber-400' },
                  { label: 'Invalid', count: importSummary.invalid, color: 'text-red-400' }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-black/30 border border-white/5 rounded-xl text-center">
                    <div className="text-[7.5px] font-mono font-black uppercase tracking-wider text-white/30">{stat.label}</div>
                    <div className={`text-sm font-black mt-1 ${stat.color}`}>{stat.count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 4: Broadcast Execution Progress */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden bg-black/40">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex flex-col">
                <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <Play size={13} className="text-cyan-400" />
                  Queue & Broadcast HUD
                </h4>
                <span className="text-[7.5px] font-mono text-white/40 mt-1">
                  Gateway: {twilioConfigured ? `Twilio (${twilioNumber})` : 'Sandbox Simulator'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider border ${
                campaignToDisplay?.status === 'Sending' 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                  : campaignToDisplay?.status === 'Completed'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-white/45'
              }`}>
                {campaignToDisplay?.status || 'Draft'}
              </span>
            </div>

            <div className="space-y-6">
              {/* Progress metrics */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Nodes', val: total, color: 'text-white' },
                  { label: 'Sent', val: sent, color: 'text-emerald-400' },
                  { label: 'Failed', val: failed, color: 'text-red-400' },
                  { label: 'Pending', val: pending, color: 'text-white/45' }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-black/30 border border-white/5 rounded-xl text-center">
                    <div className="text-[7.5px] font-mono font-black uppercase tracking-wider text-white/30">{stat.label}</div>
                    <div className={`text-base font-black mt-1 ${stat.color}`}>{stat.val}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                  <span className="text-white/40">BROADCAST PROGRESS MATRIX</span>
                  <span className="text-cyan-400">{percentComplete}%</span>
                </div>
                <div className="h-2.5 bg-black/60 border border-white/5 rounded-full overflow-hidden p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentComplete}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  />
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendBroadcast}
                disabled={isSending || recipients.length === 0}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                {isSending ? (
                  <><Loader2 size={13} className="animate-spin" /> Broadcasting campaign queue...</>
                ) : (
                  <><Send size={13} /> Deploy WhatsApp Broadcast</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Recipient Grid (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden bg-black/40 min-h-[440px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
                  <Users size={14} className="text-cyan-400" />
                  Target Recipient List
                </h4>
                <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[8px] font-black rounded-lg">
                  {recipients.length} Nodes
                </span>
              </div>

              {/* Search and manual add header */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search phone nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-black/50 border border-white/5 rounded-xl text-[10px] text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40"
                  />
                  <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                </div>

                <button
                  onClick={() => setIsAddingContact(!isAddingContact)}
                  className="px-3 bg-white/5 border border-white/10 hover:border-cyan-500/40 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <Plus size={11} />
                  Add
                </button>
              </div>

              {/* Manual Add Form Overlay */}
              <AnimatePresence>
                {isAddingContact && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleAddManualRecipient}
                    className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3 overflow-hidden"
                  >
                    <div className="text-[8px] font-mono font-black uppercase tracking-wider text-cyan-400">Add phone recipient node</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="Recipient Name"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        className="px-3 py-2 bg-black/60 border border-white/5 rounded-lg text-[10px] text-white"
                      />
                      <input 
                        type="text" 
                        placeholder="+91 98765 43210"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value)}
                        required
                        className="px-3 py-2 bg-black/60 border border-white/5 rounded-lg text-[10px] text-white"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20"
                    >
                      Save Recipient Node
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Recipient Grid Scroll List */}
              <div className="h-[260px] overflow-y-auto no-scrollbar border border-white/5 bg-black/20 rounded-xl p-2 space-y-1.5">
                {filteredRecipients.length > 0 ? (
                  filteredRecipients.map((rec) => (
                    <div key={rec.id} className="p-3 bg-black/30 border border-white/5 hover:border-white/10 rounded-lg flex items-center justify-between text-white/80 group">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-white flex items-center gap-1.5">
                          {rec.name || 'Unnamed Handset'}
                          {rec.status !== 'Pending' && (
                            <span className={`px-1.5 py-0.5 rounded text-[5.5px] font-black uppercase tracking-wider ${
                              rec.status === 'Sent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {rec.status}
                            </span>
                          )}
                        </div>
                        <div className="text-[8px] font-mono text-cyan-400">{rec.phone}</div>
                        
                        {/* Render extra variables if present */}
                        {rec.variables && Object.keys(rec.variables).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(rec.variables).map(([k, v]) => (
                              <span key={k} className="px-1.5 py-0.5 bg-white/[0.03] border border-white/5 rounded text-[5px] font-mono text-white/40">
                                {k}: {String(v)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteRecipient(rec.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-white/25 hover:text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <Users size={24} className="text-white/5 mb-3" />
                    <span className="text-[9px] text-white/20 leading-relaxed max-w-[150px]">
                      No recipient nodes matched the active search matrix.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[8px] font-mono text-white/25 text-center mt-3 select-none">
              SECURE HANDSET METADATA GRID
            </div>
          </div>
        </div>

      </div>

      {/* Grid 3: WhatsApp Outbound Log Ledger */}
      <div className="glass-panel border border-white/5 rounded-[32px] p-8 bg-black/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-6 mb-6 gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
              <Shield size={14} className="text-cyan-400" />
              WhatsApp Outbound Log Ledger
            </h4>
            <p className="text-[9px] text-white/40">
              System-wide real-time delivery audit logging. Click on any row to open the carrier transmission diagnostics popup.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Search delivery logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-black/60 border border-white/5 rounded-xl text-[9px] text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40"
              />
              <Search size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            </div>

            <button
              onClick={fetchLogs}
              disabled={isLoadingLogs}
              title="Refresh Ledger"
              className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/60 hover:text-white transition-colors flex items-center justify-center"
            >
              <RefreshCw size={11} className={isLoadingLogs ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => handleExportCSV(false)}
              className="px-3 py-2 border border-white/5 bg-white/5 hover:border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download size={11} />
              Export
            </button>
            
            {activePortal === 'admin' && (
              <button
                onClick={() => handleExportCSV(true)}
                className="px-3 py-2 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
              >
                <Download size={11} />
                Export All
              </button>
            )}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 text-[8.5px] font-mono font-black uppercase tracking-wider text-white/30">
                <th className="pb-3 pl-3">Handset Phone</th>
                <th className="pb-3">Recipient Name</th>
                <th className="pb-3">Message Snippet</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Dispatched Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-white/[0.01] transition-colors cursor-pointer text-xs font-light text-white/80 group"
                  >
                    <td className="py-4.5 pl-3 font-mono text-[10.5px] text-cyan-400 group-hover:text-white transition-colors">{log.recipient_phone}</td>
                    <td className="py-4.5 font-bold">{log.recipient_name || 'Anonymous Handset'}</td>
                    <td className="py-4.5 text-[11px] max-w-md truncate text-white/60">{log.message_body}</td>
                    <td className="py-4.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-mono font-black uppercase tracking-wider border ${
                        log.status === 'Success' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4.5 text-[10px] text-white/30 font-mono">{new Date(log.sent_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare size={32} className="text-white/5 mb-3" />
                      <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono font-black">
                        No delivery logs recorded in ledger.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog: Carrier Transmission Diagnostics */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel border border-white/5 bg-neutral-900 rounded-[32px] max-w-2xl w-full p-8 space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
              
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">Carrier Diagnostics</h3>
                  <p className="text-[8px] font-mono text-white/30 mt-1">LOG HASH ID: {selectedLog.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-3 py-1 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-lg text-[9px] font-mono uppercase transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Grid data */}
              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                <div>
                  <div className="text-[7.5px] font-mono font-black text-white/30 uppercase tracking-wider">Target Phone Node</div>
                  <div className="text-xs font-bold text-white mt-1">{selectedLog.recipient_phone}</div>
                </div>
                <div>
                  <div className="text-[7.5px] font-mono font-black text-white/30 uppercase tracking-wider">Recipient Name</div>
                  <div className="text-xs font-bold text-white mt-1">{selectedLog.recipient_name || 'Anonymous Handset'}</div>
                </div>
                <div>
                  <div className="text-[7.5px] font-mono font-black text-white/30 uppercase tracking-wider">Delivery Network Status</div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-mono font-black uppercase tracking-wider border ${
                      selectedLog.status === 'Success' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[7.5px] font-mono font-black text-white/30 uppercase tracking-wider">Transmission Time</div>
                  <div className="text-xs font-mono text-white/60 mt-1">{new Date(selectedLog.sent_at).toString()}</div>
                </div>
              </div>

              {/* Message content */}
              <div className="space-y-2">
                <div className="text-[7.5px] font-mono font-black text-white/30 uppercase tracking-wider">Dispatched Message Payload</div>
                <div className="p-5 bg-black/40 border border-white/5 rounded-2xl text-xs text-white/80 leading-relaxed font-light whitespace-pre-wrap max-h-48 overflow-y-auto pr-2">
                  {selectedLog.message_body}
                </div>
              </div>

              {/* Buttons mockup */}
              {selectedLog.buttons && selectedLog.buttons.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[7.5px] font-mono font-black text-white/30 uppercase tracking-wider">Configured Quick Reply Nodes</div>
                  <div className="flex gap-2">
                    {selectedLog.buttons.map((btn, idx) => (
                      <div key={idx} className="px-3.5 py-2 bg-neutral-800 border border-white/5 rounded-xl text-[9px] font-bold text-white/50">
                        {btn}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLog.error_message && (
                <div className="p-4 bg-red-500/5 border border-red-500/15 text-red-400 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={15} className="mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono font-black uppercase tracking-wider">Carrier Dispatch Exception</div>
                    <div className="text-xs font-light text-red-300/85">{selectedLog.error_message}</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
