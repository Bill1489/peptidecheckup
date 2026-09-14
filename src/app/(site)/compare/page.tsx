import { OG_IMAGES } from "@/lib/brand";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareSkeleton } from "@/components/compounds/compare-skeleton";
import { CompareTool } from "@/components/compounds/compare-tool";
import { Eyebrow } from "@/components/ui/card";
import { COMPOUNDS } from "@/data/compounds";

export const metadata: Metadata = {
  title: "Compare peptides side by side",
  description: `Compare up to four of ${COMPOUNDS.length} peptides on evidence by goal, regulatory status in your jurisdiction, adverse effects, contraindications, interactions and published human studies — with combination notes for every pair.`,
  alternates: { canonical: "/compare/" },
  openGraph: {
      images: OG_IMAGES,
    title: "Compare peptides side by side",
    description:
      "Evidence, regulatory status, safety and combination intelligence for up to four compounds, from one structured database.",
    url: "/compare/",
  },
};

export default function ComparePage() {
  return (
    <>
      <section className="border-b border-line bg-paper-2/60 bg-grain">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Compare</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-balance text-ink sm:text-5xl lg:text-6xl">
              Compare peptides side by side
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Up to four compounds, one structured record each. Evidence is graded on the same scale, regulatory status comes from our
              maintained database for the jurisdiction you choose, and every pair is checked against the combination notes we hold.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-10 lg:py-14" aria-label="Comparison tool">
        <Suspense fallback={<CompareSkeleton />}>
          <CompareTool />
        </Suspense>
      </section>
    </>
  );
}
