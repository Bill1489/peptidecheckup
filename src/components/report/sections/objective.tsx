"use client";

import { FlagBadge } from "@/components/ui/badge";
import { GOAL_MAP } from "@/data/goals";
import { INFLUENCE_LABELS } from "@/lib/assessment/types";
import type { Report } from "@/lib/engine/types";
import { Field, ReportCard, ReportSection } from "../primitives";
import { Reveal } from "../reveal";
import type { ReportSectionDef } from "../sections";

export function ObjectiveSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const { objective, answers } = report;
  const goalDef = objective.goal ? GOAL_MAP[objective.goal] : undefined;
  const expectationFlag = report.globalFlags.find((f) => f.source === "expectation");

  return (
    <ReportSection def={def}>
      <Reveal>
        <ReportCard>
          <dl className="grid gap-6 sm:grid-cols-2">
            <Field label="Primary goal" className="sm:col-span-2">
              <span className="font-display text-2xl leading-tight tracking-[-0.02em] text-ink">{objective.goalLabel}</span>
              {goalDef && goalDef.id !== "other" && <p className="mt-1 text-sm text-muted">{goalDef.description}</p>}
            </Field>

            <Field label="What success would look like" className="sm:col-span-2">
              {objective.success ? (
                <blockquote className="border-l-2 border-brand-300 pl-4 font-display text-lg italic leading-snug text-ink-2">
                  “{objective.success}”
                </blockquote>
              ) : (
                <span className="italic text-muted">Not described</span>
              )}
            </Field>

            <Field label="How important this is to you">{objective.importanceLabel ?? <span className="italic text-muted">Not answered</span>}</Field>

            <Field label="Timeframe you have in mind">
              <div className="flex flex-wrap items-center gap-2">
                <span>{objective.timeframeLabel ?? <span className="italic text-muted">Not answered</span>}</span>
                {expectationFlag && <FlagBadge severity={expectationFlag.severity} />}
              </div>
              {expectationFlag && <p className="mt-2 text-sm leading-relaxed text-muted">{expectationFlag.detail}</p>}
            </Field>

            {(answers.whyChosen?.trim() || (answers.influence && answers.influence.length > 0)) && (
              <Field label="Why these compounds" className="sm:col-span-2">
                {answers.whyChosen?.trim() && <p>{answers.whyChosen.trim()}</p>}
                {answers.influence && answers.influence.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {answers.influence.map((i) => (
                      <li key={i} className="rounded-full bg-paper-3 px-2.5 py-1 text-xs text-ink-3">
                        {INFLUENCE_LABELS[i]}
                      </li>
                    ))}
                  </ul>
                )}
              </Field>
            )}
          </dl>
        </ReportCard>
      </Reveal>
    </ReportSection>
  );
}
