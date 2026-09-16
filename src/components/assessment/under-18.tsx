"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";

/** Respectful full-stop screen shown when the user is under 18. */
export function Under18Screen({ onBack }: { onBack: () => void }) {
  return (
    <div className="container-narrow py-12 sm:py-20">
      <div className="mx-auto max-w-xl border border-ink bg-white p-6 sm:p-10">
        <p className="label-mono text-ink">Assessment paused</p>
        <h1 className="mt-4 font-display text-[2rem] uppercase leading-[0.98] text-ink sm:text-[2.6rem]">This assessment is for adults</h1>
        <div className="mt-5 grid gap-3 text-[15px] leading-relaxed text-muted">
          <p>
            {BRAND.displayName} is designed for people aged 18 and over. The compounds in our database have not been
            assessed for use in younger people, and our products are sold to adults only, so we are not able to continue.
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
          <Button variant="secondary" size="lg" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            I entered the wrong age
          </Button>
        </div>
      </div>
    </div>
  );
}
