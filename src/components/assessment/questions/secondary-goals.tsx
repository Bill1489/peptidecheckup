"use client";

import * as React from "react";
import type { GoalId } from "@/data/types";
import { GOAL_OPTIONS, MAX_SECONDARY_GOALS } from "@/lib/assessment/flow";
import { useAssessmentStore } from "@/lib/assessment/store";
import { useAnswers } from "../hooks";
import { MonoLabel } from "../primitives";
import { OptionCards } from "./option-cards";

/** Step 3 — up to two secondary goals (multi-select, primary excluded). */
export function SecondaryGoals() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const options = React.useMemo(() => GOAL_OPTIONS.filter((o) => o.value !== answers.primaryGoal), [answers.primaryGoal]);
  const selected = answers.secondaryGoals;
  const full = selected.length >= MAX_SECONDARY_GOALS;

  const toggle = (value: string) => {
    const goal = value as GoalId;
    const current = useAssessmentStore.getState().answers.secondaryGoals;
    if (current.includes(goal)) setAnswers({ secondaryGoals: current.filter((g) => g !== goal) });
    else if (current.length < MAX_SECONDARY_GOALS) setAnswers({ secondaryGoals: [...current, goal] });
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <MonoLabel className="tnum" aria-live="polite">
          {selected.length === 0 ? "Nothing chosen — that is fine" : `${selected.length} of ${MAX_SECONDARY_GOALS} chosen`}
        </MonoLabel>
        {full && <MonoLabel className="text-muted">Deselect one to swap</MonoLabel>}
      </div>
      <OptionCards label="Secondary goals" options={options} value={selected} multi onChange={toggle} columns={2} numbered={false} />
    </div>
  );
}
