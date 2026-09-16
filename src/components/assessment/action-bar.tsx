"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Kbd } from "./primitives";

export function ActionBar({
  canBack,
  onBack,
  onNext,
  nextLabel,
  isReview,
  skippable,
  onSkipSection,
  error,
  hideKeyHint,
}: {
  canBack: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  isReview: boolean;
  skippable: boolean;
  onSkipSection: () => void;
  error?: string;
  hideKeyHint?: boolean;
}) {
  return (
    <div className="rule-t sticky bottom-0 z-40 bg-white">
      {error && (
        <div role="alert" className="border-b border-ink bg-accent-100">
          <p className="container-narrow flex items-center gap-2 py-2.5 text-sm text-accent-700">
            <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        </div>
      )}
      <div className="container-narrow flex items-center justify-between gap-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onBack}
          disabled={!canBack}
          aria-label="Back"
          className="inline-flex h-11 items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:text-brand-600 disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Back</span>
        </button>

        {!hideKeyHint && !isReview && (
          <span className="label-mono hidden items-center gap-1.5 text-muted-2 md:inline-flex" aria-hidden>
            <Kbd>↵</Kbd> to continue
          </span>
        )}

        <div className="flex items-center gap-3 sm:gap-5">
          {skippable && (
            <button
              type="button"
              onClick={onSkipSection}
              className="link-rule inline-flex h-11 items-center font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3"
            >
              <span className="sm:hidden">Skip section</span>
              <span className="hidden sm:inline">Skip this section</span>
            </button>
          )}
          <Button variant={isReview ? "brand" : "primary"} size="lg" onClick={onNext} className={cn("min-w-[8.5rem]", isReview && "min-w-[11rem]")}>
            {nextLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
