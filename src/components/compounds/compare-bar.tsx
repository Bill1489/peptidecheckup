"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCompounds } from "@/data/compounds";
import { MAX_COMPARE, compareHref } from "@/lib/compare";

/** Fixed ink bar shown while at least one compound is selected for comparison. */
export function CompareBar({
  slugs,
  onRemove,
  onClear,
}: {
  slugs: string[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}) {
  const reduce = useReducedMotion();
  const compounds = getCompounds(slugs);

  return (
    <AnimatePresence>
      {compounds.length > 0 && (
        <motion.div
          key="compare-bar"
          initial={reduce ? false : { y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-ink text-white"
          role="region"
          aria-label="Compare selection"
        >
          <div className="container-x flex flex-col gap-2 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 sm:flex-row sm:items-center sm:gap-4 sm:py-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="label-mono shrink-0 text-white/60">
                Compare{" "}
                <span className="text-white tnum">
                  {compounds.length}/{MAX_COMPARE}
                </span>
              </span>
              <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto" aria-label="Selected compounds">
                {compounds.map((c) => (
                  <li
                    key={c.slug}
                    className="inline-flex h-11 shrink-0 items-stretch border border-white/40 font-mono text-[11px] uppercase tracking-[0.08em] sm:h-9"
                  >
                    <span className="flex items-center pl-2.5 pr-2">{c.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(c.slug)}
                      aria-label={`Remove ${c.name} from comparison`}
                      className="inline-flex w-11 items-center justify-center border-l border-white/40 transition-colors duration-150 hover:bg-white hover:text-ink sm:w-9"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-11 flex-1 text-white hover:border-white hover:text-white sm:h-9 sm:flex-none"
              >
                Clear
              </Button>
              <Button href={compareHref(slugs)} size="sm" variant="inverted" className="h-11 flex-1 sm:h-9 sm:flex-none">
                Compare now
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
