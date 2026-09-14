import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, EvidenceMeter } from "@/components/ui/badge";
import { EVIDENCE_LABELS, FAMILY_LABELS, HUMAN_EVIDENCE_LABELS, type Compound } from "@/data/types";
import { cn } from "@/lib/utils";
import { compoundHref } from "@/lib/compare";

/**
 * Compact link card used for alternatives and related compounds.
 * Server-safe: no preferences (regulatory status is jurisdiction-specific).
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
        "group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge tone="neutral" size="xs">
          {FAMILY_LABELS[compound.family]}
        </Badge>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-muted-2 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          aria-hidden
        />
      </div>
      <h3 className="mt-3 font-display text-xl leading-tight text-ink">{compound.name}</h3>
      <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-brand-700">{compound.classLabel}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{note ?? compound.tagline}</p>
      <div className="mt-auto flex flex-col gap-1.5 border-t border-line pt-4">
        <span className="flex items-center gap-2 text-xs font-medium text-ink">
          <EvidenceMeter level={compound.overallEvidence} />
          {EVIDENCE_LABELS[compound.overallEvidence]}
        </span>
        <span className="text-xs leading-snug text-muted">{HUMAN_EVIDENCE_LABELS[compound.humanEvidenceLevel]}</span>
      </div>
    </Link>
  );
}
