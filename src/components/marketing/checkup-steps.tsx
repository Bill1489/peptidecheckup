import { ArrowRight } from "lucide-react";
import { COMPOUNDS } from "@/data/compounds";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_MINUTES, NAMED_JURISDICTIONS, SECTION_COUNT } from "./copy";
import { IndexHead } from "./index-head";
import { NumberedRows } from "./page-shell";

const STEPS = [
  {
    title: "Goal & history",
    meta: `≈${ASSESSMENT_MINUTES} min`,
    body: `${SECTION_COUNT} short sections: your goal, the compounds you are considering, medical history in categories, medicines by class, and a safety screen. No account, no essays.`,
  },
  {
    title: "Rules engine",
    meta: "Deterministic",
    body: `A fixed set of rules — no language model — checks your answers against the evidence and regulatory database: ${COMPOUNDS.length} compounds, ${NAMED_JURISDICTIONS.length} jurisdictions, graded contraindications and interactions, published dosing studies.`,
  },
  {
    title: "Matches",
    meta: "Report",
    body: "Each compound is labelled Potentially relevant, Higher concern or Insufficient information, with the answer that caused it. Products linked to relevant compounds are listed with price and lot, ready to add.",
  },
];

/** The three-step spec sheet for the assessment, ending on the rule the store is built around. */
export function CheckupSteps() {
  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="05"
          label="How the checkup works"
          title="Answer. Check. Match."
          description="The assessment is the front door to the store. It exists to say what fits and, just as often, what does not."
          action={{ href: "/how-it-works", label: "Full walkthrough" }}
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          <NumberedRows items={STEPS} />
          <aside className="flex flex-col justify-between border border-ink p-5 sm:p-6">
            <div>
              <p className="label-mono text-ink">The rule</p>
              <p className="font-display mt-3 text-balance text-[1.35rem] uppercase leading-[1.02] tracking-[-0.02em] text-ink sm:text-[1.6rem]">
                If your answers raise a flag, the report tells you not to buy — and we don’t add it to your cart.
              </p>
            </div>
            <Button href="/assessment" size="lg" variant="primary" className="mt-8 w-full sm:w-auto">
              Start the checkup
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
