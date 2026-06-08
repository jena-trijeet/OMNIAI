"use client";
import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandingNode() {
  return (
    <div className="relative group cursor-pointer flex items-center gap-6">
      {/* The Core Icon Node */}
      <div className="relative">
        {/* Outer Glows */}
        <div className="absolute inset-0 bg-[var(--accent-cyan)]/20 blur-xl rounded-full group-hover:bg-[var(--accent-cyan)]/30 transition-all duration-700" />
        <div className="absolute inset-[-1px] bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/10" />
        
        {/* The Icon Container */}
        <div className="relative w-16 h-16 bg-black rounded-full flex items-center justify-center border border-white/5 shadow-2xl transition-transform group-hover:scale-105 duration-500 overflow-hidden p-1">
          {/* Animated Background Grid inside logo */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_var(--accent-cyan)_0%,_transparent_70%)]" />
          <img src="/logo.png" alt="OMNIAI Logo" className="relative z-10 w-full h-full object-cover drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] rounded-full" />
          
          {/* Scanning line inside logo */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-cyan)]/50 animate-scan-line" />
        </div>
      </div>

      {/* Textual Identity */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[13px] font-black tracking-[0.4em] uppercase text-hologram">OmniAI</span>
          <div className="flex gap-1 h-3 items-end">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-0.5 bg-[var(--accent-cyan)]/60 animate-pulse" style={{ height: i === 1 ? '100%' : '60%', animationDelay: `${i * 0.2}s` }} />
             ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">Neural OS v4.2</span>
          </div>
          <div className="w-px h-2 bg-white/10" />
          <div className="text-[8px] font-mono tracking-widest text-[var(--accent-cyan)] opacity-60">STABLE_LINK</div>
        </div>
      </div>
    </div>
  );
}
