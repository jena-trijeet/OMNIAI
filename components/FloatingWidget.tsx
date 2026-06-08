"use client";
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FloatingWidgetProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend?: string;
  delay?: string;
  className?: string;
}

export function FloatingWidget({ icon: Icon, title, value, trend, delay = '0s', className }: FloatingWidgetProps) {
  return (
    <div 
      className={cn(
        "glass-card-hologram p-6 rounded-[32px] animate-float-widget group cursor-pointer",
        className
      )}
      style={{ animationDelay: delay }}
    >
      {/* Corner HUD Marks */}
      <div className="hud-border hud-tl opacity-20 group-hover:opacity-100 transition-opacity" />
      <div className="hud-border hud-tr opacity-20 group-hover:opacity-100 transition-opacity" />
      <div className="hud-border hud-bl opacity-20 group-hover:opacity-100 transition-opacity" />
      <div className="hud-border hud-br opacity-20 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-[var(--accent-cyan)]/10 group-hover:text-[var(--accent-cyan)] transition-all">
          <Icon size={20} />
        </div>
        {trend && (
          <div className="text-[8px] font-bold uppercase tracking-widest text-green-500/60 bg-green-500/5 px-2 py-1 rounded-full border border-green-500/10">
            {trend}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/20">{title}</div>
        <div className="text-xl font-black tracking-tighter group-hover:text-[var(--accent-cyan)] transition-colors">{value}</div>
      </div>

      {/* Internal Scanning Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
