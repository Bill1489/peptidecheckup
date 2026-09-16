import type { Metadata } from "next";
import Link from "next/link";
import { COMPOUNDS } from "@/data/compounds";
import { PRODUCTS } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { coaLabs, NAMED_JURISDICTIONS, pluralise } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, NumberedRows, Prose, ProseH2, SpecSheet, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION = `${BRAND.displayName} is an independent UK company selling batch-tested peptides behind an evidence-led assessment. The principles it is built on, what it is not, and who maintains it.`;

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about/" },
  openGraph: { images: OG_IMAGES, title: `About · ${BRAND.displayName}`, description: DESCRIPTION, url: "/about/" },
};

const TOC = [
  { id: "mission", label: "Why this exists" },
  { id: "principles", label: "Principles" },
  { id: "not", label: "What we are not" },
  { id: "team", label: "Who we are" },
  { id: "contact", label: "Contact" },
];

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Test every batch",
    body: "No lot is listed until an independent laboratory has confirmed identity by LC-MS, purity by HPLC and endotoxin by LAL. A lot that fails is not sold at a discount; it is not sold.",
  },
  {
    title: "Publish the certificate",
    body: "The certificate is published as issued, against the lot number printed on the vial, and a copy travels in the box. If you cannot find the certificate for your lot, the product is not ours.",
  },
  {
    title: "Grade evidence the same way",
    body: "Human trials and regulator labels decide the grade. Animal data, anecdote and marketing do not. A compound we sell is graded by the same criteria as one we don’t, and the product page shows the compound’s grade unchanged.",
  },
  {
    title: "Tell people when not to buy",
    body: "The assessment exists to say no as readily as yes. A Higher-concern compound is never added to the cart from a report; the report explains which answer caused it and points to a clinician.",
  },
];

export default function AboutPage() {
  const labs = coaLabs();

  return (
    <TrustPage
      label="About"
      meta={[BRAND.legalName, `Est. ${BRAND.foundedYear} · United Kingdom`]}
      title="An independent UK company that tests what it sells and says when not to buy."
      description={`${BRAND.displayName} exists because most of what people find about peptides is written by someone selling something, and most of what is sold has never been tested. We sell peptides too — so the rules that keep the two apart are written down here.`}
      toc={TOC}
      after={<CtaBand secondary={{ href: "/methodology", label: "Read the methodology" }} />}
    >
      <Prose>
        <h2 id="mission">Why this exists</h2>
        <p>
          Interest in peptides has run far ahead of the information available about them, and further still ahead of the quality of what is sold. Some
          peptides are licensed medicines with large trials behind them; some are investigational; many have never been studied in humans. Which category
          a compound is in matters more than anything an advert says, and whether it is worth discussing at all depends on your own history and
          medicines. Meanwhile the vial itself — what is actually in it — is rarely tested by the people selling it.
        </p>
        <p>
          So we built three things and joined them together: a database that records the evidence and regulatory facts consistently, an assessment that
          collects your history in a structured way and matches products only where the record supports it, and a catalogue where every lot has been
          tested by an independent laboratory before it is listed. The assessment is free and does not change based on what you might buy.
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
            <strong>Not a pharmacy.</strong> Prescription-only medicines are never sold by us. Where a product page offers a consultation, the prescriber
            and the dispensing pharmacy are separate, registered businesses working under their own obligations.
          </li>
          <li>
            <strong>Not a marketplace.</strong> Every product is ours, tested by a laboratory we chose and pay for. There are no third-party sellers,
            affiliate links or sponsored placements.
          </li>
          <li>
            <strong>Not an AI chatbot.</strong> There is no language model in the pipeline. Reports are assembled from database fields by fixed, reviewable
            rules.
          </li>
          <li>
            <strong>Not an advocate for or against peptides.</strong> Where the evidence is strong we say so; where it is absent we say that too, in the
            same type size — including on the product page.
          </li>
          <li>
            <strong>Not a data business.</strong> There are no accounts, no tracking by default, and your assessment answers stay in your browser. See the{" "}
            <Link href="/privacy">privacy notice</Link>.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="team">Who we are</h2>
        <p>
          {BRAND.displayName} is operated by {BRAND.legalName}, a small, independent company registered in the United Kingdom, with clinical, pharmacy,
          analytical and engineering backgrounds on the team. Compound records are written from regulator labels and peer-reviewed trials and reviewed
          before publication; the rules engine is reviewed against the same sources; product listings are held until the laboratory result is in.
        </p>
        <Note title="A note on names and photographs">
          We do not publish individual names, credentials or photographs on this page yet, and we will not invent any. When we do, they will be real
          people who are accountable for the content. Until then, judge the work by its sources, its <Link href="/methodology">methodology</Link> and the
          certificates on the <Link href="/lab-testing">lab-testing page</Link>.
        </Note>
      </Prose>
      <SpecSheet
        items={[
          { label: "Legal entity", value: BRAND.legalName },
          { label: "Database", value: `${pluralise(COMPOUNDS.length, "compound")} · ${NAMED_JURISDICTIONS.length} jurisdictions` },
          { label: "Catalogue", value: pluralise(PRODUCTS.length, "product") },
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
