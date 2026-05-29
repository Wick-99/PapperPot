"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface LoaderProps {
  /** Called when the loader has finished revealing the page. */
  onReveal?: () => void;
}

/**
 * Intro loader: fake progress + reveal animation that staggers the hero
 * type, kicker, sub and CTA in. Falls back to a static fade for users with
 * reduced motion.
 */
export function Loader({ onReveal }: LoaderProps) {
  const [pct, setPct] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 860px), (hover: none), (pointer: coarse)").matches;
    const quickReveal = reduce || mobile;
    let p = 0;
    const tick = window.setInterval(() => {
      p += quickReveal ? 34 : Math.random() * 16 + 6;
      if (p >= 100) {
        p = 100;
        window.clearInterval(tick);
        reveal();
      }
      setPct(p);
    }, 130);

    const reveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      document.body.classList.remove("is-loading");

      const finish = () => {
        if (ref.current) ref.current.style.display = "none";
        onReveal?.();
      };

      if (!quickReveal) {
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(ref.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 0.15);
        tl.from(".hero__title .char", { yPercent: 120, opacity: 0, stagger: 0.06, duration: 1, ease: "expo.out" }, 0.5);
        tl.from(".hero__kicker", { opacity: 0, y: 14, duration: 0.7 }, 0.7);
        tl.from(".hero__sub", { opacity: 0, y: 18, duration: 0.7 }, 0.9);
        tl.from(".hero__cta", { opacity: 0, y: 24, duration: 0.7 }, 1.0);
        tl.from(".nav", { opacity: 0, duration: 0.8 }, 0.9);
      } else if (ref.current) {
        ref.current.style.transition = "opacity .28s ease";
        ref.current.style.opacity = "0";
        window.setTimeout(finish, 280);
      }
    };

    // Safety net — if the loader hangs, reveal at the latest after 2.5s.
    const safety = window.setTimeout(() => {
      if (!revealedRef.current) {
        window.clearInterval(tick);
        reveal();
      }
    }, quickReveal ? 900 : 2500);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(safety);
    };
  }, [onReveal]);

  const display = Math.floor(pct).toString().padStart(2, "0");

  return (
    <div className="loader" ref={ref} id="loader">
      <div className="loader__inner">
        <div className="loader__mark">P.POT</div>
        <div className="loader__bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="loader__pct">
          <span>{display}</span>
          <i>%</i>
        </div>
        <div className="loader__meta">
          <span>PAPPERPOT</span>
          <span>EST. 2025 — AI-NATIVE STUDIO</span>
        </div>
      </div>
    </div>
  );
}
