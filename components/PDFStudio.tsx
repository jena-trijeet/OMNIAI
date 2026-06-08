"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Share2, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Folder, 
  Layers, 
  Scissors, 
  FileImage, 
  FileArchive, 
  UserCheck, 
  Database, 
  Activity, 
  Clock, 
  Check, 
  FileDown, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  RefreshCw,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { speak } from '@/lib/utils';
import { jsPDF } from 'jspdf';

// ==========================================
// TYPES & SCHEMAS
// ==========================================
interface MockFile {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pagesCount?: number;
}

interface ActivityLog {
  id: string;
  action: string;
  fileName: string;
  fileSize: string;
  time: string;
  status: 'completed' | 'syncing' | 'error';
}

// ==========================================
// RESUME TEMPLATES FOR PDF STUDIO
// ==========================================
const PDF_RESUME_TEMPLATES = [
  {
    id: 'software',
    label: 'Software Engineer',
    emoji: '💻',
    color: 'from-cyan-500/20 to-cyan-900/30',
    border: 'border-cyan-500/40',
    active: 'shadow-[0_0_15px_rgba(34,211,238,0.2)] border-cyan-400',
    data: {
      name: 'ARJUN SHARMA',
      title: 'Senior Software Engineer',
      summary: 'Senior Software Engineer with 6+ years building scalable full-stack applications with React, Node.js, TypeScript, and AWS. Expert in microservices, CI/CD, and high-performance APIs used by millions.',
      experience: `TechNova Labs - Senior Software Engineer (2022 - Present)
- Led backend migration to microservices, reducing API latency by 52%.
- Built real-time WebSocket features serving 200k+ concurrent users.
- Mentored 5 junior engineers and cut deploy time 70% via CI/CD pipelines.

CloudBridge Pvt. Ltd. - Full Stack Developer (2018 - 2022)
- Developed 15+ RESTful APIs consumed across iOS, Android, and web.
- Optimized PostgreSQL queries cutting p99 response from 800ms to 120ms.
- Integrated Stripe payment gateway processing ₹50L+ monthly.`,
      skills: 'React, Next.js, TypeScript, Node.js, AWS, PostgreSQL, Docker, GraphQL'
    }
  },
  {
    id: 'product',
    label: 'Product Manager',
    emoji: '📋',
    color: 'from-purple-500/20 to-purple-900/30',
    border: 'border-purple-500/40',
    active: 'shadow-[0_0_15px_rgba(168,85,247,0.2)] border-purple-400',
    data: {
      name: 'PRIYA MEHTA',
      title: 'Senior Product Manager',
      summary: 'Strategic Product Manager with 7+ years driving 0-to-1 product launches for B2B SaaS platforms. Expert in OKRs, user research, and cross-functional leadership. Scaled 3 products from 0 to $10M ARR.',
      experience: `Fusion SaaS Inc. - Senior Product Manager (2021 - Present)
- Launched AI analytics dashboard adopted by 1,200+ enterprise clients in 9 months.
- Defined roadmap through 60+ customer discovery interviews and NPS analysis.
- Delivered 4 major product releases on time with eng, design, and sales teams.

Orbix Digital - Product Manager (2017 - 2021)
- Grew DAU by 3x through feature-led growth and A/B testing framework.
- Reduced churn 22% by shipping targeted onboarding flow improvements.
- Managed 200+ story backlog across bi-weekly sprints with cross-functional squads.`,
      skills: 'Product Strategy, OKRs, Roadmapping, Agile, User Research, A/B Testing, Figma, Amplitude'
    }
  },
  {
    id: 'designer',
    label: 'UX Designer',
    emoji: '🎨',
    color: 'from-pink-500/20 to-pink-900/30',
    border: 'border-pink-500/40',
    active: 'shadow-[0_0_15px_rgba(236,72,153,0.2)] border-pink-400',
    data: {
      name: 'ANANYA ROY',
      title: 'Senior UX/UI Designer',
      summary: 'Creative UX/UI Designer with 5+ years crafting intuitive, accessible digital experiences. Expert in Figma design systems, user research, and prototyping for consumer-facing tech products.',
      experience: `Nimbus Apps - Senior UX Designer (2021 - Present)
- Redesigned onboarding flow improving day-7 user retention by 38%.
- Built 300-component Figma design system used across 4 product squads.
- Led 20+ usability testing sessions translating insights into UI improvements.

PixelCraft Studio - UI/UX Designer (2019 - 2021)
- Delivered high-fidelity prototypes for 8 client apps in fintech and e-commerce.
- Established brand identity and icon systems for 3 product launches.
- Worked with React developers to ship pixel-perfect responsive interfaces.`,
      skills: 'Figma, Framer, Design Systems, User Research, Prototyping, WCAG, Motion Design, Adobe CC'
    }
  },
  {
    id: 'data',
    label: 'Data Scientist',
    emoji: '📊',
    color: 'from-amber-500/20 to-amber-900/30',
    border: 'border-amber-500/40',
    active: 'shadow-[0_0_15px_rgba(245,158,11,0.2)] border-amber-400',
    data: {
      name: 'ROHAN VERMA',
      title: 'Senior Data Scientist',
      summary: 'Data Scientist with 5+ years building ML models for revenue optimization, NLP, and computer vision. Experienced in end-to-end ML pipelines from experimentation to production deployment at scale.',
      experience: `Intelliflow Analytics - Senior Data Scientist (2021 - Present)
- Built churn prediction model reducing annual revenue loss by $1.2M.
- Designed NLP pipeline processing 500k+ feedback records daily at 94% accuracy.
- Led A/B testing infra enabling 50+ concurrent experiments with statistical rigor.

QuantMetrics Ltd. - Data Scientist (2019 - 2021)
- Developed demand forecasting model improving inventory accuracy by 28%.
- Created Tableau dashboards consumed by C-suite for weekly business reviews.
- Automated ETL pipelines with Airflow saving 12 hours/week of manual reporting.`,
      skills: 'Python, TensorFlow, PyTorch, SQL, BigQuery, Spark, MLflow, Tableau, A/B Testing'
    }
  },
  {
    id: 'marketing',
    label: 'Marketing Lead',
    emoji: '📣',
    color: 'from-orange-500/20 to-orange-900/30',
    border: 'border-orange-500/40',
    active: 'shadow-[0_0_15px_rgba(249,115,22,0.2)] border-orange-400',
    data: {
      name: 'SNEHA KAPOOR',
      title: 'Head of Digital Marketing',
      summary: 'Performance-driven Marketing Lead with 6+ years scaling B2C and B2B brands through data-backed strategies, paid acquisition, and content-led SEO. Generated 10M+ organic impressions managing $2M+ in ad spend.',
      experience: `Vortex Brands - Head of Digital Marketing (2021 - Present)
- Scaled organic traffic 4x in 12 months through technical SEO and pillar content.
- Managed Google & Meta ad budgets of $150k/month achieving 3.2x ROAS.
- Built email automation sequences generating 22% of monthly revenue.

LaunchPad Media - Digital Marketing Manager (2018 - 2021)
- Drove 300% increase in qualified leads through LinkedIn ABM campaigns.
- Launched influencer program with 80+ creators generating 5M+ brand impressions.
- Optimized landing pages through CRO testing increasing demo bookings by 41%.`,
      skills: 'SEO, SEM, Google Ads, Meta Ads, HubSpot, Content Strategy, Email Marketing, CRO, GA4'
    }
  },
  {
    id: 'executive',
    label: 'C-Suite / CTO',
    emoji: '👔',
    color: 'from-emerald-500/20 to-emerald-900/30',
    border: 'border-emerald-500/40',
    active: 'shadow-[0_0_15px_rgba(52,211,153,0.2)] border-emerald-400',
    data: {
      name: 'VIKRAM NAIR',
      title: 'Chief Technology Officer',
      summary: 'Visionary CTO with 15+ years leading engineering organizations from seed to IPO. Expert in digital transformation, platform scalability, M&A technical due diligence, and building high-performance engineering cultures.',
      experience: `Apex Systems Global - Chief Technology Officer (2018 - Present)
- Led engineering org of 120+ engineers across 4 global offices at 99.99% uptime.
- Architected cloud-native migration reducing infrastructure costs by $3.5M annually.
- Drove technical integration of 2 acquisitions in under 18 months.

Nexus Technologies - VP of Engineering (2012 - 2018)
- Scaled engineering team from 15 to 80 engineers during Series B to D.
- Introduced DevOps culture reducing incidents 65% and deploy frequency 10x.
- Delivered platform for 50M+ MAU with sub-200ms global response times.`,
      skills: 'Engineering Leadership, Cloud Architecture, AWS, GCP, DevOps, M&A, Agile at Scale, P&L'
    }
  },
];

export function PDFStudio() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<MockFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>("");
  const [processPercent, setProcessPercent] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activePage, setActivePage] = useState<number>(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Tool specific configurations
  const [selectedOrientation, setSelectedOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [selectedPageSize, setSelectedPageSize] = useState<'A4' | 'Letter'>('A4');
  const [selectedMargin, setSelectedMargin] = useState<'none' | 'thin' | 'normal'>('thin');
  const [selectedCompression, setSelectedCompression] = useState<'extreme' | 'recommended' | 'low'>('recommended');
  
  // AI PDF Generator States
  const [aiTopic, setAiTopic] = useState("");
  const [aiDocType, setAiDocType] = useState("business_report");
  const [aiTone, setAiTone] = useState("technical");
  const [aiLength, setAiLength] = useState("1-3");
  const [generatedDocContent, setGeneratedDocContent] = useState<string | null>(null);

  // Resume Builder States
  const [selectedPdfTemplate, setSelectedPdfTemplate] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState({
    name: "ALEXANDER MERCER",
    title: "Senior Solutions Architect",
    summary: "Dynamic engineering leader specialized in building high-performance AI operating systems, distributed monorepos, and secure local vault networks.",
    experience: "Quantum Systems Inc. - Tech Lead (2024 - Present)\n- Led migration to Next.js App Router decreasing initial load by 40%.\n- Deployed server-side proxy image compilation layers with zero-key fallback setups.",
    skills: "React, Next.js, Node.js, TypeScript, AI Integrations, Web Security"
  });

  // Recent Activity Log
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', action: 'Merge PDF', fileName: 'signed_contract_final.pdf', fileSize: '4.8 MB', time: '10 mins ago', status: 'completed' },
    { id: '2', action: 'Image to PDF', fileName: 'schematic_design_node.pdf', fileSize: '12.4 MB', time: '1 hour ago', status: 'completed' },
    { id: '3', action: 'AI PDF', fileName: 'nexus_os_architecture.pdf', fileSize: '1.2 MB', time: '3 hours ago', status: 'completed' },
    { id: '4', action: 'Compress PDF', fileName: 'compressed_marketing_deck.pdf', fileSize: '3.1 MB', time: 'Yesterday', status: 'completed' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic preview selector
  const getPreviewPagesCount = () => {
    if (activeTool === 'image') return Math.max(1, uploadedFiles.length);
    if (activeTool === 'merge') return Math.max(1, uploadedFiles.reduce((acc, f) => acc + (f.pagesCount || 1), 0));
    if (activeTool === 'ai') return generatedDocContent ? 2 : 1;
    if (activeTool === 'resume') return 1;
    return 1;
  };

  // Simulated Processing Engine
  const startProcessingPipeline = async (actionLabel: string, finalCallback: () => void) => {
    setIsProcessing(true);
    setProcessPercent(0);
    setProcessStep("Initializing quantum compiler node...");
    
    const steps = [
      { p: 15, s: "Ingesting reference vectors..." },
      { p: 35, s: "Synthesizing document structures..." },
      { p: 60, s: "Compiling font coordinates & layout boxes..." },
      { p: 85, s: "Injecting cryptographic structural signature..." },
      { p: 100, s: "Exporting high-fidelity PDF buffer..." }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setProcessPercent(step.p);
      setProcessStep(step.s);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setIsProcessing(false);
    finalCallback();
    
    // Save to user activity log
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action: actionLabel,
      fileName: `omniai_compiled_${Math.floor(Math.random() * 1000)}.pdf`,
      fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      time: 'Just now',
      status: 'completed'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    // Save Generation activity in user's chronological memory vault
    localStorage.setItem('omniai_last_activity', JSON.stringify({
      type: 'System',
      label: `PDF Studio: ${actionLabel.toUpperCase()}`,
      content: `Successfully compiled high-fidelity document: "${newLog.fileName}"`,
      time: 'Just now'
    }));
    window.dispatchEvent(new Event('omniai_activity_update'));
  };

  // --- Dynamic File Upload Handling ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, isDrag: boolean = false) => {
    let files: FileList | null = null;
    if (isDrag) {
      e.preventDefault();
      const dragEvent = e as React.DragEvent<HTMLDivElement>;
      files = dragEvent.dataTransfer.files;
      setIsDragOver(false);
    } else {
      const changeEvent = e as React.ChangeEvent<HTMLInputElement>;
      files = changeEvent.target.files;
    }

    if (!files || files.length === 0) return;

    const newFiles: MockFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const previewUrl = f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined;
      newFiles.push({
        id: `${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        type: f.type,
        previewUrl,
        pagesCount: f.type.includes('pdf') ? Math.floor(Math.random() * 5) + 1 : 1
      });
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFileOrder = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === uploadedFiles.length - 1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const list = [...uploadedFiles];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setUploadedFiles(list);
  };

  // Helper to load image as DataURL
  const loadImageAsDataURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          reject(new Error("Canvas context failed"));
        }
      };
      img.onerror = () => reject(new Error("Image load error"));
      img.src = url;
    });
  };

  // Helper to draw placeholder pages
  const drawPlaceholderPage = (doc: jsPDF, file: MockFile) => {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(1);
    doc.rect(20, 25, 170, 240);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(48);
    doc.setTextColor(200, 200, 200);
    doc.text("PDF", 105, 120, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(file.name, 105, 140, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`FILE SIZE: ${(file.size / 1024 / 1024).toFixed(2)} MB  |  TYPE: ${file.type}`, 105, 150, { align: "center" });
  };

  // Trigger file downloader simulation
  const downloadTrigger = () => {
    startProcessingPipeline("Download PDF", async () => {
      const doc = new jsPDF({
        orientation: selectedOrientation,
        unit: 'mm',
        format: selectedPageSize.toLowerCase() === 'letter' ? 'letter' : 'a4'
      });

      if (activeTool === 'ai') {
        // Document Header strip
        doc.setDrawColor(0, 209, 255);
        doc.setLineWidth(1.5);
        doc.line(20, 15, 190, 15);

        const textContent = generatedDocContent || "No AI text generated.";
        const lines = textContent.split("\n");
        let y = 30;
        
        for (const line of lines) {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          
          let currentLine = line.trim();
          if (currentLine.startsWith("###")) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(17, 24, 39);
            y += 4;
            doc.text(currentLine.replace("###", "").trim(), 20, y);
            y += 8;
          } else if (currentLine.startsWith("####")) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(17, 24, 39);
            y += 2;
            doc.text(currentLine.replace("####", "").trim(), 20, y);
            y += 6;
          } else if (currentLine.startsWith("*")) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(71, 85, 105);
            const bulletText = "• " + currentLine.substring(1).trim();
            const wrapped = doc.splitTextToSize(bulletText, 160);
            for (const wl of wrapped) {
              if (y > 275) {
                doc.addPage();
                y = 20;
              }
              doc.text(wl, 25, y);
              y += 7;
            }
          } else if (currentLine.startsWith("1.") || currentLine.startsWith("2.") || currentLine.startsWith("3.")) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(71, 85, 105);
            const wrapped = doc.splitTextToSize(currentLine, 160);
            for (const wl of wrapped) {
              if (y > 275) {
                doc.addPage();
                y = 20;
              }
              doc.text(wl, 25, y);
              y += 7;
            }
          } else if (currentLine === "") {
            y += 4;
          } else {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(51, 65, 85);
            const wrapped = doc.splitTextToSize(currentLine, 170);
            for (const wl of wrapped) {
              if (y > 275) {
                doc.addPage();
                y = 20;
              }
              doc.text(wl, 20, y);
              y += 7;
            }
          }
        }
      } else if (activeTool === 'resume') {

        // ── Helper: render experience lines shared across designs ──
        const renderExpLines = (doc: jsPDF, expText: string, startY: number, bulletColor: [number,number,number], titleColor: [number,number,number], indent: number, maxW: number): number => {
          let y = startY;
          for (const line of expText.split("\n")) {
            if (y > 275) { doc.addPage(); y = 20; }
            const cl = line.trim();
            if (cl.startsWith("-") || cl.startsWith("*")) {
              doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
              doc.setTextColor(...bulletColor);
              const wrapped = doc.splitTextToSize("• " + cl.substring(1).trim(), maxW);
              for (const wb of wrapped) {
                if (y > 275) { doc.addPage(); y = 20; }
                doc.text(wb, indent + 4, y); y += 4.8;
              }
            } else if (cl !== "") {
              doc.setFont("helvetica", "bold"); doc.setFontSize(9);
              doc.setTextColor(...titleColor);
              doc.text(cl, indent, y); y += 5.5;
            } else { y += 3; }
          }
          return y;
        };

        // ── Helper: render skill chips shared across designs ──
        const renderSkillChips = (doc: jsPDF, skills: string, startY: number, startX: number, fillRgb: [number,number,number], borderRgb: [number,number,number], textRgb: [number,number,number]): number => {
          let y = startY; let sX = startX;
          doc.setFont("helvetica", "bold"); doc.setFontSize(7);
          for (const sk of skills.split(",").map(s => s.trim()).filter(Boolean)) {
            const skW = Math.max(18, sk.length * 2.4 + 8);
            if (sX + skW > 192) { sX = startX; y += 11; }
            doc.setFillColor(...fillRgb);
            doc.roundedRect(sX, y - 4, skW, 8, 2, 2, "F");
            doc.setDrawColor(...borderRgb); doc.setLineWidth(0.3);
            doc.roundedRect(sX, y - 4, skW, 8, 2, 2, "S");
            doc.setTextColor(...textRgb);
            doc.text(sk.toUpperCase(), sX + skW / 2, y + 1.5, { align: "center" });
            sX += skW + 4;
          }
          return y + 14;
        };

        // ═══════════════════════════════════════════════════════════════
        // DESIGN ROUTER — pick layout by selected template
        // ═══════════════════════════════════════════════════════════════

        if (selectedPdfTemplate === 'software') {
          // ╔══════════════════════════════════════════════════════════╗
          // ║  TEMPLATE 1 — CYBERPUNK TECH  (dark + neon cyan)        ║
          // ╚══════════════════════════════════════════════════════════╝
          // BG: deep black-blue
          doc.setFillColor(5, 10, 20); doc.rect(0, 0, 210, 297, "F");
          // Neon cyan left bar
          doc.setFillColor(0, 210, 255); doc.rect(0, 0, 8, 297, "F");
          // Top neon grid lines
          doc.setDrawColor(0, 210, 255); doc.setLineWidth(0.3);
          for (let i = 0; i < 8; i++) { doc.line(8, 20 + i * 4, 210, 20 + i * 4); }
          // Diagonal accent
          doc.setDrawColor(0, 180, 220); doc.setLineWidth(1.5);
          doc.line(8, 60, 210, 60);
          // Glowing rect top-right corner
          doc.setFillColor(0, 40, 60); doc.rect(140, 0, 70, 60, "F");
          doc.setDrawColor(0, 210, 255); doc.setLineWidth(0.5);
          doc.rect(140, 0, 70, 60, "S");
          // Name
          doc.setFont("helvetica", "bold"); doc.setFontSize(26);
          doc.setTextColor(0, 210, 255);
          doc.text(resumeData.name, 20, 42);
          // Role badge
          doc.setFillColor(0, 60, 80);
          doc.roundedRect(20, 50, 110, 9, 1.5, 1.5, "F");
          doc.setFont("helvetica", "bold"); doc.setFontSize(8);
          doc.setTextColor(0, 210, 255);
          doc.text(resumeData.title.toUpperCase(), 23, 56.5);
          // Summary section
          doc.setDrawColor(0, 210, 255); doc.setLineWidth(0.8); doc.line(20, 75, 190, 75);
          doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(0, 210, 255);
          doc.text("// PROFILE.init()", 20, 73);
          doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(150, 220, 240);
          let y = 83;
          for (const l of doc.splitTextToSize(resumeData.summary, 172)) { doc.text(l, 20, y); y += 5; }
          // Experience
          y += 6;
          doc.setDrawColor(0, 210, 255); doc.setLineWidth(0.8); doc.line(20, y, 190, y); y += 6;
          doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(0, 210, 255);
          doc.text("// EXPERIENCE.log()", 20, y - 2);
          y = renderExpLines(doc, resumeData.experience, y + 2, [100, 200, 220], [0, 180, 255], 20, 168);
          // Skills
          if (y > 258) { doc.addPage(); doc.setFillColor(5, 10, 20); doc.rect(0,0,210,297,"F"); doc.setFillColor(0,210,255); doc.rect(0,0,8,297,"F"); y = 20; }
          doc.setDrawColor(0, 210, 255); doc.setLineWidth(0.8); doc.line(20, y, 190, y); y += 6;
          doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(0, 210, 255);
          doc.text("// SKILLS.map()", 20, y - 2); y += 2;
          y = renderSkillChips(doc, resumeData.skills, y, 20, [0, 30, 50], [0, 210, 255], [0, 210, 255]);
          // Footer
          doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor(0, 100, 130);
          doc.text("OMNIAI PDF STUDIO  |  CYBERPUNK RESUME v2.0", 20, 290);

        } else if (selectedPdfTemplate === 'product') {
          // ╔══════════════════════════════════════════════════════════╗
          // ║  TEMPLATE 2 — CORPORATE CLEAN  (white + deep purple)    ║
          // ╚══════════════════════════════════════════════════════════╝
          // Clean white background
          doc.setFillColor(248, 247, 255); doc.rect(0, 0, 210, 297, "F");
          // Bold purple header band
          doc.setFillColor(79, 46, 155); doc.rect(0, 0, 210, 70, "F");
          // Diagonal cut
          doc.setFillColor(248, 247, 255);
          doc.triangle(0, 55, 210, 55, 210, 75, "F");
          // Purple left sidebar (full height)
          doc.setFillColor(245, 243, 255); doc.rect(0, 0, 55, 297, "F");
          doc.setFillColor(79, 46, 155); doc.rect(0, 0, 55, 70, "F");
          // Name on header (right side)
          doc.setFont("helvetica", "bold"); doc.setFontSize(22);
          doc.setTextColor(255, 255, 255);
          doc.text(resumeData.name, 65, 30);
          doc.setFont("helvetica", "normal"); doc.setFontSize(10);
          doc.setTextColor(210, 195, 255);
          doc.text(resumeData.title, 65, 42);
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
          doc.setTextColor(180, 165, 230);
          doc.text("contact@omniai.io  |  (303) 555-0199  |  San Francisco, CA", 65, 52);
          // Sidebar sections
          let sy = 90;
          const drawSideLabel = (label: string) => {
            doc.setFillColor(79, 46, 155); doc.roundedRect(4, sy - 5, 47, 8, 1.5, 1.5, "F");
            doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(255, 255, 255);
            doc.text(label, 27, sy + 1, { align: "center" }); sy += 10;
          };
          drawSideLabel("CORE SKILLS");
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(60, 40, 120);
          for (const sk of resumeData.skills.split(",").map(s => s.trim()).filter(Boolean).slice(0, 10)) {
            doc.setFillColor(220, 210, 255); doc.roundedRect(4, sy - 3.5, 47, 7, 1, 1, "F");
            doc.text(sk, 27, sy + 1, { align: "center" }); sy += 9;
          }
          // Main content area
          let y = 82;
          const drawMainSection = (label: string) => {
            doc.setDrawColor(79, 46, 155); doc.setLineWidth(1.5); doc.line(60, y + 2, 60, y + 10);
            doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(79, 46, 155);
            doc.text(label, 65, y + 8); y += 14;
            doc.setDrawColor(200, 190, 240); doc.setLineWidth(0.3); doc.line(65, y - 4, 195, y - 4);
          };
          drawMainSection("PROFESSIONAL SUMMARY");
          doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(55, 55, 75);
          for (const l of doc.splitTextToSize(resumeData.summary, 125)) { doc.text(l, 65, y); y += 5; }
          y += 5;
          drawMainSection("EXPERIENCE");
          y = renderExpLines(doc, resumeData.experience, y, [70, 70, 90], [79, 46, 155], 65, 128);
          // Footer
          doc.setFont("helvetica", "bold"); doc.setFontSize(6); doc.setTextColor(150, 130, 200);
          doc.text("OMNIAI PDF STUDIO  |  CORPORATE RESUME", 195, 292, { align: "right" });

        } else if (selectedPdfTemplate === 'designer') {
          // ╔══════════════════════════════════════════════════════════╗
          // ║  TEMPLATE 3 — CREATIVE SPLIT  (pink gradient + white)   ║
          // ╚══════════════════════════════════════════════════════════╝
          // Left pink panel
          doc.setFillColor(220, 38, 127); doc.rect(0, 0, 75, 297, "F");
          // Right white
          doc.setFillColor(255, 255, 255); doc.rect(75, 0, 135, 297, "F");
          // Pink right edge accent
          doc.setFillColor(253, 164, 175); doc.rect(205, 0, 5, 297, "F");
          // Pink panel top circles
          doc.setFillColor(236, 72, 153); doc.circle(37, 30, 25, "F");
          doc.setFillColor(190, 24, 93); doc.circle(37, 30, 18, "F");
          // Initials in circle
          doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(255, 255, 255);
          const initials = resumeData.name.split(" ").map((w: string) => w[0]).join("").slice(0,2);
          doc.text(initials, 37, 35, { align: "center" });
          // Name in left panel
          doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
          let nameLines = doc.splitTextToSize(resumeData.name, 62);
          let lsy = 62;
          for (const nl of nameLines) { doc.text(nl, 37, lsy, { align: "center" }); lsy += 8; }
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(252, 200, 220);
          doc.text(resumeData.title, 37, lsy + 2, { align: "center" });
          // Left sidebar labels
          let sy = 96;
          const pinkLabel = (txt: string) => {
            doc.setFillColor(255, 255, 255); doc.setDrawColor(255, 255, 255); doc.setLineWidth(0.5);
            doc.line(10, sy, 65, sy); sy += 8;
            doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255);
            doc.text(txt, 37, sy - 2, { align: "center" }); sy += 4;
          };
          pinkLabel("CONTACT");
          doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(252, 200, 220);
          doc.text("hello@ananya.design", 37, sy, { align: "center" }); sy += 5;
          doc.text("+91 98765 43210", 37, sy, { align: "center" }); sy += 5;
          doc.text("Bengaluru, India", 37, sy, { align: "center" }); sy += 10;
          pinkLabel("TOOLS");
          for (const sk of resumeData.skills.split(",").map((s: string) => s.trim()).slice(0, 8)) {
            doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(255, 255, 255);
            doc.setFillColor(180, 20, 100); doc.roundedRect(6, sy - 4, 62, 7, 1.5, 1.5, "F");
            doc.text(sk, 37, sy + 1, { align: "center" }); sy += 9;
          }
          // Right panel content
          let y = 20;
          const pinkSection = (label: string) => {
            doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(220, 38, 127);
            doc.text(label, 85, y); y += 3;
            doc.setDrawColor(220, 38, 127); doc.setLineWidth(1); doc.line(85, y, 200, y); y += 7;
          };
          pinkSection("ABOUT ME");
          doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(55, 55, 65);
          for (const l of doc.splitTextToSize(resumeData.summary, 115)) { doc.text(l, 85, y); y += 5; }
          y += 6;
          pinkSection("EXPERIENCE");
          y = renderExpLines(doc, resumeData.experience, y, [90, 60, 80], [200, 30, 100], 85, 115);
          doc.setFont("helvetica", "bold"); doc.setFontSize(5.5); doc.setTextColor(200, 150, 180);
          doc.text("OMNIAI PDF STUDIO  |  CREATIVE RESUME", 200, 292, { align: "right" });

        } else if (selectedPdfTemplate === 'data') {
          // ╔══════════════════════════════════════════════════════════╗
          // ║  TEMPLATE 4 — DARK ANALYTICS  (charcoal + amber/gold)   ║
          // ╚══════════════════════════════════════════════════════════╝
          // Dark charcoal BG
          doc.setFillColor(18, 18, 24); doc.rect(0, 0, 210, 297, "F");
          // Amber top header strip
          doc.setFillColor(245, 158, 11); doc.rect(0, 0, 210, 50, "F");
          // Dark overlay bottom of header
          doc.setFillColor(18, 18, 24); doc.rect(0, 40, 210, 15, "F");
          // Bar chart decorative element (top right)
          doc.setFillColor(120, 80, 0);
          const bars = [20, 35, 28, 40, 32, 38];
          let bx = 148;
          for (const bh of bars) {
            doc.rect(bx, 50 - bh, 8, bh, "F");
            bx += 10;
          }
          // Name
          doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(18, 18, 24);
          doc.text(resumeData.name, 15, 30);
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60, 40, 0);
          doc.text(resumeData.title, 15, 40);
          // Amber accent line
          doc.setDrawColor(245, 158, 11); doc.setLineWidth(1.5); doc.line(15, 58, 195, 58);
          // Contact row
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(200, 180, 100);
          doc.text("rohan.verma@datasci.io  |  +91 65432 10987  |  Hyderabad, India", 15, 66);
          // Sections
          let y = 78;
          const amberSection = (label: string) => {
            doc.setFillColor(40, 32, 8); doc.rect(15, y - 5, 180, 10, "F");
            doc.setDrawColor(245, 158, 11); doc.setLineWidth(2); doc.line(15, y - 5, 15, y + 5);
            doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(245, 158, 11);
            doc.text(label, 20, y + 2); y += 12;
          };
          amberSection("PROFILE OVERVIEW");
          doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(200, 190, 160);
          for (const l of doc.splitTextToSize(resumeData.summary, 172)) { doc.text(l, 15, y); y += 5; }
          y += 6;
          amberSection("WORK EXPERIENCE");
          y = renderExpLines(doc, resumeData.experience, y, [180, 160, 100], [245, 158, 11], 15, 172);
          if (y > 252) { doc.addPage(); doc.setFillColor(18, 18, 24); doc.rect(0,0,210,297,"F"); y = 20; }
          amberSection("TECHNICAL STACK");
          y = renderSkillChips(doc, resumeData.skills, y, 15, [35, 28, 6], [245, 158, 11], [245, 158, 11]);
          doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor(80, 65, 20);
          doc.text("OMNIAI PDF STUDIO  |  ANALYTICS RESUME", 15, 292);

        } else if (selectedPdfTemplate === 'marketing') {
          // ╔══════════════════════════════════════════════════════════╗
          // ║  TEMPLATE 5 — BOLD MARKETING  (orange burst + white)    ║
          // ╚══════════════════════════════════════════════════════════╝
          // White base
          doc.setFillColor(255, 255, 255); doc.rect(0, 0, 210, 297, "F");
          // Bold orange top bar
          doc.setFillColor(234, 88, 12); doc.rect(0, 0, 210, 80, "F");
          // Orange angled bottom edge
          doc.setFillColor(255, 255, 255); doc.triangle(0, 70, 210, 50, 210, 80, "F");
          // Large circle decoration top-right
          doc.setFillColor(251, 146, 60); doc.circle(185, 15, 35, "F");
          doc.setFillColor(234, 88, 12); doc.circle(185, 15, 22, "F");
          // Accent bottom stripe
          doc.setFillColor(234, 88, 12); doc.rect(0, 287, 210, 10, "F");
          // Name
          doc.setFont("helvetica", "bold"); doc.setFontSize(26); doc.setTextColor(255, 255, 255);
          doc.text(resumeData.name, 15, 32);
          doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(254, 215, 170);
          doc.text(resumeData.title.toUpperCase(), 15, 44);
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(255, 210, 180);
          doc.text("sneha.kapoor@growthlab.io  |  +91 54321 09876  |  Mumbai, India", 15, 54);
          // Content
          let y = 88;
          const orangeSection = (label: string) => {
            doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.setTextColor(234, 88, 12);
            doc.text(label, 15, y);
            doc.setDrawColor(234, 88, 12); doc.setLineWidth(0.5); doc.line(15, y + 2, 195, y + 2);
            y += 10;
          };
          orangeSection("PROFESSIONAL SUMMARY");
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(55, 40, 30);
          for (const l of doc.splitTextToSize(resumeData.summary, 178)) { doc.text(l, 15, y); y += 5.2; }
          y += 7;
          orangeSection("EXPERIENCE");
          y = renderExpLines(doc, resumeData.experience, y, [90, 60, 40], [200, 70, 10], 15, 175);
          if (y > 252) { doc.addPage(); doc.setFillColor(255,255,255); doc.rect(0,0,210,297,"F"); doc.setFillColor(234,88,12); doc.rect(0,287,210,10,"F"); y = 15; }
          orangeSection("SKILLS & TOOLS");
          y = renderSkillChips(doc, resumeData.skills, y, 15, [255, 237, 213], [234, 88, 12], [180, 60, 5]);
          doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); doc.setTextColor(255, 255, 255);
          doc.text("OMNIAI PDF STUDIO  |  MARKETING RESUME", 105, 292, { align: "center" });

        } else {
          // ╔══════════════════════════════════════════════════════════╗
          // ║  TEMPLATE 6 — EXECUTIVE PREMIUM  (near-black + gold)    ║
          // ╚══════════════════════════════════════════════════════════╝
          // Near-black base
          doc.setFillColor(12, 14, 20); doc.rect(0, 0, 210, 297, "F");
          // Gold top accent full width
          doc.setFillColor(180, 140, 40); doc.rect(0, 0, 210, 4, "F");
          // Premium header box
          doc.setFillColor(20, 22, 32); doc.rect(0, 4, 210, 80, "F");
          doc.setDrawColor(180, 140, 40); doc.setLineWidth(0.4);
          doc.rect(10, 8, 190, 72, "S");
          // Gold decorative lines
          doc.setDrawColor(180, 140, 40); doc.setLineWidth(0.8);
          doc.line(10, 84, 200, 84);
          doc.line(10, 87, 200, 87);
          // Name (centered, gold)
          doc.setFont("helvetica", "bold"); doc.setFontSize(28); doc.setTextColor(210, 170, 60);
          doc.text(resumeData.name, 105, 42, { align: "center" });
          // Thin gold underline under name
          doc.setDrawColor(210, 170, 60); doc.setLineWidth(0.6);
          doc.line(40, 46, 170, 46);
          // Title
          doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(190, 180, 140);
          doc.text(resumeData.title.toUpperCase(), 105, 56, { align: "center" });
          // Contact row
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(130, 115, 80);
          doc.text("vikram.nair@execleader.io  •  +91 43210 98765  •  New Delhi, India", 105, 68, { align: "center" });
          // Sections
          let y = 98;
          const goldSection = (label: string) => {
            doc.setFillColor(22, 24, 35); doc.rect(10, y - 6, 190, 11, "F");
            doc.setFillColor(210, 170, 60); doc.rect(10, y - 6, 3, 11, "F");
            doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(210, 170, 60);
            doc.text(label, 18, y + 2); y += 14;
          };
          goldSection("EXECUTIVE PROFILE");
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(180, 170, 140);
          for (const l of doc.splitTextToSize(resumeData.summary, 172)) { doc.text(l, 15, y); y += 5.2; }
          y += 6;
          goldSection("LEADERSHIP EXPERIENCE");
          y = renderExpLines(doc, resumeData.experience, y, [150, 135, 100], [210, 170, 60], 15, 172);
          if (y > 252) { doc.addPage(); doc.setFillColor(12,14,20); doc.rect(0,0,210,297,"F"); doc.setFillColor(180,140,40); doc.rect(0,0,210,4,"F"); y = 20; }
          goldSection("EXECUTIVE COMPETENCIES");
          y = renderSkillChips(doc, resumeData.skills, y, 15, [22, 24, 35], [210, 170, 60], [210, 170, 60]);
          // Gold bottom bar
          doc.setFillColor(180, 140, 40); doc.rect(0, 290, 210, 7, "F");
          doc.setFont("helvetica", "bold"); doc.setFontSize(6); doc.setTextColor(12, 14, 20);
          doc.text("OMNIAI PDF STUDIO  |  EXECUTIVE RESUME", 105, 295, { align: "center" });
        }
      } else if (activeTool === 'image' && uploadedFiles.length > 0) {
        // Image Compilation
        let isFirst = true;
        for (const file of uploadedFiles) {
          if (!isFirst) {
            doc.addPage();
          }
          isFirst = false;
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`OMNIAI IMAGE TO PDF | ${file.name.toUpperCase()}`, 20, 15);
          
          if (file.previewUrl) {
            try {
              const dataUrl = await loadImageAsDataURL(file.previewUrl);
              doc.addImage(dataUrl, "JPEG", 20, 25, 170, 220, undefined, "FAST");
            } catch (err) {
              console.error("Failed to load image, using placeholder", err);
              drawPlaceholderPage(doc, file);
            }
          } else {
            drawPlaceholderPage(doc, file);
          }
        }
      } else {
        // Generic / Merge Conversion
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("OMNIAI PDF CONVERSION PORTAL", 105, 40, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`COMPILED DATE: ${new Date().toLocaleString()}`, 105, 50, { align: "center" });
        doc.text(`TOOL CATEGORY: ${activeTool?.toUpperCase() || 'GENERAL'}`, 105, 56, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Successfully Synced Assets stack:", 20, 80);

        let y = 92;
        if (uploadedFiles.length > 0) {
          uploadedFiles.forEach((f, i) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.setFont("helvetica", "normal");
            doc.text(`${i + 1}. ${f.name} - ${(f.size / 1024 / 1024).toFixed(2)} MB (Vector)`, 25, y);
            y += 8;
          });
        } else {
          doc.setFont("helvetica", "italic");
          doc.text("No external assets uploaded. Synthesized standalone vector envelope.", 25, y);
        }
      }

      // Download the actual file buffer
      doc.save(`omniai_dossier_${activeTool || 'document'}.pdf`);
    });
  };

  // Trigger Share popup
  const shareTrigger = () => {
    setShowShareModal(true);
    setShareSuccess(false);
  };

  const executeShareLink = () => {
    setShareSuccess(true);
    setTimeout(() => setShowShareModal(false), 2000);
  };

  // AI PDF Generation Core
  const executeAIGeneration = async () => {
    if (!aiTopic.trim()) return;

    setIsProcessing(true);
    setProcessPercent(10);
    setProcessStep("Triggering n8n Core vector pipeline...");

    try {
      // Simulate real-time prompt feedback latency
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessPercent(30);
      setProcessStep("Querying Google Gemini model layers...");

      const promptMsg = `Generate professional ${aiDocType.replace('_', ' ')} layout on: "${aiTopic}". Content tone: ${aiTone}. Length: ${aiLength} pages.`;
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptMsg }]
        }),
      });

      const data = await res.json();
      setProcessPercent(70);
      setProcessStep("Compiling PDF metadata nodes...");
      
      let finalContent = "";
      if (res.ok && data.content && !data.content.includes("Neural link offline")) {
        finalContent = data.content;
      } else {
        // Dynamic simulated high-quality report template fallback
        await new Promise(resolve => setTimeout(resolve, 1000));
        finalContent = `### NEURAL COGNITIVE DOSSIER: ${aiTopic.toUpperCase()}
Document Class: ${aiDocType.toUpperCase()} | Model Tone: ${aiTone.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}

#### 1. EXECUTIVE METRIC SUMMARY
OmniAI PDF Architect has successfully synthesized the reference outline for "${aiTopic}". Based on strategic predictive models, scaling this framework yields exceptional operational density and reduces interface friction by 40% across Q3 and Q4 cycles.

#### 2. SYSTEM ARCHITECTURE & INTEGRATION VECTORS
* **Central Processor Node**: Dynamic multi-modal routing engine.
* **Chronological Sync Core**: Direct encryption pipeline preserving data sovereignty.
* **Vector Vault Sync**: Seamless LocalStorage bridging supporting instant backup retrievals.

#### 3. PRAGMATIC PROJECT RECOMMENDATIONS
1. Deconstruct monolithic modules into reusable custom hooks (e.g. useDebounce, useInfiniteScroll).
2. Integrate secure transaction checkpoints using local UPI or cash verification models.
3. Replace high-cost image generators with local pre-curated fallback libraries to establish 100% visual uptime.`;
      }

      setProcessPercent(100);
      setProcessStep("Synthesized AI PDF successfully!");
      await new Promise(resolve => setTimeout(resolve, 400));
      setGeneratedDocContent(finalContent);
      
      // Save generation activity in user's vault
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        action: 'AI PDF',
        fileName: `ai_${aiDocType}_${Math.floor(Math.random() * 1000)}.pdf`,
        fileSize: '1.4 MB',
        time: 'Just now',
        status: 'completed'
      };
      setActivityLogs(prev => [newLog, ...prev]);

    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset tool
  const resetWorkspace = () => {
    setUploadedFiles([]);
    setGeneratedDocContent(null);
    setActivePage(1);
  };

  // Tools configuration grid definitions
  const tools = [
    { id: 'image', title: 'Image to PDF', desc: 'Convert multiple PNG, JPG, and WebP graphics into clean, structured PDF documents.', icon: FileImage, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { id: 'merge', title: 'Merge PDF', desc: 'Combine multiple PDF files in any order to form a singular unified layout asset.', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { id: 'split', title: 'Split PDF', desc: 'Extract specific page ranges or split a larger document into standalone PDF chapters.', icon: Scissors, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { id: 'compress', title: 'Compress PDF', desc: 'Reduce file byte size dynamically while preserving perfect text and image resolution.', icon: FileArchive, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { id: 'ai', title: 'AI PDF Generator', desc: 'Enter any topic to automatically draft, structure, and synthesize a professional document.', icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    { id: 'resume', title: 'Resume Builder', desc: 'Enter your credentials to synthesize an ATS-optimized, high-fidelity professional resume.', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
  ];

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 relative text-white pb-10">
      
      {/* ── Active Processing Loader HUD Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] backdrop-blur-md bg-black/60 flex items-center justify-center p-6"
          >
            <div className="glass-panel max-w-md w-full p-8 rounded-3xl border-[var(--accent-cyan)]/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] transition-all duration-300" style={{ width: `${processPercent}%` }} />
              <div className="w-16 h-16 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/40 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <RefreshCw size={28} className="text-[var(--accent-cyan)] animate-spin-slow" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-2">Neural Processing Node</h3>
              <p className="text-xs text-white/50 mb-6 font-mono h-5">{processStep}</p>
              
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] h-full transition-all duration-300" style={{ width: `${processPercent}%` }} />
              </div>
              <div className="text-[10px] font-mono text-[var(--accent-cyan)] font-black uppercase tracking-widest">{processPercent}% Synced</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share Confirmation Popup Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] backdrop-blur-md bg-black/50 flex items-center justify-center p-6"
          >
            <div className="glass-panel max-w-sm w-full p-6 rounded-2xl border-white/10 text-center">
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-4">Share Encrypted Document</h4>
              <p className="text-[11px] text-white/40 mb-6">Create a highly secure, time-expiring neural node link to share this PDF dossier.</p>
              
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl font-mono text-[10px] text-white/80 select-all truncate mb-6">
                https://omniai.io/d/share-{Math.floor(Math.random()*1000000)}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeShareLink}
                  className="flex-1 py-3 bg-gradient-to-r from-[var(--accent-cyan)] to-blue-600 hover:scale-[1.02] text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)]"
                >
                  {shareSuccess ? "Copied Node!" : "Copy Share Link"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Header Section ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5">
            <Sparkles size={14} className="text-[var(--accent-purple)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Intelligent PDF Engine</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
            OMNIAI PDF Studio<span className="text-[var(--accent-cyan)]">.</span>
          </h2>
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Merge, split, compress, and auto-generate highly professional, secure PDF layouts with fully accelerated AI compilation nodes.
          </p>
        </div>

        {activeTool && (
          <button 
            onClick={() => { setActiveTool(null); resetWorkspace(); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all self-start lg:self-center"
          >
            <ArrowLeft size={14} /> Back to Tool Matrix
          </button>
        )}
      </div>

      {/* ── MAIN STUDIO INTERFACE ─────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-8 items-stretch">
        
        {/* Left Interactive Operations Column */}
        <div className="flex-1 min-w-0 flex flex-col">
          
          <AnimatePresence mode="wait">
            {!activeTool ? (
              // 1. Tool grid selection
              <motion.div 
                key="matrix"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setActiveTool(tool.id)}
                    className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-[var(--accent-cyan)]/30 hover:shadow-[0_0_30px_rgba(0,209,255,0.15)] flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[220px]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)]/5 rounded-full blur-[40px] translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                    
                    <div>
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300 bg-[var(--accent-cyan)]/5 border-[var(--accent-cyan)]/10 group-hover:border-[var(--accent-cyan)]/30 ${tool.color}`}>
                        <tool.icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="text-lg font-black text-white mb-2">{tool.title}</h3>
                      <p className="text-[11px] text-white/40 leading-relaxed">{tool.desc}</p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-[var(--accent-cyan)] transition-colors">Launch Studio</span>
                      <ArrowRight size={14} className="text-white/20 group-hover:translate-x-1 group-hover:text-[var(--accent-cyan)] transition-all" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // 2. Active Tool Workstation
              <motion.div
                key="workstation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-panel rounded-3xl border border-white/5 p-8 flex flex-col flex-1 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-cyan)]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                {/* Active Tool Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      {React.createElement(tools.find(t => t.id === activeTool)?.icon || FileText, {
                        size: 16,
                        className: "text-[var(--accent-cyan)]"
                      })}
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white">
                        {tools.find(t => t.id === activeTool)?.title} Workstation
                      </h3>
                      <p className="text-[10px] text-white/40">Secure multi-threaded local node compiler</p>
                    </div>
                  </div>
                  <button 
                    onClick={resetWorkspace}
                    className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[9px] font-black uppercase hover:bg-white/10 transition-all text-white/60"
                  >
                    Reset Workspace
                  </button>
                </div>

                {/* --- IMAGE TO PDF & GENERAL UPLOAD WORKFLOW --- */}
                {(activeTool === 'image' || activeTool === 'merge' || activeTool === 'split' || activeTool === 'compress') && (
                  <div className="space-y-8 flex-1 flex flex-col">
                    
                    {/* Drag-and-drop file upload zone */}
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => handleFileUpload(e, true)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center min-h-[160px] ${
                        isDragOver 
                          ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5 shadow-[0_0_20px_rgba(0,209,255,0.1)]' 
                          : 'border-white/10 bg-black/20 hover:border-white/20'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFileUpload(e)}
                        multiple 
                        accept={activeTool === 'image' ? "image/*" : ".pdf"}
                        className="hidden" 
                      />
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-[var(--accent-cyan)]/30 transition-all mb-4">
                        <Upload size={20} className="text-white/40 group-hover:text-[var(--accent-cyan)] transition-colors" />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors mb-1">
                        Drag & Drop or Click to Select File
                      </h4>
                      <p className="text-[10px] text-white/30">
                        {activeTool === 'image' ? 'Supports PNG, JPEG, WebP (Max 25MB total)' : 'Supports PDF Documents (Max 100MB)'}
                      </p>
                    </div>

                    {/* Files Preview Grid */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">File Assets Stack ({uploadedFiles.length})</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {uploadedFiles.map((file, idx) => (
                            <div 
                              key={file.id} 
                              className="glass-panel p-4 rounded-2xl border border-white/5 relative flex flex-col justify-between group overflow-hidden min-h-[140px]"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="min-w-0">
                                  <h5 className="text-[11px] font-black truncate text-white/90">{file.name}</h5>
                                  <span className="text-[9px] font-mono text-white/30">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                <button 
                                  onClick={() => removeFile(file.id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 opacity-60 hover:opacity-100 hover:bg-red-500/20 transition-all shrink-0"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>

                              {/* Thumbnail Image preview if available */}
                              {file.previewUrl && (
                                <div className="w-full h-14 rounded-lg overflow-hidden border border-white/5 mt-2 bg-black/40">
                                  <img src={file.previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                </div>
                              )}

                              {/* Reorder items tools (Image to PDF or Merge) */}
                              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                                <span className="text-[9px] font-mono text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5 px-2 py-0.5 rounded">Page {idx + 1}</span>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => moveFileOrder(idx, 'left')}
                                    disabled={idx === 0}
                                    className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white font-black"
                                    title="Move Page Left"
                                  >
                                    &lt;
                                  </button>
                                  <button 
                                    onClick={() => moveFileOrder(idx, 'right')}
                                    disabled={idx === uploadedFiles.length - 1}
                                    className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white font-black"
                                    title="Move Page Right"
                                  >
                                    &gt;
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tool specific configurations (E.g. Margins, Compressions) */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/10 mt-auto">
                      <h4 className="text-xs font-black uppercase tracking-wider text-white/80 mb-6 flex items-center gap-2">
                        <Sliders size={14} className="text-[var(--accent-cyan)]" /> Document Node Configuration
                      </h4>
                      
                      {activeTool === 'image' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px]">
                          <div className="space-y-2">
                            <span className="font-black uppercase tracking-widest text-white/40">Orientation</span>
                            <div className="flex gap-2">
                              {['portrait', 'landscape'].map(mode => (
                                <button 
                                  key={mode}
                                  onClick={() => setSelectedOrientation(mode as any)}
                                  className={`flex-1 py-2 rounded-lg border text-center uppercase font-black transition-all ${
                                    selectedOrientation === mode 
                                      ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-white' 
                                      : 'border-white/5 bg-white/5 text-white/50'
                                  }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="font-black uppercase tracking-widest text-white/40">Page Size</span>
                            <div className="flex gap-2">
                              {['A4', 'Letter'].map(size => (
                                <button 
                                  key={size}
                                  onClick={() => setSelectedPageSize(size as any)}
                                  className={`flex-1 py-2 rounded-lg border text-center uppercase font-black transition-all ${
                                    selectedPageSize === size 
                                      ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-white' 
                                      : 'border-white/5 bg-white/5 text-white/50'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="font-black uppercase tracking-widest text-white/40">Margins</span>
                            <div className="flex gap-2">
                              {['none', 'thin', 'normal'].map(margin => (
                                <button 
                                  key={margin}
                                  onClick={() => setSelectedMargin(margin as any)}
                                  className={`flex-1 py-2 rounded-lg border text-center uppercase font-black transition-all ${
                                    selectedMargin === margin 
                                      ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-white' 
                                      : 'border-white/5 bg-white/5 text-white/50'
                                  }`}
                                >
                                  {margin}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTool === 'compress' && (
                        <div className="space-y-4 text-[10px]">
                          <span className="font-black uppercase tracking-widest text-white/40">Compression Level</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { id: 'extreme', l: 'Extreme Compression', desc: 'Saves maximum bytes, slightly lower graphics.' },
                              { id: 'recommended', l: 'Recommended', desc: 'Perfect balance of high resolution and compression density.' },
                              { id: 'low', l: 'Low Compression', desc: 'Highest resolution, larger document byte footprint.' }
                            ].map(level => (
                              <button 
                                key={level.id}
                                onClick={() => setSelectedCompression(level.id as any)}
                                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                                  selectedCompression === level.id 
                                    ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-white shadow-[0_0_15px_rgba(0,209,255,0.05)]' 
                                    : 'border-white/5 bg-white/5 text-white/60 hover:border-white/10'
                                }`}
                              >
                                <div>
                                  <div className="font-black uppercase tracking-wider mb-1">{level.l}</div>
                                  <div className="text-[9px] text-white/40 leading-relaxed font-light">{level.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => startProcessingPipeline(tools.find(t => t.id === activeTool)?.title || 'PDF Studio', () => {})}
                      disabled={uploadedFiles.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-[var(--accent-cyan)] to-blue-600 hover:scale-[1.01] active:scale-[0.99] transition-all text-xs font-black uppercase tracking-widest rounded-xl text-white shadow-[0_0_30px_rgba(0,209,255,0.2)] disabled:opacity-20 disabled:pointer-events-none mt-auto flex items-center justify-center gap-2"
                    >
                      <Check size={16} /> Compile & Generate PDF
                    </button>

                  </div>
                )}

                {/* --- AI PDF GENERATOR WORKFLOW --- */}
                {activeTool === 'ai' && (
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Core Topic & Specifications</label>
                      <textarea 
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="Describe the document you want the AI model to draft... (e.g. 'Comprehensive Q3 Marketing and Conversion Strategy Report for OMNIAI SaaS including UPI payments')"
                        className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-all resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px]">
                      <div className="space-y-2">
                        <label className="font-black uppercase tracking-widest text-white/40">Document Category</label>
                        <select 
                          value={aiDocType}
                          onChange={(e) => setAiDocType(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 focus:outline-none text-white focus:border-[var(--accent-cyan)]/50 cursor-pointer font-black uppercase"
                        >
                          <option value="business_report" className="bg-[#030014] text-white">Business Report</option>
                          <option value="research_paper" className="bg-[#030014] text-white">Research Paper</option>
                          <option value="study_notes" className="bg-[#030014] text-white">AI Study Notes</option>
                          <option value="documentation" className="bg-[#030014] text-white">Project Specs</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="font-black uppercase tracking-widest text-white/40">Model Tone</label>
                        <select 
                          value={aiTone}
                          onChange={(e) => setAiTone(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 focus:outline-none text-white focus:border-[var(--accent-cyan)]/50 cursor-pointer font-black uppercase"
                        >
                          <option value="technical" className="bg-[#030014] text-white">Technical Core</option>
                          <option value="formal" className="bg-[#030014] text-white">Formal executive</option>
                          <option value="futuristic" className="bg-[#030014] text-white">Futuristic Synth</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="font-black uppercase tracking-widest text-white/40">Document Length</label>
                        <select 
                          value={aiLength}
                          onChange={(e) => setAiLength(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 focus:outline-none text-white focus:border-[var(--accent-cyan)]/50 cursor-pointer font-black uppercase"
                        >
                          <option value="1-3" className="bg-[#030014] text-white">1 - 3 Pages</option>
                          <option value="4-7" className="bg-[#030014] text-white">4 - 7 Pages</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={executeAIGeneration}
                      disabled={!aiTopic.trim()}
                      className="w-full py-4 bg-gradient-to-r from-[var(--accent-cyan)] to-blue-600 hover:scale-[1.01] active:scale-[0.99] transition-all text-xs font-black uppercase tracking-widest rounded-xl text-white shadow-[0_0_30px_rgba(0,209,255,0.2)] disabled:opacity-20 disabled:pointer-events-none mt-auto flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} /> Synthesize Intelligent PDF
                    </button>
                  </div>
                )}

                {/* --- ATS RESUME PDF BUILDER WORKFLOW --- */}
                {activeTool === 'resume' && (
                  <div className="space-y-5 flex-1 flex flex-col">

                    {/* ── Template Picker ── */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Quick-Fill Templates</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {PDF_RESUME_TEMPLATES.map((tpl) => {
                          const isActive = selectedPdfTemplate === tpl.id;
                          return (
                            <motion.button
                              key={tpl.id}
                              type="button"
                              whileHover={{ y: -2, scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                setSelectedPdfTemplate(tpl.id);
                                setResumeData(tpl.data);
                              }}
                              className={`relative h-16 rounded-xl border overflow-hidden flex flex-col items-center justify-center gap-1 transition-all ${
                                isActive ? `${tpl.active}` : `${tpl.border} hover:border-white/30`
                              }`}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${tpl.color} ${isActive ? 'opacity-50' : 'opacity-20'} transition-opacity`} />
                              <span className="text-lg relative z-10 leading-none">{tpl.emoji}</span>
                              <span className={`text-[7.5px] font-black uppercase tracking-wider relative z-10 leading-none ${
                                isActive ? 'text-white' : 'text-white/50'
                              }`}>{tpl.label}</span>
                              {isActive && (
                                <span className="text-[6px] font-mono text-white/60 relative z-10 uppercase tracking-widest">✓ Applied</span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cover Page Preview Banner */}
                    <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-[#0a0a1e] via-[#1e0f3c] to-[#0a0a1e]">
                      {/* Left purple sidebar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                      {/* Decorative circle top-right */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-purple-600/30 blur-md" />
                      <div className="absolute bottom-2 left-4 w-10 h-10 rounded-full bg-purple-900/40 blur-sm" />

                      <div className="flex items-center gap-4 p-4 pl-5">
                        {/* Mini cover page mockup */}
                        <div className="shrink-0 w-12 h-16 rounded-md bg-[#0a0a1e] border border-purple-500/40 flex flex-col items-center justify-center gap-1 relative overflow-hidden shadow-lg">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-500" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600/50" />
                          <div className="w-4 h-0.5 bg-purple-400 rounded" />
                          <div className="w-5 h-0.5 bg-white/60 rounded" />
                          <div className="w-3 h-0.5 bg-purple-300/60 rounded" />
                          <div className="mt-1 px-1 py-0.5 rounded bg-purple-900/60 border border-purple-500/40">
                            <div className="w-5 h-0.5 bg-purple-400/80 rounded" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">Designed Cover Page Included</span>
                          </div>
                          <p className="text-[9px] text-white/50 leading-relaxed">
                            Your resume will include a premium dark-theme cover page with your name, title, summary, contact info, and skill tags — followed by the full CV content.
                          </p>
                        </div>

                        <div className="shrink-0 text-[8px] font-black uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-lg px-2 py-1 text-center">
                          2 Pages
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Full Name</label>
                        <input 
                          type="text" 
                          value={resumeData.name}
                          onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/50 font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Job Target</label>
                        <input 
                          type="text" 
                          value={resumeData.title}
                          onChange={(e) => setResumeData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Summary</label>
                      <textarea 
                        value={resumeData.summary}
                        onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                        className="w-full h-20 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/50 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Professional Experience</label>
                      <textarea 
                        value={resumeData.experience}
                        onChange={(e) => setResumeData(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full h-32 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/50 resize-none leading-relaxed font-mono text-[10px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Core Skills</label>
                      <input 
                        type="text" 
                        value={resumeData.skills}
                        onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/50"
                      />
                    </div>

                    <button 
                      onClick={() => startProcessingPipeline("Resume Builder", () => {})}
                      className="w-full py-4 bg-gradient-to-r from-[var(--accent-cyan)] to-blue-600 hover:scale-[1.01] active:scale-[0.99] transition-all text-xs font-black uppercase tracking-widest rounded-xl text-white shadow-[0_0_30px_rgba(0,209,255,0.2)] flex items-center justify-center gap-2 mt-auto"
                    >
                      <Check size={16} /> Compile & Generate Resume PDF
                    </button>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Real-time PDF Preview Sidebar Panel */}
        <div className="w-full xl:w-[480px] shrink-0 flex flex-col">
          <div className="glass-panel rounded-3xl border border-white/5 p-6 flex flex-col h-full bg-black/20 min-h-[580px] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-purple)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Eye size={12} className="text-[var(--accent-cyan)]" /> Real-time PDF Preview
              </h4>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))} 
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut size={12} />
                </button>
                <span className="text-[9px] font-mono text-white/40 w-10 text-center">{zoomLevel}%</span>
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(200, prev + 25))} 
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn size={12} />
                </button>
              </div>
            </div>

            {/* Simulated interactive PDF central viewer */}
            <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 overflow-hidden relative flex flex-col">
              
              {/* Page indicator overlay */}
              <div className="absolute top-4 right-4 z-20 px-2 py-1 bg-black/80 border border-white/10 rounded-lg text-[9px] font-mono text-white/60">
                Page {activePage} of {getPreviewPagesCount()}
              </div>

              {/* Render dynamic previews inside page layout */}
              <div className="flex-1 overflow-y-auto no-scrollbar flex items-center justify-center p-2">
                <motion.div 
                  key={`${activeTool}-${activePage}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: zoomLevel / 100 }}
                  className="w-full aspect-[1/1.414] bg-white text-black p-8 rounded-xl shadow-[0_15px_45px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 select-text"
                >
                  
                  {/* Watermark grid texture */}
                  <div className="absolute inset-0 bg-grid-color/2 opacity-[0.03] pointer-events-none" />

                  {/* PDF header layout */}
                  <div className="border-b border-black/10 pb-4 mb-4 flex justify-between items-center text-[8px] font-mono text-black/50 select-none">
                    <span className="font-bold">OMNIAI SYSTEM DOSSIER</span>
                    <span>SECURE BLOCKCHAIN HASH: 0x8B5CF6...</span>
                  </div>

                  {/* PDF Main Content Block */}
                  <div className="flex-1 min-w-0 text-[10px] leading-relaxed text-black/80">
                    
                    {activeTool === 'image' && uploadedFiles.length > 0 && uploadedFiles[activePage - 1] ? (
                      <div className="h-full flex flex-col gap-4">
                        <div className="h-3/4 w-full border border-black/5 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                          <img src={uploadedFiles[activePage - 1].previewUrl} alt="PDF preview page" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center font-bold text-[9px] font-mono text-black/60 truncate">
                          Image Asset: {uploadedFiles[activePage - 1].name}
                        </div>
                      </div>
                    ) : activeTool === 'ai' && generatedDocContent ? (
                      <div className="h-full flex flex-col justify-between font-light whitespace-pre-wrap font-sans text-[7px] leading-relaxed">
                        {activePage === 1 ? (
                          generatedDocContent.split('\n\n').slice(0, 3).join('\n\n')
                        ) : (
                          generatedDocContent.split('\n\n').slice(3).join('\n\n') || "END OF DOCUMENT NODE VECTOR."
                        )}
                      </div>
                    ) : activeTool === 'resume' ? (
                      <div className="h-full flex flex-col justify-between text-[7px] leading-normal font-sans text-black/90">
                        <div>
                          <div className="text-center font-bold text-[12px] tracking-widest">{resumeData.name}</div>
                          <div className="text-center italic text-black/60 border-b border-black/10 pb-3 mb-3">{resumeData.title}</div>
                          
                          <div className="mb-4">
                            <div className="font-bold uppercase text-[7px] tracking-wider border-b border-black/5 pb-1 mb-1.5 text-blue-700">Executive Summary</div>
                            <p className="font-light">{resumeData.summary}</p>
                          </div>

                          <div className="mb-4">
                            <div className="font-bold uppercase text-[7px] tracking-wider border-b border-black/5 pb-1 mb-1.5 text-blue-700">Professional Experience</div>
                            <pre className="font-sans whitespace-pre-wrap font-light text-[6px]">{resumeData.experience}</pre>
                          </div>

                          <div>
                            <div className="font-bold uppercase text-[7px] tracking-wider border-b border-black/5 pb-1 mb-1.5 text-blue-700">Key Technical Skills</div>
                            <p className="font-mono text-[6px] text-slate-800">{resumeData.skills}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Empty workspace placeholder
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-black/30">
                        <FileText size={48} className="stroke-[1] mb-4 text-black/20" />
                        <h4 className="text-xs font-bold mb-1">Dossier Workspace Empty</h4>
                        <p className="text-[8px] max-w-xs font-light">Select a tool on the left and prepare assets to synthesize the active preview buffer.</p>
                      </div>
                    )}

                  </div>

                  {/* PDF footer layout */}
                  <div className="border-t border-black/10 pt-4 flex justify-between items-center text-[7px] font-mono text-black/40 select-none">
                    <span>CONFIDENTIAL - SUBJECT TO ENCRYPTION</span>
                    <span>PAGE {activePage} OF {getPreviewPagesCount()}</span>
                  </div>

                </motion.div>
              </div>

              {/* Page navigation controls */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                <button 
                  onClick={() => setActivePage(prev => Math.max(1, prev - 1))}
                  disabled={activePage === 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft size={14} /> Prev Page
                </button>
                <button 
                  onClick={() => setActivePage(prev => Math.min(getPreviewPagesCount(), prev + 1))}
                  disabled={activePage === getPreviewPagesCount()}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                >
                  Next Page <ChevronRight size={14} />
                </button>
              </div>

            </div>

            {/* PDF Quick Action buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button 
                onClick={shareTrigger}
                disabled={activeTool === null && uploadedFiles.length === 0 && !generatedDocContent}
                className="py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest text-white/80 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <Share2 size={14} /> Share Document
              </button>
              <button 
                onClick={downloadTrigger}
                disabled={activeTool === null && uploadedFiles.length === 0 && !generatedDocContent}
                className="py-3.5 rounded-xl bg-gradient-to-r from-[var(--accent-purple)] to-purple-800 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(123,97,255,0.2)] disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ── FILE MANAGEMENT & RECENT HISTORY ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Dashboard / Recent files log */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
              <Clock size={16} className="text-[var(--accent-purple)]" /> Recent Compiled Documents
            </h3>
            
            <div className="space-y-4 max-h-[260px] overflow-y-auto no-scrollbar pr-2">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                      <FileDown size={18} />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-black text-white/90">{log.fileName}</h5>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-white/30">
                        <span>{log.action}</span>
                        <span>•</span>
                        <span>{log.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-white/40">{log.time}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Features / Storage gauges & Analytics */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
              <Activity size={16} className="text-[var(--accent-cyan)]" /> Admin PDF Analytics Node
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-6">
              
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between min-h-[110px]">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Vault Storage</div>
                <div className="text-xl font-black text-white py-2">2.1 GB <span className="text-white/30 text-[10px] font-light">/ 10GB</span></div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--accent-cyan)] h-full" style={{ width: '21%' }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between min-h-[110px]">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Active Compiler Threads</div>
                <div className="text-xl font-black text-[var(--accent-purple)] py-2">04 <span className="text-white/30 text-[10px] font-light">Online</span></div>
                <div className="flex items-center gap-1 justify-center text-[8px] font-mono text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Latency: 42ms
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between min-h-[110px]">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Total Compiled Dossiers</div>
                <div className="text-xl font-black text-white py-2">1,428 <span className="text-white/30 text-[10px] font-light">files</span></div>
                <div className="text-[8px] font-mono text-white/30">99.98% Compilation Success</div>
              </div>

            </div>

            {/* Neural system warning / operational log */}
            <div className="p-4 rounded-2xl bg-[var(--accent-cyan)]/5 border border-[var(--accent-cyan)]/15 text-[10px] leading-relaxed text-white/60 flex items-start gap-3">
              <AlertCircle size={16} className="text-[var(--accent-cyan)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--accent-cyan)] uppercase tracking-wider block mb-1">System Operational Dossier Log</span>
                Crypto compilation node stable. 1,428 secure document vectors exported successfully. Safe local storage vault backup is synchronized.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
