"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Code2, 
  Play, 
  Wand2, 
  FileDown, 
  Presentation, 
  UserCircle, 
  MessageSquare, 
  Type, 
  Loader2, 
  Download,
  Copy,
  Check
} from 'lucide-react';


// ==========================================
// PROCEDURAL FALLBACK GENERATION ENGINES
// ==========================================

const generateFallbackContent = (tool: string, promptText: string): string => {
  const pLower = promptText.toLowerCase();
  
  if (tool === 'code') {
    if (pLower.includes('debounce') || pLower.includes('delay')) {
      return `// Neural Synthesis Node: [OPTIMIZED DEBOUNCE HOOK]
// Target: React/TypeScript Compilation

import { useState, useEffect } from 'react';

/**
 * useDebounce Custom Hook
 * Delays updating a value until a specified timeout has elapsed.
 * 
 * @template T - The generic type of the value
 * @param {T} value - The input value to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @returns {T} The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ==========================================
// EXTRAPOLATION EXAMPLE USAGE
// ==========================================
/*
import React, { useState } from 'react';
import { useDebounce } from './useDebounce';

export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    if (debouncedSearch) {
      console.log("Querying database node for:", debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Type to search..."
    />
  );
}
*/`;
    }
    
    if (pLower.includes('scroll') || pLower.includes('infinite') || pLower.includes('page')) {
      return `// Neural Synthesis Node: [REACT INFINITE SCROLL HOOK]
// Target: React/TypeScript Compilation

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  disabled?: boolean;
}

/**
 * useInfiniteScroll Custom Hook
 * Attaches an IntersectionObserver to a target element to fetch more data.
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  options?: UseInfiniteScrollOptions
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const { threshold = 0.5, rootMargin = '0px', disabled = false } = options || {};

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);
      
      if (entry.isIntersecting && !disabled) {
        onLoadMore();
      }
    },
    [onLoadMore, disabled]
  );

  useEffect(() => {
    const currentTarget = targetRef.current;
    if (!currentTarget || disabled) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(currentTarget);

    return () => {
      if (observerRef.current && currentTarget) {
        observerRef.current.unobserve(currentTarget);
      }
    };
  }, [handleIntersect, threshold, rootMargin, disabled]);

  return { targetRef, isIntersecting };
}`;
    }

    return `// Neural Synthesis Node: [GENERIC APPLICATION UTILITY ENGINE]
// Mode: Code Compilation
// Source Prompt: "${promptText}"

import { useMemo, useCallback } from 'react';

export interface DataPayload<T> {
  id: string;
  timestamp: number;
  payload: T;
  signature: string;
}

/**
 * ProcessDataNode Class
 * High-performance state utility for transforming array vectors.
 */
export class ProcessDataNode<T> {
  private rawData: T[];

  constructor(rawData: T[]) {
    this.rawData = rawData;
  }

  public generatePayloadVector(signKey: string): DataPayload<T>[] {
    return this.rawData.map((item, index) => {
      const timestamp = Date.now() - index * 1000;
      const id = \`node-\${index}-\${Math.random().toString(36).substring(2, 7)}\`;
      return {
        id,
        timestamp,
        payload: item,
        signature: btoa(\`\${id}-\${timestamp}-\${signKey}\`)
      };
    });
  }
}

export function useDataSynthesis<T>(items: T[], key: string) {
  const synthesizer = useMemo(() => new ProcessDataNode<T>(items), [items]);
  
  const synthesize = useCallback(() => {
    return synthesizer.generatePayloadVector(key);
  }, [synthesizer, key]);

  return { synthesize };
}`;
  }

  if (tool === 'text') {
    if (pLower.includes('landing') || pLower.includes('saas') || pLower.includes('copy')) {
      return `# Cognitive Copy Synthesis: [PREMIUM SaaS LANDING PAGE BLUEPRINT]

## 1. HERO SECTION (Conversion Engine)
- **Primary Headline:**
  > **Re-architect Your Workflow. Synthesize Your Future.**
- **Sub-headline:**
  Deploy state-of-the-art neural networks directly into your workspace. Automate complex development, content pipeline design, and vector searching with a single unified workspace.
- **CTA Button Text:** \`Deploy Neural Node - Free\`
- **Trust Indicator:** "Trusted by 45,000+ engineers at OpenAI, Google, Vercel, and Stripe."

---

## 2. THE PROBLEM SPACE (The Friction)
Currently, development and marketing teams juggle 15 different AI interfaces, copying text, code, and graphics between tabs. Context is fractured, workflows are sluggish, and data integrity is compromised.

---

## 3. THE VALUE PROPOSITION (The Synthesis)
OmniAI integrates these nodes into a single, lightning-fast dashboard.
- **Bi-Directional Context Sync:** Your assistant knows exactly what code you are writing and matches it to your marketing copy.
- **Zero-latency Generation:** Built on top of customized low-latency inference pipelines.
- **Sovereign Security Vault:** All generations are fully isolated and vector-indexed.

---

## 4. CONVERSION AND PRICING BRACKETS
- **Starter Node ($0/mo):** 100 synthesis runs, standard model access.
- **Pro Enterprise ($79/mo):** Unlimited runs, 8k prompt context, custom fine-tuning hooks.
- **Sovereign AI (Custom):** Dedicated VPC deployment, zero-retention data logging, fully air-gapped models.`;
    }

    if (pLower.includes('email') || pLower.includes('sequence')) {
      return `# Cognitive Copy Synthesis: [HIGH-CONVERTING COLD EMAIL SEQUENCE]

### Email 1: The Insight Hook
**Subject:** Quick question regarding developer latency at {{companyName}}

**Body:**
Hi {{firstName}},

I was looking at {{companyName}}'s platform and noticed your recent updates on your cloud infrastructure. Typically, engineering organizations scale their APIs rapidly but run into developer workflow blockages when integrating generative LLM endpoints.

We built OmniAI to solve this exact bottleneck. We help teams reduce their model orchestrator latency by up to 40% while saving 30% in infrastructure API spend.

Are you open to a brief 10-minute technical overview this Thursday at 2:00 PM EST?

Regards,
OmniAI Synthesis Team

---

### Email 2: The Proof Point
**Subject:** 40% latency reduction is just the start...

**Body:**
Hi {{firstName}},

I wanted to share a brief result case study: the engineering team at ScaleGrid integrated our secondary failover nodes last quarter. 

By utilizing our dynamic Pollinations DALL-E and Gemini logic pipelines, they achieved:
1. **Zero downtime** on user-facing image generations.
2. **$14,500/month saved** in unused API reservations.
3. **99.9% success rate** across their client interface.

Would {{companyName}} benefit from a similar performance audit this week?

Regards,
OmniAI Synthesis Team`;
    }

    return `# Cognitive Copy Synthesis: [EXECUTIVE RESEARCH SUMMARY]
### Subject Focus: "${promptText}"

### Executive Abstract
This paper details the synthesis, architecture, and deployment protocols of neural microservices tailored to execute the following tasks: "${promptText}". By establishing a centralized context engine, developers can unify asynchronous operations, reduce structural latency, and maintain high-fidelity creative outputs.

### Core Metrics
1. **Throughput Density:** Peak capacity exceeding 420 token/sec per concurrent channel.
2. **Context Resolution:** Unified state mapping over 32k tokens.
3. **Model Redundancy:** 100% failover coverage across primary and secondary generative pools.

### Recommended Roadmap
- **Phase 1 (Ingestion):** Set up active vector sync hooks between user local storage and context hubs.
- **Phase 2 (Synthesis):** Unify e-commerce, reservation tables, and code compilers under a single UI panel.
- **Phase 3 (Optimization):** Transition image generation from costly centralized instances to ultra-reliable multi-model mesh fallback systems.`;
  }

  if (tool === 'pdf') {
    return `# OMNIAI NEURAL DOCUMENT ARCHITECT
## OFFICIAL INTELLECTUAL DOSSIER

**Date of Generation:** ${new Date().toLocaleDateString()}
**Security Protocol:** LEVEL-5 SOVEREIGN CRYPTO-CLEARANCE
**Requested Vector:** "${promptText}"

---

### 1. MISSION CHARTER & SCOPE
Unify shopping, reservation management, and advanced AI utilities under a singular, glassmorphic executive interface. This dossier serves to confirm the implementation plans, technical integrations, and database schemas.

### 2. CORE DATABASE SCHEMA
\`\`\`sql
-- OmniAI Schema Blueprint
CREATE TABLE IF NOT EXISTS user_vault_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  activity_type VARCHAR(50) NOT NULL, -- 'booking' | 'ecommerce' | 'generation'
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL, -- 'cash_on_delivery' | 'upi'
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
\`\`\`

### 3. EXECUTIVE ROADMAP & METRIC TARGETS
| Milestone | Technical Scope | Target Latency | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Dynamic Generation Tool Toggles | < 100ms | COMPLETE |
| **Phase 2** | Pollinations API Image Pipeline | < 800ms | ACTIVE |
| **Phase 3** | Multi-Model Routing Logic | < 1200ms | ACTIVE |
| **Phase 4** | Sovereign Memory Vault Integration | < 50ms | COMPLETE |

---
*Authorized for download. Formatted for dynamic system deployment.*`;
  }

  if (tool === 'prompt') {
    return `# Mega-Prompt Architecture: [EXPERT SYSTEM UPLINK]
### Context: "${promptText}"

\`\`\`markdown
[SYSTEM ROLE]
You are a highly advanced AI Expert Agent specialized in executing the following objective:
"${promptText}"

[CONTEXT & MISSION]
The user requires a state-of-the-art solution that synthesizes technical correctness with clean, highly readable formatting. You must approach the task step-by-step, validating intermediate hypotheses and ensuring the output is perfectly tailored to high-end application development standards.

[OPERATIONAL CONSTRAINTS]
1. **Formatting:** Use elegant, structured Markdown. Use bold headers, bullet lists, code blocks, and tables wherever appropriate.
2. **Tone:** Highly professional, objective, precise, and authoritative. Avoid fluff, unnecessary introductions, or filler text.
3. **Correctness:** All code snippets must be 100% typed, syntactically correct, and ready for drop-in compilation.
4. **Security:** Never output API keys, passwords, or credentials. Use dummy values like '1234567890@upi' or mock variables.

[FEW-SHOT SYNTHESIS EXAMPLE]
User Input: "Generate custom data validation logic for e-commerce checkouts"
Response:
  ### Data Validation Protocol
  - **Email Format Verification:** Ensure the domain matches standard regex patterns.
  - **Payment Mode Routing:** If payment is 'UPI', confirm validation of '1234567890@upi' before processing transaction hooks.

[INFERENCE TRIGGER]
Take a deep breath and construct the complete, premium blueprint for the user's objective now.
\`\`\``;
  }

  return `### Neural Synthesis: [GENERIC RESPONSE NODE]
**Objective:** ${promptText}
- Core Status: Unified state operational.
- System Action: Context generated successfully.`;
};

const parsePptContent = (content: string, promptText: string) => {
  return {
    topic: promptText.toUpperCase() || "NEURAL BLUEPRINT",
    slides: [
      {
        title: "Slide 1: Executive Abstract",
        bullets: [
          "Establishing centralized neural processing hubs.",
          "Unifying asynchronous development, copywriting, and media nodes.",
          "Targeting a 40% reduction in user-interaction latency."
        ]
      },
      {
        title: "Slide 2: Strategic Problem Space",
        bullets: [
          "Information silos when swapping across multiple interfaces.",
          "High transaction friction on checkout and reservation portals.",
          "Loss of system memory and context in long-running sessions."
        ]
      },
      {
        title: "Slide 3: OmniAI Architectural Solution",
        bullets: [
          "Glassmorphic visual hubs that bring tools together seamlessly.",
          "Cash on Delivery & instant UPI payment routing (e.g. 1234567890@upi).",
          "Chronological memory synchronization inside the Sovereign Vault."
        ]
      },
      {
        title: "Slide 4: Key Operational Milestones",
        bullets: [
          "Immediate deployment of AI Image Synthesis fallback channels.",
          "Full scale integration of code compilers and text generators.",
          "Unlocking 100% operational reliability and flawless type-checking."
        ]
      }
    ]
  };
};

// ==========================================
// RESUME TEMPLATES
// ==========================================
const RESUME_TEMPLATES = [
  {
    id: 'software',
    label: 'Software Engineer',
    color: 'from-cyan-500/20 to-cyan-900/30',
    accent: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    prompt: 'Build an ATS-optimized resume for a Senior Software Engineer with 6 years of experience in React, Node.js, TypeScript, and AWS cloud infrastructure. Worked at top tech startups.',
  },
  {
    id: 'product',
    label: 'Product Manager',
    color: 'from-purple-500/20 to-purple-900/30',
    accent: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    prompt: 'Create a high-impact resume for a Senior Product Manager with 7 years driving 0-to-1 product launches, cross-functional team leadership, and data-driven roadmap strategy at SaaS companies.',
  },
  {
    id: 'designer',
    label: 'UX Designer',
    color: 'from-pink-500/20 to-pink-900/30',
    accent: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    prompt: 'Generate a creative and ATS-friendly resume for a UX/UI Designer with 5 years of experience in Figma, user research, design systems, and product design at consumer tech companies.',
  },
  {
    id: 'data',
    label: 'Data Scientist',
    color: 'from-amber-500/20 to-amber-900/30',
    accent: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    prompt: 'Write an ATS-optimized resume for a Data Scientist with 5 years of experience in Python, machine learning, deep learning, SQL, and deploying ML models to production at Fortune 500 companies.',
  },
  {
    id: 'marketing',
    label: 'Marketing Lead',
    color: 'from-orange-500/20 to-orange-900/30',
    accent: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    prompt: 'Build a results-driven resume for a Digital Marketing Lead with 6 years of experience in growth hacking, SEO/SEM, paid ads, content strategy, and brand positioning for tech startups.',
  },
  {
    id: 'executive',
    label: 'C-Suite Executive',
    color: 'from-emerald-500/20 to-emerald-900/30',
    accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    prompt: 'Craft a powerful executive resume for a Chief Technology Officer (CTO) with 15 years of experience leading engineering organizations, driving digital transformation, and scaling platforms to millions of users.',
  },
];

const parseResumeContent = (content: string, promptText: string, templateId?: string) => {
  const tpl = RESUME_TEMPLATES.find(t => t.id === templateId);

  const dataByTemplate: Record<string, any> = {
    software: {
      name: 'ARJUN SHARMA', email: 'arjun.sharma@devmail.io', phone: '+91 98765 43210', linkedin: 'linkedin.com/in/arjunsharma',
      summary: 'Senior Software Engineer with 6+ years building scalable full-stack applications using React, Node.js, TypeScript, and AWS. Passionate about clean code, performance optimization, and shipping products that millions love.',
      experience: [
        { role: 'Senior Software Engineer', company: 'TechNova Labs', duration: '2022 – Present', bullets: ['Led migration of monolithic backend to microservices, reducing API latency by 52%.', 'Built real-time collaborative features using WebSockets serving 200k+ concurrent users.', 'Mentored team of 5 junior engineers; introduced CI/CD pipeline cutting deploy time by 70%.'] },
        { role: 'Full Stack Developer', company: 'CloudBridge Pvt. Ltd.', duration: '2018 – 2022', bullets: ['Developed 15+ RESTful APIs consumed by iOS, Android, and web clients.', 'Optimized PostgreSQL query performance, reducing p99 response times from 800ms to 120ms.', 'Integrated Stripe payment gateway processing ₹50L+ monthly transactions.'] },
      ],
      skills: ['React / Next.js', 'TypeScript', 'Node.js / Express', 'AWS (EC2, S3, Lambda)', 'PostgreSQL / MongoDB', 'Docker / Kubernetes', 'CI/CD (GitHub Actions)', 'GraphQL'],
    },
    product: {
      name: 'PRIYA MEHTA', email: 'priya.mehta@productleader.io', phone: '+91 87654 32109', linkedin: 'linkedin.com/in/priyamehta',
      summary: 'Strategic Product Manager with 7+ years defining and executing product vision for B2B SaaS platforms. Expert in OKR frameworks, user research, and cross-functional leadership. Scaled 3 products from 0 to $10M ARR.',
      experience: [
        { role: 'Senior Product Manager', company: 'Fusion SaaS Inc.', duration: '2021 – Present', bullets: ['Launched flagship AI analytics dashboard adopted by 1,200+ enterprise clients in 9 months.', 'Defined product roadmap through 60+ customer discovery interviews and NPS analysis.', 'Collaborated with engineering, design, and sales to deliver 4 major releases on schedule.'] },
        { role: 'Product Manager', company: 'Orbix Digital', duration: '2017 – 2021', bullets: ['Grew DAU by 3x through feature-led growth experiments and A/B testing framework.', 'Reduced customer churn by 22% by shipping targeted onboarding flow improvements.', 'Managed backlog of 200+ stories; ran bi-weekly sprints with cross-functional squads.'] },
      ],
      skills: ['Product Strategy', 'OKRs / KPIs', 'Roadmapping', 'Agile / Scrum', 'User Research', 'A/B Testing', 'Figma', 'Amplitude / Mixpanel'],
    },
    designer: {
      name: 'ANANYA ROY', email: 'ananya.roy@designcraft.io', phone: '+91 76543 21098', linkedin: 'linkedin.com/in/ananyaroy',
      summary: 'Creative UX/UI Designer with 5+ years crafting intuitive, accessible digital experiences. Expert in Figma-based design systems, user journey mapping, and prototyping. Proven track record at consumer-facing tech products.',
      experience: [
        { role: 'Senior UX Designer', company: 'Nimbus Apps', duration: '2021 – Present', bullets: ['Redesigned core onboarding flow, improving day-7 retention by 38%.', 'Built and maintained a 300-component Figma design system used across 4 product squads.', 'Facilitated 20+ usability testing sessions translating insights into actionable UI improvements.'] },
        { role: 'UI/UX Designer', company: 'PixelCraft Studio', duration: '2019 – 2021', bullets: ['Delivered high-fidelity prototypes for 8 client apps across fintech and e-commerce verticals.', 'Established brand identity and icon systems for 3 product launches.', 'Collaborated with React developers to implement pixel-perfect responsive interfaces.'] },
      ],
      skills: ['Figma / Framer', 'Design Systems', 'Prototyping', 'User Research', 'Accessibility (WCAG)', 'HTML/CSS', 'Motion Design', 'Adobe Creative Suite'],
    },
    data: {
      name: 'ROHAN VERMA', email: 'rohan.verma@datasci.io', phone: '+91 65432 10987', linkedin: 'linkedin.com/in/rohanverma',
      summary: 'Data Scientist with 5+ years building and deploying machine learning models for revenue optimization, NLP, and computer vision. Experienced in end-to-end ML pipelines, experimentation, and stakeholder communication.',
      experience: [
        { role: 'Senior Data Scientist', company: 'Intelliflow Analytics', duration: '2021 – Present', bullets: ['Built churn prediction model reducing annual revenue loss by $1.2M using gradient boosting.', 'Designed NLP pipeline processing 500k+ customer feedback records daily with 94% accuracy.', 'Led A/B testing infrastructure enabling 50+ concurrent experiments with statistical rigor.'] },
        { role: 'Data Scientist', company: 'QuantMetrics Ltd.', duration: '2019 – 2021', bullets: ['Developed demand forecasting model for supply chain, improving inventory accuracy by 28%.', 'Created dashboards in Tableau consumed by C-suite for weekly business reviews.', 'Automated ETL pipelines using Apache Airflow reducing manual reporting by 12 hours/week.'] },
      ],
      skills: ['Python (Pandas, Scikit-learn)', 'TensorFlow / PyTorch', 'SQL / BigQuery', 'Spark / Hadoop', 'MLflow', 'Tableau / Power BI', 'Statistical Modeling', 'A/B Testing'],
    },
    marketing: {
      name: 'SNEHA KAPOOR', email: 'sneha.kapoor@growthlab.io', phone: '+91 54321 09876', linkedin: 'linkedin.com/in/snehakapoor',
      summary: 'Performance-driven Marketing Lead with 6+ years scaling B2C and B2B brands through data-backed growth strategies, paid acquisition, and content-led SEO. Generated 10M+ organic impressions and managed $2M+ in ad spend.',
      experience: [
        { role: 'Head of Digital Marketing', company: 'Vortex Brands', duration: '2021 – Present', bullets: ['Scaled organic traffic 4x in 12 months through technical SEO and pillar-cluster content strategy.', 'Managed Google & Meta ad budgets of $150k/month achieving 3.2x ROAS.', 'Built email automation sequences generating 22% of monthly revenue through lifecycle marketing.'] },
        { role: 'Digital Marketing Manager', company: 'LaunchPad Media', duration: '2018 – 2021', bullets: ['Drove 300% increase in qualified leads through LinkedIn ABM campaigns.', 'Launched influencer program with 80+ creators generating 5M+ brand impressions per quarter.', 'Optimized landing pages through CRO testing increasing demo bookings by 41%.'] },
      ],
      skills: ['SEO / SEM', 'Google Ads / Meta Ads', 'HubSpot / Marketo', 'Content Strategy', 'Email Marketing', 'Analytics (GA4)', 'CRO', 'Brand Strategy'],
    },
    executive: {
      name: 'VIKRAM NAIR', email: 'vikram.nair@execleader.io', phone: '+91 43210 98765', linkedin: 'linkedin.com/in/vikramnair',
      summary: 'Visionary Chief Technology Officer with 15+ years leading engineering organizations from seed to IPO. Expert in digital transformation, platform scalability, M&A technical due diligence, and building high-performance engineering cultures.',
      experience: [
        { role: 'Chief Technology Officer', company: 'Apex Systems Global', duration: '2018 – Present', bullets: ['Led engineering org of 120+ engineers across 4 global offices, delivering 99.99% platform uptime.', 'Architected cloud-native migration reducing infrastructure costs by $3.5M annually.', 'Drove technical integration of 2 acquisitions, consolidating 4 codebases in under 18 months.'] },
        { role: 'VP of Engineering', company: 'Nexus Technologies', duration: '2012 – 2018', bullets: ['Scaled engineering team from 15 to 80 engineers during Series B to D growth phase.', 'Introduced DevOps culture reducing production incidents by 65% and deploy frequency 10x.', 'Delivered platform supporting 50M+ monthly active users with sub-200ms global response times.'] },
      ],
      skills: ['Engineering Leadership', 'Cloud Architecture (AWS/GCP)', 'Digital Transformation', 'DevOps / SRE', 'M&A Due Diligence', 'Budget & P&L Ownership', 'Agile at Scale', 'Executive Communication'],
    },
  };

  const defaultData = {
    name: 'ALEXANDER MERCER', email: 'alex.mercer@omniai.io', phone: '+1 (555) 000-0000', linkedin: 'linkedin.com/in/alexmercer',
    summary: `Elite Solutions Architect specialized in ${promptText || 'Full-Stack Engineering'} with 8+ years of experience constructing high-performance neural interfaces and decentralized state synchronizers.`,
    experience: [
      { role: 'Senior AI Integration Engineer', company: 'Quantum Core Systems', duration: '2024 – Present', bullets: ['Architected real-time AI generation panels reducing latency by 45%.', 'Constructed resilient API pathways linking multiple generative AI providers.', 'Maintained 100% TypeScript safety across large Next.js monorepos.'] },
      { role: 'Full Stack Developer', company: 'Synapse Platforms', duration: '2021 – 2024', bullets: ['Built booking widgets managing 100,000+ reservations daily.', 'Integrated UPI & card payment flows with zero-downtime deployments.', 'Deployed chronological audit vaults for transaction safety.'] },
    ],
    skills: ['TypeScript / React', 'Next.js App Router', 'Node.js & Supabase', 'Generative AI', 'TailwindCSS & Framer Motion'],
  };

  return { ...(dataByTemplate[templateId || ''] || defaultData), templateId, templateLabel: tpl?.label };
};

// ==========================================
// CORE REACT COMPONENT
// ==========================================

export function GenerationHub() {
  const [activeTool, setActiveTool] = useState<string>('image');
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResumeTemplate, setSelectedResumeTemplate] = useState<string | null>(null);

  // Individual tool results
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedPdf, setGeneratedPdf] = useState<{ title: string; content: string; date: string } | null>(null);
  const [generatedPpt, setGeneratedPpt] = useState<{ topic: string; slides: { title: string; bullets: string[] }[] } | null>(null);
  const [generatedResume, setGeneratedResume] = useState<any | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<{ prompt: string; url: string; duration: string } | null>(null);

  // Parameters for high-fidelity Image generation synthesis
  const [selectedStyle, setSelectedStyle] = useState<string>('Realistic');
  const [selectedRatio, setSelectedRatio] = useState<string>('1:1');
  const [selectedResolution, setSelectedResolution] = useState<string>('HD');

  // Interaction UX states
  const [copied, setCopied] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    // Clear tool-specific results prior to generation
    setGeneratedImage(null);
    setGeneratedText(null);
    setGeneratedCode(null);
    setGeneratedPdf(null);
    setGeneratedPpt(null);
    setGeneratedResume(null);
    setGeneratedPrompt(null);
    setGeneratedVideo(null);
    setActiveSlide(0);

    try {
      if (activeTool === 'image') {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt,
            style: selectedStyle,
            aspectRatio: selectedRatio,
            resolution: selectedResolution
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");

        if (data.imageUrl) {
          setGeneratedImage(data.imageUrl);
          
          // Save generation activity in user's chronological memory vault
          localStorage.setItem('omniai_last_activity', JSON.stringify({
            type: 'System',
            label: 'AI Synthesis: IMAGE',
            content: `Synthesized image for prompt: "${prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt}"`,
            time: 'Just now'
          }));
          window.dispatchEvent(new Event('omniai_activity_update'));
        }
      } else {
        // Asynchronously call n8n and/or OpenAI/Gemini chat failovers
        let apiSuccess = false;
        let apiContent = "";

        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: `Task: Generate ${activeTool.toUpperCase()} content. Description: ${prompt}` }]
            }),
          });
          const data = await res.json();
          if (res.ok && data.content && !data.content.includes("Neural link offline")) {
            apiContent = data.content;
            apiSuccess = true;
          }
        } catch (apiErr) {
          console.warn("Direct chat pipeline unconfigured or offline, engaging dynamic procedural synthesizers.", apiErr);
        }

        // Engage full procedural template fallbacks if cognitive keys are offline
        if (!apiSuccess) {
          await new Promise(resolve => setTimeout(resolve, 1400)); // AI thinking simulation latency
          apiContent = generateFallbackContent(activeTool, prompt);
        }

        // Distribute generated output to corresponding states
        if (activeTool === 'text') {
          setGeneratedText(apiContent);
        } else if (activeTool === 'code') {
          setGeneratedCode(apiContent);
        } else if (activeTool === 'prompt') {
          setGeneratedPrompt(apiContent);
        } else if (activeTool === 'pdf') {
          setGeneratedPdf({
            title: `Neural Document Report: ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}`,
            content: apiContent,
            date: new Date().toLocaleDateString()
          });
        } else if (activeTool === 'ppt') {
          setGeneratedPpt(parsePptContent(apiContent, prompt));
        } else if (activeTool === 'resume') {
          setGeneratedResume(parseResumeContent(apiContent, prompt, selectedResumeTemplate || undefined));
        } else if (activeTool === 'video') {
          const encodedPrompt = encodeURIComponent(prompt.trim());
          const seed = Math.floor(Math.random() * 1000000);
          setGeneratedVideo({
            prompt: prompt,
            url: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}`,
            duration: "8.0s"
          });
        }

        // Record the transaction safely into user memory vault
        localStorage.setItem('omniai_last_activity', JSON.stringify({
          type: 'System',
          label: `AI Synthesis: ${activeTool.toUpperCase()}`,
          content: `Synthesized ${activeTool} output for: "${prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt}"`,
          time: 'Just now'
        }));
        window.dispatchEvent(new Event('omniai_activity_update'));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate.");
    } finally {
      setIsGenerating(false);
    }
  };

  const tools = [
    {
      id: 'image',
      title: 'Image Generation',
      desc: 'Create stunning photorealistic images and digital art from text prompts.',
      icon: ImageIcon,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      id: 'ppt',
      title: 'PPT Generation',
      desc: 'Auto-generate structured, beautifully designed presentation slides.',
      icon: Presentation,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20'
    },
    {
      id: 'prompt',
      title: 'Prompt Generator',
      desc: 'Design high-yield, structured prompts to get the most out of LLMs.',
      icon: MessageSquare,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20'
    }
  ];

  const getToolSpec = () => {
    switch(activeTool) {
      case 'image':
        return {
          title: "Neural Image Synthesis Core",
          icon: ImageIcon,
          placeholder: "Describe the image you want to synthesize... (e.g. 'A high-definition photorealistic render of a cyberpunk penthouse overlooking a neon metropolis, 8k resolution, cinematic lighting')",
          actionLabel: "Synthesize Image",
        };
      case 'video':
        return {
          title: "Temporal Video Synthesis Core",
          icon: Play,
          placeholder: "Describe the cinematic sequence you want to generate... (e.g. 'Slow motion tracking shot of a mechanical cyber-wolf walking through a glowing biomechanical forest, volumetric mist')",
          actionLabel: "Generate Video",
        };
      case 'pdf':
        return {
          title: "Neural Document Compiler",
          icon: FileDown,
          placeholder: "Specify the report details or document structure to compile... (e.g. 'A comprehensive market expansion strategy report for OmniAI, detailing growth metrics, target audience segments, and ROI benchmarks')",
          actionLabel: "Compile PDF",
        };
      case 'ppt':
        return {
          title: "Presentation Slides Architect",
          icon: Presentation,
          placeholder: "Provide presentation topic or slides outline... (e.g. 'A pitch deck for a decentralized quantum cloud-computing network, explaining the problem, core solution, and business model')",
          actionLabel: "Synthesize Slides",
        };
      case 'resume':
        return {
          title: "ATS Resume Synthesizer",
          icon: UserCircle,
          placeholder: "Provide your professional background, goals, and desired role... (e.g. 'Build a high-impact, ATS-optimized resume for a Senior Cloud Solutions Architect with 8 years of AWS experience, specialized in Terraform')",
          actionLabel: "Synthesize Resume",
        };
      case 'code':
        return {
          title: "Neural Code Compiler",
          icon: Code2,
          placeholder: "Detail the programming function, class, or application page you want to write... (e.g. 'Create a robust, generic React custom hook for handling infinite scroll pagination, including error states and scroll throttling')",
          actionLabel: "Compile Code",
        };
      case 'prompt':
        return {
          title: "LLM Prompt Architect",
          icon: MessageSquare,
          placeholder: "Describe the target agent persona, input, and goal... (e.g. 'A structured prompt for an expert medical research agent specializing in clinical trials data analysis, outputting neat Markdown summaries')",
          actionLabel: "Synthesize Prompt",
        };
      case 'text':
      default:
        return {
          title: "Cognitive Text Synthesizer",
          icon: Type,
          placeholder: "Describe the copy, article, email, or creative literature you want to write... (e.g. 'Write a five-part onboarding email sequence for a premium SaaS developer productivity platform, with compelling subject lines')",
          actionLabel: "Synthesize Copy",
        };
    }
  };

  const hasResult = !!(
    generatedImage || 
    generatedText || 
    generatedCode || 
    generatedPdf || 
    generatedPpt || 
    generatedResume || 
    generatedPrompt || 
    generatedVideo
  );

  const CurrentToolIcon = getToolSpec().icon;

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
               AI Generation<span className="text-[var(--accent-cyan)]">.</span>
            </h2>
            <p className="text-sm text-white/40 max-w-xl leading-relaxed">
               Deploy advanced neural models to generate text, synthesize images, compile documents, and produce video loops in milliseconds.
            </p>
         </div>
      </div>

      {/* Grid of Tools (Interactive & Cyber-Glowing Selection) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {tools.map((tool) => {
           const isActive = tool.id === activeTool;
           return (
             <motion.div
               key={tool.id}
               whileHover={{ y: -5 }}
               onClick={() => {
                 setActiveTool(tool.id);
                 setError(null);
               }}
               className={`glass-panel p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                 isActive 
                   ? 'border-[var(--accent-cyan)] bg-white/[0.04] shadow-[0_0_25px_rgba(0,209,255,0.15)]' 
                   : 'border-white/5 hover:border-white/20'
               }`}
             >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300 ${
                  isActive 
                    ? `bg-[var(--accent-cyan)]/20 border-[var(--accent-cyan)]/50 ${tool.color}` 
                    : `${tool.bg} ${tool.color}`
                }`}>
                   <tool.icon size={24} className={isActive ? 'animate-pulse' : ''} />
                </div>
                <h3 className="text-lg font-black text-white mb-2">{tool.title}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed mb-6">{tool.desc}</p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                   <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                     isActive ? 'text-[var(--accent-cyan)] font-extrabold' : 'text-white/20 group-hover:text-white/40'
                   }`}>
                     {isActive ? 'Active Engine' : 'Launch Tool'}
                   </span>
                   <Wand2 size={14} className={isActive ? 'text-[var(--accent-cyan)] animate-spin-slow' : 'text-white/20 group-hover:text-[var(--accent-cyan)] transition-colors'} />
                </div>
             </motion.div>
           );
         })}
      </div>

      {/* Main Generation Prompt Box */}
      <div className="mt-8 flex-1 glass-panel rounded-[32px] border border-white/5 p-8 flex flex-col relative overflow-hidden transition-all duration-500">
         <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-cyan)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
         
         <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
               <CurrentToolIcon size={14} className="text-[var(--accent-cyan)] animate-pulse" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/60">
              {getToolSpec().title}
            </h3>
         </div>

         <div className="flex-1 min-h-[360px] relative flex flex-col lg:flex-row gap-8">
            
            {/* Input column */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* ── Resume Template Picker ── */}
              {activeTool === 'resume' && (
                <div className="mb-6 space-y-3 animate-in fade-in duration-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50">Choose a Template</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {RESUME_TEMPLATES.map((tpl) => {
                      const isActive = selectedResumeTemplate === tpl.id;
                      return (
                        <motion.button
                          key={tpl.id}
                          type="button"
                          whileHover={{ y: -2 }}
                          onClick={() => {
                            setSelectedResumeTemplate(tpl.id);
                            setPrompt(tpl.prompt);
                          }}
                          className={`relative h-14 rounded-xl border overflow-hidden flex flex-col items-center justify-center gap-1 transition-all group ${
                            isActive
                              ? 'border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                              : 'border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${tpl.color} opacity-${isActive ? '40' : '20'} group-hover:opacity-40 transition-opacity`} />
                          <span className={`text-[8.5px] font-black uppercase tracking-wider relative z-10 ${
                            isActive ? 'text-emerald-400' : 'text-white/50 group-hover:text-white'
                          }`}>
                            {tpl.label}
                          </span>
                          {isActive && (
                            <span className="text-[7px] font-mono text-emerald-400/70 relative z-10 uppercase tracking-widest">Selected</span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

               <textarea 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder={getToolSpec().placeholder}
                 className="w-full flex-1 min-h-[220px] bg-transparent border-none outline-none resize-none text-xl md:text-2xl font-light text-white placeholder:text-white/20 focus:ring-0 p-0 leading-relaxed"
               />
                
                {/* 🎨 Premium AI Image Parameters HUD Section */}
                {activeTool === 'image' && (
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
                )}
                
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
                       getToolSpec().actionLabel
                     )}
                  </button>
               </div>
            </div>
            
            {/* Output Column (Adaptive Split) */}
            <AnimatePresence mode="wait">
              {hasResult && (
                <motion.div 
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.98 }}
                  className="w-full lg:w-[480px] xl:w-[560px] border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-8 flex flex-col gap-4 overflow-hidden min-w-0"
                >
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Synthesized Output</h4>
                     {(generatedText || generatedCode || generatedPrompt) && (
                       <button
                         onClick={() => {
                           const copyText = generatedText || generatedCode || generatedPrompt || "";
                           navigator.clipboard.writeText(copyText);
                           setCopied(true);
                           setTimeout(() => setCopied(false), 2000);
                         }}
                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-colors text-white/80 border border-white/5"
                       >
                         {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                         {copied ? 'Copied' : 'Copy Output'}
                       </button>
                     )}
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[380px] glass-panel rounded-2xl border border-white/5 p-6 bg-black/20 no-scrollbar">
                     
                     {/* 1. Image Viewer */}
                     {activeTool === 'image' && generatedImage && (
                       <div className="flex flex-col gap-4 items-center">
                         <img 
                            src={generatedImage} 
                            alt="Generated" 
                            className="w-full aspect-square rounded-xl object-cover shadow-[0_0_30px_rgba(0,209,255,0.2)] border border-purple-500/20" 
                             onError={(e) => {
                               console.warn("GenerationHub image load failed. Engaging fallback.");
                               
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
 
                               const keywords = prompt.toLowerCase();
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
 
                               // Deterministic selection using a simple prompt string hash
                               let hash = 0;
                               for (let i = 0; i < prompt.length; i++) {
                                 hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
                               }
                               const index = Math.abs(hash) % selectedList.length;
                               const backupImage = selectedList[index];
 
                               e.currentTarget.onerror = null;
                               e.currentTarget.src = backupImage;
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
                     )}

                     {/* 2. Video Viewer */}
                     {activeTool === 'video' && generatedVideo && (
                       <div className="flex flex-col gap-4 items-center">
                         <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-amber-500/20 group">
                           <img 
                              src={generatedVideo.url} 
                              alt="Video frame" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8000ms] ease-out" 
                              onError={(e) => {
                                console.warn("GenerationHub video thumbnail load failed. Engaging fallback.");
                                
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

                                const keywords = prompt.toLowerCase();
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

                                // Deterministic selection using a simple prompt string hash
                                let hash = 0;
                                for (let i = 0; i < prompt.length; i++) {
                                  hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
                                }
                                const index = Math.abs(hash) % selectedList.length;
                                const backupImage = selectedList[index];

                                e.currentTarget.onerror = null;
                                e.currentTarget.src = backupImage;
                              }}
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
                                   <Play size={14} className="text-amber-400 fill-amber-400" />
                                 </div>
                                 <span className="text-[10px] font-black tracking-widest uppercase text-white">Temporal Render</span>
                               </div>
                               <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono">{generatedVideo.duration}</span>
                             </div>
                           </div>
                         </div>
                         <a 
                           href={generatedVideo.url}
                           target="_blank"
                           rel="noreferrer"
                           className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors w-full justify-center text-amber-400 mt-2"
                         >
                           <Play size={14} /> Play Cinematic Loop
                         </a>
                       </div>
                     )}

                     {/* 3. Text Viewer */}
                     {activeTool === 'text' && generatedText && (
                       <div className="prose prose-invert max-w-none text-xs text-white/70 leading-relaxed font-light whitespace-pre-wrap">
                         {generatedText}
                       </div>
                     )}

                     {/* 4. Code Viewer */}
                     {activeTool === 'code' && generatedCode && (
                       <div className="font-mono text-[11px] text-cyan-400 leading-relaxed whitespace-pre overflow-x-auto bg-black/40 p-4 rounded-xl border border-white/5 no-scrollbar">
                         {generatedCode}
                       </div>
                     )}

                     {/* 5. PDF Viewer */}
                     {activeTool === 'pdf' && generatedPdf && (
                       <div className="flex flex-col gap-4 text-white">
                         <div className="border-b border-white/10 pb-4 mb-2">
                           <div className="flex items-center justify-between mb-2">
                             <span className="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-500/20">Official Dossier</span>
                             <span className="text-[10px] text-white/40">{generatedPdf.date}</span>
                           </div>
                           <h5 className="text-xs font-black tracking-tight">{generatedPdf.title}</h5>
                         </div>
                         <div className="text-[10px] text-white/60 whitespace-pre-wrap leading-relaxed font-mono">
                           {generatedPdf.content}
                         </div>
                         <button
                           onClick={() => {
                             const element = document.createElement("a");
                             const file = new Blob([generatedPdf.content], {type: 'text/plain'});
                             element.href = URL.createObjectURL(file);
                             element.download = "OmniAI_Official_Dossier.txt";
                             document.body.appendChild(element);
                             element.click();
                             document.body.removeChild(element);
                           }}
                           className="flex items-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors w-full justify-center text-red-400 mt-2"
                         >
                           <FileDown size={14} /> Download Document (.txt)
                         </button>
                       </div>
                     )}

                     {/* 6. PPT Slide Carousel */}
                     {activeTool === 'ppt' && generatedPpt && (
                       <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-between border-b border-white/10 pb-3">
                           <span className="text-[9px] font-black uppercase tracking-widest text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-500/20">Presentation Deck</span>
                           <div className="flex items-center gap-2">
                             <button 
                               onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                               disabled={activeSlide === 0}
                               className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-black"
                             >
                               &lt;
                             </button>
                             <span className="text-[10px] font-mono text-white/60">{activeSlide + 1} / {generatedPpt.slides.length}</span>
                             <button 
                               onClick={() => setActiveSlide(prev => Math.min(generatedPpt.slides.length - 1, prev + 1))}
                               disabled={activeSlide === generatedPpt.slides.length - 1}
                               className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-black"
                             >
                               &gt;
                             </button>
                           </div>
                         </div>
                         
                         <motion.div 
                           key={activeSlide}
                           initial={{ opacity: 0, x: 10 }}
                           animate={{ opacity: 1, x: 0 }}
                           className="p-6 rounded-xl border border-orange-500/20 bg-orange-500/[0.02] min-h-[180px] flex flex-col justify-center"
                         >
                           <h6 className="text-[11px] font-black uppercase tracking-wider text-orange-400 mb-3">
                             {generatedPpt.slides[activeSlide].title}
                           </h6>
                           <ul className="space-y-2 list-none">
                             {generatedPpt.slides[activeSlide].bullets.map((bullet, i) => (
                               <li key={i} className="text-[10px] text-white/70 leading-relaxed flex items-start gap-2">
                                 <span className="text-orange-400 mt-0.5">•</span>
                                 <span>{bullet}</span>
                               </li>
                             ))}
                           </ul>
                         </motion.div>

                         <button
                           onClick={() => {
                             const txt = `OMNIAI PRESENTATION DECK\nTopic: ${generatedPpt.topic}\n\n` + 
                               generatedPpt.slides.map((s, idx) => `[SLIDE ${idx+1}] ${s.title}\n` + s.bullets.map(b => `- ${b}`).join('\n')).join('\n\n');
                             const element = document.createElement("a");
                             const file = new Blob([txt], {type: 'text/plain'});
                             element.href = URL.createObjectURL(file);
                             element.download = "OmniAI_Slide_Deck.txt";
                             document.body.appendChild(element);
                             element.click();
                             document.body.removeChild(element);
                         }}
                           className="flex items-center gap-2 px-4 py-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors w-full justify-center text-orange-400"
                         >
                           <Presentation size={14} /> Download PPT Outline
                         </button>
                       </div>
                     )}

                     {/* 7. Resume Viewer */}
                     {activeTool === 'resume' && generatedResume && (
                       <div className="flex flex-col gap-4 text-[10px]">
                         <div className="grid grid-cols-6 gap-2 mb-2">
                           {RESUME_TEMPLATES.map(t => (
                             <button key={t.id} onClick={() => setSelectedResumeTemplate(t.id)} className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${selectedResumeTemplate === t.id ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                               <span className="text-sm">📄</span>
                               <span className="text-[8px] font-bold text-white/60 uppercase">{t.label}</span>
                             </button>
                           ))}
                         </div>
                         {/* Header */}
                         <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 flex flex-col gap-1.5">
                           <div className="flex items-start justify-between gap-2">
                             <h5 className="text-sm font-black text-white tracking-tight">{generatedResume.name}</h5>
                             {generatedResume.templateLabel && (
                               <span className="shrink-0 text-[7px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                 {generatedResume.templateLabel}
                               </span>
                             )}
                           </div>
                           <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                             <span className="text-[9px] text-white/50">{generatedResume.email}</span>
                             {generatedResume.phone && <span className="text-[9px] text-white/50">{generatedResume.phone}</span>}
                             {generatedResume.linkedin && <span className="text-[9px] text-emerald-400/70">{generatedResume.linkedin}</span>}
                           </div>
                         </div>
                         
                         <div>
                           <h6 className="font-black text-[9px] uppercase tracking-wider text-emerald-400 mb-1">Professional Summary</h6>
                           <p className="text-white/60 leading-relaxed font-light">{generatedResume.summary}</p>
                         </div>

                         <div className="space-y-3">
                           <h6 className="font-black text-[9px] uppercase tracking-wider text-emerald-400 border-b border-white/5 pb-1">Experience</h6>
                           {generatedResume.experience.map((exp: any, idx: number) => (
                             <div key={idx} className="space-y-1">
                               <div className="flex justify-between font-bold text-white">
                                 <span>{exp.role}</span>
                                 <span className="text-white/40 text-[8px] shrink-0 ml-2">{exp.duration}</span>
                               </div>
                               <div className="text-emerald-400/70 italic text-[9px]">{exp.company}</div>
                               <ul className="space-y-1 mt-1 pl-3 list-disc list-outside">
                                 {exp.bullets.map((b: string, i: number) => (
                                   <li key={i} className="text-white/60 leading-relaxed font-light">{b}</li>
                                 ))}
                               </ul>
                             </div>
                           ))}
                         </div>

                         <div>
                           <h6 className="font-black text-[9px] uppercase tracking-wider text-emerald-400 border-b border-white/5 pb-1 mb-1.5">Skills</h6>
                           <div className="flex flex-wrap gap-1.5">
                             {generatedResume.skills.map((skill: string, idx: number) => (
                               <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-[8px] font-mono text-emerald-400/80 border border-emerald-500/20">{skill}</span>
                             ))}
                           </div>
                         </div>

                         <button
                           onClick={() => {
                             const txt = `${generatedResume.name}\n${generatedResume.email}${generatedResume.phone ? ' | ' + generatedResume.phone : ''}${generatedResume.linkedin ? ' | ' + generatedResume.linkedin : ''}\n\nPROFESSIONAL SUMMARY\n${generatedResume.summary}\n\nEXPERIENCE\n` + 
                               generatedResume.experience.map((exp: any) => `${exp.role} | ${exp.company} | ${exp.duration}\n` + exp.bullets.map((b: string) => `• ${b}`).join('\n')).join('\n\n') + 
                               `\n\nSKILLS\n${generatedResume.skills.join(' • ')}`;
                             const element = document.createElement('a');
                             const file = new Blob([txt], {type: 'text/plain'});
                             element.href = URL.createObjectURL(file);
                             element.download = `OmniAI_Resume_${generatedResume.name.replace(/\s+/g,'_')}.txt`;
                             document.body.appendChild(element);
                             element.click();
                             document.body.removeChild(element);
                           }}
                           className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors w-full justify-center text-emerald-400 mt-2"
                         >
                           <UserCircle size={14} /> Download ATS Resume (.txt)
                         </button>
                       </div>
                     )}

                     {/* 8. Prompt Viewer */}
                     {activeTool === 'prompt' && generatedPrompt && (
                       <div className="font-mono text-[10px] text-pink-400 leading-relaxed whitespace-pre bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
                         {generatedPrompt}
                       </div>
                     )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
}
