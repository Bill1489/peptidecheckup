import type { Metadata } from "next";
import Link from "next/link";
import { COMPOUNDS } from "@/data/compounds";
import { HUMAN_EVIDENCE_LABELS, JURISDICTION_LABELS, type HumanEvidenceLevel } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { formatDate } from "@/lib/utils";
import { latestReviewDate, NAMED_JURISDICTIONS, pluralise } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { EvidenceScale, RegulatoryScale, SuitabilityScale } from "@/components/marketing/grades";
import { Callout, MetaStrip, Prose, ProseH2, TrustPage } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How Peptide Checkup grades evidence, maintains regulatory status per jurisdiction, and how the deterministic rules engine produces suitability labels — plus limitations, update cadence and how to report an error.",
  alternates: { canonical: "/methodology/" },
};

const TOC = [
  { id: "principles", label: "Principles" },
  { id: "evidence", label: "Evidence grading" },
  { id: "regulatory", label: "Regulatory status" },
  { id: "engine", label: "The rules engine" },
  { id: "dosing", label: "Dosing information" },
  { id: "limitations", label: "Limitations" },
  { id: "updates", label: "Update cadence" },
  { id: "errors", label: "Report an error" },
];

const LADDER: HumanEvidenceLevel[] = [
  "approved_medicine",
  "late_clinical",
  "early_clinical",
  "food_supplement",
  "cosmetic_topical",
  "preclinical_only",
];

export default function MethodologyPage() {
  const reviewed = latestReviewDate();

  return (
    <TrustPage
      eyebrow="Methodology"
      title="How the grades are made — and what they cannot tell you."
      description="Every label on this site is derived from a structured field in a database we maintain by hand. This page explains where those fields come from, how the rules engine uses them, and where the approach has limits."
      meta={reviewed ? `Database last reviewed ${formatDate(reviewed)} · ${pluralise(COMPOUNDS.length, "compound")}` : undefined}
      toc={TOC}
      after={<CtaBand />}
    >
      <Prose>
        <h2 id="principles">Principles</h2>
        <ul>
          <li>
            <strong>Structured, not generated.</strong> There is no language model anywhere in the pipeline. Reports are
            assembled from database fields and fixed rules, so the same inputs always give the same output.
          </li>
          <li>
            <strong>Human evidence first.</strong> Animal and laboratory data never raise a grade above “Insufficient”.
            Marketing claims and anecdote are not evidence.
          </li>
          <li>
            <strong>Regulatory status is recorded, never inferred.</strong> If we have not confirmed a status from a
            regulator source, the entry says “Unclear”.
          </li>
          <li>
            <strong>Nothing to sell.</strong> We do not sell compounds, link to vendors or take commission. That
            independence is what makes the grades worth reading.
          </li>
          <li>
            <strong>Clinician-reviewable.</strong> Every compound record lists its sources; every flag in a report names
            the answer that produced it.
          </li>
        </ul>
      </Prose>

      <ProseH2 id="evidence">Evidence grading</ProseH2>
      <Prose>
        <p>
          Each compound carries an evidence grade for <em>each goal</em> it has been studied for, and an{" "}
          <em>overall</em> grade for its most-researched use. The two are deliberately separate: a licensed medicine with
          strong evidence for one indication may have only limited evidence for the goal you care about, and the report
          shows you both.
        </p>
      </Prose>
      <div className="mt-6 rounded-2xl border border-line bg-white px-6 shadow-soft">
        <EvidenceScale />
      </div>
      <Prose>
        <h3>How a grade is assigned</h3>
        <p>
          We start from the highest-quality human evidence available for that goal: randomised controlled trials and
          regulator assessments first, then controlled human studies, then early-phase or observational human data. We
          consider size, duration, whether the population studied resembles people likely to use the site, whether the
          outcome measured is the one the goal describes, and whether findings have been replicated. Evidence for a
          related but different use — for example weight loss when the goal is body composition — is graded as
          “Limited” at most.
        </p>
        <h3>The human-evidence ladder</h3>
        <p>
          Alongside the grade, every compound is placed on a ladder that describes what kind of human evidence exists at
          all:
        </p>
        <ol>
          {LADDER.map((level) => (
            <li key={level}>{HUMAN_EVIDENCE_LABELS[level]}</li>
          ))}
        </ol>
        <p>
          The dosing studies quoted in reports and on compound pages are the ones that support the grade, with their
          citation, population, duration, doses, outcomes and adverse events.
        </p>
      </Prose>

      <ProseH2 id="regulatory">Regulatory status</ProseH2>
      <Prose>
        <p>
          For each compound we record a status in {NAMED_JURISDICTIONS.length} jurisdictions —{" "}
          {NAMED_JURISDICTIONS.map((j) => JURISDICTION_LABELS[j]).join(", ")} — plus a general entry for other
          jurisdictions. Each entry has four parts: the status, a one-sentence summary, a longer explanation of the
          licensed indication and any caveats, and the date it was last reviewed.
        </p>
      </Prose>
      <div className="mt-6 rounded-2xl border border-line bg-white px-6 shadow-soft">
        <RegulatoryScale />
      </div>
      <Prose>
        <h3>How it is maintained</h3>
        <ul>
          <li>
            Entries are written and updated by a person reading regulator sources — marketing authorisations, product
            information, safety communications and trial registries — not by software.
          </li>
          <li>
            The <strong>last-reviewed date</strong> is shown wherever a status appears. A status is never carried over
            from one jurisdiction to another or inferred from a compound’s class.
          </li>
          <li>
            The report uses the jurisdiction for the country you enter. Where the country is not one of the{" "}
            {NAMED_JURISDICTIONS.length} named jurisdictions, it uses the general entry and tells you to check with your
            national regulator.
          </li>
          <li>
            Anti-doping status under the World Anti-Doping Code is recorded separately — prohibited at all times, in
            competition only, or not listed — and shown on compound pages, in comparisons and in reports.
          </li>
        </ul>
        <Callout tone="warn" title="Status can change between reviews">
          Licensing decisions, shortages and safety communications happen between our reviews. Treat the date shown as
          part of the information and verify anything time-sensitive with your national regulator.
        </Callout>
      </Prose>

      <ProseH2 id="engine">The rules engine</ProseH2>
      <Prose>
        <p>
          The engine takes your structured answers and each compound’s record and applies a fixed set of checks. It
          produces flags — each with a severity (note, caution or review required), a source (medical history,
          medication, pregnancy, dose, regulatory, stack and so on), a title and a plain-English detail — and then one
          of three suitability labels per compound.
        </p>
        <h3>The checks</h3>
        <ol>
          <li>
            <strong>Contraindications.</strong> Each condition you mark as current, previous or unsure is checked against
            the compound’s contraindication list, which grades every entry as absolute or caution. Unsure answers are
            carried into the report so a clinician can clarify them.
          </li>
          <li>
            <strong>Interactions.</strong> Each medicine you enter is matched to a class (insulin, anticoagulant, thyroid
            hormone and so on) and checked against the compound’s documented interactions, graded major, moderate or
            minor. Over-the-counter medicines and supplements you list appear in the report for review.
          </li>
          <li>
            <strong>Pregnancy, breastfeeding and age.</strong> Applied from the compound’s pregnancy field and the age
            you enter.
          </li>
          <li>
            <strong>Dose comparison.</strong> If you enter a dose, it is compared with the exposure ranges from the
            compound’s human studies: within range, above, below, different frequency, different route, or no human
            data to compare against.
          </li>
          <li>
            <strong>Regulatory and anti-doping.</strong> Status for your country, and prohibited status where your goal
            is athletic performance.
          </li>
          <li>
            <strong>Expectations, history and source.</strong> A timeframe shorter than trials measured, a previous
            adverse reaction, treatment stopped for adverse effects, or an unregulated source each becomes a flag.
          </li>
          <li>
            <strong>Stack analysis</strong> for two or more compounds: whether the pair has been studied together,
            overlapping mechanisms and considerations, duplicated pathways, evidence gaps and an overall uncertainty
            rating.
          </li>
        </ol>
        <h3>From flags to a label</h3>
      </Prose>
      <div className="mt-4 rounded-2xl border border-line bg-white px-6 shadow-soft">
        <SuitabilityScale />
      </div>
      <Prose>
        <p>
          Where your answers identify factors that may make an option inappropriate, or that require professional
          assessment before proceeding, the label is <strong>Higher concern</strong>. Where your goal overlaps the
          compound’s intended or researched use, the label is <strong>Potentially relevant</strong> — still with every
          identified factor listed, and still to be discussed with a clinician. Where the record or your answers do not
          contain enough to assess, the label is <strong>Insufficient information</strong>, and the completeness section
          of the report says what would change that. The labels are not a ranking of how “good” a compound is; they
          describe what your answers identified, and they are not a clinical determination.
        </p>
      </Prose>

      <Prose>
        <h2 id="dosing">Dosing information</h2>
        <p>
          Dosing on this site is <strong>research information, not a recommendation</strong>. We report what published
          human studies used — population, duration, route, dose escalation, outcomes and adverse events — because that
          is the only honest basis for a conversation about dose. We do not publish “protocols”, and the report will not
          suggest a dose. Where a dose you are considering falls outside study exposures, the report says so and asks you
          to seek professional review before making a decision.
        </p>
      </Prose>

      <Prose>
        <h2 id="limitations">Limitations</h2>
        <ul>
          <li>
            <strong>The assessment is only as complete as your answers.</strong> Categories are easier to evaluate than
            essays, but they cannot capture everything a clinician would ask. The completeness section tells you what
            was skipped or missing.
          </li>
          <li>
            <strong>Medicines are matched by class.</strong> A medicine we cannot match to a class is listed in your
            report for a clinician to review, but the engine cannot check it for interactions.
          </li>
          <li>
            <strong>Evidence grades are judgements</strong>, made consistently against written criteria, but judgements
            nonetheless. Two reviewers could reasonably differ at the boundary between grades.
          </li>
          <li>
            <strong>Regulatory status has a review date.</strong> It may have changed since.
          </li>
          <li>
            <strong>Unregulated products are unknowable.</strong> For compounds sold outside any licence we cannot say
            what is in the vial; the report can only describe what the studied compound did.
          </li>
          <li>
            <strong>It is not a substitute for a consultation.</strong> Nothing here diagnoses, treats or replaces
            professional advice.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="updates">Update cadence</h2>
        <p>
          Compound records and regulatory entries are reviewed on a rolling basis, and immediately when a regulator issues
          a safety communication, a licensing decision or a shortage notice that affects a listed compound. Each record
          and each regulatory entry shows its own last-reviewed date; the most recent across the database is shown in
          the site footer.
        </p>
      </Prose>
      <MetaStrip
        items={[
          { label: "Compounds", value: pluralise(COMPOUNDS.length, "compound") },
          { label: "Jurisdictions", value: `${NAMED_JURISDICTIONS.length} named + other` },
          { label: "Most recent review", value: reviewed ? formatDate(reviewed) : "—" },
        ]}
      />

      <Prose>
        <h2 id="errors">Report an error</h2>
        <p>
          If you believe a grade, a regulatory entry, a study citation or a rule is wrong, email{" "}
          <a href={`mailto:${BRAND.supportEmail}?subject=Methodology%20correction`}>{BRAND.supportEmail}</a> with the
          compound, the field and, ideally, the source you are relying on. Corrections are made to the database, so
          they reach the compound pages, comparisons and future reports at the same time. You can also read{" "}
          <Link href="/about">who we are</Link> and <Link href="/safety">how to use the site safely</Link>.
        </p>
      </Prose>
    </TrustPage>
  );
}
