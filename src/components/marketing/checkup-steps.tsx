import { ArrowRight } from "lucide-react";
import { COMPOUNDS } from "@/data/compounds";
import { PRODUCTS } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_MINUTES, CHECKUP, CHECKUP_SHORT, NAMED_JURISDICTIONS, numberWord, SECTION_COUNT } from "./copy";
import { IndexHead } from "./index-head";
import { NumberedRows } from "./page-shell";

const STEPS = [
  {
    title: "Goal & history",
    meta: `≈${ASSESSMENT_MINUTES} min`,
    body: `${SECTION_COUNT} short sections: your goal, the specific problem behind it, medical history in categories, medicines by class, and a safety screen. No account, no essays.`,
  },
  {
    title: "Rules, then a match",
    meta: "Deterministic",
    body: `A fixed set of rules — no language model — checks your answers against ${COMPOUNDS.length} compound records and ${NAMED_JURISDICTIONS.length} jurisdictions. Then the matcher scores the ${numberWord(PRODUCTS.length)} pens on goal, focus, evidence, experience and the safety verdict. Same answers, same pen.`,
  },
  {
    title: "Your pen",
    meta: "Or none",
    body: "You land on the pen’s page with why it fits, the evidence grade for your goal, what to review, and the option to add it to your cart. Two alternatives are listed. Anything ruled out is named, with the answer that ruled it out.",
  },
];

/** The three-step spec sheet for the Checkup, ending on the rule the store is built around. */
export function CheckupSteps() {
  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="04"
          label={`How the ${CHECKUP_SHORT} works`}
          title="Answer. Check. Land on a pen."
          description={`The ${CHECKUP} is the front door to the store. It exists to say which pen fits and, just as often, that none of them does.`}
          action={{ href: "/how-it-works", label: "Full walkthrough" }}
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          <NumberedRows items={STEPS} />
          <aside className="flex flex-col justify-between border border-ink p-5 sm:p-6">
            <div>
              <p className="label-mono text-ink">The rule</p>
              <p className="font-display mt-3 text-balance text-[1.35rem] uppercase leading-[1.02] tracking-[-0.02em] text-ink sm:text-[1.6rem]">
                If your answers raise a flag, the {CHECKUP_SHORT} says not this one — and nothing goes in your cart.
              </p>
            </div>
            <Button href="/assessment" size="lg" variant="primary" className="mt-8 w-full sm:w-auto">
              Start the {CHECKUP_SHORT}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
