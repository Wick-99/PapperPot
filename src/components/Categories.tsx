"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CategoryVisual, type VisualKind } from "./CategoryVisuals";

interface Cat {
  num: string;
  title: string;
  accent: string;
  desc: string;
  tags: string[];
  visualClass: string;
  kind: VisualKind;
}

const CATS: Cat[] = [
  {
    num: "01",
    title: "Websites",
    accent: "#E6FF00",
    desc: "Immersive, performant marketing & product sites that feel like experiences, not pages.",
    tags: ["WebGL", "Design systems", "Headless CMS"],
    visualClass: "cat__visual--web",
    kind: "web",
  },
  {
    num: "02",
    title: "Mobile Apps",
    accent: "#FF007F",
    desc: "Native-feeling cross-platform apps with motion, haptics and offline-first intelligence.",
    tags: ["React Native", "Swift / Kotlin", "Edge sync"],
    visualClass: "cat__visual--mobile",
    kind: "mobile",
  },
  {
    num: "03",
    title: "Automations",
    accent: "#7C3AED",
    desc: "We delete the busywork — pipelines that move data, trigger actions and never sleep.",
    tags: ["Workflow engines", "Integrations", "Webhooks"],
    visualClass: "cat__visual--auto",
    kind: "auto",
  },
  {
    num: "04",
    title: "AI Automations",
    accent: "#00E0B8",
    desc: "LLM-powered flows that read, reason and act — embedded right where work happens.",
    tags: ["RAG", "Function calling", "Eval loops"],
    visualClass: "cat__visual--aiauto",
    kind: "aiauto",
  },
  {
    num: "05",
    title: "Agentic Workflows",
    accent: "#E6FF00",
    desc: "Multi-agent systems that plan, delegate and self-correct toward a goal you define.",
    tags: ["Orchestration", "Tool use", "Guardrails"],
    visualClass: "cat__visual--agent",
    kind: "agent",
  },
  {
    num: "06",
    title: "MLOps",
    accent: "#FF007F",
    desc: "The unglamorous backbone — versioning, monitoring, CI/CD for models that stay healthy.",
    tags: ["Pipelines", "Observability", "Drift detection"],
    visualClass: "cat__visual--mlops",
    kind: "mlops",
  },
  {
    num: "07",
    title: "Model Training",
    accent: "#7C3AED",
    desc: "Fine-tunes and bespoke models trained on your data, tuned for your exact edge cases.",
    tags: ["Fine-tuning", "Distillation", "Evals"],
    visualClass: "cat__visual--train",
    kind: "train",
  },
];

/**
 * Seven categories laid out side-by-side and traversed by a pinned
 * horizontal scroll on desktop. The master sweep tween is reused as a
 * containerAnimation so per-panel visual tilts stay in sync with their
 * own viewport position inside the transformed track.
 *
 * Below 860px the CSS stacks panels vertically and we skip the pin entirely.
 */
export function Categories() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const horizontal =
      window.matchMedia("(min-width:861px)").matches &&
      !window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (!horizontal) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const amount = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      const sweep = gsap.to(track, {
        x: () => -amount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${amount()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".cat", section).forEach((cat) => {
        const vis = cat.querySelector<HTMLElement>(".cat__visual");
        if (vis) {
          gsap.fromTo(
            vis,
            { rotate: -10 },
            {
              rotate: 18,
              ease: "none",
              scrollTrigger: {
                trigger: cat,
                containerAnimation: sweep,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }

        // Title entrance — per-character stagger + vertical accent wipe.
        // Scrub-tying the colour to the same scroll that moves the card made
        // the reveal invisible (everything moved together). This timeline
        // is untethered: ScrollTrigger only decides WHEN to play it, GSAP
        // controls the actual motion, so the chars + colour are clearly
        // independent of the card sliding.
        const chars = cat.querySelectorAll<HTMLElement>(".cat__char-inner");
        const ENTER_CHARS = { yPercent: 0, opacity: 1, rotateX: 0, skewX: 0 };
        const EXIT_CHARS  = { yPercent: 115, opacity: 0, rotateX: -75, skewX: 10 };
        gsap.set(chars, EXIT_CHARS);
        gsap.set(cat, { "--reveal": "100%" });

        const enter = () => {
          gsap.to(chars, {
            ...ENTER_CHARS,
            duration: 0.95,
            ease: "expo.out",
            stagger: 0.045,
            overwrite: true,
          });
          gsap.to(cat, {
            "--reveal": "0%",
            duration: 0.95,
            delay: 0.18,
            ease: "power3.out",
            overwrite: true,
          });
        };
        const exit = () => {
          gsap.to(chars, {
            ...EXIT_CHARS,
            duration: 0.45,
            ease: "power2.in",
            stagger: { each: 0.02, from: "end" },
            overwrite: true,
          });
          gsap.to(cat, {
            "--reveal": "100%",
            duration: 0.4,
            ease: "power2.in",
            overwrite: true,
          });
        };

        ScrollTrigger.create({
          trigger: cat,
          containerAnimation: sweep,
          start: "left 80%",
          end: "right 20%",
          onEnter: enter,
          onEnterBack: enter,
          onLeave: exit,
          onLeaveBack: exit,
        });
      });
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="cats" id="categories" data-screen-label="Categories" ref={sectionRef}>
      <div className="cats__track" id="catsTrack" ref={trackRef}>
        <div className="cats__intro">
          <span className="cats__intro-idx">WHAT WE DO</span>
          <h2 className="cats__intro-h">
            Seven
            <br />
            disciplines.
            <br />
            One studio.
          </h2>
          <span className="cats__intro-hint">Scroll → to traverse</span>
        </div>

        {CATS.map((c, i) => (
          <article
            key={c.num}
            className="cat"
            data-cat={i + 1}
            style={{ ["--accent" as string]: c.accent } as React.CSSProperties}
            data-cursor="enter"
            data-label="EXPLORE"
          >
            <span className="cat__num">{c.num}</span>
            <h3 className="cat__title" data-text={c.title}>
              {/* Each word is one atomic inline-block of per-char cells.
                  Spaces between words are real text nodes, so wrap points
                  match the ::after pseudo (a single text run that also
                  only breaks at spaces). Without word-wrapping, the
                  char-by-char outline drifts onto a different line from
                  the accent overlay. */}
              {c.title.split(" ").map((word, wi, words) => (
                <span key={`${c.num}-w${wi}`} className="cat__word" aria-hidden="true">
                  {Array.from(word).map((ch, ci) => (
                    <span key={ci} className="cat__char">
                      <span className="cat__char-inner">{ch}</span>
                    </span>
                  ))}
                  {wi < words.length - 1 ? " " : null}
                </span>
              ))}
              <span className="cat__title-sr">{c.title}</span>
            </h3>
            <p className="cat__desc">{c.desc}</p>
            <ul className="cat__tags">
              {c.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className={`cat__visual ${c.visualClass}`}>
              <CategoryVisual kind={c.kind} />
            </div>
          </article>
        ))}

        <div className="cats__end">
          <h2>
            Need all
            <br />
            seven?
          </h2>
          <a href="#contact" className="cats__end-cta" data-cursor="magnetic" data-label="LET'S TALK">
            That&apos;s the point. →
          </a>
        </div>
      </div>
    </section>
  );
}
