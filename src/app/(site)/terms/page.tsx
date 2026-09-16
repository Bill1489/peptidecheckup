import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, OG_IMAGES, RESEARCH_USE_LABEL } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatDate } from "@/lib/utils";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, Prose, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION =
  "Terms for using Peptide Checkup and buying from it: educational content, research-use terms of sale, 18+, consultation products supplied by a partner prescriber, orders and pricing, returns, liability and the law of England and Wales.";

export const metadata: Metadata = {
  title: "Terms",
  description: DESCRIPTION,
  alternates: { canonical: "/terms/" },
  openGraph: { images: OG_IMAGES, title: `Terms · ${BRAND.displayName}`, description: DESCRIPTION, url: "/terms/" },
};

const LAST_UPDATED = "2026-09-15";

const TOC = [
  { id: "acceptance", label: "Agreement" },
  { id: "educational", label: "Educational content" },
  { id: "no-relationship", label: "No medical relationship" },
  { id: "research-sale", label: "Research-use terms of sale" },
  { id: "consultation", label: "Consultation products" },
  { id: "orders", label: "Orders, pricing and delivery" },
  { id: "returns", label: "Returns and faulty goods" },
  { id: "responsibilities", label: "Your responsibilities" },
  { id: "accuracy", label: "Accuracy and no warranty" },
  { id: "liability", label: "Limitation of liability" },
  { id: "ip", label: "Intellectual property" },
  { id: "changes", label: "Changes" },
  { id: "law", label: "Governing law" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <TrustPage
      label="Terms"
      meta={[`Updated ${formatDate(LAST_UPDATED)}`, BRAND.legalName]}
      title="Short terms, written to be read."
      description="Using this site or buying from it means agreeing to these terms. They make two things unambiguous: the content is educational, and research products are sold for research use only."
      toc={TOC}
      after={<CtaBand />}
    >
      <Prose>
        <h2 id="acceptance">Agreement</h2>
        <p>
          These terms govern your use of {BRAND.domain} and everything on it — compound pages, comparison tools, landing pages, the assessment and any
          report it generates, the shop and any order you place (together, “the site”). The site is operated by {BRAND.legalName} (“we”, “us”), a company
          registered in England and Wales. By using the site you agree to these terms and to the <Link href="/privacy">privacy notice</Link>. If you do not
          agree, please do not use the site.
        </p>
      </Prose>

      <Prose>
        <h2 id="educational">Educational content</h2>
        <p>
          Compound pages, comparisons, the assessment and the report provide educational information and a structured summary of published research and
          regulatory status. They are <strong>not medical advice</strong>. They do not diagnose, treat, cure or prevent any condition, and they do not
          recommend that you take, stop or combine any medicine, peptide or supplement. Suitability labels describe whether your responses identified
          factors that warrant professional review; they are not a clinical determination. Dosing information describes published research and is not a
          recommendation. Product pages describe the contents of the vial and its testing; they do not describe a use.
        </p>
        <Note tone="brand">
          Always consult a qualified healthcare professional before starting, stopping or combining any medicine, peptide or supplement. Never disregard or
          delay professional advice because of something you read here. If you have severe symptoms, call your local emergency number.
        </Note>
      </Prose>

      <Prose>
        <h2 id="no-relationship">No medical relationship</h2>
        <p>
          Using the site, generating a report, buying a product or requesting a consultation does not create a doctor–patient, pharmacist–patient or any
          other professional relationship between you and us. Any consultation arranged through the site is provided by the prescriber concerned under their
          own terms and professional obligations.
        </p>
      </Prose>

      <Prose>
        <h2 id="research-sale">Research-use terms of sale</h2>
        <blockquote>{RESEARCH_USE_LABEL}</blockquote>
        <p>Products labelled for research use are sold on the following conditions, which you accept at checkout:</p>
        <ul>
          <li>You are 18 years of age or over.</li>
          <li>
            You are purchasing the product for laboratory research and you will not administer it to any person or animal, sell or supply it for human
            consumption, or represent it as a medicine, supplement or cosmetic.
          </li>
          <li>
            You are responsible for complying with the laws that apply to you, including laws on purchasing, importing, holding and using such compounds
            where you live, and anti-doping rules if you compete in sport.
          </li>
          <li>You will handle, store and dispose of the product in accordance with the information supplied and good laboratory practice.</li>
        </ul>
        <p>
          Batch testing confirms the identity, purity and endotoxin level of a lot as stated on its certificate of analysis. It is not a representation
          that the product is safe or effective for any use in people, and it does not alter the product’s regulatory status. We may refuse or cancel any
          order that we believe breaches these conditions.
        </p>
      </Prose>

      <Prose>
        <h2 id="consultation">Consultation products</h2>
        <p>
          Prescription-only medicines shown on the site are never sold by us and cannot be added to the cart. Where a product page offers “Start
          consultation”, your details are passed to {COMMERCE.prescriberPartner}, an independent registered prescriber, who decides whether a prescription
          is appropriate under their own professional and legal obligations. Any medicine is dispensed by a registered pharmacy. The prescriber’s and the
          pharmacy’s terms, fees and privacy notices govern that consultation and supply; we are not party to the clinical decision and do not receive a fee
          per prescription.
        </p>
      </Prose>

      <Prose>
        <h2 id="orders">Orders, pricing and delivery</h2>
        <ul>
          <li>
            <strong>Prices</strong> are shown in pounds sterling and include VAT where applicable. Delivery charges are shown at checkout before you pay.
          </li>
          <li>
            <strong>Acceptance.</strong> Your order is an offer to buy. We accept it when we dispatch the goods and send the dispatch confirmation; until
            then we may decline it — for example where a product is out of stock, a price was displayed in error, or the research-use conditions do not
            appear to be met — and any payment taken will be refunded.
          </li>
          <li>
            <strong>Delivery.</strong> Dispatch and delivery estimates are estimates. Risk in the goods passes to you on delivery; title passes on payment
            in full. You are responsible for any import duties or restrictions at the destination.
          </li>
          <li>
            <strong>Errors.</strong> If a price or description is obviously wrong we will contact you before dispatch and you may cancel for a full refund.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="returns">Returns and faulty goods</h2>
        <p>
          Under the Consumer Contracts Regulations you may cancel most orders within 14 days of delivery for a refund. Sealed research peptides are
          temperature-sensitive and sealed for contamination control; they cannot be restocked once dispatched and are therefore excluded from
          change-of-mind returns, as the product page and checkout state before you buy. Supplies and accessories may be returned unopened within 14 days.
        </p>
        <p>
          If a product arrives damaged, is faulty, or does not match the certificate of analysis for its lot, tell us within 30 days of delivery with your
          order number and the lot number and we will replace it or refund it, including return postage. Nothing in these terms affects your statutory
          rights. The <Link href="/shipping">shipping and returns page</Link> has the practical detail.
        </p>
      </Prose>

      <Prose>
        <h2 id="responsibilities">Your responsibilities</h2>
        <ul>
          <li>You must be 18 or over to use the assessment or to buy from the site.</li>
          <li>
            Information you enter should be accurate and about you (or someone who has asked you to help them). The report is only as good as the answers.
          </li>
          <li>
            You may not use the site to sell or promote products, scrape or republish the database or catalogue at scale, attempt to interfere with its
            operation, or present its output as medical advice to others.
          </li>
          <li>Personal, non-commercial use of your own report — including printing it and sharing it with your clinician — is what it is for.</li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="accuracy">Accuracy and no warranty</h2>
        <p>
          We take care to write compound records from regulator labels and peer-reviewed trials, to date every regulatory entry, to test every lot before it
          is listed and to review the rules engine against its sources. Even so, evidence changes, regulatory status changes, records can contain errors,
          and the assessment cannot capture everything a clinician would ask.
        </p>
        <p>
          Except for the express statements on a product’s certificate of analysis and your statutory rights as a consumer, the site and its content are
          provided <strong>“as is” and “as available”</strong>, without warranties of any kind, express or implied, including as to accuracy, completeness,
          currency, fitness for a particular purpose or uninterrupted availability.
        </p>
      </Prose>

      <Prose>
        <h2 id="liability">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of, or reliance on, the site or any report,
          from any use of a research product contrary to its labelling, or from the actions of any professional or partner you engage through the site.
          Our total liability in connection with any order is limited to the price paid for that order. Nothing in these terms excludes or limits liability
          for death or personal injury caused by negligence, for fraud, for breach of terms implied by consumer law, or for anything else that cannot be
          excluded or limited under the law of England and Wales.
        </p>
      </Prose>

      <Prose>
        <h2 id="ip">Intellectual property</h2>
        <p>
          The site’s text, design, database structure, product illustrations, rules and code are owned by or licensed to {BRAND.legalName} and are
          protected by copyright and database rights. You may view, print and save pages and your own report for personal, non-commercial use, and quote
          short excerpts with attribution and a link. You may not copy, republish or redistribute the database or catalogue or substantial parts of them,
          or use the {BRAND.displayName} name or logo, without our written permission. Cited studies and regulator documents remain the property of their
          publishers.
        </p>
      </Prose>

      <Prose>
        <h2 id="changes">Changes</h2>
        <p>
          We may update these terms and the site from time to time. The date at the top shows when these terms last changed; material changes will be
          flagged on this page. The terms that apply to an order are the ones in force when you place it.
        </p>
      </Prose>

      <Prose>
        <h2 id="law">Governing law</h2>
        <p>
          These terms are governed by the law of <strong>England and Wales</strong>, and the courts of England and Wales have exclusive jurisdiction over any
          dispute arising from them, except that if you are a consumer resident elsewhere you may also rely on mandatory protections of your local law and
          bring proceedings in your local courts.
        </p>
      </Prose>

      <Prose>
        <h2 id="contact">Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>. See also the <Link href="/safety">safety page</Link>{" "}
          and the <Link href="/shipping">shipping and returns page</Link>.
        </p>
      </Prose>
    </TrustPage>
  );
}
