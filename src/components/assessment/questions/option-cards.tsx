"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Bandage,
  Check,
  Dumbbell,
  Ellipsis,
  Flame,
  Heart,
  Hourglass,
  Moon,
  Scale,
  Scissors,
  Sparkles,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { OptionIcon, StepOption } from "@/lib/assessment/flow";
import { cn } from "@/lib/utils";
import { useLatest } from "../hooks";
import { EASE } from "../primitives";

const ICONS: Record<OptionIcon, LucideIcon> = {
  Scale,
  Flame,
  Dumbbell,
  Zap,
  Bandage,
  Sparkles,
  Scissors,
  Heart,
  Moon,
  Sun,
  Hourglass,
  MoreHorizontal: Ellipsis,
};

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
  /** Show 1–9 keyboard hints (desktop) */
  numbered?: boolean;
  className?: string;
}

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
  const reduced = useReducedMotion();
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
      className={cn("grid gap-2.5", columns === 2 && "sm:grid-cols-2", size === "lg" && "grid-cols-2", className)}
    >
      {options.map((option, i) => {
        const selected = isSelected(option.value);
        const Icon = option.icon ? ICONS[option.icon] : undefined;
        return (
          <motion.div
            key={option.value}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: reduced ? 0 : Math.min(i, 12) * 0.03 }}
          >
            <button
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={selected}
              data-option
              onClick={() => select(option)}
              className={cn(
                "group relative flex w-full items-center gap-4 rounded-2xl border bg-white text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-ink/20 hover:shadow-card active:scale-[0.99]",
                size === "lg" ? "min-h-[5.5rem] justify-center px-4 py-5 sm:min-h-[6.5rem]" : "min-h-14 px-4 py-3.5",
                selected ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500" : "border-line",
              )}
            >
              {numbered && i < 9 && size !== "lg" && (
                <span
                  aria-hidden
                  className={cn(
                    "hidden h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[0.65rem] sm:flex",
                    selected ? "border-brand-300 bg-white text-brand-700" : "border-line-strong bg-paper text-muted-2",
                  )}
                >
                  {i + 1}
                </span>
              )}
              {Icon && (
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    selected ? "bg-brand-100 text-brand-700" : "bg-paper-2 text-ink-3 group-hover:bg-paper-3",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
              )}
              <span className={cn("min-w-0 flex-1", size === "lg" && "flex-none text-center")}>
                <span
                  className={cn(
                    "block font-medium text-ink",
                    size === "lg" ? "font-display text-xl sm:text-2xl" : "text-[0.95rem]",
                  )}
                >
                  {option.label}
                </span>
                {option.hint && <span className="mt-0.5 block text-sm leading-snug text-muted">{option.hint}</span>}
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                  size === "lg" && "absolute right-3 top-3",
                  selected
                    ? "scale-100 border-brand-500 bg-brand-500 text-white"
                    : "scale-90 border-line-strong bg-white text-transparent group-hover:border-ink/30",
                  multi && "rounded-md",
                )}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
