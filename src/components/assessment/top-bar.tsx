"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Check, LogOut, Minus } from "lucide-react";
import { BRAND } from "@/lib/brand";
import type { SectionProgressItem } from "@/lib/assessment/flow";
import type { SectionId } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";
import { LogoMark, Wordmark } from "@/components/ui/logo";

export function TopBar({
  sections,
  percent,
  minutesLeft,
  onJump,
  onSaveExit,
}: {
  sections: SectionProgressItem[];
  percent: number;
  minutesLeft: number;
  onJump: (section: SectionId) => void;
  onSaveExit: () => void;
}) {
  const reduced = useReducedMotion();
  const current = sections.find((s) => s.status === "current");

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="container-x flex h-14 items-center justify-between gap-4 sm:h-16">
        <Link href="/" aria-label={`${BRAND.displayName} home`} className="inline-flex items-center gap-2.5 rounded-md">
          <LogoMark className="h-7 w-7" />
          <Wordmark className="hidden sm:inline" />
        </Link>

        <SectionStepper sections={sections} onJump={onJump} />

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-2 md:inline" aria-live="off">
            ≈{minutesLeft} min left
          </span>
          <button
            type="button"
            onClick={onSaveExit}
            className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink-3 transition-colors hover:bg-ink/6 hover:text-ink"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Save &amp; exit</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      <div className="relative h-0.5 w-full bg-ink/8" role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={current ? `${percent}% — ${current.title}` : `${percent}%`}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-r-full bg-brand-500"
          initial={false}
          animate={{ width: `${Math.max(percent, 1.5)}%` }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 22, mass: 0.6 }}
        />
      </div>
    </header>
  );
}

function SectionStepper({ sections, onJump }: { sections: SectionProgressItem[]; onJump: (section: SectionId) => void }) {
  return (
    <nav aria-label="Sections" className="min-w-0 flex-1 overflow-hidden">
      {/* Mobile / tablet: dots */}
      <ol className="flex items-center justify-center gap-1.5 lg:hidden">
        {sections.map((s) => (
          <li key={s.id}>
            <StepperButton item={s} onJump={onJump} compact />
          </li>
        ))}
      </ol>
      {/* Desktop: numbered circles, label only on the current section */}
      <ol className="hidden items-center justify-center gap-0.5 lg:flex">
        {sections.map((s, i) => (
          <li key={s.id} className="flex items-center">
            <StepperButton item={s} onJump={onJump} labelled={s.status === "current"} />
            {i < sections.length - 1 && <span className="mx-0.5 h-px w-2 bg-line-strong" aria-hidden />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepperButton({
  item,
  onJump,
  compact,
  labelled = true,
}: {
  item: SectionProgressItem;
  onJump: (section: SectionId) => void;
  compact?: boolean;
  /** Show the section name next to the number (desktop: only the current section). */
  labelled?: boolean;
}) {
  const reachable = item.status !== "upcoming";
  const statusLabel = {
    complete: "complete",
    skipped: "skipped",
    current: "current section",
    visited: "started",
    upcoming: "not started",
  }[item.status];

  if (compact) {
    return (
      <button
        type="button"
        disabled={!reachable}
        onClick={() => onJump(item.id)}
        aria-label={`Section ${item.index + 1}: ${item.title} — ${statusLabel}`}
        aria-current={item.status === "current" ? "step" : undefined}
        className="flex h-11 items-center px-0.5 disabled:cursor-default"
      >
        <span
          className={cn(
            "block h-1.5 rounded-full transition-all duration-300 ease-out-expo",
            item.status === "current" && "w-5 bg-brand-500",
            item.status === "complete" && "w-1.5 bg-brand-500/70",
            item.status === "skipped" && "w-1.5 bg-accent-500",
            item.status === "visited" && "w-1.5 bg-brand-300",
            item.status === "upcoming" && "w-1.5 bg-ink/15",
          )}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={!reachable}
      onClick={() => onJump(item.id)}
      aria-label={`Section ${item.index + 1}: ${item.title} — ${statusLabel}`}
      aria-current={item.status === "current" ? "step" : undefined}
      title={`${item.index + 1}. ${item.title}`}
      className={cn(
        "group inline-flex h-8 items-center gap-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-out-expo disabled:cursor-default",
        labelled ? "px-2" : "px-1",
        item.status === "current" ? "bg-brand-50 text-brand-800" : reachable ? "text-ink-3 hover:bg-ink/6 hover:text-ink" : "text-muted-2",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border text-[0.6rem] transition-colors",
          item.status === "complete" && "border-brand-500 bg-brand-500 text-white",
          item.status === "current" && "border-brand-500 bg-white text-brand-700",
          item.status === "skipped" && "border-accent-500 bg-accent-100 text-accent-700",
          item.status === "visited" && "border-brand-300 bg-white text-brand-700",
          item.status === "upcoming" && "border-line-strong bg-white text-muted-2",
        )}
        aria-hidden
      >
        {item.status === "complete" ? (
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        ) : item.status === "skipped" ? (
          <Minus className="h-2.5 w-2.5" strokeWidth={3} />
        ) : (
          <span className="font-mono leading-none">{item.index + 1}</span>
        )}
      </span>
      {labelled && <span className="whitespace-nowrap pr-0.5">{item.short}</span>}
    </button>
  );
}
