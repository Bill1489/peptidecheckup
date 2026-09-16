"use client";

import { FlagBadge } from "@/components/ui/badge";
import { GOAL_MAP } from "@/data/goals";
import { INFLUENCE_LABELS } from "@/lib/assessment/types";
import type { Report } from "@/lib/engine/types";
import { Field, ReportCard, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

export function ObjectiveSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const { objective, answers } = report;
  const goalDef = objective.goal ? GOAL_MAP[objective.goal] : undefined;
  const expectationFlag = report.globalFlags.find((f) => f.source === "expectation");

  return (
    <ReportSection def={def}>
      <ReportCard>
        <dl className="grid gap-6 sm:grid-cols-2">
          <Field label="Primary goal" className="sm:col-span-2">
            <span className="font-display text-[1.5rem] uppercase leading-none text-ink sm:text-[1.75rem]">{objective.goalLabel}</span>
            {goalDef && goalDef.id !== "other" && <p className="mt-2 text-sm text-muted">{goalDef.description}</p>}
          </Field>

          <Field label="What success would look like" className="sm:col-span-2">
            {objective.success ? (
              <blockquote className="border-l-[3px] border-brand-600 pl-4 text-[15px] leading-relaxed text-ink">
                “{objective.success}”
              </blockquote>
            ) : (
              <span className="text-muted">Not described</span>
            )}
          </Field>

          <Field label="How important this is to you">{objective.importanceLabel ?? <span className="text-muted">Not answered</span>}</Field>

          <Field label="Timeframe you have in mind">
            <div className="flex flex-wrap items-center gap-2">
              <span>{objective.timeframeLabel ?? <span className="text-muted">Not answered</span>}</span>
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
                    <li key={i} className="border border-line bg-paper-2 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3">
                      {INFLUENCE_LABELS[i]}
                    </li>
                  ))}
                </ul>
              )}
            </Field>
          )}
        </dl>
      </ReportCard>
    </ReportSection>
  );
}
