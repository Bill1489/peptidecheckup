"use client";

import * as React from "react";
import type { GoalId } from "@/data/types";
import { GOAL_OPTIONS } from "@/lib/assessment/flow";
import { useAssessmentStore } from "@/lib/assessment/store";
import { useAnswers } from "../hooks";
import { OptionCards } from "./option-cards";

/**
 * Step 1 — "What do you want to change?" Ten problem statements, each mapped
 * to at least one pen. Changing the goal clears the focus areas (they are
 * goal-specific) and drops the new goal from the secondary list.
 */
export function GoalCards({ onAdvance }: { onAdvance?: () => void }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);

  const choose = (value: string) => {
    const goal = value as GoalId;
    const a = useAssessmentStore.getState().answers;
    setAnswers({
      primaryGoal: goal,
      focusAreas: a.primaryGoal === goal ? a.focusAreas : [],
      secondaryGoals: a.secondaryGoals.filter((g) => g !== goal),
    });
  };

  return <OptionCards label="What you want to change" options={GOAL_OPTIONS} value={answers.primaryGoal} onChange={choose} onAdvance={onAdvance} columns={2} />;
}
