import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/commerce/product-detail";
import { productPath } from "@/components/commerce/product-utils";
import { JsonLd, type JsonLdObject } from "@/components/marketing/json-ld";
import { getCompound } from "@/data/compounds";
import { CATEGORY_LABELS, PRODUCTS, defaultVariant, getProductBySlug, purchasable, type Availability, type Product } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";

type Params = { slug: string };

/** Static export: every product page is prerendered; unknown slugs are not served. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

function truncate(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const path = productPath(product.slug);
  const title = `${product.name} — ${product.subtitle}`;
  const description = truncate(product.description);
  const compound = product.compoundSlug ? getCompound(product.compoundSlug) : undefined;

  return {
    title,
    description,
    keywords: [
      product.name,
      ...(compound?.aliases ?? []),
      `buy ${product.name} UK`,
      `${product.name} certificate of analysis`,
      CATEGORY_LABELS[product.category],
      ...product.tags,
    ],
    alternates: { canonical: path },
    openGraph: {
      images: OG_IMAGES,
      type: "website",
      title,
      description,
      url: path,
      siteName: BRAND.displayName,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const SCHEMA_AVAILABILITY: Partial<Record<Availability, string>> = {
  in_stock: "https://schema.org/InStock",
  low_stock: "https://schema.org/LimitedAvailability",
  out_of_stock: "https://schema.org/OutOfStock",
  preorder: "https://schema.org/PreOrder",
};

function buildJsonLd(product: Product): JsonLdObject {
  const url = `${BRAND.url}${productPath(product.slug)}`;
  const variant = defaultVariant(product);
  const sellable = purchasable(product) || product.availability === "out_of_stock";

  const offers = sellable
    ? product.variants
        .filter((v) => v.price > 0)
        .map<JsonLdObject>((v) => ({
          "@type": "Offer",
          sku: v.sku,
          name: `${product.name} ${v.label}`,
          price: (v.price / 100).toFixed(2),
          priceCurrency: COMMERCE.currency,
          availability: SCHEMA_AVAILABILITY[product.availability] ?? "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          url,
          seller: { "@type": "Organization", name: BRAND.legalName },
          eligibleRegion: COMMERCE.shipTo.map((c) => ({ "@type": "Country", name: c })),
        }))
    : undefined;

  const productNode: JsonLdObject = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    sku: variant.sku,
    category: CATEGORY_LABELS[product.category],
    brand: { "@type": "Brand", name: BRAND.displayName },
    url,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Sale channel", value: product.channel },
      ...(product.coa
        ? [
            { "@type": "PropertyValue", name: "Batch", value: product.coa.batch },
            { "@type": "PropertyValue", name: "Purity", value: product.coa.purity },
            { "@type": "PropertyValue", name: "Tested by", value: product.coa.lab },
          ]
        : []),
    ],
    ...(offers && offers.length > 0 ? { offers } : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      productNode,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Shop", item: `${BRAND.url}/shop/` },
          { "@type": "ListItem", position: 2, name: CATEGORY_LABELS[product.category], item: `${BRAND.url}/shop/?category=${product.category}` },
          { "@type": "ListItem", position: 3, name: product.name, item: url },
        ],
      },
    ],
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={buildJsonLd(product)} />
      <ProductDetail product={product} />
    </>
  );
}
