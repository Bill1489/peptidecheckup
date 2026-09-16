import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EvidenceBadge, EvidenceMeter, RegulatoryBadge } from "@/components/ui/badge";
import type { Compound } from "@/data/types";
import { HUMAN_EVIDENCE_LABELS } from "@/data/types";
import { formatDate } from "@/lib/utils";

function wadaLine(compound: Compound) {
  if (compound.wadaProhibited === true) return "Prohibited at all times";
  if (compound.wadaProhibited === "in_competition") return "Prohibited in competition";
  return "Not on the Prohibited List";
}

/** Pulls the compound's evidence and regulatory position onto the product page. */
export function EvidencePanel({ compound, className }: { compound: Compound; className?: string }) {
  const uk = compound.regulatory.UK;
  return (
    <section className={className} aria-labelledby="evidence-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">Evidence record · reviewed {formatDate(compound.lastReviewed, { month: "short" })}</p>
          <h2 id="evidence-heading" className="mt-1.5 text-[1.25rem] uppercase">
            What the research says about {compound.name}
          </h2>
        </div>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-3">{compound.tagline}.</p>

      <dl className="cell-grid mt-4 grid-cols-2">
        <div className="p-4">
          <dt className="label-mono">Overall evidence</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-2">
            <EvidenceMeter level={compound.overallEvidence} />
            <EvidenceBadge level={compound.overallEvidence} size="xs" />
          </dd>
        </div>
        <div className="p-4">
          <dt className="label-mono">Human evidence</dt>
          <dd className="mt-2 text-[13px] leading-snug text-ink">{HUMAN_EVIDENCE_LABELS[compound.humanEvidenceLevel]}</dd>
        </div>
        <div className="p-4">
          <dt className="label-mono">Regulatory · UK</dt>
          <dd className="mt-2">
            <RegulatoryBadge status={uk.status} size="xs" />
            <p className="mt-2 text-[12.5px] leading-snug text-muted">{uk.summary}</p>
          </dd>
        </div>
        <div className="p-4">
          <dt className="label-mono">Anti-doping · WADA</dt>
          <dd className="mt-2 text-[13px] leading-snug text-ink">
            {wadaLine(compound)}
            {compound.wadaProhibited && <p className="mt-2 text-[12.5px] leading-snug text-muted">Relevant if you compete in tested sport.</p>}
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-px border border-ink bg-ink sm:grid-cols-2">
        <Link
          href={`/peptides/${compound.slug}/`}
          className="flex h-12 items-center justify-between bg-white px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Read the evidence
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <Link
          href={`/assessment/?compound=${compound.slug}`}
          className="flex h-12 items-center justify-between bg-white px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brand-600 hover:text-white"
        >
          Check my fit
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
