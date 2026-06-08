"use client";
import { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  Activity, 
  Cpu, 
  Globe, 
  Shield, 
  BrainCircuit,
  MessageCircle,
  Calendar,
  Hotel
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionButton } from '@/components/ui-elements';

export function HeroSection() {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Automate life, business, bookings, workflows, conversations, and intelligence with OmniAI.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      
      {/* Central Visual: The Omni Core */}
      <div className="relative w-full max-w-5xl aspect-square flex items-center justify-center animate-in zoom-in fade-in duration-1000">
        
        {/* Floating Background HUD */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[150%] h-[150%] border-[0.5px] border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[120%] h-[120%] border-[0.5px] border-dashed border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        </div>

        {/* The Core Orb */}
        <div className="relative z-10 group cursor-pointer">
          <div className="absolute inset-[-40px] bg-[var(--accent-cyan)]/20 blur-[60px] rounded-full group-hover:bg-[var(--accent-cyan)]/30 transition-all duration-700" />
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full hologram-card border-white/20 flex flex-col items-center justify-center text-center shadow-[0_0_100px_rgba(0,242,255,0.2)] animate-orb">
             <BrainCircuit size={80} strokeWidth={1} className="text-[var(--accent-cyan)] mb-4" />
             <div className="neural-pulse">
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Neural Node AP-1</div>
                <div className="text-xl font-black tracking-tighter">OMNI_CORE</div>
             </div>
             
             {/* Dynamic Waveform inside Orb */}
             <div className="mt-8 flex gap-1 h-8 items-end">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 bg-[var(--accent-cyan)]/40 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          </div>
        </div>

        {/* Floating UI Elements */}
        <FloatingPanel 
          icon={Hotel} 
          label="Booking Agent" 
          value="Ritz Carlton Confirmed" 
          status="success" 
          className="top-[10%] left-[5%]" 
          delay="0s" 
        />
        <FloatingPanel 
          icon={Calendar} 
          label="Workflow Sync" 
          value="Executive Meeting In 10m" 
          status="warning" 
          className="top-[15%] right-[5%]" 
          delay="0.5s" 
        />
        <FloatingPanel 
          icon={MessageCircle} 
          label="Neural Link" 
          value="Sarah: Analysis complete" 
          status="active" 
          className="bottom-[20%] left-[0%]" 
          delay="1s" 
        />
        <FloatingPanel 
          icon={Cpu} 
          label="Process Load" 
          value="Core Uplink Stable" 
          status="active" 
          className="bottom-[25%] right-[0%]" 
          delay="1.5s" 
        />

        {/* Voice Wave Animations (Floating) */}
        <div className="absolute top-[40%] right-[10%] space-y-4 opacity-40">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="flex gap-1 h-4">
               {[...Array(10)].map((_, j) => (
                 <div key={j} className="w-0.5 bg-[var(--accent-cyan)] rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${j * 0.05}s` }} />
               ))}
             </div>
           ))}
        </div>
      </div>

      {/* Headline & Subheadline */}
      <div className="relative z-20 text-center max-w-4xl px-8 -mt-20">
        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-10 text-hologram animate-in slide-in-from-bottom-8 duration-1000 delay-500">
          One AI <br /> To Control Everything.
        </h1>
        <p className="text-base md:text-xl text-white/40 font-medium uppercase tracking-[0.2em] max-w-2xl mx-auto h-20 mb-12 animate-in slide-in-from-bottom-8 duration-1000 delay-700">
          {displayText}
          <span className="inline-block w-2 h-5 bg-[var(--accent-cyan)] ml-2 animate-pulse" />
        </p>

        <div className="flex flex-col sm:row items-center justify-center gap-8 animate-in slide-in-from-bottom-8 duration-1000 delay-1000">
          <ActionButton variant="primary" icon={Zap} className="!bg-[var(--accent-cyan)] !text-black !px-12 !py-6 !text-xs">
            Initialize Free Core
          </ActionButton>
          <button className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all group">
            <div className="w-14 h-14 rounded-full glass-panel flex items-center justify-center group-hover:border-[var(--accent-cyan)] transition-all">
              <Play size={20} fill="currentColor" className="ml-1" />
            </div>
            Watch Neural Demo
          </button>
        </div>
      </div>

      {/* Floating Global Stats */}
      <div className="absolute bottom-12 left-12 space-y-8 hidden lg:block animate-in fade-in slide-in-from-left-8 duration-1000 delay-[1500ms]">
        <StatNode label="Active Swarms" value="2,480+" />
        <StatNode label="Intelligence Load" value="14.2 TF" />
      </div>

      <div className="absolute bottom-12 right-12 space-y-8 hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-[1500ms]">
        <StatNode label="Distributed Nodes" value="48,102" />
        <StatNode label="Secure Uplink" value="99.999%" />
      </div>
    </section>
  );
}

function FloatingPanel({ icon: Icon, label, value, status, className, delay }: any) {
  return (
    <div className={cn(
      "absolute glass-panel p-5 rounded-[24px] flex items-center gap-4 animate-float border border-white/5",
      className
    )} style={{ animationDelay: delay }}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center",
        status === 'success' ? 'bg-green-500/10 text-green-500' : 
        status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]'
      )}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">{label}</div>
        <div className="text-[10px] font-bold tracking-widest text-white">{value}</div>
      </div>
    </div>
  );
}

function StatNode({ label, value }: { label: string, value: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">{label}</div>
      <div className="text-2xl font-black tracking-tighter group-hover:scale-110 transition-transform origin-left">{value}</div>
    </div>
  );
}
