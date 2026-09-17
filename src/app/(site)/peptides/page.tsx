import type { Metadata } from "next";
import { CompoundDirectory } from "@/components/compounds/compound-directory";
import { CellGrid, IndexHeader } from "@/components/compounds/primitives";
import { COMPOUNDS } from "@/data/compounds";
import { FAMILY_LABELS } from "@/data/types";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { RANGE_SLUGS } from "@/lib/compare";
import { formatDate } from "@/lib/utils";

const count = COMPOUNDS.length;
const familyCount = new Set(COMPOUNDS.map((c) => c.family)).size;
const studyCount = COMPOUNDS.reduce((sum, c) => sum + c.dosingResearch.length, 0);
const rangeCount = RANGE_SLUGS.length;
const latestReview = COMPOUNDS.map((c) => c.lastReviewed).sort().at(-1);

export const metadata: Metadata = {
  title: `Peptide directory — evidence & regulatory status for ${count} compounds`,
  description: `Browse ${count} peptides and related compounds graded on the same structured record: human evidence by goal, regulatory status in the UK, US, EU, Australia and Canada, published dosing research, safety and interactions — and which ${rangeCount} of them are in the ${BRAND.range.name} range of batch-tested pens.`,
  alternates: { canonical: "/peptides/" },
  openGraph: {
    images: OG_IMAGES,
    title: `Peptide directory — ${count} compounds, graded the same way`,
    description: `Evidence grades, regulatory status by jurisdiction and safety information for ${count} peptides, from ${familyCount} compound families. ${rangeCount} of them are in the ${BRAND.range.name} range.`,
    url: "/peptides/",
  },
};

const STATS: { label: string; value: string }[] = [
  { label: "Compounds", value: String(count) },
  { label: "Families", value: `${familyCount} of ${Object.keys(FAMILY_LABELS).length}` },
  { label: "Human studies recorded", value: String(studyCount) },
  { label: `In the ${BRAND.range.name} range`, value: String(rangeCount) },
  { label: "Database reviewed", value: latestReview ? formatDate(latestReview, { month: "short" }) : "—" },
];

export default function PeptidesPage() {
  return (
    <>
      <IndexHeader
        label={`Directory · ${count} compounds`}
        title="Every compound. Same scale."
        description={`${count} compounds graded the same way — ${rangeCount} of them are in the ${BRAND.range.name} range. Each is assessed on one structured record: human evidence for every goal it has been researched for, regulatory status taken from our maintained database rather than inferred, published dosing research, safety and interactions. Where a compound is in the range — on its own pen or inside a blend — the card names the pen and its price.`}
      >
        <CellGrid as="dl" cols={[2, 3, 5]} count={STATS.length} className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" aria-label="Directory statistics">
          {STATS.map((s) => (
            <div key={s.label} className="p-4 sm:p-5">
              <dt className="label-mono">{s.label}</dt>
              <dd className="font-display mt-3 text-[1.6rem] leading-none text-ink tnum sm:text-[2rem]">{s.value}</dd>
            </div>
          ))}
        </CellGrid>
      </IndexHeader>

      <section className="container-x py-8 lg:py-12" aria-label="Compound directory">
        <CompoundDirectory />
      </section>
    </>
  );
}
