"use client";
import React, { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particles array
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
      });
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse interactive tracking
    let mouse = { x: -1000, y: -1000, radius: 150 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Read theme dynamically each frame
      const isDark = document.documentElement.classList.contains('dark');

      // Theme-based colors
      const particleColors = isDark
        ? ['rgba(0,209,255,0.45)', 'rgba(123,97,255,0.35)', 'rgba(0,122,255,0.35)']
        : ['rgba(8,145,178,0.35)', 'rgba(99,102,241,0.25)', 'rgba(2,132,199,0.25)'];

      const connectionColor = isDark
        ? (alpha: number) => `rgba(0,209,255,${alpha})`
        : (alpha: number) => `rgba(8,145,178,${alpha * 0.6})`;

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * (isDark ? 0.15 : 0.1);
            ctx.strokeStyle = connectionColor(alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p, idx) => {
        const color = particleColors[idx % particleColors.length];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.size > 2) {
          ctx.strokeStyle = color.replace(/[\d.]+\)$/, '0.08)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Interactive mouse push
        if (mouse.x > -1000) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;
          }
        }

        // Boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ backgroundColor: 'var(--bg-obsidian)' }}
    >
      {/* 3D Perspective Cyber-Grid Layer */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          perspective: '500px',
          perspectiveOrigin: '50% 60%',
        }}
      >
        <div
          className="absolute inset-0 w-full h-[200%] origin-bottom"
          style={{
            transform: 'rotateX(75deg) translateY(-25%)',
            backgroundImage: `
              linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
              linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'linear-gradient(to top, black 30%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 95%)',
            animation: 'cyberGridScroll 25s linear infinite',
          }}
        />
      </div>

      {/* Cybernetic Pulse Scanline Overlay */}
      <div className="absolute inset-0 bg-cyber-scanline pointer-events-none opacity-[0.03]" />

      {/* Deep Space Star/Node Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

      {/* Glowing Ambient Moving Nebulae */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full animate-pulse-slow"
        style={{ background: `radial-gradient(circle at center, var(--nebula-cyan) 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full animate-pulse-slow"
        style={{ background: `radial-gradient(circle at center, var(--nebula-purple) 0%, transparent 70%)`, animationDelay: '3s' }}
      />
      <div
        className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full animate-pulse-slow"
        style={{ background: `radial-gradient(circle at center, var(--nebula-blue) 0%, transparent 70%)`, animationDelay: '1.5s' }}
      />
    </div>
  );
}
