"use client";

import * as React from "react";
import { useAssessmentStore } from "@/lib/assessment/store";
import { OTC_LABELS, type OtcCategory } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";
import { useAnswers, useDebouncedField } from "../hooks";
import { Chip, Field, Reveal, TextInput } from "../primitives";

const CATEGORIES = Object.keys(OTC_LABELS) as OtcCategory[];

const HINTS: Partial<Record<OtcCategory, string>> = {
  painkillers: "Paracetamol, ibuprofen, aspirin",
  antihistamines: "Cetirizine, loratadine",
  acid_reducers: "Omeprazole, antacids",
  sleep_aids: "Diphenhydramine, melatonin",
};

/** Q20 — over-the-counter medicines used regularly (multi-select chips). */
export function OtcChips() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const selected = answers.otc;

  const toggle = (c: OtcCategory) => {
    const current = useAssessmentStore.getState().answers.otc;
    const next = current.includes(c) ? current.filter((x) => x !== c) : [...current, c];
    setAnswers({ otc: next, ...(c === "other" && current.includes(c) ? { otcOtherText: undefined } : {}) });
  };

  const none = () => setAnswers({ otc: [], otcOtherText: undefined });

  return (
    <div className="grid gap-5">
      <div role="group" aria-label="Over-the-counter medicines" className="grid gap-2.5 sm:grid-cols-2">
        {CATEGORIES.map((c, i) => {
          const isSelected = selected.includes(c);
          return (
            <button
              key={c}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              data-option
              onClick={() => toggle(c)}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-ink/20 active:scale-[0.99]",
                isSelected ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500" : "border-line",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "hidden h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[0.65rem] sm:flex",
                  isSelected ? "border-brand-300 bg-white text-brand-700" : "border-line-strong bg-paper text-muted-2",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">{OTC_LABELS[c]}</span>
                {HINTS[c] && <span className="block text-xs text-muted">{HINTS[c]}</span>}
              </span>
              <span
                aria-hidden
                className={cn(
                  "h-5 w-5 shrink-0 rounded-md border transition-colors",
                  isSelected ? "border-brand-500 bg-brand-500" : "border-line-strong bg-white",
                )}
              />
            </button>
          );
        })}
      </div>

      <Reveal show={selected.includes("other")}>
        <OtherOtcField />
      </Reveal>

      <div className="flex items-center gap-3">
        <Chip selected={selected.length === 0} onClick={none} role="radio" aria-checked={selected.length === 0}>
          None of these
        </Chip>
        <span className="text-xs text-muted">Regular use means most weeks, not the occasional dose.</span>
      </div>
    </div>
  );
}

function OtherOtcField() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const commit = React.useCallback((v: string) => setAnswers({ otcOtherText: v }), [setAnswers]);
  const [value, update, flush] = useDebouncedField(answers.otcOtherText ?? "", commit);
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
      <Field label="Which other medicines?" htmlFor="otc-other" optional>
        <TextInput
          id="otc-other"
          value={value}
          placeholder="e.g. Decongestant nasal spray"
          data-autofocus="always"
          onChange={(e) => update(e.target.value)}
          onBlur={flush}
          onKeyDown={(e) => {
            if (e.key === "Enter") flush();
          }}
        />
      </Field>
    </div>
  );
}
