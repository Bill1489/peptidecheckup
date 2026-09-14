"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, LoaderCircle } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useLatest } from "./hooks";
import { EASE } from "./primitives";

export const GENERATING_TOTAL_MS = 2200;
const LINE_INTERVAL_MS = 480;

/**
 * Full-screen "Building your report" sequence (~2.2 s): four status lines
 * appear in turn, then `onDone` fires.
 */
export function GeneratingScreen({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const [shown, setShown] = React.useState(1);
  const reduced = useReducedMotion();
  const doneRef = useLatest(onDone);

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 2; i <= lines.length; i++) {
      timers.push(setTimeout(() => setShown(i), (i - 1) * LINE_INTERVAL_MS));
    }
    timers.push(setTimeout(() => doneRef.current(), GENERATING_TOTAL_MS));
    return () => timers.forEach(clearTimeout);
  }, [lines.length, doneRef]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy="true"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper bg-dots px-6"
    >
      <motion.div
        animate={reduced ? undefined : { scale: [1, 1.06, 1], opacity: [1, 0.75, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-card"
      >
        <LogoMark className="h-10 w-10" />
      </motion.div>

      <p className="mt-8 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-700">Building your report</p>
      <h2 className="mt-2 text-center font-display text-2xl text-ink sm:text-3xl">A moment while we check the evidence</h2>

      <ol className="mt-8 w-full max-w-sm space-y-2.5">
        <AnimatePresence initial={false}>
          {lines.slice(0, shown).map((line, i) => {
            const done = i < shown - 1 || shown === lines.length;
            return (
              <motion.li
                key={line}
                initial={reduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-2 shadow-soft"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
                    done ? "bg-brand-500 text-white" : "text-brand-600",
                  )}
                  aria-hidden
                >
                  {done ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    <LoaderCircle className={cn("h-4 w-4", !reduced && "animate-spin")} />
                  )}
                </span>
                {line}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </motion.div>
  );
}
