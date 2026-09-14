import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, DISCLAIMER_REPORT, DISCLAIMER_SHORT } from "@/lib/brand";
import { ComplianceStrip } from "@/components/marketing/compliance-strip";
import { CtaBand } from "@/components/marketing/cta-band";
import { Callout, Prose, TrustPage } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Safety & disclaimer",
  description:
    "Peptide Checkup is educational information, not medical advice. Emergency guidance, notes on unregulated and counterfeit products, anti-doping, pregnancy and how to use the site safely.",
  alternates: { canonical: "/safety/" },
};

const TOC = [
  { id: "not-advice", label: "Not medical advice" },
  { id: "emergency", label: "If you need help now" },
  { id: "unregulated", label: "Unregulated products" },
  { id: "counterfeit", label: "Counterfeit medicines" },
  { id: "anti-doping", label: "Anti-doping" },
  { id: "pregnancy", label: "Pregnancy & breastfeeding" },
  { id: "age", label: "Under 18" },
  { id: "adverse", label: "Reporting side effects" },
  { id: "report-disclaimer", label: "Report disclaimer" },
];

export default function SafetyPage() {
  return (
    <TrustPage
      eyebrow="Safety & disclaimer"
      title="Read this before you rely on anything here."
      description="Plain statements about what this site is, what it is not, and the situations in which you should stop reading and speak to someone."
      toc={TOC}
      after={
        <>
          <section className="container-x pb-4">
            <ComplianceStrip showDisclaimer={false} className="mx-auto max-w-4xl" />
          </section>
          <CtaBand showDisclaimer={false} />
        </>
      }
    >
      <Prose>
        <h2 id="not-advice">Not medical advice</h2>
        <p>{DISCLAIMER_SHORT}</p>
        <p>
          Nothing on this site — compound pages, comparisons, landing pages or your report — tells you to take, stop or
          combine anything. Suitability labels describe whether your responses identified factors that warrant
          professional review; they are not a diagnosis, a prescription or a clinical determination. Dosing information
          is a summary of published research and is not a recommendation. Decisions about medicines, peptides and
          supplements belong in a conversation with a qualified healthcare professional who knows your full history.
        </p>
      </Prose>

      <Prose>
        <h2 id="emergency">If you need help now</h2>
        <Callout tone="danger" title="If you have severe symptoms, call your local emergency number">
          Severe allergic reaction (swelling of the face or throat, difficulty breathing), chest pain, severe abdominal
          pain, persistent vomiting, confusion, fainting, or a suspected overdose are emergencies. Do not use this site
          to decide what to do — call your local emergency number or go to the nearest emergency department. If you have
          taken an unregulated product, take the packaging with you.
        </Callout>
        <p>
          If you are worried about a symptom that is not an emergency, contact your doctor, pharmacist or a national
          health advice line. If you are having thoughts of harming yourself, contact your local crisis line or
          emergency services now.
        </p>
      </Prose>

      <Prose>
        <h2 id="unregulated">Unregulated products</h2>
        <p>
          Many compounds listed on this site are <strong>not authorised as medicines in any jurisdiction</strong>. They
          are often sold online labelled “for research use only” or “not for human consumption”. Those labels are not a
          technicality: products sold that way are not manufactured, tested or stored to medicine standards, and there
          is no regulator checking what is in the vial, how much of it, or what else is present.
        </p>
        <ul>
          <li>Published studies describe the studied compound at a known purity and dose. An unregulated product may not be that compound.</li>
          <li>Sterility, endotoxin levels and correct reconstitution matter for anything injected, and cannot be assumed.</li>
          <li>Purchasing, importing or possessing some compounds is restricted or illegal in some countries.</li>
          <li>The report’s product-and-source section exists precisely because source changes the risk. Answer it honestly and take it to a clinician.</li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="counterfeit">Counterfeit medicines</h2>
        <p>
          Licensed medicines are also counterfeited. Regulators in several countries have issued warnings about
          falsified injection pens and vials sold through social media, messaging apps and unregistered websites,
          sometimes containing no active ingredient and sometimes containing a different medicine altogether.
        </p>
        <ul>
          <li>Prescription-only medicines are legitimately supplied only against a prescription, through a licensed pharmacy or clinic.</li>
          <li>Be suspicious of prices far below the licensed product, missing patient information leaflets, unfamiliar packaging, or sellers who do not ask about your medical history.</li>
          <li>If you think you have received a counterfeit, do not use it; report it to your national medicines regulator.</li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="anti-doping">Anti-doping</h2>
        <p>
          Many peptides are prohibited under the World Anti-Doping Code, either at all times or in competition, including
          some that are licensed medicines. Every compound record on this site carries its anti-doping status, and the
          report flags prohibited substances where athletic performance is your goal. That status is a summary for
          information only. If you compete in tested sport, check the current Prohibited List and consult your
          national anti-doping organisation before using anything, including supplements — strict liability means you
          are responsible for what is found in your sample.
        </p>
      </Prose>

      <Prose>
        <h2 id="pregnancy">Pregnancy and breastfeeding</h2>
        <p>
          Every compound record includes a pregnancy field — contraindicated, not recommended, insufficient data, or not
          applicable — drawn from the label where one exists. For most compounds on this site the honest answer is that
          there are no adequate human data. If you are pregnant, trying to conceive or breastfeeding, the assessment
          shows an immediate notice and the report flags every compound accordingly. Please discuss anything you are
          considering with your midwife, obstetrician or doctor first.
        </p>
      </Prose>

      <Prose>
        <h2 id="age">Under 18</h2>
        <p>
          The assessment is for adults. If you enter an age under 18, it stops respectfully and does not generate a
          report. Compound pages remain readable as educational information; none of it is aimed at, or appropriate for,
          decisions about children or adolescents without specialist medical care.
        </p>
      </Prose>

      <Prose>
        <h2 id="adverse">Reporting side effects</h2>
        <p>
          If you experience a suspected side effect from any medicine or product, tell a healthcare professional and
          report it to your national scheme — for example the MHRA Yellow Card scheme in the United Kingdom, MedWatch in
          the United States, or the equivalent where you live. Reporting helps regulators identify problems, including
          with unregulated and counterfeit products.
        </p>
      </Prose>

      <Prose>
        <h2 id="report-disclaimer">The disclaimer in every report</h2>
        <blockquote>{DISCLAIMER_REPORT}</blockquote>
        <p>
          Questions about any of this? Email <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>, or read
          the <Link href="/methodology">methodology</Link> and <Link href="/terms">terms of use</Link>.
        </p>
      </Prose>
    </TrustPage>
  );
}
