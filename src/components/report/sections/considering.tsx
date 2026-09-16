"use client";

import Link from "next/link";
import { EvidenceBadge, RegulatoryBadge, SuitabilityBadge } from "@/components/ui/badge";
import { ROUTE_LABELS } from "@/data/types";
import type { Report } from "@/lib/engine/types";
import { formatUserDose } from "@/lib/engine/rules/dose";
import { MonoLabel, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

export function ConsideringSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const unresolved = report.unresolvedSlugs ?? [];
  const other = report.answers.otherCompoundText?.trim();
  const dosesBySlug = new Map(report.answers.consideredCompounds.map((c) => [c.slug, c.dose]));
  const notAssessed = [...unresolved.map((slug) => ({ key: slug, label: slug })), ...(other ? [{ key: "other", label: other }] : [])];

  return (
    <ReportSection
      def={def}
      description={`${report.compounds.length} compound${report.compounds.length === 1 ? "" : "s"} from our database, ordered by how your responses map onto each one. Badges show overall evidence, regulatory status where you live, and the suitability label this report assigns.`}
    >
      <ul className="cell-grid sm:grid-cols-2 sm:[&>*:nth-child(odd):last-child]:col-span-2">
        {report.compounds.map((c, i) => {
          const dose = dosesBySlug.get(c.slug);
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
                  <MonoLabel>Dose you&apos;re considering</MonoLabel>
                  <p className="mt-1 font-mono text-[13px] text-ink tnum">
                    {dose?.amount !== undefined ? formatUserDose({ ...dose, route: undefined }) : "Not entered"}
                  </p>
                  {dose?.amount !== undefined && dose.route && <p className="text-xs text-muted">{ROUTE_LABELS[dose.route]}</p>}
                </div>
                <Link href={`/peptides/${c.slug}/`} className="link-rule no-print font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
                  Evidence
                </Link>
              </div>
            </li>
          );
        })}

        {notAssessed.map((item) => (
          <li key={item.key} className="flex flex-col justify-between bg-paper-2! p-5 break-inside-avoid">
            <div>
              <MonoLabel>Not assessed</MonoLabel>
              <h3 className="mt-2 font-display text-[1.4rem] uppercase leading-none text-ink">{item.label}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Not in our database yet — we can&apos;t assess it. Nothing in this report applies to it, and a clinician would
              need to review it separately.
            </p>
          </li>
        ))}
      </ul>
    </ReportSection>
  );
}
