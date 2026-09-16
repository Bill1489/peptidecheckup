"use client";

import * as React from "react";
import type { ChipGroup, TextFollowUp, TextStep } from "@/lib/assessment/flow";
import type { AssessmentAnswers } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";
import { useAnswers, useDebouncedField, useSetAnswer } from "../hooks";
import { Chip, Field, FieldError, Kbd, MonoLabel, Textarea, TextInput } from "../primitives";

/**
 * Free-text question (Q2, Q9, risk details, final). Local-first with a 150 ms
 * debounce; flushes on blur, ⌘/Ctrl+Enter and unmount.
 */
export function TextArea({ step }: { step: TextStep }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const stored = (answers[step.field] as string | undefined) ?? "";
  const commit = React.useCallback((v: string) => setAnswer(step.field, v), [setAnswer, step.field]);
  const [value, update, flush] = useDebouncedField(stored, commit);
  const max = step.maxLength;
  const remaining = max ? max - value.length : undefined;
  const id = `q-${step.id}`;

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <label htmlFor={id} className="sr-only">
          {step.title}
        </label>
        <Textarea
          id={id}
          data-autofocus="always"
          value={value}
          maxLength={max}
          placeholder={step.placeholder}
          rows={5}
          onChange={(e) => update(e.target.value)}
          onBlur={flush}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) flush();
          }}
          className="text-[16px]"
        />
        <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-2">
          <span className="inline-flex items-center gap-1.5">
            {step.optional && <span>Optional</span>}
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              {step.optional && <span aria-hidden>·</span>}
              <Kbd>⌘ / Ctrl</Kbd>
              <Kbd>↵</Kbd>
              <span>to continue</span>
            </span>
          </span>
          {max !== undefined && remaining !== undefined && (
            <span className={cn("tnum", remaining < 40 && "text-caution")} aria-live={remaining < 40 ? "polite" : "off"}>
              {value.length} / {max}
            </span>
          )}
        </div>
      </div>
      {step.chips && <ChipsGroup group={step.chips} />}
    </div>
  );
}

function ChipsGroup({ group }: { group: ChipGroup }) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const selected = (answers[group.field] as string[] | undefined) ?? [];

  const toggle = (v: string) => {
    const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
    setAnswer(group.field, next as AssessmentAnswers[typeof group.field]);
  };

  return (
    <div className="grid gap-3">
      <MonoLabel>{group.label}</MonoLabel>
      <div role="group" aria-label={group.label} className="flex flex-wrap gap-2">
        {group.options.map((o) => (
          <Chip key={o.value} selected={selected.includes(o.value)} onClick={() => toggle(o.value)}>
            {o.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/**
 * Follow-up input revealed by a specific option (e.g. "Other" → describe).
 */
export function FollowUpText({
  followUp,
  showErrors,
}: {
  followUp: TextFollowUp;
  showErrors?: boolean;
}) {
  const answers = useAnswers();
  const setAnswer = useSetAnswer();
  const stored = (answers[followUp.field] as string | undefined) ?? "";
  const commit = React.useCallback((v: string) => setAnswer(followUp.field, v), [setAnswer, followUp.field]);
  const [value, update, flush] = useDebouncedField(stored, commit);
  const id = `follow-${followUp.field}`;
  const invalid = Boolean(showErrors && followUp.required && !value.trim());

  const shared = {
    id,
    value,
    placeholder: followUp.placeholder,
    "data-autofocus": "always",
    "aria-invalid": invalid || undefined,
    onBlur: flush,
  } as const;

  return (
    <div className="border border-ink border-l-[3px] border-l-brand-600 bg-white p-4 sm:p-5">
      <Field label={followUp.label} htmlFor={id} optional={!followUp.required}>
        {followUp.multiline ? (
          <Textarea
            {...shared}
            rows={3}
            onChange={(e) => update(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) flush();
            }}
          />
        ) : (
          <TextInput
            {...shared}
            type="text"
            onChange={(e) => update(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") flush();
            }}
          />
        )}
        {invalid && <FieldError>Please add a few words here.</FieldError>}
      </Field>
    </div>
  );
}
