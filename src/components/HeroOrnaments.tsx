"use client";

import { memo } from "react";

/**
 * Decorative ornaments for the hero portal.
 *
 * - A paper plane traversing a curved dotted path (themed to "Papperpot")
 *   using SVG animateMotion — GPU-cheap path-following
 * - Corner registration brackets, viewfinder-style
 * - Vertical edge labels on left + right gutters
 * - A floating "project tag" widget upper-right
 * - Two drifting paper-plane silhouettes for depth
 *
 * Everything sits at z-2 (above the WebGL shader + reveal mask, below the
 * P.POT title and the kicker/foot) and is pointer-events: none so the
 * hero's existing cursor-spotlight pointer tracking is unaffected.
 */
function HeroOrnamentsImpl() {
  return (
    <>
      {/* Corner registration brackets — subtle viewfinder marks. */}
      <div className="hero__brackets" aria-hidden="true">
        <span className="hero__bracket hero__bracket--tl" />
        <span className="hero__bracket hero__bracket--tr" />
        <span className="hero__bracket hero__bracket--bl" />
        <span className="hero__bracket hero__bracket--br" />
      </div>

      {/* Vertical-axis edge labels. */}
      <span className="hero__edge hero__edge--left" aria-hidden="true">
        PAPPERPOT.STUDIO — EST. 2025
      </span>
      <span className="hero__edge hero__edge--right" aria-hidden="true">
        SCENE 01 — HERO PORTAL
      </span>

      {/* Paper plane on a curved dotted trail. */}
      <svg
        className="hero__plane-stage"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <path
            id="hero-plane-path"
            d="M-120,260 C280,100 540,460 820,300 S1320,80 1740,300"
          />
          <linearGradient id="hero-plane-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4F4F5" />
            <stop offset="100%" stopColor="#E6FF00" />
          </linearGradient>
        </defs>
        <use href="#hero-plane-path" className="hero__plane-trail" />
        {/* The plane itself — a small origami silhouette */}
        <g className="hero__plane">
          <path
            d="M0,0 L34,11 L8,22 L11,11 Z"
            fill="url(#hero-plane-grad)"
            stroke="#050505"
            strokeWidth="0.6"
          />
          <path
            d="M0,0 L11,11 L34,11"
            fill="rgba(244,244,245,0.55)"
            stroke="#050505"
            strokeWidth="0.4"
          />
          <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
            <mpath href="#hero-plane-path" />
          </animateMotion>
        </g>
      </svg>

      {/* Floating "project tag" widget, upper-right. */}
      <div className="hero__tag" aria-hidden="true">
        <span className="hero__tag-mark">◤</span>
        <i>PROJECT.01.25</i>
        <em>v0.7.4</em>
      </div>

      {/* Drifting paper-plane silhouettes for layered depth. */}
      <svg
        className="hero__mini hero__mini--1"
        viewBox="0 0 34 22"
        aria-hidden="true"
      >
        <path d="M0,11 L34,0 L18,22 L11,14 Z" />
        <path d="M0,11 L11,14 L34,0" className="hero__mini-fold" />
      </svg>
      <svg
        className="hero__mini hero__mini--2"
        viewBox="0 0 34 22"
        aria-hidden="true"
      >
        <path d="M0,11 L34,0 L18,22 L11,14 Z" />
        <path d="M0,11 L11,14 L34,0" className="hero__mini-fold" />
      </svg>

      {/* Bottom-centred "PAPER · POT" anagram strip, very subtle. */}
      <div className="hero__strip" aria-hidden="true">
        <span>PAPER</span><i>◢</i><span>POT</span><i>◢</i>
        <span>BUILT</span><i>◢</i><span>FOLDED</span><i>◢</i><span>SHIPPED</span>
      </div>
    </>
  );
}

export const HeroOrnaments = memo(HeroOrnamentsImpl);
