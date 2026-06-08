"use client";
import { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Clock, 
  Star, 
  Briefcase, 
  Hotel, 
  MessageCircle, 
  Zap,
  ChevronRight,
  Sparkles,
  Layers,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionButton } from '@/components/ui-elements';

export function MemoryVault() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentActivity, setRecentActivity] = useState<any>(null);

  useEffect(() => {
    const loadRecentActivity = () => {
      try {
        const saved = localStorage.getItem('omniai_last_activity');
        if (saved) {
          const parsed = JSON.parse(saved);
          setRecentActivity({
            id: 'recent-act',
            type: parsed.type || 'Booking',
            label: parsed.label || 'Recent Activity',
            content: parsed.content || '',
            time: parsed.time || 'Just now',
            icon: parsed.type === 'Preference' 
              ? Star 
              : parsed.type === 'System' 
                ? Sparkles 
                : Hotel,
            color: parsed.type === 'Preference' 
              ? 'text-yellow-500' 
              : parsed.type === 'System' 
                ? 'text-purple-400' 
                : 'text-[var(--accent-cyan)]'
          });
        }
      } catch (e) {
        console.error("Failed to restore recent activity inside memory vault", e);
      }
    };

    loadRecentActivity();

    window.addEventListener('omniai_activity_update', loadRecentActivity);
    window.addEventListener('storage', loadRecentActivity);
    return () => {
      window.removeEventListener('omniai_activity_update', loadRecentActivity);
      window.removeEventListener('storage', loadRecentActivity);
    };
  }, []);

  const baseMemories = [
    { id: '1', type: 'Preference', label: 'Coffee Selection', content: 'Prefers Double Espresso, Oat Milk, no sugar.', time: '2h ago', icon: Star, color: 'text-yellow-500' },
    { id: '2', type: 'Booking', label: 'Travel Intent', content: 'Searching for Tokyo flights for Q4 Expansion.', time: '5h ago', icon: Hotel, color: 'text-[var(--accent-cyan)]' },
    { id: '3', type: 'Business', label: 'CRM Insights', content: 'Client Sarah responded to Q3 Proposal.', time: '1d ago', icon: Briefcase, color: 'text-purple-500' },
    { id: '4', type: 'Conversation', label: 'Neural Sync', content: 'Discussed architectural scaling for OmniAI.', time: '2d ago', icon: MessageCircle, color: 'text-blue-500' },
  ];

  const memories = recentActivity ? [recentActivity, ...baseMemories] : baseMemories;

  const filteredMemories = memories.filter((m) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Preferences') return m.type === 'Preference';
    if (activeCategory === 'Business') return m.type === 'Business';
    if (activeCategory === 'System') return m.type === 'System' || m.type === 'Booking' || m.type === 'Conversation';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Vault Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
             <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[var(--accent-cyan)]">Neural Context Storage</span>
           </div>
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-hologram leading-[0.9]">Memory Vault.</h2>
        </div>
        <div className="flex gap-4">
           <div className="relative">
             <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
             <input 
               type="text" 
               placeholder="SEARCH NEURAL INDEX..." 
               className="bg-white/5 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:border-[var(--accent-cyan)]/30 transition-all w-64"
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1">
        
        {/* Left: Neural Timeline */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="glass-panel p-10 rounded-[40px] border border-white/5 bg-white/[0.01] flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-4">
                    <History size={18} className="text-[var(--accent-cyan)]" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Chronological Index</h3>
                 </div>
                 <div className="flex gap-2">
                    {['All', 'Preferences', 'Business', 'System'].map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest border transition-all",
                          activeCategory === cat ? "bg-white/10 border-white/20 text-white" : "border-white/5 text-white/20 hover:text-white"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pr-4">
                 {filteredMemories.map((memory) => (
                   <div key={memory.id} className="relative pl-12 group cursor-pointer">
                      {/* Timeline Line */}
                      <div className="absolute left-5 top-0 bottom-0 w-px bg-white/5 group-last:bg-transparent" />
                      <div className="absolute left-[17px] top-1.5 w-2 h-2 rounded-full bg-white/10 group-hover:bg-[var(--accent-cyan)] transition-colors shadow-[0_0_10px_rgba(0,242,255,0)] group-hover:shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
                      
                      <div className="glass-panel p-6 rounded-3xl border border-white/5 group-hover:border-white/10 group-hover:bg-white/[0.02] transition-all">
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                               <div className={cn("p-2 rounded-xl bg-white/5", memory.color)}>
                                 <memory.icon size={14} />
                               </div>
                               <div>
                                  <div className="text-[11px] font-bold mb-0.5">{memory.label}</div>
                                  <div className="text-[8px] font-bold uppercase tracking-widest text-white/20">{memory.type}</div>
                               </div>
                            </div>
                            <div className="text-[8px] font-mono text-white/20">{memory.time}</div>
                         </div>
                         <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                           {memory.content}
                         </p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Smart Context HUD */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <section className="glass-panel p-10 rounded-[40px] border border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4 mb-8">
                <Sparkles size={18} className="text-yellow-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Active Context</h3>
              </div>
              <div className="space-y-6">
                 <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-yellow-500/60 mb-3">Priority Habit</div>
                    <div className="text-[11px] font-bold text-yellow-500/80">Evening Routine Optimization</div>
                    <p className="text-[9px] text-white/30 mt-2">AI is adjusting home ambient lighting based on 8PM sleep prep habit.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-[var(--accent-cyan)]/5 border border-[var(--accent-cyan)]/10">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent-cyan)]/60 mb-3">System Memory</div>
                    <div className="text-[11px] font-bold text-[var(--accent-cyan)]/80">Vector Database Status</div>
                    <div className="mt-4 flex items-center justify-between text-[8px] font-mono">
                       <span className="text-white/20">98,420 Nodes Indexed</span>
                       <span className="text-green-500">HEALTHY</span>
                    </div>
                 </div>
              </div>
           </section>

           <section className="glass-panel p-10 rounded-[40px] border border-white/5 bg-white/[0.01] flex-1">
              <div className="flex items-center gap-4 mb-8">
                <Layers size={18} className="text-purple-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Neural Clusters</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Work', nodes: '12k', color: 'bg-blue-500' },
                   { label: 'Personal', nodes: '45k', color: 'bg-[var(--accent-cyan)]' },
                   { label: 'Finance', nodes: '8k', color: 'bg-green-500' },
                   { label: 'Travel', nodes: '32k', color: 'bg-purple-500' },
                 ].map((cluster, i) => (
                   <div key={i} className="p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                      <div className="text-[14px] font-black tracking-tight mb-1">{cluster.nodes}</div>
                      <div className="text-[8px] font-bold uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">{cluster.label}</div>
                      <div className="w-full h-0.5 bg-white/5 mt-3 rounded-full overflow-hidden">
                         <div className={cn("h-full opacity-40", cluster.color)} style={{ width: `${30 + Math.random() * 70}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 rounded-2xl border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center justify-center gap-3">
                 Optimize Neural Map <Zap size={14} />
              </button>
           </section>
        </div>

      </div>
    </div>
  );
}
