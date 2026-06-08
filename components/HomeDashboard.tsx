"use client";
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Zap, 
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  BrainCircuit,
  Fingerprint,
  Users,
  Shield,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function HomeDashboard({ 
  currentUser: propUser, 
  onNavigate,
  globalPortal = 'admin'
}: { 
  currentUser?: { name: string; email: string } | null; 
  onNavigate?: (module: string) => void;
  globalPortal?: 'user' | 'admin';
}) {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(propUser || null);
  const [greeting, setGreeting]         = useState("Good Morning");
  const [efficiency, setEfficiency]     = useState(0);
  const [revenue, setRevenue]           = useState(0);
  const [tasks, setTasks]               = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) {
      try {
        const saved = localStorage.getItem('omniai_current_user');
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to restore session in dashboard", e);
      }
    }
  }, [currentUser]);

  // Dynamic greeting based on current local hour
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Good Morning");
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good Afternoon");
    } else if (hours >= 17 && hours < 23) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  // Sync tasks list with globalPortal
  useEffect(() => {
    if (globalPortal === 'admin') {
      setTasks([
        { id: 1, text: 'Audit WhatsApp Campaign Logs', completed: false },
        { id: 2, text: 'Optimize SMTP Relay Latency', completed: false },
        { id: 3, text: 'Review Webhook Failover Triggers', completed: false },
        { id: 4, text: 'Verify SSL Handshake Node-C', completed: false }
      ]);
    } else {
      setTasks([
        { id: 1, text: 'Approve Tokyo Q4 Travel Plan', completed: false },
        { id: 2, text: 'Review Recent Memory Synapses', completed: false },
        { id: 3, text: 'Generate Q4 Team Video Pitch', completed: false },
        { id: 4, text: 'Confirm Ritz Carlton Malibu booking', completed: false }
      ]);
    }
  }, [globalPortal]);

  // Operational metrics count-up animations on load
  useEffect(() => {
    let currentEff = 0;
    const effInterval = setInterval(() => {
      currentEff += 2.5;
      if (currentEff >= 99.8) {
        setEfficiency(99.8);
        clearInterval(effInterval);
      } else {
        setEfficiency(parseFloat(currentEff.toFixed(1)));
      }
    }, 20);

    let currentRev = 0;
    const revInterval = setInterval(() => {
      currentRev += 380;
      if (currentRev >= 12480) {
        setRevenue(12480);
        clearInterval(revInterval);
      } else {
        setRevenue(currentRev);
      }
    }, 20);

    return () => {
      clearInterval(effInterval);
      clearInterval(revInterval);
    };
  }, []);

  // Dynamic sound synthesizer inside the Dashboard
  const playDashboardChime = (type: 'complete' | 'uncheck') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'complete') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.12); // D6
        
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
      } else if (type === 'uncheck') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, ctx.currentTime); // G4
        osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 0.25); // C4
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        playDashboardChime(nextState ? 'complete' : 'uncheck');
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const userName = currentUser?.name || "Guest";
  const completedCount = tasks.filter(t => t.completed).length;

  // Role-based daily summaries
  const summaryItems = globalPortal === 'admin' 
    ? [
        { label: 'WhatsApp API', value: 'Twilio Gateway Active', status: 'success' },
        { label: 'SMTP Node', value: 'Gmail Server Verified', status: 'success' },
        { label: 'System Load', value: `${efficiency}% Efficiency`, status: 'active' },
      ]
    : [
        { label: 'Chat Engine', value: 'Neural Core Active', status: 'success' },
        { label: 'Memory Vault', value: '124 Active Synapses', status: 'success' },
        { label: 'Audio Persona', value: 'Omni-Alpha (M) Online', status: 'active' },
      ];

  // Role-based calendar events
  const calendarEvents = globalPortal === 'admin'
    ? [
        { time: '09:00', label: 'Outbound Swarm Audit', type: 'Security' },
        { time: '11:00', label: 'WhatsApp Campaign Review', type: 'Marketing' },
        { time: '15:30', label: 'SMTP Log Health Check', type: 'Maintenance' },
      ]
    : [
        { time: '10:00', label: 'Biometric Voice Sync', type: 'Personal' },
        { time: '16:30', label: 'Tokyo Travel Finalize', type: 'Travel' },
        { time: '20:00', label: 'Dining: Nobu Malibu', type: 'Service' },
      ];

  // Role-based insights strings
  const insightsLabel = globalPortal === 'admin' ? 'Operational Swarm Index' : 'Neural Memory Cache';
  const insightsQuote = globalPortal === 'admin'
    ? "System performance has peaked due to neural node optimization in the AP-South region. All automation swarms are healthy."
    : "Memory vault index optimized. Holographic sync completed successfully across all secure local cache sectors.";
  
  const metricTitle = globalPortal === 'admin' ? 'Predictive Growth' : 'Holographic Visuals';
  const metricValue = globalPortal === 'admin' ? `+$${revenue.toLocaleString()}` : '12,480 files';
  const metricDesc = globalPortal === 'admin' 
    ? 'Estimated revenue for Q4 based on current swarm trends.' 
    : 'Synced visual components and generated multimedia assets.';
  const metricIcon = globalPortal === 'admin' ? <TrendingUp size={14} className="text-green-500" /> : <Activity size={14} className="text-[var(--accent-cyan)]" />;

  // Role-based priority notifications
  const notifications = globalPortal === 'admin'
    ? [
        { label: 'Security', content: 'New login from Tokyo node.', type: 'AlertCircle', color: 'text-red-500' },
        { label: 'Webhook Relay', content: 'n8n Chat webhook failover active.', type: 'Zap', color: 'text-[var(--accent-cyan)]' },
      ]
    : [
        { label: 'Biometrics', content: 'Vocal calibration model updated.', type: 'Zap', color: 'text-green-400' },
        { label: 'Booking Sync', content: 'Ritz Paris availability updated.', type: 'Zap', color: 'text-[var(--accent-cyan)]' },
      ];

  return (
    <div className="flex-1 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto">
      
      {/* Top Section: Greeting & Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-white/5 bg-white/[0.01]">
             {globalPortal === 'admin' ? <Shield size={12} className="text-purple-400" /> : <Sparkles size={12} className="text-yellow-500 animate-pulse" />}
             <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40">
               {globalPortal === 'admin' ? 'System Swarm Core Controller' : 'Intelligence Briefing'}
             </span>
           </div>
           <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.05] text-white/90">
             {greeting}, <br />
             <span className="font-extrabold text-hologram">{userName}.</span>
           </h2>
           <p className="text-xs md:text-sm text-white/35 font-medium max-w-xl leading-relaxed tracking-wide">
             {globalPortal === 'admin' 
               ? `Console active. You have completed ${completedCount} of ${tasks.length} system nodes. Twilio WhatsApp gateway verified.`
               : `System online. You have completed ${completedCount} of ${tasks.length} personal tasks. Keep up the high efficiency index!`
             }
           </p>
        </div>
        
        {/* Daily Summary Card */}
        <div className="glass-panel p-8 rounded-[24px] border border-white/5 bg-white/[0.01] w-full lg:w-80 space-y-6">
           <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 border-b border-white/5 pb-3">Daily Summary</h3>
           <div className="space-y-4">
              {summaryItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className={cn(
                     "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                     item.status === 'success' ? 'bg-green-500 text-green-500' : 'bg-[var(--accent-cyan)] text-[var(--accent-cyan)]'
                   )} />
                   <div>
                      <div className="text-[10px] font-bold text-white/80">{item.value}</div>
                      <div className="text-[7px] font-bold uppercase tracking-wider text-white/20">{item.label}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Middle Left: Tasks & Calendar */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tasks List */}
              <div className="glass-panel p-8 rounded-[24px] border border-white/5 bg-white/[0.01] hover:border-purple-500/10">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-green-500" />
                       <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                         {globalPortal === 'admin' ? 'Swarm System Tasks' : 'Active Tasks'}
                       </h3>
                    </div>
                    <span className="text-[7px] font-bold uppercase tracking-widest text-white/20">{tasks.length - completedCount} Remaining</span>
                 </div>
                 <div className="space-y-4">
                    {tasks.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => handleToggleTask(task.id)}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                         <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center transition-all",
                              task.completed 
                                ? "border-green-500/50 bg-green-500/10" 
                                : "border-white/10 group-hover:border-[var(--accent-cyan)]"
                            )}>
                               <div className={cn(
                                 "w-1.5 h-1.5 rounded-sm transition-all",
                                 task.completed ? "bg-green-500" : "bg-white/5 group-hover:bg-[var(--accent-cyan)]"
                               )} />
                            </div>
                            <span className={cn(
                              "text-[11px] font-medium transition-all duration-300",
                              task.completed 
                                ? "text-white/20 line-through italic" 
                                : "text-white/40 group-hover:text-white"
                            )}>
                              {task.text}
                            </span>
                         </div>
                         <ArrowUpRight size={12} className={cn("transition-all", task.completed ? "text-white/5" : "text-white/5 group-hover:text-white")} />
                      </div>
                    ))}
                 </div>
              </div>

              {/* Calendar Overview */}
              <div className="glass-panel p-8 rounded-[24px] border border-white/5 bg-white/[0.01]">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                       <CalendarIcon size={16} className="text-purple-500" />
                       <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                         {globalPortal === 'admin' ? 'Swarm Calendar' : 'Neural Calendar'}
                       </h3>
                    </div>
                 </div>
                 <div className="space-y-6">
                    {calendarEvents.map((event, i) => (
                      <div key={i} className="flex gap-4 items-start">
                         <div className="text-[9px] font-mono text-[var(--accent-cyan)]/60 pt-0.5">{event.time}</div>
                         <div>
                            <div className="text-[11px] font-medium text-white/80 mb-0.5">{event.label}</div>
                            <div className="text-[7px] font-bold uppercase tracking-wider text-white/20">{event.type}</div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* AI Insights Panel */}
           <div className="glass-panel p-8 rounded-[24px] border border-white/5 bg-white/[0.01] hover:border-[var(--accent-cyan)]/15">
              <div className="flex items-center gap-3 mb-8">
                 <BrainCircuit size={16} className="text-[var(--accent-cyan)]" />
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">AI Intelligence Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[8px] font-bold uppercase tracking-wider text-white/20">{insightsLabel}</span>
                       <span className="text-base font-black tracking-tight text-[var(--accent-cyan)]">{efficiency}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div 
                          className="h-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)] transition-all duration-1000 ease-out" 
                          style={{ width: `${efficiency}%` }}
                       />
                    </div>
                    <p className="text-[10px] text-white/30 leading-relaxed italic">
                      "{insightsQuote}"
                    </p>
                 </div>
                 <div className="glass-panel p-5 rounded-2xl bg-white/[0.01] border-white/5 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                         {metricIcon}
                         <span className="text-[8px] font-bold uppercase tracking-wider text-white/35">{metricTitle}</span>
                      </div>
                      <div className="text-xl font-black tracking-tight text-white/80">
                        {metricValue}
                      </div>
                    </div>
                    <div className="text-[8px] font-bold tracking-wide text-white/20 mt-3">{metricDesc}</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Middle Right: Notifications & Suggestions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           
           <section className="glass-panel p-8 rounded-[24px] border border-white/5 bg-white/[0.01] animated-border">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <Zap size={18} className="text-amber-500" />
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Priority Notifications</h3>
                   </div>
                   <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[9px] font-bold text-amber-500">{notifications.length}</div>
                </div>
                <div className="space-y-4">
                   {notifications.map((notif, i) => (
                     <div key={i} className="flex gap-3 p-3 rounded-xl border border-white/5 hover:bg-white/[0.02] hover:border-white/10 transition-all cursor-pointer">
                        <div className={cn("mt-0.5", notif.color)}>
                           <AlertCircle size={12} />
                        </div>
                        <div>
                           <div className="text-[10px] font-bold text-white/80">{notif.label}</div>
                           <div className="text-[9px] text-white/35 leading-tight">{notif.content}</div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
           </section>

           {/* Smart Suggestions */}
           <section className="glass-panel p-8 rounded-[24px] border border-white/5 bg-white/[0.01] flex-1">
              <div className="flex items-center gap-3 mb-8">
                <Zap size={16} className="text-[var(--accent-cyan)]" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Smart Suggestions</h3>
              </div>
              <div className="space-y-4">
                 {globalPortal === 'admin' ? (
                   <>
                     <div className="p-5 rounded-[16px] bg-purple-500/5 border border-purple-500/10 group cursor-pointer hover:border-purple-500/25 transition-all" onClick={() => onNavigate?.('BusinessHub')}>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-purple-400 mb-2">Outbound Swarm</div>
                        <div className="text-[11px] font-bold text-white/90 group-hover:text-purple-300 transition-colors">Automate Broadcast Campaigns?</div>
                        <p className="text-[9px] text-white/25 mt-2 leading-relaxed">Integrate Twilio API gateway with n8n scheduler nodes for automated marketing swarms.</p>
                        <button className="mt-3 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300">
                           Open Business Hub <ChevronRight size={10} />
                        </button>
                     </div>
                     
                     <div className="p-5 rounded-[16px] bg-[var(--accent-cyan)]/5 border border-[var(--accent-cyan)]/10 group cursor-pointer hover:border-[var(--accent-cyan)]/25 transition-all" onClick={() => onNavigate?.('Automation')}>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-[var(--accent-cyan)]/60 mb-2">Workflow Optimizer</div>
                        <div className="text-[11px] font-bold text-white/90 group-hover:text-[var(--accent-cyan)] transition-colors">Optimize n8n Chat Webhook?</div>
                        <p className="text-[9px] text-white/25 mt-2 leading-relaxed">Chat queries currently averaging 890ms. Enable failover cache node connector?</p>
                        <button className="mt-3 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--accent-cyan)] hover:underline">
                           Open Automation Canvas <ChevronRight size={10} />
                        </button>
                     </div>
                   </>
                 ) : (
                   <>
                     <div className="p-5 rounded-[16px] bg-purple-500/5 border border-purple-500/10 group cursor-pointer hover:border-purple-500/25 transition-all" onClick={() => onNavigate?.('VideoGen')}>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-purple-400 mb-2">Creative Swarm</div>
                        <div className="text-[11px] font-bold text-white/90 group-hover:text-purple-300 transition-colors">Generate Q4 Video Presentation?</div>
                        <p className="text-[9px] text-white/25 mt-2 leading-relaxed">Generate cinematic slides and digital audio narratives inside the Video Gen studio.</p>
                        <button className="mt-3 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300">
                           Open Video Generator <ChevronRight size={10} />
                        </button>
                     </div>
                     
                     <div className="p-5 rounded-[16px] bg-[var(--accent-cyan)]/5 border border-[var(--accent-cyan)]/10 group cursor-pointer hover:border-[var(--accent-cyan)]/25 transition-all" onClick={() => onNavigate?.('Booking')}>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-[var(--accent-cyan)]/60 mb-2">Booking Concierge</div>
                        <div className="text-[11px] font-bold text-white/90 group-hover:text-[var(--accent-cyan)] transition-colors">Tokyo Flight Price Drop</div>
                        <p className="text-[9px] text-white/25 mt-2 leading-relaxed">Prices for JAL flight #402 fell by 14%. Reserve hotel concierge?</p>
                        <button className="mt-3 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-[var(--accent-cyan)] hover:underline">
                           Open Booking Hub <ChevronRight size={10} />
                        </button>
                     </div>
                   </>
                 )}
              </div>
           </section>
        </div>

      </div>

    </div>
  );
}
