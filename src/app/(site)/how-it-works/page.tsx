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
import {
  ASSESSMENT_MINUTES,
  NAMED_JURISDICTIONS,
  OPTIONAL_SECTION_COUNT,
  pluralise,
  REPORT_CONTENTS,
  SECTION_COUNT,
} from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, NumberedRows, Prose, ProseH2, SpecSheet, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION = `How the ${ASSESSMENT_MINUTES}-minute Peptide Checkup and the store fit together: the ${SECTION_COUNT} assessment sections, what the rules engine checks, how matches become a cart, what happens at checkout and what arrives in the box.`;

export const metadata: Metadata = {
  title: "How it works",
  description: DESCRIPTION,
  alternates: { canonical: "/how-it-works/" },
  openGraph: { images: OG_IMAGES, title: `How it works · ${BRAND.displayName}`, description: DESCRIPTION, url: "/how-it-works/" },
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "assessment", label: "01 · Assessment" },
  { id: "engine", label: "02 · Rules engine" },
  { id: "matches", label: "03 · Your matches" },
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
      meta={[`≈${ASSESSMENT_MINUTES} min · ${SECTION_COUNT} sections`, `${pluralise(PRODUCTS.length, "product")} · ${pluralise(COMPOUNDS.length, "compound")}`]}
      title="Assessment. Matches. Checkout. Certificate."
      description="The store has one front door: a structured assessment that checks your goal, history and medicines against the evidence, then lists the products that fit. This page follows an order from the first question to the box."
      toc={TOC}
      after={<CtaBand secondary={{ href: "/shop", label: "Skip to the shop" }} />}
    >
      <Prose>
        <h2 id="overview">Overview</h2>
        <p>
          {BRAND.displayName} sells batch-tested peptides. It also answers one question before you buy:{" "}
          <strong>given your goal, your history and your medicines, which compounds are worth discussing with a clinician — and which are not?</strong>{" "}
          Four parts do the work.
        </p>
        <ol>
          <li>
            <strong>A database</strong> of {pluralise(COMPOUNDS.length, "compound")}, each written to the same standard from regulator labels and
            peer-reviewed trials: mechanism, evidence for each goal, regulatory status in {NAMED_JURISDICTIONS.length} jurisdictions, published dosing
            studies, contraindications, interactions and pregnancy guidance.
          </li>
          <li>
            <strong>A structured assessment</strong> of {SECTION_COUNT} short sections that asks in categories — conditions, medicine classes, yes/no
            safety checks — because categories are what rules can evaluate reliably.
          </li>
          <li>
            <strong>A deterministic rules engine</strong> that maps your answers onto the database and produces a report. The same answers always give
            the same report, and every label can be traced to a field a clinician can inspect.
          </li>
          <li>
            <strong>A catalogue</strong> of {pluralise(PRODUCTS.length, "product")}, each linked to its compound record where one exists, each lot tested
            by an independent laboratory before it is listed.
          </li>
        </ol>
        <p>
          If you arrived from an advert, your goal is pre-selected from the landing page and recorded so the report can address it. You can change it in
          the first section.
        </p>
      </Prose>

      <ProseH2 id="assessment">01 · Assessment</ProseH2>
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
          Details that are easy to miss: the compound picker shows goal-relevant suggestions first and lets you record the dose you are considering; the
          conditions grid extends itself with any condition a selected compound lists as a contraindication; the safety screen shows compound-specific
          hints; and anyone under 18 is shown a full stop rather than a report.
        </p>
      </Prose>

      <Prose>
        <h2 id="engine">02 · Rules engine</h2>
        <p>A fixed set of checks — no language model, no free text. For each compound you are considering it evaluates:</p>
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
            <strong>Dose comparison</strong> — if you entered a dose, how it compares with exposures used in published human studies. Where there are no
            human data, it says so.
          </li>
          <li>
            <strong>Regulatory and anti-doping status</strong> for your country and, where relevant, your sport.
          </li>
          <li>
            <strong>Expectations, source and previous experience</strong> — unrealistic timeframes, unregulated sources and previous adverse reactions become flags.
          </li>
          <li>
            <strong>Stack analysis</strong> — for two or more compounds: combination evidence, overlapping mechanisms, evidence gaps and an uncertainty rating.
          </li>
        </ul>
        <p>
          The result per compound is one of three labels — <strong>{SUITABILITY_LABELS.potentially_relevant}</strong>,{" "}
          <strong>{SUITABILITY_LABELS.higher_concern}</strong> or <strong>{SUITABILITY_LABELS.insufficient_information}</strong> — with the rationale and every
          flag that contributed. The label is not a clinical determination; it describes whether your answers identified factors that warrant professional
          review. The <Link href="/methodology">methodology</Link> explains the grading in detail.
        </p>
      </Prose>

      <Prose>
        <h2 id="matches">03 · Your matches</h2>
        <p>
          After the suitability section, the report lists products. What it does with each one depends on the label its compound received — not on
          price, margin or stock.
        </p>
      </Prose>
      <NumberedRows
        className="mt-6"
        items={[
          {
            title: SUITABILITY_LABELS.potentially_relevant,
            body: "The linked product appears with its price and current lot. Research, supplement and cosmetic products add straight to the cart; prescription-only medicines show “Start consultation” instead, because they are supplied by a prescriber and pharmacy, not by us.",
          },
          {
            title: SUITABILITY_LABELS.higher_concern,
            body: "The product is not added to your cart. The report shows a “Not adding this to your cart” card that names the answer responsible and links to speaking to a clinician. The product page carries the same message.",
          },
          {
            title: SUITABILITY_LABELS.insufficient_information,
            body: "No product is shown until the assessment is complete enough to judge. The completeness section says which sections would change that.",
          },
        ]}
      />
      <Prose>
        <p>
          The report also lists two or three goal-matched products you did not consider, drawn from the same database, so the list is not limited to what
          you searched for.
          {checkupPromo && <> Completing the assessment unlocks the code <strong>CHECKUP10</strong> ({checkupPromo.label.replace(/ — .*$/, "").toLowerCase()}).</>}
        </p>
        <Note tone="brand" title="The rule">
          If your answers raise a flag, the report tells you not to buy — and we don’t add it to your cart. The report is the same whether you buy nothing
          or everything.
        </Note>
      </Prose>

      <Prose>
        <h2 id="checkout">04 · Checkout</h2>
        <p>
          The cart is standard: sizes, quantities, a promo field and totals with VAT included. Two things are not standard.
        </p>
        <ul>
          <li>
            <strong>Research-use acknowledgement.</strong> If the cart contains a research-channel product you must confirm you are 18 or over and that the
            product is for research use, not human consumption. The label is printed on the product page, in the cart, at checkout and on the vial.
          </li>
          <li>
            <strong>Prescription medicines are not in the cart.</strong> They go through the consultation route on the product page.
          </li>
        </ul>
        <p>
          Card details are handled by the payment provider and never touch this site. Orders are confirmed by email.
          {standard && (
            <>
              {" "}
              {standard.label} shipping is {formatMoney(standard.price)} ({standard.eta}) and free on orders of{" "}
              {formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true })} or more; UK orders placed before 2 pm on a working day are dispatched the same day.
            </>
          )}{" "}
          The <Link href="/shipping">shipping page</Link> has every option and the returns policy.
        </p>
      </Prose>

      <Prose>
        <h2 id="box">05 · In the box</h2>
        <ul>
          <li>
            <strong>The vial</strong>, labelled with the compound, the amount, the lot number and the research-use statement.
          </li>
          <li>
            <strong>The certificate of analysis</strong> for that lot: purity by HPLC, identity by LC-MS, endotoxin by LAL, the laboratory and the test date.
            The same certificate is published online against the lot number.
          </li>
          <li>
            <strong>Storage instructions</strong> — lyophilised peptides are stable at room temperature in transit and should be stored as the label says on
            arrival.
          </li>
        </ul>
        <p>
          Check that the lot number on the vial matches the certificate. If it does not, or anything about the package looks wrong, email{" "}
          <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a> before you use it. The <Link href="/lab-testing">lab-testing page</Link> explains
          how to read each figure.
        </p>
      </Prose>

      <ProseH2 id="report">What the report contains</ProseH2>
      <Prose>
        <p>
          The report is rendered directly from the engine’s output and nothing else. Sections appear in this order; the stack section appears only when you
          are considering more than one compound.
        </p>
      </Prose>
      <NumberedRows className="mt-6" items={REPORT_CONTENTS.map((item) => ({ title: item.title, body: item.body }))} />
      <Prose>
        <p>
          Every report ends with questions to ask a clinician, the monitoring a clinician would typically consider, an appendix of your answers, the full
          disclaimer, and the option to print or save.
        </p>
        <Note title="Dosing is research information, not a recommendation">
          The dosing section shows what published human studies used — population, duration, route, doses, outcomes and adverse events — and how a dose
          you are considering compares. It never tells you what to take, and neither does a product page.
        </Note>
      </Prose>

      <Prose>
        <h2 id="time">Time and saving progress</h2>
        <p>
          Most people finish in about {ASSESSMENT_MINUTES} minutes. It takes longer if you enter several compounds or a long list of medicines, and each of
          the {OPTIONAL_SECTION_COUNT} optional sections adds a minute or two — the report is better when you complete them.
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
          { label: "Where answers live", value: "Your browser only" },
        ]}
      />

      <Prose>
        <h2 id="after">After the report</h2>
        <ul>
          <li>
            <strong>Take it to an appointment.</strong> The questions section is specific to the compounds and flags in your report.
          </li>
          <li>
            <strong>Add what fits, or don’t.</strong> Matches carry the current lot and price. Nothing is added until you choose to add it.
          </li>
          <li>
            <strong>Compare the alternatives it names.</strong> The <Link href="/compare">compare tool</Link> puts evidence, regulatory status and dosing
            studies side by side, and every <Link href="/peptides">compound page</Link> lists its sources.
          </li>
        </ul>
      </Prose>
    </TrustPage>
  );
}
