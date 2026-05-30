"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeScrollVelocity } from "@/lib/scroll-velocity";

const VALID_CODES: Record<string, string> = {
  PAP1000: "₹1000 OFF APPLIED TO YOUR PROJECT",
};

const ROLL_WORDS = [
  "LET'S TALK —",
  "LET'S BUILD —",
  "LET'S SCALE —",
  "LET'S CREATE —",
  "LET'S EVOLVE —",
];

/**
 * Closer — contact section.
 * • Endlessly rolling type whose speed is goosed by scroll velocity.
 * • Promo accordion with an easter-egg code that triggers confetti.
 * • Inline form validation with a per-field red error line.
 */
export function Closer() {
  const rollRef = useRef<HTMLDivElement>(null);
  const velRef = useRef(0);
  const rollYRef = useRef(0);

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMsg, setPromoMsg] = useState<string>("Try a code from our socials.");
  const [promoErr, setPromoErr] = useState(false);
  const [promoValue, setPromoValue] = useState("");
  const [promoBadgeTxt, setPromoBadgeTxt] = useState("₹1000 OFF APPLIED TO YOUR PROJECT");

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const nameLineRef = useRef<HTMLSpanElement>(null);
  const emailLineRef = useRef<HTMLSpanElement>(null);
  const briefLineRef = useRef<HTMLSpanElement>(null);
  const promoFieldLineRef = useRef<HTMLSpanElement>(null);
  const promoInputRef = useRef<HTMLInputElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // velocity-driven rolling type
  useEffect(() => {
    const unsub = subscribeScrollVelocity((v) => {
      velRef.current = v;
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 860px), (hover: none), (pointer: coarse)").matches;
    if (reduce || mobile) {
      return unsub;
    }

    let raf = 0;
    let active = false;
    const loop = () => {
      if (!active) return;
      raf = requestAnimationFrame(loop);
      const roll = rollRef.current;
      if (!roll) return;
      rollYRef.current -= 0.4 + Math.min(Math.abs(velRef.current) * 0.6, 14);
      const h = roll.scrollHeight / 2;
      if (h && rollYRef.current <= -h) rollYRef.current += h;
      roll.style.transform = `translateY(${rollYRef.current}px)`;
    };
    const start = () => {
      if (active) return;
      active = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const roll = rollRef.current;
    const io = roll
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) start();
            else stop();
          },
          { rootMargin: "240px" },
        )
      : null;

    if (roll && io) io.observe(roll);
    else start();

    return () => {
      stop();
      io?.disconnect();
      unsub();
    };
  }, []);

  // promo panel height transitions
  useEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;
    panel.style.height = promoOpen ? `${inner.offsetHeight}px` : "0px";
    const onResize = () => {
      if (promoOpen && panel && inner) panel.style.height = `${inner.offsetHeight}px`;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [promoOpen]);

  const applyPromo = () => {
    const code = promoValue.trim().toUpperCase();
    if (VALID_CODES[code]) {
      if (promoApplied) return;
      setPromoApplied(true);
      setPromoBadgeTxt(VALID_CODES[code]);
      setPromoMsg("Locked in. See you at checkout.");
      setPromoErr(false);
      if (promoFieldLineRef.current) promoFieldLineRef.current.style.background = "var(--green)";
      if (promoInputRef.current) promoInputRef.current.style.color = "var(--green)";
      window.__ppConfetti?.burst(badgeRef.current?.getBoundingClientRect() ?? null);
    } else {
      setPromoMsg(code ? `"${code}" isn't a valid code.` : "Enter a code first.");
      setPromoErr(true);
      const panel = panelRef.current;
      if (panel) {
        panel.animate(
          [
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(0)" },
          ],
          { duration: 240, easing: "ease-out" },
        );
      }
    }
  };

  const flashErr = (ref: React.RefObject<HTMLSpanElement | null>) => {
    if (!ref.current) return;
    ref.current.style.background = "var(--pink)";
    window.setTimeout(() => {
      if (ref.current) ref.current.style.background = "";
    }, 1500);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!name.trim()) {
      ok = false;
      flashErr(nameLineRef);
    }
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      ok = false;
      flashErr(emailLineRef);
    }
    if (!brief.trim()) {
      ok = false;
      flashErr(briefLineRef);
    }
    if (!ok) return;
    setSubmitted(true);
    if (!promoApplied) window.__ppConfetti?.burst(null);
  };

  return (
    <section className="closer" id="contact" data-screen-label="Contact">
      <div className="closer__left" aria-hidden="true">
        <div className="roll" id="roll" ref={rollRef}>
          {[...ROLL_WORDS, ...ROLL_WORDS].map((w, i) => (
            <span key={`${w}-${i}`}>{w}</span>
          ))}
        </div>
      </div>

      <div className="closer__right">
        <span className="closer__idx">START A PROJECT</span>
        <h2 className="closer__h">
          Tell us what
          <br />
          you&apos;re building.
        </h2>

        <form className="form" id="contactForm" onSubmit={onSubmit} noValidate>
          <div className="field">
            <input
              type="text"
              id="f-name"
              required
              autoComplete="name"
              placeholder=" "
              data-cursor
              value={name}
              onChange={(e) => setName(e.target.value)}
              suppressHydrationWarning
            />
            <label htmlFor="f-name">Your name</label>
            <span className="field__line" ref={nameLineRef} />
          </div>

          <div className="field">
            <input
              type="email"
              id="f-email"
              required
              autoComplete="email"
              placeholder=" "
              data-cursor
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suppressHydrationWarning
            />
            <label htmlFor="f-email">Email</label>
            <span className="field__line" ref={emailLineRef} />
          </div>

          <div className="field">
            <input
              type="text"
              id="f-brief"
              required
              placeholder=" "
              data-cursor
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              suppressHydrationWarning
            />
            <label htmlFor="f-brief">What are you building?</label>
            <span className="field__line" ref={briefLineRef} />
          </div>

          <button
            type="button"
            className={`promo__toggle ${promoOpen ? "is-open" : ""}`}
            id="promoToggle"
            data-cursor="enter"
            data-label="OPEN"
            onClick={() => setPromoOpen((v) => !v)}
            suppressHydrationWarning
          >
            <span className="promo__chev">+</span> Got a Paperpot promo?
          </button>

          <div className="promo" id="promoPanel" ref={panelRef}>
            <div className="promo__inner" ref={innerRef}>
              <div className="field field--promo">
                <input
                  type="text"
                  id="f-promo"
                  placeholder=" "
                  autoComplete="off"
                  data-cursor
                  ref={promoInputRef}
                  value={promoValue}
                  onChange={(e) => setPromoValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyPromo();
                    }
                  }}
                  suppressHydrationWarning
                />
                <label htmlFor="f-promo">Promo code</label>
                <span className="field__line" ref={promoFieldLineRef} />
                <button
                  type="button"
                  className="promo__apply"
                  id="promoApply"
                  data-cursor="magnetic"
                  data-label="APPLY"
                  onClick={applyPromo}
                  suppressHydrationWarning
                >
                  APPLY
                </button>
              </div>
              <div
                className={`promo__badge ${promoApplied ? "is-on" : ""}`}
                id="promoBadge"
                ref={badgeRef}
              >
                <span className="promo__badge-emoji">🎉</span>
                <span className="promo__badge-txt">{promoBadgeTxt}</span>
              </div>
              <p className={`promo__hint ${promoErr ? "is-err" : ""}`} id="promoHint">
                {promoMsg}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="form__submit"
            id="formSubmit"
            data-cursor="magnetic"
            data-label="SEND"
            suppressHydrationWarning
          >
            <span>{submitted ? "SENT" : "SEND IT"}</span>{" "}
            <span className="form__submit-arrow">→</span>
          </button>
          <p className={`form__success ${submitted ? "is-on" : ""}`} id="formSuccess">
            Transmission received. We&apos;ll be in touch within 24h.
          </p>
        </form>

        <div className="closer__meta">
          <a href="mailto:hello@paperpot.studio" data-cursor>
            hello@paperpot.studio
          </a>
          <div className="closer__social">
            <a href="#" data-cursor>Instagram</a>
            <a href="#" data-cursor>X / Twitter</a>
            <a href="#" data-cursor>LinkedIn</a>
          </div>
        </div>
      </div>
    </section>
  );
}
