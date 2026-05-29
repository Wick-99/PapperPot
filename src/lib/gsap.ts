"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single source of truth for GSAP + ScrollTrigger registration.
 * Import { gsap, ScrollTrigger } from this module everywhere so the plugin
 * is guaranteed to be registered before any component effect runs.
 *
 * Effects run bottom-up in React, so a top-level provider's useEffect
 * cannot reliably register a plugin before its children's effects fire —
 * doing it at module load avoids that whole class of race.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
