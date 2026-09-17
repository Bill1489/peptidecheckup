import type * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge, EvidenceBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpecRow } from "@/components/ui/card";
import { compoundsByFamily, getCompound, getCompounds } from "@/data/compounds";
import { CONDITION_MAP } from "@/data/conditions";
import { GOAL_MAP } from "@/data/goals";
import { MEDICATION_CLASS_MAP } from "@/data/medications";
import {
  EVIDENCE_DESCRIPTIONS,
  EVIDENCE_LABELS,
  EVIDENCE_RANK,
  FAMILY_LABELS,
  HUMAN_EVIDENCE_LABELS,
  ROUTE_LABELS,
  type Compound,
  type Interaction,
} from "@/data/types";
import { DISCLAIMER_SHORT } from "@/lib/brand";
import { assessmentHref, compareHref, compoundHref, humaniseSlug, wadaLabel } from "@/lib/compare";
import { cn, formatDate } from "@/lib/utils";
import { BuyPanel } from "./buy-panel";
import { CompoundMiniCard } from "./compound-mini-card";
import { DetailToc, type TocSection } from "./detail-toc";
import { DosingResearch } from "./dosing-research";
import { EvidenceLadder } from "./evidence-ladder";
import { GoalIcon } from "./goal-icon";
import { JurisdictionTabs } from "./jurisdiction-tabs";
import { RangeStrip } from "./range-strip";
import {
  CONTRAINDICATION_LABELS,
  CONTRAINDICATION_TONE,
  INTERACTION_SEVERITY_DESCRIPTIONS,
  INTERACTION_SEVERITY_LABELS,
  INTERACTION_SEVERITY_MARKER,
  PREGNANCY_LABELS,
  PREGNANCY_TONE,
  STACK_EVIDENCE_LABELS,
  STACK_EVIDENCE_MARKER,
} from "./labels";
import { Breadcrumbs, CellGrid, EmptyNote, Marker, MeterLabel } from "./primitives";

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");

function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[9.5rem] border-t border-ink pt-8 lg:scroll-mt-[7.5rem] lg:pt-10">
      <div className="grid gap-3 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-8">
        <p className="label-mono lg:pt-1.5">
          <span className="text-ink tnum">{index}</span> {eyebrow}
        </p>
        <div className="min-w-0 max-w-2xl">
          <h2 id={`${id}-title`} className="text-balance text-[1.6rem] uppercase leading-[0.98] text-ink sm:text-[2rem]">
            {title}
          </h2>
          {description && <p className="mt-3 text-pretty text-[14px] leading-relaxed text-muted sm:text-[15px]">{description}</p>}
        </div>
      </div>
      <div className="mt-6 lg:mt-8">{children}</div>
    </section>
  );
}

function PanelTitle({ marker, children }: { marker?: string; children: React.ReactNode }) {
  return (
    <h3 className="label-mono flex items-center gap-2 text-ink">
      {marker && <Marker className={marker} />}
      {children}
    </h3>
  );
}

function RuledList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("divide-y divide-line", className)}>
      {items.map((item) => (
        <li key={item} className="py-2 text-[14px] leading-relaxed text-ink-3 first:pt-0 last:pb-0">
          {item}
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ol className={cn("divide-y divide-line border border-ink", className)}>
      {items.map((item, i) => (
        <li key={item} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 px-4 py-3 text-[14px] leading-relaxed text-ink-3">
          <span className="pt-0.5 font-mono text-[11px] text-muted tnum">{pad(i + 1)}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

const KEY_FACT_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

function KeyFacts({ facts }: { facts: Compound["keyFacts"] }) {
  if (facts.length === 0) return null;
  const lg = Math.min(facts.length, 5);
  return (
    <CellGrid as="dl" cols={[2, 3, lg]} count={facts.length} className={cn("grid-cols-2 sm:grid-cols-3", KEY_FACT_COLS[lg])} aria-label="Key facts">
      {facts.map((f) => (
        <div key={f.label} className="p-4 sm:p-5">
          <dt className="label-mono">{f.label}</dt>
          <dd className="mt-2 text-[14px] font-medium leading-snug text-ink">{f.value}</dd>
        </div>
      ))}
    </CellGrid>
  );
}

const SEVERITY_ORDER: Interaction["severity"][] = ["major", "moderate", "minor"];

/* ------------------------------------------------------------------ */
/* Detail page                                                          */
/* ------------------------------------------------------------------ */

export function CompoundDetail({ compound }: { compound: Compound }) {
  const alternatives = getCompounds(compound.alternatives);
  const related = compoundsByFamily(compound.family)
    .filter((c) => c.slug !== compound.slug)
    .slice(0, 4);
  const goals = [...compound.goals].sort((a, b) => EVIDENCE_RANK[b.evidence] - EVIDENCE_RANK[a.evidence]);
  const contraindications = [...compound.contraindications].sort(
    (a, b) => Number(b.severity === "absolute") - Number(a.severity === "absolute"),
  );
  const interactionGroups = SEVERITY_ORDER.map((severity) => ({
    severity,
    items: compound.interactions.filter((i) => i.severity === severity),
  })).filter((g) => g.items.length > 0);
  const wada = compound.wadaProhibited;

  const sections: TocSection[] = [
    { id: "overview", label: "Overview" },
    { id: "evidence", label: "Evidence by goal" },
    { id: "regulatory", label: "Regulatory status" },
    { id: "dosing", label: "Dosing research" },
    { id: "safety", label: "Safety" },
    { id: "interactions", label: "Interactions" },
    { id: "pregnancy", label: "Pregnancy" },
    { id: "monitoring", label: "Monitoring" },
    { id: "combinations", label: "Combinations" },
    { id: "source", label: "Source considerations" },
    { id: "questions", label: "Questions for your clinician" },
    ...(alternatives.length > 0 ? [{ id: "alternatives", label: "Alternatives" }] : []),
    { id: "references", label: "References" },
    ...(related.length > 0 ? [{ id: "related", label: "Related compounds" }] : []),
  ];
  const index = (id: string) => pad(sections.findIndex((s) => s.id === id) + 1);

  return (
    <article>
      {/* ---------------------------------------------------------- Hero */}
      <header className="rule-b">
        <div className="container-x pt-6 sm:pt-8">
          <Breadcrumbs
            items={[
              { label: "Peptides", href: "/peptides/" },
              { label: FAMILY_LABELS[compound.family], href: "/peptides/" },
              { label: compound.name },
            ]}
          />
        </div>

        <div className="container-x grid gap-10 pb-10 pt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-14 lg:pb-14 lg:pt-10">
          <div className="min-w-0">
            <p className="label-mono">Compound record · {FAMILY_LABELS[compound.family]}</p>
            <h1 className="mt-4 break-words text-[2.4rem] uppercase leading-[0.95] text-ink sm:text-[3.2rem] lg:text-[3.4rem] xl:text-[4.4rem]">
              {compound.name}
            </h1>
            {compound.aliases.length > 0 && (
              <p className="mt-4 font-mono text-[12px] leading-relaxed text-muted">
                <span className="uppercase tracking-[0.08em]">Also</span> {compound.aliases.join(" · ")}
              </p>
            )}
            <p className="mt-3 text-[15px] font-medium text-ink">{compound.classLabel}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              <Badge tone="neutral" size="sm">
                {FAMILY_LABELS[compound.family]}
              </Badge>
              <EvidenceBadge level={compound.overallEvidence} size="sm" prefix="Evidence ·" />
              <Badge tone="outline" size="sm">
                {HUMAN_EVIDENCE_LABELS[compound.humanEvidenceLevel]}
              </Badge>
              {wada && (
                <Badge tone="danger" size="sm" dot>
                  WADA · {wadaLabel(wada)}
                </Badge>
              )}
            </div>

            <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-ink-3">{compound.tagline}</p>

            <div className="mt-8 flex flex-col gap-2 sm:flex-row">
              <Button href={assessmentHref(compound.slug)} size="lg">
                Check my fit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href={compareHref([compound.slug])} size="lg" variant="secondary">
                Compare
              </Button>
            </div>

            <p className="label-mono mt-6">
              Record reviewed {formatDate(compound.lastReviewed)} · {compound.references.length} references
            </p>
          </div>

          <aside className="divide-y divide-ink border border-ink bg-white" aria-label="Evidence grade and shop availability">
            <EvidenceLadder level={compound.overallEvidence} humanEvidenceLevel={compound.humanEvidenceLevel} />
            <BuyPanel compound={compound} />
          </aside>
        </div>

        <div className="container-x space-y-6 pb-10 lg:space-y-8 lg:pb-14">
          <RangeStrip compound={compound} />
          <KeyFacts facts={compound.keyFacts} />
        </div>
      </header>

      {/* ---------------------------------------------------------- Body */}
      <div className="container-x pb-16 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14 lg:pb-24 lg:pt-12 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-20">
        <DetailToc sections={sections} />

        <div className="min-w-0 space-y-14 pt-8 lg:space-y-20 lg:pt-0">
          {/* Overview */}
          <Section id="overview" index={index("overview")} eyebrow="Overview" title={`What ${compound.name} is`}>
            <CellGrid cols={[1, 1, 2]} count={2} className="lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="p-5 sm:p-6">
                <PanelTitle>Summary</PanelTitle>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-3">{compound.summary}</p>
              </div>
              <div className="p-5 sm:p-6">
                <PanelTitle>Mechanism</PanelTitle>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-3">{compound.mechanism}</p>
                <div className="mt-5 border-t border-line">
                  <SpecRow label="Routes studied" value={compound.routes.map((r) => ROUTE_LABELS[r]).join(", ")} />
                  <SpecRow label="Anti-doping" value={wadaLabel(wada)} />
                </div>
              </div>
            </CellGrid>
          </Section>

          {/* Evidence by goal */}
          <Section
            id="evidence"
            index={index("evidence")}
            eyebrow="Evidence by goal"
            title="What has been shown, for which goal"
            description={
              <>
                Grades follow one scale across the site. <span className="text-ink">{EVIDENCE_LABELS[compound.overallEvidence]}</span>{" "}
                overall means: {EVIDENCE_DESCRIPTIONS[compound.overallEvidence].toLowerCase()}
              </>
            }
          >
            {goals.length === 0 ? (
              <EmptyNote>No goal-specific human evidence is recorded for this compound.</EmptyNote>
            ) : (
              <ol className="divide-y divide-ink border border-ink">
                {goals.map((g) => {
                  const goal = GOAL_MAP[g.goal];
                  return (
                    <li key={g.goal} className="grid gap-3 p-4 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:gap-6 sm:p-5">
                      <div>
                        <h3 className="flex items-center gap-2 text-[14px] font-semibold tracking-normal text-ink">
                          <GoalIcon icon={goal.icon} className="h-4 w-4 shrink-0" />
                          {goal.label}
                        </h3>
                        <div className="mt-2.5">
                          <MeterLabel level={g.evidence} />
                        </div>
                      </div>
                      <p className="text-[14px] leading-relaxed text-ink-3">{g.summary}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </Section>

          {/* Regulatory */}
          <Section
            id="regulatory"
            index={index("regulatory")}
            eyebrow="Regulatory status"
            title="Where it is authorised, and for what"
            description="Status is recorded per jurisdiction from regulator sources and reviewed by hand. It is never inferred from another region's decision."
          >
            <JurisdictionTabs regulatory={compound.regulatory} compoundName={compound.name} />
          </Section>

          {/* Dosing research */}
          <Section
            id="dosing"
            index={index("dosing")}
            eyebrow="Dosing research"
            title="What the evidence says about exposure"
            description="Published human studies and the doses, routes and durations they used — reported as research information, not a recommendation."
          >
            <DosingResearch studies={compound.dosingResearch} note={compound.dosingResearchNote} compoundName={compound.name} />
          </Section>

          {/* Safety */}
          <Section
            id="safety"
            index={index("safety")}
            eyebrow="Safety"
            title="Adverse effects and contraindications"
            description="Common effects seen in trials or reports, serious effects that warrant urgent review, and conditions under which use is not appropriate or needs assessment."
          >
            <CellGrid cols={[1, 1, 3]} count={3} className="lg:grid-cols-3">
              <div className="p-4 sm:p-5">
                <PanelTitle marker="bg-ink">Common adverse effects</PanelTitle>
                {compound.commonAdverseEffects.length ? (
                  <RuledList items={compound.commonAdverseEffects} className="mt-4" />
                ) : (
                  <EmptyNote className="mt-4">None recorded — this usually reflects limited human data rather than absence of effects.</EmptyNote>
                )}
              </div>
              <div className="p-4 sm:p-5">
                <PanelTitle marker="bg-accent-500">Serious adverse effects</PanelTitle>
                {compound.seriousAdverseEffects.length ? (
                  <RuledList items={compound.seriousAdverseEffects} className="mt-4" />
                ) : (
                  <EmptyNote className="mt-4">None recorded in the sources reviewed.</EmptyNote>
                )}
              </div>
              <div className="p-4 sm:p-5">
                <PanelTitle marker="bg-caution">Contraindications</PanelTitle>
                {contraindications.length ? (
                  <ul className="mt-4 divide-y divide-line">
                    {contraindications.map((c) => (
                      <li key={c.conditionId} className="py-2.5 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] font-medium text-ink">{CONDITION_MAP[c.conditionId].label}</span>
                          <Badge tone={CONTRAINDICATION_TONE[c.severity]} size="xs" dot>
                            {CONTRAINDICATION_LABELS[c.severity]}
                          </Badge>
                        </div>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{c.note}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyNote className="mt-4">
                    No condition-specific contraindications are recorded — an absence of data, not a statement of safety.
                  </EmptyNote>
                )}
                {contraindications.length > 0 && (
                  <p className="label-mono mt-4 border-t border-line pt-3">Do not use = should not be used · Caution = needs assessment</p>
                )}
              </div>
            </CellGrid>
          </Section>

          {/* Interactions */}
          <Section
            id="interactions"
            index={index("interactions")}
            eyebrow="Interactions"
            title="Medicine classes that need review"
            description="Grouped by how seriously the combination should be taken. Class labels match the medicines questionnaire in the assessment."
          >
            {interactionGroups.length === 0 ? (
              <div className="border border-ink p-5">
                <EmptyNote>
                  No medicine-class interactions are recorded in our database for {compound.name}. This reflects the limited human data
                  available rather than evidence that it is free of interactions.
                </EmptyNote>
              </div>
            ) : (
              <>
                <ul className="label-mono mb-3 flex flex-wrap gap-x-4 gap-y-1" aria-label="Severity key">
                  {SEVERITY_ORDER.map((s) => (
                    <li key={s} className="flex items-center gap-1.5">
                      <Marker className={INTERACTION_SEVERITY_MARKER[s]} />
                      {INTERACTION_SEVERITY_LABELS[s]}
                    </li>
                  ))}
                </ul>
                <div className="divide-y divide-ink border border-ink">
                  {interactionGroups.map((group) => (
                    <section key={group.severity} aria-labelledby={`interactions-${group.severity}`}>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-paper-2 px-4 py-2.5">
                        <h3 id={`interactions-${group.severity}`} className="label-mono flex items-center gap-2 text-ink">
                          <Marker className={INTERACTION_SEVERITY_MARKER[group.severity]} />
                          {INTERACTION_SEVERITY_LABELS[group.severity]}
                        </h3>
                        <p className="text-[12.5px] text-muted">{INTERACTION_SEVERITY_DESCRIPTIONS[group.severity]}</p>
                      </div>
                      <ul className="divide-y divide-line">
                        {group.items.map((i) => {
                          const cls = MEDICATION_CLASS_MAP[i.classId];
                          return (
                            <li key={i.classId} className="grid gap-1.5 px-4 py-3 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:gap-6">
                              <div>
                                <p className="text-[14px] font-medium text-ink">{cls.label}</p>
                                {cls.examples && <p className="mt-0.5 text-[12px] text-muted">{cls.examples}</p>}
                              </div>
                              <p className="text-[14px] leading-relaxed text-ink-3">{i.note}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>
              </>
            )}
          </Section>

          {/* Pregnancy */}
          <Section id="pregnancy" index={index("pregnancy")} eyebrow="Pregnancy & breastfeeding" title="Status in pregnancy">
            <div className="border border-ink p-5 sm:flex sm:items-start sm:gap-6 sm:p-6">
              <div className="shrink-0">
                <Badge tone={PREGNANCY_TONE[compound.pregnancy.status]} size="md" dot>
                  {PREGNANCY_LABELS[compound.pregnancy.status]}
                </Badge>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-3 sm:mt-0.5">{compound.pregnancy.note}</p>
            </div>
          </Section>

          {/* Monitoring */}
          <Section
            id="monitoring"
            index={index("monitoring")}
            eyebrow="Monitoring"
            title="What is usually monitored"
            description="Parameters that trials and product information track. A clinician decides what applies to an individual."
          >
            {compound.monitoring.length ? (
              <NumberedList items={compound.monitoring} />
            ) : (
              <EmptyNote>No monitoring parameters are recorded for this compound.</EmptyNote>
            )}
          </Section>

          {/* Combinations */}
          <Section
            id="combinations"
            index={index("combinations")}
            eyebrow="Combinations"
            title="What is known about combining it"
            description="Notes on pairing with other compounds in the directory: whether the combination has been studied in people, and where mechanisms overlap."
          >
            {compound.stackNotes.length === 0 ? (
              <div className="border border-ink p-5">
                <EmptyNote>No combination notes are recorded for {compound.name}.</EmptyNote>
              </div>
            ) : (
              <ul className="divide-y divide-ink border border-ink">
                {compound.stackNotes.map((n) => {
                  const other = getCompound(n.with);
                  return (
                    <li key={n.with} className="grid gap-3 p-4 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:gap-6 sm:p-5">
                      <div className="min-w-0">
                        <h3 className="font-display break-words text-[1.1rem] uppercase leading-none text-ink">
                          {other ? (
                            <Link href={compoundHref(other.slug)} className="link-rule">
                              {other.name}
                            </Link>
                          ) : (
                            humaniseSlug(n.with)
                          )}
                        </h3>
                        {!other && <p className="label-mono mt-1.5">Not yet in the directory</p>}
                        <p className="label-mono mt-2.5 flex items-center gap-2">
                          <Marker className={STACK_EVIDENCE_MARKER[n.evidence]} />
                          {STACK_EVIDENCE_LABELS[n.evidence]}
                        </p>
                      </div>
                      <div>
                        {n.overlap && (
                          <p className="text-[12.5px] leading-relaxed text-muted">
                            <span className="label-mono">Overlap · </span>
                            {n.overlap}
                          </p>
                        )}
                        <p className={cn("text-[14px] leading-relaxed text-ink-3", n.overlap && "mt-1.5")}>{n.note}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">Discuss any proposed combination with a qualified healthcare professional.</p>
          </Section>

          {/* Source considerations */}
          <Section
            id="source"
            index={index("source")}
            eyebrow="Source considerations"
            title="Supply, quality and legitimacy"
            description="How the compound reaches people in practice, and what that means for product quality."
          >
            {compound.sourceConsiderations.length ? (
              <NumberedList items={compound.sourceConsiderations} />
            ) : (
              <EmptyNote>No source considerations are recorded for this compound.</EmptyNote>
            )}
          </Section>

          {/* Clinician questions */}
          <Section
            id="questions"
            index={index("questions")}
            eyebrow="Questions for your clinician"
            title="Take these to your appointment"
            description="Specific to this compound. The personal assessment adds questions drawn from your own history and medicines."
          >
            {compound.clinicianQuestions.length ? (
              <NumberedList items={compound.clinicianQuestions} />
            ) : (
              <EmptyNote>No compound-specific questions are recorded.</EmptyNote>
            )}
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              The{" "}
              <Link href={assessmentHref(compound.slug)} className="link-rule text-ink">
                personal assessment
              </Link>{" "}
              tailors this list to your responses.
            </p>
          </Section>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <Section
              id="alternatives"
              index={index("alternatives")}
              eyebrow="Alternatives"
              title="Compounds with stronger evidence or firmer regulatory footing"
              description="Listed for overlapping goals. Whether any is appropriate depends on your history — the assessment maps that for you."
            >
              <CellGrid as="ul" itemAs="li" cols={[1, 2, 2, 3]} count={alternatives.length} className="sm:grid-cols-2 xl:grid-cols-3">
                {alternatives.map((a) => (
                  <li key={a.slug} className="min-w-0">
                    <CompoundMiniCard compound={a} />
                  </li>
                ))}
              </CellGrid>
            </Section>
          )}

          {/* References */}
          <Section
            id="references"
            index={index("references")}
            eyebrow="References"
            title="Sources behind this record"
            description="Regulator documents and peer-reviewed publications used to derive every grade and statement above."
          >
            {compound.references.length ? (
              <ol className="divide-y divide-line border border-ink">
                {compound.references.map((ref, i) => (
                  <li key={`${ref.label}-${i}`} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 px-4 py-3 text-[14px] leading-relaxed">
                    <span className="pt-0.5 font-mono text-[11px] text-muted tnum">{pad(i + 1)}</span>
                    {ref.url ? (
                      <a href={ref.url} target="_blank" rel="noreferrer noopener" className="link-rule text-ink-3">
                        {ref.label}
                        <ArrowUpRight className="ml-1 inline h-3 w-3 text-muted-2" aria-hidden />
                      </a>
                    ) : (
                      <span className="text-ink-3">{ref.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyNote>No references are recorded for this compound.</EmptyNote>
            )}
            <p className="mt-4 text-[12px] leading-relaxed text-muted">{DISCLAIMER_SHORT}</p>
          </Section>

          {/* Related */}
          {related.length > 0 && (
            <Section
              id="related"
              index={index("related")}
              eyebrow="Related compounds"
              title={`More in ${FAMILY_LABELS[compound.family].toLowerCase()}`}
              description="Other compounds in the same family, graded on the same record."
            >
              <CellGrid as="ul" itemAs="li" cols={[1, 2, 2, 4]} count={related.length} className="sm:grid-cols-2 xl:grid-cols-4">
                {related.map((r) => (
                  <li key={r.slug} className="min-w-0">
                    <CompoundMiniCard compound={r} />
                  </li>
                ))}
              </CellGrid>
            </Section>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- CTA */}
      <section className="rule-t bg-ink text-white" aria-labelledby="detail-cta-title">
        <div className="container-x grid gap-8 py-14 lg:grid-cols-[200px_minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:py-20">
          <p className="label-mono text-white/60">Personal assessment</p>
          <div className="max-w-2xl">
            <h2 id="detail-cta-title" className="text-balance text-[2rem] uppercase leading-[0.95] sm:text-[2.8rem] lg:text-[3.4rem]">
              Check {compound.name} against your history
            </h2>
            <p className="mt-5 text-pretty text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
              Seven minutes of structured questions about your goal, history and medicines, mapped against this record by a deterministic,
              clinician-reviewable rules engine. The report tells you when not to buy.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Button href={assessmentHref(compound.slug)} size="xl" variant="inverted">
              Start the assessment
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={compareHref([compound.slug])} size="xl" variant="ghost" className="text-white hover:border-white hover:text-white">
              Compare with another
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
