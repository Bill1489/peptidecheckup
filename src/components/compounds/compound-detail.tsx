import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  ChevronRight,
  ClipboardList,
  Combine,
  ExternalLink,
  GitCompareArrows,
  MessageCircleQuestionMark,
  PackageSearch,
  ShieldAlert,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import { Badge, EvidenceBadge, EvidenceMeter } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
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
import { compareHref, compoundHref, humaniseSlug, wadaLabel } from "@/lib/compare";
import { cn, formatDate } from "@/lib/utils";
import { CompoundMiniCard } from "./compound-mini-card";
import { DetailToc, type TocSection } from "./detail-toc";
import { DosingResearch } from "./dosing-research";
import { EvidenceLadder } from "./evidence-ladder";
import { GoalIcon } from "./goal-icon";
import { JurisdictionTabs } from "./jurisdiction-tabs";
import {
  CONTRAINDICATION_LABELS,
  CONTRAINDICATION_TONE,
  INTERACTION_SEVERITY_DESCRIPTIONS,
  INTERACTION_SEVERITY_LABELS,
  INTERACTION_SEVERITY_TONE,
  PREGNANCY_LABELS,
  PREGNANCY_TONE,
  STACK_EVIDENCE_LABELS,
  STACK_EVIDENCE_TONE,
} from "./labels";

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 lg:scroll-mt-28">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={`${id}-title`} className="mt-2.5 font-display text-2xl leading-[1.15] tracking-[-0.02em] text-ink sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-3 text-pretty text-sm leading-relaxed text-muted sm:text-base">{description}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6", className)}>{children}</div>;
}

function PanelTitle({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-ink-3">
      {icon}
      {children}
    </h3>
  );
}

function BulletList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-2 text-sm leading-relaxed text-ink-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyNote({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm leading-relaxed text-muted", className)}>{children}</p>;
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(last && "font-medium text-ink")} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3 w-3 text-muted-2" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
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
  const cols = KEY_FACT_COLS[Math.min(facts.length, 5)] ?? "lg:grid-cols-5";
  return (
    <dl className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", cols)} aria-label="Key facts">
      {facts.map((f) => (
        <div key={f.label} className="rounded-xl border border-line bg-white/80 p-4">
          <dt className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muted-2">{f.label}</dt>
          <dd className="mt-1.5 text-sm font-medium leading-snug text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
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

  return (
    <article>
      {/* ---------------------------------------------------------- Hero */}
      <header className="relative border-b border-line bg-paper-2/60 bg-grain">
        <div className="container-x py-8 sm:py-12 lg:py-16">
          <Breadcrumbs
            items={[
              { label: "Peptides", href: "/peptides/" },
              { label: FAMILY_LABELS[compound.family], href: "/peptides/" },
              { label: compound.name },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-14">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand" size="sm">
                  {FAMILY_LABELS[compound.family]}
                </Badge>
                <EvidenceBadge level={compound.overallEvidence} size="sm" prefix="Evidence ·" />
                <Badge tone="info" size="sm">
                  {HUMAN_EVIDENCE_LABELS[compound.humanEvidenceLevel]}
                </Badge>
                {wada && (
                  <Badge tone="danger" size="sm">
                    <ShieldAlert className="h-3 w-3" aria-hidden />
                    WADA · {wadaLabel(wada)}
                  </Badge>
                )}
              </div>

              <p className="mt-6 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-700">{compound.classLabel}</p>
              <h1 className="mt-3 font-display text-4xl font-normal leading-[1.05] tracking-[-0.025em] text-balance text-ink sm:text-5xl lg:text-6xl">
                {compound.name}
              </h1>
              {compound.aliases.length > 0 && (
                <p className="mt-4 text-sm text-muted">
                  Also known as <span className="text-ink-3">{compound.aliases.join(", ")}</span>
                </p>
              )}
              <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-3">{compound.tagline}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={`/assessment/?compound=${compound.slug}`} size="lg">
                  Check my fit
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
                </Button>
                <Button href={compareHref([compound.slug])} size="lg" variant="secondary">
                  <GitCompareArrows className="h-4 w-4" aria-hidden />
                  Compare
                </Button>
              </div>

              <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-2">
                Record last reviewed {formatDate(compound.lastReviewed)} · {compound.references.length} references
              </p>
            </div>

            <EvidenceLadder level={compound.overallEvidence} humanEvidenceLevel={compound.humanEvidenceLevel} />
          </div>

          <div className="mt-10 lg:mt-12">
            <KeyFacts facts={compound.keyFacts} />
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------- Body */}
      <div className="container-x pb-20 pt-4 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14 lg:pt-14 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-20">
        <DetailToc sections={sections} />

        <div className="min-w-0 space-y-16 pt-8 lg:space-y-20 lg:pt-0">
          {/* Overview */}
          <Section id="overview" eyebrow="Overview" title={`What ${compound.name} is`}>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <Panel>
                <PanelTitle>Summary</PanelTitle>
                <p className="mt-3 text-base leading-relaxed text-ink-3">{compound.summary}</p>
              </Panel>
              <Panel className="bg-paper-2/60">
                <PanelTitle>Mechanism</PanelTitle>
                <p className="mt-3 text-sm leading-relaxed text-ink-3">{compound.mechanism}</p>
                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
                  <div>
                    <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-2">Routes studied</dt>
                    <dd className="mt-1 text-sm text-ink">{compound.routes.map((r) => ROUTE_LABELS[r]).join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-2">Anti-doping</dt>
                    <dd className="mt-1 text-sm text-ink">{wadaLabel(wada)}</dd>
                  </div>
                </dl>
              </Panel>
            </div>
          </Section>

          {/* Evidence by goal */}
          <Section
            id="evidence"
            eyebrow="Evidence by goal"
            title="What has been shown, for which goal"
            description={
              <>
                Grades follow one scale across the site. <span className="text-ink-3">{EVIDENCE_LABELS[compound.overallEvidence]}</span>{" "}
                overall means: {EVIDENCE_DESCRIPTIONS[compound.overallEvidence].toLowerCase()}
              </>
            }
          >
            {goals.length === 0 ? (
              <EmptyNote>No goal-specific human evidence is recorded for this compound.</EmptyNote>
            ) : (
              <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
                {goals.map((g) => {
                  const goal = GOAL_MAP[g.goal];
                  return (
                    <li key={g.goal} className="grid gap-3 p-5 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:gap-6 sm:p-6">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                            <GoalIcon icon={goal.icon} className="h-4 w-4" />
                          </span>
                          <h3 className="font-sans text-sm font-semibold text-ink">{goal.label}</h3>
                        </div>
                        <div className="mt-3 flex items-center gap-2 pl-[2.6rem] text-xs font-medium text-ink sm:pl-0">
                          <EvidenceMeter level={g.evidence} />
                          {EVIDENCE_LABELS[g.evidence]}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-3">{g.summary}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </Section>

          {/* Regulatory */}
          <Section
            id="regulatory"
            eyebrow="Regulatory status"
            title="Where it is authorised, and for what"
            description="Status is recorded per jurisdiction from regulator sources and reviewed by hand. It is never inferred from another region's decision."
          >
            <JurisdictionTabs regulatory={compound.regulatory} compoundName={compound.name} />
          </Section>

          {/* Dosing research */}
          <Section
            id="dosing"
            eyebrow="Dosing research"
            title="What the evidence says about exposure"
            description="Published human studies and the doses, routes and durations they used — reported as research information, not a recommendation."
          >
            <DosingResearch studies={compound.dosingResearch} note={compound.dosingResearchNote} compoundName={compound.name} />
          </Section>

          {/* Safety */}
          <Section
            id="safety"
            eyebrow="Safety"
            title="Adverse effects and contraindications"
            description="Common effects seen in trials or reports, serious effects that warrant urgent review, and conditions under which use is not appropriate or needs assessment."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Panel>
                <PanelTitle icon={<Activity className="h-3.5 w-3.5 text-brand-600" aria-hidden />}>Common adverse effects</PanelTitle>
                {compound.commonAdverseEffects.length ? (
                  <BulletList items={compound.commonAdverseEffects} className="mt-4" />
                ) : (
                  <EmptyNote className="mt-4">
                    None recorded — this usually reflects limited human data rather than absence of effects.
                  </EmptyNote>
                )}
              </Panel>
              <Panel className="border-concern/20">
                <PanelTitle icon={<TriangleAlert className="h-3.5 w-3.5 text-concern" aria-hidden />}>Serious adverse effects</PanelTitle>
                {compound.seriousAdverseEffects.length ? (
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-3">
                    {compound.seriousAdverseEffects.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-concern" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyNote className="mt-4">None recorded in the sources reviewed.</EmptyNote>
                )}
              </Panel>
              <Panel className="md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <PanelTitle icon={<ShieldAlert className="h-3.5 w-3.5 text-caution" aria-hidden />}>Contraindications</PanelTitle>
                  {contraindications.length > 0 && (
                    <p className="text-xs text-muted">
                      <span className="font-medium text-rose-800">Do not use</span> = should not be used ·{" "}
                      <span className="font-medium text-amber-800">Caution</span> = needs professional assessment
                    </p>
                  )}
                </div>
                {contraindications.length ? (
                  <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {contraindications.map((c) => (
                      <li key={c.conditionId} className="rounded-xl bg-paper-2/60 p-4 text-sm leading-relaxed">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-ink">{CONDITION_MAP[c.conditionId].label}</span>
                          <Badge tone={CONTRAINDICATION_TONE[c.severity]} size="xs" dot>
                            {CONTRAINDICATION_LABELS[c.severity]}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-muted">{c.note}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyNote className="mt-4">
                    No condition-specific contraindications are recorded — an absence of data, not a statement of safety.
                  </EmptyNote>
                )}
              </Panel>
            </div>
          </Section>

          {/* Interactions */}
          <Section
            id="interactions"
            eyebrow="Interactions"
            title="Medicine classes that need review"
            description="Grouped by how seriously the combination should be taken. Class labels match the medicines questionnaire in the assessment."
          >
            {interactionGroups.length === 0 ? (
              <Panel>
                <EmptyNote>
                  No medicine-class interactions are recorded in our database for {compound.name}. This reflects the limited human data
                  available rather than evidence that it is free of interactions.
                </EmptyNote>
              </Panel>
            ) : (
              <div className="space-y-4">
                {interactionGroups.map((group) => (
                  <Panel key={group.severity}>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone={INTERACTION_SEVERITY_TONE[group.severity]} size="sm" dot>
                        {INTERACTION_SEVERITY_LABELS[group.severity]}
                      </Badge>
                      <p className="text-xs text-muted">{INTERACTION_SEVERITY_DESCRIPTIONS[group.severity]}</p>
                    </div>
                    <ul className="mt-4 divide-y divide-line">
                      {group.items.map((i) => {
                        const cls = MEDICATION_CLASS_MAP[i.classId];
                        return (
                          <li key={i.classId} className="grid gap-1.5 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:gap-6">
                            <div>
                              <p className="text-sm font-medium text-ink">{cls.label}</p>
                              {cls.examples && <p className="mt-0.5 text-xs text-muted-2">{cls.examples}</p>}
                            </div>
                            <p className="text-sm leading-relaxed text-ink-3">{i.note}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </Panel>
                ))}
              </div>
            )}
          </Section>

          {/* Pregnancy */}
          <Section id="pregnancy" eyebrow="Pregnancy & breastfeeding" title="Status in pregnancy">
            <Panel className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-3">
                <Baby className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <Badge tone={PREGNANCY_TONE[compound.pregnancy.status]} size="md" dot>
                  {PREGNANCY_LABELS[compound.pregnancy.status]}
                </Badge>
                <p className="mt-3 text-sm leading-relaxed text-ink-3">{compound.pregnancy.note}</p>
              </div>
            </Panel>
          </Section>

          {/* Monitoring */}
          <Section
            id="monitoring"
            eyebrow="Monitoring"
            title="What is usually monitored"
            description="Parameters that trials and product information track. A clinician decides what applies to an individual."
          >
            <Panel>
              {compound.monitoring.length ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {compound.monitoring.map((m) => (
                    <li key={m} className="flex gap-3 rounded-xl bg-paper-2/70 p-3.5 text-sm leading-relaxed text-ink-3">
                      <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyNote>No monitoring parameters are recorded for this compound.</EmptyNote>
              )}
            </Panel>
          </Section>

          {/* Combinations */}
          <Section
            id="combinations"
            eyebrow="Combinations"
            title="What is known about combining it"
            description="Notes on pairing with other compounds in the directory: whether the combination has been studied in people, and where mechanisms overlap."
          >
            {compound.stackNotes.length === 0 ? (
              <Panel>
                <EmptyNote>No combination notes are recorded for {compound.name}.</EmptyNote>
              </Panel>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {compound.stackNotes.map((n) => {
                  const other = getCompound(n.with);
                  return (
                    <li key={n.with} className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-soft">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                          <Combine className="h-4 w-4 text-muted-2" aria-hidden />
                          {other ? (
                            <Link href={compoundHref(other.slug)} className="underline-offset-4 hover:underline">
                              {other.name}
                            </Link>
                          ) : (
                            <span>
                              {humaniseSlug(n.with)}
                              <span className="ml-2 font-sans text-xs text-muted-2">not yet in the directory</span>
                            </span>
                          )}
                        </h3>
                        <Badge tone={STACK_EVIDENCE_TONE[n.evidence]} size="xs" dot>
                          {STACK_EVIDENCE_LABELS[n.evidence]}
                        </Badge>
                      </div>
                      {n.overlap && (
                        <p className="mt-3 text-xs leading-relaxed text-muted">
                          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-2">Overlap · </span>
                          {n.overlap}
                        </p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-ink-3">{n.note}</p>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Discuss any proposed combination with a qualified healthcare professional.
            </p>
          </Section>

          {/* Source considerations */}
          <Section
            id="source"
            eyebrow="Source considerations"
            title="Supply, quality and legitimacy"
            description="How the compound reaches people in practice, and what that means for product quality."
          >
            <Panel>
              {compound.sourceConsiderations.length ? (
                <ul className="space-y-3">
                  {compound.sourceConsiderations.map((s) => (
                    <li key={s} className="flex gap-3 text-sm leading-relaxed text-ink-3">
                      <PackageSearch className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyNote>No source considerations are recorded for this compound.</EmptyNote>
              )}
            </Panel>
          </Section>

          {/* Clinician questions */}
          <Section
            id="questions"
            eyebrow="Questions for your clinician"
            title="Take these to your appointment"
            description="Specific to this compound. The personal assessment adds questions drawn from your own history and medicines."
          >
            <Panel>
              {compound.clinicianQuestions.length ? (
                <ol className="space-y-3">
                  {compound.clinicianQuestions.map((q, i) => (
                    <li key={q} className="flex gap-3 text-sm leading-relaxed text-ink-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 font-mono text-[0.65rem] font-medium text-brand-700">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyNote>No compound-specific questions are recorded.</EmptyNote>
              )}
              <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">
                <MessageCircleQuestionMark className="h-4 w-4 text-brand-600" aria-hidden />
                <span>
                  The <Link href={`/assessment/?compound=${compound.slug}`} className="font-medium text-brand-700 underline-offset-4 hover:underline">
                    personal assessment
                  </Link>{" "}
                  tailors this list to your responses.
                </span>
              </div>
            </Panel>
          </Section>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <Section
              id="alternatives"
              eyebrow="Alternatives"
              title="Compounds with stronger evidence or firmer regulatory footing"
              description="Listed for overlapping goals. Whether any is appropriate depends on your history — the assessment maps that for you."
            >
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {alternatives.map((a) => (
                  <li key={a.slug}>
                    <CompoundMiniCard compound={a} />
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* References */}
          <Section
            id="references"
            eyebrow="References"
            title="Sources behind this record"
            description="Regulator documents and peer-reviewed publications used to derive every grade and statement above."
          >
            <Panel>
              {compound.references.length ? (
                <ol className="space-y-3">
                  {compound.references.map((ref, i) => (
                    <li key={`${ref.label}-${i}`} className="flex gap-3 text-sm leading-relaxed">
                      <span className="w-6 shrink-0 font-mono text-xs text-muted-2">{i + 1}.</span>
                      {ref.url ? (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex flex-wrap items-center gap-1.5 text-ink-3 underline-offset-4 hover:text-ink hover:underline"
                        >
                          {ref.label}
                          <ExternalLink className="h-3 w-3 text-muted-2" aria-hidden />
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
              <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-muted">
                <ClipboardList className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-2" aria-hidden />
                <span>{DISCLAIMER_SHORT}</span>
              </p>
            </Panel>
          </Section>

          {/* Related */}
          {related.length > 0 && (
            <Section
              id="related"
              eyebrow="Related compounds"
              title={`More in ${FAMILY_LABELS[compound.family].toLowerCase()}`}
              description="Other compounds in the same family, graded on the same record."
            >
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <CompoundMiniCard compound={r} />
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- CTA */}
      <section className="container-x pb-4" aria-labelledby="detail-cta-title">
        <div className="bg-grain relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16">
          <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-2xl">
              <Eyebrow className="text-brand-300">Personal assessment</Eyebrow>
              <h2 id="detail-cta-title" className="mt-4 font-display text-3xl leading-[1.1] tracking-[-0.02em] text-balance sm:text-4xl">
                See how {compound.name} fits your profile
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-white/70">
                Seven minutes of structured questions about your goal, history and medicines, mapped against this record by a
                deterministic, clinician-reviewable rules engine. You get a report to take to a professional — not a prescription.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button href={`/assessment/?compound=${compound.slug}`} size="xl" variant="inverted">
                Start the assessment
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
              </Button>
              <Button href={compareHref([compound.slug])} size="xl" variant="ghost" className="text-white hover:bg-white/10">
                Compare with another
              </Button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
