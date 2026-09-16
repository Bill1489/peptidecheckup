import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid, ShopGridSkeleton } from "@/components/commerce/shop-grid";
import { productPath } from "@/components/commerce/product-utils";
import { JsonLd } from "@/components/marketing/json-ld";
import { PRODUCTS, purchasable } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";

const count = PRODUCTS.length;
const researchCount = PRODUCTS.filter((p) => p.channel === "research" && purchasable(p)).length;
const coaCount = PRODUCTS.filter((p) => p.coa).length;
const consultationCount = PRODUCTS.filter((p) => p.availability === "consultation").length;

export const metadata: Metadata = {
  title: `Shop — ${count} batch-tested peptides, kits and supplies`,
  description: `${researchCount} research peptides with a published certificate of analysis per batch, ${consultationCount} prescription medicines via consultation, collagen, GHK-Cu serum, kits and reconstitution supplies. UK pricing, VAT included, free UK shipping over ${formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })}.`,
  alternates: { canonical: "/shop/" },
  openGraph: {
    images: OG_IMAGES,
    title: `Shop · ${count} products, every batch tested`,
    description: `Research peptides, prescription medicines via consultation, supplements and supplies — with ${coaCount} published certificates of analysis.`,
    url: "/shop/",
    siteName: BRAND.displayName,
  },
};

const STATS: { label: string; value: string }[] = [
  { label: "Products", value: String(count) },
  { label: "Certificates published", value: String(coaCount) },
  { label: "Free UK shipping", value: `over ${formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })}` },
  { label: "Same-day dispatch", value: "before 2 pm" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${BRAND.displayName} shop`,
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
            <p className="label-mono">Catalogue · {count} products</p>
            <h1 className="mt-4 text-[3rem] uppercase leading-[0.92] sm:text-[4.5rem] lg:text-[6rem]">Shop</h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[16px]">
              Every research vial ships with a batch number and an independent certificate of analysis. Prescription medicines are never sold
              directly — they go through a consultation. Two compounds are listed and deliberately not sold.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px border border-ink bg-ink sm:grid-cols-4 lg:grid-cols-2">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white px-4 py-3">
                <dt className="label-mono">{s.label}</dt>
                <dd className="mt-1 font-mono text-[15px] text-ink tnum">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-x py-8 lg:py-10" aria-label="Product catalogue">
        <Suspense fallback={<ShopGridSkeleton />}>
          <ShopGrid />
        </Suspense>
      </section>
    </>
  );
}
