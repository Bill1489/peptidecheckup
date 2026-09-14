"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, EvidenceBadge, EvidenceMeter, RegulatoryBadge } from "@/components/ui/badge";
import type { Report } from "@/lib/engine/types";
import { cn } from "@/lib/utils";
import { EmptyLine, MonoLabel, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

export function OptionsSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const goal = report.objective.goalLabel;
  return (
    <ReportSection
      def={def}
      description={`Every compound in our database with an evidence entry for ${goal.toLowerCase()}, ranked by evidence grade, followed by alternatives named in the records of the compounds you are considering. Listing is not a recommendation.`}
    >
      <Reveal>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">Researched for {goal.toLowerCase()}</h3>
          <MonoLabel className="text-[0.62rem] text-muted-2">
            {report.goalOptions.length} option{report.goalOptions.length === 1 ? "" : "s"}
          </MonoLabel>
        </div>
        {report.goalOptions.length === 0 ? (
          <EmptyLine>
            {report.objective.goal && report.objective.goal !== "other"
              ? `No compound in our database currently holds an evidence entry for ${goal.toLowerCase()}.`
              : "Your goal could not be mapped to a researched use, so no goal-specific options can be listed."}
          </EmptyLine>
        ) : (
          <ol className="grid gap-3 sm:grid-cols-2">
            {report.goalOptions.map((o, i) => (
              <li
                key={o.slug}
                className={cn(
                  "flex flex-col rounded-2xl border bg-white p-5 shadow-soft break-inside-avoid print:shadow-none",
                  o.considered ? "border-brand-300 ring-1 ring-brand-200" : "border-line",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-lg leading-tight tracking-[-0.02em] text-ink">{o.name}</h4>
                      {o.considered && (
                        <Badge tone="brand" size="xs">
                          You&apos;re considering this
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{o.classLabel}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[0.62rem] tabular-nums text-muted-2">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <EvidenceMeter level={o.evidence} />
                  <EvidenceBadge level={o.evidence} size="xs" />
                  <RegulatoryBadge status={o.regulatoryStatus} size="xs" />
                </div>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-3">{o.summary}</p>
                <Link
                  href={`/peptides/${o.slug}/`}
                  className="no-print mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
                >
                  View profile
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Reveal>

      <Reveal>
        <ReportCard tone="paper">
          <h3 className="font-display text-xl leading-tight tracking-[-0.02em] text-ink">Potential alternatives</h3>
          <p className="mt-1 text-sm text-muted">
            Compounds our database names as having stronger evidence or a firmer regulatory footing for overlapping
            goals — drawn from the records of what you are considering.
          </p>
          {report.alternatives.length === 0 ? (
            <EmptyLine>
              <span className="mt-4 block">
                No alternatives are named in the records of the compounds you are considering.
              </span>
            </EmptyLine>
          ) : (
            <ul className="mt-5 divide-y divide-line">
              {report.alternatives.map((a) => (
                <li key={a.slug} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-6 break-inside-avoid">
                  <div>
                    <h4 className="font-display text-lg leading-tight tracking-[-0.02em] text-ink">{a.name}</h4>
                    <p className="text-xs text-muted">{a.classLabel}</p>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1.5">
                      <EvidenceBadge level={a.evidence} size="xs" />
                      <RegulatoryBadge status={a.regulatoryStatus} size="xs" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-3">{a.reason}</p>
                    <Link
                      href={`/peptides/${a.slug}/`}
                      className="no-print mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
                    >
                      View profile
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ReportCard>
      </Reveal>
    </ReportSection>
  );
}
