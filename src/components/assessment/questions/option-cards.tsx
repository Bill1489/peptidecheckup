"use client";

import * as React from "react";
import type { StepOption } from "@/lib/assessment/flow";
import { cn } from "@/lib/utils";
import { useLatest } from "../hooks";

export const AUTO_ADVANCE_MS = 350;

export interface OptionCardsProps {
  options: StepOption[];
  value: string | string[] | undefined;
  /** Multi-select toggles; single-select replaces */
  multi?: boolean;
  onChange: (value: string) => void;
  /** Single-select only: called ~350 ms after a choice that needs no follow-up */
  onAdvance?: () => void;
  columns?: 1 | 2;
  /** Big, centred labels (yes / no) */
  size?: "md" | "lg";
  /** Group label for assistive tech */
  label: string;
  /** Show 1–9 index markers (doubles as the radio / checkbox marker) */
  numbered?: boolean;
  className?: string;
}

/**
 * Option cells in a shared-border grid. The square marker on the left carries
 * the keyboard index and fills cobalt when selected; the whole cell inverts to
 * ink when selected or hovered.
 */
export function OptionCards({
  options,
  value,
  multi,
  onChange,
  onAdvance,
  columns = 1,
  size = "md",
  label,
  numbered = true,
  className,
}: OptionCardsProps) {
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceRef = useLatest(onAdvance);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const isSelected = (v: string) => (Array.isArray(value) ? value.includes(v) : value === v);

  const select = (option: StepOption) => {
    onChange(option.value);
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (!multi && onAdvance && !option.followUp && !option.noAutoAdvance) {
      timer.current = setTimeout(() => advanceRef.current?.(), AUTO_ADVANCE_MS);
    }
  };

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-label={label}
      className={cn(
        "cell-grid",
        // An odd last cell spans the row so the grid never shows an empty (ink) area.
        columns === 2 && "sm:grid-cols-2 sm:[&>*:nth-child(odd):last-child]:col-span-2",
        size === "lg" && "grid-cols-2",
        className,
      )}
    >
      {options.map((option, i) => {
        const selected = isSelected(option.value);
        return (
          <div key={option.value} className="flex">
            <button
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={selected}
              data-option
              onClick={() => select(option)}
              className={cn(
                "relative flex w-full items-center gap-3 rounded-none text-left transition-colors duration-150 focus-visible:z-10",
                size === "lg" ? "min-h-[5.5rem] justify-center px-4 py-5 sm:min-h-[6.5rem]" : "min-h-14 px-4 py-3.5",
                // Unselected cells carry no bg/text utilities so the (components-layer) hover-invert rule can win.
                selected ? "bg-ink text-white" : "hover-invert",
              )}
            >
              <Marker index={numbered && i < 9 ? i + 1 : undefined} selected={selected} floating={size === "lg"} />
              <span className={cn("min-w-0 flex-1", size === "lg" && "flex-none text-center")}>
                <span
                  className={cn(
                    "block",
                    size === "lg" ? "font-display text-[1.35rem] uppercase sm:text-[1.6rem]" : "text-[15px] font-medium",
                  )}
                >
                  {option.label}
                </span>
                {option.hint && <span className="mt-0.5 block text-[13px] leading-snug opacity-70">{option.hint}</span>}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** Square index / state marker. Cobalt when selected; follows the text colour otherwise. */
export function Marker({ index, selected, floating }: { index?: number; selected: boolean; floating?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[10px] leading-none tnum transition-colors duration-150",
        floating && "absolute left-3 top-3",
        selected ? "border-brand-600 bg-brand-600 text-white" : "border-current bg-transparent",
      )}
    >
      {index ?? (selected ? "■" : "")}
    </span>
  );
}
