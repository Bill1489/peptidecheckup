import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/commerce/product-detail";
import { productCompounds, productPath } from "@/components/commerce/product-utils";
import { JsonLd, type JsonLdObject } from "@/components/marketing/json-ld";
import { PRODUCTS, defaultVariant, getProductBySlug, purchasable, type Availability, type Product } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { asset } from "@/lib/utils";

type Params = { slug: string };

/** Static export: every pen page is prerendered; unknown slugs are not served. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

function truncate(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function imageUrls(product: Product): string[] {
  return product.images.map((i) => `${BRAND.url}${asset(i.src)}`);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const path = productPath(product.slug);
  const title = `${product.name} — ${product.subtitle}`;
  const description = truncate(product.description);
  const compounds = productCompounds(product);
  const images = imageUrls(product);

  return {
    title,
    description,
    keywords: [
      product.name,
      ...compounds.flatMap((c) => [c.name, ...c.aliases]),
      `buy ${product.name} pen UK`,
      `${product.name} certificate of analysis`,
      "pre-filled peptide pen",
      ...product.tags,
    ],
    alternates: { canonical: path },
    openGraph: {
      images: images.length ? images.map((url) => ({ url, alt: product.images[0]?.alt ?? product.name })) : OG_IMAGES,
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

  const images = imageUrls(product);

  const productNode: JsonLdObject = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    sku: variant.sku,
    category: "Pre-filled peptide pens",
    brand: { "@type": "Brand", name: BRAND.displayName },
    url,
    ...(images.length ? { image: images } : {}),
    additionalProperty: [
      { "@type": "PropertyValue", name: "Sale channel", value: product.channel },
      { "@type": "PropertyValue", name: "Format", value: product.pen ? `Pre-filled dose-dial pen, ${product.pen.volumeMl} mL` : product.form },
      ...(product.pen ? [{ "@type": "PropertyValue", name: "Contents", value: product.pen.composition }] : []),
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
          { "@type": "ListItem", position: 1, name: "The range", item: `${BRAND.url}/shop/` },
          { "@type": "ListItem", position: 2, name: product.name, item: url },
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
