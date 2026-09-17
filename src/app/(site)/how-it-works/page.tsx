import type { Metadata } from "next";
import Link from "next/link";
import { COMPOUNDS } from "@/data/compounds";
import { GOALS } from "@/data/goals";
import { PRODUCTS } from "@/data/products";
import { SECTION_META, SECTION_ORDER } from "@/lib/assessment/types";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { SUITABILITY_LABELS } from "@/lib/engine/types";
import { VERDICT_LABELS } from "@/lib/match/types";
import {
  ASSESSMENT_MINUTES,
  blendProducts,
  CHECKUP,
  CHECKUP_SHORT,
  NAMED_JURISDICTIONS,
  numberWord,
  OPTIONAL_SECTION_COUNT,
  pluralise,
  REPORT_CONTENTS,
  SECTION_COUNT,
} from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, NumberedRows, Prose, ProseH2, SpecSheet, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION = `How the ${ASSESSMENT_MINUTES}-minute ${CHECKUP} and the ${BRAND.name} store fit together: the ${SECTION_COUNT} assessment sections, what the rules engine checks, how the matcher lands on a pen, what happens at checkout and what arrives in the box.`;

export const metadata: Metadata = {
  title: "How it works",
  description: DESCRIPTION,
  alternates: { canonical: "/how-it-works/" },
  openGraph: { images: OG_IMAGES, title: `How it works · ${BRAND.displayName}`, description: DESCRIPTION, url: "/how-it-works/" },
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "assessment", label: `01 · ${CHECKUP_SHORT}` },
  { id: "engine", label: "02 · Rules engine" },
  { id: "match", label: "03 · Your match" },
  { id: "checkout", label: "04 · Checkout" },
  { id: "box", label: "05 · In the box" },
  { id: "report", label: "What the report contains" },
  { id: "time", label: "Time and saving progress" },
  { id: "after", label: "After the report" },
];

const checkupPromo = COMMERCE.promoCodes.CHECKUP10;
const standard = COMMERCE.shippingOptions[0];

export default function HowItWorksPage() {
  return (
    <TrustPage
      label="How it works"
      meta={[`≈${ASSESSMENT_MINUTES} min · ${SECTION_COUNT} sections`, `${pluralise(PRODUCTS.length, "pen")} · ${pluralise(COMPOUNDS.length, "compound")}`]}
      title={`${CHECKUP_SHORT}. Match. Pen page. Checkout. Certificate.`}
      description={`The store has one front door: a structured assessment that checks your goal, history and medicines against the evidence, then lands on the one pen in the range that fits — or on none. This page follows the order from the first question to the box.`}
      toc={TOC}
      after={<CtaBand secondary={{ href: "/shop", label: "Skip to the range" }} />}
    >
      <Prose>
        <h2 id="overview">Overview</h2>
        <p>
          {BRAND.displayName} sells {numberWord(PRODUCTS.length)} pre-filled peptide pens. It also answers one question before you buy:{" "}
          <strong>given your goal, your history and your medicines, which pen — if any — is worth discussing with a clinician?</strong> Four parts do the
          work.
        </p>
        <ol>
          <li>
            <strong>A database</strong> of {pluralise(COMPOUNDS.length, "compound")}, each written to the same standard from regulator labels and
            peer-reviewed trials: mechanism, evidence for each goal, regulatory status in {NAMED_JURISDICTIONS.length} jurisdictions, published dosing
            studies, contraindications, interactions and pregnancy guidance. Every compound in the range has a record; blends have one per component.
          </li>
          <li>
            <strong>A structured assessment</strong> — the {CHECKUP} — of {SECTION_COUNT} short sections that asks in categories: conditions, medicine
            classes, yes/no safety checks. Categories are what rules can evaluate reliably.
          </li>
          <li>
            <strong>A deterministic rules engine and matcher</strong> that maps your answers onto the database, produces a report, and then scores the{" "}
            {numberWord(PRODUCTS.length)} pens against it. The same answers always give the same report and the same pen, and every label can be traced
            to a field a clinician can inspect.
          </li>
          <li>
            <strong>The range</strong>: {PRODUCTS.map((p) => p.name).join(", ")}. One format, every lot tested by an independent laboratory before it is
            listed, the certificate published against the lot number.
          </li>
        </ol>
        <p>
          If you arrived from an advert, your goal and the problem you came with are pre-selected from the landing page and recorded so the report
          can address them. You can change both in the first section.
        </p>
      </Prose>

      <ProseH2 id="assessment">01 · {CHECKUP_SHORT}</ProseH2>
      <Prose>
        <p>
          One focused screen per question group. Single-choice questions advance automatically; the {OPTIONAL_SECTION_COUNT} optional sections can be
          skipped, and the report says what it could not assess as a result.
        </p>
      </Prose>
      <NumberedRows
        className="mt-6"
        items={SECTION_ORDER.map((id) => ({
          title: SECTION_META[id].title,
          meta: SECTION_META[id].optional ? "Optional" : undefined,
          body: SECTION_META[id].description,
        }))}
      />
      <Prose>
        <p>
          Details that are easy to miss: the conditions grid extends itself with any condition a compound in the range lists as a contraindication; the
          safety screen shows compound-specific hints; you can record an amount you are considering and the report compares it with published study
          exposures; and anyone under 18 is shown a full stop rather than a report.
        </p>
      </Prose>

      <Prose>
        <h2 id="engine">02 · Rules engine</h2>
        <p>A fixed set of checks — no language model, no free text. For each compound in the range it evaluates:</p>
        <ul>
          <li>
            <strong>Goal alignment</strong> — whether the compound has human evidence for your goal, and at what grade on the five-point scale.
          </li>
          <li>
            <strong>Contraindications</strong> — your medical history against the compound’s documented absolute and caution-level contraindications.
          </li>
          <li>
            <strong>Interactions</strong> — the classes of medicine you take against the compound’s documented interactions, graded major, moderate or minor.
          </li>
          <li>
            <strong>Pregnancy, breastfeeding and age</strong> — with an immediate notice where relevant.
          </li>
          <li>
            <strong>Amount comparison</strong> — if you entered an amount, how it compares with exposures used in published human studies. Where there
            are no human data, it says so.
          </li>
          <li>
            <strong>Regulatory and anti-doping status</strong> for your country and, where relevant, your sport. Several compounds in the range are on
            the WADA Prohibited List; a tested athlete is never matched to them.
          </li>
          <li>
            <strong>Expectations, source and previous experience</strong> — unrealistic timeframes and previous adverse reactions become flags.
          </li>
          <li>
            <strong>Blend analysis</strong> — for {blendProducts().map((b) => b.name).join(" and ")}: combination evidence (there is none in people),
            overlapping mechanisms and an uncertainty rating.
          </li>
        </ul>
        <p>
          The result per compound is one of three labels — <strong>{SUITABILITY_LABELS.potentially_relevant}</strong>,{" "}
          <strong>{SUITABILITY_LABELS.higher_concern}</strong> or <strong>{SUITABILITY_LABELS.insufficient_information}</strong> — with the rationale and every
          flag that contributed. The label is not a clinical determination; it describes whether your answers identified factors that warrant professional
          review. The <Link href="/methodology">methodology</Link> explains the grading and the matcher in detail.
        </p>
      </Prose>

      <Prose>
        <h2 id="match">03 · Your match</h2>
        <p>
          The matcher takes the report and scores every pen in the range on five things: your goal, the specific problem you picked, the compound’s
          evidence grade for that goal, format and experience fit, and the safety verdict from the rules engine. It returns one of three verdicts per
          pen — not a ranking of how “good” a pen is, and never influenced by price, margin or stock.
        </p>
      </Prose>
      <NumberedRows
        className="mt-6"
        items={[
          {
            title: VERDICT_LABELS.match,
            body: `The best-scoring pen with no flags. You are taken to its page, where a “Your match” panel explains why it fits — goal, focus, evidence grade, format — and offers to add it to your cart. Up to two alternatives are listed underneath.`,
          },
          {
            title: VERDICT_LABELS.match_with_review,
            body: "The goal fits but your answers raised cautions. The panel lists exactly what to review with a clinician before you decide. You can still add the pen; the cautions travel with it into the report.",
          },
          {
            title: VERDICT_LABELS.not_recommended,
            body: `A Higher-concern label or a high-severity flag. The pen is not added to your cart, the panel names the answer responsible, and you are pointed to a clinician. Where every pen in the range is ruled out — or nothing is researched for your goal — the ${CHECKUP_SHORT} ends there and says so.`,
          },
        ]}
      />
      <Prose>
        <p>
          The report also lists the compounds researched for your goal that the matcher did not land on, drawn from the same database, so the result is
          never a single unexplained answer.
          {checkupPromo && <> Completing the {CHECKUP_SHORT} unlocks the code <strong>CHECKUP10</strong> ({checkupPromo.label.replace(/ — .*$/, "").toLowerCase()}).</>}
        </p>
        <Note tone="brand" title="The rule">
          If your answers raise a flag, the {CHECKUP_SHORT} says not this one — and nothing goes in your cart. The report is the same whether you buy
          nothing or everything.
        </Note>
      </Prose>

      <Prose>
        <h2 id="checkout">04 · Checkout</h2>
        <p>The cart is standard: pen count, a promo field and totals with VAT included. Two things are not standard.</p>
        <ul>
          <li>
            <strong>Research-use acknowledgement.</strong> Every pen in the range is a research-channel product, so you must confirm you are 18 or over
            and that the product is for research use, not human consumption. The label is printed on the pen page, in the cart, at checkout and on the
            carton.
          </li>
          <li>
            <strong>Nothing is added for you.</strong> The match panel offers; you add. A pen the {CHECKUP_SHORT} marked not recommended cannot be added
            from the result at all.
          </li>
        </ul>
        <p>
          Card details are handled by the payment provider and never touch this site. Orders are confirmed by email.
          {standard && (
            <>
              {" "}
              {standard.label} shipping is {formatMoney(standard.price)} ({standard.eta}) and free on orders of{" "}
              {formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })} or more; UK orders placed before 2 pm on a working day are dispatched the same day in
              insulated packaging.
            </>
          )}{" "}
          The <Link href="/shipping">shipping page</Link> has every option and the returns policy.
        </p>
      </Prose>

      <Prose>
        <h2 id="box">05 · In the box</h2>
        <ul>
          <li>
            <strong>The pen</strong>: 3 mL of solution in a pre-filled multi-dose pen with a numbered dial window, capped and sealed.
          </li>
          <li>
            <strong>The lot-numbered carton</strong>, printed with the compound, the amount, the lot number and the research-use statement.
          </li>
          <li>
            <strong>The certificate of analysis</strong> for that lot: purity by HPLC, identity by LC-MS, endotoxin by LAL — per component for blends —
            with the laboratory and the test date. The same certificate is published online against the lot number.
          </li>
          <li>
            <strong>A pen-needle compatibility note.</strong> The pens take standard pen needles; needles are not included unless the listing says so.
          </li>
        </ul>
        <p>
          Put the pen in the fridge (2–8 °C, never frozen) as soon as the parcel arrives and check that the lot number on the carton matches the
          certificate. If it does not, or anything about the package looks wrong, email{" "}
          <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a> before you use it. The <Link href="/lab-testing">lab-testing page</Link> explains
          how to read each figure.
        </p>
      </Prose>

      <ProseH2 id="report">What the report contains</ProseH2>
      <Prose>
        <p>
          The report is rendered directly from the engine’s output and nothing else. Sections appear in this order; the stack section appears for the
          blends and whenever more than one compound is in play.
        </p>
      </Prose>
      <NumberedRows className="mt-6" items={REPORT_CONTENTS.map((item) => ({ title: item.title, body: item.body }))} />
      <Prose>
        <p>
          Every report ends with questions to ask a clinician, the monitoring a clinician would typically consider, an appendix of your answers, the full
          disclaimer, and the option to print or save.
        </p>
        <Note title="Dosing is research information, not a recommendation">
          The dosing section shows what published human studies used — population, duration, route, amounts, outcomes and adverse events — and how an
          amount you are considering compares. It never tells you what to dial, and neither does a pen page.
        </Note>
      </Prose>

      <Prose>
        <h2 id="time">Time and saving progress</h2>
        <p>
          Most people finish in about {ASSESSMENT_MINUTES} minutes. It takes longer if you enter a long list of medicines, and each of the{" "}
          {OPTIONAL_SECTION_COUNT} optional sections adds a minute or two — the report and the match are better when you complete them.
        </p>
        <p>
          Progress is saved in your browser as you go. Choose <strong>Save &amp; exit</strong> at any point and a resume card appears on the assessment page
          when you return on the same device and browser. Before the report is generated you see a review screen where you can change any answer.
        </p>
      </Prose>
      <SpecSheet
        items={[
          { label: "Required sections", value: `${SECTION_COUNT - OPTIONAL_SECTION_COUNT} of ${SECTION_COUNT}` },
          { label: "Optional sections", value: `${OPTIONAL_SECTION_COUNT} · skippable` },
          { label: "Goals", value: `${GOALS.length}, including “Other”` },
          { label: "Pens scored", value: String(PRODUCTS.length) },
          { label: "Where answers live", value: "Your browser only" },
        ]}
      />

      <Prose>
        <h2 id="after">After the report</h2>
        <ul>
          <li>
            <strong>Take it to an appointment.</strong> The questions section is specific to the pen, the compounds inside it and the flags in your report.
          </li>
          <li>
            <strong>Add the pen, or don’t.</strong> The match carries the current lot and price. Nothing is added until you choose to add it.
          </li>
          <li>
            <strong>Read the record.</strong> Every <Link href="/peptides">compound page</Link> lists its sources, and the <Link href="/compare">compare tool</Link>{" "}
            puts evidence, regulatory status and dosing studies side by side — including for the components of a blend.
          </li>
        </ul>
      </Prose>
    </TrustPage>
  );
}
