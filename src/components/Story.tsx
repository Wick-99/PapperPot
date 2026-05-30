"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { StoryVisual, type BeatVisual } from "./StoryVisuals";
import { StoryOrnaments } from "./StoryOrnaments";

interface Beat {
  idx: string;
  big: string;
  heading: React.ReactNode;
  body: string;
  kind: BeatVisual;
}

const BEATS: Beat[] = [
  {
    idx: "01 — IDEA",
    big: "01",
    heading: (
      <>
        A spark
        <br />
        becomes a <em>system.</em>
      </>
    ),
    body: "Every Paperpot engagement starts as a raw idea and ends as a living, shippable product. No decks that die in drawers.",
    kind: "idea",
  },
  {
    idx: "02 — INTELLIGENCE",
    big: "02",
    heading: (
      <>
        We weave
        <br />
        <em>intelligence</em> in.
      </>
    ),
    body: "Models, agents and automations aren't a feature we bolt on — they're the substrate everything is built on top of.",
    kind: "intel",
  },
  {
    idx: "03 — VELOCITY",
    big: "03",
    heading: (
      <>
        Then we
        <br />
        ship at <em>velocity.</em>
      </>
    ),
    body: "Tight loops, instrumented from day one. You watch it come alive in real time — not in a status email.",
    kind: "vel",
  },
];

/**
 * Pinned scroll-story.
 * The section pins for ~300% of its height; over that scroll distance the
 * orb rotates and grows, the grid drifts up, and three beats hard-handoff
 * (each beat fully clears before the next enters) so no two are ever
 * legible in the same spot simultaneously.
 */
export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ScrollTrigger.pin() creates a position:fixed wrapper with a
    // pin-spacer reserving its height. iOS Safari's compositor regularly
    // fails to paint inside pinned sections until the user scrolls past
    // the pin point (the "empty page first" symptom). On mobile the CSS
    // stacks beats vertically and opacity is forced to 1, so we just
    // skip the pinned timeline and use light vertical reveal triggers.
    const mobile = window.matchMedia("(max-width: 860px)").matches;
    if (reduce) return;
    const section = sectionRef.current;
    if (!section) return;

    if (mobile) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".beat", section).forEach((beat) => {
          const copy = beat.querySelector<HTMLElement>(".beat__copy");
          const visual = beat.querySelector<HTMLElement>(".beat__visual");
          const meter = beat.querySelector<HTMLElement>(".beat__meter i");

          gsap.set(copy, { opacity: 0, y: 34 });
          gsap.set(visual, { opacity: 0, y: 26, scale: 0.96 });
          gsap.set(meter, { scaleX: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: beat,
              start: "top 82%",
              once: true,
            },
          });

          tl.to(copy, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" })
            .to(visual, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out" }, 0.1)
            .to(meter, { scaleX: 1, duration: 0.7, ease: "power2.out" }, 0.18);
        });
      }, section);

      return () => {
        ctx.revert();
        ScrollTrigger.refresh();
      };
    }

    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>(".beat", section);
      if (!beats.length) return;

      gsap.set(beats[0], { opacity: 1, y: 0 });
      gsap.set(beats.slice(1), { opacity: 0, y: 70 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: pinRef.current,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      tl.to(".story__orb", { rotate: 140, scale: 1.18, ease: "none", duration: 3 }, 0);
      tl.to(".story__layer--grid", { yPercent: -12, ease: "none", duration: 3 }, 0);

      const OUT = { opacity: 0, y: -60, ease: "power2.in", duration: 0.35 };
      const IN  = { opacity: 1, y: 0,   ease: "power2.out", duration: 0.4 };

      tl.to(beats[0], OUT, 0.75)
        .to(beats[1], IN, 1.2)
        .to(beats[1], OUT, 1.95)
        .to(beats[2], IN, 2.4);
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="story" id="story" data-screen-label="Story" ref={sectionRef}>
      <div className="story__pin" id="storyPin" ref={pinRef}>
        <div className="story__layer story__layer--grid" data-depth="0.2" />
        <div className="story__orb" data-depth="0.6" />
        <StoryOrnaments />
        <div className="story__beats" id="storyBeats">
          {BEATS.map((b, i) => (
            <article className="beat" data-beat={i} key={b.idx}>
              <span className="beat__bignum" aria-hidden="true">{b.big}</span>
              <div className="beat__copy">
                <span className="beat__idx">{b.idx}</span>
                <h2 className="beat__h">{b.heading}</h2>
                <p className="beat__p">{b.body}</p>
                <div className="beat__meter">
                  <span>STEP {b.big} / 03</span>
                  <i style={{ width: `${((i + 1) / 3) * 100}%` }} />
                </div>
              </div>
              <div className="beat__visual">
                <StoryVisual kind={b.kind} />
              </div>
            </article>
          ))}
        </div>
        <div className="story__progress">
          <span id="storyProgress" ref={progressRef} />
        </div>
      </div>
    </section>
  );
}
