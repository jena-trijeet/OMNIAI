"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Shield, Zap, Cpu, Activity } from 'lucide-react';

export function StartupSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: "INITIATING NEURAL LINK...", icon: Radio },
    { label: "SYNCHRONIZING OMNI_CORE v4.2...", icon: Cpu },
    { label: "DECRYPTING MEMORY VAULT...", icon: Shield },
    { label: "OPTIMIZING LIFE WORKFLOWS...", icon: Zap },
    { label: "SYSTEM READY. WELCOME USER_TR.", icon: Activity },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (step < steps.length - 1) {
            setStep((s) => s + 1);
            return 0;
          } else {
            clearInterval(timer);
            setTimeout(onComplete, 1000);
            return 100;
          }
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [step, onComplete, steps.length]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-12">
      <div className="mesh-bg opacity-20" />
      <div className="scanline" />

      <motion.div 
        key={step}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="flex flex-col items-center gap-10 text-center max-w-md"
      >
        <div className="relative">
           <div className="absolute inset-0 bg-[var(--accent-cyan)]/20 blur-3xl rounded-full animate-pulse" />
           <div className="relative w-24 h-24 rounded-3xl border border-[var(--accent-cyan)]/20 flex items-center justify-center bg-black/40 backdrop-blur-xl">
             {steps[step] && (() => {
               const StepIcon = steps[step].icon;
               return <StepIcon size={48} className="text-[var(--accent-cyan)] hologram-flicker" />;
             })()}
           </div>
        </div>

        <div className="space-y-4 w-full">
           <div className="text-[12px] font-black tracking-[0.8em] uppercase text-hologram">
             {steps[step]?.label}
           </div>
           
           <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
             <motion.div 
                className="h-full bg-[var(--accent-cyan)] shadow-[0_0_20px_var(--accent-cyan)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
             />
           </div>
           
           <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-white/20">
              <span>Node_Index: 0x42A</span>
              <span>Sequence: 0{step + 1} / 05</span>
           </div>
        </div>
      </motion.div>

      {/* Decorative HUD Markers */}
      <div className="fixed top-20 left-20 w-40 h-40 border border-white/5 rounded-3xl opacity-20 animate-spin-slow" />
      <div className="fixed bottom-20 right-20 w-60 h-60 border border-white/5 rounded-full opacity-10 animate-pulse" />
    </div>
  );
}
