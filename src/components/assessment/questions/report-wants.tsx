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
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted" aria-live="polite">
          {selected.length === 0 ? "Nothing selected yet" : `${selected.length} of ${REPORT_WANTS.length} selected`}
        </span>
        <button
          type="button"
          onClick={() => setAnswers({ reportWants: all ? [] : REPORT_WANTS.map((w) => w.id) })}
          className="inline-flex min-h-11 items-center rounded-full px-3 font-medium text-brand-700 underline-offset-4 hover:underline"
        >
          {all ? "Clear all" : "Select all"}
        </button>
      </div>
      <OptionCards label="Report focus" options={OPTIONS} value={selected} multi onChange={toggle} columns={2} />
      {showErrors && selected.length === 0 && <FieldError>Choose at least one to continue.</FieldError>}
    </div>
  );
}
