import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckupLanding } from "@/components/landing/checkup-landing";
import { ASSESSMENT_MINUTES, CHECKUP } from "@/components/marketing/copy";
import { JsonLd } from "@/components/marketing/json-ld";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { getSymptom, goalForSymptom, SYMPTOMS } from "@/lib/funnel";

type Params = { symptom: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return SYMPTOMS.map((s) => ({ symptom: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { symptom } = await params;
  const def = getSymptom(symptom);
  if (!def) return {};
  const goal = goalForSymptom(def);
  const title = `${goal.funnelHeadline} Take the ${ASSESSMENT_MINUTES}-minute ${CHECKUP}`;
  return {
    title: { absolute: `${title} · ${BRAND.displayName}` },
    description: def.metaDescription,
    // Message-matched variants of /checkup/ for paid traffic; the organic page for this goal is /start/{symptom}/.
    robots: { index: false, follow: true },
    alternates: { canonical: `/checkup/${def.slug}/` },
    openGraph: {
      images: OG_IMAGES,
      title,
      description: def.metaDescription,
      url: `/checkup/${def.slug}/`,
    },
  };
}

/**
 * `/checkup/{symptom}/` — the landing page with the ad's own question as the
 * headline. One static page per funnel entry point (see `SYMPTOMS`).
 */
export default async function CheckupSymptomLandingPage({ params }: { params: Promise<Params> }) {
  const { symptom } = await params;
  const def = getSymptom(symptom);
  if (!def) notFound();
  const goal = goalForSymptom(def);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${goal.funnelHeadline} Take the ${ASSESSMENT_MINUTES}-minute ${CHECKUP}`,
          description: def.metaDescription,
          url: `${BRAND.url}/checkup/${def.slug}/`,
          isPartOf: { "@type": "WebSite", name: BRAND.name, url: BRAND.url },
        }}
      />
      <CheckupLanding symptom={def} />
    </>
  );
}
