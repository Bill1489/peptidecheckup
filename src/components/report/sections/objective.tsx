"use client";

import { FlagBadge } from "@/components/ui/badge";
import { GOAL_MAP } from "@/data/goals";
import { EXPERIENCE_LABELS, FOCUS_NONE, focusLabel, goalProblemLabel } from "@/lib/assessment/flow";
import type { Report } from "@/lib/engine/types";
import { Field, ReportCard, ReportSection } from "../primitives";
import type { ReportSectionDef } from "../sections";

export function ObjectiveSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const { objective, answers } = report;
  const goalDef = objective.goal ? GOAL_MAP[objective.goal] : undefined;
  const problem = goalProblemLabel(objective.goal);
  const expectationFlag = report.globalFlags.find((f) => f.source === "expectation");
  const focus = answers.focusAreas.filter((f) => f !== FOCUS_NONE).map(focusLabel);
  const secondary = answers.secondaryGoals.map((g) => goalProblemLabel(g) ?? GOAL_MAP[g]?.label ?? g);

  return (
    <ReportSection def={def}>
      <ReportCard>
        <dl className="grid gap-6 sm:grid-cols-2">
          <Field label="What you want to change" className="sm:col-span-2">
            <span className="font-display text-[1.5rem] uppercase leading-none text-ink sm:text-[1.75rem]">{problem ?? objective.goalLabel}</span>
            {goalDef && goalDef.id !== "other" && (
              <p className="mt-2 text-sm text-muted">
                Researched-goal category: {goalDef.label.toLowerCase()} — {goalDef.description.toLowerCase()}
              </p>
            )}
          </Field>

          <Field label="Sounds like you" className="sm:col-span-2">
            {focus.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {focus.map((f) => (
                  <li key={f} className="border border-ink bg-white px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink">
                    {f}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted">None chosen — the match rests on the goal alone</span>
            )}
          </Field>

          <Field label="Also working on">
            {secondary.length > 0 ? secondary.join("; ") : <span className="text-muted">Nothing else</span>}
          </Field>

          <Field label="Peptide experience">
            {answers.experienceLevel ? EXPERIENCE_LABELS[answers.experienceLevel] : <span className="text-muted">Not answered</span>}
          </Field>

          <Field label="Timeframe you have in mind" className="sm:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <span>{objective.timeframeLabel ?? <span className="text-muted">Not answered</span>}</span>
              {expectationFlag && <FlagBadge severity={expectationFlag.severity} />}
            </div>
            {expectationFlag && <p className="mt-2 text-sm leading-relaxed text-muted">{expectationFlag.detail}</p>}
          </Field>

          {objective.success && (
            <Field label="What success would look like" className="sm:col-span-2">
              <blockquote className="border-l-[3px] border-brand-600 pl-4 text-[15px] leading-relaxed text-ink">“{objective.success}”</blockquote>
            </Field>
          )}
        </dl>
      </ReportCard>
    </ReportSection>
  );
}
