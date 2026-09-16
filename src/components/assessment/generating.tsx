"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useLatest } from "./hooks";

export const GENERATING_TOTAL_MS = 2400;
const LINE_INTERVAL_MS = 520;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full-screen "Building your report" sequence (~2.4 s) on ink: mono status
 * lines tick through with a blinking cursor, then `onDone` fires.
 */
export function GeneratingScreen({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const [shown, setShown] = React.useState(1);
  const [finished, setFinished] = React.useState(false);
  const reduced = useReducedMotion();
  const doneRef = useLatest(onDone);

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 2; i <= lines.length; i++) {
      timers.push(setTimeout(() => setShown(i), (i - 1) * LINE_INTERVAL_MS));
    }
    timers.push(setTimeout(() => setFinished(true), lines.length * LINE_INTERVAL_MS));
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
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-white"
    >
      <div className="border-b border-white/20">
        <div className="container-x flex h-14 items-center justify-between sm:h-16">
          <LogoMark tone="light" className="h-7 w-7" />
          <p className="label-mono text-white/60">Building your report</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <p className="label-mono text-brand-300">Rules engine · running on this device</p>
        <h2 className="mt-4 font-display text-[2rem] uppercase leading-[0.98] text-white sm:text-[2.6rem]">
          Checking the evidence
        </h2>

        <ol className="mt-8 border border-white/25 font-mono text-[12.5px] sm:text-[13px]">
          {lines.slice(0, shown).map((line, i) => {
            const done = finished || i < shown - 1;
            return (
              <li key={line} className="flex items-start gap-3 border-b border-white/15 px-4 py-3 last:border-b-0">
                <span className="w-6 shrink-0 text-white/50 tnum">{pad(i + 1)}</span>
                <span className="min-w-0 flex-1 leading-snug">
                  {line}
                  {!done && (
                    <span
                      className={cn("ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-brand-400", !reduced && "animate-blink")}
                      aria-hidden
                    />
                  )}
                </span>
                <span className={cn("shrink-0 text-[10.5px] uppercase tracking-[0.12em]", done ? "text-brand-300" : "text-white/40")}>
                  {done ? "ok" : "…"}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-[13px] leading-relaxed text-white/60">
          Nothing is sent anywhere. Your answers are compared against our compound, evidence and regulatory database in
          your browser.
        </p>
      </div>
    </motion.div>
  );
}
