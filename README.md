# PAPPERPOT

An immersive, AI-native digital-studio website built as a single Next.js page.
Void-black aesthetic, acid-yellow and cyber-pink accents, paper-craft motion,
WebGL fog hero, pinned scroll-stories, horizontal category sweep, draggable
showcase windows, and a kinetic contact closer.

```
Next.js 15 · React 19 · TypeScript · Tailwind 3
Three.js + R3F + Drei · GSAP + ScrollTrigger · Lenis · Framer Motion
```

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Requires Node 18.18+ (Next.js 15 minimum).

---

## What's inside

| Section | Component | Highlights |
|---|---|---|
| Loader | [`Loader`](src/components/Loader.tsx) | Fake-progress intro, GSAP reveal staggering hero chars + kicker + sub + CTA |
| Atmosphere | [`Atmosphere`](src/components/Atmosphere.tsx) | Animated SVG grain · CRT scanlines · radial vignette |
| Cursor | [`Cursor`](src/components/Cursor.tsx) | Spring-lerp follow, velocity stretch, contextual labels, magnetic attraction, mix-blend-difference |
| Nav | [`Nav`](src/components/Nav.tsx) | Hide-on-scroll, smart anchors via Lenis |
| Hero | [`Hero`](src/components/Hero.tsx) + [`HeroShader`](src/components/HeroShader.tsx) + [`HeroOrnaments`](src/components/HeroOrnaments.tsx) | R3F fragment-shader fog with cursor spotlight, reveal-mask hidden words, parallax type, paper-plane on dotted curve, corner brackets, edge labels, drifting mini planes |
| Story | [`Story`](src/components/Story.tsx) + [`StoryVisuals`](src/components/StoryVisuals.tsx) + [`StoryOrnaments`](src/components/StoryOrnaments.tsx) | Pinned 3-beat hard-handoff, per-beat themed visuals (spark mind-map / neural net / rocket trajectory), giant outline numerals, counter-rotating orb rings |
| Categories | [`Categories`](src/components/Categories.tsx) + [`CategoryVisuals`](src/components/CategoryVisuals.tsx) | Horizontal pinned scroll, per-card themed mock-ups (browser / phone / pipeline / code editor / agent mesh / metrics / training curve), per-char title stagger + accent wipe |
| Showcase | [`Showcase`](src/components/Showcase.tsx) + [`ShowcaseMedia`](src/components/ShowcaseMedia.tsx) + [`ShowcaseBackground`](src/components/ShowcaseBackground.tsx) | Draggable OS-window cards with ambient tilt, per-project rich media (Helios console / Nori rings / Vantage hero / Loom pipeline / Atlas dashboard), constellation backdrop, halos, "View all works" CTA |
| Closer | [`Closer`](src/components/Closer.tsx) | Velocity-driven rolling type, promo easter egg (`PAP1000` → confetti), validated form |
| Confetti | [`Confetti`](src/components/Confetti.tsx) | Full-screen particle canvas exposed via `window.__ppConfetti.burst()` |
| Smooth scroll | [`SmoothScrollProvider`](src/components/SmoothScrollProvider.tsx) | Lenis ↔ GSAP ticker, ScrollTrigger refresh re-measures Lenis after pin-spacers grow the doc |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # root layout, fonts, metadata
│   ├── page.tsx            # composes every section
│   └── globals.css         # design tokens + every component's styles
├── components/             # one .tsx per section/widget
└── lib/
    ├── gsap.ts             # module-load plugin registration
    ├── scroll-velocity.ts  # tiny pub/sub for Lenis velocity
    └── useReducedMotion.ts # media query hook
```

CSS is intentionally kept in one [`globals.css`](src/app/globals.css) — class names follow a clear prefix system (`.hero__`, `.story__`, `.cat__`, `.win__`, `.cv-*` for category visuals, `.sm-*` for showcase media, `.sv-*` for story visuals) so it stays scannable.

---

## Design system

```
--void:   #050505   --acid:    #E6FF00   --teal:  #00E0B8
--void-2: #0b0b0c   --pink:    #FF007F   --green: #39FF88
--ink:    #F4F4F5   --violet:  #7C3AED
```

Fonts (loaded from Fontshare CDN, see [`layout.tsx`](src/app/layout.tsx)):

- **Clash Display** — display headings
- **Satoshi** — body
- **Space Mono** — kicker / labels / status pills

---

## Animation libraries

- **GSAP + ScrollTrigger** — pinned story, horizontal categories sweep, entrance staggers. Registered once at module load in [`lib/gsap.ts`](src/lib/gsap.ts) so the plugin is available before any component effect runs.
- **Lenis** — smooth wheel scrolling, anchor scroll-to, scroll-velocity published to the closer's rolling type.
- **Three.js + R3F + Drei** — hero fragment-shader fog with cursor-tracked spotlight; canvas dynamically imported (`ssr: false`) and paused via `IntersectionObserver` when out of view.
- **SVG `<animateMotion>`** — path-following paper plane (hero), beads on pipeline diagrams (Loom, agentic mesh, Loom showcase), rocket on velocity trajectory.
- **CSS keyframes** — every "ambient" loop (pulses, halos, plane drifts, bar growth, neural-link blinks) so the GPU compositor handles them.
- **Framer Motion** — installed as a peer dep available for any future motion needs.

---

## Performance notes

- Hero R3F canvas pauses when the hero scrolls out of view (`IntersectionObserver` on the section gates the `<Canvas>` mount).
- Showcase has `contain: layout paint` on the section and each window, plus rAF-coalesced pointermove handlers so ambient tilt only writes one transform per frame.
- Halos use modest blur radii (`~28px`) on dedicated compositor layers (`translateZ(0)` + `will-change: transform`); blend modes were removed where they were forcing full-viewport recomposites.
- The static grid masks the backdrop without an animated `background-position` (animating that triggers full paint).
- All CSS animations target `transform` / `opacity` only.

---

## Accessibility

- Full `prefers-reduced-motion` support: WebGL pauses, ScrollTrigger pins are skipped, beats render statically stacked, horizontal category sweep degrades to a vertical stack (already handled in CSS).
- Custom cursor is `display: none` on coarse pointers (touch) and `cursor: auto` is restored.
- Screen-reader-only titles for the per-character stagger so the visible chars can be `aria-hidden` without losing semantics.
- All decorative SVG / ornament layers are `aria-hidden`.
- Forms validate inline with focus rings preserved.

---

## License

Internal / unlicensed prototype. Strip or replace before public release.
