import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { formatDate } from "@/lib/utils";
import { CtaBand } from "@/components/marketing/cta-band";
import { Callout, Prose, TrustPage } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Concise terms for using Peptide Checkup: educational use only, no medical relationship, no warranty, your responsibilities, intellectual property and governing law.",
  alternates: { canonical: "/terms/" },
};

const LAST_UPDATED = "2026-09-14";

const TOC = [
  { id: "acceptance", label: "Agreement" },
  { id: "educational", label: "Educational use only" },
  { id: "no-relationship", label: "No medical relationship" },
  { id: "responsibilities", label: "Your responsibilities" },
  { id: "accuracy", label: "Accuracy and no warranty" },
  { id: "liability", label: "Limitation of liability" },
  { id: "ip", label: "Intellectual property" },
  { id: "links", label: "Third-party links" },
  { id: "changes", label: "Changes" },
  { id: "law", label: "Governing law" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <TrustPage
      eyebrow="Terms of use"
      title="Short terms, written to be read."
      description="Using this site means agreeing to these terms. They exist to make one thing unambiguous: this is educational information, and decisions about your health belong with a qualified professional."
      meta={`Last updated ${formatDate(LAST_UPDATED)} · ${BRAND.legalName}`}
      toc={TOC}
      after={<CtaBand showDisclaimer={false} />}
    >
      <Prose>
        <h2 id="acceptance">Agreement</h2>
        <p>
          These terms govern your use of {BRAND.domain} and everything on it, including compound pages, comparison tools,
          landing pages, the assessment and any report it generates (together, “the site”). The site is operated by{" "}
          {BRAND.legalName} (“we”, “us”). By using the site you agree to these terms and to the{" "}
          <Link href="/privacy">privacy notice</Link>. If you do not agree, please do not use the site.
        </p>
      </Prose>

      <Prose>
        <h2 id="educational">Educational use only</h2>
        <p>
          The site provides educational information and a structured summary of published research and regulatory
          status. It is <strong>not medical advice</strong>. It does not diagnose, treat, cure or prevent any condition,
          and it does not recommend that you take, stop or combine any medicine, peptide or supplement. Suitability
          labels describe whether your responses identified factors that warrant professional review; they are not a
          clinical determination. Dosing information describes published research and is not a recommendation.
        </p>
        <Callout tone="brand">
          Always consult a qualified healthcare professional before starting, stopping or combining any medicine, peptide
          or supplement. Never disregard or delay professional advice because of something you read here. If you have
          severe symptoms, call your local emergency number.
        </Callout>
      </Prose>

      <Prose>
        <h2 id="no-relationship">No medical relationship</h2>
        <p>
          Using the site, generating a report or requesting a clinician review does not create a doctor–patient,
          pharmacist–patient or any other professional relationship between you and us. Any review we arrange in response
          to a request is provided by the professional concerned under their own terms and professional obligations.
        </p>
      </Prose>

      <Prose>
        <h2 id="responsibilities">Your responsibilities</h2>
        <ul>
          <li>You must be 18 or over to use the assessment.</li>
          <li>Information you enter should be accurate and about you (or someone who has asked you to help them). The report is only as good as the answers.</li>
          <li>You are responsible for complying with the laws that apply to you, including laws on purchasing, importing or possessing compounds, and anti-doping rules if you compete in sport.</li>
          <li>You may not use the site to sell or promote products, scrape or republish the database at scale, attempt to interfere with its operation, or present its output as medical advice to others.</li>
          <li>Personal, non-commercial use of your own report — including printing it and sharing it with your clinician — is what it is for.</li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="accuracy">Accuracy and no warranty</h2>
        <p>
          We take care to write compound records from regulator labels and peer-reviewed trials, to date every
          regulatory entry, and to review the rules engine against those sources. Even so, evidence changes, regulatory
          status changes, records can contain errors, and the assessment cannot capture everything a clinician would ask.
        </p>
        <p>
          The site is provided <strong>“as is” and “as available”</strong>, without warranties of any kind, express or
          implied, including as to accuracy, completeness, currency, fitness for a particular purpose or uninterrupted
          availability. Nothing in these terms limits any rights you have as a consumer that cannot be excluded by law.
        </p>
      </Prose>

      <Prose>
        <h2 id="liability">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of, or
          reliance on, the site or any report — including decisions you make about medicines, peptides or supplements,
          products you obtain from third parties, or the actions of any professional you consult. Nothing in these terms
          excludes or limits liability for death or personal injury caused by negligence, for fraud, or for anything else
          that cannot be excluded or limited under the law of England and Wales.
        </p>
      </Prose>

      <Prose>
        <h2 id="ip">Intellectual property</h2>
        <p>
          The site’s text, design, database structure, rules and code are owned by or licensed to {BRAND.legalName} and
          are protected by copyright and database rights. You may view, print and save pages and your own report for
          personal, non-commercial use, and quote short excerpts with attribution and a link. You may not copy,
          republish or redistribute the database or substantial parts of it, or use the {BRAND.displayName} name or
          logo, without our written permission. Cited studies and regulator documents remain the property of their
          publishers.
        </p>
      </Prose>

      <Prose>
        <h2 id="links">Third-party links</h2>
        <p>
          Compound pages link to trial reports, regulator documents and registries so that sources can be checked. We do
          not control those sites and are not responsible for their content or availability. We do not link to vendors,
          and a link from this site is never a recommendation to buy anything.
        </p>
      </Prose>

      <Prose>
        <h2 id="changes">Changes</h2>
        <p>
          We may update these terms and the site from time to time. The date at the top shows when these terms last
          changed; material changes will be flagged on this page. Continuing to use the site after a change means you
          accept the updated terms.
        </p>
      </Prose>

      <Prose>
        <h2 id="law">Governing law</h2>
        <p>
          These terms are governed by the law of <strong>England and Wales</strong>, and the courts of England and Wales
          have exclusive jurisdiction over any dispute arising from them, except that if you are a consumer resident
          elsewhere you may also rely on mandatory protections of your local law and bring proceedings in your local
          courts.
        </p>
      </Prose>

      <Prose>
        <h2 id="contact">Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>. See also the{" "}
          <Link href="/safety">safety page</Link> and <Link href="/methodology">methodology</Link>.
        </p>
      </Prose>
    </TrustPage>
  );
}
