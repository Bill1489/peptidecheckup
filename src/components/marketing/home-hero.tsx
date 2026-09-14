"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
import { ReportPreview } from "./report-preview";
import type { ReportPreviewData } from "./report-preview-data";
import { EASE_OUT_EXPO } from "./reveal";

export function HomeHero({
  facts,
  preview,
  subcopy,
}: {
  facts: string[];
  preview: ReportPreviewData;
  subcopy: string;
}) {
  const reduce = useReducedMotion();
  const enter = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.85, delay: reduce ? 0 : 0.06 + i * 0.09, ease: EASE_OUT_EXPO },
  });

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -top-48 right-[-18%] -z-10 h-[42rem] w-[42rem] rounded-full bg-brand-100/70 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 left-[-12%] -z-10 h-[26rem] w-[26rem] rounded-full bg-accent-100/60 blur-3xl"
      />

      <div className="container-x grid items-center gap-14 pt-10 pb-20 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-28">
        <div className="lg:col-span-7">
          <motion.div {...enter(0)}>
            <Eyebrow>Evidence-led peptide comparison</Eyebrow>
          </motion.div>
          <motion.h1
            id="hero-title"
            {...enter(1)}
            className="mt-5 text-balance font-display text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Know which peptides are <span className="text-brand-700">worth discussing</span> — before you buy anything.
          </motion.h1>
          <motion.p {...enter(2)} className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
            {subcopy}
          </motion.p>
          <motion.div {...enter(3)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/assessment" size="xl" variant="primary" className="w-full sm:w-auto">
              Start your free assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
            </Button>
            <Button href="/compare" size="xl" variant="secondary" className="w-full sm:w-auto">
              Compare peptides
            </Button>
          </motion.div>
          <motion.ul
            {...enter(4)}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8"
            aria-label="Key facts"
          >
            {facts.map((fact) => (
              <li
                key={fact}
                className="flex items-start gap-2 font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.14em] text-ink-3"
              >
                <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                {fact}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="lg:col-span-5">
          <ReportPreview data={preview} className="mx-auto w-full max-w-[36rem] lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
