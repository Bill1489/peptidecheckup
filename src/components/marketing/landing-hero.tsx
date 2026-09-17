import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GoalDef } from "@/data/goals";
import type { Product } from "@/data/products";
import type { SymptomDef } from "@/lib/funnel";
import { ASSESSMENT_MINUTES, CHECKUP_SHORT, numberWord } from "./copy";

/**
 * Ad landing hero: mono facts in the left column — including the pen(s) the
 * Checkup usually lands on — the funnel question as a huge uppercase headline,
 * one honest paragraph and the CTA. Nothing else.
 */
export function LandingHero({ symptom, goal, href, pens }: { symptom: SymptomDef; goal: GoalDef; href: string; pens: Product[] }) {
  return (
    <section className="rule-b">
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:py-16">
        <div className="flex flex-col gap-1.5">
          <p className="label-mono text-ink">Goal · {goal.label}</p>
          <p className="label-mono">≈{ASSESSMENT_MINUTES} min · no account</p>
          <p className="label-mono">
            {pens.length > 0 ? `Usually lands on · ${pens.map((p) => p.name).join(" / ")}` : "No pen in the range for this"}
          </p>
          <p className="label-mono">Can end at no pen</p>
        </div>
        <div className="min-w-0">
          <h1 className="text-balance text-[2.5rem] uppercase sm:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem]">{goal.funnelHeadline}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-3 sm:text-[17px]">{symptom.subheadline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={href} size="xl" variant="primary">
              Start the {ASSESSMENT_MINUTES}-minute {CHECKUP_SHORT}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            {pens.length > 0 ? (
              <Button href="#pens" size="xl" variant="secondary">
                {pens.length === 1 ? "See the pen" : `See the ${numberWord(pens.length)} pens`}
              </Button>
            ) : (
              <Button href="/shop" size="xl" variant="secondary">
                See the range anyway
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
