"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Power, ShieldCheck, Zap } from 'lucide-react';

export function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <div className="mesh-bg opacity-30" />
      <div className="scanline opacity-5" />
      
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full" />
         <div className="absolute inset-0 bg-cyber-grid opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-12 relative">
           <motion.div 
             animate={{ 
               boxShadow: ["0 0 20px rgba(0,209,255,0.1)", "0 0 50px rgba(0,209,255,0.3)", "0 0 20px rgba(0,209,255,0.1)"] 
             }}
             transition={{ duration: 4, repeat: Infinity }}
             className="w-24 h-24 rounded-[32px] glass-panel border-white/10 flex items-center justify-center text-[var(--accent-cyan)] relative z-20 overflow-hidden"
           >
             <img src="/logo.png" alt="OMNIAI Logo" className="w-full h-full object-cover hologram-flicker" />
           </motion.div>
           
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="absolute inset-[-20px] border border-dashed border-white/5 rounded-full"
           />
        </div>

        <div className="relative flex flex-col items-center gap-4">
           <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/10" />
              <span className="text-[10px] font-black tracking-[0.8em] text-white/20 uppercase">Core_System</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/10" />
           </div>
           
           <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
             OMNIAI <span className="text-[var(--accent-cyan)]">OS</span>
           </h1>
           
           <div 
             className="text-[10px] md:text-[12px] font-medium tracking-[1.2em] uppercase text-white/30 flex items-center justify-center"
             style={{ marginRight: '-1.2em' }}
           >
             THE OPERATING SYSTEM FOR FUTURE LIFE
           </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 flex flex-col items-center gap-8"
        >
          <div className="flex items-center gap-6 px-8 py-3 glass-panel rounded-2xl border-white/5">
             <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-500/60" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Auth: Secured</span>
             </div>
             <div className="w-px h-4 bg-white/5" />
             <div className="flex items-center gap-2">
                <Zap size={14} className="text-[var(--accent-cyan)]/60 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">System_Linked</span>
             </div>
          </div>

          <button 
            onClick={onStart}
            className="group relative px-12 py-5 rounded-2xl transition-all duration-500 overflow-hidden"
          >
             <div className="absolute inset-0 glass-panel border-white/10 group-hover:border-[var(--accent-cyan)]/30 group-hover:bg-white/5 transition-all duration-500" />
             
             <div className="relative z-10 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent-cyan)] group-hover:text-black transition-all duration-500">
                   <Power size={16} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                  INITIALIZE_OS
                </span>
             </div>
             
             <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]"
                />
             </div>
          </button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-12 left-12 font-mono text-[8px] text-white/10 uppercase tracking-widest space-y-2">
         <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-green-500 rounded-full" />
            Core: Active
         </div>
         <div>Encryption: AES_256_ACTIVE</div>
      </div>
    </div>
  );
}
