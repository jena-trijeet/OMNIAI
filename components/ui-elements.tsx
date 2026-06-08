"use client";
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HolographicNodeProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  status?: 'active' | 'standby' | 'warning' | 'error';
  className?: string;
}

export function HolographicNode({ icon: Icon, label, value, status = 'active', className }: HolographicNodeProps) {
  const statusColors = {
    active: 'text-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,210,255,0.3)] border-[var(--accent-cyan)]/30',
    standby: 'text-white/40 shadow-none border-white/10',
    warning: 'text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)] border-yellow-400/30',
    error: 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] border-red-500/30',
  };

  return (
    <div className={cn(
      "hologram-card p-4 rounded-2xl flex items-center gap-4 group transition-all duration-500 hover:scale-105 hover:-translate-y-1 perspective-card hologram-flicker",
      className
    )}>
      <div className={cn(
        "w-12 h-12 rounded-xl bg-white/5 border flex items-center justify-center transition-all duration-500 group-hover:bg-white/10",
        statusColors[status]
      )}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{label}</div>
        <div className="text-sm font-bold tracking-tight text-white group-hover:text-[var(--accent-cyan)] transition-colors">
          {value || 'OPERATIONAL'}
        </div>
      </div>
      {status === 'active' && (
        <div className="ml-auto flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-3 bg-[var(--accent-cyan)]/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  icon?: LucideIcon;
  className?: string;
}

export function ActionButton({ children, onClick, variant = 'primary', icon: Icon, className }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 group overflow-hidden",
        variant === 'primary' ? "bg-white text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]" : "",
        variant === 'ghost' ? "glass-card border border-white/10 text-white hover:bg-white/5" : "",
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-center gap-3">
        {Icon && <Icon size={16} className="group-hover:rotate-12 transition-transform" />}
        {children}
      </div>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
    </button>
  );
}
