import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { compoundsForGoal } from "@/data/compounds";
import { EVIDENCE_LABELS } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { assessmentHref, getSymptom, goalForSymptom, SYMPTOMS } from "@/lib/funnel";
import { EvidenceMeter, RegulatoryBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/card";
import { ComplianceStrip } from "@/components/marketing/compliance-strip";
import { ASSESSMENT_MINUTES, REPORT_CONTENTS } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { JsonLd } from "@/components/marketing/json-ld";
import { LandingHero } from "@/components/marketing/landing-hero";
import { ReportPreview } from "@/components/marketing/report-preview";
import { buildReportPreview } from "@/components/marketing/report-preview-data";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/reveal";
import { Section } from "@/components/marketing/section";
import { StickyCta } from "@/components/marketing/sticky-cta";

type Params = { symptom: string };

/** Ad traffic: keep the page focused — list the best-evidenced compounds and link to the rest. */
const MAX_LISTED = 6;

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return SYMPTOMS.map((s) => ({ symptom: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { symptom } = await params;
  const def = getSymptom(symptom);
  if (!def) return {};
  const goal = goalForSymptom(def);
  return {
    title: goal.funnelHeadline,
    description: def.metaDescription,
    alternates: { canonical: `/start/${def.slug}/` },
    openGraph: {
      title: `${goal.funnelHeadline} · ${BRAND.displayName}`,
      description: def.metaDescription,
      url: `/start/${def.slug}/`,
    },
  };
}

export default async function SymptomLandingPage({ params }: { params: Promise<Params> }) {
  const { symptom } = await params;
  const def = getSymptom(symptom);
  if (!def) notFound();

  const goal = goalForSymptom(def);
  const href = assessmentHref(def);
  const researched = compoundsForGoal(goal.id);
  const shown = researched.slice(0, MAX_LISTED);
  const hidden = researched.length - shown.length;
  const preview = buildReportPreview(goal.id);
  const goalLower = goal.label.toLowerCase();
  const compareHref =
    researched.length >= 2
      ? `/compare/?c=${researched
          .slice(0, 3)
          .map((r) => r.compound.slug)
          .join(",")}`
      : undefined;

  return (
    <div className="pb-24 md:pb-0">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: goal.funnelHeadline,
          description: def.metaDescription,
          url: `${BRAND.url}/start/${def.slug}/`,
          isPartOf: { "@type": "WebSite", name: BRAND.displayName, url: BRAND.url },
        }}
      />

      <LandingHero symptom={def} goal={goal} href={href} researchedCount={researched.length} />

      {/* What the assessment checks */}
      <Section tone="paper" id="checks" className="py-16 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="What the assessment checks"
            title={`What the assessment checks for ${goalLower}`}
            description={`${ASSESSMENT_MINUTES} minutes of structured questions — categories, not essays — run through a deterministic rules engine against the database.`}
          />
        </Reveal>
        <Stagger as="ol" className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.08}>
          {def.checks.map((check, i) => (
            <StaggerItem as="li" key={check} className="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 font-mono text-xs text-brand-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-pretty text-[0.95rem] leading-relaxed text-ink-2">{check}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Compounds researched for this goal */}
      <Section tone="paper-2" id="compounds" className="py-16 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="From the database"
              title="Compounds researched for this goal"
              description={`Sorted by the strength of human evidence for ${goalLower} specifically — not for any use. Regulatory badge shows United Kingdom status; the report uses your country.`}
            />
          </Reveal>
          {compareHref && (
            <Reveal delay={0.1} className="shrink-0">
              <Button href={compareHref} variant="secondary" size="md">
                Compare side by side
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Reveal>
          )}
        </div>

        {researched.length === 0 ? (
          <Reveal className="mt-10">
            <div className="rounded-2xl border border-dashed border-line-strong bg-white/60 p-6 sm:p-8">
              <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted">Honest empty state</p>
              <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-ink">
                Our database lists no compound with human evidence for this goal — the report will say so and point to
                alternatives worth discussing with a clinician.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href={href} variant="brand" size="md">
                  Start the assessment anyway
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button href="/peptides" variant="secondary" size="md">
                  Browse the directory
                </Button>
              </div>
            </div>
          </Reveal>
        ) : (
          <Stagger as="ul" className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-soft" stagger={0.06}>
            {shown.map(({ compound, evidence, summary }) => (
              <StaggerItem as="li" key={compound.slug}>
                <Link
                  href={`/peptides/${compound.slug}`}
                  className="group grid gap-4 p-5 transition-colors hover:bg-paper-2/60 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:p-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-xl leading-tight text-ink group-hover:text-brand-800">{compound.name}</h3>
                      <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">{compound.classLabel}</span>
                    </div>
                    <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted">{summary}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                    <span className="inline-flex items-center gap-2">
                      <EvidenceMeter level={evidence} />
                      <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-3">{EVIDENCE_LABELS[evidence]}</span>
                    </span>
                    <RegulatoryBadge status={compound.regulatory.UK.status} size="xs" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
            {hidden > 0 && (
              <StaggerItem as="li">
                <Link
                  href="/peptides"
                  className="flex items-center justify-between gap-4 bg-paper-2/40 p-5 text-sm text-muted transition-colors hover:bg-paper-2/80 hover:text-ink sm:px-6"
                >
                  <span>
                    {hidden} more {hidden === 1 ? "compound" : "compounds"} with weaker evidence for this goal — all listed in the
                    directory, and all considered in your report.
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              </StaggerItem>
            )}
          </Stagger>
        )}
      </Section>

      {/* What you'll get */}
      <Section tone="white" id="report" className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionHeading
                eyebrow="What you’ll get"
                title="A report built for the appointment, not the checkout."
                description="Every label traces back to a database field. Every flag says which answer produced it. Print it, save it, or ask for a clinician review."
              />
            </Reveal>
            <Stagger as="ul" className="mt-8 grid gap-3 sm:grid-cols-2" stagger={0.05}>
              {REPORT_CONTENTS.slice(0, 8).map((item) => (
                <StaggerItem as="li" key={item.title} className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-brand-600" aria-hidden strokeWidth={2.25} />
                  <div>
                    <p className="text-[0.95rem] font-medium text-ink">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal className="lg:col-span-6" delay={0.1}>
            <ReportPreview data={preview} compact className="mx-auto w-full max-w-[40rem] pt-4" />
          </Reveal>
        </div>
      </Section>

      <Section tone="paper" className="py-12 lg:py-16">
        <Reveal>
          <ComplianceStrip />
        </Reveal>
      </Section>

      <CtaBand
        eyebrow={goal.label}
        title={goal.funnelHeadline}
        description={`Find out which compounds are researched for ${goalLower}, what your history and medicines add, and what to ask a clinician.`}
        href={href}
        cta={`Start the free ${ASSESSMENT_MINUTES}-minute checkup`}
        className="pt-4 lg:pt-6"
      />

      <StickyCta href={href} note={`≈${ASSESSMENT_MINUTES} minutes · no account · nothing to buy`} />
    </div>
  );
}
