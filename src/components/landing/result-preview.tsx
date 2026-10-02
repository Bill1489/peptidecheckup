import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { evidenceForGoal, primaryGoalEvidence, productCompounds } from "@/components/commerce/product-utils";
import { penDose, penPrice } from "@/components/marketing/copy";
import { EvidenceBadge, RegulatoryBadge } from "@/components/ui/badge";
import { GOAL_MAP } from "@/data/goals";
import type { Product } from "@/data/products";
import type { GoalId } from "@/data/types";
import { JURISDICTION_LABELS } from "@/data/types";
import { HOME_JURISDICTION, HOME_JURISDICTION_NAMED } from "@/components/marketing/copy";
import { VERDICT_LABELS } from "@/lib/match/types";

/**
 * What the end of the Checkup looks like, before anyone has answered a
 * question: a real pen from the catalogue laid out as a result — name, dose,
 * price, the evidence grade for the goal and the regulatory status in the
 * home market, then the catalogue's own "who this is for" lines as the
 * reasons. Under it, the other outcome, so the honesty claim is visible
 * rather than asserted.
 */
export function ResultPreview({ product, goal, className }: { product: Product; goal: GoalId; className?: string }) {
  const goalDef = GOAL_MAP[goal];
  const evidence = evidenceForGoal(product, goal) ?? primaryGoalEvidence(product)?.level;
  const evidenceGoal = evidenceForGoal(product, goal) ? goalDef.short : primaryGoalEvidence(product) ? GOAL_MAP[primaryGoalEvidence(product)!.goal].short : goalDef.short;
  const compound = productCompounds(product)[0];
  const regulatory = HOME_JURISDICTION_NAMED && compound ? compound.regulatory[HOME_JURISDICTION] : undefined;
  const reasons = product.matchFor.slice(0, 3);

  return (
    <div className={className}>
      <div className="border border-ink bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-ink px-4 py-2.5">
          <p className="label-mono text-brand-600">{VERDICT_LABELS.match}</p>
          <p className="label-mono">Sample result</p>
        </div>
        <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:p-5">
          <div className="border border-ink bg-white">
            <ProductImage product={product} prefer="pack" frame="square" sizes="136px" priority />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ProductSwatch product={product} />
              <p className="min-w-0 break-words font-display text-[1.4rem] uppercase leading-none tracking-[-0.02em] text-ink sm:text-[1.7rem]">{product.name}</p>
            </div>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              {penDose(product)} · <span className="tnum text-ink">{penPrice(product)}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {evidence && <EvidenceBadge level={evidence} size="xs" prefix={`${evidenceGoal} ·`} />}
              {regulatory && <RegulatoryBadge status={regulatory.status} size="xs" />}
            </div>
            {regulatory && (
              <p className="mt-2 text-[12px] leading-snug text-muted">
                {JURISDICTION_LABELS[HOME_JURISDICTION]} · {regulatory.summary}
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-ink px-4 py-4 sm:px-5">
          <p className="label-mono">Why it fits · from the answers</p>
          <ul className="mt-2.5 grid gap-2">
            {reasons.map((reason) => (
              <li key={reason} className="flex gap-2.5 text-[13.5px] leading-snug text-ink">
                <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden />
                <span className="min-w-0 break-words">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border border-t-0 border-ink bg-ink p-4 text-white sm:p-5">
        <p className="label-mono text-accent-400">{VERDICT_LABELS.not_recommended}</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/80">
          The other outcome. A safety flag or a <span className="text-white">Higher concern</span> label rules a pen out — nothing goes in your cart; you get
          the reasons and a clinician link instead.
        </p>
      </div>
    </div>
  );
}
