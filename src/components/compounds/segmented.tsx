"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Full wording for the tooltip / assistive tech when the visible label is abbreviated. */
  title?: string;
}

/**
 * Bordered segmented control: one shared 1px ink frame, cells divided by
 * 1px rules, the active cell filled ink. Behaves as a radio group — arrow
 * keys move the selection, Home/End jump to the ends.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
  fill = false,
  size = "md",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
  /** Stretch the cells to fill the container width (equal columns). */
  fill?: boolean;
  size?: "sm" | "md";
}) {
  const values = options.map((o) => o.value);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = values.indexOf(value);
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % values.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + values.length) % values.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = values.length - 1;
    else return;
    e.preventDefault();
    const target = values[next];
    onChange(target);
    e.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-value="${target}"]`)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("border border-ink bg-white", fill ? "grid auto-cols-fr grid-flow-col" : "inline-flex", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.title}
            title={o.title}
            data-value={o.value}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={onKeyDown}
            className={cn(
              "whitespace-nowrap border-r border-ink font-mono font-medium uppercase tracking-[0.1em] transition-colors duration-150 last:border-r-0",
              // Both sizes keep a 44px target on touch widths; "sm" tightens from `sm` upwards.
              size === "md" ? "h-11 min-w-11 px-3 text-[11px]" : "h-11 min-w-9 px-2.5 text-[10.5px] sm:h-9",
              active ? "bg-ink text-white" : "text-ink hover:bg-paper-2",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
