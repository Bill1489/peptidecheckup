"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "./reveal";

type Token = { text: string; tone?: "kw" | "id" | "str" | "flag" | "dim" | "arrow" };
type Line = Token[];

/** Illustrative rules in the shape the engine actually evaluates. */
const RULES: { file: string; lines: Line[] }[] = [
  {
    file: "rules/contraindications · incretin",
    lines: [
      [{ text: "IF   ", tone: "kw" }, { text: "history.pancreatitis_history", tone: "id" }, { text: " = ", tone: "dim" }, { text: "current", tone: "str" }],
      [{ text: "AND  ", tone: "kw" }, { text: "compound.family", tone: "id" }, { text: " = ", tone: "dim" }, { text: "incretin", tone: "str" }],
      [{ text: "→    ", tone: "arrow" }, { text: "flag ", tone: "kw" }, { text: "HIGH", tone: "flag" }, { text: "  “History of pancreatitis”", tone: "str" }],
      [{ text: "     ", tone: "dim" }, { text: "note ← compound.contraindications[pancreatitis_history]", tone: "dim" }],
    ],
  },
  {
    file: "rules/dose-comparison",
    lines: [
      [{ text: "IF   ", tone: "kw" }, { text: "considered.dose", tone: "id" }, { text: " > ", tone: "dim" }, { text: "max(study.exposure.doseMax)", tone: "id" }],
      [{ text: "→    ", tone: "arrow" }, { text: "verdict ", tone: "kw" }, { text: "ABOVE_RANGE", tone: "flag" }, { text: "  cite study.citation", tone: "dim" }],
      [{ text: "     ", tone: "dim" }, { text: "“Requires professional review before you make a decision.”", tone: "str" }],
    ],
  },
];

const TONE: Record<NonNullable<Token["tone"]>, string> = {
  kw: "text-brand-300",
  id: "text-white/85",
  str: "text-accent-300",
  flag: "text-rose-300",
  dim: "text-white/45",
  arrow: "text-brand-400",
};

/**
 * Mono "terminal" panel showing two mock rules. Lines type in one after
 * another when scrolled into view; a soft cursor blinks at the end.
 */
export function RuleTerminal({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  let lineIndex = 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line-dark bg-ink-2/70 shadow-lift backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line-dark px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="ml-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/50">
          rules engine · deterministic · reviewed against labels and trials
        </span>
      </div>
      <div className="space-y-6 overflow-x-auto px-4 py-5 font-mono text-[0.78rem] leading-relaxed sm:px-5 sm:text-[0.82rem]">
        {RULES.map((rule) => (
          <div key={rule.file}>
            <p className="mb-2 text-[0.66rem] uppercase tracking-[0.14em] text-white/40">{rule.file}</p>
            <ol className="whitespace-pre">
              {rule.lines.map((line, i) => {
                const idx = lineIndex++;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: reduce ? 0 : -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                    transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : 0.12 * idx, ease: EASE_OUT_EXPO }}
                  >
                    {line.map((t, j) => (
                      <span key={j} className={TONE[t.tone ?? "id"]}>
                        {t.text}
                      </span>
                    ))}
                  </motion.li>
                );
              })}
            </ol>
          </div>
        ))}
        <p className="flex items-center gap-2 text-[0.7rem] text-white/40">
          <span className="inline-block h-3.5 w-1.5 animate-pulse-soft bg-brand-300" aria-hidden />
          every flag traces back to a field in the compound record
        </p>
      </div>
    </div>
  );
}
