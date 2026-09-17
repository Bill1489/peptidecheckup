import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { RangeCompare } from "@/components/commerce/range-compare";
import { ShopGrid, ShopGridSkeleton } from "@/components/commerce/shop-grid";
import { productPath } from "@/components/commerce/product-utils";
import { JsonLd } from "@/components/marketing/json-ld";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { asset } from "@/lib/utils";

const count = PRODUCTS.length;
const coaCount = PRODUCTS.filter((p) => p.coa).length;
const blends = PRODUCTS.filter((p) => (p.blend?.length ?? 0) > 1).length;
const names = PRODUCTS.map((p) => p.name);
const nameList = `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

export const metadata: Metadata = {
  title: `The range — ${count} pre-filled peptide pens, every lot tested`,
  description: `${nameList}: ${count} pre-filled 3 mL dose-dial pens from ${BRAND.name}, ${blends} of them blends, each with a published certificate of analysis. UK pricing, VAT included, free UK shipping over ${formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })}. The ${BRAND.assessmentName} tells you which pen fits — or not to buy.`,
  alternates: { canonical: "/shop/" },
  openGraph: {
    images: OG_IMAGES,
    title: `The range · ${count} pens, one format, a certificate per lot`,
    description: `${nameList}. Pre-filled 3 mL dose-dial pens for research use, ${coaCount} certificates of analysis published.`,
    url: "/shop/",
    siteName: BRAND.displayName,
  },
};

const STATS: { label: string; value: string }[] = [
  { label: "Pens in the range", value: String(count) },
  { label: "Certificates published", value: String(coaCount) },
  { label: "Free UK shipping", value: `over ${formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })}` },
  { label: "Dispatch", value: "Same day before 2 pm · chilled" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${BRAND.displayName} — the range`,
  url: `${BRAND.url}/shop/`,
  inLanguage: "en-GB",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: count,
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${BRAND.url}${productPath(p.slug)}`,
      ...(p.images[0] ? { image: `${BRAND.url}${asset(p.images[0].src)}` } : {}),
    })),
  },
};

export default function ShopPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Header row */}
      <section className="rule-b">
        <div className="container-x grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="label-mono">Six pens · One format · CoA per lot</p>
            <h1 className="mt-4 text-[3rem] uppercase leading-[0.92] sm:text-[4.5rem] lg:text-[6rem]">The range</h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[16px]">
              Six pre-filled 3 mL dose-dial pens. No vials, no reconstitution, no drawing up. Every lot is tested by an independent laboratory
              and its certificate is published against the batch number on the carton. Sold for research use; the {BRAND.assessmentName} tells
              you which pen fits your goal — and when none does.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px border border-ink bg-ink sm:grid-cols-4 lg:grid-cols-2">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white px-4 py-3">
                <dt className="label-mono">{s.label}</dt>
                <dd className="mt-1 font-mono text-[13.5px] text-ink tnum">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Grid */}
      <section className="container-x py-8 lg:py-10" aria-label="The range">
        <Suspense fallback={<ShopGridSkeleton />}>
          <ShopGrid />
        </Suspense>
      </section>

      {/* Compare */}
      <section className="rule-t bg-paper-2" aria-labelledby="compare-heading">
        <div className="container-x py-12 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-mono">Side by side</p>
              <h2 id="compare-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
                Compare the range
              </h2>
            </div>
            <p className="max-w-md text-[13px] leading-relaxed text-muted">
              Evidence grades come from the compound records — for blends, the strongest component grade for the pen&apos;s main goal. WADA status
              covers every component in the pen.
            </p>
          </div>
          <RangeCompare className="mt-6 bg-white" />
        </div>
      </section>

      {/* Assessment strip */}
      <section className="rule-t bg-ink text-white">
        <div className="container-x grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-14">
          <div>
            <p className="label-mono text-white/60">Not sure which?</p>
            <p className="mt-4 max-w-3xl font-display text-balance text-[1.5rem] uppercase leading-[1.02] sm:text-[2rem] lg:text-[2.5rem]">
              Take the 7-minute {BRAND.assessmentName} — it ends at the right pen, or tells you not to buy.
            </p>
          </div>
          <Button href="/assessment/" variant="inverted" size="lg" className="w-full lg:w-auto">
            Start the {BRAND.assessmentName}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </section>
    </>
  );
}
