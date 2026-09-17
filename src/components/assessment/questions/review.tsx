"use client";

import * as React from "react";
import { BRAND, DISCLAIMER_SHORT } from "@/lib/brand";
import type { SectionId } from "@/lib/assessment/types";
import { buildReview, type ReviewStatus } from "@/lib/assessment/summary";
import { Badge } from "@/components/ui/badge";
import { useAnswers } from "../hooks";
import { InlineNotice } from "../primitives";

const STATUS: Record<ReviewStatus, { label: string; tone: "brand" | "warning" | "neutral" | "outline" }> = {
  complete: { label: "Complete", tone: "brand" },
  skipped: { label: "Skipped", tone: "warning" },
  in_progress: { label: "Partly answered", tone: "outline" },
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
    <div className="grid gap-5">
      {skipped > 0 && (
        <InlineNotice tone="caution" title={`${skipped} optional ${skipped === 1 ? "section" : "sections"} skipped`}>
          Your match and report will still be produced and will note what is missing. You can add details below if
          you&apos;d like a more complete picture.
        </InlineNotice>
      )}

      <ol className="border border-ink">
        {sections.map((section, i) => {
          const status = STATUS[section.status];
          const firstStep = section.rows[0]?.stepId;
          const needsDetails = section.status === "skipped" || section.status === "not_started";
          return (
            <li key={section.id} className="border-b border-ink last:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper-2 py-2.5 pl-4 pr-1">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <span className="label-mono tnum">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[15px] font-bold text-ink">{section.title}</h3>
                  <Badge tone={status.tone} size="xs" dot>
                    {status.label}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => (needsDetails || !firstStep ? onAddSection(section.id) : onEdit(firstStep))}
                  className="link-rule inline-flex min-h-11 items-center px-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink"
                >
                  {needsDetails ? "Add details" : "Edit"}
                </button>
              </div>
              {section.rows.length > 0 ? (
                <dl className="divide-y divide-line px-4">
                  {section.rows.map((r, j) => (
                    <div key={`${r.stepId}-${j}`} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
                      <dt className="label-mono sm:pt-0.5">{r.label}</dt>
                      <dd className="flex items-start justify-between gap-3 text-sm leading-relaxed text-ink">
                        <span className="min-w-0 break-words">{r.value}</span>
                        <button
                          type="button"
                          onClick={() => onEdit(r.stepId)}
                          aria-label={`Edit ${r.label}`}
                          className="link-rule hidden shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted hover:text-ink sm:inline"
                        >
                          Edit
                        </button>
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="px-4 py-3 text-sm text-muted">
                  {section.optional ? "Nothing recorded — this section is optional." : "Nothing recorded yet."}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-3 border border-ink bg-paper-2 p-4 text-xs leading-relaxed text-muted sm:p-5">
        <p className="text-ink-2">
          Your match is produced on this device by a deterministic, clinician-reviewable rules engine. It screens every
          compound in the six {BRAND.name} pens against your answers and our maintained evidence and regulatory database —
          nothing is guessed — then scores each pen for fit. A safety flag can rule a pen out entirely.
        </p>
        <p>{DISCLAIMER_SHORT}</p>
      </div>
    </div>
  );
}
