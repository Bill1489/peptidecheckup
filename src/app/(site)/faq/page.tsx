import type { Metadata } from "next";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { CHECKUP, CHECKUP_SHORT } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Faq } from "@/components/marketing/faq";
import { ALL_FAQ, HOME_FAQ, MORE_FAQ, type FaqItem } from "@/components/marketing/faq-data";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHeader } from "@/components/marketing/page-shell";
import { Toc, TocRow } from "@/components/marketing/toc";

const DESCRIPTION = `Answers to the questions people ask before buying an ${BRAND.name} pen or starting the ${CHECKUP}: research-use labelling, the pen format, needles, storage, certificates, shipping, returns, the assessment, data and deletion.`;

export const metadata: Metadata = {
  title: "FAQ",
  description: DESCRIPTION,
  alternates: { canonical: "/faq/" },
  openGraph: { images: OG_IMAGES, title: `FAQ · ${BRAND.displayName}`, description: DESCRIPTION, url: "/faq/" },
};

const pick = (ids: string[]): FaqItem[] => ALL_FAQ.filter((i) => ids.includes(i.id));

const GROUPS = [
  {
    id: "pens",
    title: "The pens, testing, shipping",
    description: "What the label means, what is in the box, how the pen is stored, what the certificate says, and how orders move.",
    items: pick(["research-use", "pre-filled", "needles", "storage", "shipping", "returns", "who-tests", "blends", "nad", "countries"]),
  },
  {
    id: "assessment",
    title: `The ${CHECKUP_SHORT} and the match`,
    description: "What it is, what it is not, how it lands on a pen, and why it sometimes lands on none.",
    items: pick(["not-a-fit", "medical-advice", "athletes", "discount", "regulatory-source", "dosing", "print"]),
  },
  {
    id: "data",
    title: "Accounts, data and deletion",
    description: "Where things are stored, what leaves your device, and how to remove it.",
    items: pick(["data", "account", "delete"]),
  },
];

export default function FaqPage() {
  const toc = GROUPS.map((g) => ({ id: g.id, label: g.title }));
  const grouped = new Set(GROUPS.flatMap((g) => g.items.map((i) => i.id)));
  const ungrouped = [...HOME_FAQ, ...MORE_FAQ].filter((i) => !grouped.has(i.id));

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
        label="FAQ"
        meta={[`${ALL_FAQ.length} questions`, BRAND.supportEmail]}
        title="Questions, answered plainly."
        description={`What people ask before they buy a pen, before they start the ${CHECKUP_SHORT}, and after the report. If yours is not here, email us — a person reads every message.`}
      />
      <TocRow items={toc} />
      <div className="container-x py-10 lg:py-16">
        <div className="lg:grid lg:grid-cols-[14rem_minmax(0,46rem)] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Toc items={toc} />
              <Button href={`mailto:${BRAND.supportEmail}`} variant="secondary" size="sm" className="mt-6">
                Ask a question
              </Button>
            </div>
          </aside>
          <div className="space-y-14">
            {GROUPS.map((group, gi) => (
              <section key={group.id} id={group.id} className="scroll-mt-32" aria-labelledby={`${group.id}-title`}>
                <p className="label-mono">
                  <span className="tnum">{String(gi + 1).padStart(2, "0")} — </span>
                  {group.items.length} questions
                </p>
                <h2 id={`${group.id}-title`} className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
                  {group.title}
                </h2>
                <p className="mt-3 max-w-xl text-[14px] text-muted">{group.description}</p>
                <Faq items={group.items} className="mt-6" />
              </section>
            ))}
            {ungrouped.length > 0 && (
              <section id="more" className="scroll-mt-32" aria-labelledby="more-title">
                <p className="label-mono">
                  <span className="tnum">{String(GROUPS.length + 1).padStart(2, "0")} — </span>
                  {ungrouped.length} questions
                </p>
                <h2 id="more-title" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
                  Everything else
                </h2>
                <Faq items={ungrouped} className="mt-6" />
              </section>
            )}
          </div>
        </div>
      </div>
      <CtaBand secondary={{ href: "/shop", label: "Or go to the range" }} />
    </>
  );
}
