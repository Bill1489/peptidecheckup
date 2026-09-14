"use client";

import { CircleCheck, CircleDashed, CircleMinus } from "lucide-react";
import { EvidenceBadge, EvidenceMeter } from "@/components/ui/badge";
import { EVIDENCE_DESCRIPTIONS, EVIDENCE_LABELS, type EvidenceQuality } from "@/data/types";
import type { GoalAlignment, Report } from "@/lib/engine/types";
import { GOAL_ALIGNMENT_DESCRIPTIONS, GOAL_ALIGNMENT_LABELS } from "@/lib/engine/labels";
import { cn } from "@/lib/utils";
import { CompoundHeading, Field, MonoLabel, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

const GRADES: EvidenceQuality[] = ["strong", "moderate", "limited", "preliminary", "insufficient"];

const ALIGNMENT_ICON: Record<GoalAlignment, React.ReactNode> = {
  aligned: <CircleCheck className="h-4 w-4 text-emerald-600" aria-hidden />,
  partial: <CircleDashed className="h-4 w-4 text-amber-600" aria-hidden />,
  not_aligned: <CircleMinus className="h-4 w-4 text-muted" aria-hidden />,
};

export function EvidenceSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  return (
    <ReportSection
      def={def}
      description={`Evidence is graded on a five-point scale for your goal — ${report.objective.goalLabel.toLowerCase()} — and for each compound's most-researched use. Grades come from our maintained database, not from this report.`}
    >
      {report.compounds.map((c, i) => (
        <Reveal key={c.slug} delay={Math.min(i, 3) * 0.04}>
          <ReportCard>
            <CompoundHeading
              name={c.name}
              meta={c.classLabel}
              right={
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2 px-3 py-1 text-xs font-medium text-ink-3">
                  {ALIGNMENT_ICON[c.goalAlignment]}
                  {GOAL_ALIGNMENT_LABELS[c.goalAlignment]}
                </span>
              }
            />
            <p className="mt-2 text-sm text-muted">{GOAL_ALIGNMENT_DESCRIPTIONS[c.goalAlignment]}</p>

            <dl className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-[1.4fr_1fr]">
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
                  <span className="italic text-muted">No evidence entry for this goal in our database.</span>
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
        </Reveal>
      ))}

      <Reveal>
        <ReportCard tone="paper" padding="md">
          <MonoLabel as="h3">How to read the grades</MonoLabel>
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
      </Reveal>
    </ReportSection>
  );
}
