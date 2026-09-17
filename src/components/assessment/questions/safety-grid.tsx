"use client";

import * as React from "react";
import { riskHint } from "@/lib/assessment/derived";
import { RISK_QUESTIONS, anyRiskYes } from "@/lib/assessment/flow";
import { useAssessmentStore } from "@/lib/assessment/store";
import type { YesNo } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";
import { useAnswers, useDebouncedField, useSetAnswer } from "../hooks";
import { Field, MonoLabel, Reveal, Segmented, Textarea } from "../primitives";

const YES_NO: { value: YesNo; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

/**
 * The seven safety questions on one screen. A "yes" highlights the row in
 * orange and reveals a details box whose text is carried into the report.
 * These answers are what let the brand say no.
 */
export function SafetyGrid({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const answered = RISK_QUESTIONS.filter((q) => Boolean(answers[q.field])).length;

  return (
    <div className="grid gap-6">
      <MonoLabel className="tnum" aria-live="polite">
        {answered} of {RISK_QUESTIONS.length} answered
      </MonoLabel>

      <ol className="border border-ink" aria-label="Safety screen">
        {RISK_QUESTIONS.map((q, i) => {
          const value = answers[q.field];
          const yes = value === "yes";
          const missing = Boolean(showErrors && !value);
          const hint = riskHint(q.id, answers);
          return (
            <li
              key={q.id}
              className={cn(
                "grid gap-3 border-b border-ink p-4 last:border-b-0 lg:grid-cols-[1fr_12rem] lg:items-start",
                yes ? "bg-accent-100/60" : "bg-white",
                missing && "border-l-[3px] border-l-accent-500",
              )}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={cn(
                    "mt-[0.2rem] flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[10px] leading-none tnum",
                    yes ? "border-accent-500 bg-accent-500 text-white" : value === "no" ? "border-ink bg-ink text-white" : "border-ink bg-white text-ink",
                  )}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium leading-snug text-ink">{q.title}</p>
                  {hint && <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p>}
                </div>
              </div>
              <Segmented<YesNo>
                label={q.title}
                value={value}
                onChange={(v) => setAnswer(q.field, v)}
                options={YES_NO}
                size="sm"
                className="lg:mt-0.5"
              />
            </li>
          );
        })}
      </ol>

      <Reveal show={anyRiskYes(answers)}>
        <RiskDetailsField />
      </Reveal>
    </div>
  );
}

function RiskDetailsField() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const commit = React.useCallback((v: string) => setAnswers({ riskDetails: v }), [setAnswers]);
  const [value, update, flush] = useDebouncedField(answers.riskDetails ?? "", commit);
  return (
    <div className="border border-ink border-l-[3px] border-l-accent-500 bg-white p-4 sm:p-5">
      <Field
        label="Would you like to add any detail?"
        htmlFor="risk-details"
        optional
        hint="You answered yes to at least one safety question. Anything here goes into your report so you can share it with a clinician."
      >
        <Textarea
          id="risk-details"
          value={value}
          rows={3}
          maxLength={800}
          placeholder="For example: I was told not to use growth-hormone-related treatments after a pituitary scan in 2024"
          onChange={(e) => update(e.target.value)}
          onBlur={flush}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) flush();
          }}
        />
      </Field>
    </div>
  );
}
