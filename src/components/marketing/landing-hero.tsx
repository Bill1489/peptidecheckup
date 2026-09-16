import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GoalDef } from "@/data/goals";
import type { SymptomDef } from "@/lib/funnel";
import { ASSESSMENT_MINUTES, pluralise } from "./copy";

/**
 * Ad landing hero: mono facts in the left column, the funnel question as a
 * huge uppercase headline, one honest paragraph and the CTA. Nothing else.
 */
export function LandingHero({
  symptom,
  goal,
  href,
  researchedCount,
  productCount,
}: {
  symptom: SymptomDef;
  goal: GoalDef;
  href: string;
  researchedCount: number;
  productCount: number;
}) {
  return (
    <section className="rule-b">
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:py-16">
        <div className="flex flex-col gap-1.5">
          <p className="label-mono text-ink">Goal · {goal.label}</p>
          <p className="label-mono">≈{ASSESSMENT_MINUTES} min · no account</p>
          <p className="label-mono tnum">
            {researchedCount > 0 ? `${pluralise(researchedCount, "compound")} with human evidence` : "No compound with human evidence"}
          </p>
          {productCount > 0 && <p className="label-mono tnum">{pluralise(productCount, "product")} in the catalogue</p>}
        </div>
        <div className="min-w-0">
          <h1 className="text-balance text-[2.5rem] uppercase sm:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem]">{goal.funnelHeadline}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-3 sm:text-[17px]">{symptom.subheadline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={href} size="xl" variant="primary">
              Start the {ASSESSMENT_MINUTES}-minute checkup
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            {productCount > 0 && (
              <Button href={`/shop/?goal=${goal.id}`} size="xl" variant="secondary">
                Browse {pluralise(productCount, "product")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
