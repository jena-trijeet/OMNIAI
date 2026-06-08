'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Presentation as PresentationIcon,
  Play,
  Download,
  Copy,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Clock,
  Settings,
  Layers,
  Wand2,
  Image as ImageIcon,
  LineChart,
  PieChart,
  Grid,
  Type,
  TrendingUp,
  Cpu,
  RefreshCw,
  Layout,
  Share2,
  FileText,
  User,
  Check,
  AlertCircle,
  Volume2,
  Mic,
  MessageSquare,
  HelpCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import pptxgen from '@/lib/pptxgen.bundle.js';
import { jsPDF } from 'jspdf';

// ============================================================================
// THEME PRESETS DEFINITIONS (GLASSMORPHIC & CYBER ADAPTERS)
// ============================================================================
export type ThemeId = 'cyberpunk' | 'luxury' | 'technology' | 'startup' | 'business' | 'minimal';

interface ThemePreset {
  id: ThemeId;
  name: string;
  gradientBg: string;
  cardBg: string;
  borderColor: string;
  glowColor: string;
  textColor: string;
  accentText: string;
  highlightText: string;
  monoBg: string;
}

const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    gradientBg: 'from-[#030008] via-[#0b0314] to-[#020005]',
    cardBg: 'bg-[#120524]/40 backdrop-blur-xl',
    borderColor: 'border-[#ec4899]/20 hover:border-[#ec4899]/50 focus:border-[#ec4899]/60',
    glowColor: 'shadow-[0_0_35px_rgba(236,72,153,0.15)]',
    textColor: 'text-pink-100',
    accentText: 'text-[#ec4899]',
    highlightText: 'text-[#00f0ff]',
    monoBg: 'bg-[#ff00a0]/10 border-[#ff00a0]/35 text-[#ff00a0]'
  },
  luxury: {
    id: 'luxury',
    name: 'Royal Luxury',
    gradientBg: 'from-[#0b0805] via-[#14100b] to-[#080503]',
    cardBg: 'bg-[#18140f]/50 backdrop-blur-2xl',
    borderColor: 'border-[#d4af37]/20 hover:border-[#d4af37]/50 focus:border-[#d4af37]/60',
    glowColor: 'shadow-[0_0_35px_rgba(212,175,55,0.1)]',
    textColor: 'text-amber-100/90',
    accentText: 'text-[#d4af37]',
    highlightText: 'text-white font-serif',
    monoBg: 'bg-[#d4af37]/10 border-[#d4af37]/30 text-[#d4af37]'
  },
  technology: {
    id: 'technology',
    name: 'Quantum Tech',
    gradientBg: 'from-[#000410] via-[#010924] to-[#000208]',
    cardBg: 'bg-[#031536]/30 backdrop-blur-xl',
    borderColor: 'border-[#00d1ff]/20 hover:border-[#00d1ff]/50 focus:border-[#00d1ff]/60',
    glowColor: 'shadow-[0_0_35px_rgba(0,209,255,0.15)]',
    textColor: 'text-cyan-50',
    accentText: 'text-[#00d1ff]',
    highlightText: 'text-[#00f0ff]',
    monoBg: 'bg-[#00d1ff]/10 border-[#00d1ff]/35 text-[#00d1ff]'
  },
  startup: {
    id: 'startup',
    name: 'Electric Unicorn',
    gradientBg: 'from-[#050110] via-[#0d0426] to-[#04010b]',
    cardBg: 'bg-[#160b36]/30 backdrop-blur-2xl',
    borderColor: 'border-[#8b5cf6]/20 hover:border-[#8b5cf6]/50 focus:border-[#8b5cf6]/60',
    glowColor: 'shadow-[0_0_35px_rgba(139,92,246,0.18)]',
    textColor: 'text-purple-50',
    accentText: 'text-[#a78bfa]',
    highlightText: 'text-[#38bdf8]',
    monoBg: 'bg-[#8b5cf6]/10 border-[#8b5cf6]/30 text-[#a78bfa]'
  },
  business: {
    id: 'business',
    name: 'Deep Sapphire',
    gradientBg: 'from-[#020512] via-[#050e24] to-[#01030a]',
    cardBg: 'bg-[#0a1835]/40 backdrop-blur-xl',
    borderColor: 'border-[#3b82f6]/20 hover:border-[#3b82f6]/40 focus:border-[#3b82f6]/60',
    glowColor: 'shadow-[0_0_25px_rgba(59,130,246,0.1)]',
    textColor: 'text-slate-100',
    accentText: 'text-[#3b82f6]',
    highlightText: 'text-[#60a5fa]',
    monoBg: 'bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#60a5fa]'
  },
  minimal: {
    id: 'minimal',
    name: 'Mono Obsidian',
    gradientBg: 'from-[#040404] via-[#090909] to-[#020202]',
    cardBg: 'bg-[#0c0c0c]/70 border border-white/5 backdrop-blur-2xl',
    borderColor: 'border-white/15 hover:border-white/30 focus:border-white/40',
    glowColor: 'shadow-[0_0_20px_rgba(255,255,255,0.03)]',
    textColor: 'text-neutral-200',
    accentText: 'text-white font-mono',
    highlightText: 'text-neutral-400 font-mono',
    monoBg: 'bg-white/10 border-white/20 text-white'
  }
};

// ============================================================================
// CORE DATA INTERFACES & PRESETS MODEL
// ============================================================================
export interface Slide {
  id: string;
  title: string;
  type: 'title' | 'content' | 'chart' | 'timeline' | 'diagram' | 'image' | 'conclusion';
  layout: 'split' | 'hero' | 'grid' | 'full';
  bullets: string[];
  notes?: string;
  chartData?: {
    label: string;
    labels: string[];
    values: number[];
  };
  graphicPrompt?: string;
  graphicSvgSeed?: number; // deterministic abstract generation
}

export interface Presentation {
  id: string;
  title: string;
  topic: string;
  theme: ThemeId;
  slides: Slide[];
  createdAt: string;
}

const TEMPLATE_SUGGESTIONS = [
  "Create a startup pitch deck for a quantum computing SaaS",
  "Generate AI classroom presentation on solar energy colonization",
  "Build marketing strategy slides for a zero-gravity luxury hotel",
  "Create futuristic business report detailing AI neural mesh networks"
];

const MOCK_PITCH_DECK_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    title: 'OMNIAI NEURAL CORE',
    type: 'title',
    layout: 'hero',
    bullets: [
      'The Next-Generation AI Operating System',
      'Cognitive Automation Sync Grid',
      'Synthesized by Trijeet. Registered Node Secure.'
    ],
    notes: 'Opening slide. Introduce the core philosophy of OmniAI and capture the audience’s attention with our live visual interface.'
  },
  {
    id: 'slide-2',
    title: 'THE CORE BOTTLENECK',
    type: 'content',
    layout: 'split',
    bullets: [
      'Traditional databases are static and struggle with real-time stream analysis.',
      'SaaS suites remain highly fragmented across different productivity frameworks.',
      'Human cognitive overhead is bottlenecked by archaic presentation tools.'
    ],
    notes: 'Explain the high latency and integration issues standard corporate environments face daily.'
  },
  {
    id: 'slide-3',
    title: 'SYSTEM GROWTH INDEX',
    type: 'chart',
    layout: 'split',
    bullets: [
      'OmniAI Neural nodes scaling exponentially across active regions.',
      'Average database sync latency drop: 84% reduction verified.',
      'Projected client-side automation retention index (CY 2026).'
    ],
    chartData: {
      label: 'Performance Uplink Rate',
      labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
      values: [24, 45, 62, 78, 115, 184]
    },
    notes: 'Highlight our dynamic scaling curves. Notice the sharp exponential inflection point in Q1 2026.'
  },
  {
    id: 'slide-4',
    title: 'SYNTHESIS ROADMAP',
    type: 'timeline',
    layout: 'grid',
    bullets: [
      'PHASE I: Initial core mesh deployments (Complete).',
      'PHASE II: Full visual canvas editor integration (Active).',
      'PHASE III: Decentralized cross-node synchronization (Q3 2026).'
    ],
    notes: 'Walk through our timeline showing phase achievements and target future milestones.'
  },
  {
    id: 'slide-5',
    title: 'VISUAL SYNC DIRECTIVE',
    type: 'image',
    layout: 'split',
    bullets: [
      'Dynamically rendered procedural layout components.',
      'Instant responsive styling adjusting across custom neon palettes.',
      'Direct client-side SVG rendering for vectors and diagram schemas.'
    ],
    graphicPrompt: 'futuristic neural connection node vector grid cyan glow',
    graphicSvgSeed: 42,
    notes: 'Present the generated visual design showing AI asset injection in real-time.'
  },
  {
    id: 'slide-6',
    title: 'OMNIAI MESH COMPLETE',
    type: 'conclusion',
    layout: 'hero',
    bullets: [
      'Establish your workspace node today.',
      'Join the next-generation AI ecosystem.',
      'Support Uplink: secure@omniai.io'
    ],
    notes: 'Call to action. Engage the audience and outline onboarding workflows.'
  }
];

// ============================================================================
// REAL CLIENT-SIDE PPTX PRESENTATION EXPORTER (WPS & POWERPOINT NATIVE)
// ============================================================================
const generateRealPPTX = async (presentation: Presentation) => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_169'; // Widescreen layout: 13.33 x 7.5 inches

  // Theme presets color adapter (hex without # prefix)
  let bgHex = "0A0314"; // Default dark background
  let titleColor = "FF00A0"; // Pink
  let textColor = "E2E8F0"; // Slate-200
  let accentColor = "00F0FF"; // Cyan
  
  if (presentation.theme === 'luxury') {
    bgHex = "14100B";
    titleColor = "D4AF37"; // Gold
    accentColor = "D4AF37";
    textColor = "F5F5F0";
  } else if (presentation.theme === 'technology') {
    bgHex = "010924";
    titleColor = "00D1FF"; // Cyan
    accentColor = "3B82F6"; // Blue
    textColor = "E0F2FE";
  } else if (presentation.theme === 'startup') {
    bgHex = "0D0426";
    titleColor = "A78BFA"; // Violet
    accentColor = "EC4899"; // Pink
    textColor = "F5F3FF";
  } else if (presentation.theme === 'business') {
    bgHex = "050E24";
    titleColor = "3B82F6"; // Blue
    accentColor = "60A5FA"; // Light Blue
    textColor = "F1F5F9";
  } else if (presentation.theme === 'minimal') {
    bgHex = "090909";
    titleColor = "FFFFFF";
    accentColor = "CCCCCC";
    textColor = "E5E5E5";
  }

  presentation.slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    slide.background = { fill: bgHex };
    
    // Cyber corner aesthetic outline
    slide.addShape(pptx.ShapeType.rect, { 
      line: { color: accentColor, width: 1 }, 
      fill: { color: "FFFFFF", alpha: 0 },
      x: 0.4, 
      y: 0.4, 
      w: 12.53,
      h: 6.7
    });

    // Watermark indicator
    slide.addText(`SLIDE ${index + 1} / ${presentation.slides.length}`, {
      x: 10.8,
      y: 0.55,
      w: 2.1,
      h: 0.4,
      fontSize: 8,
      color: "64748B",
      fontFace: "Courier New",
      align: "right"
    });

    // Title
    slide.addText(slideData.title.toUpperCase(), {
      x: 0.8,
      y: 0.7,
      w: 11.7,
      h: 0.9,
      fontSize: 26,
      fontFace: "Arial Black",
      color: titleColor,
      bold: true
    });

    if (slideData.notes) {
      slide.notes = slideData.notes;
    }

    if (slideData.type === 'title') {
      // Cover Slide Hero text layout
      slide.addText(slideData.bullets[0] || '', {
        x: 0.8,
        y: 2.4,
        w: 11.7,
        h: 1.0,
        fontSize: 22,
        color: textColor,
        bold: true,
        fontFace: "Arial"
      });
      
      const subBullets = slideData.bullets.slice(1);
      if (subBullets.length > 0) {
        slide.addText(subBullets.join('\n\n'), {
          x: 0.8,
          y: 3.8,
          w: 11.7,
          h: 3.0,
          fontSize: 15,
          color: "94A3B8",
          fontFace: "Arial"
        });
      }
    } else if (slideData.type === 'chart' && slideData.chartData) {
      // Split Layout: Bullets on Left, Native PowerPoint Column Chart on Right
      const bulletText = slideData.bullets.map(b => `• ${b}`).join('\n\n');
      slide.addText(bulletText, {
        x: 0.8,
        y: 2.0,
        w: 5.5,
        h: 4.5,
        fontSize: 14,
        color: textColor,
        fontFace: "Arial",
        lineSpacing: 1.3
      });

      // Dynamic Native Bar Chart
      const chartData = [
        {
          name: slideData.chartData.label || "Metrics",
          labels: slideData.chartData.labels || ["M1", "M2", "M3", "M4", "M5", "M6"],
          values: slideData.chartData.values || [0, 0, 0, 0, 0, 0]
        }
      ];

      slide.addChart(pptx.ChartType.bar, chartData, {
        x: 6.8,
        y: 2.0,
        w: 5.7,
        h: 4.5,
        barDir: "col",
        chartColors: [titleColor, accentColor],
        title: slideData.chartData.label,
        titleColor: textColor,
        titleFontSize: 12,
        legendShow: false,
        showValue: true,
        valGridLine: { style: "none" },
        catAxisLabelColor: textColor,
        valAxisLabelColor: textColor
      });

    } else if (slideData.type === 'timeline') {
      // Step card timeline: Columns side-by-side
      const steps = slideData.bullets;
      const count = steps.length;
      const cardWidth = Math.min(3.6, 11.7 / Math.max(1, count));
      const spacing = 0.4;
      const startX = 0.8;
      
      steps.forEach((step, sIdx) => {
        const xPos = startX + sIdx * (cardWidth + spacing);
        
        // Card panel background shape
        slide.addShape(pptx.ShapeType.roundRect, {
          fill: { color: bgHex, alpha: 25 },
          line: { color: accentColor, width: 1 },
          x: xPos,
          y: 2.3,
          w: cardWidth,
          h: 3.8
        });
        
        // Step subtitle
        slide.addText(`STEP 0${sIdx + 1}`, {
          x: xPos + 0.15,
          y: 2.5,
          w: cardWidth - 0.3,
          h: 0.4,
          fontSize: 13,
          fontFace: "Arial Black",
          color: titleColor,
          bold: true
        });

          // Step details description
          slide.addText(step, {
            x: xPos + 0.15,
            y: 3.1,
            w: cardWidth - 0.3,
            h: 2.8,
            fontSize: 12,
            fontFace: "Arial",
            color: textColor
          });
        });
        
      } else if (slideData.type === 'image') {
        // Split layout: Content on left, Procedural neural nodes visualization on right
        const bulletText = slideData.bullets.map(b => `• ${b}`).join('\n\n');
        slide.addText(bulletText, {
          x: 0.8,
          y: 2.0,
          w: 5.5,
          h: 4.5,
          fontSize: 14,
          color: textColor,
          fontFace: "Arial",
          lineSpacing: 1.3
        });

        // Draw connected neural node graph using native shapes
        const cx = 9.6;
        const cy = 4.0;
        const r = 1.4;
        
        // Outer dotted circle orbit
        slide.addShape(pptx.ShapeType.oval, {
          line: { color: accentColor, width: 1.5, dashType: "dash" },
          fill: { color: "FFFFFF", alpha: 0 },
          x: cx - r,
          y: cy - r,
          w: r * 2,
          h: r * 2
        });

        // Connected satellite nodes
        const nodeCount = 5;
        for (let i = 0; i < nodeCount; i++) {
          const angle = (i / nodeCount) * Math.PI * 2;
          const nx = cx + Math.cos(angle) * r;
          const ny = cy + Math.sin(angle) * r;
          
          // Draw connector vector line
          slide.addShape(pptx.ShapeType.line, {
            line: { color: titleColor, width: 1 },
            x: cx,
            y: cy,
            w: nx - cx,
            h: ny - cy
          });

          // Satellite node dot
          slide.addShape(pptx.ShapeType.oval, {
            fill: accentColor,
            line: { color: "FFFFFF", width: 1 },
            x: nx - 0.2,
            y: ny - 0.2,
            w: 0.4,
            h: 0.4
          });
        }

        // Center Core node
        slide.addShape(pptx.ShapeType.oval, {
          fill: titleColor,
          line: { color: "FFFFFF", width: 2 },
          x: cx - 0.35,
          y: cy - 0.35,
          w: 0.7,
          h: 0.7
        });

        // Synaptic label underneath
        slide.addText(slideData.graphicPrompt ? slideData.graphicPrompt.toUpperCase().substring(0, 30) : "SYNAPTIC NODE MESH", {
          x: 7.0,
          y: 5.9,
          w: 5.2,
          h: 0.4,
          fontSize: 9,
          color: "64748B",
          fontFace: "Courier New",
          align: "center",
          bold: true
        });

      } else {
        // Standard full list / conclusion list
        const bulletText = slideData.bullets.map(b => `• ${b}`).join('\n\n');
        slide.addText(bulletText, {
          x: 0.8,
          y: 2.0,
          w: 11.7,
          h: 4.5,
          fontSize: 16,
          color: textColor,
          fontFace: "Arial",
          lineSpacing: 1.4
        });
      }
    });

    // Triggers local system download dialog for pure PPTX file
    await pptx.writeFile({ fileName: `${presentation.title.replace(/\s+/g, '_')}.pptx` });
  };

  // ============================================================================
  // REAL CLIENT-SIDE PDF PRESENTATION EXPORTER (HIGH-FIDELITY VECTOR PDF)
  // ============================================================================
  const generateRealPDF = async (presentation: Presentation) => {
    // 16:9 widescreen landscape dimension: 297mm width, 167.06mm height
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 167.06]
    });

    // Theme color palette adapters in RGB integers
    let bgRGB = [10, 3, 20]; // Default deep purple
    let titleColorRGB = [255, 0, 160]; // Pink
    let textColorRGB = [226, 232, 240]; // Slate-200
    let accentColorRGB = [0, 240, 255]; // Cyan
    
    if (presentation.theme === 'luxury') {
      bgRGB = [20, 16, 11];
      titleColorRGB = [212, 175, 55]; // Gold
      accentColorRGB = [212, 175, 55];
      textColorRGB = [245, 245, 240];
    } else if (presentation.theme === 'technology') {
      bgRGB = [1, 9, 36];
      titleColorRGB = [0, 209, 255]; // Cyan
      accentColorRGB = [59, 130, 246]; // Blue
      textColorRGB = [224, 242, 254];
    } else if (presentation.theme === 'startup') {
      bgRGB = [13, 4, 38];
      titleColorRGB = [167, 139, 250]; // Violet
      accentColorRGB = [236, 72, 153]; // Pink
      textColorRGB = [245, 243, 255];
    } else if (presentation.theme === 'business') {
      bgRGB = [5, 14, 36];
      titleColorRGB = [59, 130, 246]; // Blue
      accentColorRGB = [96, 165, 250]; // Light Blue
      textColorRGB = [241, 245, 249];
    } else if (presentation.theme === 'minimal') {
      bgRGB = [9, 9, 9];
      titleColorRGB = [255, 255, 255];
      accentColorRGB = [204, 204, 204];
      textColorRGB = [229, 229, 229];
    }

    presentation.slides.forEach((slideData, index) => {
      if (index > 0) {
        doc.addPage([297, 167.06], 'landscape');
      }

      // Background card shape fill
      doc.setFillColor(bgRGB[0], bgRGB[1], bgRGB[2]);
      doc.rect(0, 0, 297, 167.06, 'F');

      // Cyber boundary double border
      doc.setDrawColor(accentColorRGB[0], accentColorRGB[1], accentColorRGB[2]);
      doc.setLineWidth(0.4);
      doc.rect(8, 8, 281, 151.06, 'D');

      // System watermark text details
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`SLIDE ${index + 1} / ${presentation.slides.length}`, 279, 13, { align: 'right' });

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(titleColorRGB[0], titleColorRGB[1], titleColorRGB[2]);
      doc.text(slideData.title.toUpperCase(), 18, 22);

      // Slide content
      doc.setTextColor(textColorRGB[0], textColorRGB[1], textColorRGB[2]);
      doc.setFont('helvetica', 'normal');
      
      if (slideData.type === 'title') {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(slideData.bullets[0] || '', 18, 55, { maxWidth: 260 });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(148, 163, 184); // Slate-400
        const subBullets = slideData.bullets.slice(1);
        let currentY = 75;
        subBullets.forEach(sb => {
          doc.text(sb, 18, currentY, { maxWidth: 260 });
          currentY += 15;
        });
      } else if (slideData.type === 'chart' && slideData.chartData) {
        // Split layout: bullets on left, custom canvas bar graph on right
        doc.setFontSize(12);
        let currentY = 45;
        slideData.bullets.forEach(b => {
          doc.text(`• ${b}`, 18, currentY, { maxWidth: 125 });
          currentY += 18;
        });

        // Vector chart drawing on the right
        const startX = 160;
        const startY = 120;
        const chartWidth = 110;
        const chartHeight = 70;

        // Draw axes
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.2);
        doc.line(startX, startY, startX + chartWidth, startY); // X axis
        doc.line(startX, startY, startX, startY - chartHeight); // Y axis

        const vals = slideData.chartData.values;
        const labels = slideData.chartData.labels;
        const maxVal = Math.max(...vals) || 1;
        const barSpacing = chartWidth / vals.length;
        
        doc.setFillColor(titleColorRGB[0], titleColorRGB[1], titleColorRGB[2]);
        
        vals.forEach((v, vIdx) => {
          const barH = (v / maxVal) * (chartHeight - 15);
          const barX = startX + vIdx * barSpacing + 4;
          const barY = startY - barH;
          
          doc.rect(barX, barY, barSpacing - 8, barH, 'F');
          
          // Draw labels and metrics values
          doc.setFontSize(8);
          doc.setTextColor(textColorRGB[0], textColorRGB[1], textColorRGB[2]);
          doc.text(labels[vIdx] || '', barX + (barSpacing - 8) / 2, startY + 6, { align: 'center' });
          doc.text(String(v), barX + (barSpacing - 8) / 2, barY - 3, { align: 'center' });
        });

      } else if (slideData.type === 'timeline') {
        const steps = slideData.bullets;
        const count = steps.length;
        const colWidth = Math.min(80, 260 / count);
        const startX = 18;

        steps.forEach((step, sIdx) => {
          const x = startX + sIdx * (colWidth + 6);
          
          // Step Card panel outline
          doc.setDrawColor(accentColorRGB[0], accentColorRGB[1], accentColorRGB[2]);
          doc.setFillColor(bgRGB[0] + 12, bgRGB[1] + 12, bgRGB[2] + 12);
          doc.rect(x, 45, colWidth, 90, 'FD');

          // Header
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(titleColorRGB[0], titleColorRGB[1], titleColorRGB[2]);
          doc.text(`STEP 0${sIdx + 1}`, x + 5, 57);

          // Details text
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(textColorRGB[0], textColorRGB[1], textColorRGB[2]);
          doc.text(step, x + 5, 68, { maxWidth: colWidth - 10 });
        });

      } else if (slideData.type === 'image') {
        // Bullets on the left
        doc.setFontSize(12);
        let currentY = 45;
        slideData.bullets.forEach(b => {
          doc.text(`• ${b}`, 18, currentY, { maxWidth: 125 });
          currentY += 18;
        });

        // Connected vector mesh rendering on the right
        const cx = 215;
        const cy = 80;
        const r = 30;

        doc.setDrawColor(accentColorRGB[0], accentColorRGB[1], accentColorRGB[2]);
        doc.setLineWidth(0.3);
        doc.circle(cx, cy, r, 'S');

        const nodeCount = 5;
        doc.setFillColor(accentColorRGB[0], accentColorRGB[1], accentColorRGB[2]);
        for (let i = 0; i < nodeCount; i++) {
          const angle = (i / nodeCount) * Math.PI * 2;
          const nx = cx + Math.cos(angle) * r;
          const ny = cy + Math.sin(angle) * r;

          doc.setDrawColor(titleColorRGB[0], titleColorRGB[1], titleColorRGB[2]);
          doc.line(cx, cy, nx, ny);
          doc.circle(nx, ny, 2.5, 'FD');
        }

        doc.setFillColor(titleColorRGB[0], titleColorRGB[1], titleColorRGB[2]);
        doc.circle(cx, cy, 5, 'FD');

        doc.setFont('courier', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(slideData.graphicPrompt ? slideData.graphicPrompt.toUpperCase().substring(0, 30) : "SYNAPTIC NODE MESH", cx, cy + r + 15, { align: 'center' });

      } else {
        doc.setFontSize(13);
        let currentY = 45;
        slideData.bullets.forEach(b => {
          doc.text(`• ${b}`, 18, currentY, { maxWidth: 260 });
          currentY += 18;
        });
      }
    });

    doc.save(`${presentation.title.replace(/\s+/g, '_')}.pdf`);
  };

export function PresentationStudio() {
  // --- Standard States ---
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [activeTheme, setActiveTheme] = useState<ThemeId>('cyberpunk');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genMessage, setGenMessage] = useState('');
  const [presenterMode, setPresenterMode] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Dashboard & History States
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);

  // Editor states
  const [editingTitle, setEditingTitle] = useState('');
  const [editingBullets, setEditingBullets] = useState<string[]>([]);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingChartLabels, setEditingChartLabels] = useState<string[]>([]);
  const [editingChartValues, setEditingChartValues] = useState<number[]>([]);
  const [graphicPromptState, setGraphicPromptState] = useState('');
  const [isGeneratingGraphic, setIsGeneratingGraphic] = useState(false);

  // Export & Action loaders
  const [exportingType, setExportingType] = useState<'pdf' | 'pptx' | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  
  // Floating Assistant state
  const [assistantText, setAssistantText] = useState("Status: Node Ready. Command me to generate a new presentation or enhance your active slide.");
  const [assistantQuery, setAssistantQuery] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Load and Save Presentations from LocalStorage ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omniai_saved_presentations');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPresentations(parsed);
        if (parsed.length > 0) {
          // Auto load the most recent presentation by default
          setCurrentPresentation(parsed[0]);
          setActiveTheme(parsed[0].theme);
          setShowDashboard(false);
        }
      } else {
        // Seed first mock presentation
        const seedDeck: Presentation = {
          id: 'preset-deck',
          title: 'OMNIAI AI Presentation Studio',
          topic: 'OmniAI Platform Overview',
          theme: 'cyberpunk',
          slides: MOCK_PITCH_DECK_SLIDES,
          createdAt: new Date().toLocaleString()
        };
        const initial = [seedDeck];
        setPresentations(initial);
        setCurrentPresentation(seedDeck);
        setActiveTheme('cyberpunk');
        localStorage.setItem('omniai_saved_presentations', JSON.stringify(initial));
        setShowDashboard(false);
      }
    } catch (e) {
      console.error("Failed to restore presentation history", e);
    }
  }, []);

  // Save changes back to LocalStorage
  const saveActivePresentation = (updated: Presentation) => {
    setCurrentPresentation(updated);
    setPresentations(prev => {
      const next = prev.map(p => p.id === updated.id ? updated : p);
      if (!next.find(p => p.id === updated.id)) {
        next.unshift(updated);
      }
      try {
        localStorage.setItem('omniai_saved_presentations', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Sync edits to currently active slide inputs
  useEffect(() => {
    if (!currentPresentation || currentPresentation.slides.length === 0) return;
    const slide = currentPresentation.slides[activeSlideIndex];
    if (slide) {
      setEditingTitle(slide.title);
      setEditingBullets([...slide.bullets]);
      setEditingNotes(slide.notes || '');
      setGraphicPromptState(slide.graphicPrompt || '');
      if (slide.chartData) {
        setEditingChartLabels([...slide.chartData.labels]);
        setEditingChartValues([...slide.chartData.values]);
      }
    }
  }, [activeSlideIndex, currentPresentation]);

  // Timer tick for presenter mode
  useEffect(() => {
    if (presenterMode) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [presenterMode]);

  // Format Elapsed Time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // --- Dynamic SVG Abstract Design Generator (No static images!) ---
  const renderAbstractGraphic = (seed: number, promptText: string, theme: ThemePreset) => {
    const colorA = theme.id === 'cyberpunk' ? '#ec4899' : theme.id === 'luxury' ? '#d4af37' : theme.id === 'technology' ? '#00d1ff' : '#8b5cf6';
    const colorB = theme.id === 'cyberpunk' ? '#00f0ff' : theme.id === 'luxury' ? '#ffffff' : theme.id === 'technology' ? '#3b82f6' : '#ec4899';
    
    // Abstract geometric configurations based on seed
    const totalLines = (seed % 10) + 12;
    const items = [];
    for (let i = 0; i < totalLines; i++) {
      const angle = (i / totalLines) * Math.PI * 2;
      const x1 = 150 + Math.cos(angle) * 35;
      const y1 = 150 + Math.sin(angle) * 35;
      const x2 = 150 + Math.cos(angle) * (60 + (seed % (i + 5)) * 4);
      const y2 = 150 + Math.sin(angle) * (60 + (seed % (i + 5)) * 4);
      items.push(
        <line 
          key={`line-${i}`} 
          x1={x1} 
          y1={y1} 
          x2={x2} 
          y2={y2} 
          stroke={i % 2 === 0 ? colorA : colorB} 
          strokeWidth={1.5} 
          strokeOpacity={0.6}
          className="animate-pulse"
          style={{ animationDuration: `${2 + (i % 3)}s` }}
        />
      );
    }

    return (
      <svg viewBox="0 0 300 300" className="w-full h-full object-contain max-h-[220px]">
        <defs>
          <radialGradient id={`glowGrad-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colorA} stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="100" fill={`url(#glowGrad-${seed})`} />
        {items}
        {/* Futuristic center core */}
        <circle cx="150" cy="150" r="15" fill="#000" stroke={colorB} strokeWidth="2" className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '8s' }} />
        <circle cx="150" cy="150" r="6" fill={colorA} />
        {/* Surrounding text details */}
        <text x="150" y="275" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace" letterSpacing="2">
          {promptText.substring(0, 30).toUpperCase() || 'SYNAPTIC VECTOR'}
        </text>
      </svg>
    );
  };

  // --- AI Prompt Generation Stream Orchestration ---
  const handleAICompilePresentation = (topicPrompt: string, descriptionText: string, isPitchDeck: boolean = false) => {
    if (!topicPrompt.trim()) return;
    setIsGenerating(true);
    setGenProgress(5);
    setGenMessage("Initializing OMNIAI Presentation Synthesis Matrix...");

    let currentProg = 5;
    const interval = setInterval(() => {
      currentProg += Math.floor(Math.random() * 8) + 3;
      if (currentProg > 95) currentProg = 95;
      setGenProgress(currentProg);

      // Transition messages
      if (currentProg < 25) {
        setGenMessage("Structuring cognitive slide architecture...");
      } else if (currentProg < 50) {
        setGenMessage("Synthesizing copy and key analytics projections...");
      } else if (currentProg < 75) {
        setGenMessage("Compiling visual adapters and animated charts...");
      } else {
        setGenMessage("Applying cyber glassmorphic styles and gradients...");
      }
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setGenProgress(100);
      
      const newTitle = topicPrompt.length > 30 ? topicPrompt.substring(0, 30) + '...' : topicPrompt;
      
      // Smart parsing of description inputs to map onto slide content
      const descPoints = descriptionText.trim() 
        ? descriptionText.split(/[.\n]/).map(x => x.trim()).filter(x => x.length > 4)
        : [];
      
      const bullet1 = descPoints[0] || 'Empower seamless workspace synchronization.';
      const bullet2 = descPoints[1] || 'Maximize cloud execution telemetry curves.';
      const bullet3 = descPoints[2] || 'Eliminate traditional design latency layers entirely.';
      const bullet4 = descPoints[3] || 'Decentralized cross-node sync schedules prepared.';

      // Auto build slides customized to prompt theme and user description
      const generatedSlides: Slide[] = [
        {
          id: 'gen-s1',
          title: newTitle.toUpperCase(),
          type: 'title',
          layout: 'hero',
          bullets: [
            `Prompt Node: ${topicPrompt}`,
            descriptionText.trim() ? `Context: ${descriptionText.substring(0, 80)}...` : 'Automated synthesis completed by OmniAI Studio.',
            'Responsive visual cards prepared and locked in.'
          ],
          notes: 'Cover layout. Created instantly via prompt uplink.'
        },
        {
          id: 'gen-s2',
          title: 'TARGET CORE OBJECTIVES',
          type: 'content',
          layout: 'split',
          bullets: [
            bullet1,
            bullet2,
            bullet3
          ],
          notes: 'Key problem and solutions breakdown derived from description context.'
        },
        {
          id: 'gen-s3',
          title: 'METRIC TELEMETRY INDEX',
          type: 'chart',
          layout: 'split',
          bullets: [
            descPoints[4] || 'Performance spikes observed inside target nodes.',
            descPoints[5] || 'User onboarding density reaches record levels.',
            'Average visual load overhead reduced significantly.'
          ],
          chartData: {
            label: 'Data Sync Rate',
            labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
            values: [15, 30, 48, 70, 110, 155]
          },
          notes: 'Quantitative breakdown based on current models.'
        },
        {
          id: 'gen-s4',
          title: 'EXECUTION SEQUENCES',
          type: 'timeline',
          layout: 'grid',
          bullets: [
            'STEP 01: Connect secure identity passkey credentials.',
            'STEP 02: ' + (descPoints[6] || 'Launch local development and canvas nodes.'),
            'STEP 03: ' + (descPoints[7] || 'Dispatch visual templates to staging nodes.')
          ],
          notes: 'Step by step flow diagram.'
        },
        {
          id: 'gen-s5',
          title: 'SYNTHETIC GRAPHICS NODE',
          type: 'image',
          layout: 'split',
          bullets: [
            'Direct injection of generated vector maps.',
            'Custom high-contrast glowing details.',
            'Adaptive responsive borders locked to Cyber themes.'
          ],
          graphicPrompt: descriptionText.trim() ? `futuristic ${descriptionText.substring(0, 30)} mesh` : 'abstract high tech cognitive vector mesh nodes glow',
          graphicSvgSeed: Math.floor(Math.random() * 100),
          notes: 'AI Illustration injected successfully.'
        },
        {
          id: 'gen-s6',
          title: 'UPLINK SYNCHRONIZATION COMPLETE',
          type: 'conclusion',
          layout: 'hero',
          bullets: [
            'Initiate your local execution cluster today.',
            'OmniAI Core remains online 24/7.',
            'Transmitting presentation coordinates: secure@omniai.io'
          ],
          notes: 'Ending slide. Summarize and guide users on boarding.'
        }
      ];

      const newPresentation: Presentation = {
        id: `deck-${Date.now()}`,
        title: isPitchDeck ? `Startup Pitch: ${newTitle}` : `OmniAI Presentation: ${newTitle}`,
        topic: topicPrompt,
        theme: activeTheme,
        slides: generatedSlides,
        createdAt: new Date().toLocaleString()
      };

      saveActivePresentation(newPresentation);
      setActiveSlideIndex(0);
      setIsGenerating(false);
      setPrompt('');
      setDescription('');
      setShowDashboard(false);
      
      setAssistantText(`Synthesized complete presentation on: "${topicPrompt}" utilizing your custom description context with 6 highly structured slides! Toggle themes to see visual adapters update dynamically.`);
    }, 4500);
  };

  // --- Slide Editor Updaters ---
  const handleUpdateActiveSlide = (updatedFields: Partial<Slide>) => {
    if (!currentPresentation) return;
    const updatedSlides = currentPresentation.slides.map((s, idx) => 
      idx === activeSlideIndex ? { ...s, ...updatedFields } : s
    );
    const updatedPres = { ...currentPresentation, theme: activeTheme, slides: updatedSlides };
    saveActivePresentation(updatedPres);
  };

  // Update chart data inputs directly
  const handleUpdateChartValue = (valIdx: number, val: number) => {
    if (!currentPresentation) return;
    const slide = currentPresentation.slides[activeSlideIndex];
    if (slide && slide.chartData) {
      const nextVals = [...editingChartValues];
      nextVals[valIdx] = val;
      setEditingChartValues(nextVals);
      
      handleUpdateActiveSlide({
        chartData: {
          ...slide.chartData,
          values: nextVals
        }
      });
    }
  };

  // Update bullets directly
  const handleUpdateBulletText = (bIdx: number, text: string) => {
    const nextBullets = [...editingBullets];
    nextBullets[bIdx] = text;
    setEditingBullets(nextBullets);
    handleUpdateActiveSlide({ bullets: nextBullets });
  };

  // Rearrange / Reorder slides (Left Sidebar Outline Navigation)
  const handleMoveSlide = (direction: 'up' | 'down') => {
    if (!currentPresentation) return;
    const maxIdx = currentPresentation.slides.length - 1;
    if (direction === 'up' && activeSlideIndex === 0) return;
    if (direction === 'down' && activeSlideIndex === maxIdx) return;

    const targetIdx = direction === 'up' ? activeSlideIndex - 1 : activeSlideIndex + 1;
    const nextSlides = [...currentPresentation.slides];
    
    // Swap slides
    const temp = nextSlides[activeSlideIndex];
    nextSlides[activeSlideIndex] = nextSlides[targetIdx];
    nextSlides[targetIdx] = temp;

    const updatedPres = { ...currentPresentation, slides: nextSlides };
    saveActivePresentation(updatedPres);
    setActiveSlideIndex(targetIdx);
  };

  // Add Slide
  const handleAddNewSlide = () => {
    if (!currentPresentation) return;
    const newSlide: Slide = {
      id: `slide-custom-${Date.now()}`,
      title: 'NEW SYNTHETIC VECTOR',
      type: 'content',
      layout: 'split',
      bullets: [
        'A customized content vector developed in real-time.',
        'Supports visual layout updates and quick actions.',
        'Use the AI rewrite button to generate bullets instantly.'
      ],
      notes: 'Custom notes.'
    };
    const nextSlides = [...currentPresentation.slides];
    nextSlides.splice(activeSlideIndex + 1, 0, newSlide);
    
    const updatedPres = { ...currentPresentation, slides: nextSlides };
    saveActivePresentation(updatedPres);
    setActiveSlideIndex(activeSlideIndex + 1);
    
    setAssistantText("Created new blank slide immediately after the active deck slot.");
  };

  // Delete Slide
  const handleDeleteActiveSlide = () => {
    if (!currentPresentation || currentPresentation.slides.length <= 1) return;
    const nextSlides = currentPresentation.slides.filter((_, idx) => idx !== activeSlideIndex);
    const updatedPres = { ...currentPresentation, slides: nextSlides };
    saveActivePresentation(updatedPres);
    setActiveSlideIndex(prev => Math.max(0, prev - 1));
  };

  // --- Inline AI Actions ---
  const handleAIRewriteBullet = (bIdx: number) => {
    setIsGeneratingGraphic(true);
    setTimeout(() => {
      const rewriteOptions = [
        "Synthesize real-time cluster workloads immediately.",
        "Secure global cognitive pipelines with military grade cryptography.",
        "Elevate dashboard responsiveness by utilizing web assembly modules.",
        "Scale database sync curves by eliminating transaction queues.",
        "Orchestrate visual vector maps instantly with minimal performance footprint."
      ];
      const selectedText = rewriteOptions[Math.floor(Math.random() * rewriteOptions.length)];
      handleUpdateBulletText(bIdx, selectedText);
      setIsGeneratingGraphic(false);
      setAssistantText("Optimized bullet text with AI rewrite tool!");
    }, 1000);
  };

  // Floating copilot query execution
  const handleExecuteAssistantQuery = () => {
    if (!assistantQuery.trim()) return;
    setIsAssistantThinking(true);
    setAssistantText("");
    
    setTimeout(() => {
      setIsAssistantThinking(false);
      const query = assistantQuery.toLowerCase();
      
      if (query.includes('shorten') || query.includes('condense')) {
        const nextBullets = editingBullets.map(b => 
          b.length > 50 ? b.substring(0, 45) + '... (Optimized)' : b
        );
        setEditingBullets(nextBullets);
        handleUpdateActiveSlide({ bullets: nextBullets });
        setAssistantText("Shortened all bullets to maximize visual breathing room on this slide!");
      } else if (query.includes('notes') || query.includes('speaker')) {
        const speakerNotes = `SUMMARY SPEECH NOTE:\n- Deep dive into: ${editingTitle}\n- Talk about core items: ${editingBullets.join(', ')}\n- Keep the delivery confident, cyber-focused, and fast.`;
        setEditingNotes(speakerNotes);
        handleUpdateActiveSlide({ notes: speakerNotes });
        setAssistantText("Synthesized custom Speaker Notes based on active slide bullets!");
      } else if (query.includes('title') || query.includes('headline')) {
        const nextTitle = "QUANTUM " + editingTitle;
        setEditingTitle(nextTitle);
        handleUpdateActiveSlide({ title: nextTitle });
        setAssistantText("Enhanced the slide headline to carry higher marketing weight!");
      } else {
        setAssistantText(`Processed request: "${assistantQuery}". Recommending the 'Startup' or 'Cyberpunk' theme glow overlays to raise visual engagement!`);
      }
      setAssistantQuery('');
    }, 1200);
  };

  // AI Graphic synthesis inside image slides
  const handleGenerateAIGraphic = () => {
    if (!graphicPromptState.trim()) return;
    setIsGeneratingGraphic(true);
    
    setTimeout(() => {
      handleUpdateActiveSlide({
        graphicPrompt: graphicPromptState,
        graphicSvgSeed: Math.floor(Math.random() * 1000)
      });
      setIsGeneratingGraphic(false);
      setAssistantText(`Generated premium vector asset for prompt: "${graphicPromptState}"!`);
    }, 1800);
  };

  // --- PDF & PPTX Widescreen Vector Exporter HUD ---
  const handleTriggerExport = (type: 'pdf' | 'pptx') => {
    if (!currentPresentation) return;
    setExportingType(type);
    setExportProgress(5);
    
    let currentProg = 5;
    const interval = setInterval(() => {
      currentProg += 15;
      if (currentProg > 99) currentProg = 99;
      setExportProgress(currentProg);
    }, 200);

    setTimeout(async () => {
      clearInterval(interval);
      setExportProgress(100);
      
      try {
        if (type === 'pptx') {
          await generateRealPPTX(currentPresentation);
        } else {
          await generateRealPDF(currentPresentation);
        }
        
        setTimeout(() => {
          setExportingType(null);
          setAssistantText(`Export completed successfully! Your live vector presentation has been compiled and downloaded as an active .${type.toUpperCase()} file.`);
        }, 800);
      } catch (err) {
        console.error("Export compilation failed:", err);
        setTimeout(() => {
          setExportingType(null);
          setAssistantText(`Warning: Vector compiler failed to assemble local file. WPS/PowerPoint system overlays block detected or write permission error.`);
        }, 800);
      }
    }, 2500);
  };

  const themePreset = THEME_PRESETS[activeTheme];
  const activeSlide = currentPresentation?.slides[activeSlideIndex] || null;

  return (
    <div className={cn(
      "min-h-screen text-slate-100 flex flex-col relative transition-all duration-700 overflow-x-hidden p-0 rounded-3xl",
      "bg-gradient-to-br",
      themePreset.gradientBg
    )}>
      {/* Dynamic theme background glowing dots grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />

      {/* ── EXPORT COMPILER LOADER OVERLAY ── */}
      <AnimatePresence>
        {exportingType && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] backdrop-blur-2xl bg-black/80 flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full glass-panel border-[#00d1ff]/20 p-8 rounded-3xl text-center space-y-6">
              <RefreshCw className="animate-spin text-[#00d1ff] mx-auto" size={48} />
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase tracking-widest text-white">Compiling Slide Node</h3>
                <p className="text-xs text-slate-400">Assembling vector coordinates, grids, and themes into .{exportingType.toUpperCase()} file...</p>
              </div>
              
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-[#00d1ff] to-[#8b5cf6] h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${exportProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="text-[10px] font-mono text-cyan-400">{exportProgress}% Synchronized</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI GENERATION SYNTHESIS LOADER OVERLAY ── */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] backdrop-blur-3xl bg-slate-950/90 flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-lg w-full text-center space-y-8 relative">
              {/* Backlight glow */}
              <div className="absolute inset-0 bg-[#8b5cf6]/5 blur-[90px] rounded-full" />
              
              <div className="space-y-4">
                <Sparkles className="animate-pulse text-[#00d1ff] mx-auto hologram-flicker" size={56} />
                <h2 className="text-2xl font-black uppercase tracking-[0.3em] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  OmniAI Neural Synthesizer
                </h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {genMessage}
                </p>
              </div>

              <div className="w-64 mx-auto bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5 relative">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${genProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <div className="text-[10px] font-mono text-[#00D1FF] uppercase tracking-widest">
                Nodes active. Sync progress: {genProgress}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER PANEL ── */}
      <header className="h-16 px-6 border-b border-white/5 backdrop-blur-md bg-black/20 flex items-center justify-between relative z-40">
        <div className="flex items-center gap-3">
          <PresentationIcon size={18} className="text-[#00D1FF]" />
          <h1 className="text-[10px] font-black uppercase tracking-[0.45em] text-white">
            OmniAI Presentation Studio
          </h1>
          {currentPresentation && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[9px] font-mono text-slate-400 uppercase">
              DECK: <span className="text-[#00D1FF] font-bold">{currentPresentation.title}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDashboard(!showDashboard)}
            className="px-3.5 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Grid size={11} /> {showDashboard ? 'Close Dashboard' : 'Dashboard Vault'}
          </button>

          {currentPresentation && (
            <button 
              onClick={() => setPresenterMode(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-1.5"
            >
              <Play size={11} fill="black" /> PRESENT ONLINE
            </button>
          )}
        </div>
      </header>

      {/* ── CORE WORKSPACE PANELS ── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ── LEFT SIDEBAR OUTLINE NAVIGATOR (GAMMA OUTLINE VIEW) ── */}
        {currentPresentation && !showDashboard && (
          <aside className="w-56 border-r border-white/5 backdrop-blur-md bg-black/10 flex flex-col p-4 space-y-4 overflow-y-auto no-scrollbar select-none z-30">
            <div className="flex justify-between items-center px-1">
              <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-400">Slide Outline ({currentPresentation.slides.length})</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleMoveSlide('up')}
                  disabled={activeSlideIndex === 0}
                  className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="Move Slide Up"
                >
                  <ChevronLeft size={10} className="rotate-90" />
                </button>
                <button 
                  onClick={() => handleMoveSlide('down')}
                  disabled={activeSlideIndex === currentPresentation.slides.length - 1}
                  className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="Move Slide Down"
                >
                  <ChevronRight size={10} className="rotate-90" />
                </button>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              {currentPresentation.slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={cn(
                    "w-full text-left p-3.5 rounded-xl border transition-all text-xs flex gap-3 relative group",
                    idx === activeSlideIndex
                      ? "bg-white/[0.04] border-[#00d1ff]/40 text-white"
                      : "bg-transparent border-transparent hover:bg-white/[0.02] text-slate-400 hover:text-slate-200"
                  )}
                >
                  <span className="text-[8px] font-mono font-bold text-slate-500 mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold uppercase tracking-wide truncate">{s.title || 'Untitled Slide'}</div>
                    <div className="text-[7.5px] font-mono uppercase text-[#00d1ff] tracking-widest mt-1">{s.type}</div>
                  </div>
                  
                  {currentPresentation.slides.length > 1 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Trigger deletion directly
                        const nextSlides = currentPresentation.slides.filter((_, sIdx) => sIdx !== idx);
                        const updatedPres = { ...currentPresentation, slides: nextSlides };
                        saveActivePresentation(updatedPres);
                        setActiveSlideIndex(prev => Math.max(0, prev - 1));
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </button>
              ))}

              <button 
                onClick={handleAddNewSlide}
                className="w-full py-3.5 rounded-xl border border-dashed border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] text-[8.5px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Plus size={10} /> Insert Slide Vector
              </button>
            </div>
          </aside>
        )}

        {/* ── MAIN WORKSPACE CONTENT ── */}
        <main className="flex-1 relative flex flex-col p-6 overflow-y-auto no-scrollbar z-20">
          
          {/* ── SHOW DASHBOARD VIEW ── */}
          <AnimatePresence>
            {showDashboard && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-4xl w-full mx-auto space-y-8 py-8"
              >
                {/* HERO PROMPT MATRIX */}
                <div className="text-center space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-[0.2em] bg-gradient-to-r from-[#00D1FF] via-[#8B5CF6] to-[#ec4899] bg-clip-text text-transparent">
                    OMNIAI Presentation Studio
                  </h2>
                  <p className="text-xs text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                    Create beautiful AI-powered presentations instantly. Input a text prompt directive, and see the system construct structured slide vectors, layouts, dynamic charts, and vectors in real-time.
                  </p>
                </div>

                {/* PROMPT GENERATION BOX */}
                <div className="glass-panel border-white/10 bg-slate-900/60 p-6 rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative space-y-4">
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#00D1FF]/40 to-transparent" />
                  
                  <div className="space-y-1 text-left">
                    <label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[#00d1ff] block ml-1">Presentation Headline / Topic</label>
                    <input 
                      type="text"
                      placeholder="e.g. Quantum Computing SaaS Pitch Deck"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-semibold leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[#8B5CF6] block ml-1">Presentation Description / Content Details</label>
                    <textarea 
                      placeholder="Enter the description, facts, figures, target audience, or specific content outlines you want the AI to incorporate into your slides..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#8B5CF6]/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-semibold leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 justify-start items-center">
                    <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 mr-1">Quick Suggestions:</span>
                    {TEMPLATE_SUGGESTIONS.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(s)}
                        className="px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-[#8b5cf6]/35 bg-white/[0.02] hover:bg-[#8b5cf6]/5 text-[8.5px] font-bold text-slate-400 hover:text-white transition-all shadow-sm truncate max-w-[200px]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">Preset Theme:</span>
                      <select
                        value={activeTheme}
                        onChange={(e) => setActiveTheme(e.target.value as ThemeId)}
                        className="bg-slate-950 border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-300 focus:outline-none"
                      >
                        {Object.values(THEME_PRESETS).map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAICompilePresentation(prompt, description, true)}
                        disabled={!prompt.trim()}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                          !prompt.trim()
                            ? "bg-slate-900 text-slate-500 cursor-not-allowed border border-white/5"
                            : "bg-white hover:bg-[#8B5CF6] text-black hover:text-white active:scale-95"
                        )}
                      >
                        Create Pitch Deck
                      </button>
                      <button 
                        onClick={() => handleAICompilePresentation(prompt, description, false)}
                        disabled={!prompt.trim()}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg",
                          !prompt.trim()
                            ? "bg-slate-900 text-slate-500 cursor-not-allowed border border-white/5"
                            : "bg-[#00D1FF] hover:bg-[#00d1ff]/80 text-black active:scale-95 shadow-[0_0_20px_rgba(0,209,255,0.2)]"
                        )}
                      >
                        Generate Presentation
                      </button>
                    </div>
                  </div>
                </div>

                {/* SAVED PRESENTATIONS LIST */}
                <div className="space-y-3 text-left">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block px-1">Saved Presentations history</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presentations.map((p) => (
                      <div 
                        key={p.id}
                        onClick={() => {
                          setCurrentPresentation(p);
                          setActiveTheme(p.theme);
                          setActiveSlideIndex(0);
                          setShowDashboard(false);
                        }}
                        className="glass-panel border-white/5 bg-slate-900/40 p-5 rounded-2xl cursor-pointer hover:border-cyan-500/20 hover:bg-slate-900/60 transition-all flex flex-col gap-3 relative group overflow-hidden"
                      >
                        {/* Dynamic backdrop accent */}
                        <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-all" />
                        
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold uppercase text-white tracking-wide truncate max-w-[280px]">
                            {p.title}
                          </h4>
                          <p className="text-[7.5px] font-mono text-slate-400 tracking-wider">
                            TOPIC: {p.topic.substring(0, 50)}...
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-white/5 text-[8px] font-mono text-slate-500">
                          <div>Theme: <span className="text-white/60 uppercase">{p.theme}</span></div>
                          <div>Slides: <span className="text-white/60">{p.slides.length}</span></div>
                          <div>{p.createdAt.split(',')[0]}</div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const next = presentations.filter(x => x.id !== p.id);
                            setPresentations(next);
                            localStorage.setItem('omniai_saved_presentations', JSON.stringify(next));
                            if (currentPresentation?.id === p.id) {
                              setCurrentPresentation(next[0] || null);
                            }
                          }}
                          className="absolute top-4 right-4 p-1.5 rounded hover:bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── SLIDE VIEWER/EDITOR CANVAS (GAMMA EDITING HUD) ── */}
          {currentPresentation && !showDashboard && activeSlide && (
            <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col space-y-6">
              
              {/* INTERACTIVE CONTROLS HUD */}
              <div className="flex flex-wrap justify-between items-center gap-3 p-3.5 glass-panel border-white/5 bg-slate-950/40 rounded-2xl select-none">
                
                {/* 1. Theme Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-500">Active Theme</span>
                  <div className="flex gap-1">
                    {(Object.keys(THEME_PRESETS) as ThemeId[]).map((tId) => (
                      <button
                        key={tId}
                        onClick={() => {
                          setActiveTheme(tId);
                          saveActivePresentation({ ...currentPresentation, theme: tId });
                        }}
                        title={THEME_PRESETS[tId].name}
                        className={cn(
                          "w-5 h-5 rounded-full border transition-all hover:scale-110 active:scale-95 flex items-center justify-center",
                          activeTheme === tId ? "border-white" : "border-transparent"
                        )}
                        style={{
                          background: tId === 'cyberpunk' ? 'linear-gradient(135deg, #ec4899, #00f0ff)' :
                                      tId === 'luxury' ? 'linear-gradient(135deg, #d4af37, #1c1917)' :
                                      tId === 'technology' ? 'linear-gradient(135deg, #00d1ff, #0a2540)' :
                                      tId === 'startup' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' :
                                      tId === 'business' ? 'linear-gradient(135deg, #3b82f6, #0f172a)' : 'linear-gradient(135deg, #333, #000)'
                        }}
                      >
                        {activeTheme === tId && <Check size={8} className="text-black bg-white rounded-full p-px" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Layout & Type presets Toggles */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-500">Type</span>
                    <select
                      value={activeSlide.type}
                      onChange={(e) => handleUpdateActiveSlide({ type: e.target.value as any })}
                      className="bg-slate-950 border border-white/5 rounded-lg px-2 py-1 text-[8.5px] font-bold uppercase text-slate-300 focus:outline-none"
                    >
                      <option value="title">Cover Title</option>
                      <option value="content">Bullets</option>
                      <option value="chart">Analytics Chart</option>
                      <option value="timeline">Steps Timeline</option>
                      <option value="image">AI Graphic</option>
                      <option value="conclusion">Conclusion CTA</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-500">Layout</span>
                    <select
                      value={activeSlide.layout}
                      onChange={(e) => handleUpdateActiveSlide({ layout: e.target.value as any })}
                      className="bg-slate-950 border border-white/5 rounded-lg px-2 py-1 text-[8.5px] font-bold uppercase text-slate-300 focus:outline-none"
                    >
                      <option value="split">Split Layout</option>
                      <option value="hero">Hero Center</option>
                      <option value="grid">Multi-Card</option>
                      <option value="full">Full Canvas</option>
                    </select>
                  </div>
                </div>

                {/* 3. Export Buttons */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleTriggerExport('pptx')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-[#8b5cf6]/10 border border-white/5 hover:border-[#8b5cf6]/25 text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-all text-[8px] font-black uppercase tracking-widest"
                    title="Export PowerPoint PPTX"
                  >
                    <Download size={10} /> PPTX
                  </button>
                  <button
                    onClick={() => handleTriggerExport('pdf')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-[#00d1ff]/10 border border-white/5 hover:border-[#00d1ff]/25 text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-all text-[8px] font-black uppercase tracking-widest"
                    title="Export Adobe PDF"
                  >
                    <FileText size={10} /> PDF
                  </button>
                </div>
              </div>

              {/* DYNAMIC PRESENTATION SLIDE COMPILER CARD */}
              <div 
                className={cn(
                  "flex-1 min-h-[420px] rounded-[32px] border relative overflow-hidden transition-all duration-700 p-8 lg:p-12 flex flex-col justify-between select-text shadow-2xl",
                  themePreset.cardBg,
                  themePreset.borderColor,
                  themePreset.glowColor
                )}
              >
                {/* Dynamic Cyber Corner Highlights */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00d1ff]/30 rounded-tl-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ec4899]/30 rounded-br-3xl pointer-events-none" />

                {/* Slide Header metadata */}
                <div className="flex justify-between items-center select-none opacity-50 text-[8px] font-mono tracking-widest uppercase">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>NODE COMPILER SYNTH: STABLE</span>
                  </div>
                  <div>
                    SLIDE {activeSlideIndex + 1} / {currentPresentation.slides.length}
                  </div>
                </div>

                {/* ACTIVE SLIDE RENDER ENGINE */}
                <div className="flex-1 flex flex-col justify-center my-8">
                  <div className={cn(
                    "grid gap-8 items-center",
                    activeSlide.layout === 'split' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 text-center"
                  )}>
                    
                    {/* LEFT PANEL: WRITTEN CONTENT LAYOUT */}
                    <div className="space-y-6 text-left">
                      {/* Direct Headline Editor */}
                      <div className="space-y-1">
                        <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[#00d1ff] block ml-1 select-none">Headline</span>
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => {
                            setEditingTitle(e.target.value);
                            handleUpdateActiveSlide({ title: e.target.value });
                          }}
                          className={cn(
                            "w-full bg-transparent border-b border-transparent focus:border-cyan-500/30 text-3xl font-black uppercase tracking-wider text-white focus:outline-none transition-all",
                            themePreset.highlightText
                          )}
                        />
                      </div>

                      {/* Direct Bullet List Editor */}
                      <div className="space-y-4">
                        <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1 select-none">Key Slide Anchors</span>
                        <div className="space-y-3">
                          {editingBullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex gap-3 group relative items-start">
                              <span className="text-xs text-[#00D1FF] font-black select-none mt-1.5">▪</span>
                              <textarea
                                value={bullet}
                                onChange={(e) => handleUpdateBulletText(bIdx, e.target.value)}
                                rows={2}
                                className={cn(
                                  "flex-1 bg-transparent border border-transparent hover:border-white/5 focus:border-[#8b5cf6]/35 rounded-lg px-2.5 py-1 text-xs focus:outline-none transition-all leading-relaxed font-semibold",
                                  themePreset.textColor
                                )}
                              />
                              
                              {/* Inline AI actions */}
                              <div className="absolute right-2 top-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleAIRewriteBullet(bIdx)}
                                  title="AI Rewrite Anchor"
                                  className="w-5 h-5 rounded bg-white/5 hover:bg-[#8b5cf6]/20 border border-white/5 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
                                >
                                  <Wand2 size={9} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL: VISUAL ADAPTER GRAPHICS OR CHARTS */}
                    {activeSlide.layout === 'split' && (
                      <div className="flex flex-col items-center justify-center p-6 glass-panel border-white/5 bg-slate-950/30 rounded-3xl min-h-[220px]">
                        
                        {/* CHART VISUALIZER */}
                        {activeSlide.type === 'chart' && activeSlide.chartData && (
                          <div className="w-full space-y-6">
                            <div className="flex justify-between items-center select-none px-1">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#00D1FF]">{activeSlide.chartData.label}</span>
                              <span className="text-[7.5px] font-mono text-slate-500">DYNAMIC ARC VISUALIZER</span>
                            </div>
                            
                            {/* Dynamic SVG Area/Line Chart */}
                            <svg viewBox="0 0 300 120" className="w-full h-24 overflow-visible">
                              <defs>
                                <linearGradient id={`chartGrad-${activeTheme}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#00d1ff" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#00d1ff" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              
                              {/* Dynamic Grid coordinates */}
                              <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.05)" />
                              <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.02)" />
                              
                              {/* Draw SVG area curve */}
                              {(() => {
                                const maxVal = Math.max(...editingChartValues) || 1;
                                const widthStep = 300 / (editingChartValues.length - 1);
                                const points = editingChartValues.map((v, i) => `${i * widthStep},${100 - (v / maxVal) * 80}`);
                                const pathD = `M0,100 L${points.join(' L')} L300,100 Z`;
                                const lineD = `M${points.join(' L')}`;
                                
                                return (
                                  <>
                                    <path d={pathD} fill={`url(#chartGrad-${activeTheme})`} />
                                    <path d={lineD} fill="none" stroke="#00d1ff" strokeWidth="2.5" className="animate-pulse" />
                                    {editingChartValues.map((v, i) => (
                                      <g key={i}>
                                        <circle 
                                          cx={i * widthStep} 
                                          cy={100 - (v / maxVal) * 80} 
                                          r="4" 
                                          fill="#000" 
                                          stroke="#ec4899" 
                                          strokeWidth="2" 
                                        />
                                        <text 
                                          x={i * widthStep} 
                                          y={100 - (v / maxVal) * 80 - 8} 
                                          fill="#fff" 
                                          fontSize="7" 
                                          fontFamily="monospace" 
                                          textAnchor="middle"
                                        >
                                          {v}
                                        </text>
                                      </g>
                                    ))}
                                  </>
                                );
                              })()}
                            </svg>

                            {/* Direct visual value editors */}
                            <div className="grid grid-cols-6 gap-1 select-none">
                              {editingChartValues.map((v, i) => (
                                <div key={i} className="flex flex-col items-center gap-1.5 p-1 bg-white/[0.01] border border-white/5 rounded-lg">
                                  <span className="text-[7.5px] font-mono text-slate-500 font-bold truncate max-w-[40px]">{editingChartLabels[i] || `L${i+1}`}</span>
                                  <input
                                    type="number"
                                    value={v}
                                    onChange={(e) => handleUpdateChartValue(i, Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-white/5 rounded px-1 py-0.5 text-[8.5px] font-bold text-center text-white focus:outline-none"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* STEPS TIMELINE VISUALIZER */}
                        {activeSlide.type === 'timeline' && (
                          <div className="w-full space-y-4 text-left select-none">
                            <div className="text-[8px] font-black uppercase tracking-widest text-[#8b5cf6]">Journey Milestones</div>
                            <div className="space-y-4 relative pl-3.5 border-l border-white/10">
                              {editingBullets.map((b, idx) => (
                                <div key={idx} className="relative group">
                                  <div className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-[#8b5cf6] border border-slate-950" />
                                  <div className="text-[9px] font-black text-white/80 uppercase">PHASE 0{idx + 1}</div>
                                  <div className="text-[9.5px] text-slate-400 font-medium truncate max-w-[260px]">{b}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI PROCEDURAL GRAPHIC IMAGE NODE */}
                        {activeSlide.type === 'image' && (
                          <div className="w-full space-y-4">
                            <div className="flex justify-between items-center px-1 select-none">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#ec4899] flex items-center gap-1">
                                <ImageIcon size={10} /> AI ILLUSTRATION MATRIX
                              </span>
                              <span className="text-[7px] font-mono text-slate-500">VECTOR MESH NODE</span>
                            </div>

                            {/* Render abstract dynamically based on prompt & seed */}
                            <div className="relative w-full h-32 rounded-xl bg-slate-950/60 border border-white/5 overflow-hidden flex items-center justify-center">
                              {isGeneratingGraphic ? (
                                <RefreshCw className="animate-spin text-[#ec4899] hologram-flicker" size={24} />
                              ) : (
                                renderAbstractGraphic(activeSlide.graphicSvgSeed || 0, graphicPromptState, themePreset)
                              )}
                            </div>

                            <div className="flex gap-2 select-none">
                              <input
                                type="text"
                                placeholder="Describe graphic vector coordinates..."
                                value={graphicPromptState}
                                onChange={(e) => setGraphicPromptState(e.target.value)}
                                className="flex-1 bg-slate-950/60 border border-white/5 focus:border-[#ec4899]/30 rounded-lg px-2.5 py-1.5 text-[9px] text-white placeholder-slate-700 focus:outline-none font-semibold"
                              />
                              <button
                                onClick={handleGenerateAIGraphic}
                                disabled={isGeneratingGraphic || !graphicPromptState.trim()}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all",
                                  isGeneratingGraphic || !graphicPromptState.trim()
                                    ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                                    : "bg-[#ec4899] text-white hover:bg-pink-500 shadow-md active:scale-95"
                                )}
                              >
                                Generate
                              </button>
                            </div>
                          </div>
                        )}

                        {/* STANDARD VALUE ANCHORS DEFAULT FALLBACK */}
                        {activeSlide.type !== 'chart' && activeSlide.type !== 'timeline' && activeSlide.type !== 'image' && (
                          <div className="space-y-4 text-center select-none">
                            <Cpu className="text-[#00D1FF] animate-pulse hologram-flicker mx-auto" size={32} />
                            <div className="space-y-1">
                              <div className="text-[10px] font-black uppercase tracking-widest text-white">Quantum Core Synced</div>
                              <p className="text-[8px] text-slate-400 max-w-[200px]">Use direct drag outlines or visual presets to transform layouts.</p>
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                </div>

                {/* SLIDE FOOTER SPEECH NOTES PANEL */}
                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-500">AI Speaker Notes</span>
                    <input
                      type="text"
                      placeholder="Add speaker talking prompts..."
                      value={editingNotes}
                      onChange={(e) => {
                        setEditingNotes(e.target.value);
                        handleUpdateActiveSlide({ notes: e.target.value });
                      }}
                      className="bg-transparent border border-white/5 focus:border-[#00D1FF]/30 rounded-lg px-2.5 py-1 text-[9.5px] text-slate-400 font-medium w-80 focus:outline-none transition-all truncate"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                      disabled={activeSlideIndex === 0}
                      className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-white transition-all text-[8.5px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-95"
                    >
                      <ChevronLeft size={10} /> Previous
                    </button>
                    <button
                      onClick={() => setActiveSlideIndex(prev => Math.min(currentPresentation.slides.length - 1, prev + 1))}
                      disabled={activeSlideIndex === currentPresentation.slides.length - 1}
                      className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-white transition-all text-[8.5px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-95"
                    >
                      Next <ChevronRight size={10} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>

        {/* ── FLOATING OMNIAI COPILOT ASSISTANT (GAMMA SLIDE IMPROVER) ── */}
        {currentPresentation && !showDashboard && (
          <aside className="w-80 border-l border-white/5 backdrop-blur-md bg-black/10 flex flex-col p-5 space-y-6 z-30 select-none">
            <div className="space-y-1.5 text-left border-b border-white/5 pb-4">
              <div className="text-[7.5px] font-black uppercase tracking-[0.25em] text-[#00d1ff] flex items-center gap-1">
                <Sparkles size={11} className="hologram-flicker" /> OMNIAI Presentation Assistant
              </div>
              <h4 className="text-xs font-black uppercase text-white tracking-wide">Slide Improver</h4>
            </div>

            {/* Assistant response box */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              <div className="p-4 rounded-2xl border border-white/5 bg-slate-950/60 text-left space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#8b5cf6]/5 blur-xl pointer-events-none" />
                <div className="text-[9.5px] text-slate-300 font-semibold leading-relaxed font-sans whitespace-pre-line">
                  {isAssistantThinking ? (
                    <div className="flex items-center gap-2 text-cyan-400">
                      <RefreshCw className="animate-spin" size={10} /> Directing AI neural synthesis...
                    </div>
                  ) : (
                    assistantText
                  )}
                </div>
              </div>

              {/* Layout tips suggestions */}
              <div className="space-y-2 text-left">
                <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-500">Recommended Enhancements</span>
                <div className="space-y-1.5">
                  <button 
                    onClick={() => {
                      setAssistantQuery("Shorten bullet points");
                      setAssistantText("Click 'Transcribe Query' below to condense these bullet points and expand workspace visual space.");
                    }}
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-[#8b5cf6]/5 text-left text-[9px] text-slate-400 hover:text-white transition-all font-semibold flex justify-between items-center"
                  >
                    <span>Shorten content points</span>
                    <Wand2 size={8} className="text-[#8b5cf6]" />
                  </button>
                  <button 
                    onClick={() => {
                      setAssistantQuery("Generate speaker notes");
                      setAssistantText("Click 'Transcribe Query' below to generate talking speech cues locked strictly to these anchors.");
                    }}
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-[#8b5cf6]/5 text-left text-[9px] text-slate-400 hover:text-white transition-all font-semibold flex justify-between items-center"
                  >
                    <span>Synthesize Speaker Notes</span>
                    <Wand2 size={8} className="text-[#8b5cf6]" />
                  </button>
                  <button 
                    onClick={() => {
                      setAssistantQuery("Improve slide headline");
                      setAssistantText("Click 'Transcribe Query' below to boost headline styling and impact.");
                    }}
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-[#8b5cf6]/5 text-left text-[9px] text-slate-400 hover:text-white transition-all font-semibold flex justify-between items-center"
                  >
                    <span>Upgrade headline marketing weight</span>
                    <Wand2 size={8} className="text-[#8b5cf6]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Assistant prompt query */}
            <div className="space-y-2 text-left pt-4 border-t border-white/5">
              <input
                type="text"
                placeholder="Ask assistant to improve or rewrite..."
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-xl px-3 py-2.5 text-[10px] text-white placeholder-slate-700 focus:outline-none font-semibold"
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteAssistantQuery()}
              />
              <button
                onClick={handleExecuteAssistantQuery}
                disabled={isAssistantThinking || !assistantQuery.trim()}
                className={cn(
                  "w-full py-2.5 rounded-xl text-[8.5px] font-black uppercase tracking-widest transition-all",
                  isAssistantThinking || !assistantQuery.trim()
                    ? "bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed"
                    : "bg-white text-black hover:bg-[#00D1FF] active:scale-95 shadow-md"
                )}
              >
                Transcribe Query
              </button>
            </div>
          </aside>
        )}

      </div>

      {/* ── 9. FULLSCREEN PRESENTATION PREVIEW (PRESENTER MODE HUD) ── */}
      <AnimatePresence>
        {presenterMode && currentPresentation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[1100] transition-all duration-700 flex flex-col p-6 overflow-hidden",
              "bg-gradient-to-br",
              THEME_PRESETS[activeTheme].gradientBg
            )}
          >
            {/* Ambient Background grids */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-50" />
            
            {/* Header Presenter Control Hub */}
            <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md rounded-2xl relative z-50 shadow-md">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">LIVE PRESENTER BROADCAST MODE</span>
                <span className="text-white/30">|</span>
                <span className="text-[9px] font-mono text-cyan-400">{currentPresentation.title.toUpperCase()}</span>
              </div>

              {/* Timer HUD & Zoom */}
              <div className="flex items-center gap-6 text-[10px] font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-[#00D1FF]" />
                  <span>ELAPSED: <span className="text-white font-bold">{formatTime(elapsedTime)}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setZoomScale(prev => Math.max(0.7, prev - 0.1))}
                    className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-[8.5px] uppercase font-black tracking-wider w-16 text-center">Zoom: {Math.round(zoomScale * 100)}%</span>
                  <button 
                    onClick={() => setZoomScale(prev => Math.min(1.3, prev + 0.1))}
                    className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Exit Button */}
              <button
                onClick={() => setPresenterMode(false)}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-[8.5px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Minimize2 size={12} /> Exit Presenter
              </button>
            </header>

            {/* Split Screen Presenter Layout */}
            <div className="flex-1 flex overflow-hidden mt-6 gap-6 relative z-40">
              
              {/* Left Column: Visual Presentation slide */}
              <div className="flex-1 flex flex-col justify-center items-center relative p-6">
                
                {/* Visual Slide Wrapper */}
                <motion.div 
                  key={activeSlideIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "w-full max-w-3xl aspect-[16/10] rounded-[36px] border p-8 lg:p-12 flex flex-col justify-between shadow-2xl relative bg-slate-900/90",
                    THEME_PRESETS[activeTheme].cardBg,
                    THEME_PRESETS[activeTheme].borderColor,
                    THEME_PRESETS[activeTheme].glowColor
                  )}
                  style={{ transform: `scale(${zoomScale})` }}
                >
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#00d1ff]/20 rounded-tl-3xl pointer-events-none" />
                  
                  {/* Metadata */}
                  <div className="flex justify-between items-center opacity-40 text-[8px] font-mono tracking-widest uppercase">
                    <div>OmniAI Synaptic Broadcaster v1.2</div>
                    <div>SLIDE {activeSlideIndex + 1} / {currentPresentation.slides.length}</div>
                  </div>

                  {/* Main content display */}
                  <div className="flex-1 flex flex-col justify-center my-6">
                    <div className={cn(
                      "grid gap-8 items-center",
                      currentPresentation.slides[activeSlideIndex].layout === 'split' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 text-center"
                    )}>
                      
                      {/* Left points */}
                      <div className="space-y-6 text-left">
                        <h3 className={cn(
                          "text-3xl font-black uppercase tracking-wider text-white",
                          THEME_PRESETS[activeTheme].highlightText
                        )}>
                          {currentPresentation.slides[activeSlideIndex].title}
                        </h3>

                        <div className="space-y-4">
                          {currentPresentation.slides[activeSlideIndex].bullets.map((bullet, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <span className="text-xs text-[#00D1FF] font-black select-none mt-1">▪</span>
                              <p className={cn(
                                "text-xs font-semibold leading-relaxed",
                                THEME_PRESETS[activeTheme].textColor
                              )}>
                                {bullet}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right visuals */}
                      {currentPresentation.slides[activeSlideIndex].layout === 'split' && (
                        <div className="flex flex-col items-center justify-center p-6 glass-panel border-white/5 bg-slate-950/30 rounded-3xl min-h-[200px]">
                          {currentPresentation.slides[activeSlideIndex].type === 'chart' && currentPresentation.slides[activeSlideIndex].chartData && (
                            <div className="w-full space-y-4 text-left">
                              <div className="text-[8px] font-black uppercase tracking-widest text-[#00D1FF]">
                                {currentPresentation.slides[activeSlideIndex].chartData?.label}
                              </div>
                              <svg viewBox="0 0 300 120" className="w-full h-24 overflow-visible">
                                <defs>
                                  <linearGradient id={`liveGrad-${activeTheme}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00d1ff" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#00d1ff" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.05)" />
                                {(() => {
                                  const chartVals = currentPresentation.slides[activeSlideIndex].chartData?.values || [];
                                  const maxVal = Math.max(...chartVals) || 1;
                                  const widthStep = 300 / (chartVals.length - 1);
                                  const points = chartVals.map((v, i) => `${i * widthStep},${100 - (v / maxVal) * 80}`);
                                  const pathD = `M0,100 L${points.join(' L')} L300,100 Z`;
                                  const lineD = `M${points.join(' L')}`;
                                  
                                  return (
                                    <>
                                      <path d={pathD} fill={`url(#liveGrad-${activeTheme})`} />
                                      <path d={lineD} fill="none" stroke="#00d1ff" strokeWidth="2.5" />
                                      {chartVals.map((v, i) => (
                                        <circle 
                                          key={i} 
                                          cx={i * widthStep} 
                                          cy={100 - (v / maxVal) * 80} 
                                          r="4" 
                                          fill="#000" 
                                          stroke="#ec4899" 
                                          strokeWidth="2" 
                                        />
                                      ))}
                                    </>
                                  );
                                })()}
                              </svg>
                            </div>
                          )}

                          {currentPresentation.slides[activeSlideIndex].type === 'timeline' && (
                            <div className="w-full space-y-4 text-left">
                              <div className="text-[8px] font-black uppercase tracking-widest text-[#8b5cf6]">Journey Milestones</div>
                              <div className="space-y-4 pl-3.5 border-l border-white/10">
                                {currentPresentation.slides[activeSlideIndex].bullets.map((b, idx) => (
                                  <div key={idx} className="relative">
                                    <div className="absolute -left-[20px] top-1 w-2 h-2 rounded-full bg-[#8b5cf6]" />
                                    <div className="text-[9px] font-black text-white/85 uppercase">PHASE 0{idx + 1}</div>
                                    <div className="text-[9px] text-slate-400 font-medium truncate max-w-[200px]">{b}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {currentPresentation.slides[activeSlideIndex].type === 'image' && (
                            <div className="w-full h-32 rounded-xl bg-slate-950/60 border border-white/5 overflow-hidden flex items-center justify-center">
                              {renderAbstractGraphic(currentPresentation.slides[activeSlideIndex].graphicSvgSeed || 0, currentPresentation.slides[activeSlideIndex].graphicPrompt || '', THEME_PRESETS[activeTheme])}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Slide footer */}
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-500 uppercase">
                    <div>Node status: Secure</div>
                    <div>Page {activeSlideIndex + 1}</div>
                  </div>
                </motion.div>

                {/* Keyboard Quick Navigation hints HUD */}
                <div className="absolute bottom-6 flex gap-3 text-[9px] font-mono text-slate-500 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                  <div>KEYBOARD CONTROLS: Use <span className="text-[#00D1FF] font-bold">←</span> and <span className="text-[#00D1FF] font-bold">→</span> keys to navigate slides.</div>
                </div>

              </div>

              {/* Right Column: Presenter Notes Panel */}
              <div className="w-80 backdrop-blur-md bg-black/30 border border-white/5 rounded-3xl p-6 flex flex-col space-y-6">
                
                <div className="space-y-1.5 text-left border-b border-white/5 pb-4">
                  <div className="text-[7.5px] font-black uppercase tracking-widest text-[#7B61FF] flex items-center gap-1">
                    <Volume2 size={11} /> PRESENTER COPILOT CONSOLE
                  </div>
                  <h4 className="text-xs font-black uppercase text-white tracking-wide">Speaker Talking Cues</h4>
                </div>

                <div className="flex-1 p-4 rounded-2xl border border-white/5 bg-slate-950/50 text-left overflow-y-auto no-scrollbar space-y-4">
                  <div className="text-[10.5px] text-slate-300 font-semibold leading-relaxed font-sans whitespace-pre-line">
                    {currentPresentation.slides[activeSlideIndex].notes || 'No speaker notes specified for this slide node. Use the editor to add talking triggers.'}
                  </div>
                </div>

                {/* Deck outline thumbnails */}
                <div className="space-y-3 text-left">
                  <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-500">Quick Navigation outline</span>
                  <div className="grid grid-cols-4 gap-2">
                    {currentPresentation.slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={cn(
                          "py-2 rounded-lg border transition-all text-xs font-mono font-bold text-center",
                          idx === activeSlideIndex
                            ? "bg-[#7B61FF] text-black border-transparent shadow-[0_0_15px_rgba(123,97,255,0.25)]"
                            : "bg-white/[0.01] text-slate-400 border-white/5 hover:text-white"
                        )}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
