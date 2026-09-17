"use client";

import * as React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import type { SectionProgressItem } from "@/lib/assessment/flow";
import type { SectionId } from "@/lib/assessment/types";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo";

const pad = (n: number) => String(n).padStart(2, "0");

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
  const current = sections.find((s) => s.status === "current");
  const total = sections.length;
  const index = current ? current.index + 1 : 1;

  return (
    <header className="rule-b sticky top-0 z-40 bg-white">
      <div className="container-x flex h-14 items-center justify-between gap-3 sm:h-16">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link href="/" aria-label={`${BRAND.displayName} home`} className="inline-flex shrink-0 items-center">
            <LogoMark className="h-7 w-7" />
          </Link>
          <p className="label-mono truncate text-ink" aria-live="off">
            <span className="hidden sm:inline">{BRAND.assessmentName} · </span>
            <span className="tnum">
              {pad(index)}/{pad(total)}
            </span>
            {current && (
              <>
                <span className="mx-1.5 text-muted-2" aria-hidden>
                  ·
                </span>
                <span className="sm:hidden">{current.short}</span>
                <span className="hidden sm:inline">{current.title}</span>
              </>
            )}
          </p>
        </div>

        <SectionStepper sections={sections} onJump={onJump} />

        <div className="flex shrink-0 items-center gap-4">
          <span className="label-mono hidden text-muted-2 md:inline" aria-live="off">
            ≈{minutesLeft} min left
          </span>
          <button
            type="button"
            onClick={onSaveExit}
            className="link-rule inline-flex h-11 items-center font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink"
          >
            <span className="hidden sm:inline">Save &amp; exit</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      <div
        className="h-[2px] w-full bg-line"
        role="progressbar"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={current ? `${percent}% — ${current.title}` : `${percent}%`}
      >
        <div
          className="h-full bg-brand-600 transition-[width] duration-200 ease-out"
          style={{ width: `${Math.max(percent, 1)}%` }}
        />
      </div>
    </header>
  );
}

function SectionStepper({ sections, onJump }: { sections: SectionProgressItem[]; onJump: (section: SectionId) => void }) {
  return (
    <nav aria-label="Sections" className="hidden min-w-0 md:block">
      <ol className="flex items-center gap-1">
        {sections.map((s) => (
          <li key={s.id}>
            <StepperButton item={s} onJump={onJump} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepperButton({ item, onJump }: { item: SectionProgressItem; onJump: (section: SectionId) => void }) {
  const reachable = item.status !== "upcoming";
  const statusLabel = {
    complete: "complete",
    skipped: "skipped",
    current: "current section",
    visited: "started",
    upcoming: "not started",
  }[item.status];

  return (
    <button
      type="button"
      disabled={!reachable}
      onClick={() => onJump(item.id)}
      aria-label={`Section ${item.index + 1}: ${item.title} — ${statusLabel}`}
      aria-current={item.status === "current" ? "step" : undefined}
      title={`${item.index + 1}. ${item.title}`}
      className="group flex h-11 items-center px-0.5 disabled:cursor-default"
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center border font-mono text-[10px] leading-none tnum transition-colors duration-150",
          item.status === "current" && "border-brand-600 bg-brand-600 text-white",
          item.status === "complete" && "border-ink bg-ink text-white group-hover:bg-brand-600 group-hover:border-brand-600",
          item.status === "skipped" && "border-accent-500 bg-white text-accent-600 group-hover:bg-accent-500 group-hover:text-white",
          item.status === "visited" && "border-ink bg-white text-ink group-hover:bg-ink group-hover:text-white",
          item.status === "upcoming" && "border-line bg-white text-muted-2",
        )}
        aria-hidden
      >
        {item.index + 1}
      </span>
    </button>
  );
}
