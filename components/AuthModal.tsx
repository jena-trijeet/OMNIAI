"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, X, Eye, EyeOff, ArrowRight, User, Mail, Lock, Sparkles } from 'lucide-react';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
  initialMode?: AuthMode;
}

export function AuthModal({ onClose, onSuccess, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (mode === 'signup') {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        // Save to localStorage
        const users = JSON.parse(localStorage.getItem('omniai_users') || '[]');
        const exists = users.find((u: any) => u.email === email.toLowerCase());
        if (exists) {
          setError('An account with this email already exists. Please log in.');
          setLoading(false);
          return;
        }
        const user = { name: name.trim(), email: email.toLowerCase(), password };
        users.push(user);
        localStorage.setItem('omniai_users', JSON.stringify(users));
        localStorage.setItem('omniai_current_user', JSON.stringify({ name: user.name, email: user.email }));
        setLoading(false);
        onSuccess({ name: user.name, email: user.email });

      } else {
        // Login
        if (!email.trim() || !password.trim()) {
          setError('Please enter your email and password.');
          setLoading(false);
          return;
        }
        const users = JSON.parse(localStorage.getItem('omniai_users') || '[]');
        const user = users.find((u: any) => u.email === email.toLowerCase() && u.password === password);
        if (!user) {
          setError('Invalid email or password. Please try again.');
          setLoading(false);
          return;
        }
        localStorage.setItem('omniai_current_user', JSON.stringify({ name: user.name, email: user.email }));
        setLoading(false);
        onSuccess({ name: user.name, email: user.email });
      }
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/10 to-[var(--accent-purple)]/10 blur-3xl rounded-[48px]" />

        <div className="relative glass-panel rounded-[40px] border-white/10 p-10 shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-xl glass-panel border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-[24px] glass-panel border-[var(--accent-cyan)]/20 flex items-center justify-center text-[var(--accent-cyan)] mb-6 shadow-[0_0_30px_rgba(0,209,255,0.15)]">
              <Cpu size={32} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {mode === 'signup' ? 'Create Neural Account' : 'Access Neural Hub'}
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 mt-2">
              {mode === 'signup' ? 'Join the OmniAI Ecosystem' : 'Welcome back to OmniAI'}
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-[11px] font-bold text-red-400 uppercase tracking-wider"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (signup only) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/5 focus:border-[var(--accent-cyan)]/30 rounded-2xl px-4 py-4 pl-11 text-sm text-white placeholder:text-white/20 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-cyan)] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/5 focus:border-[var(--accent-cyan)]/30 rounded-2xl px-4 py-4 pl-11 text-sm text-white placeholder:text-white/20 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-cyan)] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/5 focus:border-[var(--accent-cyan)]/30 rounded-2xl px-4 py-4 pl-11 pr-12 text-sm text-white placeholder:text-white/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-3 overflow-hidden group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={14} />
                  {mode === 'signup' ? 'Initialize Neural Account' : 'Access Neural Hub'}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <span className="text-[11px] text-white/30">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }}
              className="ml-2 text-[11px] font-black text-[var(--accent-cyan)] hover:underline uppercase tracking-wider"
            >
              {mode === 'signup' ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
