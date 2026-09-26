import type { Metadata } from "next";
import Link from "next/link";
import { COMPOUNDS } from "@/data/compounds";
import { PRODUCTS } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { rangeCategoriesWithProducts } from "@/components/commerce/product-utils";
import {
  authorisedElsewhereNames,
  blendNames,
  blendProducts,
  CHECKUP,
  CHECKUP_SHORT,
  coaLabs,
  joinNames,
  NAMED_JURISDICTIONS,
  pluralise,
} from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, NumberedRows, Prose, ProseH2, SpecSheet, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION = `${BRAND.displayName} is an independent retailer — the ${BRAND.range.relationship.toLowerCase()} of the ${BRAND.range.name} range — ${PRODUCTS.length} pre-filled peptide pens, each lot tested and certified, matched by the ${CHECKUP}. The principles it is built on, what it is not, and who maintains it.`;

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about/" },
  openGraph: { images: OG_IMAGES, title: `About · ${BRAND.displayName}`, description: DESCRIPTION, url: "/about/" },
};

const TOC = [
  { id: "mission", label: "Why this exists" },
  { id: "range", label: "The range" },
  { id: "principles", label: "Principles" },
  { id: "not", label: "What we are not" },
  { id: "team", label: "Who we are" },
  { id: "contact", label: "Contact" },
];

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "One format",
    body: "Every product is the same object: a pre-filled 3 mL dose-dial pen from one manufacturer, priced in sterling from the manufacturer's list at a fixed, published rate. No vials, no diluent, no kits, no supplies. If a compound does not suit the format, it is not in the range.",
  },
  {
    title: "Test every lot",
    body: "No lot is listed until an independent laboratory has confirmed identity by LC-MS, purity by HPLC and endotoxin by LAL — per component for blends. A lot that fails is not sold at a discount; it is not sold.",
  },
  {
    title: "Publish the certificate",
    body: "The certificate is published as issued, against the lot number printed on the carton, and a copy travels in the box. If you cannot find the certificate for your lot, the pen is not ours.",
  },
  {
    title: "Grade evidence the same way",
    body: "Human trials and regulator labels decide the grade. Animal data, anecdote and marketing do not. A compound we sell is graded by the same criteria as one we do not, and the pen page shows the compound’s grade unchanged.",
  },
  {
    title: "Tell people when not to buy",
    body: `The ${CHECKUP} exists to say no as readily as yes. A Higher-concern label or a high flag ends at “not recommended”; nothing is added to the cart, the report explains which answer caused it, and it points to a clinician.`,
  },
];

export default function AboutPage() {
  const labs = coaLabs();
  const blends = blendProducts();
  const categories = rangeCategoriesWithProducts();
  const authorisedElsewhere = authorisedElsewhereNames();

  return (
    <TrustPage
      label="About"
      meta={[BRAND.legalName, `Est. ${BRAND.foundedYear}`, COMMERCE.market.name]}
      title={`The independent stockist of the ${BRAND.range.name} range.`}
      description={`${BRAND.displayName} stocks ${PRODUCTS.length} pre-filled ${BRAND.range.name} peptide pens in the ${COMMERCE.market.name}, publishes the independent laboratory certificate for every lot, and puts a ${CHECKUP_SHORT} in front of the shop that can end at no pen at all. We sell what we grade — so the rules that keep the two apart are written down here.`}
      toc={TOC}
      after={<CtaBand secondary={{ href: "/methodology", label: "Read the methodology" }} />}
    >
      <Prose>
        <h2 id="mission">Why this exists</h2>
        <p>
          Interest in peptides has run far ahead of the information available about them, and further still ahead of the quality of what is sold.
          Some compounds are licensed medicines with large trials behind them; many have never been studied in humans. Which category a compound is
          in matters more than anything an advert says, and whether it is worth discussing at all depends on your own history and medicines.
          Meanwhile the product itself — what is actually in it, and how much — is rarely tested by the people selling it, and the format usually
          leaves the buyer to reconstitute a powder and draw it up.
        </p>
        <p>
          {BRAND.displayName} exists to do three things properly and join them together: a small range in one honest format, a laboratory
          certificate for every lot, and an assessment that collects your history in a structured way and lands on a pen only where the record
          supports it. The {CHECKUP_SHORT} is free and does not change based on what you might buy.
        </p>
      </Prose>

      <Prose>
        <h2 id="range">The range</h2>
        <p>
          {PRODUCTS.length} pens, all pre-filled, all 3 mL, all dose-dial, in {categories.length} of the manufacturer&apos;s categories (
          {joinNames(categories.map((c) => c.category.label.toLowerCase()))}): {joinNames(PRODUCTS.map((p) => p.name))}.{" "}
          {PRODUCTS.length - blends.length} are single compounds and {blends.length} — {blendNames()} — are blends, graded per component. Everything in
          the range is supplied for research use and the labelling says so.
          {authorisedElsewhere.length > 0 && (
            <>
              {" "}
              Some compounds — {joinNames(authorisedElsewhere)} — are authorised medicines in other countries; the pens are research products of the same
              compounds, not those medicines, and the pen page says so.
            </>
          )}{" "}
          There are no other products, no supplies and no consultation services. The <Link href="/shop">shop</Link> shows the current price in{" "}
          {COMMERCE.currency} and the lot for each pen.
        </p>
      </Prose>

      <ProseH2 id="principles">Principles</ProseH2>
      <NumberedRows className="mt-6" items={PRINCIPLES.map((p) => ({ title: p.title, body: p.body }))} />

      <Prose>
        <h2 id="not">What we are not</h2>
        <ul>
          <li>
            <strong>Not a clinic or a healthcare provider.</strong> Nobody here is your clinician, and using the site or buying from it does not create a
            professional relationship. See the <Link href="/terms">terms</Link>.
          </li>
          <li>
            <strong>Not a pharmacy.</strong> Nothing in the range is supplied as a licensed medicine and we sell no prescription-only products. Where a
            compound is an authorised medicine elsewhere, the pen is a research product, not that medicine. Where the {CHECKUP_SHORT} points you to a
            clinician, that is a recommendation to see one, not an introduction to one.
          </li>
          <li>
            <strong>Not a marketplace, and not the manufacturer.</strong> Every pen is made by {BRAND.range.name}, stocked by us and tested by a laboratory
            we chose and pay for. There are no third-party sellers, affiliate links or sponsored placements.
          </li>
          <li>
            <strong>Not an AI chatbot.</strong> There is no language model in the pipeline. Reports and matches are assembled from database fields by
            fixed, reviewable rules.
          </li>
          <li>
            <strong>Not an advocate for or against peptides.</strong> Where the evidence is strong we say so; where it is absent we say that too, in
            the same type size — including on the pen page.
          </li>
          <li>
            <strong>Not a data business.</strong> There are no accounts, no tracking by default, and your assessment answers stay in your browser. See
            the <Link href="/privacy">privacy notice</Link>.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="team">Who we are</h2>
        <p>
          This site is operated by {BRAND.legalName}, a small, independent company, with
          clinical, pharmacy, analytical and engineering backgrounds on the team. The pens are made by {BRAND.range.name} ({BRAND.range.descriptor});
          we are their {BRAND.range.relationship.toLowerCase()}, not the manufacturer, and we say so wherever a lot, a certificate or a label is
          discussed. Compound records are written from regulator labels and
          peer-reviewed trials and reviewed before publication; the rules engine and the matcher are reviewed against the same sources; pens are held
          until the laboratory result for the lot is in.
        </p>
        <Note title="A note on names and photographs">
          We do not publish individual names, credentials or photographs on this page yet, and we will not invent any. The only photographs on this
          site are of the pens. When we add people, they will be real people who are accountable for the content. Until then, judge the work by its
          sources, its <Link href="/methodology">methodology</Link> and the certificates on the <Link href="/lab-testing">lab-testing page</Link>.
        </Note>
      </Prose>
      <SpecSheet
        items={[
          { label: "Legal entity", value: BRAND.legalName },
          { label: "Market", value: `${COMMERCE.market.name} · prices in ${COMMERCE.currency}` },
          { label: "Range", value: `${pluralise(PRODUCTS.length, "pen")} · ${categories.length} categories · one format` },
          { label: "Database", value: `${pluralise(COMPOUNDS.length, "compound")} · ${NAMED_JURISDICTIONS.length} jurisdictions` },
          { label: "Testing", value: labs.length > 0 ? labs.join(", ") : "Independent laboratory" },
          { label: "Business model", value: "We sell what we test. No commissions." },
        ]}
      />

      <Prose>
        <h2 id="contact">Contact</h2>
        <p>
          Corrections, questions, order problems and requests to delete your data all go to <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>.
          A person reads every message. If you are a clinician, pharmacist or analytical chemist who would like to review records, rules or certificates, we
          would like to hear from you.
        </p>
      </Prose>
    </TrustPage>
  );
}
