"use client";

import Link from "next/link";
import type { Service } from "@/data/services";

/**
 * Closing CTA on each service page. Routes to the home contact section
 * via Lenis-controlled hash navigation (handled by SmoothScrollProvider).
 */
export function ServiceCTA({ service }: { service: Service }) {
  return (
    <section
      className="srv-cta"
      style={{ ["--accent" as string]: service.accent } as React.CSSProperties}
    >
      <div className="srv-cta__inner">
        <span className="srv-cta__idx"><i aria-hidden="true">◢</i> READY?</span>
        <h2 className="srv-cta__h">
          Limited slots,
          <br />
          <em>50% off</em> while it lasts.
        </h2>
        <p className="srv-cta__note">
          Full source code handover with every plan. DM, mail, or drop your brief — we&apos;ll be back within 24h.
        </p>
        <div className="srv-cta__row">
          <Link
            href="/#contact"
            className="srv-cta__btn srv-cta__btn--solid"
            data-cursor="magnetic"
            data-label="START"
          >
            <span>Start a project</span>
            <i aria-hidden="true">→</i>
          </Link>
          <Link
            href="/#categories"
            className="srv-cta__btn srv-cta__btn--ghost"
            data-cursor="magnetic"
            data-label="ALL"
          >
            <span>Browse all services</span>
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
        <div className="srv-cta__meta">
          <span>Service · {service.category}</span>
          <span>·</span>
          <span>Index {service.num} / 07</span>
        </div>
      </div>
    </section>
  );
}
