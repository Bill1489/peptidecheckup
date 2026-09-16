import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, DISCLAIMER_REPORT, DISCLAIMER_SHORT, OG_IMAGES, RESEARCH_USE_LABEL } from "@/lib/brand";
import { ComplianceStrip } from "@/components/marketing/compliance-strip";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, Prose, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION =
  "Peptide Checkup is educational information and a research-use store, not medical advice. What the research-use label means, what batch testing does and does not tell you, emergency guidance, anti-doping, pregnancy and under-18s.";

export const metadata: Metadata = {
  title: "Safety & labelling",
  description: DESCRIPTION,
  alternates: { canonical: "/safety/" },
  openGraph: { images: OG_IMAGES, title: `Safety & labelling · ${BRAND.displayName}`, description: DESCRIPTION, url: "/safety/" },
};

const TOC = [
  { id: "not-advice", label: "Not medical advice" },
  { id: "research-use", label: "Research-use labelling" },
  { id: "tested", label: "Tested is not licensed" },
  { id: "emergency", label: "If you need help now" },
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
      label="Safety & labelling"
      meta={["Read before you rely on anything here"]}
      title="What this is, what it is not, and when to stop reading."
      description="Plain statements about the assessment, the products and the label on the vial — and the situations in which you should close this site and speak to someone."
      toc={TOC}
      after={
        <>
          <section className="container-x pb-10">
            <ComplianceStrip />
          </section>
          <CtaBand secondary={{ href: "/methodology", label: "Methodology" }} />
        </>
      }
    >
      <Prose>
        <h2 id="not-advice">Not medical advice</h2>
        <p>{DISCLAIMER_SHORT}</p>
        <p>
          Nothing on this site — compound pages, product pages, comparisons, landing pages or your report — tells you to take, stop or combine anything.
          Suitability labels describe whether your responses identified factors that warrant professional review; they are not a diagnosis, a prescription
          or a clinical determination. Dosing information is a summary of published research and is not a recommendation. Product pages state what is in
          the vial, not what to do with it.
        </p>
      </Prose>

      <Prose>
        <h2 id="research-use">Research-use labelling</h2>
        <blockquote>{RESEARCH_USE_LABEL}</blockquote>
        <p>
          Most peptides we sell are not authorised as medicines in any jurisdiction. They are supplied as laboratory reagents under research-use
          labelling, which means exactly what it says: not a medicine, not for human consumption, not manufactured or licensed for use in people. We ask
          you to confirm that you are 18 or over and that you understand the intended use at checkout, and the statement is printed on the product page,
          in the cart and on the vial. Batch testing does not change any of this.
        </p>
        <p>
          Licensed medicines in our directory — semaglutide, tirzepatide and others — are prescription-only and are never supplied under research-use
          labelling by us. Their product pages start a consultation with a prescriber instead.
        </p>
      </Prose>

      <Prose>
        <h2 id="tested">Tested is not licensed</h2>
        <p>
          Products sold online labelled “for research use” are usually not tested at all: nobody checks what is in the vial, how much, or what else is
          present. Ours are tested by an independent laboratory every batch, and the certificate is published against the lot number. It is worth being
          precise about what that does and does not tell you.
        </p>
        <ul>
          <li>
            <strong>It does tell you</strong> the identity of the compound (LC-MS), its purity as a percentage of the main peak (HPLC) and the endotoxin
            level (LAL) for that lot, on the date tested, at the laboratory named.
          </li>
          <li>
            <strong>It does not tell you</strong> that the compound is safe or effective in people, that it is sterile at the point of use, or that it is
            legal to hold where you live. It does not make an unlicensed compound a medicine.
          </li>
          <li>
            <strong>The evidence grade is separate.</strong> A lot can be 99% pure and the compound can still have no human evidence for your goal. The
            compound page says which.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="emergency">If you need help now</h2>
        <Note tone="alert" title="Severe symptoms — call your local emergency number">
          Severe allergic reaction (swelling of the face or throat, difficulty breathing), chest pain, severe abdominal pain, persistent vomiting,
          confusion, fainting, or a suspected overdose are emergencies. Do not use this site to decide what to do — call your local emergency number or go
          to the nearest emergency department. If you have taken an unregulated product, take the packaging and the lot number with you.
        </Note>
        <p>
          If you are worried about a symptom that is not an emergency, contact your doctor, pharmacist or a national health advice line. If you are having
          thoughts of harming yourself, contact your local crisis line or emergency services now.
        </p>
      </Prose>

      <Prose>
        <h2 id="counterfeit">Counterfeit medicines</h2>
        <p>
          Licensed medicines are also counterfeited. Regulators in several countries have issued warnings about falsified injection pens and vials sold
          through social media, messaging apps and unregistered websites, sometimes containing no active ingredient and sometimes containing a different
          medicine altogether.
        </p>
        <ul>
          <li>Prescription-only medicines are legitimately supplied only against a prescription, through a licensed pharmacy or clinic.</li>
          <li>
            Be suspicious of prices far below the licensed product, missing patient information leaflets, unfamiliar packaging, or sellers who do not ask
            about your medical history.
          </li>
          <li>If you think you have received a counterfeit, do not use it; report it to your national medicines regulator.</li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="anti-doping">Anti-doping</h2>
        <p>
          Many peptides are prohibited under the World Anti-Doping Code, either at all times or in competition, including some that are licensed
          medicines. Every compound record carries its anti-doping status, and the report flags prohibited substances where athletic performance is your
          goal. That status is a summary for information only. If you compete in tested sport, check the current Prohibited List and consult your national
          anti-doping organisation before using anything, including supplements — strict liability means you are responsible for what is found in your
          sample.
        </p>
      </Prose>

      <Prose>
        <h2 id="pregnancy">Pregnancy and breastfeeding</h2>
        <p>
          Every compound record includes a pregnancy field — contraindicated, not recommended, insufficient data, or not applicable — drawn from the label
          where one exists. For most compounds on this site the honest answer is that there are no adequate human data. If you are pregnant, trying to
          conceive or breastfeeding, the assessment shows an immediate notice and the report flags every compound accordingly. Discuss anything you are
          considering with your midwife, obstetrician or doctor first.
        </p>
      </Prose>

      <Prose>
        <h2 id="age">Under 18</h2>
        <p>
          The assessment and the store are for adults. If you enter an age under 18 the assessment stops and does not generate a report; checkout requires
          confirmation that you are 18 or over. Compound pages remain readable as educational information; none of it is aimed at, or appropriate for,
          decisions about children or adolescents without specialist medical care.
        </p>
      </Prose>

      <Prose>
        <h2 id="adverse">Reporting side effects</h2>
        <p>
          If you experience a suspected side effect from any medicine or product, tell a healthcare professional and report it to your national scheme —
          the MHRA Yellow Card scheme in the United Kingdom, MedWatch in the United States, or the equivalent where you live. Reporting helps regulators
          identify problems, including with unregulated and counterfeit products.
        </p>
      </Prose>

      <Prose>
        <h2 id="report-disclaimer">The disclaimer in every report</h2>
        <blockquote>{DISCLAIMER_REPORT}</blockquote>
        <p>
          Questions about any of this? Email <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>, or read the{" "}
          <Link href="/methodology">methodology</Link> and <Link href="/terms">terms</Link>.
        </p>
      </Prose>
    </TrustPage>
  );
}
