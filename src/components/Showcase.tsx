"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ShowcaseMedia, type ProjectKind } from "./ShowcaseMedia";
import { ShowcaseBackground } from "./ShowcaseBackground";

interface Win {
  title: string;
  bar: string;
  caption: string;
  meta: string;
  /** "Live", "Shipped", "Beta" — small status badge over the title bar. */
  status: string;
  /** Theming key — selects which themed mock-up renders inside .win__media. */
  kind: ProjectKind;
  x: string;
  y: string;
  rot: number;
  z: number;
  /** Some windows in the design place the bar below the media instead of above. */
  barBelow?: boolean;
}

const WINS: Win[] = [
  { title: "Helios OS", bar: "helios-os — case study", caption: "Helios OS", meta: "AI ops console · Agentic Workflows",          status: "LIVE",    kind: "helios",  x: "6%",  y: "8%",  rot: -5, z: 3 },
  { title: "Nori",      bar: "nori — mobile",           caption: "Nori",      meta: "Health companion · Mobile + Model Training", status: "v2.1",    kind: "nori",    x: "52%", y: "4%",  rot: 4,  z: 5 },
  { title: "Vantage",   bar: "vantage — site",          caption: "Vantage",   meta: "Immersive launch site · WebGL",               status: "SHIPPED", kind: "vantage", x: "14%", y: "46%", rot: 6,  z: 4, barBelow: true },
  { title: "Loom",      bar: "loom — automation",       caption: "Loom",      meta: "Revenue automation · AI Automations",         status: "RUNNING", kind: "loom",    x: "58%", y: "48%", rot: -7, z: 6 },
  { title: "Atlas",     bar: "atlas — mlops",           caption: "Atlas",     meta: "Model platform · MLOps",                      status: "OPS",     kind: "atlas",   x: "36%", y: "24%", rot: 1,  z: 7 },
];

/**
 * Showcase: floating "OS-window" cards.
 * Each window tilts toward the cursor (ambient 3D) and can be grabbed
 * with the mouse/touch and dragged anywhere in the field. Pointer Events
 * cover both modalities with one code path.
 */
export function Showcase() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const wins = Array.from(field.querySelectorAll<HTMLElement>("[data-win]"));
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const stack = window.matchMedia("(max-width:860px)").matches;

    let topZ = 20;
    const cleanups: Array<() => void> = [];

    wins.forEach((win) => {
      const baseRot = parseFloat(getComputedStyle(win).getPropertyValue("--rot")) || 0;
      const state = { tiltX: 0, tiltY: 0, dragX: 0, dragY: 0, dragging: false, startX: 0, startY: 0, originX: 0, originY: 0 };

      // rAF-coalesce style writes so rapid pointermove events (which can
      // fire on every scroll-induced reflow when the cursor is over a
      // window) only produce one transform update per frame.
      let rafId = 0;
      const apply = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          win.style.transform = `translate(${state.dragX}px, ${state.dragY}px) rotate(${baseRot + state.tiltX}deg) rotateX(${-state.tiltY}deg) rotateY(${state.tiltX}deg)`;
        });
      };

      const onAmbientMove = (e: PointerEvent) => {
        if (state.dragging) return;
        const r = win.getBoundingClientRect();
        state.tiltX = ((e.clientX - (r.left + r.width / 2)) / r.width) * 10;
        state.tiltY = ((e.clientY - (r.top + r.height / 2)) / r.height) * 10;
        apply();
      };
      const onLeave = () => {
        if (state.dragging) return;
        state.tiltX = 0;
        state.tiltY = 0;
        apply();
      };
      const onDown = (e: PointerEvent) => {
        state.dragging = true;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.originX = state.dragX;
        state.originY = state.dragY;
        win.style.zIndex = String(++topZ);
        win.style.cursor = "grabbing";
        win.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!state.dragging) return;
        state.dragX = state.originX + (e.clientX - state.startX);
        state.dragY = state.originY + (e.clientY - state.startY);
        state.tiltX = 0;
        state.tiltY = 0;
        apply();
      };
      const onUp = (e: PointerEvent) => {
        if (!state.dragging) return;
        state.dragging = false;
        win.style.cursor = "";
        try {
          win.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore — pointer may not be captured if released early */
        }
      };

      if (!stack && !reduce) {
        win.addEventListener("pointermove", onAmbientMove, { passive: true });
        win.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          win.removeEventListener("pointermove", onAmbientMove);
          win.removeEventListener("pointerleave", onLeave);
          if (rafId) cancelAnimationFrame(rafId);
        });
      }
      if (!stack) {
        win.addEventListener("pointerdown", onDown);
        win.addEventListener("pointermove", onMove);
        win.addEventListener("pointerup", onUp);
        win.addEventListener("pointercancel", onUp);
        cleanups.push(() => {
          win.removeEventListener("pointerdown", onDown);
          win.removeEventListener("pointermove", onMove);
          win.removeEventListener("pointerup", onUp);
          win.removeEventListener("pointercancel", onUp);
        });
      }
    });

    // entrance reveal
    let ctx: gsap.Context | undefined;
    if (!reduce && !stack) {
      ctx = gsap.context(() => {
        gsap.from(wins, {
          y: 80,
          opacity: 0,
          rotateZ: (i: number) => (i % 2 ? 10 : -10),
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "#showcase", start: "top 65%" },
        });
      }, field);
    }

    return () => {
      cleanups.forEach((fn) => fn());
      ctx?.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="show" id="showcase" data-screen-label="Showcase">
      <ShowcaseBackground />
      <div className="show__head">
        <div className="show__head-text">
          <span className="show__idx">SELECTED OUTPUT</span>
          <h2 className="show__h">
            Things we
            <br />
            set in motion.
          </h2>
          <p className="show__note">Drag the windows. Everything here floats.</p>
        </div>
        <a
          href="#"
          className="show__head-cta"
          data-cursor="magnetic"
          data-label="ALL WORKS"
        >
          <span className="show__head-cta-meta">
            <i />
            <em>24 PROJECTS · 2020 — 2025</em>
          </span>
          <span className="show__head-cta-row">
            <b>View all works</b>
            <i className="show__head-cta-arrow">→</i>
          </span>
        </a>
      </div>
      <div className="show__field" id="showField" ref={fieldRef}>
        {WINS.map((w) => {
          const isLive = w.status === "LIVE" || w.status === "RUNNING";
          const Bar = (
            <div className="win__bar">
              <i />
              <i />
              <i />
              <span>{w.bar}</span>
              <span className={`win__status ${isLive ? "win__status--live" : ""}`}>
                {isLive && <i className="win__status-dot" />}
                {w.status}
              </span>
            </div>
          );
          const Media = (
            <div className="win__media">
              <ShowcaseMedia kind={w.kind} />
              <span className="win__view" aria-hidden="true">VIEW CASE STUDY →</span>
            </div>
          );
          return (
            <figure
              className="win"
              data-win
              key={w.title}
              style={{
                ["--x" as string]: w.x,
                ["--y" as string]: w.y,
                ["--rot" as string]: `${w.rot}deg`,
                ["--z" as string]: w.z,
              } as React.CSSProperties}
              data-cursor="view"
              data-label="DRAG"
            >
              {w.barBelow ? Media : Bar}
              {w.barBelow ? Bar : Media}
              <figcaption>
                <b>{w.caption}</b>
                <span>{w.meta}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
