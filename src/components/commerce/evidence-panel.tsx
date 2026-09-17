import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EvidenceBadge, EvidenceMeter, RegulatoryBadge } from "@/components/ui/badge";
import { assessmentPath, blendStackNotes, isBlend, productComponents, type ProductComponent } from "@/components/commerce/product-utils";
import type { Product } from "@/data/products";
import type { Compound, StackEvidence, StackNote } from "@/data/types";
import { HUMAN_EVIDENCE_LABELS } from "@/data/types";
import { formatDate } from "@/lib/utils";

function wadaLine(compound: Compound) {
  if (compound.wadaProhibited === true) return "Prohibited at all times";
  if (compound.wadaProhibited === "in_competition") return "Prohibited in competition";
  return "Not on the Prohibited List";
}

const STACK_LABELS: Record<StackEvidence, string> = {
  studied: "Studied together in people",
  limited: "Limited data on the combination",
  none: "Not studied together in people",
};

/**
 * Pulls each component's evidence and regulatory position onto the pen page.
 * Single-compound pens get one record; blends get one row per component with
 * the stack note between neighbours, so the combination is graded honestly.
 */
export function EvidencePanel({ product, className }: { product: Product; className?: string }) {
  const components = productComponents(product);
  const blend = isBlend(product);
  const notes = blend ? blendStackNotes(product) : [];
  const reviewedDates = components.map((c) => c.compound?.lastReviewed).filter((d): d is string => Boolean(d)).sort();
  const reviewed = reviewedDates[reviewedDates.length - 1];
  const first = components.find((c) => c.compound)?.compound;

  return (
    <section className={className} aria-labelledby="evidence-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">
            Evidence record{reviewed ? ` · reviewed ${formatDate(reviewed, { month: "short" })}` : ""}
            {blend ? ` · ${components.length} components` : ""}
          </p>
          <h2 id="evidence-heading" className="mt-1.5 text-[1.25rem] uppercase">
            {blend ? `What the research says about each component` : `What the research says about ${first?.name ?? product.name}`}
          </h2>
        </div>
      </div>

      {blend && (
        <p className="mt-3 text-[14px] leading-relaxed text-ink-3">
          Each component has its own record. The combination in this pen has not been studied in people, so the grades below are per component,
          not for the blend.
        </p>
      )}

      <div className="mt-4">
        {components.map((c, i) => (
          <div key={c.slug}>
            {i > 0 && notes[i - 1] && <StackNoteStrip note={notes[i - 1].note} a={notes[i - 1].a} b={notes[i - 1].b} />}
            {c.compound ? <CompoundRecord compound={c.compound} compact={blend} /> : <PendingRecord component={c} />}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-px border border-ink bg-ink sm:grid-cols-2">
        <Link
          href={first ? `/peptides/${first.slug}/` : "/peptides/"}
          className="flex h-12 items-center justify-between bg-white px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          {blend ? "Read the evidence records" : "Read the evidence"}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <Link
          href={assessmentPath(product)}
          className="flex h-12 items-center justify-between bg-white px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brand-600 hover:text-white"
        >
          Check my fit
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

function CompoundRecord({ compound, compact }: { compound: Compound; compact: boolean }) {
  const uk = compound.regulatory.UK;
  return (
    <article className="border border-ink" aria-label={`${compound.name} — evidence record`}>
      {compact && (
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink px-4 py-3">
          <h3 className="text-[15px] font-semibold text-ink">{compound.name}</h3>
          <p className="text-[12.5px] text-muted">{compound.classLabel}</p>
        </header>
      )}
      <p className="px-4 pt-3 text-[13.5px] leading-relaxed text-ink-3">{compound.tagline}.</p>
      <dl className="grid grid-cols-2 gap-px border-t border-ink bg-ink mt-3">
        <div className="bg-white p-4">
          <dt className="label-mono">Overall evidence</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-2">
            <EvidenceMeter level={compound.overallEvidence} />
            <EvidenceBadge level={compound.overallEvidence} size="xs" />
          </dd>
        </div>
        <div className="bg-white p-4">
          <dt className="label-mono">Human evidence</dt>
          <dd className="mt-2 text-[13px] leading-snug text-ink">{HUMAN_EVIDENCE_LABELS[compound.humanEvidenceLevel]}</dd>
        </div>
        <div className="bg-white p-4">
          <dt className="label-mono">Regulatory · UK</dt>
          <dd className="mt-2">
            <RegulatoryBadge status={uk.status} size="xs" />
            <p className="mt-2 text-[12.5px] leading-snug text-muted">{uk.summary}</p>
          </dd>
        </div>
        <div className="bg-white p-4">
          <dt className="label-mono">Anti-doping · WADA</dt>
          <dd className="mt-2 text-[13px] leading-snug text-ink">
            {wadaLine(compound)}
            {compound.wadaProhibited && <p className="mt-2 text-[12.5px] leading-snug text-muted">Relevant if you compete in tested sport.</p>}
          </dd>
        </div>
      </dl>
      {compact && (
        <Link
          href={`/peptides/${compound.slug}/`}
          className="flex h-11 items-center justify-between border-t border-ink px-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          {compound.name} evidence record
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </article>
  );
}

function PendingRecord({ component }: { component: ProductComponent }) {
  return (
    <article className="border border-ink border-dashed p-4" aria-label={`${component.name} — evidence record pending`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[15px] font-semibold text-ink">{component.name}</h3>
        <p className="label-mono">Record pending</p>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        The evidence record for this component is being added to the database. Until it is published, treat the human evidence as ungraded.
      </p>
    </article>
  );
}

function StackNoteStrip({ note, a, b }: { note: StackNote | undefined; a: ProductComponent; b: ProductComponent }) {
  const label = note ? STACK_LABELS[note.evidence] : "No combination data on record";
  return (
    <div className="flex gap-3 border-x border-ink bg-paper-2 px-4 py-3" role="note" aria-label={`${a.name} with ${b.name}`}>
      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 bg-accent-500" aria-hidden />
      <div className="min-w-0">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink">
          {a.name} + {b.name} · {label}
        </p>
        {note?.note && <p className="mt-1 text-[12.5px] leading-relaxed text-ink-3">{note.note}</p>}
      </div>
    </div>
  );
}
