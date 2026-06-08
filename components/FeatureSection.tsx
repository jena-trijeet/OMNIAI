"use client";
import { 
  Mic, 
  Hotel, 
  Utensils, 
  Plane, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  Globe, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function FeatureSection() {
  return (
    <section id="intelligence" className="py-32 relative z-10">
      <div className="container-premium">
        
        {/* Section Header */}
        <div className="mb-24 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--accent-cyan)] shimmer-text">Capabilities Matrix</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Distributed Intelligence.</h2>
          <p className="text-sm md:text-base text-white/40 font-medium uppercase tracking-widest max-w-xl leading-relaxed">
            OmniAI orchestrates complex neural tasks across your digital life with unparalleled precision.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Card 1: AI Voice Assistant */}
          <div className="glass-panel p-12 rounded-[48px] relative overflow-hidden group hover:border-[var(--accent-cyan)]/30 transition-all duration-700">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity">
              <Mic size={120} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 flex items-center justify-center text-[var(--accent-cyan)] mb-10 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
                <Mic size={32} />
              </div>
              
              <h3 className="text-3xl font-black mb-6 tracking-tight">AI Voice Assistant</h3>
              <p className="text-[12px] text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-10">
                A sub-second latency, Jarvis-inspired voice core that understands human context and intent perfectly.
              </p>

              {/* Internal UI Preview: Waveform */}
              <div className="glass-panel p-8 rounded-3xl border-white/5 mb-10 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Listening...</span>
                   </div>
                   <div className="text-[8px] font-mono text-white/20 tracking-widest">LANG: EN_US</div>
                </div>
                <div className="flex items-end gap-[3px] h-12">
                  {[...Array(24)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-[var(--accent-cyan)] to-transparent rounded-full transition-all duration-300" 
                      style={{ 
                        height: `${30 + Math.random() * 70}%`,
                        animation: `float ${1.5 + Math.random()}s ease-in-out infinite`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              <ul className="space-y-4 mb-12">
                {[
                  'Real-time voice interaction',
                  'Wake word: "Hey Omni"',
                  'Jarvis-like behavioral response',
                  'Multi-language neural support'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                    <CheckCircle2 size={16} className="text-[var(--accent-cyan)]" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="mt-auto flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-cyan)] group/btn">
                Initialize Voice Core <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Smart Booking Agent */}
          <div className="glass-panel p-12 rounded-[48px] relative overflow-hidden group hover:border-[var(--accent-purple)]/30 transition-all duration-700">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity text-purple-500">
              <Sparkles size={120} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-10 shadow-[0_0_30px_rgba(112,0,255,0.1)]">
                <Globe size={32} />
              </div>
              
              <h3 className="text-3xl font-black mb-6 tracking-tight">Smart Booking Agent</h3>
              <p className="text-[12px] text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-10">
                The world's first autonomous concierge. Book anything from tables to flights with preferred logic.
              </p>

              {/* Internal UI Preview: Booking Node */}
              <div className="glass-panel p-8 rounded-3xl border-white/5 mb-10 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <Hotel size={16} className="text-purple-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Hotel Search</span>
                   </div>
                   <div className="flex gap-2">
                      <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[8px] font-bold uppercase tracking-widest border border-green-500/20">98% Match</div>
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] font-bold">Ritz Carlton, Paris</div>
                    <div className="flex items-center gap-2">
                       <TrendingUp size={12} className="text-green-500" />
                       <span className="text-[10px] font-black">$420/nt</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] text-white/30 font-bold uppercase tracking-widest">
                    <MapPin size={12} /> Place Vendôme, Paris
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  { icon: Hotel, label: 'Hotels' },
                  { icon: Utensils, label: 'Dining' },
                  { icon: Plane, label: 'Flights' },
                  { icon: Calendar, label: 'Events' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <item.icon size={16} strokeWidth={1.5} />
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>

              <button className="mt-auto flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-purple-400 group/btn">
                Open Concierge <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
