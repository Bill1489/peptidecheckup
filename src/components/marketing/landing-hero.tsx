import { ArrowRight } from "lucide-react";
import type { GoalDef } from "@/data/goals";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import type { SymptomDef } from "@/lib/funnel";
import { ASSESSMENT_MINUTES, pluralise } from "./copy";
import { BeadChain } from "./bead-chain";
import { GoalIcon } from "./goal-icon";

/**
 * Landing-page hero for paid-ad traffic. Deliberately JS-free: the stagger is
 * CSS (`animate-fade-up` + animation-delay) so the headline and CTA render
 * before hydration and honour prefers-reduced-motion via the global rule.
 */
export function LandingHero({
  symptom,
  goal,
  href,
  researchedCount,
}: {
  symptom: SymptomDef;
  goal: GoalDef;
  href: string;
  researchedCount: number;
}) {
  const facts = [
    `≈${ASSESSMENT_MINUTES} minutes`,
    "No account",
    "Nothing to buy",
    researchedCount > 0 ? `${pluralise(researchedCount, "compound")} researched for this goal` : "Honest about evidence gaps",
  ];

  return (
    <section className="relative isolate overflow-hidden border-b border-line" aria-labelledby="landing-title">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(70%_60%_at_30%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -top-40 right-[-20%] -z-10 h-[36rem] w-[36rem] rounded-full bg-brand-100/70 blur-3xl"
      />
      <BeadChain
        className="pointer-events-none absolute top-1/2 -right-24 -z-10 hidden w-[44rem] -translate-y-1/2 text-brand-200/70 lg:block"
        tone="light"
      />

      <div className="container-x pt-10 pb-14 sm:pt-14 lg:pt-20 lg:pb-20">
        <div className="max-w-3xl">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1.5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-brand-700 backdrop-blur">
            <GoalIcon icon={goal.icon} className="h-3.5 w-3.5" />
            {goal.label} · {BRAND.displayName}
          </p>
          <h1
            id="landing-title"
            className="mt-5 animate-fade-up text-balance font-display text-4xl font-normal leading-[1.04] tracking-[-0.025em] text-ink [animation-delay:80ms] sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {goal.funnelHeadline}
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-pretty text-lg leading-relaxed text-muted [animation-delay:160ms]">
            {symptom.subheadline}
          </p>
          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row sm:items-center">
            <Button href={href} size="xl" variant="brand" className="w-full sm:w-auto">
              Start the free {ASSESSMENT_MINUTES}-minute checkup
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
            </Button>
            <Button href="#checks" size="xl" variant="ghost" className="w-full sm:w-auto">
              See what it checks
            </Button>
          </div>
          <ul
            className="mt-9 grid animate-fade-up grid-cols-2 gap-x-6 gap-y-3 [animation-delay:320ms] sm:flex sm:flex-wrap sm:gap-x-8"
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
          </ul>
        </div>
      </div>
    </section>
  );
}
