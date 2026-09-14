import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { Faq } from "./faq";
import { HOME_FAQ } from "./faq-data";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function FaqSection() {
  return (
    <Section tone="paper-2" id="faq">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Questions"
              title="The things people ask before they start."
              description="Short answers here; longer ones on the FAQ page. If yours isn’t covered, email us — a person reads every message."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/faq" variant="secondary" size="md">
                All questions
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href={`mailto:${BRAND.supportEmail}`} variant="ghost" size="md">
                {BRAND.supportEmail}
              </Button>
            </div>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7" delay={0.1}>
          <Faq items={HOME_FAQ} />
        </Reveal>
      </div>
    </Section>
  );
}
