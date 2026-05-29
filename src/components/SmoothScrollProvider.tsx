"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { setScrollVelocity } from "@/lib/scroll-velocity";

interface ScrollCtx {
  scrollTo: (target: string | HTMLElement, opts?: { offset?: number; duration?: number }) => void;
}

const Ctx = createContext<ScrollCtx | null>(null);

export function useSmoothScroll() {
  return useContext(Ctx);
}

/**
 * Lenis smooth-scroll wrapper synced to GSAP's ticker, with ScrollTrigger
 * refresh that re-measures Lenis after pin-spacers grow the document.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduce) return;

    // Touch devices, especially iOS Safari, already have tuned native
    // momentum scroll. Lenis adds RAF work and can fight scroll anchoring,
    // so touch gets native scrolling plus lightweight anchor behavior.
    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      !window.matchMedia("(pointer: fine)").matches;

    if (isTouch) {
      const handleAnchorClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
        if (!anchor) return;
        const id = anchor.getAttribute("href");
        if (!id || id.length < 2) return;
        const el = document.querySelector(id) as HTMLElement | null;
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      document.addEventListener("click", handleAnchorClick);

      let lastY = window.scrollY;
      let lastT = performance.now();
      let raf = 0;
      let settle = 0;

      const sampleVelocity = () => {
        raf = 0;
        const now = performance.now();
        const y = window.scrollY;
        const dt = Math.max(now - lastT, 16);
        setScrollVelocity((y - lastY) / (dt / 16.67));
        lastY = y;
        lastT = now;
        window.clearTimeout(settle);
        settle = window.setTimeout(() => setScrollVelocity(0), 120);
      };

      const handleScroll = () => {
        if (!raf) raf = requestAnimationFrame(sampleVelocity);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        document.removeEventListener("click", handleAnchorClick);
        window.removeEventListener("scroll", handleScroll);
        if (raf) cancelAnimationFrame(raf);
        window.clearTimeout(settle);
      };
    }

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenisRef.current = lenis;

    const onScroll = (e: { velocity?: number }) => {
      ScrollTrigger.update();
      setScrollVelocity(e.velocity ?? 0);
    };
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id.length < 2) return;
      const el = document.querySelector(id) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  const ctx: ScrollCtx = {
    scrollTo: (target, opts) => {
      const el = typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target;
      if (!el) return;
      if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: opts?.offset ?? 0, duration: opts?.duration ?? 1.4 });
      else el.scrollIntoView({ behavior: "smooth" });
    },
  };

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
