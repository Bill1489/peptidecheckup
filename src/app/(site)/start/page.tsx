import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { compoundsForGoal } from "@/data/compounds";
import { productsForGoal } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { goalForSymptom, SYMPTOMS } from "@/lib/funnel";
import { ASSESSMENT_MINUTES, index, pluralise } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHeader } from "@/components/marketing/page-shell";

const DESCRIPTION = `Choose the goal that brought you here and take the ${ASSESSMENT_MINUTES}-minute Peptide Checkup — an evidence-led assessment that matches batch-tested products to your goal, history and medicines, and says when not to buy.`;

export const metadata: Metadata = {
  title: "Start with your goal",
  description: DESCRIPTION,
  alternates: { canonical: "/start/" },
  openGraph: {
    images: OG_IMAGES,
    title: `Start with your goal · ${BRAND.displayName}`,
    description: DESCRIPTION,
    url: "/start/",
  },
};

export default function StartIndexPage() {
  return (
    <>
      <PageHeader
        label="Start here"
        meta={[`${SYMPTOMS.length} entry points`, `≈${ASSESSMENT_MINUTES} min · no account`]}
        title="What brought you here?"
        description="Pick the goal closest to yours. Each page says what the checkup checks for that goal and which products in the catalogue are researched for it — and the assessment decides which of them fit."
      />

      <section className="container-x py-10 lg:py-14">
        <ol className="border-t border-ink">
          {SYMPTOMS.map((s, i) => {
            const goal = goalForSymptom(s);
            const compounds = compoundsForGoal(goal.id).length;
            const products = productsForGoal(goal.id).length;
            return (
              <li key={s.slug} className="border-b border-ink">
                <Link
                  href={`/start/${s.slug}`}
                  className="hover-invert -mx-4 grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:-mx-6 sm:grid-cols-[3.5rem_minmax(0,1fr)_14rem_auto] sm:px-6 sm:py-6 lg:-mx-8 lg:px-8"
                >
                  <span className="label-mono tnum">{index(i + 1)}</span>
                  <span className="min-w-0">
                    <span className="font-display block text-balance text-[1.35rem] uppercase leading-[1.02] text-ink sm:text-[1.75rem] lg:text-[2.25rem]">
                      {goal.funnelHeadline}
                    </span>
                    <span className="label-mono mt-2 block">{s.label}</span>
                  </span>
                  <span className="label-mono hidden flex-col gap-1 text-right tnum sm:flex">
                    <span>{compounds > 0 ? `${pluralise(compounds, "compound")} researched` : "Evidence gaps explained"}</span>
                    {products > 0 && <span>{pluralise(products, "product")}</span>}
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 text-[14px] text-muted">
          Different goal?{" "}
          <Link href="/assessment/?goal=other" className="text-ink link-rule">
            Describe it in the assessment
          </Link>
          .
        </p>
      </section>

      <CtaBand secondary={{ href: "/shop", label: "Or go straight to the shop" }} />
    </>
  );
}
