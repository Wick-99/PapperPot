"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Fixed top navigation with mix-blend-difference. Hides on downward scroll
 * past 600px and returns on scroll-up — a classic "smart" nav, but driven
 * by ScrollTrigger so it stays in sync with the Lenis-controlled scroll
 * position.
 */
export function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const st = ScrollTrigger.create({
      start: "top -80",
      onUpdate: (self) => {
        nav.style.transform =
          self.direction === 1 && self.scroll() > 600 ? "translateY(-110%)" : "translateY(0)";
      },
    });
    return () => {
      st.kill();
    };
  }, []);

  // Tiny entrance — the bigger reveal lives in Loader's timeline.
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    gsap.fromTo(nav, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.2 });
  }, []);

  return (
    <header className="nav" id="nav" ref={ref}>
      <a href="#hero" className="nav__logo" data-cursor="enter" data-label="TOP">
        <span className="nav__logo-mark">◢</span> PAPPERPOT
      </a>
      <nav className="nav__links">
        <a href="#story" data-cursor>Studio</a>
        <a href="#categories" data-cursor>Work</a>
        <a href="#showcase" data-cursor>Showcase</a>
        <a href="#contact" data-cursor>Contact</a>
      </nav>
      <a href="#contact" className="nav__cta" data-cursor="magnetic" data-label="LET'S TALK">
        START A PROJECT <span>→</span>
      </a>
    </header>
  );
}
