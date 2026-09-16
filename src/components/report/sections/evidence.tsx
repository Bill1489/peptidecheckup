"use client";

import { EvidenceBadge, EvidenceMeter } from "@/components/ui/badge";
import { EVIDENCE_DESCRIPTIONS, EVIDENCE_LABELS, type EvidenceQuality } from "@/data/types";
import type { GoalAlignment, Report } from "@/lib/engine/types";
import { GOAL_ALIGNMENT_DESCRIPTIONS, GOAL_ALIGNMENT_LABELS } from "@/lib/engine/labels";
import { cn } from "@/lib/utils";
import { CompoundHeading, Field, MonoLabel, ReportCard, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

const GRADES: EvidenceQuality[] = ["strong", "moderate", "limited", "preliminary", "insufficient"];

const ALIGNMENT_MARK: Record<GoalAlignment, string> = {
  aligned: "border-brand-600 bg-brand-600",
  partial: "border-ink bg-ink",
  not_aligned: "border-ink bg-white",
};

export function EvidenceSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  return (
    <ReportSection
      def={def}
      description={`Evidence is graded on a five-point scale for your goal — ${report.objective.goalLabel.toLowerCase()} — and for each compound's most-researched use. Grades come from our maintained database, not from this report.`}
    >
      {report.compounds.map((c) => (
        <ReportCard key={c.slug}>
          <CompoundHeading
            name={c.name}
            meta={c.classLabel}
            right={
              <span className="inline-flex items-center gap-2 border border-ink bg-white px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink">
                <span className={cn("h-2 w-2 border", ALIGNMENT_MARK[c.goalAlignment])} aria-hidden />
                {GOAL_ALIGNMENT_LABELS[c.goalAlignment]}
              </span>
            }
          />
          <p className="mt-3 text-sm text-muted">{GOAL_ALIGNMENT_DESCRIPTIONS[c.goalAlignment]}</p>

          <dl className="mt-5 grid gap-6 border-t border-line pt-5 sm:grid-cols-[1.4fr_1fr]">
            <Field label={`For your goal · ${report.objective.goalLabel}`}>
              {c.goalEvidence ? (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <EvidenceMeter level={c.goalEvidence} />
                    <EvidenceBadge level={c.goalEvidence} />
                  </div>
                  {c.goalEvidenceSummary && <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-3">{c.goalEvidenceSummary}</p>}
                </>
              ) : (
                <span className="text-muted">No evidence entry for this goal in our database.</span>
              )}
            </Field>
            <div className="space-y-5">
              <Field label="Overall · most-researched use">
                <div className="flex flex-wrap items-center gap-3">
                  <EvidenceMeter level={c.overallEvidence} />
                  <EvidenceBadge level={c.overallEvidence} />
                </div>
              </Field>
              <Field label="Human evidence">{c.humanEvidenceLabel}</Field>
            </div>
          </dl>
        </ReportCard>
      ))}

      <ReportCard tone="paper" padding="md">
        <MonoLabel as="h3" className="text-ink">
          How to read the grades
        </MonoLabel>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {GRADES.map((g) => (
            <li key={g} className={cn("flex gap-3", g === "insufficient" && "sm:col-span-2")}>
              <EvidenceMeter level={g} className="mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-ink">{EVIDENCE_LABELS[g]}</p>
                <p className="text-sm leading-relaxed text-muted">{EVIDENCE_DESCRIPTIONS[g]}</p>
              </div>
            </li>
          ))}
        </ul>
      </ReportCard>
    </ReportSection>
  );
}
