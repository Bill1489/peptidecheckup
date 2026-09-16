import type { Report } from "@/lib/engine/types";

export type ReportSectionId =
  | "overview"
  | "objective"
  | "considering"
  | "evidence"
  | "regulatory"
  | "suitability"
  | "matches"
  | "dosing"
  | "stack"
  | "not-recommended"
  | "options"
  | "questions"
  | "source"
  | "next-steps";

export interface ReportSectionDef {
  id: ReportSectionId;
  /** Short label used in the mono section label and the table of contents */
  label: string;
  /** Uppercase display heading */
  heading: string;
  /** Two-digit number ("01"); empty for the overview */
  number: string;
  /** Start a new page when printing */
  printBreak?: boolean;
}

const ORDERED: Omit<ReportSectionDef, "number">[] = [
  { id: "overview", label: "Overview", heading: "Your personal peptide report" },
  { id: "objective", label: "Your objective", heading: "What you want to achieve" },
  { id: "considering", label: "What you are considering", heading: "The compounds you have in mind" },
  { id: "evidence", label: "Evidence assessment", heading: "What the research shows for your goal" },
  { id: "regulatory", label: "Regulatory status", heading: "Where each compound stands where you live" },
  { id: "suitability", label: "Personal suitability", heading: "How your responses map onto each compound" },
  { id: "matches", label: "Your matches", heading: "What goes in your cart, and what does not" },
  {
    id: "dosing",
    label: "Dosing — three layers",
    heading: "Published exposures against the dose you are considering",
    printBreak: true,
  },
  { id: "stack", label: "Stack intelligence", heading: "What is known about combining these compounds" },
  {
    id: "not-recommended",
    label: "Review required",
    heading: "What we would not recommend proceeding with without professional review",
  },
  { id: "options", label: "Other options", heading: "Other options researched for your goal" },
  {
    id: "questions",
    label: "Questions to ask a clinician",
    heading: "Take these questions to your appointment",
    printBreak: true,
  },
  { id: "source", label: "Product & source", heading: "Where the product would come from" },
  { id: "next-steps", label: "Next steps", heading: "What to do with this report" },
];

/** Sections present for a given report, numbered contiguously (the overview is unnumbered). */
export function reportSections(report: Report): ReportSectionDef[] {
  let n = 0;
  return ORDERED.filter((s) => s.id !== "stack" || Boolean(report.stack)).map((s) => ({
    ...s,
    number: s.id === "overview" ? "" : String(++n).padStart(2, "0"),
  }));
}
