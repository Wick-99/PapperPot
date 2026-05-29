"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PricingCard } from "./PricingCard";
import type { Service } from "@/data/services";

/**
 * The three pricing tiers, staggered in on scroll. On mobile this stacks
 * vertically with the recommended card pulled to the top (it's the
 * conversion target).
 */
export function PricingTrio({ service }: { service: Service }) {
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const ctx = gsap.context(() => {
			gsap.from(".plan", {
				y: 60,
				opacity: 0,
				rotateX: 12,
				duration: 0.9,
				ease: "power3.out",
				stagger: 0.12,
				scrollTrigger: { trigger: root, start: "top 80%", once: true },
			});
			gsap.from(".plans__aside > *", {
				y: 30,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out",
				stagger: 0.12,
				scrollTrigger: { trigger: root, start: "top 80%", once: true },
			});
		}, root);

		return () => {
			ctx.revert();
			ScrollTrigger.refresh();
		};
	}, []);

	return (
		<section
			className="plans"
			id="plans"
			ref={rootRef}
			style={
				{ ["--accent" as string]: service.accent } as React.CSSProperties
			}>
			<header className="plans__head">
				<div className="plans__head-text">
					<span className="plans__idx">
						<i aria-hidden="true">◢</i> CHOOSE YOUR PLAN
					</span>
					<h2 className="plans__h">
						Three tiers.
						<br />
						One you can <em>actually ship.</em>
					</h2>
					<p className="plans__note">
						Every plan ships with full source code. No vendor lock-in, no
						recurring fees, no surprise invoices.
					</p>
				</div>
				<PlansAside service={service} />
			</header>

			<div className="plans__grid">
				{service.plans.map((p) => (
					<PricingCard key={p.tier} plan={p} accent={service.accent} />
				))}
			</div>
		</section>
	);
}

/**
 * Decorative aside on the right of the pricing header.
 *
 * A 3D fanned-out stack of three tier "teaser" cards — Basic at the
 * back, Standard in the middle, Premium pulled forward with accent
 * glow + "POPULAR" tag. Each card shows the real starting price pulled
 * from the service data so the aside actually previews the trio below.
 *
 * Surrounded by: a rotating "50% OFF" wax-seal badge, a drifting paper
 * plane, two pulsing accent dots, and an ambient accent glow halo.
 * All pure decoration → aria-hidden.
 */
function PlansAside({ service }: { service: Service }) {
	const [basic, standard, premium] = service.plans;
	const startingPrice = (p: { offerPrice: string }) =>
		p.offerPrice.split(/[–-]/)[0].trim();

	return <aside className="plans__aside" aria-hidden="true"></aside>;
}
