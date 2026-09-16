import { COMPOUNDS } from "@/data/compounds";
import { JURISDICTION_LABELS } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { SUITABILITY_DESCRIPTIONS } from "@/lib/engine/types";
import { ASSESSMENT_MINUTES, NAMED_JURISDICTIONS } from "./copy";

export interface FaqItem {
  id: string;
  question: string;
  /** Plain text so it can also feed FAQPage JSON-LD. */
  answer: string;
  link?: { href: string; label: string };
}

const jurisdictionList = NAMED_JURISDICTIONS.map((j) => JURISDICTION_LABELS[j]).join(", ");
const standard = COMMERCE.shippingOptions[0];
const express = COMMERCE.shippingOptions[1];
const international = COMMERCE.shippingOptions[2];
const freeFrom = formatMoney(COMMERCE.freeShippingThreshold, { trimZeros: true });
const checkupPromo = COMMERCE.promoCodes.CHECKUP10;

/** Eight store + assessment questions shown on the home page (and first on /faq). */
export const HOME_FAQ: FaqItem[] = [
  {
    id: "research-use",
    question: "What does “research use only” mean?",
    answer:
      "Most peptides we sell are not authorised as medicines anywhere. UK law lets them be supplied as laboratory reagents for research, not for human use, so the label says exactly that: not a medicine, not for human consumption. Purchasers must be 18 or over and confirm the intended use at checkout. Batch testing tells you what is in the vial; it does not change the legal status of the compound or make it a medicine.",
    link: { href: "/safety", label: "Safety and labelling" },
  },
  {
    id: "semaglutide",
    question: "Do you sell semaglutide?",
    answer:
      `No. Semaglutide, tirzepatide and the other licensed medicines in our directory are prescription-only and are never sold directly. Their product pages start an online consultation with ${COMMERCE.prescriberPartner}. If it is appropriate for you, a registered pharmacy dispenses the licensed product with clinical follow-up. We do not sell compounded or “research” versions of licensed medicines.`,
    link: { href: "/shop/?category=peptide", label: "Peptides in the shop" },
  },
  {
    id: "coa",
    question: "How do I read a certificate of analysis?",
    answer:
      "Every lyophilised vial carries a lot number. Enter it on the lab-testing page to open the certificate for that lot. Check three things: purity by HPLC, given as the percentage of the main peak; identity by LC-MS, where the measured mass is compared with the expected mass of the sequence and reported as confirmed or not; and endotoxin by LAL, in endotoxin units per milligram. The certificate also names the laboratory and the test date. If the lot number on your vial does not match, tell us before you use it.",
    link: { href: "/lab-testing", label: "Look up a lot number" },
  },
  {
    id: "shipping",
    question: "When will my order ship?",
    answer:
      `UK orders placed before 2 pm on a working day are dispatched the same day. ${standard.label} is ${formatMoney(standard.price)} (${standard.eta}) and free on orders of ${freeFrom} or more; ${express.label.toLowerCase()} is ${formatMoney(express.price)} (${express.eta}). ${international.label} is ${formatMoney(international.price)} (${international.eta}) to ${COMMERCE.shipTo.length - 1} countries. Lyophilised peptides are stable at room temperature in transit; store them as the label says on arrival.`,
    link: { href: "/shipping", label: "Shipping and returns" },
  },
  {
    id: "returns",
    question: "Can I return an order?",
    answer:
      "Unopened items with the seal intact can be returned within 14 days of delivery for a refund — that applies to research vials and to supplies. Opened or reconstituted vials and sterile items with a broken seal cannot be returned, because sterility cannot be verified. If a product arrives damaged, is faulty, or does not match the certificate for its lot, we replace or refund it — email us with the order number and lot number.",
    link: { href: "/shipping", label: "Full returns policy" },
  },
  {
    id: "medical-advice",
    question: "Is the assessment medical advice?",
    answer:
      `No. The ${ASSESSMENT_MINUTES}-minute checkup produces a structured summary of published research, regulatory status and the factors in your own history that a clinician would want to know about. It does not diagnose or treat anything and it does not tell you to take a compound. Suitability labels describe whether your answers identified something that warrants professional review; they are not a clinical determination.`,
    link: { href: "/how-it-works", label: "How the checkup works" },
  },
  {
    id: "told-not-to-buy",
    question: "Why did the report tell me not to buy?",
    answer:
      `Because your answers matched a documented contraindication, interaction or other flag for that compound. ${SUITABILITY_DESCRIPTIONS.higher_concern} When a compound is marked Higher concern, the report explains which answer caused it, does not add the product to your cart, and points you to a clinician instead. You can still read the product page; the label there says the same thing.`,
    link: { href: "/methodology", label: "How labels are decided" },
  },
  {
    id: "data",
    question: "What happens to my data?",
    answer:
      "Assessment answers and the report stay in your browser’s local storage; nothing is sent to us unless you ask for your report by email or request a consultation. The cart is stored in your browser too. Orders are kept on your device and, when the store is connected to a fulfilment system, sent to it to be shipped. Card details go directly to the payment provider and never touch our site. We set no cookies by default.",
    link: { href: "/privacy", label: "Privacy notice" },
  },
];

/** Additional questions for /faq. */
export const MORE_FAQ: FaqItem[] = [
  {
    id: "consultation",
    question: "How does the consultation for prescription medicines work?",
    answer:
      `Choose “Start consultation” on the product page and leave your details. ${COMMERCE.prescriberPartner.charAt(0).toUpperCase()}${COMMERCE.prescriberPartner.slice(1)} runs the clinical eligibility check under their own registration and terms; if a prescription is appropriate, a registered pharmacy dispenses the licensed medicine. We do not see your consultation answers, we do not set the prescriber’s fees, and we are not paid per prescription.`,
  },
  {
    id: "not-sold",
    question: "Why are some products listed as “Not sold”?",
    answer:
      "Because a regulator has issued a warning about the compound, or because its documented risks — hypoglycaemia with IGF-1 LR3, for example, or the safety alerts on melanotan II — mean we are not willing to supply it. The product page stays up so that people searching for it find the evidence and the warning rather than nothing.",
    link: { href: "/peptides", label: "Compound directory" },
  },
  {
    id: "who-tests",
    question: "Who does the testing?",
    answer:
      "An independent analytical laboratory, not us. Each lot is sent for HPLC purity, LC-MS identity and LAL endotoxin testing before it is listed; the laboratory’s name and the test date appear on every certificate. We publish the certificate as issued.",
    link: { href: "/lab-testing", label: "Lab testing" },
  },
  {
    id: "discount",
    question: "Is there a discount for completing the assessment?",
    answer: checkupPromo
      ? `Yes. Completing the assessment unlocks the code CHECKUP10 — ${checkupPromo.label.replace(/ — .*$/, "").toLowerCase()} — which you can apply in the cart. It is the only discount attached to the assessment; the report itself is free and does not change based on what you might buy.`
      : "The report is free and does not change based on what you might buy.",
  },
  {
    id: "account",
    question: "Do I need an account?",
    answer:
      "No. There are no accounts. Your cart and order history live in your browser; the account page reads them from there. If you clear your browser data they are gone, so keep the order confirmation email.",
    link: { href: "/account/orders", label: "Your orders" },
  },
  {
    id: "countries",
    question: "Which countries do you ship to?",
    answer:
      `The United Kingdom and ${COMMERCE.shipTo.length - 1} other countries, listed at checkout. It is your responsibility to check that the products you order can be imported and held where you live; research-use compounds are restricted in some countries and we cannot advise on local law.`,
    link: { href: "/shipping", label: "Shipping" },
  },
  {
    id: "regulatory-source",
    question: "Where does the regulatory status come from?",
    answer:
      `From a database we maintain by hand for the ${jurisdictionList}, plus a general entry for other jurisdictions. Each entry records the regulator, the licensed indication where one exists, any caveats and the date it was last reviewed. Status is never inferred by software — if we have not confirmed it, the entry says “Unclear”.`,
    link: { href: "/methodology", label: "Methodology" },
  },
  {
    id: "dosing",
    question: "Does the report tell me what dose to take?",
    answer:
      "No. Dosing appears as research information: the doses, durations and routes used in published human studies, with their outcomes and adverse events. If you enter a dose you are considering, the report states how it compares with those study exposures — within, above or below — and whether the frequency or route differs. It never recommends a dose, and neither does a product page.",
  },
  {
    id: "stacks",
    question: "What about combinations (“stacks”)?",
    answer:
      "If you select two or more compounds, the report includes a stack analysis: whether the combination has been studied in humans, overlapping considerations such as two compounds acting on the same pathway, the number of evidence gaps and an overall uncertainty rating. Kits in the shop bundle a peptide with supplies, not with other peptides.",
  },
  {
    id: "athletes",
    question: "Can I use this if I compete in tested sport?",
    answer:
      `Many peptides are prohibited at all times or in competition under the World Anti-Doping Code, including some licensed medicines. Every one of the ${COMPOUNDS.length} compound records carries its anti-doping status, and the report flags prohibited substances when performance is your goal. Check with your national anti-doping organisation before using anything.`,
  },
  {
    id: "print",
    question: "Can I print or save my report?",
    answer:
      "Yes. The report page has a print / save option that produces a clean copy without site navigation, suitable for taking to an appointment. Nothing is stored on our servers, so keeping a copy is up to you.",
  },
  {
    id: "delete",
    question: "How do I delete my data?",
    answer:
      `Choose “Start over” on the assessment page to remove your answers and report, and clear this site’s data in your browser to remove the cart and local order history. If you sent us an email address — for a report, the newsletter or a consultation — email ${BRAND.supportEmail} and we will delete it.`,
    link: { href: "/privacy", label: "Privacy notice" },
  },
];

export const ALL_FAQ: FaqItem[] = [...HOME_FAQ, ...MORE_FAQ];
