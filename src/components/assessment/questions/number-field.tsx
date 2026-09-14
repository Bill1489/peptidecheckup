"use client";

import * as React from "react";
import type { NumberStep } from "@/lib/assessment/flow";
import { cn } from "@/lib/utils";
import { useAnswers, useSetAnswer } from "../hooks";
import { FieldError, TextInput } from "../primitives";

/**
 * Age (Q10). Writes immediately (numbers are cheap). The under-18 full-stop
 * screen is triggered by the wizard when the user tries to continue, so a
 * half-typed "1" never flips the screen.
 */
export function NumberField({ step, showErrors }: { step: NumberStep; showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const stored = answers[step.field];
  const [text, setText] = React.useState(stored === undefined ? "" : String(stored));
  const id = `q-${step.id}`;

  const parsed = text.trim() === "" ? undefined : Number(text);
  const outOfRange =
    parsed !== undefined && !Number.isNaN(parsed) && parsed >= 18 && parsed > step.max;
  const invalid = Boolean(showErrors && !step.valid(answers));

  return (
    <div className="grid gap-3">
      <label htmlFor={id} className="sr-only">
        {step.title}
      </label>
      <div className="flex items-center gap-3">
        <TextInput
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={3}
          data-autofocus="always"
          value={text}
          aria-invalid={invalid || undefined}
          aria-describedby={`${id}-hint`}
          placeholder="—"
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, "").slice(0, 3);
            setText(raw);
            const n = raw === "" ? undefined : Number(raw);
            setAnswer(step.field, n === undefined || Number.isNaN(n) ? undefined : n);
          }}
          className={cn("h-16 w-36 text-center font-display text-3xl tabular-nums")}
        />
        {step.suffix && <span className="text-lg text-muted">{step.suffix}</span>}
      </div>
      <p id={`${id}-hint`} className="text-xs text-muted-2">
        Whole years. We don&apos;t store your date of birth.
      </p>
      {invalid && (
        <FieldError>
          {outOfRange ? `Enter an age up to ${step.max}.` : "Enter your age in years to continue."}
        </FieldError>
      )}
    </div>
  );
}
