"use client";

import * as React from "react";
import { stepOptions, type YesNoStep } from "@/lib/assessment/flow";
import { useAnswers, useSetAnswer } from "../hooks";
import { Reveal } from "../primitives";
import { OptionCards } from "./option-cards";
import { FollowUpText } from "./text-area";

/**
 * Yes / No (or Yes / No / Unsure, Yes / No / N/A) cells with an optional
 * follow-up textarea and a compound-tailored hint.
 */
export function YesNoCards({
  step,
  showErrors,
  onAdvance,
}: {
  step: YesNoStep;
  showErrors?: boolean;
  onAdvance?: () => void;
}) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const value = answers[step.field] as string | undefined;
  const options = React.useMemo(
    () =>
      stepOptions(step, answers).map((o) => ({
        ...o,
        followUp: Boolean(step.followUp?.when.includes(o.value)),
      })),
    [step, answers],
  );
  const hint = step.hint?.(answers);
  const showFollowUp = Boolean(step.followUp && value && step.followUp.when.includes(value));

  return (
    <div className="grid gap-5">
      {hint && (
        <p className="flex items-start gap-3 text-sm leading-relaxed text-muted">
          <span className="mt-[0.45rem] h-2 w-2 shrink-0 bg-brand-600" aria-hidden />
          <span>{hint}</span>
        </p>
      )}
      <OptionCards
        label={step.title}
        options={options}
        value={value}
        onChange={(v) => setAnswer(step.field, v)}
        onAdvance={onAdvance}
        size={options.length <= 3 ? "lg" : "md"}
        columns={options.length > 3 ? 2 : 1}
        className={options.length === 3 ? "grid-cols-1 sm:grid-cols-3" : undefined}
      />
      <Reveal show={showFollowUp}>{step.followUp && <FollowUpText followUp={step.followUp} showErrors={showErrors} />}</Reveal>
    </div>
  );
}
