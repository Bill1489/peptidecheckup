import { getCompound } from "@/data/compounds";
import { PRODUCTS, type Product } from "@/data/products";
import { EVIDENCE_DESCRIPTIONS, EVIDENCE_LABELS, EVIDENCE_RANK, type EvidenceQuality } from "@/data/types";
import { EvidenceMeter } from "@/components/ui/badge";
import { ProductSwatch } from "@/components/commerce/product-image";
import { productCompoundSlugs } from "./copy";
import { IndexHead } from "./index-head";
import { EVIDENCE_ORDER } from "./scales";

interface Placement {
  product: Product;
  compoundName: string;
  grade: EvidenceQuality;
}

/** Every compound in the range placed on the ladder by its record's overall grade; records not yet written are reported separately. */
function placeRange(): { placements: Placement[]; pending: { product: Product; slug: string }[] } {
  const placements: Placement[] = [];
  const pending: { product: Product; slug: string }[] = [];
  for (const product of PRODUCTS) {
    for (const slug of productCompoundSlugs(product)) {
      const compound = getCompound(slug);
      if (compound) placements.push({ product, compoundName: compound.name, grade: compound.overallEvidence });
      else pending.push({ product, slug });
    }
  }
  return { placements, pending };
}

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** One honest sentence about where the range sits, computed from the records. */
function summary(placements: Placement[]): string {
  if (placements.length === 0) return "Grades are read from the compound records and shown here as soon as the records are published.";
  const sorted = [...placements].sort((a, b) => EVIDENCE_RANK[b.grade] - EVIDENCE_RANK[a.grade]);
  const top = sorted[0].grade;
  const topNames = Array.from(new Set(sorted.filter((p) => p.grade === top).map((p) => p.compoundName)));
  const rest = sorted.filter((p) => p.grade !== top);
  const restTop = rest[0]?.grade;
  const only = topNames.length === 1 ? "is the only compound" : "are the only compounds";
  const tail = restTop
    ? ` Everything else sits at ${EVIDENCE_LABELS[restTop]} or below — topical cosmetic, animal or early human data — and the product page says so in the same type size.`
    : "";
  return `${joinNames(topNames)} ${only} in the range graded ${EVIDENCE_LABELS[top]}.${tail}`;
}

/**
 * The five-grade ladder with the range mapped onto it. Blends appear once per
 * component, because that is how they are graded. No compound is moved up a
 * grade because we sell it.
 */
export function RangeEvidence() {
  const { placements, pending } = placeRange();

  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="07"
          label="Evidence, honestly"
          title="Where the range sits on the ladder."
          description={`${summary(placements)} Every grade is read from the compound record, and the record is linked from every pen page.`}
          action={{ href: "/peptides", label: "Compound directory" }}
        />
        <ol className="mt-10 border-t border-ink">
          {EVIDENCE_ORDER.map((level) => {
            const here = placements.filter((p) => p.grade === level);
            return (
              <li
                key={level}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 border-b border-ink py-4 sm:grid-cols-[5.5rem_8rem_minmax(0,1fr)_minmax(0,18rem)] sm:items-center"
              >
                <EvidenceMeter level={level} className="translate-y-px" />
                <span className="font-display text-[1rem] uppercase leading-none tracking-[-0.02em] text-ink">{EVIDENCE_LABELS[level]}</span>
                <span className="col-span-2 text-[13px] leading-relaxed text-muted sm:col-span-1">{EVIDENCE_DESCRIPTIONS[level]}</span>
                <span className="col-span-2 flex flex-wrap gap-1.5 sm:col-span-1 sm:justify-end">
                  {here.length > 0 ? (
                    here.map((p) => (
                      <span
                        key={`${p.product.id}-${p.compoundName}`}
                        className="inline-flex h-6 items-center gap-1.5 border border-ink px-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink"
                      >
                        <ProductSwatch product={p.product} className="h-2 w-2" />
                        {p.product.blend ? `${p.product.name} · ${p.compoundName}` : p.product.name}
                      </span>
                    ))
                  ) : (
                    <span className="label-mono">None in the range</span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
        {pending.length > 0 && (
          <p className="mt-5 text-[13px] leading-relaxed text-muted">
            Awaiting a compound record, so no grade is shown yet:{" "}
            {joinNames(pending.map((p) => `${p.slug.toUpperCase()} (${p.product.name})`))}. The grade appears here the moment the record is published.
          </p>
        )}
      </div>
    </section>
  );
}
