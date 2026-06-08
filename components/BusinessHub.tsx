"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  Send, 
  Smartphone, 
  Sparkles, 
  Loader2, 
  Zap, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { EmailAutomationHub } from './EmailAutomationHub';
import { WhatsAppAutomationHub } from './WhatsAppAutomationHub';

const TONES = [
  { id: 'professional', name: 'Cybernetic Professional', desc: 'Sleek, polished, authoritative executive tone' },
  { id: 'cold-outbound', name: 'Direct Persuasive', desc: 'Urgently appealing cold outreach hook' },
  { id: 'friendly', name: 'Friendly Strategic', desc: 'Warm, collaborative, tech-savvy startup style' },
  { id: 'supportive', name: 'Resolution Support', desc: 'Calm, troubleshooting-focused client care' }
];

export function BusinessHub() {
  const [activeCategory, setActiveCategory] = useState<'email' | 'whatsapp'>('email');
  const [emailSubTab, setEmailSubTab] = useState<'bulk' | 'ai'>('bulk');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email parameters
  const [emailTo, setEmailTo] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailRole, setEmailRole] = useState("");
  const [emailTopic, setEmailTopic] = useState("");
  const [emailTone, setEmailTone] = useState("professional");
  const [emailLength, setEmailLength] = useState("Medium");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [emailCopied, setEmailCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // WhatsApp parameters
  const [waPhone, setWaPhone] = useState("");
  const [waCampaign, setWaCampaign] = useState("");
  const [waHook, setWaHook] = useState("");
  const [waButtons, setWaButtons] = useState<string[]>(["I'm Interested!", "Unsubscribe"]);
  const [newButtonText, setNewButtonText] = useState("");
  const [generatedWa, setGeneratedWa] = useState("");
  const [waCopied, setWaCopied] = useState(false);
  const [waSent, setWaSent] = useState(false);

  useEffect(() => {
    // Proactively preload Puter.js SDK
    if (typeof window !== "undefined" && !(window as any).puter) {
      console.log("[Puter] Preloading SDK for Business Hub...");
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const chatWithPuter = async (promptText: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
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
          throw new Error("Puter SDK load failed");
        }

        const puter = (window as any).puter;
        const response = await puter.ai.chat(promptText, { model: "gpt-4o-mini" });
        if (response) {
          resolve(response);
        } else {
          throw new Error("Puter did not return content");
        }
      } catch (e: any) {
        reject(e);
      }
    });
  };

  const parseGeneratedEmail = (text: string) => {
    const lines = text.split('\n');
    let subjectStr = '';
    let bodyStr = '';
    
    const subjectLineIndex = lines.findIndex(l => l.toLowerCase().startsWith('subject:'));
    if (subjectLineIndex !== -1) {
      subjectStr = lines[subjectLineIndex].replace(/subject:\s*/i, '').trim();
      bodyStr = lines.filter((_, idx) => idx !== subjectLineIndex).join('\n').trim();
    } else {
      const firstLine = lines.find(l => l.trim().length > 0) || '';
      if (firstLine.length > 0 && firstLine.length < 100) {
        subjectStr = firstLine.trim();
        bodyStr = lines.filter(l => l !== firstLine).join('\n').trim();
      } else {
        subjectStr = "OMNIAI Outbound Message";
        bodyStr = text.trim();
      }
    }
    return { subject: subjectStr, body: bodyStr };
  };

  const handleGenerateEmail = async () => {
    if (!emailTopic.trim()) return;
    setIsGenerating(true);
    setError(null);
    setEmailSent(false);

    const selectedToneName = TONES.find(t => t.id === emailTone)?.name || 'Professional';
    const sysPrompt = `
      You are OMNIAI Executive Copywriter. Write a highly converting business email.
      Recipient: ${emailTo || 'Prospect'} (${emailRole || 'Decision Maker'})
      Core Topic/Offer: ${emailTopic}
      Tone of voice: ${selectedToneName}
      Length requirement: ${emailLength} word count.
      
      Respond with only the final Subject Line and Email Body. Do not include extra comments or introductory notes. Use clean line breaks.
    `;

    try {
      const result = await chatWithPuter(sysPrompt);
      setGeneratedEmail(result);

      // Log activity
      localStorage.setItem('omniai_last_activity', JSON.stringify({
        type: 'Business',
        label: 'Email Campaign Sync',
        content: `Generated copy for recipient: ${emailTo || 'Prospect'}`,
        time: 'Just now'
      }));
      window.dispatchEvent(new Event('omniai_activity_update'));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate email.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWa = async () => {
    if (!waHook.trim()) return;
    setIsGenerating(true);
    setError(null);
    setWaSent(false);

    const sysPrompt = `
      You are OMNIAI Mobile Growth Assistant. Write a short, engaging WhatsApp Broadcast alert.
      Campaign Name: ${waCampaign || 'Promo Broadcast'}
      Main Offer/Hook: ${waHook}
      Target Audience: Customer on Mobile
      
      Instructions:
      - Start with a punchy hook.
      - Keep it under 150 words.
      - Use WhatsApp markdown formatting (e.g. *bold* words, _italics_).
      - Include relevant emojis.
      - Do not output any markdown code blocks, just raw conversational message.
    `;

    try {
      const result = await chatWithPuter(sysPrompt);
      setGeneratedWa(result);

      // Log activity
      localStorage.setItem('omniai_last_activity', JSON.stringify({
        type: 'Business',
        label: 'WhatsApp Broadcast',
        content: `Compiled message for campaign: ${waCampaign || 'Broadcast'}`,
        time: 'Just now'
      }));
      window.dispatchEvent(new Event('omniai_activity_update'));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate WhatsApp alert.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddButton = () => {
    if (newButtonText.trim() && waButtons.length < 3) {
      setWaButtons([...waButtons, newButtonText.trim()]);
      setNewButtonText("");
    }
  };

  const handleRemoveButton = (idx: number) => {
    setWaButtons(waButtons.filter((_, i) => i !== idx));
  };

  const handleCopy = (text: string, type: 'email' | 'wa') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } else {
      setWaCopied(true);
      setTimeout(() => setWaCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-end justify-between">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5">
               <Briefcase size={14} className="text-purple-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Outbound Core</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
               Business Hub<span className="text-[var(--accent-cyan)]">.</span>
            </h2>
            <p className="text-sm text-white/40 max-w-xl leading-relaxed">
               Orchestrate hyper-personalized customer outreach. Generate AI-powered emails and WhatsApp broadcast campaigns in real-time.
            </p>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Selector (Col Span 3) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {[
            { id: 'email', label: 'Email Campaign Studio', desc: 'Outbound sales, pitch generators, and cold support matrices', icon: Mail, color: 'hover:border-purple-500/30' },
            { id: 'whatsapp', label: 'WhatsApp Broadcast Matrix', desc: 'Mobile alerts, campaign hooks, and quick reply triggers', icon: MessageSquare, color: 'hover:border-cyan-500/30' }
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setError(null);
                }}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? 'border-[var(--accent-cyan)] bg-white/[0.03] shadow-[0_0_15px_rgba(0,209,255,0.1)]' 
                    : `border-white/5 bg-black/40 ${cat.color}`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${isActive ? 'bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)]' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    <cat.icon size={18} className={isActive ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-[var(--accent-cyan)]' : 'text-white/80'}`}>
                      {cat.label}
                    </h4>
                    <p className="text-[10px] text-white/40 leading-relaxed mt-2.5">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Box (Col Span 9) */}
        <div className="lg:col-span-9 glass-panel rounded-[32px] border border-white/5 p-8 relative overflow-hidden transition-all duration-500 min-h-[520px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-cyan)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {activeCategory === 'email' ? (
            // Email Campaign Module
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-purple-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white/60">Email Campaign Studio</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEmailSubTab('bulk')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      emailSubTab === 'bulk'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-white/5 text-white/40 border border-transparent hover:text-white'
                    }`}
                  >
                    Bulk Sender
                  </button>
                  <button
                    onClick={() => setEmailSubTab('ai')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      emailSubTab === 'ai'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-white/5 text-white/40 border border-transparent hover:text-white'
                    }`}
                  >
                    AI Writer
                  </button>
                </div>
              </div>

              {emailSubTab === 'bulk' ? (
                <EmailAutomationHub />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs Column */}
                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">1. Recipient Identity</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">1b. Recipient Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. john.doe@example.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">2. Recipient Role/Company</label>
                    <input 
                      type="text" 
                      placeholder="e.g. VP of Product at TechCorp"
                      value={emailRole}
                      onChange={(e) => setEmailRole(e.target.value)}
                      className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">3. Outbound Tone</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TONES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setEmailTone(t.id)}
                          className={`p-3 border rounded-xl text-left transition-all ${
                            emailTone === t.id 
                              ? 'border-purple-500/50 bg-purple-500/10 text-white' 
                              : 'border-white/5 bg-black/40 text-white/40 hover:border-white/20'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider">{t.name}</div>
                          <div className="text-[7.5px] font-mono text-white/40 mt-1 leading-normal">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">4. Length Matrix</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Short (~100w)", "Medium (~250w)", "Long (~400w)"].map(len => (
                        <button
                          key={len}
                          onClick={() => setEmailLength(len)}
                          className={`py-2 border rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                            emailLength === len 
                              ? 'border-purple-500/50 bg-purple-500/10 text-white' 
                              : 'border-white/5 bg-black/40 text-white/40 hover:border-white/20'
                          }`}
                        >
                          {len}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">5. Campaign Topic / Value Proposition</label>
                    <textarea 
                      placeholder="Describe what this campaign offers (e.g. Schedule a demo for OMNIAI database sync tool, which cuts latency by 50%...)"
                      value={emailTopic}
                      onChange={(e) => setEmailTopic(e.target.value)}
                      className="px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors resize-none h-24"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3.5 bg-red-500/5 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <AlertCircle size={14} />
                      Error: {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="flex items-center gap-2 p-3.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <Check size={14} />
                      {successMessage}
                    </div>
                  )}

                  <button
                    onClick={handleGenerateEmail}
                    disabled={isGenerating || !emailTopic.trim()}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <><Loader2 size={14} className="animate-spin" /> Generating Email...</>
                    ) : (
                      <><Sparkles size={14} /> Generate Outbound Email</>
                    )}
                  </button>
                </div>

                {/* Output/Preview Column */}
                <div className="flex flex-col h-full bg-black/20 border border-white/5 rounded-2xl p-6 min-h-[400px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40">Synthesized Email Output</span>
                    {generatedEmail && (
                      <button
                        onClick={() => handleCopy(generatedEmail, 'email')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-colors text-white/80 border border-white/5"
                      >
                        {emailCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {emailCopied ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>

                  {generatedEmail ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="text-xs text-white/80 leading-relaxed font-light whitespace-pre-wrap select-text h-[350px] overflow-y-auto pr-2 no-scrollbar">
                        {generatedEmail}
                      </div>

                      <div className="pt-4 border-t border-white/5 mt-4">
                        <button
                          onClick={async () => {
                            if (!emailAddress.trim()) {
                              setError("Recipient email address is required to dispatch confirmation protocols.");
                              return;
                            }
                            setIsSendingEmail(true);
                            setError(null);
                            setSuccessMessage(null);
                            try {
                              const parsed = parseGeneratedEmail(generatedEmail);
                              const res = await fetch('/api/send-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  type: 'raw',
                                  email: emailAddress.trim(),
                                  subject: parsed.subject,
                                  body: parsed.body
                                })
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                setEmailSent(true);
                                setSuccessMessage(data.message || "Email campaign dispatched successfully!");
                                
                                // Log activity
                                localStorage.setItem('omniai_last_activity', JSON.stringify({
                                  type: 'Business',
                                  label: 'AI Outbound Email',
                                  content: `Sent email to ${emailAddress.trim()}`,
                                  time: 'Just now'
                                }));
                                window.dispatchEvent(new Event('omniai_activity_update'));
                                
                                setTimeout(() => {
                                  setEmailSent(false);
                                  setSuccessMessage(null);
                                }, 6000);
                              } else {
                                setError(data.error || data.message || "Failed to send email.");
                              }
                            } catch (err: any) {
                              setError(err.message || "An unexpected error occurred.");
                            } finally {
                              setIsSendingEmail(false);
                            }
                          }}
                          disabled={isSendingEmail}
                          className={`w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                            emailSent 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : 'bg-white/5 border-white/10 hover:border-white/20 text-white'
                          }`}
                        >
                          {isSendingEmail ? (
                            <><Loader2 size={14} className="animate-spin" /> Transmitting...</>
                          ) : emailSent ? (
                            <><Check size={14} /> Outbound Sent!</>
                          ) : (
                            <><Send size={14} /> Send Campaign via OMNIAI Node</>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                      <Mail size={32} className="text-white/10 mb-4 animate-bounce" />
                      <p className="text-xs text-white/30 font-light max-w-[240px]">
                        Fill out the parameters on the left and synthesize your custom email.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <WhatsAppAutomationHub />
        )}

        </div>
      </div>

    </div>
  );
}
