"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Copy, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Badge, EvidenceBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/commerce/product-visual";
import {
  AVAILABILITY_LABELS,
  CHANNEL_LABELS,
  defaultVariant,
  getProduct,
  getProductsForCompound,
  priceRange,
  productsForGoal,
  purchasable,
  type Product,
} from "@/data/products";
import { RESEARCH_USE_LABEL } from "@/lib/brand";
import { useCartStore } from "@/lib/commerce/cart-store";
import { COMMERCE } from "@/lib/commerce/config";
import { formatFrom, formatMoney } from "@/lib/commerce/money";
import { GOAL_ALIGNMENT_LABELS } from "@/lib/engine/labels";
import { SUITABILITY_LABELS, type CompoundReport, type Flag, type Report } from "@/lib/engine/types";
import { EVIDENCE_LABELS } from "@/data/types";
import { cn } from "@/lib/utils";
import { MonoLabel, ReportSection } from "../primitives";
import { scrollToSection } from "../report-toc";
import type { ReportSectionDef } from "../sections";

/* ------------------------------------------------------------------ */
/* Decision model                                                      */
/* ------------------------------------------------------------------ */

type MatchState =
  | { kind: "concern"; compound: CompoundReport; product: Product; reasons: Flag[] }
  | { kind: "not_sold"; compound: CompoundReport; product: Product }
  | { kind: "insufficient"; compound: CompoundReport; product: Product }
  | { kind: "consultation"; compound: CompoundReport; product: Product }
  | { kind: "match"; compound: CompoundReport; product: Product };

const SEVERITY_ORDER = { high: 0, caution: 1, info: 2 } as const;
const PROMO_CODE = "CHECKUP10";
const PROMO_MIN_COMPLETENESS = 60;

/** The product that best represents a compound: purchasable first, then consultation-gated, then whatever is listed. */
function primaryProduct(products: Product[]): Product {
  return products.find(purchasable) ?? products.find((p) => p.availability === "consultation") ?? products[0];
}

/** Top flags behind a Higher concern label, compound-specific first, then person-level. */
function concernReasons(compound: CompoundReport, globalFlags: Flag[]): Flag[] {
  const seen = new Set<string>();
  const unique: Flag[] = [];
  for (const f of [...compound.flags, ...globalFlags]) {
    if (f.severity === "info" || seen.has(f.id)) continue;
    seen.add(f.id);
    unique.push(f);
  }
  return unique.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]).slice(0, 2);
}

/**
 * Match states for every considered compound that has a linked product.
 * Precedence per compound: Higher concern (one card, never a price) → nothing
 * sellable (not-sold card, or an out-of-stock match without an Add button) →
 * Insufficient information (one unlock card) → one card per sellable product:
 * prescription products get a consultation card, everything else a match card.
 */
export function matchStates(report: Report): MatchState[] {
  const states: MatchState[] = [];
  for (const compound of report.compounds) {
    const products = getProductsForCompound(compound.slug);
    if (products.length === 0) continue;
    const primary = primaryProduct(products);

    if (compound.suitability === "higher_concern") {
      states.push({ kind: "concern", compound, product: primary, reasons: concernReasons(compound, report.globalFlags) });
      continue;
    }

    const sellable = products.filter((p) => purchasable(p) || p.availability === "consultation");
    if (sellable.length === 0) {
      const notSold = products.find((p) => p.availability === "not_sold");
      if (notSold) states.push({ kind: "not_sold", compound, product: notSold });
      else if (compound.suitability === "insufficient_information") states.push({ kind: "insufficient", compound, product: primary });
      else states.push({ kind: "match", compound, product: primary });
      continue;
    }

    if (compound.suitability === "insufficient_information") {
      states.push({ kind: "insufficient", compound, product: primary });
      continue;
    }

    for (const product of sellable) {
      if (product.channel === "prescription" || product.availability === "consultation") {
        states.push({ kind: "consultation", compound, product });
      } else {
        states.push({ kind: "match", compound, product });
      }
    }
  }
  return states;
}

/**
 * Up to three purchasable products researched for the goal that the user did
 * not consider. Anything linked to a considered compound — directly or inside
 * a kit — is excluded so a compound assessed above never reappears here.
 */
function alsoResearched(report: Report, shown: MatchState[]): Product[] {
  const goal = report.objective.goal;
  if (!goal || goal === "other") return [];
  const shownIds = new Set(shown.map((m) => m.product.id));
  const considered = new Set(report.compounds.map((c) => c.slug));
  const linkedToConsidered = (p: Product) =>
    Boolean(p.compoundSlug && considered.has(p.compoundSlug)) ||
    Boolean(p.bundleOf?.some((item) => considered.has(getProduct(item.productId)?.compoundSlug ?? "")));
  return productsForGoal(goal)
    .filter((p) => purchasable(p) && !shownIds.has(p.id) && !linkedToConsidered(p))
    .slice(0, 3);
}

function priceLabel(product: Product): string {
  const { min, max } = priceRange(product);
  if (min === 0) return "";
  return min === max ? formatMoney(min) : formatFrom(product.variants.map((v) => v.price).filter((p) => p > 0));
}

/** Leading sentences of a description (sentence ends are a full stop followed by a capital letter, so "0.9%" survives). */
function leadSentences(text: string, count: number): string {
  const sentences = text.match(/.*?[.!?](?=\s+[A-Z“"(]|\s*$)/g);
  if (!sentences) return text.trim();
  return sentences
    .slice(0, count)
    .map((s) => s.trim())
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function MatchesSection({ report, def }: { report: Report; def: ReportSectionDef }) {
  const states = React.useMemo(() => matchStates(report), [report]);
  /* Person-level review-required flags apply to every compound, so no unassessed products are suggested either. */
  const blocked = report.globalFlags.some((f) => f.severity === "high");
  const extras = React.useMemo(() => (blocked ? [] : alsoResearched(report, states)), [blocked, report, states]);
  const goalLabel = report.objective.goalLabel;
  const unlocked = !blocked && report.completeness.score >= PROMO_MIN_COMPLETENESS;

  /* A generated report that clears the threshold unlocks the assessment promo in the cart. */
  React.useEffect(() => {
    if (unlocked) useCartStore.getState().setAssessmentCompleted(true);
  }, [unlocked]);

  const empty = states.length === 0 && extras.length === 0;

  return (
    <ReportSection
      def={def}
      description="Products are matched to the suitability label each compound received above. A Potentially relevant label with a batch-tested product in stock can go in your cart; a Higher concern label never can, and links to a clinician instead."
    >
      {empty ? (
        <EmptyMatches blocked={blocked} />
      ) : (
        <ul className="space-y-4">
          {states.map((m) => (
            <li key={`${m.compound.slug}:${m.product.id}`}>
              <MatchCard state={m} />
            </li>
          ))}
        </ul>
      )}

      {blocked && states.length > 0 && (
        <p className="border border-ink border-l-[3px] border-l-accent-500 bg-white px-4 py-3.5 text-sm leading-relaxed text-ink-2">
          A review-required flag from your answers about yourself applies to everything you are considering, so this
          report does not suggest other products either. Speak to a clinician first.
        </p>
      )}

      {extras.length > 0 && (
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[1.2rem] uppercase leading-none text-ink">Also researched for {goalLabel.toLowerCase()}</h3>
            <MonoLabel className="tnum">
              {extras.length} product{extras.length === 1 ? "" : "s"}
            </MonoLabel>
          </div>
          <p className="mb-4 text-sm text-muted">
            Not assessed in this report — you did not include them in your assessment. Listed because they are researched
            for your goal, not because they suit you.
          </p>
          <ul className={cn("cell-grid", extras.length === 1 ? "sm:grid-cols-1" : extras.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
            {extras.map((p) => (
              <li key={p.id} className="flex flex-col p-4">
                <ExtraProduct product={p} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {unlocked && <PromoPanel />}

      <p className="text-xs leading-relaxed text-muted">
        Suitability labels describe whether your responses identified factors that warrant professional review — they are
        not a clinical determination. Products sold through the research channel carry this labelling: {RESEARCH_USE_LABEL}
      </p>
    </ReportSection>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

function MatchCard({ state }: { state: MatchState }) {
  switch (state.kind) {
    case "match":
      return <PurchasableCard compound={state.compound} product={state.product} />;
    case "consultation":
      return <ConsultationCard compound={state.compound} product={state.product} />;
    case "concern":
      return <ConcernCard compound={state.compound} product={state.product} reasons={state.reasons} />;
    case "insufficient":
      return <InsufficientCard compound={state.compound} product={state.product} />;
    case "not_sold":
      return <NotSoldCard compound={state.compound} product={state.product} />;
  }
}

function Visual({ product, muted, className }: { product: Product; muted?: boolean; className?: string }) {
  return (
    <div className={cn("h-24 w-24 shrink-0 border border-ink", muted && "opacity-50 grayscale", className)}>
      <ProductVisual product={product} grid={false} />
    </div>
  );
}

function WhyMatched({ compound }: { compound: CompoundReport }) {
  const evidence = compound.goalEvidence ?? compound.overallEvidence;
  return (
    <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
      <span className="label-mono mr-2 text-ink">Why it matched</span>
      {SUITABILITY_LABELS[compound.suitability]} · {GOAL_ALIGNMENT_LABELS[compound.goalAlignment].toLowerCase()} · evidence{" "}
      {EVIDENCE_LABELS[evidence].toLowerCase()}
    </p>
  );
}

function useAddToCart() {
  const router = useRouter();
  return React.useCallback(
    (product: Product) => {
      const variant = defaultVariant(product);
      const ok = useCartStore.getState().add(product.id, variant.id);
      if (ok) {
        toast("Added to cart", {
          description: `${product.name} · ${variant.label} · ${formatMoney(variant.price)}`,
          action: { label: "Checkout", onClick: () => router.push("/checkout/") },
        });
      } else {
        toast("Couldn't add to cart", { description: `${product.name} is not available to buy right now.` });
      }
    },
    [router],
  );
}

function PurchasableCard({ compound, product }: { compound: CompoundReport; product: Product }) {
  const add = useAddToCart();
  const variant = defaultVariant(product);
  const price = priceLabel(product);
  const canBuy = purchasable(product);
  const stockNote = product.availability !== "in_stock" ? AVAILABILITY_LABELS[product.availability] : undefined;

  return (
    <article className="border border-ink border-l-[3px] border-l-brand-600 bg-white p-4 sm:p-5" aria-label={`${product.name} — match`}>
      <div className="flex gap-4 sm:gap-5">
        <Visual product={product} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <MonoLabel className="text-brand-600">Match · {SUITABILITY_LABELS[compound.suitability]}</MonoLabel>
              <h3 className="mt-1.5 font-display text-[1.35rem] uppercase leading-none text-ink">{product.name}</h3>
              <p className="mt-1.5 text-[13px] text-muted">{product.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[1.1rem] font-medium leading-none tnum text-ink">{price}</p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{variant.label}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone="outline" size="xs">
              {CHANNEL_LABELS[product.channel]}
            </Badge>
            {stockNote && (
              <Badge tone="warning" size="xs" dot>
                {stockNote}
              </Badge>
            )}
            {compound.goalEvidence && <EvidenceBadge level={compound.goalEvidence} size="xs" prefix="Goal evidence" />}
          </div>
        </div>
      </div>

      <WhyMatched compound={compound} />

      <div className="no-print mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center">
        {canBuy && (
          <Button size="md" onClick={() => add(product)}>
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Add to cart
          </Button>
        )}
        <Button href={`/shop/${product.slug}/`} variant={canBuy ? "secondary" : "primary"} size="md">
          {canBuy ? "View product" : "View product · notify me"}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Button>
        {product.coa && (
          <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted sm:ml-auto">
            Lot {product.coa.batch} · {product.coa.purity}
          </span>
        )}
      </div>
    </article>
  );
}

function ConsultationCard({ compound, product }: { compound: CompoundReport; product: Product }) {
  return (
    <article className="border border-ink border-l-[3px] border-l-brand-600 bg-white p-4 sm:p-5" aria-label={`${product.name} — consultation`}>
      <div className="flex gap-4 sm:gap-5">
        <Visual product={product} />
        <div className="min-w-0 flex-1">
          <MonoLabel className="text-brand-600">Match · {SUITABILITY_LABELS[compound.suitability]}</MonoLabel>
          <h3 className="mt-1.5 font-display text-[1.35rem] uppercase leading-none text-ink">{product.name}</h3>
          <p className="mt-1.5 text-[13px] text-muted">{product.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone="ink" size="xs">
              {CHANNEL_LABELS[product.channel]}
            </Badge>
            {compound.goalEvidence && <EvidenceBadge level={compound.goalEvidence} size="xs" prefix="Goal evidence" />}
          </div>
        </div>
      </div>

      <WhyMatched compound={compound} />

      <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-ink-2">
        {product.name} is a prescription-only medicine. We do not sell it directly — it is supplied by a registered
        pharmacy only after an online consultation and prescription from {COMMERCE.prescriberPartner}. No price is shown
        because eligibility is decided by the prescriber.
      </p>

      <div className="no-print mt-4 flex flex-col gap-2 sm:flex-row">
        <Button href={`/shop/${product.slug}/`} size="md">
          Start consultation
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button href={`/peptides/${compound.slug}/`} variant="secondary" size="md">
          Read the evidence
        </Button>
      </div>
    </article>
  );
}

function ConcernCard({ compound, product, reasons }: { compound: CompoundReport; product: Product; reasons: Flag[] }) {
  return (
    <article className="border border-accent-500 border-l-[3px] bg-white p-4 sm:p-5" aria-label={`${compound.name} — not added to cart`}>
      <div className="flex gap-4 sm:gap-5">
        <Visual product={product} muted />
        <div className="min-w-0 flex-1">
          <MonoLabel className="text-accent-600">{SUITABILITY_LABELS.higher_concern}</MonoLabel>
          <h3 className="mt-1.5 font-display text-[1.35rem] uppercase leading-none text-ink">Not adding {compound.name} to your cart</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">This needs professional review first.</p>
          {product.availability === "not_sold" && <p className="mt-1 text-sm text-muted">We do not sell this product.</p>}
        </div>
      </div>

      {reasons.length > 0 && (
        <ul className="mt-4 border-t border-line pt-4">
          {reasons.map((f) => (
            <li key={f.id} className="flex items-start gap-3 py-1 text-sm leading-snug text-ink">
              <span className={cn("mt-[0.45rem] h-2 w-2 shrink-0", f.severity === "high" ? "bg-accent-500" : "bg-caution")} aria-hidden />
              {f.title}
            </li>
          ))}
        </ul>
      )}

      <div className="no-print mt-4 flex flex-col gap-2 sm:flex-row">
        <Button size="md" onClick={() => scrollToSection("next-steps")}>
          Speak to a clinician
        </Button>
        <Button href={`/peptides/${compound.slug}/`} variant="secondary" size="md">
          Read the evidence
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </article>
  );
}

function InsufficientCard({ compound, product }: { compound: CompoundReport; product: Product }) {
  return (
    <article className="border border-line bg-paper-2 p-4 sm:p-5" aria-label={`${compound.name} — complete the assessment to unlock`}>
      <div className="flex gap-4 sm:gap-5">
        <Visual product={product} muted className="border-line" />
        <div className="min-w-0 flex-1">
          <MonoLabel>{SUITABILITY_LABELS.insufficient_information}</MonoLabel>
          <h3 className="mt-1.5 font-display text-[1.35rem] uppercase leading-none text-ink">Complete the assessment to unlock</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            There isn&apos;t enough in your answers to label {compound.name}. Finish the missing sections and this card
            updates — it may become a match, or it may not.
          </p>
        </div>
      </div>
      <div className="no-print mt-4 flex flex-col gap-2 sm:flex-row">
        <Button href="/assessment/start/" variant="secondary" size="md">
          Complete the assessment
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </article>
  );
}

function NotSoldCard({ compound, product }: { compound: CompoundReport; product: Product }) {
  return (
    <article className="border border-ink bg-white p-4 sm:p-5" aria-label={`${product.name} — not sold`}>
      <div className="flex gap-4 sm:gap-5">
        <Visual product={product} muted />
        <div className="min-w-0 flex-1">
          <MonoLabel>{AVAILABILITY_LABELS.not_sold}</MonoLabel>
          <h3 className="mt-1.5 font-display text-[1.35rem] uppercase leading-none text-ink">We don&apos;t sell {product.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{leadSentences(product.description, 2)}</p>
        </div>
      </div>
      <div className="no-print mt-4 flex flex-col gap-2 sm:flex-row">
        <Button href={`/shop/${product.slug}/`} variant="secondary" size="md">
          Why we don&apos;t sell it
        </Button>
        <Button href={`/peptides/${compound.slug}/`} variant="secondary" size="md">
          Read the evidence
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </article>
  );
}

function ExtraProduct({ product }: { product: Product }) {
  const add = useAddToCart();
  const variant = defaultVariant(product);
  return (
    <>
      <div className="aspect-square w-full border border-line">
        <ProductVisual product={product} />
      </div>
      <h4 className="mt-3 font-display text-[1.05rem] uppercase leading-none text-ink">{product.name}</h4>
      <p className="mt-1 truncate text-[12.5px] text-muted">{product.subtitle}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[14px] font-medium tnum text-ink">{priceLabel(product)}</span>
        <Badge tone="outline" size="xs">
          {CHANNEL_LABELS[product.channel]}
        </Badge>
      </div>
      <div className="no-print mt-3 flex items-center gap-2">
        <Button size="sm" onClick={() => add(product)} aria-label={`Add ${product.name} ${variant.label} to cart`}>
          Add
        </Button>
        <Link href={`/shop/${product.slug}/`} className="link-rule font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
          View
        </Link>
      </div>
    </>
  );
}

function PromoPanel() {
  const [copied, setCopied] = React.useState(false);
  const promo = COMMERCE.promoCodes[PROMO_CODE];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      toast("Code copied", { description: `${PROMO_CODE} — enter it at checkout.` });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast("Couldn't copy the code", { description: `Type ${PROMO_CODE} at checkout.` });
    }
  };

  return (
    <div className="bg-ink p-5 text-white sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <MonoLabel className="text-brand-300">Assessment complete</MonoLabel>
          <p className="mt-2 font-display text-[1.5rem] uppercase leading-[0.98] sm:text-[1.75rem]">
            {promo ? `${promo.value}% off` : "A discount"} with {PROMO_CODE} at checkout
          </p>
          <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-white/70">
            Enter the code at checkout on any order of research products, supplies, supplements or cosmetics. It does not
            apply to prescription consultations, and it never applies to a compound your report marked Higher concern.
          </p>
        </div>
        <div className="no-print flex flex-col gap-2 sm:items-end">
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-12 items-center justify-center gap-2 border border-white bg-white px-4 font-mono text-[13px] font-medium tracking-[0.12em] text-ink transition-colors hover:bg-brand-600 hover:border-brand-600 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {PROMO_CODE}
          </button>
          <Button href="/shop/" variant="inverted" size="md" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-ink">
            Shop all
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyMatches({ blocked }: { blocked: boolean }) {
  return (
    <div className="border border-line bg-paper-2 p-5 sm:p-6">
      <MonoLabel>No linked products</MonoLabel>
      <h3 className="mt-2 font-display text-[1.35rem] uppercase leading-none text-ink">Nothing to match yet</h3>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-2">
        {blocked
          ? "None of the compounds you considered has a product in our range, and a review-required flag from your answers about yourself means we are not suggesting others. Speak to a clinician first."
          : "None of the compounds you considered has a product in our range, and your goal did not map to any product we stock. Browse the shop, or complete the assessment with a compound we sell."}
      </p>
      <div className="no-print mt-4 flex flex-col gap-2 sm:flex-row">
        <Button href="/shop/" variant="secondary" size="md">
          Browse the shop
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Button>
        <Button href="/assessment/start/" variant="secondary" size="md">
          Edit the assessment
        </Button>
      </div>
    </div>
  );
}
