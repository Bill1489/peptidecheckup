"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Copy, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { GOAL_MAP } from "@/data/goals";
import { AVAILABILITY_LABELS, CHANNEL_LABELS, defaultVariant, getProductBySlug, priceRange, purchasable, type Product } from "@/data/products";
import { BRAND, RESEARCH_USE_LABEL } from "@/lib/brand";
import { useCartStore } from "@/lib/commerce/cart-store";
import { COMMERCE } from "@/lib/commerce/config";
import { formatFrom, formatMoney } from "@/lib/commerce/money";
import type { Report } from "@/lib/engine/types";
import { VERDICT_LABELS, type MatchReason, type MatchReasonKind, type MatchResult, type ProductMatch } from "@/lib/match";
import { cn } from "@/lib/utils";
import { MonoLabel, ReportSection } from "../primitives";
import { scrollToSection } from "../report-toc";
import type { ReportSectionDef } from "../sections";

const PROMO_CODE = "CHECKUP10";
const PROMO_MIN_COMPLETENESS = 60;

const KIND_LABELS: Record<MatchReasonKind, string> = {
  goal: "Goal",
  focus: "Focus",
  evidence: "Evidence",
  experience: "Format",
  safety: "Safety",
  regulatory: "Regulatory",
  anti_doping: "Anti-doping",
};

function priceLabel(product: Product): string {
  const { min, max } = priceRange(product);
  if (min === 0) return "";
  return min === max ? formatMoney(min) : formatFrom(product.variants.map((v) => v.price).filter((p) => p > 0));
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

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function MatchesSection({ report, match, def }: { report: Report; match: MatchResult; def: ReportSectionDef }) {
  const primary = match.primary;
  const unlocked = Boolean(primary) && !match.reviewRequired && report.completeness.score >= PROMO_MIN_COMPLETENESS;

  /* A generated result that clears the threshold unlocks the assessment promo in the cart. */
  React.useEffect(() => {
    if (unlocked) useCartStore.getState().setAssessmentCompleted(true);
  }, [unlocked]);

  return (
    <ReportSection
      def={def}
      description={`Every pen in the ${BRAND.range.name} range is scored 0–100 against your goal, focus areas, the human evidence for your goal and the pen format, then checked against the flags above. A high-severity flag or a Higher concern label on any component rules a pen out — nothing goes in your cart, and it links to a clinician instead.`}
    >
      {primary ? <PrimaryCard match={primary} result={match} /> : <NoMatch match={match} report={report} />}

      {match.unmatchedFocus && match.unmatchedFocus.length > 0 && (
        <p className="border border-ink border-l-[3px] border-l-ink bg-paper-2 px-4 py-3.5 text-sm leading-relaxed text-ink-2">
          <span className="label-mono mr-2 text-ink">Not covered</span>
          You also picked {match.unmatchedFocus.join(", ").toLowerCase()}. Nothing in the range is researched for{" "}
          {match.unmatchedFocus.length === 1 ? "it" : "these"}, so {match.unmatchedFocus.length === 1 ? "it" : "they"} did not
          count towards any pen.
        </p>
      )}

      {match.alternatives.length > 0 && (
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[1.2rem] uppercase leading-none text-ink">Also considered</h3>
            <MonoLabel className="tnum">
              {match.alternatives.length} pen{match.alternatives.length === 1 ? "" : "s"}
            </MonoLabel>
          </div>
          <ul className={cn("cell-grid", match.alternatives.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2")}>
            {match.alternatives.map((m) => (
              <li key={m.productId} className="flex flex-col p-4 sm:p-5">
                <AlternativeCard match={m} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {match.notRecommended.length > 0 && (
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[1.2rem] uppercase leading-none text-ink">{VERDICT_LABELS.not_recommended}</h3>
            <MonoLabel className="tnum">
              {match.notRecommended.length} pen{match.notRecommended.length === 1 ? "" : "s"}
            </MonoLabel>
          </div>
          <ul className="space-y-3">
            {match.notRecommended.map((m) => (
              <li key={m.productId}>
                <NotRecommendedCard match={m} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {unlocked && <PromoPanel />}

      <p className="text-xs leading-relaxed text-muted">
        Matching is deterministic and based on your answers; it is not a clinical recommendation. Suitability labels describe
        whether your responses identified factors that warrant professional review. Products in the range carry this
        labelling: {RESEARCH_USE_LABEL}
      </p>
    </ReportSection>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

function ReasonList({ reasons, className }: { reasons: MatchReason[]; className?: string }) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {reasons.map((r) => (
        <li key={r.text} className="grid grid-cols-[auto_1fr] items-start gap-3 text-[13.5px] leading-snug text-ink">
          <span
            className={cn(
              "mt-[0.15rem] inline-flex h-5 min-w-[4.5rem] items-center justify-center border px-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em]",
              r.kind === "goal" || r.kind === "focus" ? "border-brand-600 bg-brand-600 text-white" : "border-ink bg-white text-ink",
            )}
          >
            {KIND_LABELS[r.kind]}
          </span>
          <span>{r.text}</span>
        </li>
      ))}
    </ul>
  );
}

function CautionList({ cautions }: { cautions: MatchReason[] }) {
  if (cautions.length === 0) {
    return <p className="text-[13.5px] leading-relaxed text-muted">Nothing in your answers raised a caution for this pen.</p>;
  }
  return (
    <ul className="space-y-2">
      {cautions.map((c) => (
        <li key={c.text} className="flex items-start gap-3 text-[13.5px] leading-snug text-ink">
          <span className={cn("mt-[0.4rem] h-2 w-2 shrink-0", c.kind === "anti_doping" ? "bg-accent-500" : "bg-caution")} aria-hidden />
          {c.text}
        </li>
      ))}
    </ul>
  );
}

function Breakdown({ match }: { match: ProductMatch }) {
  if (!match.breakdown) return null;
  const b = match.breakdown;
  return (
    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted tnum">
      Goal {b.goal} · Focus {b.focus} · Evidence {b.evidence} · Format {b.experience}
      {b.antiDoping !== 0 ? ` · Anti-doping ${b.antiDoping}` : ""}
    </p>
  );
}

function PrimaryCard({ match, result }: { match: ProductMatch; result: MatchResult }) {
  const add = useAddToCart();
  const product = getProductBySlug(match.slug);
  if (!product) return null;
  const variant = defaultVariant(product);
  const review = match.verdict === "match_with_review";
  const canBuy = purchasable(product) && !result.reviewRequired;
  const stockNote = product.availability !== "in_stock" ? AVAILABILITY_LABELS[product.availability] : undefined;
  const goal = result.goal ? GOAL_MAP[result.goal]?.label : undefined;

  return (
    <article
      className="border border-ink bg-white break-inside-avoid"
      style={{ borderTop: `3px solid ${product.visual.color ?? "#0b0b0c"}` }}
      aria-label={`${product.name} — your match`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink px-4 py-3 sm:px-5">
        <MonoLabel className={cn("flex items-center gap-2", review ? "text-ink" : "text-brand-600")}>
          <ProductSwatch product={product} />
          {VERDICT_LABELS[match.verdict]}
        </MonoLabel>
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink tnum">
          Fit <span className="text-[15px] font-medium">{match.score}</span>/100
        </p>
      </div>

      <div className="grid gap-5 p-4 sm:grid-cols-[10rem_1fr] sm:p-5">
        <div className="w-32 border border-ink bg-white sm:w-full">
          <ProductImage product={product} prefer="pack" frame="portrait" sizes="(min-width: 640px) 10rem, 8rem" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-[1.6rem] uppercase leading-none text-ink sm:text-[1.9rem]">{product.name}</h3>
              <p className="mt-1.5 text-[13px] text-muted">{product.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[1.1rem] font-medium leading-none tnum text-ink">{priceLabel(product)}</p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{variant.label}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone="outline" size="xs">
              {CHANNEL_LABELS[product.channel]}
            </Badge>
            {goal && (
              <Badge tone="brand" size="xs">
                {goal}
              </Badge>
            )}
            {stockNote && (
              <Badge tone="warning" size="xs" dot>
                {stockNote}
              </Badge>
            )}
          </div>
          <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-2">{result.summary}</p>
        </div>
      </div>

      <div className="grid border-t border-ink sm:grid-cols-2">
        <div className="p-4 sm:p-5">
          <MonoLabel as="h4" className="text-ink">
            Why this is your match
          </MonoLabel>
          <ReasonList reasons={match.reasons} className="mt-3" />
          <div className="mt-4">
            <Breakdown match={match} />
          </div>
        </div>
        <div className={cn("border-t border-ink p-4 sm:border-l sm:border-t-0 sm:p-5", review && "bg-caution-soft")}>
          <MonoLabel as="h4" className="text-ink">
            Before you buy
          </MonoLabel>
          <div className="mt-3">
            <CautionList cautions={match.cautions} />
          </div>
        </div>
      </div>

      <div className="no-print flex flex-col gap-2 border-t border-ink p-4 sm:flex-row sm:items-center sm:p-5">
        {canBuy && (
          <Button size="md" onClick={() => add(product)}>
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Add to cart
          </Button>
        )}
        <Button href={`/shop/${product.slug}/?match=1`} variant={canBuy ? "secondary" : "primary"} size="md">
          View pen
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

function AlternativeCard({ match }: { match: ProductMatch }) {
  const product = getProductBySlug(match.slug);
  if (!product) return null;
  const review = match.verdict === "match_with_review";
  return (
    <>
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 border border-ink bg-white">
          <ProductImage product={product} prefer="pack" frame="square" sizes="80px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="flex items-center gap-2 font-display text-[1.15rem] uppercase leading-none text-ink">
              <ProductSwatch product={product} />
              {product.name}
            </h4>
            <span className="font-mono text-[12px] tnum text-ink">{match.score}/100</span>
          </div>
          <p className="mt-1 truncate text-[12.5px] text-muted">{product.subtitle}</p>
          <p className="mt-1.5 label-mono text-muted">{review ? "Review first" : "Fit"}</p>
        </div>
      </div>
      <ReasonList reasons={match.reasons.slice(0, 2)} className="mt-4" />
      {match.cautions.length > 0 && (
        <div className="mt-3">
          <CautionList cautions={match.cautions.slice(0, 2)} />
        </div>
      )}
      <div className="no-print mt-4 flex items-center gap-3">
        <Link href={`/shop/${product.slug}/?match=1`} className="link-rule font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
          View pen
        </Link>
        <span className="font-mono text-[11px] tnum text-muted">{priceLabel(product)}</span>
      </div>
    </>
  );
}

function NotRecommendedCard({ match }: { match: ProductMatch }) {
  const product = getProductBySlug(match.slug);
  if (!product) return null;
  return (
    <article className="border border-ink border-l-[3px] border-l-accent-500 bg-white p-4 sm:p-5" aria-label={`${product.name} — not recommended`}>
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 border border-line bg-white opacity-60 grayscale">
          <ProductImage product={product} prefer="pack" frame="square" sizes="80px" />
        </div>
        <div className="min-w-0 flex-1">
          <MonoLabel className="text-accent-600">{VERDICT_LABELS.not_recommended}</MonoLabel>
          <h4 className="mt-1.5 font-display text-[1.2rem] uppercase leading-none text-ink">Not adding {product.name} to your cart</h4>
          <ul className="mt-3 space-y-1.5">
            {match.reasons.map((r) => (
              <li key={r.text} className="flex items-start gap-3 text-sm leading-snug text-ink">
                <span className="mt-[0.4rem] h-2 w-2 shrink-0 bg-accent-500" aria-hidden />
                {r.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="no-print mt-4 flex flex-col gap-2 sm:flex-row">
        <Button size="sm" onClick={() => scrollToSection("next-steps")}>
          Speak to a clinician
        </Button>
        <Button href={`/shop/${product.slug}/`} variant="secondary" size="sm">
          View pen
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* No match                                                            */
/* ------------------------------------------------------------------ */

function NoMatch({ match, report }: { match: MatchResult; report: Report }) {
  const goal = match.goal ? GOAL_MAP[match.goal]?.label.toLowerCase() : undefined;
  const highs = report.globalFlags.filter((f) => f.severity === "high");
  return (
    <div className={cn("border border-ink border-l-[3px] bg-white p-5 sm:p-6", match.reviewRequired ? "border-l-accent-500" : "border-l-ink")}>
      <MonoLabel className={match.reviewRequired ? "text-accent-600" : "text-ink"}>
        {match.reviewRequired ? "Review required" : "No match"}
      </MonoLabel>
      <h3 className="mt-2 font-display text-[1.5rem] uppercase leading-[0.98] text-ink sm:text-[1.75rem]">
        {match.reviewRequired ? "Nothing in the range until you have spoken to a clinician" : `No pen in the range for ${goal ?? "this goal"}`}
      </h3>
      <p className="mt-3 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-2">{match.summary}</p>
      {highs.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {highs.map((f) => (
            <li key={f.id} className="flex items-start gap-3 text-sm leading-snug text-ink">
              <span className="mt-[0.4rem] h-2 w-2 shrink-0 bg-accent-500" aria-hidden />
              {f.title}
            </li>
          ))}
        </ul>
      )}
      {!match.reviewRequired && (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We would rather say so than stretch a pen to fit. The evidence, regulatory and suitability sections above show how each
          compound in the range was assessed against your answers.
        </p>
      )}
      <div className="no-print mt-5 flex flex-col gap-2 sm:flex-row">
        <Button size="md" onClick={() => scrollToSection("next-steps")}>
          {match.reviewRequired ? "Speak to a clinician" : "Next steps"}
        </Button>
        <Button href="/assessment/" variant="secondary" size="md">
          Retake the {BRAND.assessmentName}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Promo                                                               */
/* ------------------------------------------------------------------ */

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
          <MonoLabel className="text-brand-300">{BRAND.assessmentName} complete</MonoLabel>
          <p className="mt-2 font-display text-[1.5rem] uppercase leading-[0.98] sm:text-[1.75rem]">
            {promo ? `${promo.value}% off` : "A discount"} with {PROMO_CODE} at checkout
          </p>
          <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-white/70">
            Enter the code at checkout on your matched pen or any pen the {BRAND.assessmentName} did not rule out. It never applies to a
            pen marked not recommended for you.
          </p>
        </div>
        <div className="no-print flex flex-col gap-2 sm:items-end">
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-12 items-center justify-center gap-2 border border-white bg-white px-4 font-mono text-[13px] font-medium tracking-[0.12em] text-ink transition-colors hover:border-brand-600 hover:bg-brand-600 hover:text-white"
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
