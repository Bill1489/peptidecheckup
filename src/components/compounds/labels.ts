import type { ComponentProps } from "react";
import type { Badge } from "@/components/ui/badge";
import type { Compound, Contraindication, Interaction, StackEvidence } from "@/data/types";

type Tone = NonNullable<ComponentProps<typeof Badge>["tone"]>;

type PregnancyStatus = Compound["pregnancy"]["status"];

export const PREGNANCY_LABELS: Record<PregnancyStatus, string> = {
  contraindicated: "Contraindicated",
  not_recommended: "Not recommended",
  insufficient_data: "Insufficient data",
  not_applicable: "Not applicable",
};

export const PREGNANCY_TONE: Record<PregnancyStatus, Tone> = {
  contraindicated: "danger",
  not_recommended: "warning",
  insufficient_data: "neutral",
  not_applicable: "neutral",
};

export const STACK_EVIDENCE_LABELS: Record<StackEvidence, string> = {
  studied: "Studied together in humans",
  limited: "Limited human data",
  none: "No human studies",
};

export const STACK_EVIDENCE_TONE: Record<StackEvidence, Tone> = {
  studied: "success",
  limited: "warning",
  none: "neutral",
};

/** Square marker fills (see `Marker` in ./primitives). Cobalt = studied, amber = limited, outlined = no data. */
export const STACK_EVIDENCE_MARKER: Record<StackEvidence, string> = {
  studied: "bg-brand-600",
  limited: "bg-caution",
  none: "border border-ink bg-white",
};

export const INTERACTION_SEVERITY_LABELS: Record<Interaction["severity"], string> = {
  major: "Major",
  moderate: "Moderate",
  minor: "Minor",
};

export const INTERACTION_SEVERITY_TONE: Record<Interaction["severity"], Tone> = {
  major: "danger",
  moderate: "warning",
  minor: "neutral",
};

/** Orange = major, amber = moderate, grey = minor. */
export const INTERACTION_SEVERITY_MARKER: Record<Interaction["severity"], string> = {
  major: "bg-accent-500",
  moderate: "bg-caution",
  minor: "bg-muted-2",
};

export const INTERACTION_SEVERITY_DESCRIPTIONS: Record<Interaction["severity"], string> = {
  major: "Combination should be reviewed by a prescriber before use.",
  moderate: "Monitoring or dose review is usually advised.",
  minor: "Generally compatible; awareness is sufficient.",
};

export const CONTRAINDICATION_LABELS: Record<Contraindication["severity"], string> = {
  absolute: "Do not use",
  caution: "Caution",
};

export const CONTRAINDICATION_TONE: Record<Contraindication["severity"], Tone> = {
  absolute: "danger",
  caution: "warning",
};

export const CONTRAINDICATION_MARKER: Record<Contraindication["severity"], string> = {
  absolute: "bg-accent-500",
  caution: "bg-caution",
};
