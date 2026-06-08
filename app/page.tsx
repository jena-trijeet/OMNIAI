"use client";
import React, { useState, useEffect } from 'react';
import {
  Home,
  BrainCircuit,
  Workflow,
  Calendar,
  Briefcase,
  Sparkles,
  Database,
  Settings,
  Plus,
  Cpu,
  Shield,
  Users,
  Globe,
  Activity,
  Zap,
  ArrowRight,
  Radio,
  Lock,
  Fingerprint,
  TrendingUp,
  Layers,
  Menu,
  X,
  Mic,
  MessageSquare,
  Sun,
  Moon,
  FileText,
  Code2,
  Presentation,
  Image as ImageIcon,
  Play,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BrandingNode } from '@/components/BrandingNode';
import { AutomationCanvas } from '@/components/AutomationCanvas';
import { ModelSwitchHUD } from '@/components/ModelSwitchHUD';
import { MemoryVault } from '@/components/MemoryVault';
import { ImageGenerator } from '@/components/ImageGenerator';
import { VideoGenerator } from '@/components/VideoGenerator';
import { AssistantSidebar } from '@/components/AssistantSidebar';
import { FloatingWidget } from '@/components/FloatingWidget';
import { HomeDashboard } from '@/components/HomeDashboard';
import { ChatInterface } from '@/components/ChatInterface';
import { ConciergeHub } from '@/components/ConciergeHub';
import { MarketingLanding } from '@/components/MarketingLanding';
import { SplashScreen } from '@/components/SplashScreen';
import { AuthModal } from '@/components/AuthModal';
import { VoiceAssistantHUD } from '@/components/VoiceAssistantHUD';
import { PDFStudio } from '@/components/PDFStudio';
import { CodeStudio } from '@/components/CodeStudio';
import { BusinessHub } from '@/components/BusinessHub';
import dynamic from 'next/dynamic';




export default function OSInterface() {
  const [mounted, setMounted]           = useState(false);
  const [pageStep, setPageStep]         = useState<'splash' | 'landing' | 'booting' | 'os'>('splash');
  const [activeModule, setActiveModule] = useState('Home');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMobile, setIsMobile]         = useState(false);
  const [showAuth, setShowAuth]         = useState(false);
  const [authMode, setAuthMode]         = useState<'login' | 'signup'>('signup');
  const [currentUser, setCurrentUser]   = useState<{ name: string; email: string } | null>(null);
  const [isVoiceHUDOpen, setIsVoiceHUDOpen] = useState(false);
  const [theme, setTheme]               = useState<'light' | 'dark'>('light');
  const [globalPortal, setGlobalPortal] = useState<'user' | 'admin'>('admin');

  useEffect(() => {
    setMounted(true);

    // Restore theme from localStorage
    try {
      const saved = localStorage.getItem('omniai_theme') as 'light' | 'dark' | null;
      const initial = saved || 'light';
      setTheme(initial);
      if (initial === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Theme restore failed', e);
    }

    // Restore portal from localStorage
    try {
      const savedPortal = localStorage.getItem('omniai_active_portal') as 'user' | 'admin' | null;
      if (savedPortal) {
        setGlobalPortal(savedPortal);
      }
    } catch (e) {}

    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const syncGlobalPortal = () => {
      try {
        const saved = localStorage.getItem('omniai_active_portal') as 'user' | 'admin' | null;
        if (saved) setGlobalPortal(saved);
      } catch (e) {}
    };
    window.addEventListener('omniai_portal_update', syncGlobalPortal);

    // Restore session safely
    try {
      const saved = localStorage.getItem('omniai_current_user');
      if (saved) setCurrentUser(JSON.parse(saved));
    } catch (e) {
      console.error('Session restore failed', e);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('omniai_portal_update', syncGlobalPortal);
    };
  }, []);


  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try { localStorage.setItem('omniai_theme', next); } catch (e) { /* noop */ }
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Central navigation handler – used by voice HUD, chat sidebar, dashboard cards
  const handleNavigate = (module: string) => {
    setActiveModule(module);
    setIsVoiceHUDOpen(false);
  };

  const handlePortalSwitch = (portal: 'user' | 'admin') => {
    if (portal === 'admin') {
      window.location.href = "/admin/index.html";
      return;
    }

    setGlobalPortal(portal);
    try {
      localStorage.setItem('omniai_active_portal', portal);
      window.dispatchEvent(new Event('omniai_portal_update'));
    } catch (e) {}

    // Redirect active module if it is not supported in the selected portal
    const userModules = ['Home', 'Chat', 'ImageGen', 'VideoGen', 'PDFStudio', 'BusinessHub', 'Booking', 'Vault'];
    
    if (!userModules.includes(activeModule)) {
      setActiveModule('Home');
    }
  };

  if (!mounted) return null;

  // --- Render Steps ---
  if (pageStep === 'splash') {
    return <SplashScreen onStart={() => setPageStep('landing')} />;
  }

  if (pageStep === 'landing') {
    return (
      <>
        <MarketingLanding
          onEnterPortal={(portal: 'user' | 'admin') => {
            if (portal === 'admin') {
              window.location.href = "/admin/index.html";
              return;
            }
            handlePortalSwitch(portal);
            if (currentUser) { setPageStep('os'); }
            else { setAuthMode('signup'); setShowAuth(true); }
          }}
          onLogin={() => { setAuthMode('login'); setShowAuth(true); }}
        />
        {showAuth && (
          <AuthModal
            initialMode={authMode}
            onClose={() => setShowAuth(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              setShowAuth(false);
              setPageStep('os');
            }}
          />
        )}
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col overflow-hidden relative font-sans"
      style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}
    >

      {/* ── Top Navigation Hub ─────────────────────────────────────────── */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 relative z-50 backdrop-blur-xl bg-black/40">
        <div className="flex items-center gap-10">
          <BrandingNode />
          <div className="hidden lg:flex items-center gap-6 px-6 py-2 rounded-full glass-panel border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">System_Active</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="text-[9px] font-bold tracking-widest text-[var(--accent-cyan)] uppercase">Lat: 12ms</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && (
            <div className="flex items-center gap-6 text-[10px] font-mono text-white/30 mr-4">
              <div>MEM: 14.2GB</div>
              <div>CPU: 38°C</div>
            </div>
          )}

          <div className="text-[10px] font-black tracking-widest text-[var(--accent-cyan)]/80 uppercase hidden sm:block">
            Uplink Stable
          </div>

          {/* User/Admin Global Switcher */}
          <div className="flex gap-1 p-1 bg-black/60 border border-white/5 rounded-xl mr-2">
            <button
              onClick={() => handlePortalSwitch('user')}
              title="Switch to User Panel"
              className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                globalPortal === 'user'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-white/45 hover:text-white border border-transparent'
              }`}
            >
              <Users size={10} />
              User
            </button>
            <button
              onClick={() => handlePortalSwitch('admin')}
              title="Switch to Admin Panel"
              className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                globalPortal === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-white/45 hover:text-white border border-transparent'
              }`}
            >
              <Shield size={10} />
              Admin
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="relative w-9 h-9 rounded-xl glass-panel border-white/10 flex items-center justify-center hover:border-[var(--accent-cyan)]/30 transition-all group overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  <Sun size={15} className="text-amber-400" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                >
                  <Moon size={15} className="text-slate-500" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Voice Assistant */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVoiceHUDOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 glass-panel border-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all group rounded-lg"
          >
            <Mic size={12} className="group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">Voice Assistant</span>
          </button>

          {/* Log Out */}
          <button
            onClick={() => {
              setCurrentUser(null);
              localStorage.removeItem('omniai_current_user');
              setPageStep('landing');
            }}
            title="Log Out"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Sidebar Nav ───────────────────────────────────────────────── */}
        <aside className={cn(
          "border-r border-white/5 flex flex-col items-center py-10 z-50 transition-all duration-700",
          "bg-black/20",
          isMobile ? "fixed bottom-0 left-0 right-0 h-20 flex-row justify-around py-0 px-6 border-r-0 border-t" : "w-24"
        )}>
          {[
            { id: 'Home',        icon: Home,          label: 'Home',         portal: 'both' },
            { id: 'Chat',        icon: MessageSquare, label: 'Chat',         portal: 'user' },
            { id: 'ImageGen',    icon: ImageIcon,     label: 'Image',        portal: 'user' },
            { id: 'VideoGen',    icon: Play,          label: 'Video',        portal: 'user' },
            { id: 'PDFStudio',   icon: FileText,      label: 'PDF Studio',   portal: 'user' },
            { id: 'BusinessHub', icon: Briefcase,     label: 'Business Hub', portal: 'both' },
            { id: 'Booking',     icon: Calendar,      label: 'Booking Hub',  portal: 'user' },
            { id: 'Vault',       icon: Database,      label: 'Vault',        portal: 'user' },
            { id: 'Automation',  icon: Workflow,      label: 'Automation',   portal: 'admin' },
            { id: 'CodeStudio',  icon: Code2,         label: 'Code Studio',  portal: 'admin' },
          ].filter(item => item.portal === 'both' || item.portal === globalPortal)
           .map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id.toLowerCase()}`}
              onClick={() => setActiveModule(item.id)}
              title={item.label}
              className={cn(
                "p-4 rounded-2xl transition-all duration-500 group relative",
                activeModule === item.id
                  ? "text-[var(--accent-cyan)] scale-110"
                  : "text-white/20 hover:text-white/60"
              )}
            >
              <item.icon size={isMobile ? 20 : 24} strokeWidth={1.5} />
              {activeModule === item.id && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-2xl bg-[var(--accent-cyan)]/5 shadow-[0_0_20px_var(--accent-cyan)]/10"
                />
              )}
              {!isMobile && (
                <span className="absolute left-full ml-3 px-2 py-1 rounded-lg bg-black/80 text-[8px] font-black uppercase tracking-widest text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Main Workspace ────────────────────────────────────────────── */}
        <main className="flex-1 relative overflow-y-auto no-scrollbar p-6 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full"
            >
              {activeModule === 'Home'       && <HomeDashboard currentUser={currentUser} onNavigate={handleNavigate} globalPortal={globalPortal} />}
              {activeModule === 'Chat'       && <ChatInterface onNavigate={handleNavigate} />}
              {activeModule === 'Automation' && <AutomationCanvas />}
              {activeModule === 'Vault'      && <MemoryVault />}
              {activeModule === 'BusinessHub' && <BusinessHub />}
              {activeModule === 'ImageGen'   && <ImageGenerator />}
              {activeModule === 'VideoGen'   && <VideoGenerator />}
              {activeModule === 'CodeStudio' && <CodeStudio />}
              {activeModule === 'PDFStudio'  && <PDFStudio />}
              {activeModule === 'Booking'    && <ConciergeHub />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── Floating Assistant Trigger ────────────────────────────────── */}
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className="fixed bottom-10 right-10 w-16 h-16 rounded-full glass-panel border-[var(--accent-cyan)]/30 flex items-center justify-center text-[var(--accent-cyan)] shadow-[0_0_30px_rgba(0,209,255,0.2)] hover:scale-110 transition-all z-[1000] p-3 overflow-hidden"
        >
          <img src="/logo.png" alt="Assistant Logo" className="w-full h-full object-cover rounded-full hologram-flicker" />
        </button>

        {/* ── Assistant Sidebar ─────────────────────────────────────────── */}
        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-96 backdrop-blur-3xl border-l border-white/5 z-[999] shadow-[-20px_0_50px_rgba(0,0,0,0.3)]"
              style={{ backgroundColor: 'var(--bg-obsidian)' }}
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em]">Neural Assistant</h3>
                  <button onClick={() => setIsAssistantOpen(false)} className="text-white/20 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <AssistantSidebar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Voice Assistant HUD ───────────────────────────────────────── */}
        <AnimatePresence>
          {isVoiceHUDOpen && (
            <VoiceAssistantHUD
              onClose={() => setIsVoiceHUDOpen(false)}
              onNavigate={handleNavigate}
              onTranscript={(text) => {
                console.log('Global Voice Command:', text);
              }}
            />
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
