import type { Metadata } from "next";
import { ReportView } from "@/components/report/report-view";

export const metadata: Metadata = {
  title: "Your personal peptide report",
  description:
    "A deterministic, clinician-reviewable summary of how your goal, medical history and medicines map onto the published evidence and regulatory status of the peptides you are considering.",
  robots: { index: false, follow: false },
};

export default function ReportPage() {
  return <ReportView />;
}
