import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
import { DISCLAIMER_SHORT } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { ASSESSMENT_MINUTES } from "./copy";
import { BeadChain } from "./bead-chain";
import { Reveal } from "./reveal";

/** Final call-to-action band on brand-50 with grain, followed by the short disclaimer. */
export function CtaBand({
  eyebrow = "Free · no account",
  title = "Seven minutes. One report you can actually take to a clinician.",
  description = "Structured questions, a deterministic rules engine and a database written from labels and trials. Nothing to buy, nothing stored on our servers.",
  href = "/assessment",
  cta = "Start your free assessment",
  secondary,
  className,
  showDisclaimer = true,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  cta?: string;
  secondary?: { href: string; label: string };
  className?: string;
  showDisclaimer?: boolean;
}) {
  return (
    <section className={cn("container-x py-20 lg:py-28", className)} aria-labelledby="cta-title">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-3xl border border-brand-100 bg-brand-50 bg-grain px-6 py-14 text-center sm:px-12 lg:py-20">
          <BeadChain
            className="pointer-events-none absolute -right-24 -bottom-16 -z-10 w-[34rem] text-brand-200/70 sm:-right-16"
            tone="light"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-24 -z-10 h-72 w-72 rounded-full bg-white/70 blur-3xl"
          />
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id="cta-title"
            className="mx-auto mt-4 max-w-2xl text-balance font-display text-3xl font-normal leading-[1.08] tracking-[-0.02em] text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">{description}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={href} size="xl" variant="brand" className="w-full sm:w-auto">
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
            </Button>
            {secondary && (
              <Button href={secondary.href} size="xl" variant="secondary" className="w-full sm:w-auto">
                {secondary.label}
              </Button>
            )}
          </div>
          <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted-2">
            ≈{ASSESSMENT_MINUTES} minutes · stays on your device · nothing to buy
          </p>
        </div>
      </Reveal>
      {showDisclaimer && (
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted">{DISCLAIMER_SHORT}</p>
      )}
    </section>
  );
}
