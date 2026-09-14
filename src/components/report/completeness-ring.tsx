"use client";

import { cn } from "@/lib/utils";
import { useCountUp } from "./use-count-up";

/** SVG ring showing assessment completeness (0–100). */
export function CompletenessRing({ score, size = 112, className }: { score: number; size?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, score));
  const shown = useCountUp(clamped, 1100);
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - shown / 100);
  const complete = clamped >= 100;

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Assessment completeness ${clamped}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-paper-3)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={complete ? "var(--color-brand-500)" : "var(--color-brand-400)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[1.65rem] leading-none tracking-[-0.03em] text-ink tabular-nums">
          {shown}
          <span className="text-base text-muted">%</span>
        </span>
      </div>
    </div>
  );
}
