import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { AssessmentWizard } from "@/components/assessment/wizard";

export const metadata: Metadata = {
  title: "Your assessment",
  description: `The ${BRAND.displayName} questionnaire — your goal, what you're considering, your health and your medicines. Answers stay on your device.`,
  robots: { index: false, follow: false },
};

export default function AssessmentStartPage() {
  return <AssessmentWizard />;
}
