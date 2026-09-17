"use client";

import Link from "next/link";
import { EvidenceBadge, RegulatoryBadge, SuitabilityBadge } from "@/components/ui/badge";
import { ProductSwatch } from "@/components/commerce/product-image";
import { productsContaining, selectedProducts } from "@/lib/assessment/derived";
import type { Report } from "@/lib/engine/types";
import { MonoLabel, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

export function ConsideringSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const unresolved = report.unresolvedSlugs ?? [];
  const picked = selectedProducts(report.answers).map((p) => p.name);
  const n = report.compounds.length;

  return (
    <ReportSection
      def={def}
      description={`${n} compound${n === 1 ? "" : "s"} from our database: everything inside ${
        picked.length ? `the pen${picked.length === 1 ? "" : "s"} you picked (${picked.join(", ")}), ` : ""
      }your match and its alternatives — or the whole range when nothing matched. Ordered by how your responses map onto each one; badges show overall evidence, regulatory status where you live, and the suitability label this report assigns.`}
    >
      <ul className="cell-grid sm:grid-cols-2 sm:[&>*:nth-child(odd):last-child]:col-span-2">
        {report.compounds.map((c, i) => {
          const pens = productsContaining(c.slug);
          return (
            <li key={c.slug} className="flex flex-col p-5 break-inside-avoid">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <MonoLabel>{c.familyLabel ?? "Compound"}</MonoLabel>
                  <h3 className="mt-2 font-display text-[1.4rem] uppercase leading-none text-ink">{c.name}</h3>
                  <p className="mt-1.5 text-[13px] text-muted">{c.classLabel}</p>
                </div>
                <span className="label-mono shrink-0 tnum">{String(i + 1).padStart(2, "0")}</span>
              </div>
              {c.tagline && <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-3">{c.tagline}</p>}
              <div className="mt-4 flex flex-wrap gap-1.5">
                <EvidenceBadge level={c.overallEvidence} prefix="Evidence" />
                <RegulatoryBadge status={c.regulatory.status} />
                <SuitabilityBadge level={c.suitability} size="sm" />
              </div>
              <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
                <div className="min-w-0">
                  <MonoLabel>In the range</MonoLabel>
                  <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    {pens.map((p) => (
                      <li key={p.id}>
                        <Link href={`/shop/${p.slug}/`} className="link-rule inline-flex items-center gap-1.5 text-[13px] text-ink">
                          <ProductSwatch product={p} />
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/peptides/${c.slug}/`} className="link-rule no-print font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
                  Evidence
                </Link>
              </div>
            </li>
          );
        })}

        {unresolved.map((slug) => (
          <li key={slug} className="flex flex-col justify-between bg-paper-2! p-5 break-inside-avoid">
            <div>
              <MonoLabel>Not assessed</MonoLabel>
              <h3 className="mt-2 font-display text-[1.4rem] uppercase leading-none text-ink">{slug.toUpperCase()}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              No evidence record in our database yet — nothing in this report applies to it, and a clinician would need to
              review it separately.
            </p>
          </li>
        ))}
      </ul>
    </ReportSection>
  );
}
