"use client";

import * as React from "react";
import { FOCUS_NONE, focusOptionsFor, goalProblemLabel } from "@/lib/assessment/flow";
import { useAssessmentStore } from "@/lib/assessment/store";
import { useAnswers } from "../hooks";
import { FieldError, MonoLabel } from "../primitives";
import { OptionCards } from "./option-cards";

/**
 * Step 2 — focus areas for the chosen goal (multi-select). "None of these" is
 * exclusive so the step still counts as answered when nothing fits.
 */
export function FocusCards({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const options = React.useMemo(() => focusOptionsFor(answers.primaryGoal), [answers.primaryGoal]);
  const selected = answers.focusAreas;
  const problem = goalProblemLabel(answers.primaryGoal);

  const toggle = (value: string) => {
    const current = useAssessmentStore.getState().answers.focusAreas;
    let next: string[];
    if (value === FOCUS_NONE) next = current.includes(FOCUS_NONE) ? [] : [FOCUS_NONE];
    else if (current.includes(value)) next = current.filter((x) => x !== value);
    else next = [...current.filter((x) => x !== FOCUS_NONE), value];
    setAnswers({ focusAreas: next });
  };

  const chosen = selected.filter((x) => x !== FOCUS_NONE).length;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        {problem && <MonoLabel className="text-muted">Under “{problem}”</MonoLabel>}
        <MonoLabel className="tnum" aria-live="polite">
          {selected.includes(FOCUS_NONE) ? "None of these" : chosen === 0 ? "Nothing chosen yet" : `${chosen} chosen`}
        </MonoLabel>
      </div>
      <OptionCards label="Which of these sound like you" options={options} value={selected} multi onChange={toggle} columns={options.length > 4 ? 2 : 1} numbered={false} />
      {showErrors && selected.length === 0 && <FieldError>Choose at least one — or “None of these”.</FieldError>}
    </div>
  );
}
