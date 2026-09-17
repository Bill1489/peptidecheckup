import { COMPOUNDS } from "@/data/compounds";
import { PRODUCTS } from "@/data/products";
import { JURISDICTION_LABELS } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatMoney } from "@/lib/commerce/money";
import { SUITABILITY_DESCRIPTIONS } from "@/lib/engine/types";
import { titleCase } from "@/lib/utils";
import {
  ASSESSMENT_MINUTES,
  blendProducts,
  CHECKUP,
  CHECKUP_SHORT,
  NAMED_JURISDICTIONS,
  numberWord,
  penComponents,
  wadaListedProducts,
} from "./copy";

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
const blends = blendProducts();
const wada = wadaListedProducts();
const nonPeptide = PRODUCTS.find((p) => p.slug === "nad");

/** Eight store + assessment questions shown on the home page (and first on /faq). */
export const HOME_FAQ: FaqItem[] = [
  {
    id: "research-use",
    question: "What does “research use only” mean?",
    answer: `None of the compounds in the ${BRAND.displayName} range is authorised as a medicine in the United Kingdom. UK law lets them be supplied as laboratory reagents for research, not for human use, so the label says exactly that: not a medicine, not for human consumption. Purchasers must be 18 or over and confirm the intended use at checkout. Lot testing tells you what is in the pen; it does not change the legal status of the compound or make it a medicine.`,
    link: { href: "/safety", label: "Safety and labelling" },
  },
  {
    id: "pre-filled",
    question: "Is the pen pre-filled?",
    answer: `Yes. Every pen in the range holds 3 mL of solution in a multi-dose pen with a numbered dial window; the dial sets the volume delivered per actuation. There is no powder, no diluent and no drawing up. The amount of compound in the pen is stated on the carton, on the product page and on the certificate for the lot. ${titleCase(numberWord(blends.length))} of the ${numberWord(PRODUCTS.length)} pens — ${blends.map((b) => b.name).join(" and ")} — are blends, with the component split stated on the certificate.`,
    link: { href: "/shop", label: "See the range" },
  },
  {
    id: "needles",
    question: "Do I need needles?",
    answer:
      "The pens take standard pen needles. Needles are not included unless the box contents for that product say so, so check the “In the box” line on the product page before you order. We do not advise on gauge or length, and we do not sell needles.",
    link: { href: "/shop", label: "Check the box contents" },
  },
  {
    id: "storage",
    question: "How do I store the pen?",
    answer:
      "Refrigerate at 2–8 °C and do not freeze. Keep the cap on and the pen out of direct light between uses. Pens ship in insulated packaging; put the pen in the fridge as soon as the parcel arrives and check that the lot number on the carton matches the certificate in the box. If a pen arrives warm or the seal is broken, do not use it — email us with the order number and lot number.",
    link: { href: "/shipping", label: "Shipping and cold chain" },
  },
  {
    id: "not-a-fit",
    question: `What does the ${CHECKUP_SHORT} do if I’m not a fit?`,
    answer: `It says so. ${SUITABILITY_DESCRIPTIONS.higher_concern} When that happens the verdict is “not recommended”: the report names the answer that caused it, nothing is added to your cart, and you are pointed to a clinician instead. Where no pen in the range is researched for your goal — sleep or libido, for example — the ${CHECKUP_SHORT} tells you that too rather than landing on something adjacent.`,
    link: { href: "/how-it-works", label: `How the ${CHECKUP_SHORT} works` },
  },
  {
    id: "shipping",
    question: "When will my order ship?",
    answer: `UK orders placed before 2 pm on a working day are dispatched the same day. ${standard.label} is ${formatMoney(standard.price)} (${standard.eta}) and free on orders of ${freeFrom} or more; ${express.label.toLowerCase()} is ${formatMoney(express.price)} (${express.eta}). ${international.label} is ${formatMoney(international.price)} (${international.eta}) to ${COMMERCE.shipTo.length - 1} other countries. Pens travel in insulated packaging and go in the fridge on arrival.`,
    link: { href: "/shipping", label: "Shipping and returns" },
  },
  {
    id: "returns",
    question: "Can I return a pen?",
    answer:
      "Unopened pens with the seal intact can be returned within 14 days of delivery for a refund. Opened pens cannot be returned, because sterility and the cold chain cannot be verified once the seal is broken. If a pen arrives damaged, is faulty, or does not match the certificate for its lot, we replace or refund it — email us with the order number and lot number.",
    link: { href: "/shipping", label: "Full returns policy" },
  },
  {
    id: "data",
    question: "What happens to my data?",
    answer: `${CHECKUP} answers and the report stay in your browser’s local storage; nothing is sent to us unless you ask for your report by email. The cart is stored in your browser too. Orders are kept on your device and, when the store is connected to a fulfilment system, sent to it to be shipped. Card details go directly to the payment provider and never touch our site. We set no cookies by default.`,
    link: { href: "/privacy", label: "Privacy notice" },
  },
];

/** Additional questions for /faq. */
export const MORE_FAQ: FaqItem[] = [
  {
    id: "who-tests",
    question: "Who does the testing?",
    answer:
      "An independent analytical laboratory, not us. Each lot is sent for HPLC purity, LC-MS identity and LAL endotoxin testing before it is listed; blends are tested per component. The laboratory’s name and the test date appear on every certificate, and we publish the certificate as issued.",
    link: { href: "/lab-testing", label: "Lab testing" },
  },
  {
    id: "blends",
    question: "How are the blends graded?",
    answer: `${blends.map((b) => `${b.name} (${penComponents(b)})`).join(" and ")} are graded per component: each compound inside the pen has its own evidence record, and the report shows each grade. The combinations themselves have not been studied in people, and the report says so rather than averaging the components into something that looks better.`,
    link: { href: "/peptides", label: "Compound directory" },
  },
  ...(nonPeptide
    ? [
        {
          id: "nad",
          question: `Is ${nonPeptide.name} a peptide?`,
          answer: `No. ${nonPeptide.name} is a coenzyme, and the product page says so. It is in the range because it is asked about alongside the peptides and because it fits the same pre-filled pen format; it is graded and labelled on exactly the same basis as everything else.`,
          link: { href: `/shop/${nonPeptide.slug}/`, label: `${nonPeptide.name} pen` },
        },
      ]
    : []),
  {
    id: "athletes",
    question: "Can I use this if I compete in tested sport?",
    answer: `${wada.length > 0 ? `${wada.map((p) => p.name).join(", ")} contain compounds named on the WADA Prohibited List. ` : ""}Every one of the ${COMPOUNDS.length} compound records carries its anti-doping status, and the ${CHECKUP_SHORT} will not land on a listed compound if you say you compete in tested sport. Strict liability means you are responsible for what is found in your sample — check with your national anti-doping organisation before using anything.`,
    link: { href: "/safety", label: "Anti-doping" },
  },
  {
    id: "medical-advice",
    question: `Is the ${CHECKUP_SHORT} medical advice?`,
    answer: `No. The ${ASSESSMENT_MINUTES}-minute ${CHECKUP} produces a structured summary of published research, regulatory status and the factors in your own history that a clinician would want to know about, and then a product match built on the same rules. It does not diagnose or treat anything and it does not tell you to take a compound. Suitability labels describe whether your answers identified something that warrants professional review; they are not a clinical determination.`,
    link: { href: "/methodology", label: "Methodology" },
  },
  {
    id: "discount",
    question: `Is there a discount for completing the ${CHECKUP_SHORT}?`,
    answer: checkupPromo
      ? `Yes. Completing the ${CHECKUP_SHORT} unlocks the code CHECKUP10 — ${checkupPromo.label.replace(/ — .*$/, "").toLowerCase()} — which you can apply in the cart. It is the only discount attached to the assessment; the report itself is free and does not change based on what you might buy.`
      : "The report is free and does not change based on what you might buy.",
  },
  {
    id: "account",
    question: "Do I need an account?",
    answer:
      "No. There are no accounts. Your cart and order history live in your browser; the orders page reads them from there. If you clear your browser data they are gone, so keep the order confirmation email.",
    link: { href: "/account/orders", label: "Your orders" },
  },
  {
    id: "countries",
    question: "Which countries do you ship to?",
    answer: `The United Kingdom and ${COMMERCE.shipTo.length - 1} other countries, listed at checkout. It is your responsibility to check that the pens you order can be imported and held where you live; research-use compounds are restricted in some countries and we cannot advise on local law.`,
    link: { href: "/shipping", label: "Shipping" },
  },
  {
    id: "regulatory-source",
    question: "Where does the regulatory status come from?",
    answer: `From a database we maintain by hand for the ${jurisdictionList}, plus a general entry for other jurisdictions. Each entry records the regulator, the licensed indication where one exists, any caveats and the date it was last reviewed. Status is never inferred by software — if we have not confirmed it, the entry says “Unclear”.`,
    link: { href: "/methodology", label: "Methodology" },
  },
  {
    id: "dosing",
    question: "Does the report tell me what dose to dial?",
    answer:
      "No. Dosing appears as research information: the amounts, durations and routes used in published human studies, with their outcomes and adverse events. If you enter an amount you are considering, the report states how it compares with those study exposures — within, above or below — and whether the frequency or route differs. It never recommends a dose, and neither does a product page; the pen page states what is in the pen, not what to dial.",
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
    answer: `Choose “Start over” on the assessment page to remove your answers, report and match, and clear this site’s data in your browser to remove the cart and local order history. If you sent us an email address — for a report, the newsletter or a restock alert — email ${BRAND.supportEmail} and we will delete it.`,
    link: { href: "/privacy", label: "Privacy notice" },
  },
];

export const ALL_FAQ: FaqItem[] = [...HOME_FAQ, ...MORE_FAQ];
