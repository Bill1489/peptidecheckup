import type { Metadata } from "next";
import { productPath } from "@/components/commerce/product-utils";
import { getProductBySlug, PRODUCTS } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { CheckupSteps } from "@/components/marketing/checkup-steps";
import { ASSESSMENT_MINUTES } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqSection } from "@/components/marketing/faq-section";
import { HOME_FAQ } from "@/components/marketing/faq-data";
import { HomeHero } from "@/components/marketing/home-hero";
import { JsonLd } from "@/components/marketing/json-ld";
import { LabPanel } from "@/components/marketing/lab-panel";
import { PenFormat } from "@/components/marketing/pen-format";
import { ProblemGrid } from "@/components/marketing/problem-grid";
import { RangeEvidence } from "@/components/marketing/range-evidence";
import { RangeStrip } from "@/components/marketing/range-strip";

const TITLE = `${BRAND.displayName} — ${BRAND.tagline}`;

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

/** A pen with a hand photograph, by preference; the hand shots are the most editorial. */
function heroPen(preferred: string[]) {
  for (const slug of preferred) {
    const p = getProductBySlug(slug);
    if (p?.images.some((i) => i.kind === "hand")) return p;
  }
  return PRODUCTS.find((p) => p.images.some((i) => i.kind === "hand")) ?? PRODUCTS[0];
}

export default function HomePage() {
  const hero = heroPen(["nad", "klow"]);
  const boxPen = heroPen(["klow", "mots-c", "tesamorelin"].filter((s) => s !== hero.slug));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: BRAND.name,
      alternateName: BRAND.displayName,
      legalName: BRAND.legalName,
      slogan: BRAND.tagline,
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
      name: BRAND.name,
      alternateName: `${BRAND.displayName} · ${BRAND.descriptor}`,
      url: BRAND.url,
      description: BRAND.description,
      inLanguage: "en-GB",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `The ${BRAND.range.name} range at ${BRAND.displayName}`,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: PRODUCTS.length,
      itemListElement: PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${BRAND.url}${productPath(p.slug)}`,
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
      <HomeHero product={hero} />
      <RangeStrip />
      <ProblemGrid />
      <CheckupSteps />
      <PenFormat product={boxPen} />
      <LabPanel />
      <RangeEvidence />
      <FaqSection />
      <CtaBand title={`Find your pen in ${ASSESSMENT_MINUTES} minutes.`} secondary={{ href: "/shop", label: "Or shop the range" }} />
    </>
  );
}
