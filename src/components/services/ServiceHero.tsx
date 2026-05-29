"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CategoryVisual } from "@/components/CategoryVisuals";
import type { Service } from "@/data/services";

/**
 * Service detail page hero.
 * - Big outlined numeral behind the title (matches the home Story beats)
 * - The same themed CategoryVisual that's used on the home category card
 *   — provides instant visual continuity when the user clicks through
 * - Parallax tilt on cursor for the visual
 * - Corner brackets + edge labels for the same studio "scene" feel
 */
export function ServiceHero({ service }: { service: Service }) {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = visualRef.current;
    if (!node) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let rx = 0;
    let ry = 0;
    const onMove = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      ry = ((e.clientX - (r.left + r.width / 2)) / r.width) * 12;
      rx = -((e.clientY - (r.top + r.height / 2)) / r.height) * 10;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        node.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    };
    const onLeave = () => {
      rx = 0;
      ry = 0;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        node.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      });
    };
    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className="srv-hero"
      style={{ ["--accent" as string]: service.accent } as React.CSSProperties}
    >
      <span className="srv-hero__bracket srv-hero__bracket--tl" aria-hidden="true" />
      <span className="srv-hero__bracket srv-hero__bracket--tr" aria-hidden="true" />
      <span className="srv-hero__bracket srv-hero__bracket--bl" aria-hidden="true" />
      <span className="srv-hero__bracket srv-hero__bracket--br" aria-hidden="true" />
      <span className="srv-hero__edge srv-hero__edge--left" aria-hidden="true">
        PAPPERPOT · SERVICES — {service.num}
      </span>
      <span className="srv-hero__edge srv-hero__edge--right" aria-hidden="true">
        {service.category}
      </span>

      <Link
        href="/#categories"
        className="srv-hero__back"
        data-cursor="enter"
        data-label="BACK"
      >
        <i aria-hidden="true">←</i> all services
      </Link>

      <span className="srv-hero__bignum" aria-hidden="true">{service.num}</span>

      <div className="srv-hero__copy">
        <span className="srv-hero__cat">
          <i aria-hidden="true">◢</i> {service.category}
        </span>
        <h1 className="srv-hero__title">{service.title}</h1>
        <p className="srv-hero__tagline">{service.tagline}</p>
        <p className="srv-hero__promise">{service.promise}</p>

        <ul className="srv-hero__highlights">
          {service.highlights.map((h) => (
            <li key={h}>
              <span aria-hidden="true">◆</span> {h}
            </li>
          ))}
        </ul>

        <div className="srv-hero__ctas">
          <a href="#plans" className="srv-hero__cta" data-cursor="magnetic" data-label="PLANS">
            <span>See pricing</span>
            <i aria-hidden="true">↓</i>
          </a>
          <Link
            href="/#contact"
            className="srv-hero__cta srv-hero__cta--ghost"
            data-cursor="magnetic"
            data-label="TALK"
          >
            <span>Talk to us</span>
            <i aria-hidden="true">→</i>
          </Link>
        </div>
      </div>

      <div className="srv-hero__visual-wrap">
        <div className="srv-hero__visual-glow" aria-hidden="true" />

        {/* subtle dashed top/bottom arcs around the mockup */}
        <div className="srv-hero__orbit-arcs" aria-hidden="true" />

        {/* paper plane on a dotted curve looping the visual */}
        <svg
          className="srv-hero__plane-stage"
          viewBox="0 0 600 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <path
              id="srv-plane-path"
              d="M30,300 C60,80 540,80 570,300 C540,520 60,520 30,300 Z"
            />
            <linearGradient id="srv-plane-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F4F4F5" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <use href="#srv-plane-path" className="srv-hero__plane-trail" />
          <g className="srv-hero__plane">
            <path
              d="M0,0 L30,10 L7,20 L10,10 Z"
              fill="url(#srv-plane-grad)"
              stroke="#050505"
              strokeWidth="0.6"
            />
            <path
              d="M0,0 L10,10 L30,10"
              fill="rgba(244,244,245,0.55)"
              stroke="#050505"
              strokeWidth="0.4"
            />
            <animateMotion dur="16s" repeatCount="indefinite" rotate="auto">
              <mpath href="#srv-plane-path" />
            </animateMotion>
          </g>
        </svg>

        {/* pulsing accent pins */}
        <span className="srv-hero__pin srv-hero__pin--1" aria-hidden="true" />
        <span className="srv-hero__pin srv-hero__pin--2" aria-hidden="true" />
        <span className="srv-hero__pin srv-hero__pin--3" aria-hidden="true" />

        {/* drifting mini paper-plane silhouettes */}
        <svg className="srv-hero__mini srv-hero__mini--a" viewBox="0 0 34 22" aria-hidden="true">
          <path d="M0,11 L34,0 L18,22 L11,14 Z" />
          <path d="M0,11 L11,14 L34,0" className="srv-hero__mini-fold" />
        </svg>
        <svg className="srv-hero__mini srv-hero__mini--b" viewBox="0 0 34 22" aria-hidden="true">
          <path d="M0,11 L34,0 L18,22 L11,14 Z" />
          <path d="M0,11 L11,14 L34,0" className="srv-hero__mini-fold" />
        </svg>

        <div className="srv-hero__visual" ref={visualRef}>
          <CategoryVisual kind={service.kind} />
        </div>
      </div>
    </section>
  );
}
