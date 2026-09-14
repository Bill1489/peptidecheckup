"use client";

import Link from "next/link";
import { ArrowUpRight, CircleQuestionMark } from "lucide-react";
import { EvidenceBadge, RegulatoryBadge, SuitabilityBadge } from "@/components/ui/badge";
import { ROUTE_LABELS } from "@/data/types";
import type { Report } from "@/lib/engine/types";
import { formatUserDose } from "@/lib/engine/rules/dose";
import { MonoLabel, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

export function ConsideringSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const unresolved = report.unresolvedSlugs ?? [];
  const other = report.answers.otherCompoundText?.trim();
  const dosesBySlug = new Map(report.answers.consideredCompounds.map((c) => [c.slug, c.dose]));

  return (
    <ReportSection
      def={def}
      description={`${report.compounds.length} compound${report.compounds.length === 1 ? "" : "s"} from our database, ordered by how your responses map onto each one. Badges show overall evidence, regulatory status where you live, and the suitability label this report assigns.`}
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {report.compounds.map((c, i) => {
          const dose = dosesBySlug.get(c.slug);
          return (
            <Reveal key={c.slug} as="li" delay={Math.min(i, 4) * 0.05}>
              <ReportCard className="flex h-full flex-col" padding="md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <MonoLabel className="text-[0.62rem]">{c.familyLabel ?? "Compound"}</MonoLabel>
                    <h3 className="mt-1.5 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-ink">{c.name}</h3>
                    <p className="mt-1 text-sm text-muted">{c.classLabel}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[0.62rem] tabular-nums text-muted-2">{String(i + 1).padStart(2, "0")}</span>
                </div>
                {c.tagline && <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-3">{c.tagline}</p>}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <EvidenceBadge level={c.overallEvidence} prefix="Evidence" />
                  <RegulatoryBadge status={c.regulatory.status} />
                  <SuitabilityBadge level={c.suitability} size="sm" />
                </div>
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  <div className="min-w-0">
                    <MonoLabel className="text-[0.6rem]">Dose you&apos;re considering</MonoLabel>
                    <p className="mt-1 font-mono text-sm text-ink-2">
                      {dose?.amount !== undefined ? formatUserDose({ ...dose, route: undefined }) : "Not entered"}
                    </p>
                    {dose?.amount !== undefined && dose.route && (
                      <p className="text-xs text-muted">{ROUTE_LABELS[dose.route]}</p>
                    )}
                  </div>
                  <Link
                    href={`/peptides/${c.slug}/`}
                    className="no-print inline-flex items-center gap-1 text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
                  >
                    Profile
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </ReportCard>
            </Reveal>
          );
        })}

        {[...unresolved.map((slug) => ({ key: slug, label: slug })), ...(other ? [{ key: "other", label: other }] : [])].map(
          (item) => (
            <Reveal key={item.key} as="li">
              <ReportCard tone="paper" className="flex h-full flex-col justify-between border-dashed" padding="md">
                <div>
                  <MonoLabel className="flex items-center gap-1.5 text-[0.62rem]">
                    <CircleQuestionMark className="h-3.5 w-3.5" aria-hidden />
                    Not assessed
                  </MonoLabel>
                  <h3 className="mt-1.5 font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-ink">{item.label}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Not in our database yet — we can&apos;t assess it. Nothing in this report applies to it, and a
                  clinician would need to review it separately.
                </p>
              </ReportCard>
            </Reveal>
          ),
        )}
      </ul>
    </ReportSection>
  );
}
