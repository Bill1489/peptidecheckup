import type { Metadata } from "next";
import Link from "next/link";
import { GOALS } from "@/data/goals";
import { COMPOUNDS } from "@/data/compounds";
import { SECTION_META, SECTION_ORDER } from "@/lib/assessment/types";
import { BRAND } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import {
  ASSESSMENT_MINUTES,
  NAMED_JURISDICTIONS,
  OPTIONAL_SECTION_COUNT,
  pluralise,
  REPORT_CONTENTS,
  SECTION_COUNT,
} from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Callout, MetaStrip, Prose, ProseH2, TrustPage } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "How it works",
  description: `How the ${ASSESSMENT_MINUTES}-minute Peptide Checkup works end to end: the ${SECTION_COUNT} sections, what the rules engine checks, what the report contains, how long it takes and where your data lives.`,
  alternates: { canonical: "/how-it-works/" },
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "sections", label: `The ${SECTION_COUNT} sections` },
  { id: "engine", label: "What the engine checks" },
  { id: "report", label: "What the report contains" },
  { id: "time", label: "Time and saving progress" },
  { id: "privacy", label: "Privacy" },
  { id: "after", label: "After the report" },
];

export default function HowItWorksPage() {
  return (
    <TrustPage
      eyebrow="How it works"
      title="From a question to a report you can take to a clinician."
      description="The whole thing runs in your browser: structured questions, a deterministic rules engine and a maintained database. Here is exactly what happens at each step."
      meta={`≈${ASSESSMENT_MINUTES} minutes · ${SECTION_COUNT} sections · no account`}
      toc={TOC}
      after={<CtaBand />}
    >
      <Prose>
        <h2 id="overview">Overview</h2>
        <p>
          {BRAND.displayName} answers one question well: <strong>given your goal, your history and your medicines, which
          peptides are worth discussing with a clinician — and which are not?</strong> It does this in three parts.
        </p>
        <ol>
          <li>
            <strong>A database</strong> of {pluralise(COMPOUNDS.length, "compound")}, each written to the same standard from
            regulator labels and peer-reviewed trials: mechanism, evidence for each goal, regulatory status in{" "}
            {NAMED_JURISDICTIONS.length} jurisdictions, published dosing studies, contraindications, interactions,
            pregnancy guidance and sources.
          </li>
          <li>
            <strong>A structured assessment</strong> of {SECTION_COUNT} short sections. It asks in categories — conditions,
            medicine classes, yes/no safety checks — because categories are what the rules can evaluate reliably.
          </li>
          <li>
            <strong>A deterministic rules engine</strong> that maps your answers onto the database and produces a
            report. The same answers always produce the same report, and every label in it can be traced to a field a
            clinician can inspect.
          </li>
        </ol>
        <p>
          If you arrived from an advert, your goal is pre-selected from the landing page and recorded so the report can
          address it directly. You can change it in the first section.
        </p>
      </Prose>

      <ProseH2 id="sections">The {SECTION_COUNT} sections</ProseH2>
      <Prose>
        <p>
          One focused screen per question group. Single-choice questions advance automatically; optional sections can be
          skipped, and the report will say what it could not assess as a result.
        </p>
      </Prose>
      <ol className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
        {SECTION_ORDER.map((id, i) => {
          const meta = SECTION_META[id];
          return (
            <li key={id} className="flex gap-4 p-5">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-2 font-mono text-xs text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-sans text-[1.02rem] font-medium text-ink [font-variation-settings:normal]">{meta.title}</h3>
                  {meta.optional && (
                    <Badge tone="outline" size="xs">
                      Optional
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{meta.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <Prose>
        <p>
          A few things the sections do that are easy to miss: the compound picker shows goal-relevant suggestions first
          and lets you record the dose you are considering; the conditions grid extends itself with any condition a
          selected compound lists as a contraindication; the safety screen shows compound-specific hints (for an
          incretin medicine, for example, it mentions thyroid cancer history and pancreatitis); and anyone under 18 is
          shown a respectful full stop rather than a report.
        </p>
      </Prose>

      <Prose>
        <h2 id="engine">What the engine checks</h2>
        <p>
          The rules engine is a fixed set of checks — no language model, no free-text generation. For each compound you
          are considering it evaluates:
        </p>
        <ul>
          <li>
            <strong>Goal alignment</strong> — whether the compound has any human evidence for your goal, and at what grade
            on the five-point scale.
          </li>
          <li>
            <strong>Contraindications</strong> — your medical history against the compound’s documented absolute and
            caution-level contraindications.
          </li>
          <li>
            <strong>Interactions</strong> — the classes of medicine you take against the compound’s documented
            interactions, graded major, moderate or minor.
          </li>
          <li>
            <strong>Pregnancy, breastfeeding and age</strong> — with an immediate notice where relevant.
          </li>
          <li>
            <strong>Dose comparison</strong> — if you entered a dose, how it compares with exposures used in published
            human studies: within, above or below, or a different route or frequency. Where there are no human data, it
            says so.
          </li>
          <li>
            <strong>Regulatory status and anti-doping status</strong> for your country and, where relevant, your sport.
          </li>
          <li>
            <strong>Expectations, source and previous experience</strong> — unrealistic timeframes, unregulated sources
            and previous adverse reactions become flags.
          </li>
          <li>
            <strong>Stack analysis</strong> — for two or more compounds: whether the combination has been studied,
            overlapping mechanisms, evidence gaps and an overall uncertainty rating.
          </li>
        </ul>
        <p>
          The result for each compound is one of three suitability labels — <strong>Potentially relevant</strong>,{" "}
          <strong>Higher concern</strong> or <strong>Insufficient information</strong> — with the rationale and every
          flag that contributed. The label is not a clinical determination; it describes whether your answers identified
          factors that warrant professional review. The <Link href="/methodology">methodology page</Link> explains the
          grading in detail.
        </p>
      </Prose>

      <ProseH2 id="report">What the report contains</ProseH2>
      <Prose>
        <p>
          The report is rendered directly from the engine’s output and nothing else. Sections appear in this order;
          the stack section appears only when you are considering more than one compound.
        </p>
      </Prose>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {REPORT_CONTENTS.map((item, i) => (
          <li key={item.title} className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted-2">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 font-sans text-[1rem] font-medium text-ink [font-variation-settings:normal]">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ol>
      <Prose>
        <p>
          Every report ends with the questions to ask a clinician, the monitoring a clinician would typically consider,
          an appendix of the answers you gave, the full disclaimer, and two actions: print or save, and request a
          clinician review.
        </p>
        <Callout tone="brand" title="Dosing is research information, not a recommendation">
          The dosing section shows what published human studies used — population, duration, route, doses, outcomes
          and adverse events — and how a dose you are considering compares. It never tells you what to take. Where a
          comparison raises concern, the report says: this requires professional review before you make a decision.
        </Callout>
      </Prose>

      <Prose>
        <h2 id="time">Time and saving progress</h2>
        <p>
          Most people finish in about {ASSESSMENT_MINUTES} minutes. It takes longer if you enter several compounds or a
          long list of medicines, and each of the {OPTIONAL_SECTION_COUNT} optional sections adds a minute or two if you
          choose to complete them — the report is better when you do.
        </p>
        <p>
          Progress is saved in your browser as you go. Choose <strong>Save &amp; exit</strong> at any point and you will
          find a resume card on the assessment page when you come back on the same device and browser. Before the
          report is generated you see a review screen where you can change any answer.
        </p>
      </Prose>
      <MetaStrip
        items={[
          { label: "Required sections", value: `${SECTION_COUNT - OPTIONAL_SECTION_COUNT} of ${SECTION_COUNT}` },
          { label: "Optional sections", value: `${OPTIONAL_SECTION_COUNT} · skippable` },
          { label: "Goals available", value: `${GOALS.length}, including “Other”` },
        ]}
      />

      <Prose>
        <h2 id="privacy">Privacy</h2>
        <p>
          There is no account and no server. Your answers are stored only in your browser’s local storage so you can
          pause and resume; the report is generated on your device. Nothing is transmitted unless you explicitly request
          a clinician review and provide an email address, and that consent is asked for separately. To delete
          everything, choose <strong>Start over</strong> or clear this site’s data in your browser. The{" "}
          <Link href="/privacy">privacy notice</Link> has the full detail.
        </p>
      </Prose>

      <Prose>
        <h2 id="after">After the report</h2>
        <p>Three things are worth doing with it.</p>
        <ul>
          <li>
            <strong>Take it to an appointment.</strong> It is written for that: the questions section is specific to the
            compounds and flags in your report.
          </li>
          <li>
            <strong>Compare the alternatives it names.</strong> The <Link href="/compare">compare tool</Link> puts evidence,
            regulatory status and dosing studies side by side.
          </li>
          <li>
            <strong>Read the compound pages.</strong> Each one lists its sources, so you and your clinician can check the
            underlying trials and labels.
          </li>
        </ul>
      </Prose>
    </TrustPage>
  );
}
