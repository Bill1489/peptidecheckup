import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compoundsForGoal } from "@/data/compounds";
import { productsForGoal } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { assessmentHref, getSymptom, goalForSymptom, SYMPTOMS } from "@/lib/funnel";
import { ComplianceStrip } from "@/components/marketing/compliance-strip";
import { ASSESSMENT_MINUTES } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { GoalProducts } from "@/components/marketing/goal-products";
import { IndexHead } from "@/components/marketing/index-head";
import { JsonLd } from "@/components/marketing/json-ld";
import { LandingHero } from "@/components/marketing/landing-hero";
import { NumberedRows } from "@/components/marketing/page-shell";
import { StickyCta } from "@/components/marketing/sticky-cta";

type Params = { symptom: string };

/** Ad traffic: keep the page focused — four products at most. */
const MAX_PRODUCTS = 4;

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
  const researched = compoundsForGoal(goal.id).length;
  const allProducts = productsForGoal(goal.id);
  const products = allProducts.slice(0, MAX_PRODUCTS);
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
          isPartOf: { "@type": "WebSite", name: BRAND.displayName, url: BRAND.url },
        }}
      />

      <LandingHero symptom={def} goal={goal} href={href} researchedCount={researched} productCount={allProducts.length} />

      <section className="rule-b">
        <div className="container-x py-12 lg:py-16">
          <IndexHead
            index="01"
            label="What the checkup checks"
            title={`Four things it checks for ${goalLower}.`}
            description={`${ASSESSMENT_MINUTES} minutes of structured questions — categories, not essays — run through a deterministic rules engine against the evidence and regulatory database.`}
          />
          <NumberedRows className="mt-8" items={def.checks.map((check) => ({ body: check }))} />
        </div>
      </section>

      <GoalProducts goal={goal} products={products} total={allProducts.length} />

      <section className="rule-b">
        <div className="container-x py-8 lg:py-10">
          <ComplianceStrip />
        </div>
      </section>

      <CtaBand
        label={goal.label}
        title={`Take the ${ASSESSMENT_MINUTES}-minute checkup for ${goalLower}.`}
        href={href}
        cta="Start the checkup"
        secondary={{ href: "/how-it-works", label: "How it works" }}
      />

      <StickyCta href={href} label="Start the checkup" note={`≈${ASSESSMENT_MINUTES} min`} />
    </div>
  );
}
