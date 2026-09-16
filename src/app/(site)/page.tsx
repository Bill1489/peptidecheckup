import type { Metadata } from "next";
import { PRODUCTS, purchasable } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { Bestsellers } from "@/components/marketing/bestsellers";
import { CheckupSteps } from "@/components/marketing/checkup-steps";
import { CtaBand } from "@/components/marketing/cta-band";
import { EvidenceSection } from "@/components/marketing/evidence-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { HOME_FAQ } from "@/components/marketing/faq-data";
import { GoalGrid } from "@/components/marketing/goal-grid";
import { HomeHero } from "@/components/marketing/home-hero";
import { JsonLd } from "@/components/marketing/json-ld";
import { LabPanel } from "@/components/marketing/lab-panel";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { ASSESSMENT_MINUTES } from "@/components/marketing/copy";

const TITLE = `${BRAND.displayName} — Batch-tested peptides, matched to you`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: BRAND.description,
  alternates: { canonical: "/" },
  openGraph: {
    images: OG_IMAGES,
    title: TITLE,
    description: BRAND.shortDescription,
    url: "/",
  },
};

/** Featured products for the hero; falls back to the front of the catalogue. */
function featuredProducts() {
  const featured = PRODUCTS.filter((p) => p.featured);
  const rest = PRODUCTS.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, 4);
}

/** Bestsellers for the row; pads with purchasable products so the row is never thin. */
function bestsellerProducts() {
  const flagged = PRODUCTS.filter((p) => p.bestseller);
  const pad = PRODUCTS.filter((p) => !p.bestseller && purchasable(p));
  return [...flagged, ...pad].slice(0, 6);
}

export default function HomePage() {
  const featured = featuredProducts();
  const bestsellers = bestsellerProducts();

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
      address: { "@type": "PostalAddress", addressCountry: BRAND.homeCountry },
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
      "@type": "ItemList",
      name: "Featured products",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: featured.length,
      itemListElement: featured.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${BRAND.url}/shop/${p.slug}/`,
      })),
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
      <HomeHero products={featured} />
      <TrustStrip />
      <GoalGrid />
      <Bestsellers products={bestsellers} />
      <CheckupSteps />
      <LabPanel />
      <EvidenceSection />
      <FaqSection />
      <CtaBand title={`Find your match in ${ASSESSMENT_MINUTES} minutes.`} />
    </>
  );
}
