import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { compoundsForGoal } from "@/data/compounds";
import { BRAND } from "@/lib/brand";
import { goalForSymptom, SYMPTOMS } from "@/lib/funnel";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_MINUTES, pluralise } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { GoalIcon } from "@/components/marketing/goal-icon";
import { PageHeader } from "@/components/marketing/page-shell";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Start with your goal",
  description: `Choose the goal that brought you here and take the free ${ASSESSMENT_MINUTES}-minute Peptide Checkup — an evidence-led assessment that maps your history and medicines against published research.`,
  alternates: { canonical: "/start/" },
};

export default function StartIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Start here"
        title="What brought you here?"
        description={`Pick the goal closest to yours. Each page explains what the ${ASSESSMENT_MINUTES}-minute assessment checks for that goal and which compounds in the database have been researched for it.`}
        meta={`${SYMPTOMS.length} entry points · one assessment · ${BRAND.displayName}`}
      >
        <div className="mt-8">
          <Button href="/assessment" variant="secondary" size="md">
            Skip straight to the assessment
          </Button>
        </div>
      </PageHeader>

      <section className="container-x py-14 lg:py-20">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {SYMPTOMS.map((s) => {
            const goal = goalForSymptom(s);
            const count = compoundsForGoal(goal.id).length;
            return (
              <StaggerItem key={s.slug} className="h-full">
                <Link
                  href={`/start/${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
                      <GoalIcon icon={goal.icon} className="h-5 w-5" />
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-muted-2 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-muted">{s.label}</p>
                  <h2 className="mt-1.5 font-display text-2xl leading-snug text-ink">{goal.funnelHeadline}</h2>
                  <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted">{goal.description}</p>
                  <p className="mt-5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-brand-700">
                    {count > 0 ? `${pluralise(count, "compound")} researched` : "Evidence gaps explained honestly"}
                  </p>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal className="mt-10">
          <p className="text-center text-sm text-muted">
            Have a different goal? <Link href="/assessment/?goal=other" className="font-medium text-brand-700 underline-offset-4 hover:underline">Describe it in your own words</Link> at the start of the assessment.
          </p>
        </Reveal>
      </section>

      <CtaBand className="pt-0 lg:pt-0" />
    </>
  );
}
