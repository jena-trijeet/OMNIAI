"use client";
import { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Brain, 
  Zap, 
  Shield, 
  Check, 
  ChevronRight,
  Activity,
  Waves
} from 'lucide-react';
import { cn } from '@/lib/utils';

const models = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]', latency: '240ms', context: '128k' },
  { id: 'claude-3-5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', color: 'text-amber-500', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]', latency: '410ms', context: '200k' },
  { id: 'gemini-1-5', name: 'Gemini 1.5 Pro', provider: 'Google', color: 'text-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]', latency: '320ms', context: '1M+' },
  { id: 'llama-3-1', name: 'Llama 3.1 405B', provider: 'Meta OSS', color: 'text-purple-500', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]', latency: '180ms', context: '128k' },
];

export function ModelSwitchHUD() {
  const [activeModel, setActiveModel] = useState('gpt-4o');

  return (
    <div className="glass-panel p-10 rounded-[48px] border border-white/5 bg-white/[0.01] animate-in fade-in slide-in-from-right-8 duration-1000">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
             <div className="w-6 h-[1px] bg-[var(--accent-cyan)]" />
             <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/40">Neural Selector</span>
           </div>
           <h3 className="text-xl font-bold tracking-tight">Select Neural Core</h3>
        </div>
        <div className="flex items-center gap-4">
           <Activity size={14} className="text-[var(--accent-cyan)] animate-pulse" />
           <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Global Sync: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setActiveModel(model.id)}
            className={cn(
              "relative p-5 rounded-3xl border transition-all duration-500 flex items-center justify-between group overflow-hidden",
              activeModel === model.id 
                ? cn("border-white/20 bg-white/5", model.glow) 
                : "border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
            )}
          >
            {/* Background Glitch Effect for Active */}
            {activeModel === model.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
            )}

            <div className="flex items-center gap-5 relative z-10">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                activeModel === model.id ? "bg-white text-black" : "bg-white/5 text-white/40"
              )}>
                {model.id.includes('gpt') ? <Cpu size={22} /> : 
                 model.id.includes('claude') ? <Sparkles size={22} /> : 
                 model.id.includes('gemini') ? <Waves size={22} /> : <Brain size={22} />}
              </div>
              <div className="text-left">
                <div className={cn("text-[12px] font-bold mb-1 transition-colors", activeModel === model.id ? "text-white" : "text-white/40")}>
                  {model.name}
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-white/20">{model.provider}</div>
              </div>
            </div>

            <div className="flex items-center gap-8 relative z-10">
               <div className="hidden sm:flex flex-col items-end">
                 <div className="text-[7px] font-bold uppercase tracking-widest text-white/20 mb-1">Latency</div>
                 <div className={cn("text-[9px] font-mono", activeModel === model.id ? model.color : "text-white/20")}>{model.latency}</div>
               </div>
               <div className="hidden sm:flex flex-col items-end">
                 <div className="text-[7px] font-bold uppercase tracking-widest text-white/20 mb-1">Context</div>
                 <div className="text-[9px] font-mono text-white/40">{model.context}</div>
               </div>
               <div className={cn(
                 "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500",
                 activeModel === model.id ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)] shadow-[0_0_10px_rgba(0,242,255,0.5)]" : "border-white/5 text-transparent"
               )}>
                 <Check size={14} />
               </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 pt-10 border-t border-white/5">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={14} className="text-green-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Enterprise Compliance Active</span>
            </div>
            <button className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--accent-cyan)] hover:gap-4 transition-all">
              Configure Model Parameters <ChevronRight size={14} />
            </button>
         </div>
      </div>
    </div>
  );
}
