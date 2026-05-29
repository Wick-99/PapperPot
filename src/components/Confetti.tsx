"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  s: number;
  rot: number;
  vr: number;
  col: string;
  life: number;
}

const COLORS = ["#E6FF00", "#FF007F", "#7C3AED", "#00E0B8", "#39FF88", "#F4F4F5"];

interface ConfettiHandle {
  burst: (originRect?: DOMRect | null) => void;
}

declare global {
  interface Window {
    __ppConfetti?: ConfettiHandle;
  }
}

/**
 * Full-screen confetti canvas. Exposes a single burst() method on
 * window.__ppConfetti so any component can trigger an explosion at an
 * arbitrary screen rect.
 */
export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    size();
    window.addEventListener("resize", size);

    const loop = () => {
      rafId.current = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rot += p.vr;
        p.life -= 0.008;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      });
      particles.current = particles.current.filter((p) => p.life > 0 && p.y < canvas.height + 40);
      if (!particles.current.length && rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const burst = (originRect?: DOMRect | null) => {
      const r = originRect ?? document.body.getBoundingClientRect();
      const ox = r.left + r.width / 2;
      const oy = r.top + r.height / 2;
      for (let i = 0; i < 160; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 4 + Math.random() * 13;
        particles.current.push({
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 4,
          g: 0.22 + Math.random() * 0.12,
          s: 4 + Math.random() * 7,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.4,
          col: COLORS[(Math.random() * COLORS.length) | 0],
          life: 1,
        });
      }
      if (!rafId.current) loop();
    };

    window.__ppConfetti = { burst };

    return () => {
      window.removeEventListener("resize", size);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      delete window.__ppConfetti;
    };
  }, []);

  return <canvas className="confetti" id="confettiCanvas" ref={canvasRef} aria-hidden="true" />;
}
