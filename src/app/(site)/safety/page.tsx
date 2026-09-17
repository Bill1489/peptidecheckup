import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { BRAND, DISCLAIMER_REPORT, DISCLAIMER_SHORT, OG_IMAGES, RESEARCH_USE_LABEL } from "@/lib/brand";
import { ComplianceStrip } from "@/components/marketing/compliance-strip";
import { blendProducts, CHECKUP, CHECKUP_SHORT, numberWord, wadaListedProducts } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, Prose, SpecSheet, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION = `${BRAND.range.name} pens are research-use products and the ${CHECKUP} is educational information, not medical advice. What the label means, how the pens are stored and shipped, what lot testing does and does not tell you, tested athletes, pregnancy and under-18s.`;

export const metadata: Metadata = {
  title: "Safety & labelling",
  description: DESCRIPTION,
  alternates: { canonical: "/safety/" },
  openGraph: { images: OG_IMAGES, title: `Safety & labelling · ${BRAND.displayName}`, description: DESCRIPTION, url: "/safety/" },
};

const TOC = [
  { id: "not-advice", label: "Not medical advice" },
  { id: "research-use", label: "Research-use labelling" },
  { id: "pens", label: "Pens and the cold chain" },
  { id: "tested", label: "Tested is not licensed" },
  { id: "emergency", label: "If you need help now" },
  { id: "elsewhere", label: "Pens sold elsewhere" },
  { id: "anti-doping", label: "Tested athletes" },
  { id: "pregnancy", label: "Pregnancy & breastfeeding" },
  { id: "age", label: "Under 18" },
  { id: "adverse", label: "Reporting side effects" },
  { id: "report-disclaimer", label: "Report disclaimer" },
];

export default function SafetyPage() {
  const wada = wadaListedProducts();
  const blends = blendProducts();
  const storage = PRODUCTS.find((p) => p.pen)?.pen?.storage ?? "Refrigerate at 2–8 °C. Do not freeze.";

  return (
    <TrustPage
      label="Safety & labelling"
      meta={["Read before you rely on anything here"]}
      title="What this is, what it is not, and when to stop reading."
      description={`Plain statements about the ${CHECKUP_SHORT}, the pens and the label on the carton — and the situations in which you should close this site and speak to someone.`}
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
          Nothing on this site — compound pages, pen pages, comparisons, landing pages, your report or your match — tells you to take, stop or combine
          anything. Suitability labels describe whether your responses identified factors that warrant professional review; they are not a diagnosis, a
          prescription or a clinical determination. A match describes a fit to the record, not an outcome. Dosing information is a summary of published
          research and is not a recommendation. Pen pages state what is in the pen, not what to do with it.
        </p>
      </Prose>

      <Prose>
        <h2 id="research-use">Research-use labelling</h2>
        <blockquote>{RESEARCH_USE_LABEL}</blockquote>
        <p>
          None of the {numberWord(PRODUCTS.length)} pens in the {BRAND.range.name} range is authorised as a medicine in any jurisdiction. They are supplied as
          laboratory reagents under research-use labelling, which means exactly what it says: not a medicine, not for human consumption, not manufactured
          or licensed for use in people. We ask you to confirm that you are 18 or over and that you understand the intended use at checkout, and the
          statement is printed on the pen page, in the cart and on the carton. Lot testing does not change any of this.
        </p>
        <p>
          We sell no prescription-only medicines and offer no consultation service. Where the {CHECKUP_SHORT} points you to a clinician, that is advice to
          see one — not an introduction to one.
        </p>
      </Prose>

      <Prose>
        <h2 id="pens">Pens and the cold chain</h2>
        <p>
          Every product in the range is a pre-filled 3 mL multi-dose pen with a numbered dial window; the dial sets the volume delivered per actuation.
          The solution is temperature-sensitive.
        </p>
      </Prose>
      <SpecSheet
        items={[
          { label: "Storage", value: storage },
          { label: "In transit", value: "Insulated packaging. Refrigerate as soon as the parcel arrives." },
          { label: "Seal", value: "Do not use a pen whose seal is broken or that arrives warm. Email us with the order and lot number." },
          { label: "Lot number", value: "On the carton. Check it against the certificate in the box before first use." },
          { label: "Pen needles", value: "Standard pen needles. Not included unless the listing says so. We do not advise on gauge or length." },
          { label: "Sharps", value: "Used pen needles go in a sharps container, disposed of in line with local rules." },
        ]}
      />
      <Prose>
        <p>
          The pen page for each product repeats its storage line and its box contents. Nothing on this site describes how to use a pen on a person,
          because the products are not supplied for that.
        </p>
      </Prose>

      <Prose>
        <h2 id="tested">Tested is not licensed</h2>
        <p>
          Products sold online labelled “for research use” are usually not tested at all: nobody checks what is in them, how much, or what else is
          present. Ours are tested by an independent laboratory every lot — per component for the {numberWord(blends.length)} blends — and the certificate
          is published against the lot number. It is worth being precise about what that does and does not tell you.
        </p>
        <ul>
          <li>
            <strong>It does tell you</strong> the identity of each compound (LC-MS), its purity as a percentage of the main peak (HPLC) and the endotoxin
            level (LAL) for that lot, on the date tested, at the laboratory named.
          </li>
          <li>
            <strong>It does not tell you</strong> that the compound is safe or effective in people, that the pen is sterile at the point of use, or that
            it is legal to hold where you live. It does not make an unlicensed compound a medicine.
          </li>
          <li>
            <strong>The evidence grade is separate.</strong> A lot can be 99% pure and the compound can still have no human evidence for your goal. The
            compound page says which, and so does the match.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="emergency">If you need help now</h2>
        <Note tone="alert" title="Severe symptoms — call your local emergency number">
          Severe allergic reaction (swelling of the face or throat, difficulty breathing), chest pain, severe abdominal pain, persistent vomiting,
          confusion, fainting, or a suspected overdose are emergencies. Do not use this site to decide what to do — call your local emergency number or go
          to the nearest emergency department. If you have used an unregulated product, take the carton and the lot number with you.
        </Note>
        <p>
          If you are worried about a symptom that is not an emergency, contact your doctor, pharmacist or a national health advice line. If you are having
          thoughts of harming yourself, contact your local crisis line or emergency services now.
        </p>
      </Prose>

      <Prose>
        <h2 id="elsewhere">Pens sold elsewhere</h2>
        <p>
          Pre-filled pens are sold through social media, messaging apps and unregistered websites with no lot number, no certificate and no way to check
          what is inside. Regulators in several countries have issued warnings about falsified pens, some containing no active compound and some
          containing a different one altogether.
        </p>
        <ul>
          <li>
            An {BRAND.range.name} pen carries a lot number on the carton and a certificate for that lot in the box and online. If either is missing, it is not
            ours.
          </li>
          <li>Be suspicious of sellers with no published testing, no labelling, and no willingness to say what a product is not for.</li>
          <li>If you think you have received a falsified product, do not use it; report it to your national medicines regulator.</li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="anti-doping">Tested athletes</h2>
        <p>
          {wada.length > 0 ? (
            <>
              {wada.map((p) => p.name).join(", ")} contain compounds named on the World Anti-Doping Code Prohibited List — as recorded in the compound
              records — and several licensed medicines are listed too.
            </>
          ) : (
            <>Several compounds in the range are named on the World Anti-Doping Code Prohibited List, as recorded in the compound records.</>
          )}{" "}
          Every record carries its anti-doping status, and if you say you compete in tested sport the {CHECKUP_SHORT} will not land on a listed compound:
          the verdict is not recommended and nothing is added to your cart. That status is a summary for information only. If you compete, check the
          current Prohibited List and consult your national anti-doping organisation before using anything, including supplements — strict liability means
          you are responsible for what is found in your sample.
        </p>
      </Prose>

      <Prose>
        <h2 id="pregnancy">Pregnancy and breastfeeding</h2>
        <p>
          Every compound record includes a pregnancy field — contraindicated, not recommended, insufficient data, or not applicable — drawn from the label
          where one exists. For most compounds in the range the honest answer is that there are no adequate human data. If you are pregnant, trying to
          conceive or breastfeeding, the {CHECKUP_SHORT} shows an immediate notice, the report flags every compound accordingly and no pen is matched.
          Discuss anything you are considering with your midwife, obstetrician or doctor first.
        </p>
      </Prose>

      <Prose>
        <h2 id="age">Under 18</h2>
        <p>
          The {CHECKUP_SHORT} and the store are for adults. If you enter an age under 18 the assessment stops and does not generate a report or a match;
          checkout requires confirmation that you are 18 or over. Compound pages remain readable as educational information; none of it is aimed at, or
          appropriate for, decisions about children or adolescents without specialist medical care.
        </p>
      </Prose>

      <Prose>
        <h2 id="adverse">Reporting side effects</h2>
        <p>
          If you experience a suspected side effect from any medicine or product, tell a healthcare professional and report it to your national scheme —
          the MHRA Yellow Card scheme in the United Kingdom, MedWatch in the United States, or the equivalent where you live. Reporting helps regulators
          identify problems, including with unregulated and falsified products.
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
