"use client";

import { JURISDICTION_LABELS } from "@/data/types";
import { SELECTABLE_JURISDICTIONS, type SelectableJurisdiction } from "@/lib/compare";
import { Segmented } from "./segmented";

const OPTIONS = SELECTABLE_JURISDICTIONS.map((j) => ({ value: j, label: j, title: JURISDICTION_LABELS[j] }));

/** Segmented control for the five main jurisdictions (radio-group semantics, arrow-key navigation). */
export function JurisdictionSwitch({
  value,
  onChange,
  className,
  label = "Regulatory jurisdiction",
}: {
  value: SelectableJurisdiction;
  onChange: (value: SelectableJurisdiction) => void;
  className?: string;
  label?: string;
}) {
  return <Segmented options={OPTIONS} value={value} onChange={onChange} label={label} className={className} />;
}
