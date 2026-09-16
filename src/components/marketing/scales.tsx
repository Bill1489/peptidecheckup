import { COMPOUNDS } from "@/data/compounds";
import {
  EVIDENCE_DESCRIPTIONS,
  EVIDENCE_LABELS,
  type EvidenceQuality,
  type RegulatoryStatus,
} from "@/data/types";
import { SUITABILITY_DESCRIPTIONS, type Suitability } from "@/lib/engine/types";
import { EvidenceMeter, RegulatoryBadge, SuitabilityBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { pluralise } from "./copy";

export const EVIDENCE_ORDER: EvidenceQuality[] = ["strong", "moderate", "limited", "preliminary", "insufficient"];
export const REGULATORY_ORDER: RegulatoryStatus[] = ["authorised", "investigational", "not_authorised", "unclear"];
export const SUITABILITY_ORDER: Suitability[] = ["potentially_relevant", "higher_concern", "insufficient_information"];

/** Plain-English meaning of each regulatory status, as used on compound pages and in reports. */
export const REGULATORY_DESCRIPTIONS: Record<RegulatoryStatus, string> = {
  authorised:
    "Licensed as a medicine for at least one indication by that jurisdiction’s regulator. Usually prescription-only, and only for the licensed use.",
  investigational:
    "In registered human clinical trials in that jurisdiction but not licensed. Legitimate access is normally through a trial.",
  not_authorised:
    "Not licensed as a medicine in that jurisdiction. Products sold anyway are supplied outside any licence — ours under research-use labelling, with batch testing; most others with neither.",
  unclear: "We could not confirm the status from regulator sources at the last review. Treated cautiously in reports until confirmed.",
};

/** The five-grade ladder as bordered rows: meter · label · definition · (count of compounds). */
export function EvidenceScale({ counts = false, className }: { counts?: boolean; className?: string }) {
  return (
    <ol className={cn("border-t border-ink", className)}>
      {EVIDENCE_ORDER.map((level) => {
        const n = COMPOUNDS.filter((c) => c.overallEvidence === level).length;
        return (
          <li
            key={level}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-b border-ink py-4 sm:grid-cols-[5.5rem_9rem_1fr_auto] sm:items-center"
          >
            <EvidenceMeter level={level} className="translate-y-px" />
            <span className="font-display text-[1rem] uppercase leading-none tracking-[-0.02em] text-ink">
              {EVIDENCE_LABELS[level]}
            </span>
            <span className="col-span-2 text-[13px] leading-relaxed text-muted sm:col-span-1">{EVIDENCE_DESCRIPTIONS[level]}</span>
            {counts && (
              <span className="col-span-2 label-mono tnum sm:col-span-1 sm:text-right">
                {n > 0 ? pluralise(n, "compound") : "None graded"}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function RegulatoryScale({ className }: { className?: string }) {
  return (
    <ul className={cn("border-t border-ink", className)}>
      {REGULATORY_ORDER.map((status) => (
        <li key={status} className="grid gap-2 border-b border-ink py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <div>
            <RegulatoryBadge status={status} size="sm" />
          </div>
          <p className="text-[13px] leading-relaxed text-muted">{REGULATORY_DESCRIPTIONS[status]}</p>
        </li>
      ))}
    </ul>
  );
}

export function SuitabilityScale({ className }: { className?: string }) {
  return (
    <ul className={cn("border-t border-ink", className)}>
      {SUITABILITY_ORDER.map((level) => (
        <li key={level} className="grid gap-2 border-b border-ink py-4 sm:grid-cols-[13rem_1fr] sm:gap-4">
          <div>
            <SuitabilityBadge level={level} size="sm" />
          </div>
          <p className="text-[13px] leading-relaxed text-muted">{SUITABILITY_DESCRIPTIONS[level]}</p>
        </li>
      ))}
    </ul>
  );
}
