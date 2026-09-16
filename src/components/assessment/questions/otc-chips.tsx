"use client";

import * as React from "react";
import { useAssessmentStore } from "@/lib/assessment/store";
import { OTC_LABELS, type OtcCategory } from "@/lib/assessment/types";
import { useAnswers, useDebouncedField } from "../hooks";
import { Chip, Field, Reveal, TextInput } from "../primitives";
import { OptionCards } from "./option-cards";

const CATEGORIES = Object.keys(OTC_LABELS) as OtcCategory[];

const HINTS: Partial<Record<OtcCategory, string>> = {
  painkillers: "Paracetamol, ibuprofen, aspirin",
  antihistamines: "Cetirizine, loratadine",
  acid_reducers: "Omeprazole, antacids",
  sleep_aids: "Diphenhydramine, melatonin",
};

const OPTIONS = CATEGORIES.map((c) => ({ value: c, label: OTC_LABELS[c], hint: HINTS[c] }));

/** Q20 — over-the-counter medicines used regularly (multi-select cells). */
export function OtcChips() {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const selected = answers.otc;

  const toggle = (v: string) => {
    const c = v as OtcCategory;
    const current = useAssessmentStore.getState().answers.otc;
    const next = current.includes(c) ? current.filter((x) => x !== c) : [...current, c];
    setAnswers({ otc: next, ...(c === "other" && current.includes(c) ? { otcOtherText: undefined } : {}) });
  };

  const none = () => setAnswers({ otc: [], otcOtherText: undefined });

  return (
    <div className="grid gap-5">
      <OptionCards label="Over-the-counter medicines" options={OPTIONS} value={selected} multi onChange={toggle} columns={2} />

      <Reveal show={selected.includes("other")}>
        <OtherOtcField />
      </Reveal>

      <div className="flex flex-wrap items-center gap-3">
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
    <div className="border border-ink border-l-[3px] border-l-brand-600 bg-white p-4">
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
