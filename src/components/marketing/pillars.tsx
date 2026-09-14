import Link from "next/link";
import { ArrowRight, ClipboardCheck, GitCompare, MessageSquare, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/card";
import { NAMED_JURISDICTIONS } from "./copy";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { Section } from "./section";

const PILLARS: { icon: LucideIcon; eyebrow: string; title: string; body: string; href: string; cta: string }[] = [
  {
    icon: GitCompare,
    eyebrow: "Compare",
    title: "Side-by-side evidence and status",
    body: `Evidence grade for each goal, regulatory status across ${NAMED_JURISDICTIONS.length} jurisdictions, anti-doping status and the published dosing studies — on one screen, in the same words every time.`,
    href: "/compare",
    cta: "Compare peptides",
  },
  {
    icon: ClipboardCheck,
    eyebrow: "Assess",
    title: "Personal suitability flags",
    body: "Your history, medicines and goal checked against each compound’s documented contraindications, interactions and trial exposures. Every flag says where it came from.",
    href: "/assessment",
    cta: "Start the assessment",
  },
  {
    icon: MessageSquare,
    eyebrow: "Discuss",
    title: "Questions for your clinician",
    body: "A report written to be taken to an appointment: what to ask, what to monitor, what the evidence does and doesn’t show, and what the report could not assess.",
    href: "/how-it-works#report",
    cta: "See what the report contains",
  },
];

export function Pillars() {
  return (
    <Section tone="paper">
      <Reveal>
        <SectionHeading
          eyebrow="What it does"
          title="Built for the question you actually have"
          description="Not “what is the best peptide”, but “is this one worth raising with my doctor, given my history?” Three tools, one database, no sales pitch."
        />
      </Reveal>
      <Stagger className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16" stagger={0.1}>
        {PILLARS.map((p) => (
          <StaggerItem key={p.eyebrow} className="h-full">
            <Link
              href={p.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift sm:p-7"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
                <p.icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
              </span>
              <p className="mt-6 font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-brand-700">{p.eyebrow}</p>
              <h3 className="mt-2 font-display text-2xl leading-snug text-ink">{p.title}</h3>
              <p className="mt-3 flex-1 text-pretty text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                {p.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
