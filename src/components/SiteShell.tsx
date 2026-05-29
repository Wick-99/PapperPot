"use client";

import { type ReactNode } from "react";
import { Atmosphere } from "./Atmosphere";
import { Cursor } from "./Cursor";
import { Loader } from "./Loader";
import { Nav } from "./Nav";
import { Confetti } from "./Confetti";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

/**
 * Site-wide chrome: smooth-scroll provider, atmospheric overlays, cursor,
 * loader, nav and the confetti canvas. Wraps every route so the home page
 * and the per-service detail pages share the same shell — and so smooth
 * scroll, ScrollTrigger sync, and the custom cursor keep working as you
 * navigate between them.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <Atmosphere />
      <Cursor />
      <Loader />
      <Nav />
      {children}
      <Confetti />
    </SmoothScrollProvider>
  );
}
