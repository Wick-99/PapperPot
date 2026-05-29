import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function ServiceNotFound() {
  return (
    <SiteShell>
      <main id="smooth-content" className="srv-page srv-404">
        <div className="srv-404__inner">
          <span className="srv-404__idx">◢ 404 — SERVICE NOT FOUND</span>
          <h1 className="srv-404__h">
            That service
            <br />
            <em>doesn&apos;t exist yet.</em>
          </h1>
          <p className="srv-404__p">
            We only ship seven. Pick one of the seven, or talk to us about
            something we haven&apos;t built yet.
          </p>
          <div className="srv-404__row">
            <Link href="/#categories" className="srv-cta__btn srv-cta__btn--solid" data-cursor="magnetic" data-label="BACK">
              <span>See all services</span>
              <i aria-hidden="true">→</i>
            </Link>
            <Link href="/#contact" className="srv-cta__btn srv-cta__btn--ghost" data-cursor="magnetic" data-label="TALK">
              <span>Tell us what you need</span>
              <i aria-hidden="true">↗</i>
            </Link>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
