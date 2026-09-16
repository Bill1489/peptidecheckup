import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareSkeleton } from "@/components/compounds/compare-skeleton";
import { CompareTool } from "@/components/compounds/compare-tool";
import { IndexHeader } from "@/components/compounds/primitives";
import { COMPOUNDS } from "@/data/compounds";
import { OG_IMAGES } from "@/lib/brand";
import { MAX_COMPARE } from "@/lib/compare";

export const metadata: Metadata = {
  title: "Compare peptides side by side",
  description: `Compare up to ${MAX_COMPARE} of ${COMPOUNDS.length} peptides on evidence by goal, regulatory status in your jurisdiction, adverse effects, contraindications, interactions, published human studies and price — with combination notes for every pair.`,
  alternates: { canonical: "/compare/" },
  openGraph: {
    images: OG_IMAGES,
    title: "Compare peptides side by side",
    description:
      "Evidence, regulatory status, safety, price and combination intelligence for up to four compounds, from one structured database.",
    url: "/compare/",
  },
};

export default function ComparePage() {
  return (
    <>
      <IndexHeader
        label={`Compare · up to ${MAX_COMPARE} compounds`}
        title="Side by side. Same scale."
        description={`Up to ${MAX_COMPARE} compounds, one structured record each. Evidence is graded on the same scale, regulatory status comes from our maintained database for the jurisdiction you choose, every pair is checked against the combination notes we hold — and where we stock a batch-tested product, the price sits in the same table.`}
      />

      <section className="container-x py-8 lg:py-12" aria-label="Comparison tool">
        <Suspense fallback={<CompareSkeleton />}>
          <CompareTool />
        </Suspense>
      </section>
    </>
  );
}
