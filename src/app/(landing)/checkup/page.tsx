import type { Metadata } from "next";
import { CheckupLanding, LANDING_FAQ } from "@/components/landing/checkup-landing";
import { ASSESSMENT_MINUTES, CHECKUP_SHORT } from "@/components/marketing/copy";
import { JsonLd } from "@/components/marketing/json-ld";
import { PRODUCTS } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";

const TITLE = `Take the ${ASSESSMENT_MINUTES}-minute ${CHECKUP_SHORT}`;
const DESCRIPTION = `Not sure which peptide fits? Answer short questions about your goal, history and medicines; a rules engine checks them against the evidence and scores all ${PRODUCTS.length} ${BRAND.range.name} pens. Land on the one that fits — or be told not to buy. Free, no account.`;

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · ${BRAND.displayName}` },
  description: DESCRIPTION,
  alternates: { canonical: "/checkup/" },
  openGraph: {
    images: OG_IMAGES,
    title: TITLE,
    description: DESCRIPTION,
    url: "/checkup/",
  },
};

/**
 * `/checkup/` — the generic paid-traffic landing page. Ads that do not name a
 * symptom land here; symptom-matched creatives use `/checkup/{symptom}/`.
 */
export default function CheckupLandingPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: TITLE,
            description: DESCRIPTION,
            url: `${BRAND.url}/checkup/`,
            isPartOf: { "@type": "WebSite", name: BRAND.name, url: BRAND.url },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: LANDING_FAQ.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <CheckupLanding />
    </>
  );
}
