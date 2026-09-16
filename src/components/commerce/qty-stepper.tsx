"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Bordered − n + control. 44px targets in the default size, 36px in `sm`. */
export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  label = "Quantity",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const h = size === "md" ? "h-12 w-12" : "h-9 w-9";
  const btn = cn(
    "inline-flex items-center justify-center text-ink transition-colors duration-150 hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30",
    h,
  );
  return (
    <div className={cn("inline-flex items-stretch border border-ink bg-white", className)} role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span
        className={cn("inline-flex items-center justify-center border-x border-ink font-mono text-[13px] tnum", size === "md" ? "min-w-12 px-2" : "min-w-9 px-1.5")}
        aria-live="polite"
      >
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
