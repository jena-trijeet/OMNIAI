"use client";
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Mic, 
  Share2, 
  FileText, 
  Globe, 
  Plus, 
  Play, 
  Activity, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Search, 
  CheckCircle2, 
  Sliders, 
  Database, 
  Cpu, 
  ShieldAlert, 
  ChevronRight,
  RefreshCw,
  Layers,
  ArrowUpRight,
  X,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Category details
const CATEGORIES = [
  {
    id: 'email',
    title: 'Email Automation',
    desc: 'Draft contextual replies, categorize incoming inquiries, and manage pipeline follow-ups with semantic logic.',
    icon: Mail,
    status: 'ACTIVE',
    glowColor: 'shadow-purple-500/20 border-purple-500/30 text-purple-400',
    stat: '1.2s avg response',
    runs: '8.1k executions'
  },
  {
    id: 'booking',
    title: 'Booking Agent',
    desc: 'Coordinate client reservations, auto-resolve scheduling conflicts, and synchronize calendar engines in real time.',
    icon: Calendar,
    status: 'STANDBY',
    glowColor: 'shadow-blue-500/20 border-blue-500/30 text-blue-400',
    stat: '0 conflicts hit',
    runs: '3.2k executions'
  },
  {
    id: 'voice',
    title: 'AI Voice Assistant',
    desc: 'Power high-fidelity natural neural speech agents to manage outbound support and voice calls automatically.',
    icon: Mic,
    status: 'ACTIVE',
    glowColor: 'shadow-cyan-500/20 border-cyan-500/30 text-cyan-400',
    stat: 'ElevenLabs powered',
    runs: '5.9k executions'
  },
  {
    id: 'social',
    title: 'Social Media Automation',
    desc: 'Instantly generate high-impact post copies, schedule publications, and moderate comments using brand memory.',
    icon: Share2,
    status: 'STANDBY',
    glowColor: 'shadow-purple-500/20 border-purple-500/30 text-purple-400',
    stat: 'Engagement up 42%',
    runs: '9.4k executions'
  },
  {
    id: 'workflow',
    title: 'Business Workflow',
    desc: 'Bridge databases, ERP pipes, and CRM frameworks with advanced conditional logic and cognitive task routing.',
    icon: Zap,
    status: 'ACTIVE',
    glowColor: 'shadow-blue-500/20 border-blue-500/30 text-blue-400',
    stat: '24 nodes mapped',
    runs: '18.2k executions'
  },
  {
    id: 'file',
    title: 'AI File Processing',
    desc: 'Summarize extensive documents, extract structured telemetry from PDFs, and tag spreadsheet data dynamically.',
    icon: FileText,
    status: 'ACTIVE',
    glowColor: 'shadow-cyan-500/20 border-cyan-500/30 text-cyan-400',
    stat: '100% extract success',
    runs: '4.8k executions'
  },
  {
    id: 'website',
    title: 'Website Automation',
    desc: 'Scrape complex web pages, populate form structures, and execute low-level headless browser flows.',
    icon: Globe,
    status: 'PAUSED',
    glowColor: 'shadow-purple-500/20 border-purple-500/30 text-purple-400',
    stat: 'Auto-retry active',
    runs: '2.5k executions'
  }
];

export function AutomationCanvas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'completed'>('idle');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'Canvas' | 'Analytics' | 'Logs'>('Canvas');
  const [activityFeed, setActivityFeed] = useState([
    { id: 1, text: "Email Lead qualification complete for Node #04", time: "Just now", type: "success" },
    { id: 2, text: "ElevenLabs Vocal Proxy synthesized voice stream successfully", time: "2 min ago", type: "info" },
    { id: 3, text: "CRM Lead Pipeline synchronized with local DB", time: "5 min ago", type: "success" },
    { id: 4, text: "Website headless scraping paused on cloud node #02", time: "12 min ago", type: "warn" }
  ]);
  const [executionCount, setExecutionCount] = useState(25842);
  const [successRate, setSuccessRate] = useState(99.8);

  // Periodic simulation for real-time operating system feel
  useEffect(() => {
    const interval = setInterval(() => {
      // Tick executions slightly
      setExecutionCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      
      // Float success rate slightly to look super organic
      setSuccessRate(prev => {
        const delta = (Math.random() - 0.5) * 0.05;
        const next = prev + delta;
        return Number(Math.max(99.6, Math.min(99.9, next)).toFixed(2));
      });

      // Add dynamic event logs periodically
      const events = [
        { text: "ElevenLabs TTS generated high-fidelity custom vocal link", type: "info" },
        { text: "Automated business workflow executed successfully", type: "success" },
        { text: "Neural sentiment analysis parsed incoming email package", type: "success" },
        { text: "Database lookup optimized for user request node", type: "info" }
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setActivityFeed(prev => [
        { id: Date.now(), text: randomEvent.text, time: "Just now", type: randomEvent.type },
        ...prev.slice(0, 4)
      ]);

    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const triggerDeploy = () => {
    window.open("http://localhost:8080/", "_blank");
    setDeployStatus('deploying');
    setTimeout(() => {
      setDeployStatus('completed');
      setTimeout(() => setDeployStatus('idle'), 3000);
    }, 2500);
  };

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-8 relative p-1 pb-24 overflow-x-hidden no-scrollbar">
      
      {/* 1. MAIN AUTOMATION HUB CONTENT (Left 8-col equivalent) */}
      <div className="flex-1 flex flex-col gap-12 max-w-full">
        
        {/* HERO SECTION */}
        <section className="relative glass-panel-deep rounded-[40px] border border-white/5 overflow-hidden p-8 md:p-12 shadow-[0_0_50px_rgba(139,92,246,0.05)] group">
          {/* Animated Matrix Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:32px_32px] group-hover:scale-105 transition-transform duration-[4000ms]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Futuristic Telemetry Label */}
          <div className="flex items-center gap-3 mb-6">
             <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-ping" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--accent-cyan)]">COGNITIVE ENGINE v6.4 ACTIVE</span>
          </div>

          <div className="max-w-2xl relative z-10 space-y-4">
             <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] text-hologram">
               AI Automation.
             </h1>
             <p className="text-sm md:text-base text-white/50 font-normal leading-relaxed tracking-wide">
               Automate conversations, complex workflows, custom business operations, and recursive digital tasks using the autonomous OMNIAI cognitive swarm.
             </p>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-10 relative z-10">
             <button 
               onClick={triggerDeploy}
               className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center gap-3"
             >
                <Plus size={16} />
                Create Automation
             </button>
             <button 
               onClick={() => alert("Launching Swarm Node Explorer...")}
               className="px-8 py-4 glass-panel border-white/10 hover:border-white/20 text-white/80 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center gap-3"
             >
                <Sparkles size={14} className="text-purple-400" />
                Explore AI Agents
             </button>
          </div>

          {/* Local Gateway Link Info */}
          <div className="mt-4 text-[10px] font-semibold text-white/40 tracking-wider flex items-center gap-2 relative z-10">
             <span>Local Gateway Uplink:</span>
             <a 
               href="http://localhost:8080/" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-[var(--accent-cyan)] hover:underline flex items-center gap-1 font-mono font-bold transition-all hover:text-[var(--accent-cyan)]/80"
             >
                http://localhost:8080/ <ArrowUpRight size={10} />
             </a>
          </div>
        </section>

        {/* AUTOMATION CATEGORY CARDS */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
             <div className="space-y-2">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Operational Swarms</div>
                <h3 className="text-2xl font-black tracking-tight uppercase">Automation Categories</h3>
             </div>
             
             {/* Glowing Realtime Search Input */}
             <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="FILTER SWARM NODES..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <AnimatePresence>
               {filteredCategories.map((cat, idx) => (
                 <motion.div 
                   key={cat.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.5, delay: idx * 0.05 }}
                   onClick={() => setSelectedCategory(cat)}
                   className={cn(
                     "glass-panel p-8 rounded-[36px] border border-white/5 hover:border-white/10 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-80 cursor-pointer shadow-lg hover:shadow-2xl",
                     `hover:${cat.glowColor.split(' ')[0]}`
                   )}
                 >
                    {/* Corner decorative light */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full group-hover:bg-purple-500/10 transition-colors pointer-events-none" />

                    <div>
                      <div className="flex justify-between items-start mb-6">
                         {/* Glowing Futuristic Icon container */}
                         <div className={cn(
                           "w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                           cat.glowColor.split(' ').slice(1).join(' ')
                         )}>
                            <cat.icon size={26} strokeWidth={1.5} />
                         </div>

                         {/* Pulse active status pill */}
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full animate-pulse",
                              cat.status === 'ACTIVE' ? 'bg-green-500' :
                              cat.status === 'STANDBY' ? 'bg-yellow-500' : 'bg-white/20'
                            )} />
                            <span className="text-[7px] font-black tracking-widest text-white/40 uppercase">{cat.status}</span>
                         </div>
                      </div>

                      <h4 className="text-xl font-black text-white group-hover:text-[var(--accent-cyan)] transition-colors mb-3 leading-none">{cat.title}</h4>
                      <p className="text-[11px] text-white/40 leading-relaxed font-normal tracking-wide">{cat.desc}</p>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                       <div className="space-y-1">
                          <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{cat.runs}</div>
                          <div className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">{cat.stat}</div>
                       </div>
                       
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setSelectedCategory(cat);
                         }}
                         className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                       >
                          <ArrowUpRight size={16} />
                       </button>
                    </div>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        </section>

        {/* AI WORKFLOW VISUALIZER */}
        <section className="space-y-8">
          <div className="space-y-2">
             <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20"> Swarm Pipelines</div>
             <h3 className="text-2xl font-black tracking-tight uppercase">Interactive Workflow Visualizer</h3>
          </div>

          <div className="relative glass-panel rounded-[48px] border border-white/5 bg-[#010101]/20 overflow-hidden p-8 md:p-12 min-h-[460px] flex flex-col justify-between group">
             {/* Dot Matrix grid backdrop */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:30px_30px]" />
             
             {/* Pulsing glow underlay */}
             <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

             {/* Connection SVG curves with sliding light dots */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block">
               <defs>
                 <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
                   <stop offset="50%" stopColor="#00d1ff" stopOpacity="0.8" />
                   <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                 </linearGradient>
               </defs>

               {/* Connector Line 1: User -> Brain */}
               <path d="M 190 230 Q 300 230, 360 230" stroke="url(#purpleGradient)" strokeWidth="2.5" fill="transparent" strokeDasharray="8 8">
                 <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4s" repeatCount="indefinite" />
               </path>
               
               {/* Connector Line 2: Brain -> Logic */}
               <path d="M 520 230 Q 590 230, 640 230" stroke="url(#purpleGradient)" strokeWidth="2.5" fill="transparent" strokeDasharray="8 8">
                 <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4s" repeatCount="indefinite" />
               </path>

               {/* Connector Line 3: Logic -> Response */}
               <path d="M 800 230 Q 860 230, 920 230" stroke="url(#purpleGradient)" strokeWidth="2.5" fill="transparent" strokeDasharray="8 8">
                 <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4s" repeatCount="indefinite" />
               </path>

               {/* Signal Light Particles traversing the paths */}
               <circle r="4" fill="var(--accent-cyan)">
                 <animateMotion dur="4s" repeatCount="indefinite" path="M 190 230 Q 300 230, 360 230" />
               </circle>
               <circle r="4" fill="var(--accent-purple)">
                 <animateMotion dur="4s" repeatCount="indefinite" path="M 520 230 Q 590 230, 640 230" />
               </circle>
               <circle r="4" fill="var(--accent-cyan)">
                 <animateMotion dur="4s" repeatCount="indefinite" path="M 800 230 Q 860 230, 920 230" />
               </circle>
             </svg>

             {/* Workflow Nodes Grid */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-20 items-center justify-between my-auto">
                
                {/* Node 1: Trigger */}
                <div className="glass-panel p-6 rounded-3xl border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:scale-[1.03] transition-all text-center flex flex-col items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <MessageSquare size={20} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] font-black uppercase tracking-wider">User Message</div>
                      <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Trigger Input</div>
                   </div>
                </div>

                {/* Node 2: Brain Processor */}
                <div className="glass-panel p-6 rounded-3xl border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/40 hover:scale-[1.03] transition-all text-center flex flex-col items-center gap-3 border-y-2 border-y-cyan-500/30">
                   <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 animate-pulse">
                      <Cpu size={20} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] font-black uppercase tracking-wider text-[var(--accent-cyan)]">OMNIAI Brain</div>
                      <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Cognitive SWARM</div>
                   </div>
                </div>

                {/* Node 3: Filter Logic */}
                <div className="glass-panel p-6 rounded-3xl border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 hover:scale-[1.03] transition-all text-center flex flex-col items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Sliders size={20} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] font-black uppercase tracking-wider">Business Logic</div>
                      <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Conditions Node</div>
                   </div>
                </div>

                {/* Node 4: Action response */}
                <div className="glass-panel p-6 rounded-3xl border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:scale-[1.03] transition-all text-center flex flex-col items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <Zap size={20} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-[12px] font-black uppercase tracking-wider">Auto-Response</div>
                      <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Action Outcome</div>
                   </div>
                </div>

             </div>

             {/* Workflow Control Overlay info */}
             <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/20">
                <span className="flex items-center gap-2"><Clock size={12} className="text-purple-400" /> Active Latency: 1.25s</span>
                <span className="text-[var(--accent-cyan)]">Swarm pipeline synchronized</span>
             </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="space-y-8">
          <div className="space-y-2">
             <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Swarm Capabilities</div>
             <h3 className="text-2xl font-black tracking-tight uppercase">High-Tech Highlights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { title: "AI Decision Making", desc: "Advanced vector context models qualify criteria autonomously.", icon: Cpu },
               { title: "Multi-Agent Automation", desc: "Collaborating swarms split larger tasks into micro-steps.", icon: Layers },
               { title: "Realtime AI Responses", desc: "Sub-second streaming text generation via local neural hubs.", icon: Activity },
               { title: "Smart Memory", desc: "Retains cross-session user states and CRM variables securely.", icon: Database },
               { title: "Voice AI Control", desc: "Deploy natural auditory voice channels via integrated ElevenLabs.", icon: Mic },
               { title: "Cross-platform Integration", desc: "Bridges SMS, Emails, and ERP pipes under one core.", icon: Globe }
             ].map((feat, i) => (
               <div key={i} className="glass-panel p-6 rounded-3xl border-white/5 hover:border-purple-500/20 hover:bg-white/[0.01] transition-all duration-300 relative group">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                     <feat.icon size={20} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-white mb-2">{feat.title}</h4>
                  <p className="text-[11px] text-white/30 leading-relaxed font-normal">{feat.desc}</p>
               </div>
             ))}
          </div>
        </section>

      </div>

      {/* 2. REAL-TIME ACTIVITY PANEL (Right 4-col equivalent) */}
      <div className="w-full xl:w-96 flex flex-col gap-8 shrink-0">
        
        {/* Real-time Telemetry Panel */}
        <section className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/[0.01] space-y-8 relative overflow-hidden">
           {/* Glow top right decorator */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

           <div className="flex items-center gap-3">
              <Activity size={18} className="text-[var(--accent-cyan)] animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">Swarm Telemetry</h3>
           </div>

           {/* Metrics List */}
           <div className="space-y-6">
              {/* Active Nodes */}
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                 <div className="space-y-1">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Active Swarms</span>
                    <div className="text-xl font-black tracking-tight">8 / 8 Node Blocks</div>
                 </div>
                 <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[8px] font-black tracking-widest border border-green-500/20">
                    100% ONLINE
                 </div>
              </div>

              {/* Execution Telemetry counter */}
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                 <div className="space-y-1">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Total Executions</span>
                    <div className="text-xl font-black tracking-tight font-mono">{executionCount.toLocaleString()}</div>
                 </div>
                 <div className="text-[9px] font-bold text-cyan-400 font-mono">+12.4%</div>
              </div>

              {/* Success Rate Telemetry */}
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                 <div className="space-y-1">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Success Index</span>
                    <div className="text-xl font-black tracking-tight font-mono">{successRate}%</div>
                 </div>
                 <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[8px] font-black tracking-widest border border-cyan-500/20">
                    OPTIMAL
                 </div>
              </div>
           </div>

           {/* Real-time Activity Feed */}
           <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Execution Logs</div>
              
              <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
                 <AnimatePresence initial={false}>
                   {activityFeed.map((log) => (
                     <motion.div 
                       key={log.id}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start hover:bg-white/10 transition-colors"
                     >
                        <span className={cn(
                          "w-2 h-2 rounded-full shrink-0 mt-1.5 animate-pulse",
                          log.type === 'success' ? 'bg-green-500' :
                          log.type === 'warn' ? 'bg-yellow-500' : 'bg-cyan-500'
                        )} />
                        <div className="space-y-1">
                           <p className="text-[9.5px] text-white/70 font-semibold leading-relaxed tracking-wide">{log.text}</p>
                           <span className="text-[7.5px] font-bold text-white/20 uppercase tracking-widest">{log.time}</span>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>
           </div>
        </section>

        {/* Neural Network Visualizer Stats */}
        <section className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/[0.01] space-y-6">
           <div className="flex items-center gap-3">
              <TrendingUp size={18} className="text-purple-400" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">Neural Engine Loads</h3>
           </div>
           
           <div className="space-y-4">
              <div className="space-y-1">
                 <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                    <span>Task Classifier Core</span>
                    <span className="text-purple-400">74% load</span>
                 </div>
                 <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '74%' }} />
                 </div>
              </div>
              <div className="space-y-1">
                 <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                    <span>Vector Semantic Sync</span>
                    <span className="text-[var(--accent-cyan)]">42% load</span>
                 </div>
                 <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent-cyan)] rounded-full" style={{ width: '42%' }} />
                 </div>
              </div>
           </div>
        </section>

      </div>

      {/* 3. FLOATING QUICK ACTION BAR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] glass-panel-deep px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
         <button 
           onClick={triggerDeploy}
           className="px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-purple-500/20 transition-all flex items-center gap-2"
         >
            <Zap size={12} />
            Create Workflow
         </button>
         
         <div className="w-px h-5 bg-white/10" />

         <button 
            onClick={() => alert("Email Server node sync initialized...")}
            className="px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-purple-500/20 transition-all flex items-center gap-2"
          >
             <Mail size={12} />
             Connect Email
          </button>

         <button 
           onClick={() => alert("Creating autonomous LLM worker node...")}
           className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-cyan-500/20 transition-all flex items-center gap-2"
         >
            <Cpu size={12} />
            Add AI Agent
         </button>
      </div>

      {/* Deploying HUD modal overlay */}
      <AnimatePresence>
        {deployStatus !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="max-w-md w-full glass-panel-deep p-10 rounded-[40px] border border-purple-500/30 bg-purple-950/10 text-center space-y-8 relative overflow-hidden"
             >
                {/* Internal dynamic scan line */}
                <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />

                {deployStatus === 'deploying' ? (
                  <>
                    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                       <div className="absolute inset-0 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin" />
                       <div className="absolute inset-2 border-b-2 border-cyan-500 rounded-full animate-spin-reverse" />
                       <Cpu size={32} className="text-purple-400 hologram-flicker" />
                    </div>
                    
                    <div className="space-y-2">
                       <h4 className="text-lg font-black uppercase tracking-[0.2em] text-white">Configuring Swarm</h4>
                       <p className="text-[11px] text-white/40 leading-relaxed font-normal">COMPILING COGNITIVE PIPELINE AND REGISTERING NODES TO WORKSPACE...</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                       <CheckCircle2 size={36} className="animate-bounce" />
                    </div>

                    <div className="space-y-2">
                       <h4 className="text-lg font-black uppercase tracking-[0.2em] text-green-400">Node Sync Complete</h4>
                       <p className="text-[11px] text-white/40 leading-relaxed font-normal">THE NEW AUTONOMOUS COGNITIVE WORKFLOW NODE HAS BEEN FULLY DEPLOYED IN THE CLOUD GATEWAY.</p>
                    </div>
                  </>
                )}
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Futuristic Drawer / Details modal for Swarm Categories */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCategory(null)}
            className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.95, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 30, opacity: 0 }}
               onClick={(e) => e.stopPropagation()}
               className="max-w-2xl w-full glass-panel-deep p-8 md:p-12 rounded-[48px] border border-cyan-500/30 bg-black/90 text-left space-y-8 relative overflow-y-auto max-h-[90vh] no-scrollbar shadow-[0_0_80px_rgba(6,182,212,0.15)]"
             >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                >
                   <X size={16} />
                </button>

                {/* Header Information */}
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      {React.createElement(selectedCategory.icon, { size: 30 })}
                   </div>
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400">OPERATIONAL NODE DETAILS</span>
                      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{selectedCategory.title}</h3>
                   </div>
                </div>

                <div className="w-full h-px bg-white/10" />

                {selectedCategory.id === 'email' ? (

                  /* ─── Email Automation Custom Detail Block ─── */
                  <div className="space-y-8">

                     {/* Pipeline header flow */}
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Pipeline Architecture</h4>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3">
                           {[
                             { label: "Gmail Trigger", color: "bg-red-500/10 border-red-500/20 text-red-400" },
                             null,
                             { label: "OpenAI", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
                             null,
                             { label: "Send Email", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" }
                           ].map((item, i) =>
                             item === null ? (
                               <ArrowDown key={i} size={14} className="text-cyan-400 animate-bounce" />
                             ) : (
                               <span key={i} className={`px-6 py-2 rounded-xl border text-[10px] font-black tracking-widest ${item.color}`}>
                                 {item.label}
                               </span>
                             )
                           )}
                        </div>
                     </div>

                     {/* Three nodes explained */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">How It Works</h4>

                        {/* Node 1 – Gmail Trigger */}
                        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-3">
                           <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[9px] font-black shrink-0">01</div>
                              <span className="text-[11px] font-black uppercase tracking-widest text-red-400">Gmail Trigger</span>
                           </div>
                           <p className="text-[10px] text-white/50 leading-relaxed font-normal ml-9">n8n continuously monitors your Gmail inbox and fires automatically on:</p>
                           <div className="flex flex-wrap gap-2 ml-9">
                             {["New emails", "Unread emails", "Important emails"].map(tag => (
                               <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40">{tag}</span>
                             ))}
                           </div>
                        </div>

                        {/* Node 2 – OpenAI */}
                        <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 space-y-3">
                           <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-[9px] font-black shrink-0">02</div>
                              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">OpenAI Node</span>
                           </div>
                           <p className="text-[10px] text-white/50 leading-relaxed font-normal ml-9">The AI reads each email and performs deep cognitive analysis:</p>
                           <div className="flex flex-wrap gap-2 ml-9">
                             {["Understands message", "Generates reply", "Decides action"].map(tag => (
                               <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40">{tag}</span>
                             ))}
                           </div>
                        </div>

                        {/* Node 3 – Send Email */}
                        <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-3">
                           <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-[9px] font-black shrink-0">03</div>
                              <span className="text-[11px] font-black uppercase tracking-widest text-purple-400">Send Email Node</span>
                           </div>
                           <p className="text-[10px] text-white/50 leading-relaxed font-normal ml-9">n8n takes autonomous action based on the AI decision:</p>
                           <div className="flex flex-wrap gap-2 ml-9">
                             {["Sends reply", "Forwards email", "Schedules response"].map(tag => (
                               <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40">{tag}</span>
                             ))}
                           </div>
                        </div>
                     </div>

                     {/* Vertical Signal Flow */}
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Visual Signal Flow</h4>
                        <div className="p-6 rounded-3xl bg-[#010101]/40 border border-white/5 flex flex-col items-center gap-4 text-center max-w-md mx-auto">
                           {[
                             { title: "Gmail receives new email", color: "bg-red-500/10 border-red-500/20 text-red-400" },
                             { title: "n8n Gmail Trigger fires", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
                             { title: "OpenAI reads & understands email", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
                             { title: "OMNIAI generates smart reply", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                             { title: "Email sent automatically", color: "bg-green-600 border-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" }
                           ].map((step, idx, arr) => (
                             <React.Fragment key={idx}>
                               <div className={`px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest w-full ${step.color}`}>
                                  {step.title}
                               </div>
                               {idx < arr.length - 1 && (
                                 <ArrowDown size={14} className="text-cyan-400/60 animate-bounce" />
                               )}
                             </React.Fragment>
                           ))}
                        </div>
                     </div>

                  </div>

                ) : selectedCategory.id === 'booking' ? (

                  /* ─── Booking Agent Custom Detail Block ─── */
                  <div className="space-y-8">

                     {/* Top pipeline summary */}
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Booking Pipeline Architecture</h4>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3">
                           {[
                             { label: "User Request",                 color: "bg-blue-500/10   border-blue-500/20   text-blue-400"   },
                             null,
                             { label: "Webhook / Email API",          color: "bg-green-500/10  border-green-500/20  text-green-400"  },
                             null,
                             { label: "OpenAI understands request",   color: "bg-cyan-500/10   border-cyan-500/20   text-cyan-400"   },
                             null,
                             { label: "Check Database / Google Sheet",color: "bg-purple-500/10  border-purple-500/20 text-purple-400" },
                             null,
                             { label: "Confirm Booking",              color: "bg-amber-500/10   border-amber-500/20  text-amber-400"  },
                             null,
                             { label: "Send Reply",                   color: "bg-green-600 border-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" }
                           ].map((item, i) =>
                             item === null ? (
                               <ArrowDown key={i} size={14} className="text-cyan-400 animate-bounce" />
                             ) : (
                               <span key={i} className={`px-6 py-2 rounded-xl border text-[10px] font-black tracking-widest w-full text-center ${item.color}`}>
                                 {item.label}
                               </span>
                             )
                           )}
                        </div>
                     </div>

                     {/* Six step breakdown */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">How Each Stage Works</h4>

                        {[
                          {
                            num: "01",
                            title: "User Request",
                            color: "bg-blue-500/5 border-blue-500/10",
                            badge: "text-blue-400",
                            desc: "Customer sends a booking request via email, web form, or any connected channel - any time of day.",
                            tags: ["Email", "Web form", "API trigger"]
                          },
                          {
                            num: "02",
                            title: "Webhook / Email API",
                            color: "bg-green-500/5 border-green-500/10",
                            badge: "text-green-400",
                            desc: "n8n captures the incoming message instantly through a live webhook and routes it into the automation pipeline.",
                            tags: ["n8n Webhook", "Instant trigger", "Multi-channel"]
                          },
                          {
                            num: "03",
                            title: "OpenAI Understands Request",
                            color: "bg-cyan-500/5 border-cyan-500/10",
                            badge: "text-cyan-400",
                            desc: "The AI parses the intent — date, time, service type, and any special instructions — with high semantic accuracy.",
                            tags: ["Intent parsing", "Date extraction", "Context memory"]
                          },
                          {
                            num: "04",
                            title: "Check Database / Google Sheet",
                            color: "bg-purple-500/5 border-purple-500/10",
                            badge: "text-purple-400",
                            desc: "OMNIAI queries your live database or Google Sheet to verify availability and prevent scheduling conflicts.",
                            tags: ["Google Sheets", "Supabase", "Real-time lookup"]
                          },
                          {
                            num: "05",
                            title: "Confirm Booking",
                            color: "bg-amber-500/5 border-amber-500/10",
                            badge: "text-amber-400",
                            desc: "The slot is locked, a booking record is written to your database, and a calendar invite is generated automatically.",
                            tags: ["Auto-lock slot", "Write DB record", "Calendar sync"]
                          },
                          {
                            num: "06",
                            title: "Send Reply",
                            color: "bg-green-500/5 border-green-500/10",
                            badge: "text-green-400",
                            desc: "A personalised confirmation message is sent back to the user instantly with all booking details and next steps.",
                            tags: ["Email response", "Email receipt", "Zero delay"]
                          }
                        ].map((step, i) => (
                          <div key={i} className={`p-5 rounded-2xl border space-y-3 ${step.color}`}>
                             <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-black shrink-0 ${step.badge}`}>
                                   {step.num}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${step.badge}`}>{step.title}</span>
                             </div>
                             <p className="text-[10px] text-white/50 leading-relaxed font-normal ml-9">{step.desc}</p>
                             <div className="flex flex-wrap gap-2 ml-9">
                               {step.tags.map(tag => (
                                 <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40">{tag}</span>
                               ))}
                             </div>
                          </div>
                        ))}
                     </div>

                  </div>

                ) : selectedCategory.id === 'workflow' ? (

                  /* ─── Business Workflow Automation Custom Detail Block ─── */
                  <div className="space-y-8">

                     {/* Pipeline diagram */}
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Business Workflow Pipeline</h4>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3">
                           {[
                             { label: "Customer Request",          color: "bg-blue-500/10   border-blue-500/20   text-blue-400"   },
                             null,
                             { label: "n8n Workflow",              color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
                             null,
                             { label: "OpenAI understands request",color: "bg-cyan-500/10   border-cyan-500/20   text-cyan-400"   },
                             null,
                             { label: "Business action performed", color: "bg-amber-500/10  border-amber-500/20  text-amber-400"  },
                             null,
                             { label: "Reply / Notification sent", color: "bg-green-600 border-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" }
                           ].map((item, i) =>
                             item === null ? (
                               <ArrowDown key={i} size={14} className="text-cyan-400 animate-bounce" />
                             ) : (
                               <span key={i} className={`px-6 py-2 rounded-xl border text-[10px] font-black tracking-widest w-full text-center ${item.color}`}>
                                 {item.label}
                               </span>
                             )
                           )}
                        </div>
                     </div>

                     {/* Five step breakdown */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">How Each Stage Works</h4>

                        {[
                          {
                            num: "01",
                            title: "Customer Request",
                            color: "bg-blue-500/5 border-blue-500/10",
                            badge: "text-blue-400",
                            desc: "A customer submits a request via email, web form, or any connected channel - triggering the workflow instantly.",
                            tags: ["Email", "Web form", "API call"]
                          },
                          {
                            num: "02",
                            title: "n8n Workflow",
                            color: "bg-purple-500/5 border-purple-500/10",
                            badge: "text-purple-400",
                            desc: "n8n receives the trigger, applies conditional logic, and routes the request through the appropriate business pipeline.",
                            tags: ["Conditional logic", "Multi-step routing", "Error handling"]
                          },
                          {
                            num: "03",
                            title: "OpenAI Understands Request",
                            color: "bg-cyan-500/5 border-cyan-500/10",
                            badge: "text-cyan-400",
                            desc: "GPT-4o analyses the request in full context — extracting intent, category, priority, and the best course of action.",
                            tags: ["Intent detection", "Priority scoring", "Context memory"]
                          },
                          {
                            num: "04",
                            title: "Business Action Performed",
                            color: "bg-amber-500/5 border-amber-500/10",
                            badge: "text-amber-400",
                            desc: "The automation executes the required business action — updating CRM records, processing orders, syncing spreadsheets, or triggering APIs.",
                            tags: ["CRM update", "Order processing", "Google Sheets sync", "API execution"]
                          },
                          {
                            num: "05",
                            title: "Reply / Notification Sent",
                            color: "bg-green-500/5 border-green-500/10",
                            badge: "text-green-400",
                            desc: "A personalised reply or status notification is dispatched to the customer and relevant team members - zero manual effort.",
                            tags: ["Email response", "Email notification", "Slack alert", "Zero delay"]
                          }
                        ].map((step, i) => (
                          <div key={i} className={`p-5 rounded-2xl border space-y-3 ${step.color}`}>
                             <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-black shrink-0 ${step.badge}`}>
                                   {step.num}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${step.badge}`}>{step.title}</span>
                             </div>
                             <p className="text-[10px] text-white/50 leading-relaxed font-normal ml-9">{step.desc}</p>
                             <div className="flex flex-wrap gap-2 ml-9">
                               {step.tags.map(tag => (
                                 <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40">{tag}</span>
                               ))}
                             </div>
                          </div>
                        ))}
                     </div>

                  </div>

                ) : selectedCategory.id === 'file' ? (

                  /* ─── AI File Processing Custom Detail Block ─── */
                  <div className="space-y-8">

                     {/* Pipeline diagram */}
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">File Processing Pipeline</h4>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3">
                           {[
                             { label: "File Upload",              color: "bg-blue-500/10   border-blue-500/20   text-blue-400"   },
                             null,
                             { label: "n8n receives file",        color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
                             null,
                             { label: "OpenAI analyzes content",  color: "bg-cyan-500/10   border-cyan-500/20   text-cyan-400"   },
                             null,
                             { label: "OMNIAI processes data",    color: "bg-amber-500/10  border-amber-500/20  text-amber-400"  },
                             null,
                             { label: "Result sent to user",      color: "bg-green-600 border-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" }
                           ].map((item, i) =>
                             item === null ? (
                               <ArrowDown key={i} size={14} className="text-cyan-400 animate-bounce" />
                             ) : (
                               <span key={i} className={`px-6 py-2 rounded-xl border text-[10px] font-black tracking-widest w-full text-center ${item.color}`}>
                                 {item.label}
                               </span>
                             )
                           )}
                        </div>
                     </div>

                     {/* Five step breakdown */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">How Each Stage Works</h4>

                        {[
                          {
                            num: "01",
                            title: "File Upload",
                            color: "bg-blue-500/5 border-blue-500/10",
                            badge: "text-blue-400",
                            desc: "User uploads a document, spreadsheet, PDF, or image via the OMNIAI interface or any connected upload endpoint.",
                            tags: ["PDF", "Excel / CSV", "Images", "Word docs"]
                          },
                          {
                            num: "02",
                            title: "n8n Receives File",
                            color: "bg-purple-500/5 border-purple-500/10",
                            badge: "text-purple-400",
                            desc: "n8n captures the file instantly, validates its format, and queues it through the processing pipeline with full error handling.",
                            tags: ["File validation", "Format detection", "Queue management"]
                          },
                          {
                            num: "03",
                            title: "OpenAI Analyzes Content",
                            color: "bg-cyan-500/5 border-cyan-500/10",
                            badge: "text-cyan-400",
                            desc: "GPT-4o reads and understands the file contents — summarising documents, extracting key data, or classifying information with high precision.",
                            tags: ["Summarisation", "Data extraction", "Classification", "OCR"]
                          },
                          {
                            num: "04",
                            title: "OMNIAI Processes Data",
                            color: "bg-amber-500/5 border-amber-500/10",
                            badge: "text-amber-400",
                            desc: "The cognitive engine applies business logic — writing extracted data to databases, generating reports, or triggering follow-up workflows.",
                            tags: ["DB write", "Report generation", "Workflow trigger", "Google Sheets"]
                          },
                          {
                            num: "05",
                            title: "Result Sent to User",
                            color: "bg-green-500/5 border-green-500/10",
                            badge: "text-green-400",
                            desc: "The processed result — summary, extracted table, or structured report — is delivered to the user instantly via chat, email, or download link.",
                            tags: ["Chat reply", "Email delivery", "Download link", "Zero delay"]
                          }
                        ].map((step, i) => (
                          <div key={i} className={`p-5 rounded-2xl border space-y-3 ${step.color}`}>
                             <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-black shrink-0 ${step.badge}`}>
                                   {step.num}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${step.badge}`}>{step.title}</span>
                             </div>
                             <p className="text-[10px] text-white/50 leading-relaxed font-normal ml-9">{step.desc}</p>
                             <div className="flex flex-wrap gap-2 ml-9">
                               {step.tags.map(tag => (
                                 <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40">{tag}</span>
                               ))}
                             </div>
                          </div>
                        ))}
                     </div>

                  </div>

                ) : selectedCategory.id === 'website' ? (

                  /* ─── Website Automation Custom Detail Block ─── */
                  <div className="space-y-8">

                     {/* Capability pills */}
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">OMNIAI Website Capabilities</h4>
                        <div className="grid grid-cols-2 gap-3">
                           {[
                             { label: "Read PDFs / Images / Docs", icon: "📄", color: "bg-blue-500/10   border-blue-500/20   text-blue-300"   },
                             { label: "Extract Information",        icon: "🔍", color: "bg-cyan-500/10   border-cyan-500/20   text-cyan-300"   },
                             { label: "Summarize Files",            icon: "📝", color: "bg-purple-500/10 border-purple-500/20 text-purple-300" },
                             { label: "Answer Questions from Files",icon: "💡", color: "bg-amber-500/10  border-amber-500/20  text-amber-300"  }
                           ].map(cap => (
                             <div key={cap.label} className={`p-4 rounded-2xl border flex items-center gap-3 ${cap.color}`}>
                                <span className="text-base shrink-0">{cap.icon}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{cap.label}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     {/* Pipeline diagram */}
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Simple Flow</h4>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3">
                           {[
                             { label: "File Upload",             color: "bg-blue-500/10   border-blue-500/20   text-blue-400"   },
                             null,
                             { label: "n8n receives file",       color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
                             null,
                             { label: "OpenAI analyzes content", color: "bg-cyan-500/10   border-cyan-500/20   text-cyan-400"   },
                             null,
                             { label: "OMNIAI processes data",   color: "bg-amber-500/10  border-amber-500/20  text-amber-400"  },
                             null,
                             { label: "Result sent to user",     color: "bg-green-600 border-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" }
                           ].map((item, i) =>
                             item === null ? (
                               <ArrowDown key={i} size={14} className="text-cyan-400 animate-bounce" />
                             ) : (
                               <span key={i} className={`px-6 py-2 rounded-xl border text-[10px] font-black tracking-widest w-full text-center ${item.color}`}>
                                 {item.label}
                               </span>
                             )
                           )}
                        </div>
                     </div>

                     {/* Five step breakdown */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">How Each Stage Works</h4>

                        {[
                          {
                            num: "01",
                            title: "File Upload",
                            color: "bg-blue-500/5 border-blue-500/10",
                            badge: "text-blue-400",
                            desc: "User uploads any file — PDF, image, Word doc, or spreadsheet — directly into OMNIAI or via a connected upload endpoint.",
                            tags: ["PDF", "Images", "Word docs", "Spreadsheets"]
                          },
                          {
                            num: "02",
                            title: "n8n Receives File",
                            color: "bg-purple-500/5 border-purple-500/10",
                            badge: "text-purple-400",
                            desc: "n8n captures the upload, validates the file type, extracts metadata, and queues it for AI processing with full error recovery.",
                            tags: ["File validation", "Metadata extraction", "Queue management"]
                          },
                          {
                            num: "03",
                            title: "OpenAI Analyzes Content",
                            color: "bg-cyan-500/5 border-cyan-500/10",
                            badge: "text-cyan-400",
                            desc: "GPT-4o reads the file contents — summarising documents, answering questions, extracting tables, or classifying data at high precision.",
                            tags: ["Summarisation", "Q&A from file", "Table extraction", "OCR"]
                          },
                          {
                            num: "04",
                            title: "OMNIAI Processes Data",
                            color: "bg-amber-500/5 border-amber-500/10",
                            badge: "text-amber-400",
                            desc: "The cognitive engine applies business rules — storing results to databases, generating structured reports, or triggering downstream workflows.",
                            tags: ["DB write", "Report generation", "Workflow trigger", "Google Sheets"]
                          },
                          {
                            num: "05",
                            title: "Result Sent to User",
                            color: "bg-green-500/5 border-green-500/10",
                            badge: "text-green-400",
                            desc: "The final result — summary, extracted data, or answered query — is delivered instantly via chat, email, or a secure download link.",
                            tags: ["Chat reply", "Email delivery", "Download link", "Zero delay"]
                          }
                        ].map((step, i) => (
                          <div key={i} className={`p-5 rounded-2xl border space-y-3 ${step.color}`}>
                             <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-black shrink-0 ${step.badge}`}>
                                   {step.num}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${step.badge}`}>{step.title}</span>
                             </div>
                             <p className="text-[10px] text-white/50 leading-relaxed font-normal ml-9">{step.desc}</p>
                             <div className="flex flex-wrap gap-2 ml-9">
                               {step.tags.map(tag => (
                                 <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-widest text-white/40">{tag}</span>
                               ))}
                             </div>
                          </div>
                        ))}
                     </div>

                  </div>

                ) : (
                  // Generic Premium Information drawer for other categories
                  <div className="space-y-6">
                     <p className="text-sm text-white/70 leading-relaxed font-normal tracking-wide">
                        {selectedCategory.desc}
                     </p>
                     
                     <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div>
                           <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Operational Metrics</div>
                           <div className="text-lg font-black text-[var(--accent-cyan)]">{selectedCategory.stat}</div>
                        </div>
                        <div>
                           <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Activity Count</div>
                           <div className="text-lg font-black text-white">{selectedCategory.runs}</div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Operational Status</h4>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <span className={cn(
                                "w-2.5 h-2.5 rounded-full animate-ping",
                                selectedCategory.status === 'ACTIVE' ? 'bg-green-500' :
                                selectedCategory.status === 'STANDBY' ? 'bg-yellow-500' : 'bg-white/20'
                              )} />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{selectedCategory.status}</span>
                           </div>
                           <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">GATEWAY LINK SECURED</span>
                        </div>
                     </div>
                  </div>
                )}

                {/* Footer Action buttons inside details modal */}
                <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                   <button 
                     onClick={() => setSelectedCategory(null)}
                     className="px-6 py-3 glass-panel border-white/10 hover:border-white/20 text-white/60 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                   >
                      Cancel
                   </button>
                   <button 
                     onClick={() => {
                       setSelectedCategory(null);
                       triggerDeploy();
                     }}
                     className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                   >
                      Synchronize Node
                   </button>
                </div>

             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
