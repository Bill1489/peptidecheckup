import type { Metadata } from "next";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/marketing/cta-band";
import { Faq } from "@/components/marketing/faq";
import { ALL_FAQ, HOME_FAQ, MORE_FAQ } from "@/components/marketing/faq-data";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHeader } from "@/components/marketing/page-shell";
import { Toc, TocRow } from "@/components/marketing/toc";

const DESCRIPTION =
  "Answers to the questions people ask before buying or starting the Peptide Checkup: research-use labelling, prescription medicines, certificates of analysis, shipping, returns, the assessment, data and deletion.";

export const metadata: Metadata = {
  title: "FAQ",
  description: DESCRIPTION,
  alternates: { canonical: "/faq/" },
  openGraph: { images: OG_IMAGES, title: `FAQ · ${BRAND.displayName}`, description: DESCRIPTION, url: "/faq/" },
};

const pick = (ids: string[]) => MORE_FAQ.filter((i) => ids.includes(i.id));

const GROUPS = [
  {
    id: "store",
    title: "Products, testing, shipping",
    description: "What the label means, what the certificate says, and how orders move.",
    items: [...HOME_FAQ.slice(0, 5), ...pick(["consultation", "not-sold", "who-tests", "countries"])],
  },
  {
    id: "assessment",
    title: "The assessment and the report",
    description: "What it is, what it is not, and why it sometimes says no.",
    items: [...HOME_FAQ.slice(5, 7), ...pick(["discount", "regulatory-source", "dosing", "stacks", "athletes", "print"])],
  },
  {
    id: "data",
    title: "Accounts, data and deletion",
    description: "Where things are stored, what leaves your device, and how to remove it.",
    items: [...HOME_FAQ.slice(7), ...pick(["account", "delete"])],
  },
];

export default function FaqPage() {
  const toc = GROUPS.map((g) => ({ id: g.id, label: g.title }));

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
        description="What people ask before they buy, before they start the assessment, and after the report. If yours is not here, email us — a person reads every message."
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
          </div>
        </div>
      </div>
      <CtaBand secondary={{ href: "/shop", label: "Or go to the shop" }} />
    </>
  );
}
