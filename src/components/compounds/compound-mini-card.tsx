import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FAMILY_LABELS, HUMAN_EVIDENCE_LABELS, type Compound } from "@/data/types";
import { compoundHref } from "@/lib/compare";
import { cn } from "@/lib/utils";
import { MeterLabel } from "./primitives";

/**
 * Compact link cell used for alternatives and related compounds. Inverts to
 * ink on hover. Server-safe: no preferences (regulatory status is
 * jurisdiction-specific and lives on the full record).
 */
export function CompoundMiniCard({
  compound,
  note,
  className,
}: {
  compound: Compound;
  /** Optional one-line context, e.g. why it is listed as an alternative */
  note?: string;
  className?: string;
}) {
  return (
    <Link
      href={compoundHref(compound.slug)}
      className={cn(
        "group flex h-full flex-col bg-white p-4 text-ink transition-colors duration-150 hover:bg-ink hover:text-white sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="label-mono break-words group-hover:text-white/60">{FAMILY_LABELS[compound.family]}</p>
        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
      </div>
      <h3 className="font-display mt-3 break-words text-[1.25rem] uppercase leading-[0.98]">{compound.name}</h3>
      <p className="label-mono mt-1.5 break-words group-hover:text-white/60" title={compound.classLabel}>
        {compound.classLabel}
      </p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3 group-hover:text-white/80">{note ?? compound.tagline}</p>
      <div className="mt-auto flex flex-col items-start gap-2 border-t border-line pt-4 group-hover:border-white/20">
        <MeterLabel level={compound.overallEvidence} chip />
        <span className="label-mono group-hover:text-white/60">{HUMAN_EVIDENCE_LABELS[compound.humanEvidenceLevel]}</span>
      </div>
    </Link>
  );
}
