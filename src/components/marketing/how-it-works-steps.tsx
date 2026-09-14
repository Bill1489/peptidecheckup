import { GOALS } from "@/data/goals";
import { SECTION_META, SECTION_ORDER } from "@/lib/assessment/types";
import { SectionHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ASSESSMENT_MINUTES, OPTIONAL_SECTION_COUNT, SECTION_COUNT } from "./copy";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { Section } from "./section";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Tell us your goal",
    body: `Choose one of ${GOALS.length} goals — or describe your own — and say what success would look like and by when. Unrealistic timeframes become a flag, not a promise.`,
  },
  {
    title: "Answer structured health questions",
    body: `${SECTION_COUNT} short sections covering the compounds you’re considering, your history, medicines, previous experience, source and a safety screen. About ${ASSESSMENT_MINUTES} minutes; ${OPTIONAL_SECTION_COUNT} sections are optional.`,
  },
  {
    title: "Get a report you can take to a clinician",
    body: "Evidence for your goal, regulatory status where you live, suitability flags with their reasons, dosing research, stack analysis and the questions worth asking. Printable, private, yours.",
  },
];

export function SectionChips({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <ol className={cn("flex flex-wrap gap-2", className)} aria-label="Assessment sections">
      {SECTION_ORDER.map((id, i) => {
        const meta = SECTION_META[id];
        return (
          <li
            key={id}
            title={meta.description}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
              tone === "light"
                ? meta.optional
                  ? "border-dashed border-line-strong bg-transparent text-muted"
                  : "border-line bg-white text-ink-2"
                : meta.optional
                  ? "border-dashed border-white/25 text-white/60"
                  : "border-white/15 bg-white/5 text-white/85",
            )}
          >
            <span className={cn("font-mono text-[0.62rem]", tone === "light" ? "text-muted-2" : "text-white/45")}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {meta.short}
            {meta.optional && <span className="sr-only"> (optional)</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function HowItWorksSteps() {
  return (
    <Section tone="paper-2" id="how-it-works">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-8">
          <SectionHeading
            eyebrow="How it works"
            title="Seven minutes of structured questions. One report you can act on."
            description="The questionnaire asks only what the rules engine needs — categories, not essays — and tells you what it could not assess if you skip something."
          />
        </Reveal>
        <Reveal className="lg:col-span-4 lg:pb-2" delay={0.1}>
          <Button href="/how-it-works" variant="secondary" size="md">
            See the full walkthrough
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Reveal>
      </div>

      <div className="relative mt-14 lg:mt-20">
        <div
          aria-hidden
          className="absolute top-6 right-[12%] left-[12%] hidden h-px md:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, var(--color-line-strong) 12%, var(--color-line-strong) 88%, transparent)",
          }}
        />
        <Stagger as="ol" className="grid gap-10 md:grid-cols-3 md:gap-8" stagger={0.14}>
          {STEPS.map((step, i) => (
            <StaggerItem as="li" key={step.title} className="relative">
              <div className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-paper-2 font-mono text-sm text-ink shadow-inset">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 font-display text-2xl leading-snug text-ink">{step.title}</h3>
              <p className="mt-3 text-pretty text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Reveal className="mt-14 rounded-2xl border border-line bg-white/70 p-5 sm:p-6" delay={0.1}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-brand-700">
            The {SECTION_COUNT} sections · dashed = optional
          </p>
          <p className="text-sm text-muted">
            Save and resume any time — progress stays in your browser.
          </p>
        </div>
        <SectionChips className="mt-4" />
      </Reveal>
    </Section>
  );
}
