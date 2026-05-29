"use client";

import { useEffect, useRef } from "react";

const LABEL_MAP: Record<string, string> = {
  enter: "ENTER",
  explore: "EXPLORE",
  view: "VIEW",
  magnetic: "",
};

/**
 * Cinematic custom cursor.
 * - spring-lerp follow with directional stretch on velocity
 * - mix-blend-mode difference for contrast on any background
 * - contextual hover labels via [data-cursor] / [data-label]
 * - magnetic attraction on [data-cursor="magnetic"] elements
 *
 * No-ops on coarse pointers (touch). Re-binds dynamically when DOM mutates,
 * so showcase windows and other late-rendered targets still get behaviour.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer:fine)").matches) return;

    const cursor = rootRef.current;
    if (!cursor) return;
    const ring = cursor.querySelector<HTMLDivElement>(".cursor__ring")!;
    const label = cursor.querySelector<HTMLSpanElement>(".cursor__label")!;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let px = tx;
    let py = ty;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onDown = () => cursor.classList.add("is-down");
    const onUp = () => cursor.classList.remove("is-down");
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const loop = () => {
      px = cx;
      py = cy;
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      const vx = cx - px;
      const vy = cy - py;
      const speed = Math.min(Math.hypot(vx, vy), 60);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const stretch = 1 + speed / 90;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      ring.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scale(${stretch}, ${1 - (stretch - 1) * 0.6})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const bindings = new WeakMap<HTMLElement, () => void>();

    const bind = (el: HTMLElement) => {
      if (bindings.has(el)) return;
      const type = el.getAttribute("data-cursor") || "";
      const custom = el.getAttribute("data-label") || "";

      const onEnter = () => {
        cursor.classList.add("is-hover");
        const text = custom || LABEL_MAP[type] || "";
        if (text) {
          label.textContent = text;
          cursor.classList.add("is-active");
        }
      };
      const onLeave = () => {
        cursor.classList.remove("is-hover", "is-active");
        label.textContent = "";
        el.style.transform = "";
      };
      const onMagnetic = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * 0.32}px, ${my * 0.42}px)`;
        tx += (r.left + r.width / 2 - tx) * 0.18;
        ty += (r.top + r.height / 2 - ty) * 0.18;
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      if (type === "magnetic") el.addEventListener("mousemove", onMagnetic);

      bindings.set(el, () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        if (type === "magnetic") el.removeEventListener("mousemove", onMagnetic);
      });
    };

    document.querySelectorAll<HTMLElement>("[data-cursor]").forEach(bind);

    const observer = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches?.("[data-cursor]")) bind(n);
          n.querySelectorAll?.<HTMLElement>("[data-cursor]").forEach(bind);
        });
      }
    });
    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <div className="cursor__ring" />
      <div className="cursor__dot" />
      <span className="cursor__label" />
    </div>
  );
}
