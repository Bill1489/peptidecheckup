import { BRAND } from "@/lib/brand";
import { SUITABILITY_DESCRIPTIONS } from "@/lib/engine/types";
import { NAMED_JURISDICTIONS } from "./copy";
import { JURISDICTION_LABELS } from "@/data/types";

export interface FaqItem {
  id: string;
  question: string;
  /** Plain text so it can also feed FAQPage JSON-LD. */
  answer: string;
  link?: { href: string; label: string };
}

const jurisdictionList = NAMED_JURISDICTIONS.map((j) => JURISDICTION_LABELS[j]).join(", ");

/** Eight questions shown on the home page (and first on /faq). */
export const HOME_FAQ: FaqItem[] = [
  {
    id: "medical-advice",
    question: "Is this medical advice?",
    answer:
      `No. ${BRAND.displayName} provides educational information and a structured summary of published research and regulatory status. It does not diagnose or treat any condition and does not tell you to take anything. The report is designed to be taken to a qualified healthcare professional, who can consider it alongside your full history.`,
    link: { href: "/safety", label: "Read the safety page" },
  },
  {
    id: "regulatory-source",
    question: "Where does the regulatory status come from?",
    answer:
      `From a database we maintain by hand for the ${jurisdictionList}, plus a general entry for other jurisdictions. Each entry records the regulator, the licensed indication where one exists, any caveats, and the date it was last reviewed. Status is never inferred by software — if we have not confirmed it, the entry says “Unclear”.`,
    link: { href: "/methodology", label: "How the database is maintained" },
  },
  {
    id: "sell",
    question: "Do you sell peptides?",
    answer:
      "No. We never sell peptides, link to vendors, or accept payment or commission from anyone who does. Many compounds in the database are not authorised as medicines in any jurisdiction, and the site says so plainly.",
  },
  {
    id: "privacy",
    question: "Is my data private?",
    answer:
      "Your answers are stored only in your browser’s local storage so you can pause and resume. Nothing is transmitted to a server unless you explicitly request a clinician review and provide an email address. There are no accounts. Clearing the site’s data in your browser, or choosing “Start over”, removes everything.",
    link: { href: "/privacy", label: "Privacy notice" },
  },
  {
    id: "medicines",
    question: "Why do you ask about medicines?",
    answer:
      "Interactions are one of the most common reasons a compound is flagged. The rules engine checks each compound’s documented interactions against the classes of medicine you list — for example incretin medicines with insulin or sulfonylureas, or absorption-sensitive medicines such as levothyroxine and warfarin. Without this information the report cannot assess suitability, and it will say so.",
  },
  {
    id: "higher-concern",
    question: "What does “Higher concern” mean?",
    answer:
      `${SUITABILITY_DESCRIPTIONS.higher_concern} It is not a clinical determination and it does not mean a compound is unsafe for everyone — it means your report has identified something a professional should review first, and it tells you what that is.`,
  },
  {
    id: "athletes",
    question: "Can I use this if I’m an athlete?",
    answer:
      "Yes. Many peptides are prohibited at all times or in competition under the World Anti-Doping Code, and some are prohibited even when they are licensed medicines. Every compound record carries its anti-doping status, it is shown on compound pages and in comparisons, and the report flags prohibited substances when performance is your goal. Check with your sport’s anti-doping body before using anything.",
  },
  {
    id: "reviewers",
    question: "Who reviews the database?",
    answer:
      "Compound records are written from regulator labels and peer-reviewed trials — every record lists its references — and are reviewed by our team before publication. Each record and each regulatory entry shows the date it was last reviewed. If you find an error, email us and we will correct it.",
    link: { href: "/about", label: "About the team" },
  },
];

/** Six additional questions for /faq. */
export const MORE_FAQ: FaqItem[] = [
  {
    id: "dosing",
    question: "Does the report tell me what dose to take?",
    answer:
      "No. Dosing appears as research information: the doses, durations and routes used in published human studies, together with their outcomes and adverse events. If you enter a dose you are considering, the report states how it compares with those study exposures — within, above or below — and whether the frequency or route differs. It never recommends a dose.",
  },
  {
    id: "stacks",
    question: "What about combinations (“stacks”)?",
    answer:
      "If you select two or more compounds, the report includes a stack analysis: whether the combination has been studied in humans, overlapping considerations such as two compounds acting on the same pathway, the number of evidence gaps, and an overall uncertainty rating with a plain-English summary.",
  },
  {
    id: "source",
    question: "Why do you ask where I would get the product from?",
    answer:
      "Because source changes the risk. A prescription-only medicine dispensed by a licensed pharmacy is a different proposition from a “research-grade” vial bought online. The optional Product & source section lets the report comment on documentation, authorisation and counterfeit risk. You can skip it, and the report will note that it did not assess source.",
  },
  {
    id: "print",
    question: "Can I print or save my report?",
    answer:
      "Yes. The report page has a print / save option that produces a clean copy without site navigation, suitable for taking to an appointment. Because nothing is stored on our servers, keeping a copy is up to you.",
  },
  {
    id: "delete",
    question: "How do I delete my data?",
    answer:
      "Choose “Start over” on the assessment page, or clear this site’s data in your browser settings. There is no account and no server-side copy, so there is nothing else to delete.",
  },
  {
    id: "clinician-review",
    question: "Can a clinician review my report?",
    answer:
      `At the end of the assessment you can ask to be contacted for a professional review. This is the only point at which information leaves your device, and only if you explicitly consent and provide an email address. You can also email ${BRAND.supportEmail}.`,
  },
];

export const ALL_FAQ: FaqItem[] = [...HOME_FAQ, ...MORE_FAQ];
