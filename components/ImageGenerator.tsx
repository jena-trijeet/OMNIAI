"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  Download,
  Copy,
  Check,
  FileText,
  Wand2
} from 'lucide-react';
import { generateImage } from '@/lib/utils';

const getImageFallback = (promptText: string): string => {
  const cities = [
    "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1024&auto=format&fit=crop"
  ];
  
  const robots = [
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=1024&auto=format&fit=crop"
  ];

  const spaces = [
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543722530-d2c32013a1e6?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1024&auto=format&fit=crop"
  ];

  const cars = [
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1024&auto=format&fit=crop"
  ];

  const foods = [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1024&auto=format&fit=crop"
  ];

  const defaults = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1024&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005198143-e5284b519a7f?q=80&w=1024&auto=format&fit=crop"
  ];

  const keywords = (promptText || "").toLowerCase();
  let selectedList = defaults;
  if (keywords.includes("city") || keywords.includes("skyline") || keywords.includes("metropolis") || keywords.includes("street")) {
    selectedList = cities;
  } else if (keywords.includes("robot") || keywords.includes("machine") || keywords.includes("cyborg") || keywords.includes("android") || keywords.includes("ai")) {
    selectedList = robots;
  } else if (keywords.includes("car") || keywords.includes("vehicle") || keywords.includes("cyber")) {
    selectedList = cars;
  } else if (keywords.includes("space") || keywords.includes("galaxy") || keywords.includes("star") || keywords.includes("cosmos")) {
    selectedList = spaces;
  } else if (keywords.includes("food") || keywords.includes("restaurant") || keywords.includes("dine") || keywords.includes("hotel")) {
    selectedList = foods;
  }

  let hash = 0;
  for (let i = 0; i < (promptText || "").length; i++) {
    hash = (promptText || "").charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % selectedList.length;
  return selectedList[index];
};

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Parameters for high-fidelity Image generation synthesis
  const [selectedStyle, setSelectedStyle] = useState<string>('Realistic');
  const [selectedRatio, setSelectedRatio] = useState<string>('1:1');
  const [selectedResolution, setSelectedResolution] = useState<string>('HD');

  // Interaction UX states
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    // Proactively preload Puter.js SDK in browser background
    if (typeof window !== "undefined" && !(window as any).puter) {
      console.log("[Puter] Proactively preloading SDK on component mount...");
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const STYLE_MODIFIERS: Record<string, string> = {
    'Realistic':   'photorealistic, DSLR photo, cinematic lighting, ultra detailed, 8k, sharp focus',
    'Anime':       'anime illustration style, vibrant colors, detailed, studio quality, masterwork',
    'Cyberpunk':   'neon cyberpunk aesthetic, holographic, rain streets, synthwave, futuristic glow',
    '3D Render':   'Octane Render 3D CGI, Unreal Engine 5, raytraced shadows, glossy surfaces',
    'Pixar':       'Pixar 3D animation style, colorful, glossy eyes, warm volumetric lighting',
    'Cinematic':   'cinematic film still, anamorphic lens, dramatic epic lighting, movie quality',
    'Ghibli':      'Studio Ghibli watercolor style, lush scenery, soft pastel, hand-painted look',
    'Fantasy':     'epic fantasy digital art, magical particles, glowing runes, atmospheric depth',
    'Neon':        'ultra-vibrant neon glow, electric blue and pink highlights, bioluminescent dark',
    'Watercolor':  'elegant watercolor painting, soft pigment washes, delicate paper texture'
  };

  const RESOLUTION_MODIFIERS: Record<string, string> = {
    'HD': 'high quality, 4k resolution, sharp focus, detailed',
    '2K': 'ultra high definition, 8k resolution, extremely detailed, masterwork, sharp focus',
    '4K': 'masterpiece, 8k resolution, flawless ultra-detailed textures, award-winning photography, hyper-detailed, sharp focus'
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, selectedStyle, selectedRatio, selectedResolution);
      setGeneratedImage(imageUrl);
      
      // Save generation activity in user's chronological memory vault
      localStorage.setItem('omniai_last_activity', JSON.stringify({
        type: 'System',
        label: 'AI Synthesis: IMAGE',
        content: `Synthesized image for prompt: "${prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt}"`,
        time: 'Just now'
      }));
      window.dispatchEvent(new Event('omniai_activity_update'));
    } catch (err: any) {
      console.error("Image synthesis failed:", err);
      setError(err.message || "Image failed to load. Please verify your network connection or try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-end justify-between">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5">
               <Sparkles size={14} className="text-purple-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Creation Matrix</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
               Image Gen<span className="text-[var(--accent-cyan)]">.</span>
            </h2>
            <p className="text-sm text-white/40 max-w-xl leading-relaxed">
               Deploy advanced neural models to generate hyper-realistic photos, artistic anime, cyberpunk designs, and 3D mockups.
            </p>
         </div>
      </div>

      {/* Main Generation Prompt Box */}
      <div className="flex-1 glass-panel rounded-[32px] border border-white/5 p-8 flex flex-col relative overflow-hidden transition-all duration-500">
         <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-cyan)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         
         <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
               <ImageIcon size={14} className="text-[var(--accent-cyan)] animate-pulse" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/60">
              Neural Image Synthesis Core
            </h3>
         </div>

         <div className="flex-1 min-h-[360px] relative flex flex-col lg:flex-row gap-8">
            
            {/* Input column */}
            <div className="flex-1 flex flex-col min-w-0">
               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Describe the image you want to synthesize... (e.g. 'A high-definition photorealistic render of a cyberpunk penthouse overlooking a neon metropolis, 8k resolution, cinematic lighting')"
                 className="w-full flex-1 min-h-[220px] bg-transparent border-none outline-none resize-none text-xl md:text-2xl font-light text-white placeholder:text-white/20 focus:ring-0 p-0 leading-relaxed"
               />
                
                {/* 🌟 Prompt Inspiration Preset Core */}
                <div className="space-y-3 mb-6 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50">Neural Core Prompt Presets ("Everything")</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      {
                        category: "Vehicles",
                        items: [
                          { name: "Cyberpunk Hypercar 🚗", prompt: "A futuristic glowing cyberpunk hypercar driving fast through rain-slick neon-lit streets, high speed motion blur, octane render, 8k", style: "Cyberpunk" },
                          { name: "Quantum Chopper 🏍️", prompt: "A chrome electric motorcycle chopper parked under a holographic billboard in a futuristic Tokyo alleyway, neon cyberpunk", style: "Cyberpunk" },
                          { name: "Heavy Rig 🚚", prompt: "A heavy transport cargo truck driving on a mountain pass during a snowstorm at night, volumetric lighting, photorealistic 8k", style: "Realistic" },
                          { name: "Camper Van 🚐", prompt: "A retro Volkswagen camper van parked on a cliff overlooking the ocean under a starry night sky, cozy campfire glow", style: "Realistic" }
                        ]
                      },
                      {
                        category: "Animals & Birds",
                        items: [
                          { name: "Cybernetic Lion 🦁", prompt: "A magnificent cybernetic lion with glowing neon-blue circuits, standing proudly on top of an obsidian peak, hyper-realistic", style: "Realistic" },
                          { name: "Fluffy Sheep 🐑", prompt: "A flock of fluffy sheep grazing in a lush green highland pasture under a beautiful golden sunset, warm rays, watercolor style", style: "Watercolor" },
                          { name: "Neon Tiger 🐯", prompt: "A glowing Bengal tiger prowling through a dark rainforest, vibrant neon-orange and purple bioluminescent flora, octane render", style: "Neon" },
                          { name: "Highland Cow 🐮", prompt: "A rugged Scottish highland cow standing on a misty hill, realistic oil painting, detailed long fur, moody atmosphere", style: "Cinematic" },
                          { name: "Phoenix Eagle 🦅", prompt: "A majestic golden eagle rising from ashes, wings made of glowing embers and fire, epic cinematic fantasy illustration", style: "Fantasy" }
                        ]
                      },
                      {
                        category: "Sci-Fi & Art",
                        items: [
                          { name: "Neon Metropolis 🏙️", prompt: "A photorealistic render of a cyberpunk penthouse overlooking a glowing neon metropolis, cinematic lighting, 8k resolution", style: "Cyberpunk" },
                          { name: "Cosmic Gateway 🌌", prompt: "A massive circular space portal opening in deep space, swirling stars and nebula colors, high-end sci-fi digital art", style: "Fantasy" },
                          { name: "Watercolor Kingfisher 🐦", prompt: "A colorful kingfisher bird perched on a branch, soft watercolor splash style, delicate pigment bleeds", style: "Watercolor" },
                          { name: "Neon Sushi 🍣", prompt: "A premium plate of futuristic neon-lit sushi on a glowing glass bar, vaporwave aesthetic, highly detailed 3D render", style: "3D Render" }
                        ]
                      }
                    ].map((group, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 py-1 border-b border-white/[0.02]">
                        <span className="text-[8px] font-black tracking-widest text-white/30 uppercase min-w-[100px]">{group.category}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map((item, itemIdx) => (
                            <button
                              key={itemIdx}
                              type="button"
                              onClick={() => {
                                setPrompt(item.prompt);
                                setSelectedStyle(item.style);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/30 text-[9px] font-medium text-white/60 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 🎨 Premium AI Image Parameters HUD Section */}
                <div className="space-y-6 pt-6 border-t border-white/5 mt-6 animate-in fade-in duration-500">
                  
                  {/* Style Presets Selector */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
                      <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50">1. Select AI Style Preset</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'Realistic', name: 'Realistic', color: 'from-slate-500/20 to-slate-900/40' },
                        { id: 'Anime', name: 'Anime', color: 'from-pink-500/20 to-pink-900/40' },
                        { id: 'Cyberpunk', name: 'Cyberpunk', color: 'from-cyan-500/20 to-cyan-900/40' },
                        { id: '3D Render', name: '3D Render', color: 'from-purple-500/20 to-purple-900/40' },
                        { id: 'Pixar', name: 'Pixar', color: 'from-yellow-500/20 to-yellow-900/40' },
                        { id: 'Cinematic', name: 'Cinematic', color: 'from-red-500/20 to-red-900/40' },
                        { id: 'Ghibli', name: 'Ghibli', color: 'from-emerald-500/20 to-emerald-900/40' },
                        { id: 'Fantasy', name: 'Fantasy', color: 'from-indigo-500/20 to-indigo-900/40' },
                        { id: 'Neon', name: 'Neon Glow', color: 'from-fuchsia-500/20 to-fuchsia-900/40' },
                        { id: 'Watercolor', name: 'Watercolor', color: 'from-teal-500/20 to-teal-900/40' }
                      ].map((style) => {
                        const isStyleActive = selectedStyle === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setSelectedStyle(style.id)}
                            className={`h-12 rounded-xl border relative overflow-hidden flex flex-col items-center justify-center transition-all group ${
                              isStyleActive 
                                ? 'border-[var(--accent-cyan)] shadow-[0_0_12px_rgba(0,209,255,0.15)] bg-white/[0.04]' 
                                : 'border-white/5 bg-black/40 hover:border-white/20'
                            }`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                            <span className={`text-[8.5px] font-black uppercase tracking-wider relative z-10 ${
                              isStyleActive ? 'text-[var(--accent-cyan)] font-extrabold' : 'text-white/50 group-hover:text-white'
                            }`}>
                              {style.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Aspect Ratios & Quality Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Aspect Ratio Picker */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-pulse" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50">2. Frame Aspect Ratio</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: '1:1', name: '1:1 Square', dims: 'w-4 h-4' },
                          { id: '16:9', name: '16:9 Landscape', dims: 'w-6 h-3.5' },
                          { id: '9:16', name: '9:16 Portrait', dims: 'w-3 h-6' }
                        ].map((ratio) => {
                          const isRatioActive = selectedRatio === ratio.id;
                          return (
                            <button
                              key={ratio.id}
                              type="button"
                              onClick={() => setSelectedRatio(ratio.id)}
                              className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                                isRatioActive 
                                  ? 'border-[var(--accent-cyan)] shadow-[0_0_12px_rgba(0,209,255,0.15)] bg-white/[0.04]' 
                                  : 'border-white/5 bg-black/40 hover:border-white/20'
                              }`}
                            >
                              <div className={`border border-current rounded ${ratio.dims} ${isRatioActive ? 'text-[var(--accent-cyan)]' : 'text-white/20'}`} />
                              <span className={`text-[8px] font-black uppercase tracking-wider ${isRatioActive ? 'text-[var(--accent-cyan)]' : 'text-white/40'}`}>
                                {ratio.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Resolution Selector */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-pink)] animate-pulse" />
                        <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50">3. Resolution Quality</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'HD', subtitle: 'Standard (1x)' },
                          { id: '2K', subtitle: 'Super-Res (2x)' },
                          { id: '4K', subtitle: 'Hyper-Res (4x)' }
                        ].map((res) => {
                          const isResActive = selectedResolution === res.id;
                          return (
                            <button
                              key={res.id}
                              type="button"
                              onClick={() => setSelectedResolution(res.id)}
                              className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                isResActive 
                                  ? 'border-[var(--accent-cyan)] shadow-[0_0_12px_rgba(0,209,255,0.15)] bg-white/[0.04]' 
                                  : 'border-white/5 bg-black/40 hover:border-white/20'
                              }`}
                            >
                              <span className={`text-[8.5px] font-black uppercase tracking-wider ${isResActive ? 'text-[var(--accent-cyan)]' : 'text-white/60'}`}>
                                {res.id}
                              </span>
                              <span className="text-[6.5px] font-mono text-white/30 uppercase mt-0.5">{res.subtitle}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                </div>
                
                {error && (
                   <div className="text-red-400 text-[10px] font-black tracking-widest uppercase mt-4 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                     Error: {error}
                   </div>
                )}

               <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
                  <div className="flex items-center gap-4">
                     <button className="text-[10px] font-bold tracking-widest text-white/40 hover:text-white transition-colors uppercase flex items-center gap-2">
                       <FileText size={14} /> Add Reference
                     </button>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-[var(--accent-cyan)] to-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,209,255,0.3)] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                  >
                     {isGenerating ? (
                       <><Loader2 size={14} className="animate-spin" /> Synthesizing...</>
                     ) : (
                       <><Wand2 size={14} /> Synthesize Image</>
                     )}
                  </button>
               </div>
            </div>
            
            {/* Output Column (Adaptive Split) */}
            <AnimatePresence mode="wait">
              {generatedImage && (
                <motion.div 
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.98 }}
                  className="w-full lg:w-[480px] xl:w-[560px] border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-8 flex flex-col gap-4 overflow-hidden min-w-0"
                >
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Synthesized Output</h4>
                     <button
                       onClick={() => {
                         navigator.clipboard.writeText(prompt);
                         setCopied(true);
                         setTimeout(() => setCopied(false), 2000);
                       }}
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-colors text-white/80 border border-white/5"
                     >
                       {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                       {copied ? 'Copied Prompt' : 'Copy Prompt'}
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[380px] glass-panel rounded-2xl border border-white/5 p-6 bg-black/20 no-scrollbar">
                     <div className="flex flex-col gap-4 items-center">
                       <img 
                          src={generatedImage} 
                          alt="Generated" 
                          className="w-full aspect-square rounded-xl object-cover shadow-[0_0_30px_rgba(0,209,255,0.2)] border border-purple-500/20" 
                          onError={() => {
                            setError("Image failed to load. Please try generating again.");
                            setGeneratedImage(null);
                          }}
                       />
                       <a 
                         href={generatedImage} 
                         download="omniai_generation.png"
                         target="_blank"
                         rel="noreferrer"
                         className="flex items-center gap-2 px-4 py-3 bg-[var(--accent-cyan)]/10 hover:bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors w-full justify-center text-[var(--accent-cyan)] mt-2"
                       >
                         <Download size={14} /> Download Image
                       </a>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
}
