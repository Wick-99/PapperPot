"use client";

import { memo } from "react";

/**
 * Background ornaments for the pinned story section.
 *
 * - Corner viewfinder brackets (matches hero + showcase)
 * - Vertical edge labels on left/right gutters
 * - A "PROCESS · 003 STEPS" indicator floating top-right
 * - Two dashed rings counter-rotating around the central orb
 * - A drifting paper-plane silhouette
 *
 * Everything pointer-events: none, sits at z-2 (above the grid + orb,
 * below the beat text at z-3) so the existing beat fade timeline keeps
 * full readability.
 */
function StoryOrnamentsImpl() {
  return (
    <>
      <span className="story__bracket story__bracket--tl" aria-hidden="true" />
      <span className="story__bracket story__bracket--tr" aria-hidden="true" />
      <span className="story__bracket story__bracket--bl" aria-hidden="true" />
      <span className="story__bracket story__bracket--br" aria-hidden="true" />

      <span className="story__edge story__edge--left" aria-hidden="true">
        STUDIO · STORY — 2025
      </span>
      <span className="story__edge story__edge--right" aria-hidden="true">
        SCENE 02 — HOW WE WORK
      </span>

      <div className="story__chip" aria-hidden="true">
        <span className="story__chip-mark">◢</span>
        <i>PROCESS</i>
        <em>003 STEPS</em>
      </div>

      {/* Counter-rotating dashed rings around the orb. */}
      <svg className="story__rings" viewBox="0 0 600 600" aria-hidden="true">
        <circle cx="300" cy="300" r="220" className="story__ring story__ring--outer" />
        <circle cx="300" cy="300" r="170" className="story__ring story__ring--mid" />
        <circle cx="300" cy="300" r="140" className="story__ring story__ring--inner" />
      </svg>

      <svg className="story__plane" viewBox="0 0 34 22" aria-hidden="true">
        <path d="M0,11 L34,0 L18,22 L11,14 Z" />
        <path d="M0,11 L11,14 L34,0" className="story__plane-fold" />
      </svg>
    </>
  );
}

export const StoryOrnaments = memo(StoryOrnamentsImpl);
