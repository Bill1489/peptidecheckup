"use client";

import * as React from "react";
import { getCompound } from "@/data/compounds";
import { useAssessmentStore } from "@/lib/assessment/store";
import { cn } from "@/lib/utils";
import { useAnswers } from "../hooks";
import { FieldError, InlineNotice } from "../primitives";
import { Marker } from "./option-cards";

/**
 * Q8 — which of the selected compounds would be combined. Defaults to all of
 * them; writes `combinations: [[...slugs]]`.
 */
export function CombinationBuilder({ showErrors }: { showErrors?: boolean }) {
  const answers = useAnswers();
  const setAnswers = useAssessmentStore((s) => s.setAnswers);
  const selectedSlugs = React.useMemo(() => answers.consideredCompounds.map((c) => c.slug), [answers.consideredCompounds]);
  const stored = answers.combinations[0];

  // Default to "all selected together"; drop anything no longer selected.
  React.useEffect(() => {
    const a = useAssessmentStore.getState().answers;
    const slugs = a.consideredCompounds.map((c) => c.slug);
    const current = a.combinations[0];
    if (!current) {
      useAssessmentStore.getState().setAnswers({ combinations: [slugs] });
      return;
    }
    const pruned = current.filter((s) => slugs.includes(s));
    if (pruned.length !== current.length) {
      useAssessmentStore.getState().setAnswers({ combinations: [pruned] });
    }
  }, [selectedSlugs]);

  const combo = React.useMemo(() => new Set(stored ?? selectedSlugs), [stored, selectedSlugs]);

  const toggle = (slug: string) => {
    const next = new Set(combo);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setAnswers({ combinations: [selectedSlugs.filter((s) => next.has(s))] });
  };

  const names = selectedSlugs.filter((s) => combo.has(s)).map((s) => getCompound(s)?.name ?? s);
  const invalid = Boolean(showErrors && names.length < 2);

  return (
    <div className="grid gap-5">
      <div role="group" aria-label="Compounds to combine" className="cell-grid">
        {selectedSlugs.map((slug, i) => {
          const compound = getCompound(slug);
          const checked = combo.has(slug);
          return (
            <div key={slug} className="flex">
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                data-option
                onClick={() => toggle(slug)}
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-none px-4 py-3.5 text-left transition-colors duration-150",
                  checked ? "bg-ink text-white" : "hover-invert",
                )}
              >
                <Marker index={i + 1} selected={checked} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium">{compound?.name ?? slug}</span>
                  {compound && <span className="block text-[13px] opacity-70">{compound.classLabel}</span>}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <InlineNotice tone="brand">
        {names.length >= 2 ? (
          <p>
            You would combine <span className="font-medium text-ink">{names.join(" + ")}</span>. Your report will assess
            this combination for overlapping considerations and evidence gaps.
          </p>
        ) : (
          <p>Tick at least two compounds to describe a combination.</p>
        )}
      </InlineNotice>

      {invalid && <FieldError>Choose at least two compounds to describe a combination.</FieldError>}
    </div>
  );
}
