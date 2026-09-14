import { EVIDENCE_COLOR_CLASS } from "@/components/ui/badge";
import {
  EVIDENCE_DESCRIPTIONS,
  EVIDENCE_LABELS,
  HUMAN_EVIDENCE_LABELS,
  type EvidenceQuality,
  type HumanEvidenceLevel,
} from "@/data/types";
import { cn } from "@/lib/utils";

const LADDER: EvidenceQuality[] = ["strong", "moderate", "limited", "preliminary", "insufficient"];

/**
 * Shows where a compound sits on the five-point evidence scale, with the
 * definition of its grade. Pure presentational — safe in server components.
 */
export function EvidenceLadder({
  level,
  humanEvidenceLevel,
  className,
}: {
  level: EvidenceQuality;
  humanEvidenceLevel: HumanEvidenceLevel;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6", className)}>
      <p className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-2">Overall evidence grade</p>
      <p className="mt-2 font-display text-3xl text-ink">{EVIDENCE_LABELS[level]}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{EVIDENCE_DESCRIPTIONS[level]}</p>

      <ol className="mt-5 space-y-1.5" aria-label="Evidence scale">
        {LADDER.map((grade) => {
          const active = grade === level;
          return (
            <li key={grade} className="flex items-center gap-3">
              <span
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  active ? EVIDENCE_COLOR_CLASS[grade] : "bg-ink/8",
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "w-24 shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.12em]",
                  active ? "text-ink" : "text-muted-2",
                )}
              >
                {EVIDENCE_LABELS[grade]}
                {active && <span className="sr-only"> (this compound)</span>}
              </span>
            </li>
          );
        })}
      </ol>

      <dl className="mt-5 border-t border-line pt-4">
        <dt className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-2">Human evidence</dt>
        <dd className="mt-1 text-sm font-medium text-ink">{HUMAN_EVIDENCE_LABELS[humanEvidenceLevel]}</dd>
      </dl>
    </div>
  );
}
