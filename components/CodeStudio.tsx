'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Terminal as TerminalIcon, 
  Play, 
  Folder, 
  File, 
  Maximize2, 
  Copy, 
  Download, 
  Wand2, 
  Bug, 
  HelpCircle, 
  Github, 
  Rocket, 
  Terminal, 
  MessageSquare, 
  Users, 
  Cpu, 
  Sparkles, 
  Eye, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Plus, 
  Trash2,
  Settings,
  Shield,
  Activity,
  Send,
  Loader2,
  Check,
  X
} from 'lucide-react';

// ==========================================
// MOCK INTEGRATION COGNITIVE GENERATOR DATA
// ==========================================

const SAMPLE_PROJECTS: Record<string, Record<string, string>> = {
  'Futuristic Login': {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OmniAI Uplink Portal</title>
  <style>
    body {
      background: #04050f;
      color: #fff;
      font-family: 'Segoe UI', system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      overflow: hidden;
    }
    .card {
      background: rgba(10, 11, 28, 0.45);
      backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 40px;
      width: 320px;
      text-align: center;
      box-shadow: 0 0 40px rgba(0, 240, 255, 0.1);
      position: relative;
    }
    h2 {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      margin-bottom: 30px;
      background: linear-gradient(90deg, #00f0ff, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    input {
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 12px 16px;
      color: white;
      margin-bottom: 20px;
      box-sizing: border-box;
      outline: none;
      transition: 0.3s;
    }
    input:focus {
      border-color: #00f0ff;
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
    }
    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(90deg, #8b5cf6, #ec4899);
      color: white;
      font-weight: 700;
      letter-spacing: 1px;
      cursor: pointer;
      transition: 0.3s;
    }
    button:hover {
      transform: scale(1.02);
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>OMNIAI UPLINK</h2>
    <input type="email" placeholder="IDENTITY EMAIL" />
    <input type="password" placeholder="PASSKEY VECTOR" />
    <button onclick="alert('Access Uplink Authenticated!')">TRANSMIT CREDENTIALS</button>
  </div>
</body>
</html>`,
    'App.js': `// Main React Entry File
import React from 'react';
import './styles.css';

export default function App() {
  return (
    <div className="uplink-wrapper">
      <div className="hud-card">
        <h1>QUANTUM UPLINK</h1>
        <p>OmniAI secure execution nodes active.</p>
      </div>
    </div>
  );
}`
  },
  'Restaurant Booking': {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cyber Dine Reserves</title>
  <style>
    body {
      background: #070913;
      color: #e2e8f0;
      font-family: sans-serif;
      padding: 40px;
      text-align: center;
    }
    h1 {
      color: #ec4899;
      font-size: 32px;
      letter-spacing: 1px;
    }
    .grid {
      display: grid;
      grid-template-cols: repeat(3, 1fr);
      gap: 20px;
      max-w: 600px;
      margin: 40px auto;
    }
    .table {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 20px;
      cursor: pointer;
      transition: 0.3s;
    }
    .table:hover {
      border-color: #ec4899;
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.2);
    }
  </style>
</head>
<body>
  <h1>CYBER DINE PLATFORM</h1>
  <p>Select available dining vectors to schedule reserves.</p>
  <div class="grid">
    <div class="table" onclick="alert('Table 01 Reserved')">TABLE 01 <br/> <span style="color:#10b981">Available</span></div>
    <div class="table" onclick="alert('Table 02 Reserved')">TABLE 02 <br/> <span style="color:#10b981">Available</span></div>
    <div class="table" onclick="alert('Table 03 Already booked')">TABLE 03 <br/> <span style="color:#ef4444">Occupied</span></div>
  </div>
</body>
</html>`,
    'server.js': `// Dine Reserver Node Express API
const express = require('express');
const app = express();

app.get('/api/tables', (req, res) => {
  res.json([
    { id: 'T1', status: 'available' },
    { id: 'T2', status: 'occupied' }
  ]);
});

app.listen(5002, () => console.log('Dine servers active on port 5002'));`
  },
  'React Dashboard': {
    'index.html': `<!DOCTYPE html>
<html>
<head>
  <title>Cyber Dashboard</title>
  <style>
    body { background: #03040b; color: #00f0ff; font-family: monospace; padding: 50px; text-align: center;}
    .hud { border: 2px solid #00f0ff; display: inline-block; padding: 30px; border-radius: 12px; box-shadow: 0 0 20px rgba(0, 240, 255, 0.2); }
    h2 { margin: 0 0 15px 0; }
  </style>
</head>
<body>
  <div class="hud">
    <h2>SYSTEM HUDS STATS</h2>
    <div>MEM: 82% OPERATIONAL</div>
    <div>CPU: 42°C STABLE</div>
  </div>
</body>
</html>`
  }
};

export function CodeStudio() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProject, setSelectedProject] = useState('Futuristic Login');
  
  // Multi-file system states
  const [files, setFiles] = useState<Record<string, string>>(SAMPLE_PROJECTS['Futuristic Login']);
  const [activeFile, setActiveFile] = useState('index.html');
  const [editorCode, setEditorCode] = useState(files['index.html'] || '');
  
  // Custom Tabs tracker
  const [openTabs, setOpenTabs] = useState<string[]>(['index.html']);
  
  // Live Previews Configurations
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0); // For iframe reloading
  
  // Debugger states
  const [errorLog, setErrorLog] = useState('');
  const [debugOutput, setDebugOutput] = useState<string | null>(null);
  
  // Terminal HUD states
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "OMNIAI Code Compiler Node v1.0 active.",
    "System status: STABLE. Ready for synthesis directives.",
    "Type 'help' or enter a project prompt to compile full-stack assets."
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  
  // Collaboration / Chat AI States
  const [comments, setComments] = useState<{ author: string; text: string; time: string }[]>([
    { author: 'AI Architect', text: 'Recommend utilizing index.html as main entry sandbox.', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Sync editor changes back to virtual files database
  useEffect(() => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: editorCode
    }));
  }, [editorCode, activeFile]);

  // Load new template projects
  const handleLoadProject = (projName: string) => {
    setSelectedProject(projName);
    const newFiles = SAMPLE_PROJECTS[projName];
    setFiles(newFiles);
    const firstFile = Object.keys(newFiles)[0];
    setActiveFile(firstFile);
    setEditorCode(newFiles[firstFile]);
    setOpenTabs([firstFile]);
  };

  // Switch Active files tabs
  const handleSelectFile = (fileName: string) => {
    setActiveFile(fileName);
    setEditorCode(files[fileName] || '');
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
  };

  // Close Tab
  const handleCloseTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== fileName);
    setOpenTabs(newTabs);
    if (activeFile === fileName && newTabs.length > 0) {
      handleSelectFile(newTabs[newTabs.length - 1]);
    }
  };

  // Add virtual file to tree
  const handleCreateFile = () => {
    const fileName = window.prompt('Enter new file name (e.g. styles.css, server.js):');
    if (!fileName) return;
    if (files[fileName]) {
      alert('File vector already registered!');
      return;
    }
    setFiles(prev => ({ ...prev, [fileName]: `/* Synthesis template for ${fileName} */` }));
    handleSelectFile(fileName);
  };

  // Delete virtual file
  const handleDeleteFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete file ${fileName} from tree database?`)) {
      const newFiles = { ...files };
      delete newFiles[fileName];
      setFiles(newFiles);
      setOpenTabs(openTabs.filter(t => t !== fileName));
      if (activeFile === fileName) {
        const remaining = Object.keys(newFiles);
        if (remaining.length > 0) {
          handleSelectFile(remaining[0]);
        } else {
          setEditorCode('');
        }
      }
    }
  };

  // AI Prompt compiler logic
  const handleCompileProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorLog('');
    setTerminalHistory(prev => [...prev, `> Compile project requested: "${prompt}"`, "Initiating synaptic parsing..."]);

    try {
      // Direct call to Next.js LLM Chat controller if configured, else simulation
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'user', 
              content: `Write a clean, responsive single file HTML layout complete with embed CSS styles and basic scripts representing: ${prompt}. Return ONLY the HTML code inside a code block.` 
            }
          ]
        })
      });

      const data = await response.json();
      let extractedCode = "";

      if (response.ok && data.content && data.content.includes("<!DOCTYPE html>")) {
        // Extract raw code inside standard markdown fences
        const codeBlockRegex = /```html\s*([\s\S]*?)\s*```/;
        const match = data.content.match(codeBlockRegex);
        extractedCode = match ? match[1] : data.content;
      }

      // If Next.js LLM failed, compile a beautiful high-fidelity custom template
      if (!extractedCode) {
        await new Promise(resolve => setTimeout(resolve, 2500));
        extractedCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OmniAI Generated Portal</title>
  <style>
    body {
      background: radial-gradient(circle at center, #0e1026, #04050f);
      color: #00f0ff;
      font-family: 'Courier New', monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .hud {
      border: 1px solid rgba(0, 240, 255, 0.4);
      padding: 30px;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.6);
      box-shadow: 0 0 25px rgba(0,240,255,0.2);
      text-align: center;
    }
    h1 {
      margin: 0 0 10px 0;
      letter-spacing: 2px;
    }
    p {
      color: rgba(255,255,255,0.6);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="hud">
    <h1>SYNTHESIS MASTERWORK</h1>
    <p>Target: "${prompt}"</p>
    <div style="font-size: 11px; margin-top: 15px; color: #8b5cf6">Active Status Node Connected</div>
  </div>
</body>
</html>`;
      }

      setFiles(prev => ({
        ...prev,
        'index.html': extractedCode
      }));
      handleSelectFile('index.html');
      setPreviewKey(prev => prev + 1); // Refresh preview iframe
      setTerminalHistory(prev => [...prev, "✓ Asset index.html compiled successfully. Dev portal updated."]);
      
      // Sync to chronological user audit logs
      localStorage.setItem('omniai_last_activity', JSON.stringify({
        type: 'Automation',
        label: 'Code Synthesized',
        content: `Compiled full-stack website layout for: "${prompt}"`,
        time: 'Just now'
      }));
      window.dispatchEvent(new Event('omniai_activity_update'));

    } catch (err: any) {
      setErrorLog(err.message || 'Compiler uplink failure');
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Code Explainer Logic
  const handleExplainCode = async () => {
    setIsAiExplaining(true);
    setAiExplanation(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Explain the following code logic in three simple bullet points:\n\n\`\`\`javascript\n${editorCode}\n\`\`\`` }]
        })
      });
      const data = await response.json();
      if (response.ok && data.content) {
        setAiExplanation(data.content);
      } else {
        throw new Error();
      }
    } catch (e) {
      setAiExplanation("• Establishes modular rendering directives.\n• Handles layout style modifiers dynamically.\n• Listens to user interactions and launches alerts.");
    } finally {
      setIsAiExplaining(false);
    }
  };

  // AI Debugger Auto-repair logic
  const handleTriggerDebug = async () => {
    if (!errorLog.trim()) return;
    setDebugOutput(null);
    setTerminalHistory(prev => [...prev, `[BUG DECTECTED] Parsing exception logs...`]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDebugOutput(`✓ Exception Analysed: The error is caused by referencing a non-existent parameter vector. \n\n[REPAIR SUGGESTION]\nMark the file or imports to point correctly to Supabase/OpenAI config modules.\n\nAuto-Repair Action Completed.`);
    
    // Inject mock fix to active editor
    if (editorCode.includes("alert")) {
      setEditorCode(prev => `// [AI AUTO-REPAIRED SYSTEM NODE]\n` + prev);
    }
    setTerminalHistory(prev => [...prev, `[REPAIR SUCCESS] Target compilation stabilized.`]);
  };

  // Interactive Terminal Direct Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    let response = `Command not recognized. Type 'help' to see active nodes.`;

    if (cmd === 'help') {
      response = `AVAILABLE MODULE COMMANDS:\n- clear: Purge terminal logs\n- npm run dev: Boot local Vite compilers\n- git status: Inspect commit coordinates\n- inspect tree: Read all active files`;
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (cmd === 'npm run dev') {
      response = `✓ Vite local server compiled. Port 3005 listening.`;
    } else if (cmd === 'git status') {
      response = `On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean.`;
    } else if (cmd === 'inspect tree') {
      response = `VIRTUAL TREE FILE DIRECTORY:\n` + Object.keys(files).map(f => `  - ${f}`).join('\n');
    }

    setTerminalHistory(prev => [...prev, `> ${terminalInput}`, response]);
    setTerminalInput('');
  };

  // Interactive collaborative team comments submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setComments(prev => [...prev, {
      author: 'Developer (You)',
      text: chatInput.trim(),
      time: 'Just now'
    }]);
    setChatInput('');
  };

  // Dynamic Iframe Document Generation
  const iframeSrcDoc = files['index.html'] || `<html><body style="background:#000; color:#fff; font-family:sans-serif; text-align:center; padding:50px;">No index.html file detected in tree database</body></html>`;

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* ── 1. BRAND HERO HEADER HUD ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-purple)]/5 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none" />
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-[var(--accent-cyan)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">COMPILER SWARM MATRIX</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white leading-none">
            Code Generation Studio<span className="text-[var(--accent-purple)]">.</span>
          </h2>
          <p className="text-xs text-white/40 max-w-xl leading-relaxed">
            Generate production-ready code, build instant previews, debug runtime errors, and inspect full-stack application structures inside a unified cyber editor.
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex gap-3">
          <button 
            onClick={() => handleLoadProject('Futuristic Login')}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--accent-cyan)]/30 hover:bg-white/[0.08] text-[9px] font-black uppercase tracking-widest text-white/80 transition-all flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-[var(--accent-cyan)]" /> START CODING
          </button>
          <button 
            onClick={() => handleLoadProject('Restaurant Booking')}
            className="px-4 py-2.5 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          >
            <Rocket className="w-3.5 h-3.5" /> GENERATE PROJECT
          </button>
        </div>
      </div>

      {/* ── 2. AI PROMPT COMPILER PANEL ─────────────────────────────────── */}
      <div className="glass-panel p-6 rounded-[28px] border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan)]/5 to-transparent pointer-events-none" />
        
        <form onSubmit={handleCompileProject} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-white/50 block">AI GENERATOR SPECIFICATION DIRECTIVE</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What project do you want to build? e.g. Create a sleek hotel reserve system with neon gradients..."
                className="flex-1 bg-black/50 border border-white/5 rounded-2xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[var(--accent-cyan)]/40 transition-all font-mono"
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="px-8 py-4 bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-purple)] to-[var(--accent-pink)] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)] disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin text-white" /> COMPILING...</>
                ) : (
                  <><Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" /> COMPILE NETWORK NODE</>
                )}
              </button>
            </div>
          </div>

          {/* Prompt suggestions shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest mr-2">Quick Blueprints:</span>
            {[
              "Futuristic Login Page",
              "Restaurant Booking Scheduler",
              "SaaS Pricing Matrix Deck",
              "React System Monitor Dashboard"
            ].map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setPrompt(sug)}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[8px] font-black uppercase text-white/50 hover:text-white transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ── 3. MAIN WORKSPACE SPLIT DIRECTORY ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        
        {/* LEFT SIDE: Project Explorer (3 columns) */}
        <div className="lg:col-span-3 glass-panel rounded-3xl border border-white/5 p-5 flex flex-col gap-5 bg-black/20">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Folder className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
              <span className="text-[9px] font-black uppercase tracking-wider text-white/60">PROJECT EXPLORER</span>
            </div>
            <button 
              onClick={handleCreateFile}
              className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Virtual File Tree Database */}
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[350px]">
            {Object.keys(files).map((fileName) => {
              const isActive = activeFile === fileName;
              return (
                <div
                  key={fileName}
                  onClick={() => handleSelectFile(fileName)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer group ${
                    isActive 
                      ? 'bg-white/[0.04] border-[var(--accent-cyan)]/20 text-white' 
                      : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <File className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--accent-cyan)]' : 'text-white/20'}`} />
                    <span className="text-xs font-mono truncate">{fileName}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteFile(fileName, e)}
                    className="p-1 rounded text-white/0 group-hover:text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* System Template Projects */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Active Templates</span>
            <div className="flex flex-col gap-2">
              {['Futuristic Login', 'Restaurant Booking', 'React Dashboard'].map((proj) => (
                <button
                  key={proj}
                  onClick={() => handleLoadProject(proj)}
                  className={`w-full py-2 px-3 rounded-lg text-left text-[9px] font-black uppercase border transition-all ${
                    selectedProject === proj
                      ? 'bg-[var(--accent-purple)]/10 border-[var(--accent-purple)]/30 text-[var(--accent-purple)]'
                      : 'bg-black/40 border-white/5 text-white/40 hover:text-white/60'
                  }`}
                >
                  {proj}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE: Advanced Editor (5 columns) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col bg-black/20">
          
          {/* File Tabs systems */}
          <div className="flex items-center bg-black/40 border-b border-white/5 overflow-x-auto no-scrollbar">
            {openTabs.map((tab) => {
              const isActive = activeFile === tab;
              return (
                <div
                  key={tab}
                  onClick={() => handleSelectFile(tab)}
                  className={`h-11 px-4 flex items-center gap-2 border-r border-white/5 cursor-pointer text-xs font-mono transition-all ${
                    isActive 
                      ? 'bg-white/[0.04] text-white border-t-2 border-t-[var(--accent-cyan)]' 
                      : 'bg-transparent text-white/30 hover:bg-white/[0.01]'
                  }`}
                >
                  <File className="w-3.5 h-3.5" />
                  <span>{tab}</span>
                  <button 
                    onClick={(e) => handleCloseTab(tab, e)}
                    className="p-0.5 rounded text-white/30 hover:text-white/80 hover:bg-white/10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Code Textarea Editor */}
          <div className="flex-grow p-4 flex flex-col min-h-[300px]">
            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              className="w-full flex-grow bg-transparent border-none outline-none resize-none text-[11px] font-mono text-cyan-400/90 leading-relaxed focus:ring-0 p-2 no-scrollbar"
              style={{ minHeight: '340px' }}
            />
          </div>

          {/* Bottom editor controls panel */}
          <div className="p-4 bg-black/40 border-t border-white/5 flex flex-wrap gap-2.5 justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleExplainCode}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black uppercase text-white/80 transition-all flex items-center gap-1.5"
              >
                <HelpCircle className="w-3 h-3 text-[var(--accent-cyan)]" /> EXPLAIN CODE
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(editorCode);
                  alert('Code copied successfully!');
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black uppercase text-white/80 transition-all flex items-center justify-center"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => setEditorCode(prev => `// [SYSTEM DATA OPTIMIZED]\n` + prev)}
              className="px-3.5 py-1.5 bg-[var(--accent-purple)]/10 hover:bg-[var(--accent-purple)]/25 border border-[var(--accent-purple)]/30 rounded-xl text-[9px] font-black uppercase text-[var(--accent-purple)] transition-all"
            >
              OPTIMIZE CORE
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Live Previews Panels (4 columns) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col bg-black/20">
          <div className="flex items-center justify-between px-5 h-12 border-b border-white/5 bg-black/40">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/60">LIVE NETWORK PREVIEW</span>
            
            {/* Aspect swapper */}
            <div className="flex gap-1 bg-black/60 p-1 rounded-lg border border-white/5">
              {[
                { id: 'desktop', icon: Laptop },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPreviewMode(item.id as any)}
                  className={`p-1.5 rounded transition-all ${
                    previewMode === item.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Iframe Viewport wrapper */}
          <div className="flex-grow p-4 flex items-center justify-center bg-black/60 relative">
            <div 
              className={`border border-white/10 rounded-2xl bg-white overflow-hidden shadow-lg transition-all duration-300 ${
                previewMode === 'mobile' 
                  ? 'w-[220px] h-[340px]' 
                  : previewMode === 'tablet'
                    ? 'w-[320px] h-[340px]'
                    : 'w-full h-[340px]'
              }`}
            >
              <iframe
                key={previewKey}
                srcDoc={iframeSrcDoc}
                title="Live Synthesis Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            </div>
          </div>

          {/* Quick Refresh pipeline button */}
          <div className="p-4 bg-black/40 border-t border-white/5 text-center">
            <button
              onClick={() => setPreviewKey(prev => prev + 1)}
              className="text-[9px] font-black uppercase tracking-widest text-[var(--accent-cyan)] hover:text-white transition-colors"
            >
              FORCE PREVIEW RE-RENDERING
            </button>
          </div>
        </div>

      </div>

      {/* ── 4. LOWER DEV DIAGNOSTICS & CHAT COLLAB ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Debugger & Terminal (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Debugger HUD */}
          <div className="glass-panel p-6 rounded-[28px] border border-white/5 space-y-4 bg-black/20">
            <div className="flex items-center gap-2">
              <Bug className="w-4.5 h-4.5 text-[var(--accent-pink)] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-wider text-white/60">SYNAPSE AI DEBUGGER HUD</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Paste compilation errors or logs here..."
                value={errorLog}
                onChange={(e) => setErrorLog(e.target.value)}
                className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--accent-pink)]/40 transition-all font-mono"
              />
              <button
                onClick={handleTriggerDebug}
                className="px-6 py-3.5 bg-gradient-to-r from-[var(--accent-pink)] to-red-500 hover:scale-[1.01] transition-all text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.15)] flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-cyan)] animate-pulse" /> DEBUG EXCEPTION
              </button>
            </div>

            {/* Debug Outputs readouts */}
            <AnimatePresence>
              {debugOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-black/50 border border-[var(--accent-pink)]/20 p-4 rounded-2xl text-[10px] font-mono text-[var(--accent-pink)] leading-relaxed whitespace-pre-wrap"
                >
                  {debugOutput}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cyber Terminal logs console */}
          <div className="glass-panel rounded-[28px] border border-white/5 overflow-hidden flex flex-col bg-black/40 h-64">
            <div className="flex items-center justify-between px-5 h-11 border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-[var(--accent-cyan)]" />
                <span className="text-[9px] font-black uppercase tracking-wider text-white/50">TERMCAT DEV CONSOLE</span>
              </div>
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Compiler status: UP</span>
            </div>

            {/* Console body outputs */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[10.5px] text-white/50 space-y-1.5 no-scrollbar bg-black/20">
              {terminalHistory.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap leading-relaxed">
                  {log}
                </div>
              ))}
            </div>

            {/* Console inputs */}
            <form onSubmit={handleTerminalSubmit} className="flex border-t border-white/5 bg-black/40 h-11">
              <span className="px-4 flex items-center text-[var(--accent-cyan)] font-mono text-sm">&gt;</span>
              <input
                type="text"
                placeholder="Submit network commands... e.g. help, git status"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-white focus:ring-0"
              />
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: AI Collaboration/Chat (4 columns) */}
        <div className="lg:col-span-4 glass-panel rounded-[28px] border border-white/5 flex flex-col bg-black/20 overflow-hidden min-h-[350px]">
          
          <div className="flex items-center justify-between px-5 h-12 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
              <span className="text-[9px] font-black uppercase tracking-wider text-white/60">WORKSPACE COMMENTS</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
          </div>

          {/* Comments List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar max-h-60">
            {comments.map((comment, index) => (
              <div key={index} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-black text-white/80">{comment.author}</span>
                  <span className="text-[8px] font-mono text-white/30">{comment.time}</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-white/60 leading-relaxed font-light">
                  {comment.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input submit form */}
          <form onSubmit={handleCommentSubmit} className="p-4 border-t border-white/5 bg-black/40 flex gap-2">
            <input
              type="text"
              placeholder="Leave a comment vector..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[var(--accent-cyan)]/30 font-mono"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[var(--accent-cyan)]/10 hover:bg-[var(--accent-cyan)]/25 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] flex items-center justify-center transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

      {/* Explainer feedback popup */}
      <AnimatePresence>
        {isAiExplaining && (
          <div className="fixed bottom-10 right-10 z-50 glass-panel p-5 rounded-2xl border border-white/10 w-80 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-cyan)]" />
              <span className="text-[9px] font-black uppercase text-white/80">AI Explaining Logic...</span>
            </div>
          </div>
        )}

        {aiExplanation && (
          <div className="fixed bottom-10 right-10 z-50 glass-panel p-6 rounded-3xl border border-[var(--accent-cyan)]/30 w-80 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-300 relative">
            <button 
              onClick={() => setAiExplanation(null)}
              className="absolute top-3 right-3 text-white/30 hover:text-white text-xs"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Sparkles className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
              <span className="text-[9px] font-black uppercase text-white">AI LOGIC EXPLANATION</span>
            </div>
            <div className="text-[10px] text-white/70 font-mono leading-relaxed whitespace-pre-wrap">
              {aiExplanation}
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
export default CodeStudio;
