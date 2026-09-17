import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GoalDef } from "@/data/goals";
import { PRODUCTS, type Product } from "@/data/products";
import type { SymptomDef } from "@/lib/funnel";
import { CHECKUP_SHORT, numberWord, pluralise } from "./copy";
import { IndexHead } from "./index-head";
import { PenCell } from "./pen-cell";

const HONEST_LINE = "Your answers decide — including whether to buy at all.";

/**
 * "Where the Checkup usually lands" on an ad landing page: the pen(s) named
 * for this symptom, photographed, with the catalogue's one line on who each is
 * for and the price — plus the note on the evidence behind them. When nothing
 * in the range is researched for the goal, the section says exactly that.
 */
export function LandingPens({ symptom, goal, pens, href }: { symptom: SymptomDef; goal: GoalDef; pens: Product[]; href: string }) {
  const goalLower = goal.label.toLowerCase();

  if (pens.length === 0) {
    return (
      <section id="pens" className="rule-b scroll-mt-28">
        <div className="container-x py-12 lg:py-16">
          <IndexHead
            index="01"
            label={`Where the ${CHECKUP_SHORT} lands`}
            title={`Nothing in the range is researched for ${goalLower}.`}
            description={`${symptom.penNote} ${HONEST_LINE}`}
            action={{ href: "/peptides", label: "What the evidence says instead" }}
          />
          <div className="mt-8 flex flex-col gap-4 border border-ink p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="max-w-xl text-[14px] leading-relaxed text-ink-3">
              Take the {CHECKUP_SHORT} anyway. The report still maps your history and medicines against the evidence, lists the licensed options a
              clinician is likely to raise, and gives you the questions to take to that appointment.
            </p>
            <Button href={href} size="lg" variant="primary" className="shrink-0">
              Start the {CHECKUP_SHORT}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pens" className="rule-b scroll-mt-28">
      <div className="container-x py-12 lg:py-16">
        <IndexHead
          index="01"
          label={`Where the ${CHECKUP_SHORT} usually lands`}
          title={pens.length === 1 ? `One pen is researched for ${goalLower}.` : `${pluralise(pens.length, "pen")} are researched for ${goalLower}.`}
          description={`${symptom.penNote} ${HONEST_LINE}`}
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
          <ul className="cell-grid grid-cols-1 sm:grid-cols-2" aria-label="Pens named for this goal">
            {pens.map((p, i) => (
              <li key={p.id} className="flex">
                <PenCell product={p} bestFor priority={i === 0} />
              </li>
            ))}
            {pens.length === 1 && (
              <li className="flex">
                <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
                  <div>
                    <p className="label-mono text-ink">Why only one</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-3">
                      The range is {numberWord(PRODUCTS.length)} pens and the matcher does not pad the list. If your answers rule this one out, the{" "}
                      {CHECKUP_SHORT} ends at no pen rather than the next-nearest thing.
                    </p>
                  </div>
                  <p className="label-mono">{HONEST_LINE}</p>
                </div>
              </li>
            )}
          </ul>
          <aside className="flex flex-col justify-between border border-ink p-5 sm:p-6">
            <div>
              <p className="label-mono text-ink">Before you decide</p>
              <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-ink-3">
                <li>The grade shown on the result is the compound’s, unchanged by the fact that we sell it.</li>
                <li>A Higher-concern label or a high flag ends at “not recommended” — nothing is added to your cart.</li>
                <li>Sold for research use only. 18+ and an intended-use acknowledgement at checkout.</li>
              </ul>
            </div>
            <Button href={href} size="lg" variant="primary" className="mt-8 w-full">
              Start the {CHECKUP_SHORT}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
