"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { HeroOrnaments } from "./HeroOrnaments";

const HeroShader = dynamic(() => import("./HeroShader").then((m) => m.HeroShader), { ssr: false });

const REVEAL_WORDS: { text: string; top: string; left: string }[] = [
  { text: "INNOVATE", top: "14%", left: "8%" },
  { text: "AUTOMATE", top: "30%", left: "62%" },
  { text: "SCALE",    top: "54%", left: "12%" },
  { text: "BUILD",    top: "70%", left: "58%" },
  { text: "EVOLVE",   top: "84%", left: "24%" },
  { text: "AI-FIRST", top: "22%", left: "38%" },
];

const TITLE_CHARS: { ch: string; isDot?: boolean }[] = [
  { ch: "P" },
  { ch: ".", isDot: true },
  { ch: "P" },
  { ch: "O" },
  { ch: "T" },
];

/**
 * Hero "portal" — full-viewport WebGL fog with a cursor-tracked spotlight,
 * SVG-mask-based reveal of hidden words and a perspective-tilt parallax on
 * the centred type. The shader canvas renders only while the hero is in
 * view (R3F's frameloop pauses naturally when the section is hidden).
 */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const io = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? true),
      { threshold: 0.01 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const tx = (e.clientX - r.left) / r.width;
      const ty = (e.clientY - r.top) / r.height;
      mouseRef.current.tx = tx;
      mouseRef.current.ty = ty;
      if (revealRef.current) {
        revealRef.current.style.setProperty("--mx", `${tx * 100}%`);
        revealRef.current.style.setProperty("--my", `${ty * 100}%`);
      }
      if (coordsRef.current) {
        coordsRef.current.textContent = `x ${tx.toFixed(2)} / y ${ty.toFixed(2)}`;
      }
    };
    hero.addEventListener("pointermove", onMove);
    return () => hero.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const loop = () => {
      const center = centerRef.current;
      if (center) {
        const dx = mouseRef.current.x - 0.5;
        const dy = mouseRef.current.y - 0.5;
        center.style.transform = `translate(${dx * -26}px, ${dy * -18}px) rotateX(${dy * 5}deg) rotateY(${dx * -6}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <section className="hero" id="hero" data-screen-label="Hero" ref={heroRef}>
      {visible && <HeroShader mouseRef={mouseRef} />}

      <div className="hero__reveal" id="heroReveal" aria-hidden="true" ref={revealRef}>
        {REVEAL_WORDS.map((w) => (
          <span key={w.text} style={{ top: w.top, left: w.left }}>
            {w.text}
          </span>
        ))}
      </div>

      <HeroOrnaments />

      <div className="hero__kicker">
        <span>◢</span> AI-NATIVE DIGITAL STUDIO
      </div>

      <div className="hero__center" ref={centerRef}>
        <h1 className="hero__title" id="heroTitle" aria-label="P.POT">
          {TITLE_CHARS.map((c, i) => (
            <span key={i} className={`char ${c.isDot ? "hero__dot" : ""}`}>
              {c.ch}
            </span>
          ))}
        </h1>
        <div className="hero__below">
          <p className="hero__sub">
            We design, automate, and ship
            <br />
            intelligent products at the speed of thought.
          </p>
          <a
            href="#story"
            className="hero__cta"
            id="heroCta"
            data-cursor="magnetic"
            data-label="ENTER"
          >
            <span className="hero__cta-bg" />
            <span className="hero__cta-txt">ENTER EXPERIENCE</span>
            <span className="hero__cta-arrow">↓</span>
          </a>
        </div>
      </div>

      <div className="hero__foot">
        <span className="hero__scroll">SCROLL TO ENTER</span>
        <span className="hero__coords" id="heroCoords" ref={coordsRef}>
          x 0.00 / y 0.00
        </span>
      </div>
    </section>
  );
}
