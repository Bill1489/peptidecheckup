"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { JURISDICTION_LABELS } from "@/data/types";
import { cn } from "@/lib/utils";
import { SELECTABLE_JURISDICTIONS, type SelectableJurisdiction } from "@/lib/compare";

/**
 * Segmented control for the five main jurisdictions. Behaves as a radio group:
 * arrow keys move the selection, the active pill slides between options.
 */
export function JurisdictionSwitch({
  value,
  onChange,
  className,
  label = "Regulatory jurisdiction",
}: {
  value: SelectableJurisdiction;
  onChange: (value: SelectableJurisdiction) => void;
  className?: string;
  label?: string;
}) {
  const id = React.useId();
  const reduce = useReducedMotion();

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = SELECTABLE_JURISDICTIONS.indexOf(value);
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % SELECTABLE_JURISDICTIONS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + SELECTABLE_JURISDICTIONS.length) % SELECTABLE_JURISDICTIONS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = SELECTABLE_JURISDICTIONS.length - 1;
    else return;
    e.preventDefault();
    const target = SELECTABLE_JURISDICTIONS[next];
    onChange(target);
    const button = e.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-value="${target}"]`);
    button?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-white p-1 shadow-inset",
        className,
      )}
    >
      {SELECTABLE_JURISDICTIONS.map((j) => {
        const active = j === value;
        return (
          <button
            key={j}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={JURISDICTION_LABELS[j]}
            title={JURISDICTION_LABELS[j]}
            data-value={j}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(j)}
            onKeyDown={onKeyDown}
            className={cn(
              "relative h-11 min-w-11 rounded-full px-3 font-mono text-xs font-medium tracking-[0.08em] transition-colors sm:h-8 sm:min-w-10",
              active ? "text-white" : "text-ink-3 hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 rounded-full bg-ink"
                aria-hidden
              />
            )}
            <span className="relative z-10">{j}</span>
          </button>
        );
      })}
    </div>
  );
}
