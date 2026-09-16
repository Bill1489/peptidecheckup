import { SpecRow } from "@/components/ui/card";
import {
  EVIDENCE_DESCRIPTIONS,
  EVIDENCE_LABELS,
  EVIDENCE_RANK,
  HUMAN_EVIDENCE_LABELS,
  type EvidenceQuality,
  type HumanEvidenceLevel,
} from "@/data/types";
import { cn } from "@/lib/utils";

const LADDER: EvidenceQuality[] = ["strong", "moderate", "limited", "preliminary", "insufficient"];

/** Bar length per grade — a descending ladder, 5/5 down to 1/5. */
const WIDTH: Record<EvidenceQuality, string> = {
  strong: "w-full",
  moderate: "w-4/5",
  limited: "w-3/5",
  preliminary: "w-2/5",
  insufficient: "w-1/5",
};

/**
 * Where a compound sits on the five-point evidence scale, drawn as stacked
 * bars: the compound's grade is filled ink (cobalt for "Strong"), the rest
 * stay grey. Pure presentational — safe in server components.
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
    <section className={cn("p-5 sm:p-6", className)} aria-labelledby="evidence-grade-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="evidence-grade-title" className="label-mono text-ink">
          Overall evidence
        </h2>
        <p className="label-mono tnum">{EVIDENCE_RANK[level]} / 5</p>
      </div>
      <p className="mt-3 text-[2rem] uppercase leading-none text-ink sm:text-[2.4rem]">{EVIDENCE_LABELS[level]}</p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{EVIDENCE_DESCRIPTIONS[level]}</p>

      <ol className="mt-5 space-y-1.5" aria-label="Evidence scale">
        {LADDER.map((grade) => {
          const active = grade === level;
          return (
            <li key={grade} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3">
              <span className={cn("label-mono", active && "text-ink")}>
                {EVIDENCE_LABELS[grade]}
                {active && <span className="sr-only"> (this compound)</span>}
              </span>
              <span className="block h-3 w-full bg-paper-2" aria-hidden>
                <span
                  className={cn(
                    "block h-full transition-colors",
                    WIDTH[grade],
                    active ? (grade === "strong" ? "bg-brand-600" : "bg-ink") : "bg-paper-3",
                  )}
                />
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 border-t border-line">
        <SpecRow label="Human evidence" value={HUMAN_EVIDENCE_LABELS[humanEvidenceLevel]} />
      </div>
    </section>
  );
}
