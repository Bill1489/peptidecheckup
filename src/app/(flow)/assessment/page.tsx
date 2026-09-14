import type { Metadata } from "next";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { AssessmentIntro } from "@/components/assessment/intro";

export const metadata: Metadata = {
  title: { absolute: `Start your ${BRAND.displayName} assessment` },
  description: `Answer a few structured questions about your goal, the compounds you're considering and your health. ${BRAND.displayName} maps your answers against the published evidence and regulatory status and builds a report to discuss with a clinician. Around 7 minutes, private, no account.`,
  alternates: { canonical: "/assessment/" },
  openGraph: {
      images: OG_IMAGES,
    title: `Start your ${BRAND.displayName} assessment`,
    description: "Evidence grades, regulatory status for your country, personal suitability flags and questions for your clinician — in about 7 minutes.",
    url: "/assessment/",
  },
};

export default function AssessmentEntryPage() {
  return <AssessmentIntro />;
}
