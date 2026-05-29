"use client";

import { memo } from "react";

/**
 * Atmospheric overlays — animated SVG grain, CRT scanlines and a soft vignette.
 * Fixed-position layers that sit on top of the page using mix-blend-modes.
 */
function AtmosphereImpl() {
  return (
    <>
      <svg className="grain" aria-hidden="true">
        <filter id="grainFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainFilter)" />
      </svg>
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}

export const Atmosphere = memo(AtmosphereImpl);
