"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCompounds } from "@/data/compounds";
import { MAX_COMPARE, compareHref } from "@/lib/compare";

/**
 * Floating action bar shown while at least one compound is selected for comparison.
 */
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
          initial={reduce ? false : { y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 32, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6"
          role="region"
          aria-label="Compare selection"
        >
          <div className="glass pointer-events-auto w-full max-w-3xl rounded-2xl shadow-lift">
            <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-3.5">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="shrink-0 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-brand-700">
                  Compare
                  <span className="ml-1 text-muted-2">
                    {compounds.length}/{MAX_COMPARE}
                  </span>
                </span>
                <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
                  {compounds.map((c) => (
                    <li
                      key={c.slug}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-white pl-3 pr-1 text-xs font-medium text-ink"
                    >
                      {c.name}
                      <button
                        type="button"
                        onClick={() => onRemove(c.slug)}
                        aria-label={`Remove ${c.name} from comparison`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onClear} className="flex-1 sm:flex-none">
                  Clear
                </Button>
                <Button href={compareHref(slugs)} size="sm" className="flex-1 sm:flex-none">
                  Compare now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
