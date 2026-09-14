import { OG_IMAGES } from "@/lib/brand";
import type { Metadata } from "next";
import { CompoundDirectory } from "@/components/compounds/compound-directory";
import { Eyebrow } from "@/components/ui/card";
import { COMPOUNDS } from "@/data/compounds";
import { FAMILY_LABELS } from "@/data/types";
import { formatDate } from "@/lib/utils";

const count = COMPOUNDS.length;
const familyCount = new Set(COMPOUNDS.map((c) => c.family)).size;
const studyCount = COMPOUNDS.reduce((sum, c) => sum + c.dosingResearch.length, 0);
const latestReview = COMPOUNDS.map((c) => c.lastReviewed).sort().at(-1);

export const metadata: Metadata = {
  title: `Peptide directory — evidence & regulatory status for ${count} compounds`,
  description: `Browse ${count} peptides and related compounds graded on the same structured record: human evidence by goal, regulatory status in the UK, US, EU, Australia and Canada, published dosing research, safety and interactions.`,
  alternates: { canonical: "/peptides/" },
  openGraph: {
      images: OG_IMAGES,
    title: `Peptide directory — ${count} compounds, graded the same way`,
    description: `Evidence grades, regulatory status by jurisdiction and safety information for ${count} peptides, from ${familyCount} compound families.`,
    url: "/peptides/",
  },
};

const STATS: { label: string; value: string }[] = [
  { label: "Compounds", value: String(count) },
  { label: "Families", value: `${familyCount} of ${Object.keys(FAMILY_LABELS).length}` },
  { label: "Human studies recorded", value: String(studyCount) },
  { label: "Database reviewed", value: latestReview ? formatDate(latestReview, { month: "short" }) : "—" },
];

export default function PeptidesPage() {
  return (
    <>
      <section className="border-b border-line bg-paper-2/60 bg-grain">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <Eyebrow>Peptide directory</Eyebrow>
              <h1 className="mt-4 font-display text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-balance text-ink sm:text-5xl lg:text-6xl">
                Every compound, graded the same way
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                Each of the {count} compounds below is assessed on one structured record: human evidence for every goal it has been
                researched for, regulatory status taken from our maintained database rather than inferred, published dosing research,
                safety, interactions and what to ask a clinician. Choose your jurisdiction, filter by goal or family, and add up to four
                compounds to compare side by side.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 lg:grid-cols-2 lg:gap-x-12">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-2">{s.label}</dt>
                  <dd className="mt-1 font-display text-2xl text-ink sm:text-3xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="container-x py-10 lg:py-14" aria-label="Compound directory">
        <CompoundDirectory />
      </section>
    </>
  );
}
