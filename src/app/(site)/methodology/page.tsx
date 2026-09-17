import type { Metadata } from "next";
import Link from "next/link";
import { COMPOUNDS, getCompound } from "@/data/compounds";
import { PRODUCTS } from "@/data/products";
import { HUMAN_EVIDENCE_LABELS, JURISDICTION_LABELS, type HumanEvidenceLevel } from "@/data/types";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { SUITABILITY_LABELS } from "@/lib/engine/types";
import { VERDICT_LABELS } from "@/lib/match/types";
import { formatDate } from "@/lib/utils";
import {
  blendProducts,
  CHECKUP,
  CHECKUP_SHORT,
  latestReviewDate,
  NAMED_JURISDICTIONS,
  numberWord,
  pluralise,
  productCompoundSlugs,
} from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, NumberedRows, Prose, ProseH2, SpecSheet, TrustPage } from "@/components/marketing/page-shell";
import { EvidenceScale, RegulatoryScale, SuitabilityScale } from "@/components/marketing/scales";

const DESCRIPTION = `How ${BRAND.displayName} grades evidence, maintains regulatory status per jurisdiction, runs the rules engine and the deterministic product matcher behind the ${CHECKUP} — plus limitations, the store’s conflict of interest, update cadence and how to report an error.`;

export const metadata: Metadata = {
  title: "Methodology",
  description: DESCRIPTION,
  alternates: { canonical: "/methodology/" },
  openGraph: { images: OG_IMAGES, title: `Methodology · ${BRAND.displayName}`, description: DESCRIPTION, url: "/methodology/" },
};

const TOC = [
  { id: "principles", label: "Principles" },
  { id: "evidence", label: "Evidence grading" },
  { id: "regulatory", label: "Regulatory database" },
  { id: "engine", label: "Rules engine" },
  { id: "matcher", label: "Product matcher" },
  { id: "dosing", label: "Dose comparison" },
  { id: "blends", label: "Blends and stacks" },
  { id: "store", label: "The store and the grades" },
  { id: "limitations", label: "Limitations" },
  { id: "updates", label: "Update cadence" },
  { id: "errors", label: "Corrections" },
];

const LADDER: HumanEvidenceLevel[] = [
  "approved_medicine",
  "late_clinical",
  "early_clinical",
  "food_supplement",
  "cosmetic_topical",
  "preclinical_only",
];

const MATCHER_INPUTS: { title: string; meta: string; body: string }[] = [
  {
    title: "Goal",
    meta: "Primary",
    body: "Whether the pen is listed for the goal you chose. A pen not listed for your goal cannot be the match, however well it scores elsewhere.",
  },
  {
    title: "Focus",
    meta: "Sharpens",
    body: "The specific problem you picked — the landing-page symptom or the focus question — against the pen’s own problem statements. This is how the matcher separates two pens that share a goal, such as a repair blend from a skin-and-repair blend.",
  },
  {
    title: "Evidence",
    meta: "Weighted",
    body: "The compound’s evidence grade for your goal, read from the record. A higher grade scores higher, the grade is shown on the result, and “early” or “insufficient” is stated in words.",
  },
  {
    title: "Experience",
    meta: "Format",
    body: "Whether you have used an injectable before and how you feel about the format. Every pen in the range is pre-filled and dose-dial, so this mostly adds a review note rather than changing the pen.",
  },
  {
    title: "Safety verdict",
    meta: "Decisive",
    body: `The rules engine’s label for each compound in the pen. A Higher-concern label or a high-severity flag makes the verdict “${VERDICT_LABELS.not_recommended}” regardless of score; caution-level flags make it “${VERDICT_LABELS.match_with_review}”.`,
  },
];

export default function MethodologyPage() {
  const reviewed = latestReviewDate();
  const rangeSlugs = Array.from(new Set(PRODUCTS.flatMap((p) => productCompoundSlugs(p))));
  const withRecord = rangeSlugs.filter((slug) => getCompound(slug)).length;
  const blends = blendProducts();

  return (
    <TrustPage
      label="Methodology"
      meta={[pluralise(COMPOUNDS.length, "compound"), reviewed ? `Reviewed ${formatDate(reviewed, { month: "short" })}` : ""].filter(Boolean)}
      title="How the grades and the match are made — and what they cannot tell you."
      description="Every label on this site is derived from a structured field in a database we maintain by hand, and every match is derived from those labels by fixed rules. This page explains where the fields come from, how the engine and the matcher use them, and where the approach has limits — including the fact that we sell what we grade."
      toc={TOC}
      after={<CtaBand secondary={{ href: "/peptides", label: "Compound directory" }} />}
    >
      <Prose>
        <h2 id="principles">Principles</h2>
        <ul>
          <li>
            <strong>Structured, not generated.</strong> There is no language model anywhere in the pipeline. Reports and matches are assembled from
            database fields and fixed rules, so the same inputs always give the same output.
          </li>
          <li>
            <strong>Human evidence first.</strong> Animal and laboratory data never raise a grade above “Insufficient”. Marketing claims and anecdote are not
            evidence.
          </li>
          <li>
            <strong>Regulatory status is recorded, never inferred.</strong> If we have not confirmed a status from a regulator source, the entry says “Unclear”.
          </li>
          <li>
            <strong>The same grade whether or not we sell it.</strong> Grades are assigned to compounds, not pens, and a pen page shows the compound’s grade
            unchanged. The {numberWord(PRODUCTS.length)} pens are graded by the same criteria as the {COMPOUNDS.length - withRecord} compounds we do not sell.
          </li>
          <li>
            <strong>The matcher can return nothing.</strong> A match is a product of the rules, not a guarantee of one. When the rules rule everything out,
            the {CHECKUP_SHORT} says so.
          </li>
          <li>
            <strong>Clinician-reviewable.</strong> Every compound record lists its sources; every flag in a report names the answer that produced it; every
            match lists the reasons it was made.
          </li>
        </ul>
      </Prose>

      <ProseH2 id="evidence">Evidence grading</ProseH2>
      <Prose>
        <p>
          Each compound carries an evidence grade for <em>each goal</em> it has been studied for, and an <em>overall</em> grade for its most-researched
          use. The two are deliberately separate: a licensed medicine with strong evidence for one indication may have only limited evidence for the goal
          you care about, and the report shows both.
        </p>
      </Prose>
      <EvidenceScale className="mt-6" />
      <Prose>
        <h3>How a grade is assigned</h3>
        <p>
          We start from the highest-quality human evidence available for that goal: randomised controlled trials and regulator assessments first, then
          controlled human studies, then early-phase or observational human data. We consider size, duration, whether the population studied resembles
          people likely to use the site, whether the outcome measured is the one the goal describes, and whether findings have been replicated. Evidence
          for a related but different use — visceral fat when the goal is scale weight, for example — is graded “Limited” at most.
        </p>
        <h3>The human-evidence ladder</h3>
        <p>Alongside the grade, every compound is placed on a ladder that describes what kind of human evidence exists at all:</p>
        <ol>
          {LADDER.map((level) => (
            <li key={level}>{HUMAN_EVIDENCE_LABELS[level]}</li>
          ))}
        </ol>
        <p>
          The dosing studies quoted in reports and on compound pages are the ones that support the grade, with their citation, population, duration,
          amounts, outcomes and adverse events.
        </p>
      </Prose>

      <ProseH2 id="regulatory">Regulatory database</ProseH2>
      <Prose>
        <p>
          For each compound we record a status in {NAMED_JURISDICTIONS.length} jurisdictions — {NAMED_JURISDICTIONS.map((j) => JURISDICTION_LABELS[j]).join(", ")} —
          plus a general entry for other jurisdictions. Each entry has four parts: the status, a one-sentence summary, a longer explanation of the licensed
          indication and any caveats, and the date it was last reviewed.
        </p>
      </Prose>
      <RegulatoryScale className="mt-6" />
      <Prose>
        <h3>How it is maintained</h3>
        <ul>
          <li>
            Entries are written and updated by a person reading regulator sources — marketing authorisations, product information, safety communications
            and trial registries — not by software.
          </li>
          <li>
            The <strong>last-reviewed date</strong> is shown wherever a status appears. A status is never carried over from one jurisdiction to another or
            inferred from a compound’s class.
          </li>
          <li>
            The report uses the jurisdiction for the country you enter. Where that is not one of the {NAMED_JURISDICTIONS.length} named jurisdictions, it uses
            the general entry and tells you to check with your national regulator.
          </li>
          <li>
            Anti-doping status under the World Anti-Doping Code is recorded separately — prohibited at all times, in competition only, or not listed — and
            shown on compound pages, in comparisons, in reports and on the match.
          </li>
        </ul>
        <Note tone="alert" title="Status can change between reviews">
          Licensing decisions, shortages and safety communications happen between our reviews. Treat the date shown as part of the information and verify
          anything time-sensitive with your national regulator.
        </Note>
      </Prose>

      <ProseH2 id="engine">Rules engine</ProseH2>
      <Prose>
        <p>
          The engine takes your structured answers and each compound’s record and applies a fixed set of checks. It produces flags — each with a severity
          (note, caution or review required), a source (medical history, medication, pregnancy, dose, regulatory, stack and so on), a title and a
          plain-English detail — and then one of three suitability labels per compound.
        </p>
        <h3>The checks</h3>
        <ol>
          <li>
            <strong>Contraindications.</strong> Each condition you mark as current, previous or unsure is checked against the compound’s contraindication
            list, which grades every entry as absolute or caution. Unsure answers are carried into the report so a clinician can clarify them.
          </li>
          <li>
            <strong>Interactions.</strong> Each medicine you enter is matched to a class (insulin, anticoagulant, thyroid hormone and so on) and checked
            against the compound’s documented interactions, graded major, moderate or minor.
          </li>
          <li>
            <strong>Pregnancy, breastfeeding and age.</strong> Applied from the compound’s pregnancy field and the age you enter.
          </li>
          <li>
            <strong>Amount comparison</strong> and <strong>blend analysis</strong>, described below.
          </li>
          <li>
            <strong>Regulatory and anti-doping.</strong> Status for your country, and prohibited status where you compete in tested sport or your goal is
            athletic performance.
          </li>
          <li>
            <strong>Expectations, history and source.</strong> A timeframe shorter than trials measured, a previous adverse reaction, or treatment stopped for
            adverse effects each becomes a flag.
          </li>
        </ol>
        <h3>From flags to a label</h3>
      </Prose>
      <SuitabilityScale className="mt-4" />
      <Prose>
        <p>
          Where your answers identify factors that may make an option inappropriate, or that require professional assessment before proceeding, the label
          is <strong>{SUITABILITY_LABELS.higher_concern}</strong> — and the matcher will not land on a pen containing that compound. Where your goal overlaps
          the compound’s researched use, the label is <strong>{SUITABILITY_LABELS.potentially_relevant}</strong>, still with every identified factor listed.
          Where the record or your answers do not contain enough to assess, the label is <strong>{SUITABILITY_LABELS.insufficient_information}</strong>. The
          labels are not a ranking of how “good” a compound is and are not a clinical determination.
        </p>
      </Prose>

      <ProseH2 id="matcher">Product matcher</ProseH2>
      <Prose>
        <p>
          The matcher runs after the report and reads only two things: the report and the catalogue. It is deterministic — the same answers always land on
          the same pen — and it knows nothing about price, margin or stock. Each of the {numberWord(PRODUCTS.length)} pens is scored on five inputs, in
          this order of weight:
        </p>
      </Prose>
      <NumberedRows className="mt-6" items={MATCHER_INPUTS} />
      <Prose>
        <p>
          The output is a primary match (the best-scoring pen that is not ruled out), up to two alternatives, and the list of pens that were ruled out with
          the reason for each. The result routes you to the pen’s page, where the “Your match” panel shows the reasons, the evidence grade for your goal,
          the cautions to review and the price and lot — and adds nothing to your cart until you ask it to. Where nothing survives the safety verdict, or
          nothing in the range is listed for your goal, there is no primary match and the panel says so.
        </p>
        <Note tone="brand" title="What the score is not">
          The score orders pens; it is never shown as a number and it is not a measure of how likely a pen is to work. Only the evidence grade speaks to
          that, and for most of the range it says the human data is early or absent.
        </Note>
      </Prose>

      <Prose>
        <h2 id="dosing">Dose comparison</h2>
        <p>
          Dosing on this site is <strong>research information, not a recommendation</strong>. We report what published human studies used — population,
          duration, route, dose escalation, outcomes and adverse events — because that is the only honest basis for a conversation about amounts.
        </p>
        <p>
          If you enter an amount you are considering, the engine converts it to the same units as the study exposures on record and returns one verdict:
          within range, above range, below range, different frequency, different route, no human data to compare against, or not comparable. Where the
          verdict is above range or there are no human data, the report asks you to seek professional review before making a decision. We do not publish
          “protocols”, and pen pages state the amount in the pen, not what to dial.
        </p>
      </Prose>

      <Prose>
        <h2 id="blends">Blends and stacks</h2>
        <p>
          {blends.length > 0 ? `${blends.map((b) => b.name).join(" and ")} are blends.` : "Some pens combine more than one compound."} The report treats each
          component as a compound in its own right — its own record, grade, contraindications and interactions — and then checks each pair against the
          database’s stack notes: whether the combination has been studied in humans (studied, limited or none), whether two components act on the same
          pathway, and any overlapping considerations. It counts the evidence gaps and returns an uncertainty rating — low, moderate, moderate–high or
          high — with a plain-English summary. No blend in the range has human data as a combination, and the report says so rather than averaging the
          components into a grade that looks better than any of them.
        </p>
      </Prose>

      <Prose>
        <h2 id="store">The store and the grades</h2>
        <p>
          We sell {pluralise(PRODUCTS.length, "pen")} containing {pluralise(rangeSlugs.length, "compound")} from this database, and we have an interest in
          selling them. Three things keep that interest away from the grades.
        </p>
        <ul>
          <li>
            <strong>Grades attach to compounds, not pens.</strong> A pen page reads the compound record; it cannot carry a different grade, and the
            compound page is linked from every pen.
          </li>
          <li>
            <strong>Neither the engine nor the matcher knows what is in stock.</strong> Suitability labels are computed from your answers and the record;
            the match is computed from the labels and the catalogue’s goal and problem fields. Price, margin and stock are not inputs.
          </li>
          <li>
            <strong>The database is larger than the range.</strong> {COMPOUNDS.length - withRecord} of the {COMPOUNDS.length} compounds are ones we do not
            sell, graded by the same criteria, and the report names them where they are researched for your goal.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="limitations">Limitations</h2>
        <ul>
          <li>
            <strong>The assessment is only as complete as your answers.</strong> Categories are easier to evaluate than essays, but they cannot capture
            everything a clinician would ask. The completeness section tells you what was skipped or missing.
          </li>
          <li>
            <strong>Medicines are matched by class.</strong> A medicine we cannot match to a class is listed in your report for a clinician to review, but
            the engine cannot check it for interactions.
          </li>
          <li>
            <strong>Evidence grades are judgements</strong>, made consistently against written criteria, but judgements nonetheless. Two reviewers could
            reasonably differ at the boundary between grades.
          </li>
          <li>
            <strong>A match is a fit to the record, not a prediction.</strong> The matcher says which pen the evidence and your answers point to. It does
            not say the pen will do anything.
          </li>
          <li>
            <strong>Regulatory status has a review date.</strong> It may have changed since.
          </li>
          <li>
            <strong>Testing describes the pen, not the outcome.</strong> A certificate confirms identity, purity and endotoxin for a lot. It says nothing
            about whether the compound works or is safe in people; only the evidence grade speaks to that, and for most of the range it says “Insufficient”
            or “Limited”.
          </li>
          <li>
            <strong>It is not a substitute for a consultation.</strong> Nothing here diagnoses, treats or replaces professional advice.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="updates">Update cadence</h2>
        <p>
          Compound records and regulatory entries are reviewed on a rolling basis, and immediately when a regulator issues a safety communication, a
          licensing decision or a shortage notice that affects a compound in the range. Each record and each regulatory entry shows its own last-reviewed
          date.
        </p>
      </Prose>
      <SpecSheet
        items={[
          { label: "Compounds", value: pluralise(COMPOUNDS.length, "compound") },
          { label: "Jurisdictions", value: `${NAMED_JURISDICTIONS.length} named + other` },
          { label: "In the range", value: `${withRecord} of ${rangeSlugs.length} compounds with a record` },
          { label: "Pens scored", value: String(PRODUCTS.length) },
          { label: "Most recent review", value: reviewed ? formatDate(reviewed) : "—" },
        ]}
      />

      <Prose>
        <h2 id="errors">Corrections</h2>
        <p>
          If you believe a grade, a regulatory entry, a study citation, a rule or a match is wrong, email{" "}
          <a href={`mailto:${BRAND.supportEmail}?subject=Methodology%20correction`}>{BRAND.supportEmail}</a> with the compound or pen, the field and, ideally,
          the source you are relying on. Corrections are made to the database, so they reach the compound pages, pen pages, comparisons, matches and future
          reports at the same time. You can also read <Link href="/about">who we are</Link> and <Link href="/safety">how to use the site safely</Link>.
        </p>
      </Prose>
    </TrustPage>
  );
}
