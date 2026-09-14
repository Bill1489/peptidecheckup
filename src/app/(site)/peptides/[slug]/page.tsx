import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompoundDetail } from "@/components/compounds/compound-detail";
import { COMPOUNDS, getCompound } from "@/data/compounds";
import { FAMILY_LABELS, ROUTE_LABELS, type Compound } from "@/data/types";
import { BRAND } from "@/lib/brand";

type Params = { slug: string };

/** Static export: every compound page is prerendered; unknown slugs are not served. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return COMPOUNDS.map((c) => ({ slug: c.slug }));
}

function truncate(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const compound = getCompound(slug);
  if (!compound) return { title: "Compound not found" };

  const title = `${compound.name} — evidence, regulatory status, dosing research & safety`;
  const description = truncate(compound.summary);
  const path = `/peptides/${compound.slug}/`;

  return {
    title,
    description,
    keywords: [
      compound.name,
      ...compound.aliases,
      compound.classLabel,
      `${compound.name} evidence`,
      `${compound.name} side effects`,
      `is ${compound.name} legal`,
    ],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${compound.name} · ${compound.classLabel}`,
      description,
      url: path,
      siteName: BRAND.displayName,
      modifiedTime: compound.lastReviewed,
    },
    twitter: {
      card: "summary_large_image",
      title: `${compound.name} · ${compound.classLabel}`,
      description,
    },
  };
}

function buildJsonLd(compound: Compound) {
  const url = `${BRAND.url}/peptides/${compound.slug}/`;
  const drugId = `${url}#drug`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Drug",
        "@id": drugId,
        name: compound.name,
        alternateName: compound.aliases,
        description: compound.summary,
        drugClass: compound.classLabel,
        mechanismOfAction: compound.mechanism,
        administrationRoute: compound.routes.map((r) => ROUTE_LABELS[r]),
        url,
      },
      {
        "@type": "MedicalWebPage",
        "@id": url,
        url,
        name: `${compound.name} — evidence, regulatory status, dosing research & safety`,
        description: compound.summary,
        about: { "@id": drugId },
        lastReviewed: compound.lastReviewed,
        inLanguage: "en-GB",
        publisher: { "@type": "Organization", name: BRAND.legalName, url: BRAND.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Peptides", item: `${BRAND.url}/peptides/` },
          { "@type": "ListItem", position: 2, name: FAMILY_LABELS[compound.family], item: `${BRAND.url}/peptides/` },
          { "@type": "ListItem", position: 3, name: compound.name, item: url },
        ],
      },
    ],
  };
}

export default async function CompoundPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const compound = getCompound(slug);
  if (!compound) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(compound)).replace(/</g, "\\u003c") }}
      />
      <CompoundDetail compound={compound} />
    </>
  );
}
