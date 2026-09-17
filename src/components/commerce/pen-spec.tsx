import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EvidenceMeter } from "@/components/ui/badge";
import { SpecRow } from "@/components/ui/card";
import { goalLabel, isBlend, mainGoal, primaryGoalEvidence, productComponents } from "@/components/commerce/product-utils";
import type { Product } from "@/data/products";
import { EVIDENCE_LABELS } from "@/data/types";
import { formatDate } from "@/lib/utils";

/**
 * "What's in the pen": the PenSpec as label/value rows, then — for blends —
 * one row per component with its amount, class, evidence grade for the pen's
 * main goal and a link to its evidence record.
 */
export function PenSpec({ product, className }: { product: Product; className?: string }) {
  const pen = product.pen;
  // Same goal the card and range table grade: the first of the pen's goals any component record covers.
  const goal = primaryGoalEvidence(product)?.goal ?? mainGoal(product);
  const components = productComponents(product);
  const inTheBox = product.specs.find((s) => s.label.toLowerCase() === "in the box")?.value;
  const klass = product.specs.find((s) => s.label.toLowerCase() === "class")?.value;

  return (
    <section className={className} aria-labelledby="pen-heading">
      <p className="label-mono">Specification</p>
      <h2 id="pen-heading" className="mt-1.5 text-[1.25rem] uppercase">
        What&apos;s in the pen
      </h2>

      <div className="mt-4 border border-ink px-4 py-1">
        {pen ? (
          <>
            <SpecRow label="Contents" value={<span className="break-words">{pen.composition}</span>} className="items-start" />
            <SpecRow label="Concentration" value={<span className="font-mono text-[13px] tnum">{pen.concentration}</span>} />
            <SpecRow
              label="Format"
              value={
                <span>
                  Pre-filled dose-dial pen · <span className="font-mono text-[13px] tnum">{pen.volumeMl} mL</span> ·{" "}
                  <span className="font-mono text-[13px] tnum">{pen.totalMg} mg</span> total
                </span>
              }
            />
            {klass && <SpecRow label="Class" value={<span className="break-words">{klass}</span>} className="items-start" />}
            {product.purity && <SpecRow label="Purity" value={<span className="font-mono text-[13px] tnum">{product.purity}</span>} />}
            <SpecRow label="Dialling" value={<span className="break-words">{pen.dialing}</span>} className="items-start" />
            <SpecRow label="Storage" value={<span className="break-words">{pen.storage}</span>} className="items-start" />
          </>
        ) : (
          <>
            <SpecRow label="Form" value={product.form} className="items-start" />
            {product.specs.map((s) => (
              <SpecRow key={s.label} label={s.label} value={<span className="break-words">{s.value}</span>} className="items-start" />
            ))}
          </>
        )}
        {inTheBox && <SpecRow label="In the box" value={<span className="break-words">{inTheBox}</span>} className="items-start" />}
        <SpecRow label="Updated" value={formatDate(product.lastUpdated)} />
      </div>

      {isBlend(product) && (
        <div className="mt-4 overflow-x-auto border border-ink">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
            <caption className="sr-only">Components of {product.name}</caption>
            <thead>
              <tr className="border-b border-ink bg-paper-2">
                {["Component", "Amount", "What it is", goal ? `Evidence · ${goalLabel(goal)}` : "Evidence", ""].map((h, i) => (
                  <th key={`${h}-${i}`} scope="col" className="label-mono px-3 py-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {components.map((c) => {
                const grade = goal ? c.compound?.goals.find((g) => g.goal === goal)?.evidence : undefined;
                return (
                  <tr key={c.slug} className="border-b border-line last:border-b-0">
                    <th scope="row" className="px-3 py-3 font-semibold text-ink">
                      {c.name}
                    </th>
                    <td className="px-3 py-3 font-mono text-[12px] tnum">{c.amount ?? "See lot certificate"}</td>
                    <td className="px-3 py-3 text-ink-3">{c.compound?.classLabel ?? "Record pending"}</td>
                    <td className="px-3 py-3">
                      {grade ? (
                        <span className="flex items-center gap-2">
                          <EvidenceMeter level={grade} />
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em]">{EVIDENCE_LABELS[grade]}</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">{c.compound ? "Not graded for this goal" : "Pending"}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {c.compound ? (
                        <Link href={`/peptides/${c.slug}/`} className="link-rule inline-flex items-center gap-1 whitespace-nowrap text-[12.5px] font-medium text-ink">
                          Record
                          <ArrowRight className="h-3 w-3" aria-hidden />
                        </Link>
                      ) : (
                        <span className="text-[12px] text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {isBlend(product) && (
        <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
          Amounts are per pen. Where the composition states no split, the component amounts are on the lot certificate.
        </p>
      )}
    </section>
  );
}
