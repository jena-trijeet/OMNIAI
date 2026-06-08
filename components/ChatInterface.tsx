"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Sparkles, 
  BrainCircuit, 
  Plus, 
  History, 
  Settings,
  MoreVertical,
  Bot,
  User,
  Zap,
  Globe,
  Image as ImageIcon,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Database,
  Workflow,
  Bell,
  Search,
  LayoutDashboard,
  MessageSquare,

  Copy,
  Volume2,
  VolumeX,
  RotateCcw,
  ThumbsUp,
  Maximize2,
  Cpu,
  Calendar,
  Layers,
  ShieldCheck,
  Fingerprint,
  Trash2,
  Download
} from 'lucide-react';
import { cn, speak, stopSpeaking, generateImage } from '@/lib/utils';

// --- Types ---
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'streaming';
  imageUrl?: string;
};

// --- Sub-Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, href }: any) => {
  const content = (
    <div 
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative text-left cursor-pointer",
        active ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
      )}
      onClick={onClick}
    >
      <Icon size={18} strokeWidth={active ? 2 : 1.5} className="group-hover:scale-110 transition-transform shrink-0" />
      <span className="text-[11px] font-black uppercase tracking-widest truncate">{label}</span>
      {active && (
        <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-[var(--accent-cyan)] rounded-full" />
      )}
    </div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">{content}</a>;
  }
  return content;
};

const SuggestionCard = ({ icon: Icon, label, onClick }: any) => (
  <motion.button
    whileHover={{ y: -5, scale: 1.02 }}
    onClick={onClick}
    className="glass-panel p-6 rounded-3xl border-white/5 hover:border-[var(--accent-cyan)]/20 transition-all text-left group w-full"
  >
    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[var(--accent-cyan)] group-hover:shadow-[0_0_20px_rgba(0,209,255,0.2)] transition-all mb-4">
      <Icon size={20} />
    </div>
    <div className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">{label}</div>
  </motion.button>
);

const ChatMessage = ({ message }: { message: Message }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "flex w-full mb-10 last:mb-0",
      message.role === 'user' ? "justify-end" : "justify-start"
    )}
  >
    <div className={cn(
      "max-w-[90%] lg:max-w-[80%] flex gap-4",
      message.role === 'user' ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 mt-1",
        message.role === 'assistant' 
          ? "bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] shadow-[0_0_20px_rgba(0,209,255,0.1)]" 
          : "bg-white/5 border-white/10 text-white/40"
      )}>
        {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
      </div>

      <div className={cn("flex flex-col gap-2", message.role === 'user' ? "items-end" : "items-start")}>
        <div className={cn(
          "px-7 py-5 text-[13px] leading-relaxed relative group overflow-hidden transition-all duration-500",
          message.role === 'assistant' 
            ? "glass-panel border-white/5 text-white/90 backdrop-blur-3xl rounded-3xl rounded-tl-none hover:border-[var(--accent-cyan)]/20" 
            : "bg-white text-black font-semibold rounded-3xl rounded-tr-none shadow-[0_15px_40px_rgba(255,255,255,0.1)]"
        )}>
          {message.role === 'assistant' && (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          <div className="relative z-10 whitespace-pre-wrap">{message.content}</div>

          {message.imageUrl && (
            <div className="mt-4 flex flex-col gap-3 max-w-sm sm:max-w-md overflow-hidden glass-panel rounded-2xl border border-white/10 p-3 bg-black/40">
              <div className="relative group/img aspect-square overflow-hidden rounded-xl bg-white/5 border border-white/5">
                <img 
                  src={message.imageUrl} 
                  alt={message.content}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a 
                    href={message.imageUrl} 
                    download="omniai_generation.png"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/25 rounded-2xl text-white transition-all backdrop-blur-md border border-white/15 hover:scale-110 active:scale-95 flex items-center justify-center"
                    title="Download High-Res"
                  >
                    <Download size={22} />
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-between text-[8.5px] font-mono font-bold uppercase tracking-wider text-white/40 px-1">
                <span className="flex items-center gap-1"><Sparkles size={10} className="text-[var(--accent-cyan)]" /> FLUX.1 (High Fidelity)</span>
                <a 
                  href={message.imageUrl} 
                  download="omniai_generation.png"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-[var(--accent-cyan)] transition-colors"
                >
                  <Download size={10} /> Save Image
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Message Actions */}
        <div className="flex items-center gap-4 px-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
           <button className="text-white/20 hover:text-[var(--accent-cyan)] transition-colors p-1"><Copy size={12} /></button>
           <button className="text-white/20 hover:text-[var(--accent-cyan)] transition-colors p-1"><Volume2 size={12} /></button>
           {message.role === 'assistant' && (
             <button className="text-white/20 hover:text-[var(--accent-cyan)] transition-colors p-1"><RotateCcw size={12} /></button>
           )}
           <span className="text-[8px] font-black uppercase tracking-widest text-white/5 ml-2">{message.timestamp}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export function ChatInterface({ userName, onNavigate }: { userName?: string; onNavigate?: (module: string) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Neural link stable. Welcome back. How can I assist your operations today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Neural-Nexus-v4.2');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSendVoice, setAutoSendVoice] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Voice Logic (Vocal Persona Uplink) ---
  const speakAI = (text: string) => {
    if (voiceEnabled) {
      speak(text, 'male');
    }
  };

  const toggleVoice = () => {
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    if (!nextVal) {
      stopSpeaking();
    }
  };

  const startListening = () => {
    // Force overlay to open immediately for visual feedback
    setShowVoiceOverlay(true);
    setIsListening(true);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (autoSendVoice) {
          setInput(transcript);
          handleSend(transcript);
        } else {
          setInput(prev => prev ? prev + ' ' + transcript : transcript);
        }
        setIsListening(false);
        setTimeout(() => setShowVoiceOverlay(false), 1000);
      };
      recognition.onerror = (err: any) => {
        console.warn("Neural Uplink Error:", err.error, err.message);
        setIsListening(false);
        setShowVoiceOverlay(false);
        if (err.error === 'not-allowed') {
          alert("Microphone access is blocked. Please click the microphone/lock icon in your browser's address bar and set permission to 'Allow'.");
        } else if (err.error === 'network') {
          alert("Voice input is currently unavailable in this browser (Speech Network Error). This happens when the browser's speech recognition engine cannot connect to its cloud service. Please type your message in the chat input instead.");
        } else if (err.error !== 'no-speech') {
          alert(`Neural Voice Uplink failed: ${err.error || 'Unknown error'}`);
        }
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } else {
      console.warn("Speech recognition not supported in this node.");
      // Keep overlay open for a bit so the user sees it, then close if not supported
      setTimeout(() => {
        setShowVoiceOverlay(false);
        setIsListening(false);
        alert("Neural Voice Uplink not supported in this browser. Use Chrome, Edge, or Brave for full voice access.");
      }, 2000);
    }
  };

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Image Generation Intercept (ChatGPT / Gemini style)
    const isImageRequest = (t: string) => {
      const clean = t.toLowerCase().trim();
      const prefixes = [
        "draw ", "paint ", "generate an image of", "generate image of", 
        "create an image of", "create image of", "make an image of", 
        "show me an image of", "draw an image of", "draw a picture of", 
        "create a picture of", "generate a picture of", "visualize ", "render "
      ];
      return prefixes.some(p => clean.startsWith(p) || clean.includes(' ' + p));
    };

    const extractImagePrompt = (t: string): string => {
      const prefixes = [
        "generate an image of",
        "generate image of",
        "create an image of",
        "create image of",
        "make an image of",
        "show me an image of",
        "draw an image of",
        "draw a picture of",
        "create a picture of",
        "generate a picture of",
        "draw ",
        "paint ",
        "visualize ",
        "render "
      ];
      let clean = t.trim();
      for (const prefix of prefixes) {
        const idx = clean.toLowerCase().indexOf(prefix);
        if (idx !== -1) {
          return clean.substring(idx + prefix.length).trim();
        }
      }
      return clean;
    };

    if (isImageRequest(text)) {
      const promptText = extractImagePrompt(text);
      
      const fetchImageResponse = async () => {
        try {
          const imageUrl = await generateImage(promptText, 'Realistic', '1:1', 'HD');
          
          const assistantMsg: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Here is the high-fidelity visualization you requested for: "${promptText}"`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            imageUrl: imageUrl
          };
          
          setMessages(prev => [...prev, assistantMsg]);
          setIsTyping(false);
          speakAI(`I have generated the image for you: ${promptText}`);
        } catch (error: any) {
          console.error("Image generation failure:", error);
          const errorMsg: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `I encountered an issue during image synthesis [${error.message || error}]. Please verify your neural uplink and try again.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, errorMsg]);
          setIsTyping(false);
        }
      };

      fetchImageResponse();
      return;
    }

    // --- Real Neural Uplink (OpenAI Integration) ---
    const fetchAIResponse = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            messages: messages.map(m => ({ role: m.role, content: m.content })).concat({ role: 'user', content: text }) 
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        const fullResponse = data.content;

        // Create streaming message
        const streamId = (Date.now() + 1).toString();
        const initialMsg: Message = {
          id: streamId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'streaming'
        };
        
        setMessages(prev => [...prev, initialMsg]);
        setIsTyping(false);
        
        // Sync Voice with Streaming Start
        speakAI(fullResponse);

        // Simulated Character Streaming
        let currentText = '';
        let index = 0;
        const speed = 20;

        const streamInterval = setInterval(() => {
          if (index < fullResponse.length) {
            currentText += fullResponse[index];
            setMessages(prev => prev.map(m => m.id === streamId ? { ...m, content: currentText } : m));
            index++;
          } else {
            clearInterval(streamInterval);
            setMessages(prev => prev.map(m => m.id === streamId ? { ...m, status: 'sent' } : m));
          }
        }, speed);

      } catch (error: any) {
        console.warn("Neural Bridge API Failure, attempting Puter AI client-side failover:", error);
        
        try {
          if (!(window as any).puter) {
            const script = document.createElement("script");
            script.src = "https://js.puter.com/v2/";
            script.async = true;
            document.body.appendChild(script);
            await new Promise((res) => {
              script.onload = res;
              script.onerror = res;
            });
          }

          if (!(window as any).puter) {
            throw new Error("Puter SDK unavailable");
          }

          const puter = (window as any).puter;
          
          const chatContext = messages
            .filter(m => m.content && !m.content.includes("Neural patterns disrupted"))
            .map(m => `${m.role === 'user' ? 'User' : 'OmniAI'}: ${m.content}`)
            .join('\n');
            
          const systemPrompt = `You are OmniAI, a futuristic Jarvis-style assistant. Respond concisely, elegantly, and intelligently.\n\nConversation history:\n${chatContext}\nUser: ${text}\nOmniAI:`;
          
          const fullResponse = await puter.ai.chat(systemPrompt, { model: 'gpt-4o-mini' });
          
          if (!fullResponse) {
            throw new Error("Empty response from Puter AI");
          }

          const streamId = (Date.now() + 1).toString();
          const initialMsg: Message = {
            id: streamId,
            role: 'assistant',
            content: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'streaming'
          };
          
          setMessages(prev => [...prev, initialMsg]);
          setIsTyping(false);
          speakAI(fullResponse);

          let currentText = '';
          let index = 0;
          const speed = 15;

          const streamInterval = setInterval(() => {
            if (index < fullResponse.length) {
              currentText += fullResponse[index];
              setMessages(prev => prev.map(m => m.id === streamId ? { ...m, content: currentText } : m));
              index++;
            } else {
              clearInterval(streamInterval);
              setMessages(prev => prev.map(m => m.id === streamId ? { ...m, status: 'sent' } : m));
            }
          }, speed);

        } catch (puterError: any) {
          console.error("Puter AI failover failed:", puterError);
          setIsTyping(false);
          const errorMsg: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Neural patterns disrupted [${error.message}]. I'm having trouble connecting to the logic node on the current port. Please ensure you are accessing the workspace via http://localhost:3000 and your API key is valid.`,
            timestamp: new Date().toLocaleTimeString()
          };
          setMessages(prev => [...prev, errorMsg]);
        }
      }
    };

    fetchAIResponse();
  };

  return (
    <div className="h-full flex overflow-hidden bg-[#050816] relative">
      
      {/* Neural Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="mesh-bg opacity-20" />
         <div className="scanline opacity-[0.02]" />
         <div className="absolute inset-0 bg-cyber-grid opacity-5" />
      </div>

      {/* LEFT SIDEBAR */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="relative z-50 border-r border-white/5 glass-panel-deep backdrop-blur-3xl flex flex-col"
          >
             <div className="p-8">
                <div className="flex items-center gap-3 mb-12">
                   <Cpu className="text-[var(--accent-cyan)] hologram-flicker" size={24} />
                   <span className="text-sm font-black uppercase tracking-[0.4em]">OmniAI</span>
                </div>

                <button 
                  onClick={() => setMessages([])}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 glass-panel border-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] rounded-2xl hover:bg-[var(--accent-cyan)]/5 transition-all mb-10 group"
                >
                   <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest">New Session</span>
                </button>

                <nav className="space-y-2">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 ml-2">Interaction Hub</div>
                   <SidebarItem icon={MessageSquare} label="OmniAI Chat" active />
                   <SidebarItem icon={Mic} label="Voice Assistant" onClick={startListening} />
                </nav>

                <nav className="mt-12 space-y-2">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 ml-2">Neural Nodes</div>
                   <SidebarItem icon={Calendar} label="Booking Hub" onClick={() => onNavigate?.('Booking')} />
                   <SidebarItem icon={Workflow} label="AI Automation" onClick={() => onNavigate?.('Automation')} />
                </nav>
             </div>

             <div className="mt-auto p-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl glass-panel border-white/10 flex items-center justify-center">
                      <User size={20} className="text-white/40" />
                   </div>
                   <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest">Trijeet.Node</div>
                      <div className="text-[8px] text-[var(--accent-cyan)]/60 font-bold uppercase tracking-widest">Enterprise Access</div>
                   </div>
                   <Settings size={16} className="text-white/20" />
                </div>
             </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 glass-panel backdrop-blur-3xl px-8 flex items-center justify-between gap-4 select-none">
           <div className="flex items-center gap-4 shrink-0">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 rounded-xl glass-panel border-white/10 flex items-center justify-center text-white/20 hover:text-white transition-colors shrink-0"
              >
                 {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
              
              <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border-white/10 group cursor-pointer whitespace-nowrap shrink-0">
                 <Zap size={14} className="text-[var(--accent-cyan)] shrink-0" />
                 <span className="text-[10px] font-black uppercase tracking-widest shrink-0">{selectedModel}</span>
                 <div className="w-px h-3 bg-white/10 shrink-0" />
                 <span className="text-[8px] font-mono text-white/25 uppercase shrink-0">Port_{typeof window !== 'undefined' ? window.location.port : '...'}</span>
              </div>
           </div>
 
           {/* Center — Clear Chat (visible only when chat is active) */}
           {messages.length > 0 && (
             <motion.button
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               onClick={() => setMessages([])}
               className="flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl border-white/5 hover:border-red-500/30 text-white/25 hover:text-red-400 transition-all duration-300 group whitespace-nowrap shrink-0"
             >
               <Trash2 size={13} className="group-hover:scale-110 transition-transform shrink-0" />
               <span className="text-[9px] font-black uppercase tracking-widest shrink-0">Clear Chat</span>
             </motion.button>
           )}
 
           <div className="flex items-center gap-4 shrink-0">
              <div className={cn(
                "flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border-white/10 transition-all duration-500 whitespace-nowrap shrink-0",
                (isListening || isSpeaking) && "border-[var(--accent-cyan)]/50 shadow-[0_0_20px_rgba(0,209,255,0.2)]"
              )}>
                 {(isListening || isSpeaking) ? <Volume2 size={14} className="text-[var(--accent-cyan)] animate-pulse shrink-0" /> : <Mic size={14} className="text-white/40 shrink-0" />}
                 <div className="w-12 h-4 flex items-center gap-0.5 shrink-0">
                    {[...Array(6)].map((_, i) => (
                       <motion.div 
                         key={i} 
                         animate={{ 
                           height: (isListening || isSpeaking) ? [4, 16, 4] : 4 
                         }}
                         transition={{ 
                           duration: 0.5, 
                           repeat: Infinity, 
                           delay: i * 0.1 
                         }}
                         className={cn(
                           "w-1 rounded-full transition-colors",
                           (isListening || isSpeaking) ? "bg-[var(--accent-cyan)]" : "bg-white/10"
                         )} 
                       />
                    ))}
                 </div>
              </div>
              <button className="text-white/20 hover:text-white transition-colors shrink-0"><Bell size={18} /></button>
              <div className="w-10 h-10 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 flex items-center justify-center text-[var(--accent-cyan)] shrink-0">
                 <Bot size={20} />
              </div>
           </div>
        </header>

        {/* CHAT SPACE */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 lg:px-12 py-12 relative">
           <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
                >
                   <div className="mb-12 relative">
                      <div className="absolute inset-0 bg-[var(--accent-cyan)]/20 blur-[100px] rounded-full animate-pulse" />
                      <div className="w-32 h-32 rounded-[40px] glass-panel border-[var(--accent-cyan)]/30 flex items-center justify-center text-[var(--accent-cyan)] relative z-10">
                         <Cpu size={64} className="hologram-flicker" />
                      </div>
                   </div>
                   
                   <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-16">
                      {userName ? (
                        <>Welcome back, <span className="text-hologram">{userName}</span>. <br/>How can I help you today?</>
                      ) : (
                        <>How can <span className="text-hologram">OmniAI</span> assist you today?</>
                      )}
                   </h2>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-6">
                      <SuggestionCard icon={Workflow} label="Build an AI workflow" onClick={() => handleSend("Help me build an AI workflow for my business.")} />
                      <SuggestionCard icon={Zap} label="Create automation" onClick={() => handleSend("I want to create a new automation.")} />
                      <SuggestionCard icon={Workflow} label="AI Automation" onClick={() => onNavigate?.('Automation')} />
                      <SuggestionCard icon={Database} label="Analyze business data" onClick={() => handleSend("Can you analyze my revenue data?")} />
                      <SuggestionCard icon={Wrench} label="Generate neural code" onClick={() => handleSend("Write a Python script for neural processing.")} />
                      <SuggestionCard icon={Globe} label="Search the matrix" onClick={() => handleSend("Research the latest trends in AGI.")} />
                   </div>
                </motion.div>
              ) : (
                <div className="max-w-4xl mx-auto">
                   {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
                   {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-6 items-start mb-8"
                      >
                         <div className="w-10 h-10 rounded-2xl glass-panel border-[var(--accent-cyan)]/20 flex items-center justify-center text-[var(--accent-cyan)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-[var(--accent-cyan)]/5 animate-pulse" />
                            <Bot size={20} className="hologram-flicker relative z-10" />
                         </div>
                         <div className="flex flex-col gap-3">
                            <div className="flex gap-1.5 px-6 py-4 glass-panel border-white/5 rounded-3xl rounded-tl-none relative group">
                               <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-cyan)]/10 to-transparent blur-lg" />
                               {[0, 1, 2].map(i => (
                                 <motion.div
                                   key={i}
                                   animate={{ 
                                     height: [4, 12, 4],
                                     opacity: [0.3, 1, 0.3] 
                                   }}
                                   transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                   className="w-1.5 bg-[var(--accent-cyan)] rounded-full shadow-[0_0_10px_var(--accent-cyan)]"
                                 />
                               ))}
                            </div>
                            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--accent-cyan)]/40 animate-pulse ml-2">Neural_Core: Thinking...</div>
                         </div>
                      </motion.div>
                    )}
                </div>
              )}
           </AnimatePresence>
           <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="px-6 lg:px-12 pb-12 relative">
           <div className="max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-purple)]/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              
              <div className="relative glass-panel rounded-[32px] p-2 pl-8 flex items-center gap-6 border-white/5 hover:border-white/10 focus-within:border-[var(--accent-cyan)]/30 transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
                 <button className="text-white/20 hover:text-[var(--accent-cyan)] transition-colors"><Plus size={20} /></button>
                 
                 <input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Ask OmniAI anything..."
                   className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/10 py-5"
                 />

                 <div className="flex items-center gap-3 pr-2">
                    <div className="flex items-center gap-1">
                       <button className="p-3 text-white/20 hover:text-white transition-colors"><ImageIcon size={18} /></button>
                       <button className="p-3 text-white/20 hover:text-white transition-colors"><Wrench size={18} /></button>
                       <button 
                         onClick={toggleVoice}
                         title={voiceEnabled ? "Mute AI Voice Output" : "Unmute AI Voice Output"}
                         className={cn(
                           "p-3 transition-colors",
                           voiceEnabled ? "text-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,210,255,0.2)]" : "text-white/20 hover:text-white"
                         )}
                       >
                          {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                       </button>
                       <button 
                         onClick={startListening}
                         className={cn(
                           "p-3 transition-colors",
                           isListening ? "text-[var(--accent-cyan)] animate-pulse" : "text-white/20 hover:text-white"
                         )}
                       >
                          <Mic size={18} />
                       </button>
                    </div>
                    <button 
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        input.trim() 
                          ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-105 active:scale-95" 
                          : "bg-white/5 text-white/20"
                      )}
                    >
                       <Send size={18} />
                    </button>
                 </div>
              </div>

              {/* Status Hint */}
              <div className="flex items-center justify-center gap-8 mt-6 opacity-30">
                 <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em]"><Database size={10} /> Sync_Stable</div>
                 <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em]"><Zap size={10} /> Neural_Nexus_v4.2</div>
              </div>
           </div>
        </div>
      </main>


      {/* CINEMATIC VOICE OVERLAY (JARVIS MODE) */}
      <AnimatePresence>
        {showVoiceOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
             <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
             
             {/* Large Pulsing Neural Core */}
             <div className="relative mb-24">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: ["0 0 40px rgba(0,209,255,0.2)", "0 0 100px rgba(0,209,255,0.5)", "0 0 40px rgba(0,209,255,0.2)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-48 h-48 rounded-full border-2 border-[var(--accent-cyan)]/30 flex items-center justify-center relative z-10"
                >
                   <div className="w-32 h-32 rounded-full border border-[var(--accent-cyan)]/20 animate-spin-slow" />
                   <Fingerprint size={80} className="text-[var(--accent-cyan)] absolute animate-pulse" />
                </motion.div>
                
                {/* Orbital Rings */}
                <div className="absolute inset-[-40px] border border-white/5 rounded-full animate-spin-slow" />
                <div className="absolute inset-[-80px] border border-dashed border-white/5 rounded-full animate-reverse-spin" />
             </div>

             <div className="flex flex-col items-center gap-6">
                <div className="text-[14px] font-black tracking-[1.5em] uppercase text-white/40 mb-4 ml-[1.5em]">System_Listening</div>
                
                {/* Active Waveform */}
                <div className="flex items-center gap-2 h-20">
                   {[...Array(24)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, 20 + (Math.sin(i) + 1) * 30, 10] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                        className="w-1.5 bg-[var(--accent-cyan)] rounded-full shadow-[0_0_10px_var(--accent-cyan)]"
                      />
                   ))}
                </div>

                <div className="mt-12 flex flex-col items-center gap-2">
                   <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent-cyan)] animate-pulse">Neural_Link: Established</div>
                   <div className="text-[9px] font-bold uppercase tracking-widest text-white/10 italic">Processing_Vocal_Pattern...</div>
                </div>
             </div>

             {/* Auto-Send / Dictation Mode Toggle */}
             <div className="absolute bottom-32 flex items-center gap-4 px-6 py-3 glass-panel border-white/5 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Auto-Send Voice</span>
                <button
                  onClick={() => setAutoSendVoice(!autoSendVoice)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                    autoSendVoice ? "bg-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,210,255,0.4)]" : "bg-white/10"
                  )}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                    animate={{ x: autoSendVoice ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
             </div>

             {/* Close Button */}
             <button 
               onClick={() => setShowVoiceOverlay(false)}
               className="absolute bottom-12 px-8 py-3 glass-panel border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
             >
                Cancel_Uplink
             </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
