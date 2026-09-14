import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
import { CtaBand } from "@/components/marketing/cta-band";
import { Faq } from "@/components/marketing/faq";
import { ALL_FAQ, HOME_FAQ, MORE_FAQ } from "@/components/marketing/faq-data";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHeader } from "@/components/marketing/page-shell";
import { Toc } from "@/components/marketing/toc";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions people ask before starting the Peptide Checkup: medical advice, regulatory sources, selling, privacy, dosing, stacks, printing, deleting data and clinician review.",
  alternates: { canonical: "/faq/" },
};

const GROUPS = [
  {
    id: "before-you-start",
    title: "Before you start",
    description: "What this is, where the information comes from, and what it will and will not do.",
    items: HOME_FAQ,
  },
  {
    id: "reports-and-data",
    title: "Reports, dosing and your data",
    description: "What the report contains, how dosing and combinations are handled, and how to keep or delete your data.",
    items: MORE_FAQ,
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: ALL_FAQ.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered plainly."
        description={`${ALL_FAQ.length} questions people ask before, during and after the assessment. If yours isn’t here, email us — a person reads every message.`}
        meta={BRAND.supportEmail}
      />
      <div className="container-x py-14 lg:py-20">
        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,46rem)] lg:justify-center lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Toc items={GROUPS.map((g) => ({ id: g.id, label: g.title }))} />
              <div className="mt-8">
                <Button href={`mailto:${BRAND.supportEmail}`} variant="secondary" size="sm">
                  Ask a question
                </Button>
              </div>
            </div>
          </aside>
          <div className="space-y-16">
            {GROUPS.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-28" aria-labelledby={`${group.id}-title`}>
                <Eyebrow>{group.items.length} questions</Eyebrow>
                <h2 id={`${group.id}-title`} className="mt-3 font-display text-3xl font-normal leading-tight tracking-[-0.02em] text-ink">
                  {group.title}
                </h2>
                <p className="mt-2 max-w-xl text-muted">{group.description}</p>
                <Faq items={group.items} className="mt-8" />
              </section>
            ))}
          </div>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
