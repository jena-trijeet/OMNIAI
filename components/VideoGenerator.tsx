"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  Pause,
  RotateCcw,
  Maximize2,
  Download,
  Copy,
  Check,
  FileText,
  Video,
  Clock,
  Film,
  Upload,
  Sliders,
  Compass,
  Cpu,
  Bookmark,
  Heart,
  HelpCircle,
  Volume2,
  Grid,
  Trash2,
  ArrowRight,
  Eye,
  RefreshCw,
  Info,
  Loader2
} from 'lucide-react';

// ==========================================
// STATIC PRESET & MEDIA LINKS
// ==========================================

const STYLE_PRESETS = [
  {
    id: 'cinematic',
    name: 'Cinematic Cinema',
    desc: 'Anamorphic film style, deep shadows, Hollywood lighting.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    color: 'from-amber-500/20 to-red-900/40 border-amber-500/30 text-amber-400'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    desc: 'Synthetic grids, glowing holograms, rain-slick neon streets.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    color: 'from-cyan-500/20 to-blue-900/40 border-cyan-500/30 text-cyan-400'
  },
  {
    id: 'realistic',
    name: 'Photo Realistic',
    desc: '8K texture density, natural volumetric lighting, photorealistic.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    color: 'from-slate-500/20 to-slate-900/40 border-slate-500/30 text-slate-300'
  },
  {
    id: 'anime',
    name: 'Anime Dream',
    desc: 'Vibrant cell shading, fantasy sky backdrops, Ghibli atmosphere.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    color: 'from-pink-500/20 to-rose-950/40 border-pink-500/30 text-pink-400'
  },
  {
    id: 'futuristic',
    name: 'Sci-Fi Quantum',
    desc: 'Bioluminescent micro-mesh, hyper-technological structures.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    color: 'from-emerald-500/20 to-emerald-900/40 border-emerald-500/30 text-emerald-400'
  },
  {
    id: '3d-animation',
    name: '3D CGI Unreal',
    desc: 'Unreal Engine 5 output, soft ray-traced ambient occlusion.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    color: 'from-purple-500/20 to-purple-900/40 border-purple-500/30 text-purple-400'
  }
];

const DIRECTORS_PROMPTS = [
  {
    title: "Quantum Black Hole",
    prompt: "An extreme close-up of a rotating cosmic singularity, pulling glowing purple accretion disks, volumetric gravitational distortion, Unreal 5 render."
  },
  {
    title: "Neo-Tokyo Alley",
    prompt: "Slow-motion slider shot through a futuristic cyber alleyway, rain reflection on cybernetic cables, massive 3D holograms flickering above."
  },
  {
    title: "Bioluminescent Forest",
    prompt: "Pan down of a dense glowing alien jungle, microscopic bioluminescent spores drifting through glowing cyan flora, hyper-real macro photography."
  },
  {
    title: "AI Android Awakening",
    prompt: "Extreme macro shot of an android eye slowly opening, intricate gold circuits pulsing with teal light under glass skin, highly emotional CGI."
  }
];

const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    title: 'Neon Cyber-Alleyway Flythrough',
    prompt: 'Slow dolly shot through a futuristic cyberpunk city alley, massive holographic banners.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    style: 'Cyberpunk Neon',
    duration: '8.0s',
    fps: '30 FPS',
    ratio: '16:9',
    favorite: true
  },
  {
    id: 'hist-2',
    title: 'Cosmic Singularity Synthesis',
    prompt: 'Hyper-detailed view of a spatial gravitational singularity drawing light waves.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    style: 'Cinematic Cinema',
    duration: '12.0s',
    fps: '60 FPS',
    ratio: '16:9',
    favorite: false
  },
  {
    id: 'hist-3',
    title: 'Bioluminescent Spores Drift',
    prompt: 'Floating micro particles glowing in a dark organic biome, macro depth of field.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    style: 'Anime Dream',
    duration: '4.0s',
    fps: '24 FPS',
    ratio: '9:16',
    favorite: true
  }
];

const getDynamicVideoUrl = (promptText: string, selectedStyleId: string): string => {
  const pLower = promptText.toLowerCase();
  
  // 1. Space / Cosmic / Stars
  if (pLower.includes("space") || pLower.includes("star") || pLower.includes("galaxy") || pLower.includes("singularity") || pLower.includes("black hole") || pLower.includes("cosmos")) {
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
  }
  
  // 2. Cyberpunk / City / Neon / Car / Street / Urban
  if (pLower.includes("city") || pLower.includes("street") || pLower.includes("neon") || pLower.includes("cyber") || pLower.includes("tokyo") || pLower.includes("car") || pLower.includes("alley")) {
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4";
  }

  // 3. Nature / Forest / Animal / Dog / Cat / Green / Landscape
  if (pLower.includes("nature") || pLower.includes("forest") || pLower.includes("dog") || pLower.includes("cat") || pLower.includes("tree") || pLower.includes("animal") || pLower.includes("grass")) {
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4";
  }

  // 4. Cartoon / Whimsical / Bunny / Animation / Pixar / Anime
  if (pLower.includes("bunny") || pLower.includes("rabbit") || pLower.includes("cartoon") || pLower.includes("anime") || pLower.includes("whimsical") || pLower.includes("child") || pLower.includes("dream")) {
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  }

  // 5. Tech / Circuit / Microchip / Robot / Android / Machine
  if (pLower.includes("robot") || pLower.includes("machine") || pLower.includes("android") || pLower.includes("tech") || pLower.includes("circuit") || pLower.includes("computer")) {
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
  }

  // Fallback to style preset default URL
  const presetMapping: Record<string, string> = {
    'cinematic': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'cyberpunk': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    'realistic': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'anime': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'futuristic': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    '3d-animation': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  };

  return presetMapping[selectedStyleId] || presetMapping['cinematic'];
};

const isVideoUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  if (url.startsWith('data:image/')) return false;
  return url.endsWith('.mp4') || url.includes('.mp4');
};

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

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<string>("Standby");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Active Output Media
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    prompt: string;
    url: string;
    duration: string;
    style: string;
    fps: string;
    ratio: string;
  }>({
    title: 'Quantum Abstract Waveform',
    prompt: 'Default cinematic background loop for OMNIAI Studio',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '8.0s',
    style: 'Cinematic Cinema',
    fps: '24 FPS',
    ratio: '16:9'
  });

  // Advanced synthesis parameters
  const [selectedStyle, setSelectedStyle] = useState<string>('cinematic');
  const [selectedDuration, setSelectedDuration] = useState<string>('8.0s');
  const [selectedRatio, setSelectedRatio] = useState<string>('16:9');
  const [selectedFps, setSelectedFps] = useState<string>('30 FPS');
  const [cameraMotion, setCameraMotion] = useState<string>('Orbit Zoom');
  const [motionStrength, setMotionStrength] = useState<number>(6);
  const [seed, setSeed] = useState<string>('42091104');
  const [isUpscaling, setIsUpscaling] = useState<boolean>(true);
  const [isMotionBlur, setIsMotionBlur] = useState<boolean>(false);

  // Image Upload Animation Mode
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Studio Player HUD states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // History & Tabs Dashboard
  const [activeDashboardTab, setActiveDashboardTab] = useState<'history' | 'favorites' | 'templates'>('history');
  const [projectsList, setProjectsList] = useState(INITIAL_HISTORY);
  const [isCopied, setIsCopied] = useState(false);

  // Video Ref Reference
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // CUSTOM STUDIO VIDEO PLAYER EFFECTS
  // ==========================================
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) setVideoDuration(video.duration);
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('loadedmetadata', () => {
      if (video.duration) setVideoDuration(video.duration);
    });

    // Force load and play to bypass lazy caching & secure autoplay
    try {
      video.load();
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.warn("Autoplay policy blocked, standing by for user action.", e);
        setIsPlaying(false);
      });
    } catch (err) {
      console.warn("Video play trigger failure", err);
    }

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [activeVideo]);

  // Simulated timeline advance timer for image animations
  useEffect(() => {
    setCurrentTime(0);
    if (!isVideoUrl(activeVideo.url)) {
      setVideoDuration(parseFloat(selectedDuration) || 8.0);
    }
  }, [activeVideo.url, selectedDuration]);

  useEffect(() => {
    if (isVideoUrl(activeVideo.url)) return;
    if (!isPlaying) return;

    const maxDuration = parseFloat(selectedDuration) || 8.0;
    setVideoDuration(maxDuration);

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.1;
        if (next >= maxDuration) {
          return 0; // loops back smoothly
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, activeVideo.url, selectedDuration]);

  const togglePlay = () => {
    if (isVideoUrl(activeVideo.url)) {
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(e => console.warn("Player play error", e));
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleReplay = () => {
    setCurrentTime(0);
    if (isVideoUrl(activeVideo.url)) {
      if (!videoRef.current) return;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.warn("Player replay error", e));
    }
    setIsPlaying(true);
  };

  const handleFullscreen = () => {
    // If it's a video, expand the video element
    if (isVideoUrl(activeVideo.url)) {
      if (!videoRef.current) return;
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      }
    } else {
      // If it's an image motion canvas, expand the whole preview wrapper container
      const container = document.getElementById("omniai-studio-player-container");
      if (container) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          (container as any).webkitRequestFullscreen();
        }
      }
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (isVideoUrl(activeVideo.url) && videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  // ==========================================
  // IMAGE ASSET UPLOAD SIMULATION
  // ==========================================

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setImageName(file.name);
        // Dispatch UI update to chronological vault
        localStorage.setItem('omniai_last_activity', JSON.stringify({
          type: 'System',
          label: 'Asset Ingested',
          content: `Ingested image: ${file.name} for AI animation loop synthesis`,
          time: 'Just now'
        }));
        window.dispatchEvent(new Event('omniai_activity_update'));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUploadedImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedImage(null);
    setImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // AI DIRECTOR & COPILOT METHOD
  // ==========================================

  const handlePromptCopilot = () => {
    if (!prompt.trim()) {
      setPrompt("High-end drone panning of a sleek neon solar-punk metropolis, 8k cinematic lighting, masterwork render");
      return;
    }

    setIsGenerating(true);
    setGenerationStage("Director Prompt Uplink");
    
    // Simulate prompt improvement
    setTimeout(() => {
      const improvements = [
        `An epic cinematic 8K panning shot of ${prompt}, with gorgeous photorealistic light dispersion, photorealistic atmospheric fog, volumetric dust motes, directed under custom high-contrast color styling, Unreal Engine 5 production rendering.`,
        `Slow-motion tracking dolly sequence of ${prompt}, intense dynamic volumetric lights, high-end CGI texture density, complex particle simulation, cinematic masterwork with deep ambient shadows.`,
        `Beautiful Studio Ghibli hand-painted anime sequence of ${prompt}, lush volumetric ambient clouds, nostalgic glowing pastel aesthetics, seamless frames.`
      ];
      setPrompt(improvements[Math.floor(Math.random() * improvements.length)]);
      setIsGenerating(false);
      setGenerationStage("Standby");
    }, 900);
  };

  const handleIdeaCardClick = (ideaPrompt: string) => {
    setPrompt(ideaPrompt);
  };

  // ==========================================
  // TEMPORAL VIDEO SYNTHESIS GENERATOR
  // ==========================================

  const handleInitiateSynthesis = async () => {
    if (!prompt.trim() && !uploadedImage) {
      setError("Please input a prompt or upload an asset first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(5);
    setGenerationStage("Initializing Temporal Grid...");

    let generatedImageUrl = "";
    
    // Start generating image asynchronously from neural synthesis api node
    const apiCallPromise = (async () => {
      try {
        if (!prompt.trim()) return; // Image upload animation mode doesn't need generation

        const activePreset = STYLE_PRESETS.find(p => p.id === selectedStyle) || STYLE_PRESETS[0];
        const body = {
          prompt: prompt,
          style: activePreset.name,
          aspectRatio: selectedRatio,
          resolution: 'HD'
        };
        
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) {
            generatedImageUrl = data.imageUrl;
          }
        }
      } catch (err) {
        console.error("AI Video Generation API call failed:", err);
      }
    })();

    // Stage 1: Load vectors
    setTimeout(() => {
      setGenerationProgress(25);
      setGenerationStage("Calibrating Dynamic Latent Space...");
    }, 800);

    // Stage 2: Synthesis
    setTimeout(() => {
      setGenerationProgress(50);
      setGenerationStage("Interpolating Temporal Frame Matrices...");
    }, 1700);

    // Stage 3: Upscaling
    setTimeout(() => {
      setGenerationProgress(80);
      setGenerationStage("Running High-Dynamic-Range Contrast Tuning...");
    }, 2800);

    // Stage 4: Compile & Play
    setTimeout(async () => {
      // Wait for the apiCallPromise to finish
      await apiCallPromise;

      const activePreset = STYLE_PRESETS.find(p => p.id === selectedStyle) || STYLE_PRESETS[0];
      const finalVideoUrl = generatedImageUrl || uploadedImage || getDynamicVideoUrl(prompt, selectedStyle);
      const videoTitle = prompt.trim() 
        ? prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '')
        : `Animated: ${imageName.substring(0, 20)}`;

      const compiledVideo = {
        title: videoTitle,
        prompt: prompt || `Animated uploaded asset: ${imageName}`,
        url: finalVideoUrl,
        duration: selectedDuration,
        style: activePreset.name,
        fps: selectedFps,
        ratio: selectedRatio
      };

      // Set active preview video
      setActiveVideo(compiledVideo);

      // Append compiled video to Projects List
      const newHistoryItem = {
        id: `hist-${Date.now()}`,
        title: videoTitle,
        prompt: prompt || `Animated asset: ${imageName}`,
        videoUrl: finalVideoUrl,
        style: activePreset.name,
        duration: selectedDuration,
        fps: selectedFps,
        ratio: selectedRatio,
        favorite: false
      };

      setProjectsList(prev => [newHistoryItem, ...prev]);

      // Save activity in local storage memory vault
      localStorage.setItem('omniai_last_activity', JSON.stringify({
        type: 'System',
        label: 'Temporal Video Synced',
        content: `Rendered cinematic AI video: "${videoTitle}" at ${selectedFps}`,
        time: 'Just now'
      }));
      window.dispatchEvent(new Event('omniai_activity_update'));

      // Finalize loading states
      setGenerationProgress(100);
      setGenerationStage("Render Complete.");
      setIsGenerating(false);

      // Instantly start playing the new video or running the motion simulation
      setIsPlaying(true);
      setTimeout(() => {
        if (videoRef.current && isVideoUrl(finalVideoUrl)) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(e => console.warn("Auto-play error", e));
        }
      }, 100);

    }, 3800);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectsList(prev => prev.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p));
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectsList(prev => prev.filter(p => p.id !== id));
  };

  const handleDownloadVideo = async (e: React.MouseEvent, url: string, filename: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isVid = isVideoUrl(url);
      const finalFilename = isVid 
        ? filename 
        : filename.replace('.mp4', '.png');
      
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Direct blob download blocked by CORS, opening in new tab instead.", err);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* ── 1. GALAXY HERO BANNER ────────────────────────────────────────── */}
      <section className="relative glass-panel rounded-[32px] border border-white/5 p-8 lg:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-black/40">
         <div className="absolute inset-0 mesh-bg opacity-20 pointer-events-none" />
         
         <div className="space-y-4 md:max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
               <Sparkles size={14} className="text-amber-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Sora v2.5 Synthesis Engine</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
               OMNIAI Video <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400">Generation Studio.</span>
            </h1>
            <p className="text-xs md:text-sm text-white/40 leading-relaxed max-w-lg">
               Synthesize cinematic masterpieces instantly. Bridge image and text vectors directly into high-fidelity fluid physical animations, with zero technical boundaries.
            </p>
         </div>

         {/* Floating Holographic Video Frames */}
         <div className="relative w-full md:w-80 h-48 flex items-center justify-center">
           <div className="absolute w-56 h-36 rounded-2xl border border-cyan-500/30 overflow-hidden transform -rotate-6 translate-x-[-30px] translate-y-[-10px] shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-black/60 opacity-60">
             <video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" autoPlay loop muted className="w-full h-full object-cover" />
           </div>
           <div className="absolute w-56 h-36 rounded-2xl border border-amber-500/50 overflow-hidden transform rotate-6 translate-x-[30px] translate-y-[10px] shadow-[0_0_30px_rgba(245,158,11,0.25)] bg-black/80 z-10">
             <video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" autoPlay loop muted className="w-full h-full object-cover" />
             <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-amber-500/20 text-[6.5px] font-black text-amber-400 uppercase tracking-widest border border-amber-500/30">Active Render</div>
           </div>
         </div>
      </section>

      {/* ── 2. DUAL-GRID WORKSPACE CONSOLE ──────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* LEFT WORKSPACE: INGESTION & PARAMETERS (7 COLS) */}
         <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Input & Upload Panel */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                   <Compass size={18} className="text-amber-400" />
                   <h2 className="text-xs font-black uppercase tracking-widest text-white/80">Ingestion Console</h2>
                 </div>
                 <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">Asset Ingestion</span>
               </div>

               {/* Large Prompt Box */}
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> 
                     1. Direct Creative Prompt
                   </label>
                   <button 
                     onClick={handlePromptCopilot}
                     disabled={isGenerating}
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest text-amber-400 transition-colors"
                   >
                     <Sparkles size={12} className="animate-pulse" />
                     {prompt.trim() ? "Director Copilot (Improve)" : "Generate Director Idea"}
                   </button>
                 </div>
                 <textarea
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="Describe your scene in detail... (e.g. 'Dolly shot of an astronaut riding a holographic horse on Mars under glowing pink rings, hyper-realistic, high contrast')"
                   className="w-full min-h-[100px] bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none resize-none focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/10 transition-all font-light leading-relaxed"
                 />
               </div>

               {/* Asset Drag Drop Ingestor (Image to Video) */}
               <div className="space-y-2.5">
                 <label className="text-[9px] font-mono font-black uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                   2. Image Ingestion (Image-to-Video Animation)
                 </label>
                 
                 <div
                   onDragOver={onDragOver}
                   onDragLeave={onDragLeave}
                   onDrop={onDrop}
                   onClick={() => fileInputRef.current?.click()}
                   className={`border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer relative overflow-hidden group ${
                     isDragging ? 'border-cyan-400 bg-cyan-500/5' : 'border-white/10 bg-black/20 hover:border-white/20'
                   }`}
                 >
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileChange} 
                     accept="image/*" 
                     className="hidden" 
                   />

                   {uploadedImage ? (
                     <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden group/img">
                       <img src={uploadedImage} alt="Uploaded Asset" className="w-full h-full object-cover" />
                       
                       {/* Biometric Holographic Scanning Grid Effect */}
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-pulse-slow h-1/2 pointer-events-none" 
                            style={{ 
                              animation: 'scan 2.5s linear infinite', 
                              borderBottom: '2px solid rgba(6, 182, 212, 0.4)' 
                            }} 
                       />
                       
                       <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity gap-2">
                         <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">Ingested Asset</span>
                         <span className="text-[9px] text-white/80 font-mono truncate max-w-[200px]">{imageName}</span>
                         <button 
                           onClick={clearUploadedImage}
                           className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-[8px] font-black uppercase tracking-widest text-red-400 transition-colors mt-2"
                         >
                           Remove Ingested File
                         </button>
                       </div>
                       
                       <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-cyan-500/20 text-[6.5px] font-black text-cyan-400 uppercase tracking-widest border border-cyan-500/30 flex items-center gap-1">
                         <Check size={8} /> Image Vectors Locked
                       </div>
                     </div>
                   ) : (
                     <>
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Upload size={16} className="text-white/40 group-hover:text-white" />
                       </div>
                       <div className="text-center">
                         <span className="text-[10px] font-bold text-white/80 block">Drag & Drop Image Asset</span>
                         <span className="text-[8px] text-white/30 uppercase tracking-wider block mt-1">Accepts PNG, JPG (Max 12MB)</span>
                       </div>
                     </>
                   )}
                 </div>
               </div>

            </div>

            {/* Cinematic Presets Selector */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                   <Sliders size={18} className="text-amber-400" />
                   <h2 className="text-xs font-black uppercase tracking-widest text-white/80">Dynamic Style Blueprints</h2>
                 </div>
                 <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">Presets Matrix</span>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                 {STYLE_PRESETS.map((style) => {
                   const isSelected = style.id === selectedStyle;
                   return (
                     <button
                       key={style.id}
                       type="button"
                       onClick={() => setSelectedStyle(style.id)}
                       className={`p-4 rounded-2xl border text-left flex flex-col transition-all group relative overflow-hidden ${
                         isSelected 
                           ? `bg-white/[0.03] shadow-[0_0_15px_rgba(245,158,11,0.05)] border-amber-500/30` 
                           : 'bg-black/20 border-white/5 hover:border-white/20'
                       }`}
                     >
                       <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${style.color} opacity-10 pointer-events-none`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-amber-400' : 'text-white/60'}`}>
                         {style.name}
                       </span>
                       <span className="text-[7.5px] text-white/30 leading-snug mt-2 line-clamp-2">
                         {style.desc}
                       </span>
                     </button>
                   );
                 })}
               </div>
            </div>

            {/* Advanced Camera Motion Matrix Panel */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                   <Cpu size={18} className="text-amber-400" />
                   <h2 className="text-xs font-black uppercase tracking-widest text-white/80">Advanced Temporal Modifiers</h2>
                 </div>
                 <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">Parameters HUD</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Aspect Ratio Selector */}
                 <div className="space-y-2.5">
                   <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50 block">Aspect Ratio Layout</span>
                   <div className="grid grid-cols-3 gap-2">
                     {[
                       { id: '16:9', name: '16:9 Cinema', dims: 'w-6 h-3.5' },
                       { id: '9:16', name: '9:16 Reel', dims: 'w-3 h-6' },
                       { id: '1:1', name: '1:1 Square', dims: 'w-4.5 h-4.5' }
                     ].map((ratio) => {
                       const isRatioActive = selectedRatio === ratio.id;
                       return (
                         <button
                           key={ratio.id}
                           type="button"
                           onClick={() => setSelectedRatio(ratio.id)}
                           className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                             isRatioActive 
                               ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] bg-white/[0.04]' 
                               : 'border-white/5 bg-black/40 hover:border-white/20'
                           }`}
                         >
                           <div className={`border border-current rounded ${ratio.dims} ${isRatioActive ? 'text-amber-400' : 'text-white/20'}`} />
                           <span className={`text-[8px] font-black uppercase tracking-wider ${isRatioActive ? 'text-amber-400' : 'text-white/40'}`}>
                             {ratio.name}
                           </span>
                         </button>
                       );
                     })}
                   </div>
                 </div>

                 {/* Camera Motion Directives */}
                 <div className="space-y-2.5">
                   <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50 block">Camera Flow Vector</span>
                   <div className="grid grid-cols-2 gap-2">
                     {['Orbit Zoom', 'Pan Horizontal', 'Dynamic Flythrough', 'Tilt Yaw'].map((motionType) => {
                       const isMotionActive = cameraMotion === motionType;
                       return (
                         <button
                           key={motionType}
                           type="button"
                           onClick={() => setCameraMotion(motionType)}
                           className={`py-3 px-2 rounded-xl border flex items-center justify-center text-center transition-all ${
                             isMotionActive 
                               ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] bg-white/[0.04] text-amber-400 font-extrabold' 
                               : 'border-white/5 bg-black/40 hover:border-white/20 text-white/40'
                           }`}
                         >
                           <span className="text-[8px] font-black uppercase tracking-wider">
                             {motionType}
                           </span>
                         </button>
                       );
                     })}
                   </div>
                 </div>

                 {/* Motion Strength Slider */}
                 <div className="space-y-2.5">
                   <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase tracking-wider text-white/50">
                     <span>Motion Vector Strength</span>
                     <span className="text-amber-400 font-bold">{motionStrength}.0x</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="text-[8px] font-mono text-white/20">LOW</span>
                     <input
                       type="range"
                       min="1"
                       max="10"
                       value={motionStrength}
                       onChange={(e) => setMotionStrength(parseInt(e.target.value))}
                       className="w-full accent-amber-400 h-1 bg-white/5 rounded-full outline-none"
                     />
                     <span className="text-[8px] font-mono text-white/20">HIGH</span>
                   </div>
                 </div>

                 {/* Custom FPS Synthesis */}
                 <div className="space-y-2.5">
                   <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50 block">Synthesis FPS</span>
                   <div className="grid grid-cols-3 gap-2">
                     {['24 FPS', '30 FPS', '60 FPS'].map((fps) => {
                       const isFpsActive = selectedFps === fps;
                       return (
                         <button
                           key={fps}
                           type="button"
                           onClick={() => setSelectedFps(fps)}
                           className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                             isFpsActive 
                               ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] bg-white/[0.04]' 
                               : 'border-white/5 bg-black/40 hover:border-white/20'
                           }`}
                         >
                           <span className={`text-[8.5px] font-black uppercase tracking-wider ${isFpsActive ? 'text-amber-400' : 'text-white/60'}`}>
                             {fps}
                           </span>
                         </button>
                       );
                     })}
                   </div>
                 </div>

                 {/* Duration Vector */}
                 <div className="space-y-2.5">
                   <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50 block">Temporal Duration</span>
                   <div className="grid grid-cols-3 gap-2">
                     {['4.0s', '8.0s', '16.0s'].map((dur) => {
                       const isDurActive = selectedDuration === dur;
                       return (
                         <button
                           key={dur}
                           type="button"
                           onClick={() => setSelectedDuration(dur)}
                           className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                             isDurActive 
                               ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] bg-white/[0.04]' 
                               : 'border-white/5 bg-black/40 hover:border-white/20'
                           }`}
                         >
                           <span className={`text-[8.5px] font-black uppercase tracking-wider ${isDurActive ? 'text-amber-400' : 'text-white/60'}`}>
                             {dur}
                           </span>
                         </button>
                       );
                     })}
                   </div>
                 </div>

                 {/* Custom Seed Config */}
                 <div className="space-y-2.5">
                   <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50 block">Custom Latent Seed</span>
                   <div className="flex gap-2">
                     <input
                       type="text"
                       value={seed}
                       onChange={(e) => setSeed(e.target.value)}
                       className="bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs font-mono text-white/80 focus:border-amber-500/30 outline-none w-full"
                     />
                     <button
                       type="button"
                       onClick={() => setSeed(Math.floor(Math.random() * 100000000).toString())}
                       className="px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 flex items-center justify-center transition-colors"
                     >
                       <RefreshCw size={12} />
                     </button>
                   </div>
                 </div>

               </div>

               {/* Advanced Quality Toggles */}
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                 <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                   <div className="flex flex-col">
                     <span className="text-[9px] font-bold text-white/80 uppercase">AI Super-Upscale</span>
                     <span className="text-[7.5px] text-white/30 uppercase tracking-wide">Enhance to Hyper-Detailed 4K</span>
                   </div>
                   <input
                     type="checkbox"
                     checked={isUpscaling}
                     onChange={(e) => setIsUpscaling(e.target.checked)}
                     className="accent-amber-400 rounded w-4 h-4 bg-black/40 border-white/10"
                   />
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                   <div className="flex flex-col">
                     <span className="text-[9px] font-bold text-white/80 uppercase">Fluid Motion Blur</span>
                     <span className="text-[7.5px] text-white/30 uppercase tracking-wide">Dynamic physical motion blur</span>
                   </div>
                   <input
                     type="checkbox"
                     checked={isMotionBlur}
                     onChange={(e) => setIsMotionBlur(e.target.checked)}
                     className="accent-amber-400 rounded w-4 h-4 bg-black/40 border-white/10"
                   />
                 </div>
               </div>

            </div>

         </div>

         {/* RIGHT WORKSPACE: LIVE PREVIEW & DASHBOARD (5 COLS) */}
         <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Realtime Video Preview & Player */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6 relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                   <Video size={18} className="text-purple-400" />
                   <h2 className="text-xs font-black uppercase tracking-widest text-white/80">Live Studio Output</h2>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-[7.5px] font-mono px-2 py-0.5 rounded bg-white/5 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                     {activeVideo.fps}
                   </span>
                   <span className="text-[7.5px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                     {activeVideo.ratio}
                   </span>
                 </div>
               </div>

               {/* Custom Premium Video Player */}
               <div id="omniai-studio-player-container" className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-[0_0_30px_rgba(123,97,255,0.15)] group/player">
                  {!isVideoUrl(activeVideo.url) ? (
                    <div 
                      className="relative overflow-hidden aspect-video w-full bg-black flex items-center justify-center cursor-pointer"
                      style={{ perspective: '1000px' }}
                      onClick={togglePlay}
                    >
                      <img
                        src={activeVideo.url}
                        alt={activeVideo.title}
                        className="w-full h-full object-cover select-none"
                        onError={(e) => {
                          console.warn("Player image load failed. Engaging fallback.");
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getImageFallback(activeVideo.prompt);
                        }}
                        style={{
                          animationName: 
                            cameraMotion === 'Orbit Zoom' ? 'kenburns-orbit-zoom' :
                            cameraMotion === 'Pan Horizontal' ? 'kenburns-pan-horizontal' :
                            cameraMotion === 'Dynamic Flythrough' ? 'kenburns-flythrough' :
                            'kenburns-tilt-yaw',
                          animationDuration: selectedDuration === '4.0s' ? '4s' : selectedDuration === '8.0s' ? '8s' : '16s',
                          animationIterationCount: 'infinite',
                          animationTimingFunction: 'ease-in-out',
                          animationPlayState: isPlaying ? 'running' : 'paused',
                          transformOrigin: 'center center'
                        }}
                      />

                      {/* Cinematic Lens Flare overlay */}
                      <div 
                        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent mix-blend-overlay"
                        style={{
                          animationName: 'flare',
                          animationDuration: '6s',
                          animationIterationCount: 'infinite',
                          animationTimingFunction: 'linear',
                          animationPlayState: isPlaying ? 'running' : 'paused',
                          width: '200%',
                          height: '200%',
                          transform: 'rotate(-25deg)'
                        }}
                      />
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      src={activeVideo.url}
                      loop
                      autoPlay
                      playsInline
                      muted
                      className="w-full object-cover aspect-video cursor-pointer"
                      onClick={togglePlay}
                    />
                  )}

                 {/* Waveform audio spectrum visualizer overlay */}
                 <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                   <div className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/15 text-[8.5px] font-mono text-white/90">
                     {activeVideo.title}
                   </div>
                   <div className="flex items-center gap-0.5 h-6">
                     {Array.from({ length: 8 }).map((_, i) => (
                       <div 
                         key={i} 
                         className="w-0.5 bg-purple-400/60 rounded-full transition-all duration-300"
                         style={{ 
                           height: isPlaying ? `${Math.random() * 16 + 4}px` : '4px',
                           animation: isPlaying ? `equalize 1.2s ease-in-out infinite alternate ${i * 0.1}s` : 'none'
                         }} 
                       />
                     ))}
                   </div>
                 </div>

                 {/* Premium Glassmorphic Controls Bar */}
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/45 to-transparent opacity-100 sm:opacity-0 sm:group-hover/player:opacity-100 transition-opacity duration-300 flex flex-col gap-3">
                   
                   {/* Custom Scrubbing Progress Bar */}
                   <div className="flex items-center gap-3">
                     <span className="text-[8px] font-mono text-white/50">{currentTime.toFixed(1)}s</span>
                     <input
                       type="range"
                       min="0"
                       max={videoDuration || 8}
                       step="0.1"
                       value={currentTime}
                       onChange={handleTimelineChange}
                       className="w-full accent-purple-400 h-1 bg-white/20 rounded-full outline-none cursor-pointer"
                     />
                     <span className="text-[8px] font-mono text-white/50">{(videoDuration || 8.0).toFixed(1)}s</span>
                   </div>

                   {/* Main Controls Grid */}
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                       <button 
                         onClick={togglePlay}
                         className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all hover:scale-105"
                       >
                         {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                       </button>
                       <button 
                         onClick={handleReplay}
                         className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all hover:scale-105"
                         title="Replay Video"
                       >
                         <RotateCcw size={13} />
                       </button>
                     </div>

                     <div className="flex items-center gap-3">
                       <button 
                         onClick={handleFullscreen}
                         className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all hover:scale-105"
                       >
                         <Maximize2 size={13} />
                       </button>
                       <button 
                         onClick={(e) => handleDownloadVideo(e, activeVideo.url, 'omniai_cinematic_loop.mp4')}
                         className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-[9px] font-black uppercase tracking-widest text-purple-300 transition-all flex items-center gap-1.5"
                       >
                         <Download size={12} /> Download
                       </button>
                     </div>
                   </div>

                 </div>
               </div>

               {/* Dynamic Realtime Progress & Loading Console */}
               <AnimatePresence>
                 {isGenerating && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] space-y-4 overflow-hidden"
                   >
                     <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase tracking-wider text-amber-400">
                       <div className="flex items-center gap-2">
                         <Loader2 size={12} className="animate-spin" />
                         <span>{generationStage}</span>
                       </div>
                       <span>{generationProgress}%</span>
                     </div>

                     {/* Premium Dynamic Progress Bar */}
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                         style={{ width: `${generationProgress}%` }}
                         transition={{ duration: 0.3 }}
                       />
                     </div>

                     {/* Server Compile Micro Log */}
                     <div className="font-mono text-[7px] text-white/30 uppercase tracking-widest border-t border-white/5 pt-3 flex justify-between">
                       <span>Seed: {seed}</span>
                       <span>Upscaler: Active</span>
                       <span>FP16 Compilation</span>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Synthesis Trigger Button */}
               <button
                 onClick={handleInitiateSynthesis}
                 disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
                 className="w-full py-4.5 bg-gradient-to-r from-amber-500 via-purple-500 to-cyan-500 hover:scale-[1.01] active:scale-[0.99] transition-all text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 disabled:opacity-20 disabled:pointer-events-none mt-2"
               >
                 {isGenerating ? (
                   <>
                     <Loader2 size={15} className="animate-spin" />
                     Synthesizing temporal vectors...
                   </>
                 ) : (
                   <>
                     <Play size={14} className="fill-current" />
                     Initiate Temporal Synthesis
                   </>
                 )}
               </button>

            </div>

            {/* AI Director Creative Suggestions */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
               <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                 <Compass size={16} className="text-purple-400" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-white/80">AI Director Prompts</h3>
               </div>
               
               <div className="space-y-2">
                 {DIRECTORS_PROMPTS.map((idea, i) => (
                   <div 
                     key={i} 
                     onClick={() => handleIdeaCardClick(idea.prompt)}
                     className="p-3 rounded-xl border border-white/5 hover:border-purple-500/25 bg-black/20 hover:bg-white/[0.02] cursor-pointer transition-all flex items-start justify-between group"
                   >
                     <div className="space-y-1">
                       <span className="text-[8.5px] font-black uppercase tracking-widest text-purple-400">{idea.title}</span>
                       <p className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors line-clamp-1">{idea.prompt}</p>
                     </div>
                     <ArrowRight size={12} className="text-white/5 group-hover:text-purple-400 transition-colors mt-1" />
                   </div>
                 ))}
               </div>
            </div>

         </div>

      </section>

      {/* ── 3. PROJECTS LOG & HISTORICAL DASHBOARD ──────────────────────── */}
      <section className="glass-panel p-8 rounded-[32px] border border-white/5 bg-black/20 space-y-8">
         
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1.5">
               <h3 className="text-lg font-black tracking-tight text-white">Sora Project Hub</h3>
               <p className="text-[10px] text-white/35 uppercase tracking-widest">Chronological vault of historical synthesis iterations</p>
            </div>

            {/* Premium Tab Toggles */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-1 rounded-xl">
               {[
                 { id: 'history', label: 'Synthesis History', count: projectsList.length },
                 { id: 'favorites', label: 'Favorites', count: projectsList.filter(p => p.favorite).length },
                 { id: 'templates', label: 'AI Templates', count: 4 }
               ].map((tab) => {
                 const isTabActive = activeDashboardTab === tab.id;
                 return (
                   <button
                     key={tab.id}
                     onClick={() => setActiveDashboardTab(tab.id as any)}
                     className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                       isTabActive 
                         ? 'bg-white/5 text-amber-400 border border-white/10 shadow-inner' 
                         : 'text-white/40 hover:text-white/80'
                     }`}
                   >
                     {tab.label}
                     <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${
                       isTabActive ? 'bg-amber-400/10 text-amber-400' : 'bg-white/5 text-white/30'
                     }`}>{tab.count}</span>
                   </button>
                 );
               })}
            </div>
         </div>

         {/* Dynamic Grid Display */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {activeDashboardTab === 'history' && (
             projectsList.map((item) => (
               <div 
                 key={item.id}
                 onClick={() => {
                   setActiveVideo({
                     title: item.title,
                     prompt: item.prompt,
                     url: item.videoUrl,
                     duration: item.duration,
                     style: item.style,
                     fps: item.fps,
                     ratio: item.ratio
                   });
                   // auto play
                   setTimeout(() => {
                     if (videoRef.current) {
                       videoRef.current.currentTime = 0;
                       videoRef.current.play().catch(e => console.warn("Player trigger error", e));
                       setIsPlaying(true);
                     }
                   }, 100);
                 }}
                 className="glass-panel border border-white/5 rounded-2xl overflow-hidden cursor-pointer group bg-black/40 hover:border-white/20 transition-all flex flex-col justify-between"
               >
                 <div className="relative aspect-video overflow-hidden bg-black">
                   {isVideoUrl(item.videoUrl) ? (
                     <video src={item.videoUrl} muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[6000ms]" />
                   ) : (
                     <img 
                        src={item.videoUrl} 
                        alt={item.title} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getImageFallback(item.prompt);
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[6000ms] select-none" 
                      />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="flex justify-between items-start">
                       <button
                         onClick={(e) => handleToggleFavorite(item.id, e)}
                         className="p-2 rounded-full bg-black/60 border border-white/15 hover:scale-110 transition-transform"
                       >
                         <Heart size={12} className={item.favorite ? "fill-red-500 text-red-500" : "text-white/60"} />
                       </button>
                       <button
                         onClick={(e) => handleDeleteHistory(item.id, e)}
                         className="p-2 rounded-full bg-black/60 border border-white/15 hover:scale-110 hover:border-red-500/50 text-white/60 hover:text-red-400 transition-all"
                       >
                         <Trash2 size={12} />
                       </button>
                     </div>
                     <div className="flex items-center gap-1.5 text-[8px] font-mono font-black text-amber-400 uppercase tracking-widest">
                       <Eye size={12} /> Click to Mount in Studio Player
                     </div>
                   </div>

                   <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center group-hover:opacity-0 transition-opacity pointer-events-none">
                     <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-white/80 border border-white/10 uppercase tracking-widest">{item.duration}</span>
                     <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-white/80 border border-white/10 uppercase tracking-widest">{item.style}</span>
                   </div>
                 </div>

                 <div className="p-4 space-y-1 bg-white/[0.01]">
                   <h4 className="text-[11px] font-black text-white/90 truncate group-hover:text-amber-400 transition-colors">{item.title}</h4>
                   <p className="text-[9px] text-white/30 truncate">{item.prompt}</p>
                 </div>
               </div>
             ))
           )}

           {activeDashboardTab === 'favorites' && (
             projectsList.filter(p => p.favorite).length > 0 ? (
               projectsList.filter(p => p.favorite).map((item) => (
                 <div 
                   key={item.id}
                   onClick={() => setActiveVideo({
                     title: item.title,
                     prompt: item.prompt,
                     url: item.videoUrl,
                     duration: item.duration,
                     style: item.style,
                     fps: item.fps,
                     ratio: item.ratio
                   })}
                   className="glass-panel border border-white/5 rounded-2xl overflow-hidden cursor-pointer group bg-black/40 hover:border-white/20 transition-all flex flex-col justify-between"
                 >
                   <div className="relative aspect-video overflow-hidden bg-black">
                     {isVideoUrl(item.videoUrl) ? (
                       <video src={item.videoUrl} muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[6000ms]" />
                     ) : (
                       <img 
                        src={item.videoUrl} 
                        alt={item.title} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getImageFallback(item.prompt);
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[6000ms] select-none" 
                      />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="flex justify-between items-start">
                         <button
                           onClick={(e) => handleToggleFavorite(item.id, e)}
                           className="p-2 rounded-full bg-black/60 border border-white/15 hover:scale-110 transition-transform"
                         >
                           <Heart size={12} className="fill-red-500 text-red-500" />
                         </button>
                         <button
                           onClick={(e) => handleDeleteHistory(item.id, e)}
                           className="p-2 rounded-full bg-black/60 border border-white/15 hover:scale-110 hover:border-red-500/50 text-white/60 hover:text-red-400 transition-all"
                         >
                           <Trash2 size={12} />
                         </button>
                       </div>
                       <div className="flex items-center gap-1.5 text-[8px] font-mono font-black text-amber-400 uppercase tracking-widest">
                         <Eye size={12} /> Click to Mount
                       </div>
                     </div>
                     <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center group-hover:opacity-0 transition-opacity pointer-events-none">
                       <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-white/80 border border-white/10 uppercase tracking-widest">{item.duration}</span>
                       <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-white/80 border border-white/10 uppercase tracking-widest">{item.style}</span>
                     </div>
                   </div>
                   <div className="p-4 space-y-1 bg-white/[0.01]">
                     <h4 className="text-[11px] font-black text-white/90 truncate">{item.title}</h4>
                     <p className="text-[9px] text-white/30 truncate">{item.prompt}</p>
                   </div>
                 </div>
               ))
             ) : (
               <div className="col-span-full py-16 flex flex-col items-center justify-center text-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                   <Heart size={20} />
                 </div>
                 <div>
                   <span className="text-[10px] font-bold text-white/80 uppercase block">No Favorites Yet</span>
                   <span className="text-[8px] text-white/30 uppercase tracking-wide block mt-1">Hover over your history items and click the heart button to collect them.</span>
                 </div>
               </div>
             )
           )}

           {activeDashboardTab === 'templates' && (
             [
               { title: 'Cyberpunk Hyper-Dolly Loop', author: 'OMNIAI', views: '14.2k' },
               { title: 'Surrealist Slow Water-Bending', author: 'OMNIAI', views: '9.8k' },
               { title: 'Photorealistic Macro Eyeball Focus', author: 'OMNIAI', views: '24.1k' },
               { title: 'Abstract Cosmic Event Horizon', author: 'OMNIAI', views: '18.5k' }
             ].map((tpl, i) => (
               <div 
                 key={i}
                 onClick={() => setPrompt(`Sora studio blueprint template: ${tpl.title}. volumetric light, cinema grading.`)}
                 className="glass-panel p-5 rounded-2xl border border-white/5 bg-black/20 hover:border-purple-500/25 cursor-pointer transition-all flex flex-col justify-between group"
               >
                 <div className="space-y-1">
                   <span className="text-[8.5px] font-black uppercase tracking-widest text-purple-400">Curated Template</span>
                   <h4 className="text-[11px] font-black text-white/90 group-hover:text-white transition-colors">{tpl.title}</h4>
                 </div>
                 <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                   <span className="text-[8px] font-mono text-white/20">Author: {tpl.author}</span>
                   <span className="text-[8px] font-mono text-purple-400/80 font-bold uppercase">{tpl.views} Runs</span>
                 </div>
               </div>
             ))
           )}
         </div>

      </section>

      {/* Dynamic Keyframes CSS rules */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes equalize {
          0% { height: 4px; }
          100% { height: 100%; }
        }
        @keyframes kenburns-orbit-zoom {
          0% {
            transform: scale(1) translate(0, 0) rotate(0deg);
          }
          50% {
            transform: scale(1.08) translate(-1%, -1%) rotate(1deg);
          }
          100% {
            transform: scale(1) translate(0, 0) rotate(0deg);
          }
        }
        @keyframes kenburns-pan-horizontal {
          0% {
            transform: scale(1.1) translateX(-3%);
          }
          50% {
            transform: scale(1.1) translateX(3%);
          }
          100% {
            transform: scale(1.1) translateX(-3%);
          }
        }
        @keyframes kenburns-flythrough {
          0% {
            transform: scale(1) translate3d(0, 0, 0);
          }
          100% {
            transform: scale(1.18) translate3d(0.5%, 0.5%, 0);
          }
        }
        @keyframes kenburns-tilt-yaw {
          0% {
            transform: scale(1.05) translateY(-2%) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: scale(1.05) translateY(2%) rotateX(2deg) rotateY(-2deg);
          }
          100% {
            transform: scale(1.05) translateY(-2%) rotateX(0deg) rotateY(0deg);
          }
        }
        @keyframes flare {
          0% {
            transform: translateX(-100%) translateY(-30%) rotate(-25deg);
            opacity: 0;
          }
          30% {
            opacity: 0.35;
          }
          70% {
            opacity: 0.35;
          }
          100% {
            transform: translateX(100%) translateY(30%) rotate(-25deg);
            opacity: 0;
          }
        }
      `}</style>

    </div>
  );
}
