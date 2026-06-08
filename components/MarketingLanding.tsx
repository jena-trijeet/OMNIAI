"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Globe, 
  Cpu, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Play, 
  BrainCircuit, 
  Mic, 
  Calendar, 
  Layers, 
  Workflow,
  MessageSquare,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Luxury UI Components ---
const NavLink = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/45 hover:text-[var(--accent-cyan)] transition-all duration-300 relative group">
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--accent-cyan)] group-hover:w-full transition-all duration-300" />
  </a>
);

const GlassButton = ({ children, primary, icon: Icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "group relative px-6 py-3 rounded-full text-[9px] font-bold uppercase tracking-[0.25em] transition-all duration-500 overflow-hidden",
      primary 
        ? "bg-white text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]" 
        : "glass-panel border border-white/5 text-white/50 hover:text-white hover:bg-white/[0.03]"
    )}
  >
    <div className="relative z-10 flex items-center justify-center gap-2">
      {Icon && <Icon size={12} className="group-hover:rotate-12 transition-transform duration-500" />}
      {children}
    </div>
    {primary && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    )}
    {!primary && (
      <div className="absolute inset-0 bg-[var(--accent-cyan)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    )}
  </button>
);

const FeatureCard = ({ icon: Icon, title, desc, href }: any) => {
  const Card = (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass-panel p-8 rounded-[24px] border border-white/5 hover:border-[var(--accent-cyan)]/20 transition-all duration-500 group relative bg-white/[0.01] backdrop-blur-md"
    >
       <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center text-white/30 group-hover:text-[var(--accent-cyan)] group-hover:border-[var(--accent-cyan)]/20 group-hover:shadow-[0_0_20px_rgba(0,209,255,0.15)] transition-all duration-500 mb-6">
          <Icon size={20} strokeWidth={1.5} className="hologram-flicker" />
       </div>
       <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 mb-3 group-hover:text-white transition-colors">{title}</h3>
       <p className="text-[11px] text-white/35 leading-relaxed group-hover:text-white/50 transition-colors font-medium tracking-wide">{desc}</p>
    </motion.div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{Card}</a>;
  }
  return Card;
};

// --- 3D Neural Sphere Visual ---


// --- Biometric Scan Overlay ---
const BiometricScan = ({ active, onComplete }: { active: boolean, onComplete: () => void }) => {
  useEffect(() => {
    if (active) {
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#050816]/90 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
        >
           <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-80 h-80 border border-[var(--accent-cyan)]/20 rounded-full relative"
              >
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--accent-cyan)] rounded-full shadow-[0_0_20px_#00d1ff]" />
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center space-y-6">
                    <Fingerprint size={80} className="text-[var(--accent-cyan)] mx-auto animate-pulse" />
                    <div className="space-y-2">
                       <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent-cyan)]">Initiating Neural Link</div>
                       <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">SCANNING_NEURAL_ENCRYPTION_0x_882</div>
                    </div>
                 </div>
              </div>

              {/* Scanning Beam */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent shadow-[0_0_15px_#00d1ff] z-10"
              />
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NeuralSphere = () => (
  <div className="relative w-full aspect-square flex items-center justify-center">
    <div className="absolute inset-0 bg-[var(--accent-blue)]/5 blur-[120px] rounded-full animate-pulse" />
    
    {/* Inner Core */}
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: 360 
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className="relative w-64 h-64 md:w-80 md:h-80"
    >
      <div className="absolute inset-0 border border-[var(--accent-cyan)]/20 rounded-full" />
      <div className="absolute inset-4 border border-[var(--accent-purple)]/20 rounded-full animate-pulse" />
      
      {/* HUD Elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className={cn(
            "w-full h-full border border-dashed rounded-full opacity-10",
            i === 1 ? "border-[var(--accent-cyan)]" : "border-white"
          )} />
        </motion.div>
      ))}

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-[var(--accent-cyan)] rounded-full"
          animate={{
            x: [0, Math.cos(i) * 150, 0],
            y: [0, Math.sin(i) * 150, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 5 + (i % 5),
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
    </motion.div>

    {/* Holographic Data Streams */}
    <div className="absolute inset-0 pointer-events-none">
       <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/20 to-transparent animate-scan" />
       <div className="absolute bottom-1/4 right-0 w-48 h-px bg-gradient-to-l from-transparent via-[var(--accent-purple)]/20 to-transparent animate-scan delay-700" />
    </div>
  </div>
);

import { Users } from 'lucide-react';

export function MarketingLanding({ onEnterPortal, onLogin }: { onEnterPortal: (portal: 'user' | 'admin') => void; onLogin?: () => void }) {
  const handleStart = (portal: 'user' | 'admin') => {
    onEnterPortal(portal);
  };

  const handleSoon = (node: string) => {
    alert(`${node}: Neural Node Initializing. Access will be granted shortly.`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden relative">
      
      <div className="mesh-bg opacity-30" />
      <div className="scanline opacity-5" />
      


      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 lg:pt-0 relative z-10 px-8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 items-center max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border-white/5 bg-white/[0.01]">
               <Sparkles size={12} className="text-[var(--accent-cyan)] animate-pulse" />
               <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40">V4.2 Neural Ecosystem Active</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.05] text-white/90">
              One AI. <br />
              <span className="font-extrabold text-hologram">Infinite</span> <br />
              Possibilities.
            </h1>
            
            <p className="text-xs md:text-sm text-white/30 font-medium max-w-md leading-relaxed tracking-wide">
              The future runs on OmniAI. A Jarvis-level intelligent ecosystem for automation, voice, and enterprise orchestration.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 max-w-xl">
              {/* Admin Panel (Left Side) */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-panel p-6 rounded-[20px] border border-purple-500/10 bg-purple-500/[0.01] hover:border-purple-500/35 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 flex flex-col justify-between h-48 cursor-pointer group"
                onClick={() => handleStart('admin')}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-purple-400 hologram-flicker" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-300">Admin Panel</span>
                  </div>
                  <p className="text-[10.5px] text-white/60 leading-relaxed font-mono">
                    Manage WhatsApp broadcast campaigns, n8n automated workflows, and developer sandboxes.
                  </p>
                </div>
                <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                  Initialize Admin_OS <ArrowRight size={10} />
                </span>
              </motion.div>

              {/* User Panel (Right Side) */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-panel p-6 rounded-[20px] border border-[var(--accent-cyan)]/15 bg-[var(--accent-cyan)]/[0.01] hover:border-[var(--accent-cyan)]/40 hover:shadow-[0_0_30px_rgba(0,209,255,0.15)] transition-all duration-500 flex flex-col justify-between h-48 cursor-pointer group"
                onClick={() => handleStart('user')}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[var(--accent-cyan)] hologram-flicker" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-cyan)]">User Panel</span>
                  </div>
                  <p className="text-[10.5px] text-white/60 leading-relaxed font-mono">
                    Interact with OmniAI chat hubs, edit files, manage memory vaults, and generate assets.
                  </p>
                </div>
                <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[var(--accent-cyan)] group-hover:text-cyan-700 dark:group-hover:text-white transition-colors">
                  Initialize User_OS <ArrowRight size={10} />
                </span>
              </motion.div>
            </div>

            {/* Trusted By Nodes */}
            <div className="pt-12 space-y-4">
               <div className="text-[7px] font-black uppercase tracking-[0.4em] text-white/10">Synchronized with Global Nodes</div>
               <div className="flex gap-8 opacity-10 hover:opacity-30 transition-opacity">
                  {['SPACE X', 'OPEN AI', 'TESLA', 'GOOGLE', 'META'].map(brand => (
                    <span key={brand} className="text-[10px] font-black tracking-[0.2em]">{brand}</span>
                  ))}
               </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:col-span-2 relative flex justify-center items-center w-full"
          >
            {/* Holographic Neural Core Interface - CIRCULAR FORMAT */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center select-none group mt-12 lg:mt-16">
              {/* Background glowing nebula */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-cyan)]/5 to-[var(--accent-purple)]/5 blur-[80px] rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />

              {/* Orbit 1: Outer Rotating Ring with Sweeper */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-white/5 rounded-full"
              >
                {/* Outer glowing sweeping node */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-[var(--accent-cyan)] rounded-full shadow-[0_0_15px_#00d1ff] animate-ping" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-[var(--accent-cyan)] rounded-full shadow-[0_0_10px_#00d1ff]" />
              </motion.div>

              {/* Orbit 2: Middle Dial (Counter-clockwise) */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border border-white/5 rounded-full"
              >
                {/* HUD ticks around the ring */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{ transform: `rotate(${i * 45}deg) translateY(-4px)` }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1.5 bg-[var(--accent-cyan)]/30"
                  />
                ))}
              </motion.div>

              {/* Orbit 3: Sub-atomic orbit dashes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 border border-dashed border-[var(--accent-purple)]/10 rounded-full"
              />

              {/* Orbit 4: Main Capsule Hub */}
              <div className="absolute inset-24 rounded-full border border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-cyber-grid opacity-[0.06] rounded-full" />
                
                {/* Floating particles */}
                <div className="absolute inset-2 rounded-full border border-white/5 bg-gradient-to-b from-white/[0.01] to-white/[0.03]" />

                {/* Central Core element */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.04, 1],
                      boxShadow: [
                        "0 0 20px rgba(0,209,255,0.15)",
                        "0 0 35px rgba(0,209,255,0.3)",
                        "0 0 20px rgba(0,209,255,0.15)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-full border border-[var(--accent-cyan)]/30 bg-black flex items-center justify-center cursor-pointer overflow-hidden p-2"
                    onClick={() => handleStart('user')}
                  >
                    <img src="/logo.png" alt="OMNIAI Core" className="w-full h-full object-contain rounded-full invert dark:invert-0 hologram-flicker animate-pulse drop-shadow-[0_0_15px_rgba(0,209,255,0.35)]" />
                  </motion.div>

                  <div className="text-center space-y-1">
                    <div className="text-[8px] font-black uppercase tracking-[0.25em] text-[var(--accent-cyan)]">CORE_ACTIVE</div>
                    <div className="text-[7px] font-mono text-white/30">PORT: 3000 // SYNC: 99.8%</div>
                  </div>
                </div>
              </div>

              {/* Floating Status Nodes */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 glass-panel px-3 py-2 rounded-xl border border-white/5 shadow-xl bg-black/90 backdrop-blur-md flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[7px] font-mono text-white/40 tracking-wider">LINK: ONLINE</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-panel px-3 py-2 rounded-xl border border-white/5 shadow-xl bg-black/90 backdrop-blur-md flex items-center gap-2"
              >
                <span className="text-[7px] font-mono text-[var(--accent-cyan)] tracking-wider">NODE_SYS_0X12A</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Preview Section */}
        <section id="features" className="mt-32 lg:mt-48 pb-24 w-full">
          <div className="container mx-auto px-8 lg:px-20 max-w-6xl">
             <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                <div className="max-w-xl space-y-6">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-white/5 bg-white/[0.01]">
                      <Cpu size={12} className="text-[var(--accent-cyan)] animate-pulse" />
                      <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40">Core Capabilities</span>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-none text-white/90">
                     Designed for the <span className="font-extrabold text-hologram">Elite.</span>
                   </h2>
                </div>
                <button className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all group pb-2 border-b border-white/5">
                   View Full Documentation <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard 
                  icon={BrainCircuit} 
                  title="Neural Automation" 
                  desc="Autonomous swarms that handle complex enterprise workflows without human intervention."
                />
                <FeatureCard 
                  icon={Mic} 
                  title="Voice Intelligence" 
                  desc="Jarvis-level voice synthesis and recognition for seamless hands-free orchestration."
                />
                <FeatureCard 
                  icon={Shield} 
                  title="Advanced Security" 
                  desc="Military-grade encryption and secure verification for every neural node."
                />
                <FeatureCard 
                  icon={Globe} 
                  title="Global Node Sync" 
                  desc="Real-time data synchronization across 12+ global edge nodes for zero-latency link."
                />
             </div>
          </div>
        </section>

        {/* Pricing Section - Glassmorphic Matrix */}
        <section id="pricing" className="py-32 relative overflow-hidden w-full">
           <div className="container mx-auto px-8 lg:px-20 relative z-10 max-w-6xl">
              <div className="text-center mb-20 space-y-4">
                 <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white/90">Choose Your <span className="font-extrabold text-hologram">Uplink.</span></h2>
                 <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/25">Select a neural tier to begin synchronization.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                 {/* Tier 1 */}
                 <div className="glass-panel p-8 rounded-[24px] border border-white/5 flex flex-col items-center text-center space-y-6 group hover:border-[var(--accent-cyan)]/20 transition-all duration-500 bg-white/[0.01]">
                    <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">Tier: Core</div>
                    <div className="text-4xl font-extrabold tracking-tight text-white">Free</div>
                    <div className="w-full h-px bg-white/5" />
                    <ul className="space-y-3 text-[11px] font-medium tracking-wide text-white/40">
                       <li>Single Node Access</li>
                       <li>Basic Automation</li>
                       <li>Standard Support</li>
                    </ul>
                    <button 
                       onClick={() => handleStart('user')}
                       className="w-full py-3 rounded-full border border-white/5 bg-white/[0.01] text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 hover:bg-white/[0.05] hover:text-white transition-all duration-300"
                     >
                       Sync Node
                     </button>
                 </div>

                 {/* Tier 2 - Popular */}
                 <div className="glass-panel p-8 rounded-[24px] border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/[0.01] flex flex-col items-center text-center space-y-6 group relative shadow-[0_0_40px_rgba(0,209,255,0.05)] transition-all duration-500">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--accent-cyan)] text-black text-[7px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,209,255,0.3)]">Recommended</div>
                    <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-[var(--accent-cyan)]">Tier: Pro</div>
                    <div className="text-4xl font-extrabold tracking-tight text-white">$10<span className="text-xs font-medium text-white/40">/MO</span></div>
                    <div className="w-full h-px bg-[var(--accent-cyan)]/10" />
                    <ul className="space-y-3 text-[11px] font-medium tracking-wide text-white/60">
                       <li>Multi-Node Mesh</li>
                       <li>Advanced Swarms</li>
                       <li>Priority Telemetry</li>
                    </ul>
                    <button 
                       onClick={() => handleStart('admin')}
                       className="w-full py-3 rounded-full bg-white text-black text-[9px] font-bold uppercase tracking-[0.2em] hover:scale-102 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                     >
                       Elevate Link
                     </button>
                 </div>

                 {/* Tier 3 */}
                 <div className="glass-panel p-8 rounded-[24px] border border-white/5 flex flex-col items-center text-center space-y-6 group hover:border-purple-500/20 transition-all duration-500 bg-white/[0.01]">
                    <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">Tier: Enterprise</div>
                    <div className="text-4xl font-extrabold tracking-tight text-white">$20<span className="text-xs font-medium text-white/40">/MO</span></div>
                    <div className="w-full h-px bg-white/5" />
                    <ul className="space-y-3 text-[11px] font-medium tracking-wide text-white/40">
                       <li>Global Node Grid</li>
                       <li>Infinite Automation</li>
                       <li>24/7 Neural Concierge</li>
                    </ul>
                    <button 
                       onClick={() => handleStart('admin')}
                       className="w-full py-3 rounded-full border border-white/5 bg-white/[0.01] text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 hover:bg-white/[0.05] hover:text-white transition-all duration-300"
                     >
                       Establish Mesh
                     </button>
                 </div>
              </div>
           </div>
        </section>

      </main>

      {/* Futuristic Footer */}
      <footer className="py-20 border-t border-white/5 relative z-10">
         <div className="container mx-auto px-8 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="OMNIAI Logo" className="h-8 w-auto object-contain rounded-md drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              <span className="text-lg font-black uppercase tracking-widest">OMNIAI</span>
            </div>
            <div className="flex gap-12 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <a href="#" className="hover:text-white transition-colors">Security</a>
               <a href="#" className="hover:text-white transition-colors">Status</a>
            </div>
            <div className="text-[9px] font-mono text-white/10">SYSTEM_BUILD: 4.2.0.FINAL</div>
         </div>
      </footer>
    </div>
  );
}
