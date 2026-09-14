"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CircleAlert, Sparkles } from "lucide-react";
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
    <div className="sticky bottom-0 z-40 border-t border-line glass">
      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key="error"
            role="alert"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="border-b border-concern/15 bg-concern-soft"
          >
            <p className="container-narrow flex items-center gap-2 py-2 text-sm text-concern">
              <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="container-narrow flex items-center justify-between gap-2 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button variant="ghost" size="md" onClick={onBack} disabled={!canBack} className="px-3 sm:px-4" aria-label="Back">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Back</span>
        </Button>

        {!hideKeyHint && !isReview && (
          <span className="hidden items-center gap-1.5 text-xs text-muted-2 md:inline-flex" aria-hidden>
            <Kbd>↵</Kbd> to continue
          </span>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          {skippable && (
            <Button variant="ghost" size="md" onClick={onSkipSection} className="px-3 text-ink-3 sm:px-4">
              <span className="sm:hidden">Skip section</span>
              <span className="hidden sm:inline">Skip this section</span>
            </Button>
          )}
          <Button
            variant={isReview ? "brand" : "primary"}
            size="lg"
            onClick={onNext}
            className={cn("min-w-[8.5rem]", isReview && "min-w-[11rem]")}
          >
            {isReview && <Sparkles className="h-4 w-4" aria-hidden />}
            {nextLabel}
            {!isReview && <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />}
          </Button>
        </div>
      </div>
    </div>
  );
}
