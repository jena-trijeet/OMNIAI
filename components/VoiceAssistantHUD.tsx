"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Activity, Zap, Shield, Globe, Fingerprint, Volume2, BrainCircuit, Navigation } from 'lucide-react';
import { cn, speak } from '@/lib/utils';

interface VoiceAssistantHUDProps {
  onClose?: () => void;
  onTranscript?: (text: string) => void;
  onNavigate?: (module: string) => void;
}

const NAV_COMMANDS: { patterns: string[]; module: string; reply: string }[] = [
  { patterns: ['home', 'dashboard', 'main'],        module: 'Home',       reply: "Navigating to the Home Dashboard." },
  { patterns: ['chat', 'message', 'talk'],           module: 'Chat',       reply: "Opening the Chat Interface." },
  { patterns: ['automation', 'workflow', 'automate'],module: 'Automation', reply: "Launching the Automation Canvas." },
  { patterns: ['vault', 'memory', 'database'],       module: 'Vault',      reply: "Accessing the Memory Vault." },
  { patterns: ['image generation', 'image generate', 'generate image', 'create image'], module: 'ImageGen', reply: "Opening the Image Generation Module." },
  { patterns: ['video generation', 'video generate', 'generate video', 'create video'], module: 'VideoGen', reply: "Opening the Video Generation Module." },
  { patterns: ['generation', 'generate', 'create'],  module: 'ImageGen', reply: "Opening the Image Generation Module." },
  { patterns: ['booking', 'concierge', 'hotel', 'travel', 'reserve'], module: 'Booking', reply: "Opening the Booking Hub. Your reservations are ready." },
];

export function VoiceAssistantHUD({ onClose, onTranscript, onNavigate }: VoiceAssistantHUDProps) {
  const [isActive, setIsActive]           = useState(false);
  const [isListening, setIsListening]     = useState(false);
  const [transcript, setTranscript]       = useState('');
  const [isProcessing, setIsProcessing]   = useState(false);
  const [isSpeaking, setIsSpeaking]       = useState(false);
  const [assistantResponse, setAssistantResponse] = useState('');
  const [volume, setVolume]               = useState<number[]>(Array(30).fill(10));
  const [voicePersona, setVoicePersona]   = useState<'male' | 'female'>('male');
  const [isSupported, setIsSupported]     = useState(true);
  const [canClose, setCanClose]           = useState(false);
  
  const recognitionRef                    = useRef<any>(null);
  const speakingIntervalRef               = useRef<any>(null);
  const isActiveRef                       = useRef(false);
  const voicePersonaRef                   = useRef<'male' | 'female'>('male');
  const canvasRef                         = useRef<HTMLCanvasElement | null>(null);

  // Sync refs with states to prevent stale closure scope in recognition handlers
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    voicePersonaRef.current = voicePersona;
  }, [voicePersona]);

  // Click-through / ghost click protection on mount
  useEffect(() => {
    const timer = setTimeout(() => setCanClose(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Real-time Cybernetic Synthesizer Sound Effects (Web Audio API)
  const playSynthSound = (type: 'initiate' | 'processing' | 'success' | 'close') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'initiate') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'processing') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'success') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.14); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      } else if (type === 'close') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch (e) {
      console.warn("Web Audio Synth blocked or failed:", e);
    }
  };

  // Cybernetic dynamic particle systems visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const speedMultiplier = isSpeaking ? 3.0 : isProcessing ? 2.0 : isListening ? 1.5 : 0.5;
      const connectionDistance = isSpeaking ? 160 : isProcessing ? 140 : isListening ? 120 : 80;

      // Draw faint futuristic digital scan lines
      ctx.strokeStyle = 'rgba(0, 209, 255, 0.015)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw cyber particles
      particles.forEach((p, idx) => {
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(0, 209, 255, ${p.alpha * (isActive ? 1 : 0.3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < connectionDistance) {
            const lineAlpha = (1 - dist / connectionDistance) * 0.12 * (isActive ? 1 : 0.3);
            ctx.strokeStyle = `rgba(0, 209, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isActive, isListening, isSpeaking, isProcessing]);

  // Waveform animation while speaking
  const startWaveform = () => {
    setIsSpeaking(true);
    speakingIntervalRef.current = setInterval(() => {
      setVolume(Array.from({ length: 30 }, () => Math.random() * 80 + 15));
    }, 120);
  };

  const stopWaveform = () => {
    setIsSpeaking(false);
    if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
    setVolume(Array(30).fill(10));
  };

  const speakAndAnimate = async (text: string, onDone?: () => void) => {
    setAssistantResponse(text);
    startWaveform();
    speak(text, voicePersonaRef.current, () => {
      stopWaveform();
      if (onDone) onDone();
    });
  };

  const detectNavCommand = (text: string): { module: string; reply: string } | null => {
    const lower = text.toLowerCase();
    const isNavIntent = /go to|open|navigate|switch to|show me|take me|launch/.test(lower) || lower.split(' ').length <= 4;
    if (!isNavIntent) return null;
    for (const cmd of NAV_COMMANDS) {
      if (cmd.patterns.some(p => lower.includes(p))) return cmd;
    }
    return null;
  };

  const detectCloseCommand = (text: string): boolean => {
    const lower = text.toLowerCase().trim();
    return /^(close|exit|dismiss|bye|goodbye|stop|shut)/.test(lower);
  };

  const processCommand = async (text: string) => {
    setIsProcessing(true);
    playSynthSound('processing');
    
    // Stop recording immediately to prevent recording the synthesized speech output (feedback loop)
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.warn("Error stopping speech recognition during processing:", e);
    }

    // Close command
    if (detectCloseCommand(text)) {
      await speakAndAnimate("Closing voice interface. Standing by.", () => {
        setTimeout(() => onClose?.(), 500);
      });
      setIsProcessing(false);
      return;
    }

    // Navigation command
    const navCmd = detectNavCommand(text);
    if (navCmd && onNavigate) {
      await speakAndAnimate(navCmd.reply, () => {
        setTimeout(() => {
          onNavigate(navCmd.module);
          onClose?.();
        }, 300);
      });
      setIsProcessing(false);
      return;
    }

    // General AI query
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }]
        }),
      });
      const data = await response.json();
      const reply = data.content || data.error || "I couldn't process that request right now.";
      
      playSynthSound('success');
      setIsProcessing(false);
      
      await speakAndAnimate(reply, () => {
        // Automatically restart speech recognition after response is completely finished speaking
        if (isActiveRef.current) {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.warn("Failed to auto-restart recognition:", e);
          }
        }
      });
    } catch (err) {
      setIsProcessing(false);
      await speakAndAnimate("Neural link disrupted. Please check your connection and try again.", () => {
        if (isActiveRef.current) {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.warn("Failed to auto-restart recognition on error:", e);
          }
        }
      });
    }
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.results[event.results.length - 1][0].transcript;
        setTranscript(current);

        // Animate waveform while user is speaking into the mic
        if (!isSpeaking && !isProcessing) {
          setVolume(Array.from({ length: 30 }, () => Math.random() * 80 + 10));
        }

        if (event.results[event.results.length - 1].isFinal) {
          if (onTranscript) onTranscript(current);
          processCommand(current);
          setTimeout(() => setTranscript(''), 1500);
        }
      };

      recognition.onstart = () => {
        setIsListening(true);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error, e.message);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          alert("Microphone access is blocked. Please click the microphone/lock icon in your browser's address bar and set permission to 'Allow'.");
        } else if (e.error === 'network') {
          // If a network error occurs, the browser cannot access cloud speech services (very common in Brave/offline).
          // Fall back gracefully to the typed cybernetic inputs instead of locked alert cycles.
          setIsSupported(false);
          setIsActive(false);
          console.warn("Speech recognition network failure. Redirecting to typed cybernetic fallback inputs.");
        } else if (e.error !== 'no-speech') {
          alert(`Speech recognition failed: ${e.error || 'Unknown error'}`);
        }
      };
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      console.warn("SpeechRecognition is not supported or is disabled in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
      
      // Stop speech synthesis if component unmounts
      const synth = window.speechSynthesis;
      if (synth) synth.cancel();
      if ((window as any)._currentActiveAudio) {
        try {
          (window as any)._currentActiveAudio.pause();
        } catch (e) {}
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseTrigger = () => {
    if (!canClose) return;
    playSynthSound('close');
    onClose?.();
  };

  const toggleListening = () => {
    if (isProcessing || isSpeaking) return;
    if (isActive) {
      playSynthSound('close');
      setIsActive(false);
      setIsListening(false);
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      if (speakingIntervalRef.current) clearInterval(speakingIntervalRef.current);
      setAssistantResponse('');
      setTranscript('');
      
      const synth = window.speechSynthesis;
      if (synth) synth.cancel();
      if ((window as any)._currentActiveAudio) {
        try {
          (window as any)._currentActiveAudio.pause();
        } catch (e) {}
      }
    } else {
      playSynthSound('initiate');
      setIsActive(true);
      setAssistantResponse('');
      setTranscript('');
      
      // Speak the welcome greeting BEFORE starting SpeechRecognition to prevent the mic from picking up itself
      speakAndAnimate("Voice link established. OmniAI is listening.", () => {
        if (isActiveRef.current) {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.warn("Failed to start speech recognition after greeting:", e);
          }
        }
      });
    }
  };

  const coreLabel = isProcessing ? 'Processing...' : isSpeaking ? 'Speaking...' : isActive ? 'OmniAI is listening...' : 'Tap Core to Initiate Voice Link';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] backdrop-blur-3xl flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.94)' }}
    >
      {/* Background Holographic Vector Wave Visualizer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0" />
      <div className="absolute inset-0 mesh-bg opacity-45 pointer-events-none z-0" />

      {/* Top Controls */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-start z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Neural Link Active</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[var(--accent-cyan)]" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Freq: 442.8 THz</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-green-500" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Secure Link</span>
            </div>
            {onNavigate && (
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-purple-400" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Nav Commands Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Voice Persona Selectors & Close Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-full glass-panel border-white/5 bg-white/[0.02]">
            <button
              onClick={() => { setVoicePersona('male'); playSynthSound('processing'); }}
              className={cn(
                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider transition-all",
                voicePersona === 'male' 
                  ? "bg-[var(--accent-cyan)]/25 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 shadow-[0_0_10px_rgba(0,209,255,0.15)]" 
                  : "text-white/40 hover:text-white/60 border border-transparent"
              )}
            >
              Omni-Alpha (M)
            </button>
            <button
              onClick={() => { setVoicePersona('female'); playSynthSound('processing'); }}
              className={cn(
                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider transition-all",
                voicePersona === 'female' 
                  ? "bg-[var(--accent-cyan)]/25 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 shadow-[0_0_10px_rgba(0,209,255,0.15)]" 
                  : "text-white/40 hover:text-white/60 border border-transparent"
              )}
            >
              Omni-Beta (F)
            </button>
          </div>

          <button
            onClick={handleCloseTrigger}
            disabled={!canClose}
            className="w-12 h-12 rounded-full glass-panel border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Central Visualizer (The Core) */}
      {isSupported ? (
        <div className="relative mb-16 group cursor-pointer z-10" onClick={toggleListening}>
          <motion.div
            animate={{
              scale: (isActive || isSpeaking) ? [1, 1.08, 1] : 1,
              boxShadow: isProcessing
                ? ["0 0 40px rgba(123,97,255,0.3)", "0 0 100px rgba(123,97,255,0.6)", "0 0 40px rgba(123,97,255,0.3)"]
                : isSpeaking
                ? ["0 0 40px rgba(0,209,255,0.3)", "0 0 100px rgba(0,209,255,0.6)", "0 0 40px rgba(0,209,255,0.3)"]
                : isActive
                ? ["0 0 40px rgba(0,209,255,0.2)", "0 0 100px rgba(0,209,255,0.5)", "0 0 40px rgba(0,209,255,0.2)"]
                : "0 0 40px rgba(255,255,255,0.05)"
            }}
            transition={{ duration: isSpeaking ? 0.4 : 2, repeat: Infinity }}
            className={cn(
              "w-56 h-56 rounded-full border-2 flex items-center justify-center relative z-10 transition-colors duration-700",
              isProcessing ? "border-purple-500/30" : isActive || isSpeaking ? "border-[var(--accent-cyan)]/30" : "border-white/10"
            )}
          >
            <div className={cn(
              "w-40 h-40 rounded-full border border-dashed animate-spin-slow transition-opacity duration-700",
              isActive || isSpeaking ? "border-[var(--accent-cyan)]/20 opacity-100" : "border-white/10 opacity-40"
            )} />
            <div className="absolute inset-0 flex items-center justify-center">
              {isProcessing ? (
                <BrainCircuit size={80} className="text-purple-400 animate-pulse" />
              ) : isActive ? (
                <Fingerprint size={80} className="text-[var(--accent-cyan)] animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 size={80} className="text-[var(--accent-cyan)] animate-pulse" />
              ) : (
                <Mic size={64} className="text-white/20 group-hover:text-white transition-colors" />
              )}
            </div>
          </motion.div>

          {/* Orbital Rings */}
          <div className="absolute inset-[-40px] border border-white/5 rounded-full animate-spin-slow" />
          <div className="absolute inset-[-80px] border border-dashed border-white/5 rounded-full animate-reverse-spin" />
        </div>
      ) : (
        <div className="w-full max-w-lg mb-12 space-y-5 z-10 relative">
          <div className="glass-panel p-5 rounded-3xl border-amber-500/20 bg-amber-500/[0.02] text-amber-200 text-[10px] uppercase font-mono tracking-wider space-y-3 leading-relaxed text-left">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
              <Activity size={14} className="animate-pulse text-amber-500" />
              <span>Brave Browser Web Speech API Disabled</span>
            </div>
            <p className="text-white/60 normal-case font-sans text-xs">
              Brave disables the Web Speech API by default. To enable the voice recognition protocol:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-white/80 normal-case font-sans text-[11px] bg-black/40 p-3 rounded-2xl border border-white/5">
              <li>Open <strong className="font-mono text-[10.5px] text-[var(--accent-cyan)] select-all">brave://settings/privacy</strong> in Brave's address bar.</li>
              <li>Scroll down to the <strong className="text-white">"Use Google services for push messaging and Web Speech API"</strong> setting.</li>
              <li>Toggle it <strong className="text-emerald-400">ON</strong>.</li>
              <li>Relaunch Brave and reopen this voice assistant!</li>
            </ol>
            <p className="text-white/40 normal-case font-sans text-[10px]">
              You can still use the premium typed fallback input below to simulate voice commands!
            </p>
          </div>
          
          {/* Typed Command Fallback Input */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Type your command (e.g., 'go to booking', 'hello')..."
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    setTranscript(val);
                    await processCommand(val);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              className="w-full bg-slate-950/60 border border-white/10 rounded-2xl py-4.5 pl-12 pr-6 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[var(--accent-cyan)]/40 transition-all font-mono shadow-[0_0_20px_rgba(0,0,0,0.5)] focus:shadow-[0_0_30px_rgba(0,209,255,0.1)] text-left"
            />
            <Zap size={16} className="text-[var(--accent-cyan)] absolute left-4.5 top-5.5 animate-pulse" />
          </div>
        </div>
      )}

      {/* Dynamic Waveform HUD */}
      <div className="flex flex-col items-center gap-6 mb-10 z-10">
        <div className="flex items-center gap-1.5 h-20">
          {volume.map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: (isActive || isSpeaking) ? `${h}%` : '12%' }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "w-1 rounded-full transition-colors duration-300",
                isSpeaking
                  ? "bg-[var(--accent-cyan)] shadow-[0_0_8px_rgba(0,209,255,0.5)]"
                  : isActive
                  ? "bg-[var(--accent-cyan)]/70"
                  : "bg-white/10"
              )}
            />
          ))}
        </div>

        <button
          onClick={() => {
            playSynthSound('success');
            speak("OmniAI voice calibration complete. System ready.", voicePersona, () => playSynthSound('initiate'));
          }}
          className="flex items-center gap-2 px-6 py-2 rounded-full glass-panel border-[var(--accent-cyan)]/20 text-[8px] font-black uppercase tracking-[0.3em] text-[var(--accent-cyan)]/60 hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all"
        >
          <Volume2 size={12} />
          Test Vocal Persona
        </button>
      </div>

      {/* Transcript / Response Subtitles */}
      <div className="max-w-2xl w-full text-center space-y-4 z-10">
        <AnimatePresence mode="wait">
          {transcript ? (
            <motion.p
              key="transcript"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-medium tracking-tight text-white italic"
            >
              &ldquo;{transcript}&rdquo;
            </motion.p>
          ) : assistantResponse ? (
            <motion.p
              key="response"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm font-medium tracking-wide text-[var(--accent-cyan)]/80 leading-relaxed"
            >
              {assistantResponse}
            </motion.p>
          ) : (
            <motion.p
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20"
            >
              {coreLabel}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Navigation hint */}
        {!isActive && !isProcessing && !isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-2 mt-4"
          >
            {['Go to Home', 'Open Chat', 'Open Booking', 'Open Automation'].map((hint) => (
              <span key={hint} className="text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/5 text-white/20">
                {hint}
              </span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-12 flex items-center gap-10 z-10">
        <div className="flex items-center gap-2 opacity-30">
          <Zap size={14} className="text-[var(--accent-cyan)]" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white">Neural Processing</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 opacity-30">
          <Globe size={14} className="text-white" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white">Edge Sync: 12ms</span>
        </div>
      </div>
    </motion.div>
  );
}
