"use client";

import { memo } from "react";

/**
 * Premium background for the showcase section.
 *
 * - Two large soft accent halos that drift on long sine cycles
 * - Animated perspective grid faded to the centre via a radial mask
 * - Constellation: connected dots that pulse independently
 * - Corner viewfinder brackets + vertical edge labels (same visual
 *   language as the hero ornaments — keeps the studio "scene" feel)
 * - A drifting paper-plane silhouette
 *
 * Everything is pointer-events: none and sits at z-0 / z-1 so the
 * draggable windows above stay fully interactive.
 */
function ShowcaseBackgroundImpl() {
  return (
    <>
      {/* Soft drifting halos. */}
      <div className="show__halo show__halo--1" aria-hidden="true" />
      <div className="show__halo show__halo--2" aria-hidden="true" />

      {/* Perspective grid faded toward the centre. */}
      <div className="show__grid" aria-hidden="true" />

      {/* Constellation dots — fixed positions, individually pulsing. */}
      <svg className="show__constellation" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <line x1="80"  y1="120" x2="240" y2="80"  className="show__c-line" />
        <line x1="240" y1="80"  x2="380" y2="180" className="show__c-line" />
        <line x1="620" y1="120" x2="800" y2="90"  className="show__c-line" />
        <line x1="800" y1="90"  x2="920" y2="220" className="show__c-line" />
        <line x1="180" y1="460" x2="340" y2="520" className="show__c-line" />
        <line x1="700" y1="500" x2="880" y2="460" className="show__c-line" />
        {[
          [80, 120], [240, 80], [380, 180], [620, 120], [800, 90], [920, 220],
          [180, 460], [340, 520], [700, 500], [880, 460],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            className="show__c-dot"
            style={{ animationDelay: `${(i * 0.35) % 3.2}s` }}
          />
        ))}
      </svg>

      {/* Corner viewfinder brackets. */}
      <span className="show__bracket show__bracket--tl" aria-hidden="true" />
      <span className="show__bracket show__bracket--tr" aria-hidden="true" />
      <span className="show__bracket show__bracket--bl" aria-hidden="true" />
      <span className="show__bracket show__bracket--br" aria-hidden="true" />

      {/* Vertical edge labels. */}
      <span className="show__edge show__edge--left" aria-hidden="true">
        SELECTED · 2024 — 2025
      </span>
      <span className="show__edge show__edge--right" aria-hidden="true">
        DRAG · VIEW · EXPLORE
      </span>

      {/* Drifting paper-plane silhouette echoes the hero. */}
      <svg className="show__plane" viewBox="0 0 34 22" aria-hidden="true">
        <path d="M0,11 L34,0 L18,22 L11,14 Z" />
        <path d="M0,11 L11,14 L34,0" className="show__plane-fold" />
      </svg>
    </>
  );
}

export const ShowcaseBackground = memo(ShowcaseBackgroundImpl);
