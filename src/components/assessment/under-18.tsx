"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
import { EASE } from "./primitives";

/** Respectful full-stop screen shown when the user is under 18. */
export function Under18Screen({ onBack }: { onBack: () => void }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="container-narrow py-12 sm:py-20"
    >
      <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 shadow-card sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <HeartHandshake className="h-6 w-6" aria-hidden />
        </span>
        <Eyebrow className="mt-6">Assessment paused</Eyebrow>
        <h1 className="mt-3 font-display text-3xl leading-[1.1] tracking-tight text-ink sm:text-4xl">
          This assessment is for adults
        </h1>
        <div className="mt-4 grid gap-3 text-base leading-relaxed text-muted">
          <p>
            {BRAND.displayName} is designed for people aged 18 and over. The compounds in our database have not been
            assessed for use in younger people, so we are not able to continue.
          </p>
          <p>
            If you have questions about your health, energy, weight or training, a GP, school nurse or pharmacist is a
            good place to start — and a trusted adult can help you get there.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Return to the home page
          </Button>
          <Button variant="ghost" size="lg" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            I entered the wrong age
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
