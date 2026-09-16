"use client";

import * as React from "react";
import { useAssessmentStore } from "@/lib/assessment/store";
import { REPORT_WANTS, type ReportWant } from "@/lib/assessment/types";
import { useAnswers } from "../hooks";
import { FieldError } from "../primitives";
import { OptionCards } from "./option-cards";

const OPTIONS = REPORT_WANTS.map((w) => ({ value: w.id, label: w.label }));

/** Q43 — what the report should emphasise (multi-select). */
export function ReportWants({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const selected = answers.reportWants;
  const all = selected.length === REPORT_WANTS.length;

  const toggle = (v: string) => {
    const current = useAssessmentStore.getState().answers.reportWants;
    const id = v as ReportWant;
    setAnswers({ reportWants: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] });
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="label-mono tnum" aria-live="polite">
          {selected.length === 0 ? "Nothing selected yet" : `${selected.length} of ${REPORT_WANTS.length} selected`}
        </span>
        <button
          type="button"
          onClick={() => setAnswers({ reportWants: all ? [] : REPORT_WANTS.map((w) => w.id) })}
          className="link-rule inline-flex min-h-11 items-center font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink"
        >
          {all ? "Clear all" : "Select all"}
        </button>
      </div>
      <OptionCards label="Report focus" options={OPTIONS} value={selected} multi onChange={toggle} columns={2} />
      {showErrors && selected.length === 0 && <FieldError>Choose at least one to continue.</FieldError>}
    </div>
  );
}
