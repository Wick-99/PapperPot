"use client";

import { useEffect } from "react";
import { useSmoothScroll } from "./SmoothScrollProvider";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Cross-page hash navigation handler.
 *
 * Symptom we're fixing: clicking "← all services" on a service page
 * routes to `/#categories`. The browser fires its native hash-jump as
 * soon as the home document is ready — BEFORE GSAP has registered the
 * Story section's `pin: '+=300%'` ScrollTrigger. So the y-position of
 * `#categories` at the moment of the jump is pre-pin (~200vh down), and
 * the user lands inside the Story section instead.
 *
 * Once ScrollTrigger creates pin-spacers the document grows, but the
 * browser doesn't re-fire the hash-scroll. We listen for ScrollTrigger's
 * "refresh" event and re-scroll to the target through Lenis (so it stays
 * smooth on desktop), with a safety timeout for the case where no
 * refresh fires.
 */
export function HashScroller() {
  const scroll = useSmoothScroll();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    let done = false;
    const goToHash = () => {
      if (done) return;
      const target = document.querySelector(hash) as HTMLElement | null;
      if (!target) return;
      done = true;
      if (scroll) scroll.scrollTo(target, { duration: 1.2 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // ScrollTrigger fires "refresh" after every layout-changing event —
    // font load, pin-spacer creation, image decode, etc. Wait for the
    // first refresh, then scroll one frame later so paint completes.
    const onRefresh = () => {
      window.requestAnimationFrame(goToHash);
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Safety: if ScrollTrigger never refreshes (no GSAP triggers on the
    // page), scroll anyway after 900ms.
    const safety = window.setTimeout(goToHash, 900);

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      clearTimeout(safety);
    };
  }, [scroll]);

  return null;
}
