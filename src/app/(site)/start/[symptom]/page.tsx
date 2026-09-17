import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { assessmentHref, getSymptom, goalForSymptom, pensForSymptom, SYMPTOMS } from "@/lib/funnel";
import { ComplianceStrip } from "@/components/marketing/compliance-strip";
import { ASSESSMENT_MINUTES, CHECKUP_SHORT } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { IndexHead } from "@/components/marketing/index-head";
import { JsonLd } from "@/components/marketing/json-ld";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingPens } from "@/components/marketing/landing-pens";
import { NumberedRows } from "@/components/marketing/page-shell";
import { StickyCta } from "@/components/marketing/sticky-cta";

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
  return {
    title: goal.funnelHeadline,
    description: def.metaDescription,
    alternates: { canonical: `/start/${def.slug}/` },
    openGraph: {
      images: OG_IMAGES,
      title: `${goal.funnelHeadline} · ${BRAND.displayName}`,
      description: def.metaDescription,
      url: `/start/${def.slug}/`,
    },
  };
}

export default async function SymptomLandingPage({ params }: { params: Promise<Params> }) {
  const { symptom } = await params;
  const def = getSymptom(symptom);
  if (!def) notFound();

  const goal = goalForSymptom(def);
  const href = assessmentHref(def);
  const pens = pensForSymptom(def);
  const goalLower = goal.label.toLowerCase();

  return (
    <div className="pb-20 md:pb-0">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: goal.funnelHeadline,
          description: def.metaDescription,
          url: `${BRAND.url}/start/${def.slug}/`,
          isPartOf: { "@type": "WebSite", name: BRAND.name, url: BRAND.url },
          ...(pens.length > 0
            ? {
                mentions: pens.map((p) => ({
                  "@type": "Product",
                  name: p.name,
                  url: `${BRAND.url}/shop/${p.slug}/`,
                })),
              }
            : {}),
        }}
      />

      <LandingHero symptom={def} goal={goal} href={href} pens={pens} />

      <LandingPens symptom={def} goal={goal} pens={pens} href={href} />

      <section className="rule-b">
        <div className="container-x py-12 lg:py-16">
          <IndexHead
            index="02"
            label={`What the ${CHECKUP_SHORT} checks`}
            title={`Four things it checks for ${goalLower}.`}
            description={`${ASSESSMENT_MINUTES} minutes of structured questions — categories, not essays — run through a deterministic rules engine against the evidence and regulatory database, then scored against the range.`}
          />
          <NumberedRows className="mt-8" items={def.checks.map((check) => ({ body: check }))} />
        </div>
      </section>

      <section className="rule-b">
        <div className="container-x py-8 lg:py-10">
          <ComplianceStrip />
        </div>
      </section>

      <CtaBand
        label={goal.label}
        title={`Take the ${ASSESSMENT_MINUTES}-minute ${CHECKUP_SHORT} for ${goalLower}.`}
        href={href}
        secondary={{ href: "/how-it-works", label: "How it works" }}
      />

      <StickyCta href={href} label={`Start the ${CHECKUP_SHORT}`} note={`≈${ASSESSMENT_MINUTES} min`} />
    </div>
  );
}
