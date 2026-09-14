import type { Metadata } from "next";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { HomeHero } from "@/components/marketing/home-hero";
import { Pillars } from "@/components/marketing/pillars";
import { HowItWorksSteps } from "@/components/marketing/how-it-works-steps";
import { GoalGrid } from "@/components/marketing/goal-grid";
import { Grades } from "@/components/marketing/grades";
import { WhyNotChatbot } from "@/components/marketing/why-not-chatbot";
import { FeaturedCompounds } from "@/components/marketing/featured-compounds";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaBand } from "@/components/marketing/cta-band";
import { JsonLd } from "@/components/marketing/json-ld";
import { HOME_FAQ } from "@/components/marketing/faq-data";
import { buildReportPreview } from "@/components/marketing/report-preview-data";
import { ASSESSMENT_MINUTES, trustFacts } from "@/components/marketing/copy";

export const metadata: Metadata = {
  title: { absolute: `${BRAND.displayName} — Compare peptides & check your fit` },
  description: BRAND.description,
  alternates: { canonical: "/" },
  openGraph: {
      images: OG_IMAGES,
    title: `${BRAND.displayName} — Compare peptides & check your fit`,
    description: BRAND.shortDescription,
    url: "/",
  },
};

const HERO_SUBCOPY = `A ${ASSESSMENT_MINUTES}-minute assessment maps your goal, medical history and medicines against published trials and regulatory status — then gives you a report you can take to a clinician. No account. Nothing to buy.`;

export default function HomePage() {
  const preview = buildReportPreview();
  const facts = trustFacts();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: BRAND.displayName,
      legalName: BRAND.legalName,
      url: BRAND.url,
      email: BRAND.supportEmail,
      foundingDate: String(BRAND.foundedYear),
      description: BRAND.shortDescription,
      sameAs: Object.values(BRAND.social),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BRAND.displayName,
      alternateName: BRAND.name,
      url: BRAND.url,
      description: BRAND.description,
      inLanguage: "en-GB",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: HOME_FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeHero facts={facts} preview={preview} subcopy={HERO_SUBCOPY} />
      <Pillars />
      <HowItWorksSteps />
      <GoalGrid />
      <Grades />
      <WhyNotChatbot />
      <FeaturedCompounds />
      <FaqSection />
      <CtaBand />
    </>
  );
}
