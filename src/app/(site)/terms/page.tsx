import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { BRAND, OG_IMAGES, RESEARCH_USE_LABEL } from "@/lib/brand";
import { formatDate } from "@/lib/utils";
import { CHECKUP, CHECKUP_SHORT, numberWord } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, Prose, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION = `Terms for using ${BRAND.displayName} and buying ${BRAND.range.name} pens: educational content, research-use terms of sale for pre-filled pens, 18+, orders and pricing, cold-chain returns, liability and the law of England and Wales.`;

export const metadata: Metadata = {
  title: "Terms",
  description: DESCRIPTION,
  alternates: { canonical: "/terms/" },
  openGraph: { images: OG_IMAGES, title: `Terms · ${BRAND.displayName}`, description: DESCRIPTION, url: "/terms/" },
};

const LAST_UPDATED = "2026-09-16";

const TOC = [
  { id: "acceptance", label: "Agreement" },
  { id: "educational", label: "Educational content" },
  { id: "no-relationship", label: "No medical relationship" },
  { id: "research-sale", label: "Research-use terms of sale" },
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
      description="Using this site or buying from it means agreeing to these terms. They make two things unambiguous: the content is educational, and the pens are sold for research use only."
      toc={TOC}
      after={<CtaBand />}
    >
      <Prose>
        <h2 id="acceptance">Agreement</h2>
        <p>
          These terms govern your use of {BRAND.domain} and everything on it — compound pages, comparison tools, landing pages, the {CHECKUP} and any
          report or match it generates, the shop and any order you place (together, “the site”). The site is operated by{" "}
          {BRAND.legalName} (“we”, “us”), a company registered in England and Wales and an independent stockist of pens manufactured by{" "}
          {BRAND.range.name}. By using the site you agree to these terms and to the{" "}
          <Link href="/privacy">privacy notice</Link>. If you do not agree, please do not use the site.
        </p>
      </Prose>

      <Prose>
        <h2 id="educational">Educational content</h2>
        <p>
          Compound pages, comparisons, the {CHECKUP_SHORT}, the report and the match provide educational information and a structured summary of
          published research and regulatory status. They are <strong>not medical advice</strong>. They do not diagnose, treat, cure or prevent any
          condition, and they do not recommend that you take, stop or combine any medicine, peptide or supplement. Suitability labels describe whether
          your responses identified factors that warrant professional review; they are not a clinical determination. A match describes a fit between your
          answers and a product record; it is not a prediction of any outcome. Dosing information describes published research and is not a
          recommendation. Pen pages describe the contents of the pen and its testing; they do not describe a use.
        </p>
        <Note tone="brand">
          Always consult a qualified healthcare professional before starting, stopping or combining any medicine, peptide or supplement. Never disregard or
          delay professional advice because of something you read here. If you have severe symptoms, call your local emergency number.
        </Note>
      </Prose>

      <Prose>
        <h2 id="no-relationship">No medical relationship</h2>
        <p>
          Using the site, generating a report or a match, or buying a pen does not create a doctor–patient, pharmacist–patient or any other professional
          relationship between you and us. We offer no consultation service and sell no prescription-only medicines. Where the site suggests you speak to
          a clinician, that is a recommendation to seek independent professional advice, not an introduction to a professional.
        </p>
      </Prose>

      <Prose>
        <h2 id="research-sale">Research-use terms of sale</h2>
        <blockquote>{RESEARCH_USE_LABEL}</blockquote>
        <p>
          All {numberWord(PRODUCTS.length)} pens in the range are supplied for research use. They are sold on the following conditions, which you accept
          at checkout:
        </p>
        <ul>
          <li>You are 18 years of age or over.</li>
          <li>
            You are purchasing the pen for laboratory research and you will not administer its contents to any person or animal, sell or supply it for
            human consumption, or represent it as a medicine, supplement or cosmetic.
          </li>
          <li>
            You are responsible for complying with the laws that apply to you, including laws on purchasing, importing, holding and using such compounds
            where you live, and anti-doping rules if you compete in sport.
          </li>
          <li>
            You will store the pen as stated on the carton and the product page (refrigerated, not frozen), handle and dispose of it and any pen needles
            in accordance with the information supplied and good laboratory practice.
          </li>
        </ul>
        <p>
          Lot testing confirms the identity, purity and endotoxin level of a lot — per component for blends — as stated on its certificate of analysis. It
          is not a representation that the product is safe or effective for any use in people, and it does not alter the product’s regulatory status. Pen
          needles are not included unless the listing states otherwise. We may refuse or cancel any order that we believe breaches these conditions.
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
            then we may decline it — for example where a pen is out of stock, a price was displayed in error, or the research-use conditions do not appear
            to be met — and any payment taken will be refunded.
          </li>
          <li>
            <strong>Delivery.</strong> Pens are dispatched in insulated packaging. Dispatch and delivery estimates are estimates. Risk in the goods passes
            to you on delivery; title passes on payment in full. You are responsible for refrigerating the pen on arrival and for any import duties or
            restrictions at the destination.
          </li>
          <li>
            <strong>Errors.</strong> If a price or description is obviously wrong we will contact you before dispatch and you may cancel for a full refund.
          </li>
          <li>
            <strong>The match is not a term of sale.</strong> A {CHECKUP_SHORT} result does not oblige you to buy, and buying does not require a result. A
            pen the {CHECKUP_SHORT} marked not recommended cannot be added to the cart from the result; that does not amount to advice about any other
            purchase.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="returns">Returns and faulty goods</h2>
        <p>
          You may return an <strong>unopened pen with the seal intact within 14 days of delivery</strong> for a refund. Opened pens cannot be returned:
          once the seal is broken neither sterility nor the cold chain can be verified, and the product cannot be restocked. The pen page and the checkout
          state this before you buy. Return postage is paid by you unless the pen was faulty or sent in error.
        </p>
        <p>
          If a pen arrives damaged, warm, with a broken seal, or does not match the certificate of analysis for its lot, tell us within 30 days of
          delivery with your order number and the lot number and we will replace it or refund it, including return postage where we ask for the pen back.
          Nothing in these terms affects your statutory rights. The <Link href="/shipping">shipping and returns page</Link> has the practical detail.
        </p>
      </Prose>

      <Prose>
        <h2 id="responsibilities">Your responsibilities</h2>
        <ul>
          <li>You must be 18 or over to use the {CHECKUP_SHORT} or to buy from the site.</li>
          <li>
            Information you enter should be accurate and about you (or someone who has asked you to help them). The report and the match are only as good
            as the answers.
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
          is listed and to review the rules engine and the matcher against their sources. Even so, evidence changes, regulatory status changes, records can
          contain errors, and the {CHECKUP_SHORT} cannot capture everything a clinician would ask.
        </p>
        <p>
          Except for the express statements on a lot’s certificate of analysis and your statutory rights as a consumer, the site and its content are
          provided <strong>“as is” and “as available”</strong>, without warranties of any kind, express or implied, including as to accuracy, completeness,
          currency, fitness for a particular purpose or uninterrupted availability.
        </p>
      </Prose>

      <Prose>
        <h2 id="liability">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of, or reliance on, the site, any report
          or any match, or from any use of a pen contrary to its labelling. Our total liability in connection with any order is limited to the price paid
          for that order. Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, for fraud, for breach of
          terms implied by consumer law, or for anything else that cannot be excluded or limited under the law of England and Wales.
        </p>
      </Prose>

      <Prose>
        <h2 id="ip">Intellectual property</h2>
        <p>
          The site’s text, design, database structure, product photography, the {BRAND.name} name and wordmark, rules and code are owned by or licensed to{" "}
          {BRAND.legalName} and are protected by copyright, trade-mark and database rights. You may view, print and save pages and your own report for
          personal, non-commercial use, and quote short excerpts with attribution and a link. You may not copy, republish or redistribute the database,
          the catalogue or the photographs, or substantial parts of them, or use the {BRAND.name} name or logo, without our written permission. Cited
          studies and regulator documents remain the property of their publishers.
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
