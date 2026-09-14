import { Database, FlaskConical, ScrollText, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/card";
import { NAMED_JURISDICTIONS } from "./copy";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { RuleTerminal } from "./rule-terminal";
import { Section } from "./section";

const POINTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Database,
    title: "A maintained regulatory database, per jurisdiction",
    body: `Status for the ${NAMED_JURISDICTIONS.length} major jurisdictions is recorded by hand from regulator sources, with the licensed indication and a last-reviewed date. Nothing is inferred; unconfirmed means “Unclear”.`,
  },
  {
    icon: ScrollText,
    title: "Rules reviewed against labels and trials",
    body: "Every contraindication, interaction and pregnancy rule reads from a compound record whose sources — regulator labels and peer-reviewed trials — are listed in full. The same answers always produce the same report, so a clinician can check the reasoning.",
  },
  {
    icon: FlaskConical,
    title: "Dosing shown as research, never as a recommendation",
    body: "You see the doses, durations and adverse events from published human studies, and how a dose you are considering compares with them. The report will not tell you what to take.",
  },
];

export function WhyNotChatbot() {
  return (
    <Section tone="ink" id="why">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionHeading
              tone="light"
              eyebrow="Why this isn’t another AI chatbot"
              title="Deterministic by design. Reviewable by a clinician."
              description="Language models are persuasive and unaccountable. A rules engine is neither — which is exactly what you want when the subject is your health."
            />
          </Reveal>
          <Stagger as="ul" className="mt-10 space-y-6" stagger={0.1}>
            {POINTS.map((p) => (
              <StaggerItem as="li" key={p.title} className="flex gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-dark bg-white/5 text-brand-300">
                  <p.icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-sans text-[1.02rem] font-medium leading-snug text-white [font-variation-settings:normal]">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-pretty text-[0.95rem] leading-relaxed text-white/65">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Reveal className="lg:col-span-6" delay={0.15}>
          <RuleTerminal />
        </Reveal>
      </div>
    </Section>
  );
}
