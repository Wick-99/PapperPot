import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, SERVICE_SLUGS } from "@/data/services";
import { SiteShell } from "@/components/SiteShell";
import { Footer } from "@/components/Footer";
import { ServiceHero } from "@/components/services/ServiceHero";
import { PricingTrio } from "@/components/services/PricingTrio";
import { ServiceExamples } from "@/components/services/ServiceExamples";
import { ServiceCTA } from "@/components/services/ServiceCTA";

interface PageProps {
	params: Promise<{ slug: string }>;
}

/** Pre-render every service page at build time. */
export function generateStaticParams() {
	return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const service = SERVICES[slug];
	if (!service) return { title: "Service not found — Papperpot" };
	return {
		title: `${service.title} — Papperpot`,
		description: service.promise,
		openGraph: {
			title: `${service.title} — Papperpot`,
			description: service.promise,
		},
	};
}

export default async function ServicePage({ params }: PageProps) {
	const { slug } = await params;
	const service = SERVICES[slug];
	if (!service) notFound();

	return (
		<SiteShell>
			<main id="smooth-content" className="srv-page">
				<ServiceHero service={service} />
				<PricingTrio service={service} />
				<ServiceExamples service={service} />
				<ServiceCTA service={service} />
				<Footer />
			</main>
		</SiteShell>
	);
}
