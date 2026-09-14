"use client";

import * as React from "react";
import { Check, CircleAlert, Minus, Pencil, ShieldCheck } from "lucide-react";
import { DISCLAIMER_SHORT } from "@/lib/brand";
import type { SectionId } from "@/lib/assessment/types";
import { buildReview, type ReviewStatus } from "@/lib/assessment/summary";
import { Badge } from "@/components/ui/badge";
import { useAnswers } from "../hooks";

const STATUS: Record<ReviewStatus, { label: string; tone: "success" | "warning" | "neutral" | "info" }> = {
  complete: { label: "Complete", tone: "success" },
  skipped: { label: "Skipped", tone: "warning" },
  in_progress: { label: "Partly answered", tone: "info" },
  not_started: { label: "Not answered", tone: "neutral" },
};

/**
 * Final review — grouped summary of every answer with "Edit" links that jump
 * straight to the relevant step.
 */
export function Review({
  onEdit,
  onAddSection,
}: {
  onEdit: (stepId: string) => void;
  /** Jump into a skipped / unanswered section */
  onAddSection: (sectionId: SectionId) => void;
}) {
  const answers = useAnswers();
  const sections = React.useMemo(() => buildReview(answers), [answers]);
  const skipped = sections.filter((s) => s.status === "skipped").length;

  return (
    <div className="grid gap-4">
      {skipped > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-caution/30 bg-caution-soft p-4 text-sm leading-relaxed text-ink-2">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-caution" aria-hidden />
          <p>
            You skipped {skipped} optional {skipped === 1 ? "section" : "sections"}. Your report will still be generated
            and will note what is missing. You can add details below if you&apos;d like a more complete picture.
          </p>
        </div>
      )}

      <ol className="grid gap-3">
        {sections.map((section, i) => {
          const status = STATUS[section.status];
          const firstStep = section.rows[0]?.stepId;
          return (
            <li key={section.id} className="rounded-2xl border border-line bg-white shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.65rem] text-muted-2">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-lg text-ink">{section.title}</h3>
                  <Badge tone={status.tone} size="xs" dot>
                    {status.label}
                  </Badge>
                </div>
                {section.status === "skipped" || section.status === "not_started" ? (
                  <button
                    type="button"
                    onClick={() => onAddSection(section.id)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-brand-700 hover:bg-brand-50"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    Add details
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => (firstStep ? onEdit(firstStep) : onAddSection(section.id))}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-brand-700 hover:bg-brand-50"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    Edit
                  </button>
                )}
              </div>
              {section.rows.length > 0 ? (
                <dl className="divide-y divide-line px-4 sm:px-5">
                  {section.rows.map((r, j) => (
                    <div key={`${r.stepId}-${j}`} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-2 sm:pt-0.5 sm:text-[0.7rem]">{r.label}</dt>
                      <dd className="flex items-start justify-between gap-3 text-sm leading-relaxed text-ink-2">
                        <span className="min-w-0 break-words">{r.value}</span>
                        <button
                          type="button"
                          onClick={() => onEdit(r.stepId)}
                          aria-label={`Edit ${r.label}`}
                          className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-2 transition-colors hover:bg-ink/6 hover:text-ink sm:inline-flex"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="flex items-center gap-2 px-4 py-3 text-sm text-muted sm:px-5">
                  <Minus className="h-3.5 w-3.5" aria-hidden />
                  {section.optional ? "Nothing recorded — this section is optional." : "Nothing recorded yet."}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-2 grid gap-3 rounded-2xl border border-line bg-paper-2/70 p-4 text-xs leading-relaxed text-muted sm:p-5">
        <p className="flex items-start gap-2 text-ink-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
          <span>
            Your report is produced by a deterministic, clinician-reviewable rules engine on this device. It compares your
            answers against our maintained evidence and regulatory database — nothing is guessed.
          </span>
        </p>
        <p className="flex items-start gap-2">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-2" aria-hidden />
          <span>{DISCLAIMER_SHORT}</span>
        </p>
      </div>
    </div>
  );
}
