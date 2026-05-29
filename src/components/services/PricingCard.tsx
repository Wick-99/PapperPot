"use client";

import { useEffect, useRef } from "react";
import type { PricingPlan } from "@/data/services";

interface Props {
  plan: PricingPlan;
  /** Hex accent inherited from the parent service. */
  accent: string;
}

/**
 * One pricing tier in the trio. Hover gives a perspective-tilt toward
 * the cursor and a glow on the recommended (PREMIUM) tier; the layout
 * stays as a vertical flex flow so feature lists of different lengths
 * still align by the price/CTA footer.
 */
export function PricingCard({ plan, accent }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  // Cursor-tracked 3D tilt — desktop only. rAF-coalesced.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const apply = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty("--tilt-x", `${tx}deg`);
        root.style.setProperty("--tilt-y", `${ty}deg`);
      });
    };
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      ty = ((e.clientX - (r.left + r.width / 2)) / r.width) * 6;
      tx = -((e.clientY - (r.top + r.height / 2)) / r.height) * 5;
      apply();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      apply();
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <article
      ref={rootRef}
      className={`plan plan--${plan.tier.toLowerCase()} ${plan.recommended ? "plan--rec" : ""}`}
      style={{ ["--accent" as string]: accent } as React.CSSProperties}
    >
      {plan.recommended && <span className="plan__ribbon">Most popular</span>}

      <header className="plan__head">
        <span className="plan__emoji" aria-hidden="true">{plan.emoji}</span>
        <span className="plan__tier">{plan.tier}</span>
        <p className="plan__subtitle">{plan.subtitle}</p>
      </header>

      <ul className="plan__features">
        {plan.features.map((f) => (
          <li key={f}>
            <span className="plan__tick" aria-hidden="true">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="plan__tools">
        {plan.tools.map((t) => (
          <span key={t} className="plan__tool">{t}</span>
        ))}
      </div>

      <div className="plan__meta">
        <span><i aria-hidden="true">⚡</i> {plan.delivery}</span>
        <span><i aria-hidden="true">🛡</i> {plan.support}</span>
      </div>

      {plan.gifts && (
        <ul className="plan__gifts" aria-label="bonus inclusions">
          {plan.gifts.map((g) => (
            <li key={g}>
              <span aria-hidden="true">🎁</span> {g}
            </li>
          ))}
        </ul>
      )}

      <footer className="plan__foot">
        <div className="plan__price">
          <span className="plan__market">Market</span>
          <s>{plan.marketPrice}</s>
          <div className="plan__offer-row">
            <b className="plan__offer">{plan.offerPrice}</b>
            <span className="plan__off">50% OFF</span>
          </div>
        </div>
        <a
          href="/#contact"
          className="plan__cta"
          data-cursor="magnetic"
          data-label="START"
        >
          <span>Start this plan</span>
          <i aria-hidden="true">→</i>
        </a>
      </footer>
    </article>
  );
}
