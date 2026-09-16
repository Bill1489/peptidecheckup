"use client";

import { cn } from "@/lib/utils";

const SEGMENTS = 10;

/** Segmented completeness meter (■■■■■■□□□□) with a tabular percentage. */
export function CompletenessMeter({ score, className }: { score: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const filled = Math.round((clamped / 100) * SEGMENTS);
  const complete = clamped >= 100;

  return (
    <div className={cn("flex items-center gap-4", className)} role="img" aria-label={`Assessment completeness ${clamped}%`}>
      <span className="font-display text-[2.25rem] leading-none tnum text-ink">
        {clamped}
        <span className="text-[1rem] text-muted">%</span>
      </span>
      <span className="flex items-center gap-[3px]" aria-hidden>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-3.5 w-3 border border-ink sm:w-3.5",
              i < filled ? (complete ? "border-brand-600 bg-brand-600" : "bg-ink") : "bg-white",
            )}
          />
        ))}
      </span>
    </div>
  );
}
