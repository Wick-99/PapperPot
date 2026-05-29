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

    // Touch devices (iOS Safari especially) have highly-tuned native
    // momentum scroll. Wrapping it in Lenis's RAF-driven smoothing causes
    // major jank, occasional "scroll stops responding" symptoms, and
    // fights iOS's scroll-anchoring. Skip Lenis entirely on touch — we
    // still wire up smooth anchor scrolling via scrollIntoView, and the
    // closer's velocity-driven rolling type reads scrollY deltas instead.
    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      !window.matchMedia("(pointer: fine)").matches;

    if (isTouch) {
      // Anchor smooth-scroll fallback.
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

      // Feed scroll velocity to the closer's rolling type even without
      // Lenis — diff scrollY across rAF frames.
      let lastY = window.scrollY;
      let raf = 0;
      const tick = () => {
        const y = window.scrollY;
        setScrollVelocity(y - lastY);
        lastY = y;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => {
        document.removeEventListener("click", handleAnchorClick);
        cancelAnimationFrame(raf);
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
