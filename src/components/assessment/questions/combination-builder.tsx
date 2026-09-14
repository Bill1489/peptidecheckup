"use client";

import * as React from "react";
import { Check, Layers } from "lucide-react";
import { getCompound } from "@/data/compounds";
import { useAssessmentStore } from "@/lib/assessment/store";
import { cn } from "@/lib/utils";
import { useAnswers } from "../hooks";
import { FieldError } from "../primitives";

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
      <div role="group" aria-label="Compounds to combine" className="grid gap-2.5">
        {selectedSlugs.map((slug) => {
          const compound = getCompound(slug);
          const checked = combo.has(slug);
          return (
            <button
              key={slug}
              type="button"
              role="checkbox"
              aria-checked={checked}
              data-option
              onClick={() => toggle(slug)}
              className={cn(
                "flex min-h-14 w-full items-center gap-4 rounded-2xl border bg-white px-4 py-3 text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-ink/20 active:scale-[0.99]",
                checked ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500" : "border-line",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                  checked ? "border-brand-500 bg-brand-500 text-white" : "border-line-strong bg-white text-transparent",
                )}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">{compound?.name ?? slug}</span>
                {compound && <span className="block text-xs text-muted">{compound.classLabel}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-line bg-paper-2/70 p-4 text-sm leading-relaxed text-ink-2">
        <Layers className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
        {names.length >= 2 ? (
          <p>
            You would combine <span className="font-medium text-ink">{names.join(" + ")}</span>. Your report will
            assess this combination for overlapping considerations and evidence gaps.
          </p>
        ) : (
          <p>Tick at least two compounds to describe a combination.</p>
        )}
      </div>

      {invalid && <FieldError>Choose at least two compounds to describe a combination.</FieldError>}
    </div>
  );
}
