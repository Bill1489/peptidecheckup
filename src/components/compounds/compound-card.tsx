"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { REGULATORY_TONE, RegulatoryBadge } from "@/components/ui/badge";
import { GOAL_MAP } from "@/data/goals";
import { EVIDENCE_RANK, FAMILY_LABELS, type Compound, type Jurisdiction } from "@/data/types";
import { commerceForCompound, compoundHref, type CommerceState } from "@/lib/compare";
import { cn } from "@/lib/utils";
import { BADGE_INVERT, Marker, MeterLabel } from "./primitives";

const MAX_GOAL_TAGS = 2;

/** Text that dims on the white card and stays readable once the card inverts to ink. */
const MUTED = "text-muted group-hover:text-white/60";
const RULE = "border-line group-hover:border-white/20";

const SHOP_LINK: Record<CommerceState, string> = {
  buy: "Shop",
  consultation: "Consult",
  not_sold: "Read why",
  unstocked: "Notify",
};

/**
 * Directory cell. The whole card links to the compound via a stretched link on
 * the name; the compare checkbox and shop link sit above it so all three stay
 * reachable by pointer and keyboard. Hovering inverts the card to ink. The
 * commerce line names the pen that carries the compound — its own pen or the
 * blend it is part of — with the pen's photograph and packaging swatch.
 */
export function CompoundCard({
  compound,
  jurisdiction,
  selected,
  onToggleCompare,
  className,
}: {
  compound: Compound;
  jurisdiction: Jurisdiction;
  selected: boolean;
  onToggleCompare: (slug: string) => void;
  className?: string;
}) {
  const goals = [...compound.goals].sort((a, b) => EVIDENCE_RANK[b.evidence] - EVIDENCE_RANK[a.evidence]);
  const visibleGoals = goals.slice(0, MAX_GOAL_TAGS);
  const hiddenGoals = goals.length - visibleGoals.length;
  const status = compound.regulatory[jurisdiction].status;
  const wada = compound.wadaProhibited;
  const commerce = commerceForCompound(compound.slug);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col bg-white text-ink transition-colors duration-150 hover:bg-ink hover:text-white",
        selected && "outline-2 -outline-offset-2 outline-brand-600",
        className,
      )}
    >
      {/* Head: family tag + compare checkbox */}
      <div className={cn("flex items-center justify-between gap-2 border-b pl-3 pr-0 sm:pl-4", RULE)}>
        <p className={cn("label-mono min-w-0 truncate", MUTED)} title={FAMILY_LABELS[compound.family]}>
          {FAMILY_LABELS[compound.family]}
        </p>
        <button
          type="button"
          role="checkbox"
          aria-checked={selected}
          aria-label={selected ? `Remove ${compound.name} from comparison` : `Add ${compound.name} to comparison`}
          onClick={() => onToggleCompare(compound.slug)}
          className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center border transition-colors duration-150",
              selected ? "border-brand-600 bg-brand-600 text-white" : "border-ink bg-white group-hover:border-white group-hover:bg-ink",
            )}
            aria-hidden
          >
            {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-3 pb-4 pt-3 sm:px-4">
        <h3 className="font-display break-words text-[1.15rem] uppercase leading-[0.98] sm:text-[1.35rem]">
          <Link
            href={compoundHref(compound.slug)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand-600"
          >
            {compound.name}
          </Link>
        </h3>
        <p className={cn("label-mono mt-2 truncate", MUTED)} title={compound.classLabel}>
          {compound.classLabel}
        </p>
        <p className="mt-2.5 line-clamp-2 text-[13px] leading-snug text-ink-3 group-hover:text-white/80">{compound.tagline}</p>

        <div className="mt-4 flex flex-col items-start gap-2">
          <MeterLabel level={compound.overallEvidence} chip />
          <div className="flex flex-wrap items-center gap-2">
            <RegulatoryBadge status={status} size="xs" className={BADGE_INVERT[REGULATORY_TONE[status]]} />
            <span className={cn("label-mono", MUTED)}>{jurisdiction}</span>
          </div>
        </div>

        <ul className={cn("label-mono mt-3 flex flex-wrap gap-x-3 gap-y-1", MUTED)} aria-label="Researched for">
          {visibleGoals.map((g) => (
            <li key={g.goal} title={GOAL_MAP[g.goal].label}>
              {GOAL_MAP[g.goal].short}
            </li>
          ))}
          {hiddenGoals > 0 && <li className="tnum">+{hiddenGoals}</li>}
          {wada && (
            <li className="flex items-center gap-1.5 text-accent-700 group-hover:text-accent-300">
              <Marker className="bg-accent-500" />
              {wada === "in_competition" ? "WADA · in competition" : "WADA prohibited"}
            </li>
          )}
        </ul>
      </div>

      {/* Commerce line: the pen that carries this compound, or "not in the range" */}
      <div className={cn("mt-auto flex min-h-11 items-center gap-3 border-t pl-3 pr-1 sm:pl-4 sm:pr-2", RULE)}>
        {commerce.product && (
          <div className={cn("my-2 shrink-0 border bg-white", RULE)} aria-hidden>
            <ProductImage product={commerce.product} prefer="pack" frame="square" className="h-12 w-12" sizes="48px" />
          </div>
        )}
        <div className="min-w-0 flex-1 py-2">
          <p className="font-mono text-[11px] uppercase leading-tight tracking-[0.08em] tnum">
            {commerce.price ?? commerce.priceLabel}
            {commerce.state === "buy" && <span className={MUTED}> · {commerce.availabilityLabel}</span>}
          </p>
          {commerce.product ? (
            <p className={cn("label-mono mt-1 flex items-center gap-1.5 text-[10px]", MUTED)}>
              <ProductSwatch product={commerce.product} className="h-2 w-2" />
              <span className="truncate">
                In the range · {commerce.product.name}
                {commerce.inBlend && " (blend)"}
              </span>
            </p>
          ) : (
            commerce.channelLabel && <p className={cn("label-mono mt-0.5 truncate text-[10px]", MUTED)}>{commerce.channelLabel}</p>
          )}
        </div>
        {commerce.product && (
          <Link
            href={commerce.href}
            className="link-rule relative z-10 inline-flex h-11 shrink-0 items-center gap-0.5 px-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink group-hover:text-white"
          >
            {SHOP_LINK[commerce.state]}
            <ArrowUpRight className="h-3 w-3" aria-hidden />
            <span className="sr-only">: {commerce.product.name}</span>
          </Link>
        )}
      </div>
    </article>
  );
}
