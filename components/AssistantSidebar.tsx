"use client";
import { useEffect, useRef, useState } from 'react';
import { 
  Mic, 
  Command,
  Radio,
  X,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AssistantSidebar() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Welcome back, Operator. Cognitive uplink verified. How can I assist your operations today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll to bottom of message feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 200,
      y: Math.random() * 200,
      radius: Math.random() * 2 + 0.5,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, 200, 200);
      
      const centerX = 100;
      const centerY = 100;
      const baseRadius = 60 + Math.sin(frame * 0.03) * 3;

      // Outer Glow Orbital
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.stroke();

      particles.forEach((p, i) => {
        p.angle += p.speed;
        const radiusOffset = Math.sin(frame * 0.02 + p.phase) * 10;
        const x = centerX + Math.cos(p.angle) * (baseRadius + radiusOffset);
        const y = centerY + Math.sin(p.angle) * (baseRadius + radiusOffset);
        
        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 242, 255, 0.5)' : 'rgba(112, 0, 255, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.fill();

        // Connect particles
        if (i > 0 && i % 4 === 0) {
           ctx.beginPath();
           ctx.moveTo(x, y);
           ctx.lineTo(centerX, centerY);
           ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
           ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg)
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error: any) {
      console.error("Neural Bridge Failure in Sidebar:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error linking to cognitive core: ${error.message}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const startListening = () => {
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } else {
      setIsListening(false);
      alert("Neural Voice Uplink not supported in this browser.");
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      
      {/* Header: AI Core Node */}
      <div className="mb-6 flex flex-col items-center text-center shrink-0">
        <div 
          className="relative w-40 h-40 flex items-center justify-center cursor-pointer group"
          onClick={startListening}
        >
          <canvas ref={canvasRef} width={200} height={200} className="relative z-10 transition-transform group-hover:scale-105 duration-700 w-full h-full" />
          <div className="absolute inset-0 bg-[var(--accent-cyan)]/5 blur-3xl rounded-full" />
          
          <div className="absolute z-20 flex flex-col items-center gap-2 w-10 h-10 justify-center">
             <img src="/logo.png" alt="Neural Core" className={cn("w-8 h-8 object-cover rounded-full transition-all duration-700 hologram-flicker", isListening ? "opacity-100 scale-105 drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]" : "opacity-45")} />
             <div className="flex gap-1 h-2 items-end">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-0.5 bg-[var(--accent-cyan)]/40 animate-pulse" style={{ height: isListening ? '100%' : '20%', animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          </div>
        </div>
        
        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-hologram mt-2">Omni_Neural_Core</h3>
        <div className="flex items-center gap-4 mt-2">
           <div className="flex items-center gap-2">
             <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
             <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">n8n Cognitive Link</span>
           </div>
           <div className="w-px h-2 bg-white/10" />
           <div className="text-[8px] font-mono tracking-widest text-[var(--accent-cyan)] opacity-60">WS_UPLINK: ACTIVE</div>
        </div>
      </div>

      {/* Dynamic Interaction Feed */}
      <div ref={feedRef} className="flex-1 space-y-4 overflow-y-auto no-scrollbar mb-6 min-h-0 pr-1">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={cn(
              "p-4 rounded-2xl border relative group transition-all duration-300",
              msg.role === 'user' 
                ? "bg-white text-black font-semibold border-white/10 ml-8" 
                : "glass-panel border-white/5 text-white/80 mr-8"
            )}
          >
            <div className={cn(
              "text-[7px] font-bold uppercase tracking-widest mb-1.5",
              msg.role === 'user' ? "text-black/50" : "text-[var(--accent-cyan)]"
            )}>
              {msg.role === 'user' ? 'Operator' : 'Omni Intelligence'}
            </div>
            <p className="text-[10px] leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {isTyping && (
          <div className="p-4 rounded-2xl glass-panel border-white/5 text-white/80 mr-8 flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--accent-cyan)] animate-pulse">Calculating Synapses...</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-[var(--accent-cyan)] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Strip */}
      <div className="pt-4 border-t border-white/5 space-y-4 shrink-0">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <Radio size={12} className="text-[var(--accent-cyan)] animate-pulse" />
               <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Neural Link: Stable</span>
            </div>
            <button 
              onClick={() => setMessages([{ role: 'assistant', content: "Neural session restarted." }])}
              className="text-[8px] font-mono text-white/20 hover:text-white uppercase tracking-wider"
            >
              Clear Feed
            </button>
         </div>

         <div className="relative group">
            <Command size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              type="text" 
              placeholder="COMMAND JARVIS..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-10 py-3 text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:border-[var(--accent-cyan)]/30 transition-all text-white"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <Mic size={12} className={cn("cursor-pointer transition-colors", isListening ? "text-[var(--accent-cyan)] animate-pulse" : "text-white/20 hover:text-white")} onClick={startListening} />
            </div>
         </div>
      </div>

    </div>
  );
}
