import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { goalForSymptom, pensForSymptom, SYMPTOMS } from "@/lib/funnel";
import { ASSESSMENT_MINUTES, CHECKUP, CHECKUP_SHORT, index } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHeader } from "@/components/marketing/page-shell";
import { PenThumb } from "@/components/marketing/pen-cell";

const DESCRIPTION = `Choose the goal that brought you here and take the ${ASSESSMENT_MINUTES}-minute ${CHECKUP}. Each entry point names the pen the ${CHECKUP_SHORT} usually lands on for that goal — or says that nothing in the range is researched for it.`;

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
  const withPen = SYMPTOMS.filter((s) => pensForSymptom(s).length > 0).length;

  return (
    <>
      <PageHeader
        label="Start here"
        meta={[`${SYMPTOMS.length} entry points · ${withPen} with a pen`, `≈${ASSESSMENT_MINUTES} min · no account`]}
        title="What brought you here?"
        description={`Pick the goal closest to yours. Each page names the pen the ${CHECKUP_SHORT} usually lands on for that goal and what it checks before it does — and where nothing in the range is researched for the goal, it says so.`}
      />

      <section className="container-x py-10 lg:py-14">
        <ol className="border-t border-ink">
          {SYMPTOMS.map((s, i) => {
            const goal = goalForSymptom(s);
            const pens = pensForSymptom(s);
            return (
              <li key={s.slug} className="border-b border-ink">
                <Link
                  href={`/start/${s.slug}`}
                  className="hover-invert -mx-4 grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:-mx-6 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto_auto] sm:px-6 sm:py-6 lg:-mx-8 lg:px-8"
                >
                  <span className="label-mono tnum">{index(i + 1)}</span>
                  <span className="min-w-0">
                    <span className="font-display block text-balance text-[1.35rem] uppercase leading-[1.02] text-ink sm:text-[1.75rem] lg:text-[2.25rem]">
                      {goal.funnelHeadline}
                    </span>
                    <span className="label-mono mt-2 block">
                      {s.label}
                      {" · "}
                      {pens.length > 0 ? `Usually ${pens.map((p) => p.name).join(" / ")}` : "No pen in the range — honest answer"}
                    </span>
                  </span>
                  <div className="hidden items-center gap-2 sm:flex" aria-hidden>
                    {pens.map((p) => (
                      <PenThumb key={p.id} product={p} className="h-16 w-16" />
                    ))}
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 text-[14px] text-muted">
          Different goal?{" "}
          <Link href="/assessment/?goal=other" className="text-ink link-rule">
            Describe it in the {CHECKUP_SHORT}
          </Link>
          .
        </p>
      </section>

      <CtaBand secondary={{ href: "/shop", label: "Or go straight to the range" }} />
    </>
  );
}
