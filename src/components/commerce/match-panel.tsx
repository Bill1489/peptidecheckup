"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProductBySlug, type Product } from "@/data/products";
import { useAssessmentStore } from "@/lib/assessment/store";
import { BRAND, DISCLAIMER_SHORT } from "@/lib/brand";
import { VERDICT_LABELS, matchForProduct, type MatchReason, type MatchReasonKind, type MatchVerdict, type ProductMatch } from "@/lib/match";
import { cn } from "@/lib/utils";
import { ProductSwatch } from "./product-image";

/* ------------------------------------------------------------------ */
/* Hook — the purchase column asks one question: may this be bought?   */
/* ------------------------------------------------------------------ */

export interface ProductMatchState {
  /** This product's entry in the stored match result, if any. */
  match: ProductMatch | undefined;
  verdict: MatchVerdict | undefined;
  /** True when the assessment ruled this product out — no Add to cart. */
  hideBuy: boolean;
}

const NONE: ProductMatchState = { match: undefined, verdict: undefined, hideBuy: false };
const noopSubscribe = () => () => {};

/**
 * Hydration-safe: the persisted store must not change the first client render,
 * so the server snapshot (and the pre-hydration render) always says "no match"
 * and the Add button exists in the static HTML.
 */
export function useMatchForProduct(productSlug: string): ProductMatchState {
  const mounted = React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const result = useAssessmentStore((s) => s.lastMatch);
  const hydrated = useAssessmentStore((s) => s.hydrated);

  return React.useMemo(() => {
    if (!mounted || !hydrated || !result) return NONE;
    const match = matchForProduct(result, productSlug);
    const verdict = match?.verdict;
    const hideBuy = verdict === "not_recommended" || (result.reviewRequired && match !== undefined);
    return { match, verdict, hideBuy };
  }, [mounted, hydrated, result, productSlug]);
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

const KIND_LABELS: Record<MatchReasonKind, string> = {
  goal: "Goal",
  focus: "Focus",
  evidence: "Evidence",
  experience: "Format",
  safety: "Safety",
  regulatory: "Regulatory",
  anti_doping: "Anti-doping",
};

const MATCHING_LINE = "Matching is deterministic and based on your answers; it is not a clinical recommendation.";

/**
 * "Your match" panel at the top of the product page's buy column. Renders only
 * when the stored quiz result mentions this product — as the match, an
 * alternative, or a pen the assessment ruled out.
 */
export function MatchPanel({ product }: { product: Product }) {
  const { match } = useMatchForProduct(product.slug);
  const result = useAssessmentStore((s) => s.lastMatch);
  if (!match || !result) return null;

  const isPrimary = result.primary?.slug === product.slug;
  const others = [result.primary, ...result.alternatives].filter(
    (m): m is ProductMatch => Boolean(m) && (m as ProductMatch).slug !== product.slug,
  );

  if (match.verdict === "not_recommended") {
    return (
      <section aria-labelledby="match-heading" className="mb-8 border border-ink border-t-[3px] border-t-accent-500 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink px-4 py-3">
          <p id="match-heading" className="label-mono text-accent-600">
            {VERDICT_LABELS.not_recommended}
          </p>
          <Score match={match} />
        </div>
        <div className="border-b border-ink bg-accent-100 p-4 sm:p-5">
          <h2 className="font-display text-[1.35rem] uppercase leading-[0.98] text-ink sm:text-[1.6rem]">
            The {BRAND.assessmentName} says not this one
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
            Your answers raised {match.reasons.length === 1 ? "a flag" : "flags"} that {match.reasons.length === 1 ? "rules" : "rule"} {product.name} out
            for you, so it cannot be added to the cart from this page. Take the reasons below to a clinician.
          </p>
          <ul className="mt-4 space-y-2">
            {match.reasons.map((r) => (
              <li key={r.text} className="flex items-start gap-3 text-sm leading-snug text-ink">
                <span className="mt-[0.4rem] h-2 w-2 shrink-0 bg-accent-500" aria-hidden />
                {r.text}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/report/#next-steps"
              className="inline-flex h-11 items-center justify-center gap-2 border border-ink bg-ink px-5 font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-accent-500 hover:bg-accent-500"
            >
              Speak to a clinician
            </Link>
            <Link
              href="/report/"
              className="inline-flex h-11 items-center justify-center gap-2 border border-ink bg-white px-5 font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white"
            >
              See the full report
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        {result.primary && (
          <p className="border-b border-ink px-4 py-3 text-[13px] leading-relaxed text-ink-2">
            Your match is{" "}
            <Link href={`/shop/${result.primary.slug}/?match=1`} className="link-rule font-medium text-ink">
              {result.primary.name} · {result.primary.score}/100
            </Link>
            .
          </p>
        )}
        <Footer />
      </section>
    );
  }

  const review = match.verdict === "match_with_review";
  const color = product.visual.color ?? "#0b0b0c";

  return (
    <section aria-labelledby="match-heading" className="mb-8 border border-ink bg-white" style={{ borderTop: `3px solid ${color}` }}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink px-4 py-3">
        <p id="match-heading" className={cn("label-mono flex items-center gap-2", review ? "text-ink" : "text-brand-600")}>
          <ProductSwatch product={product} />
          {isPrimary ? VERDICT_LABELS[match.verdict] : review ? "Also considered — review first" : "Also considered"}
        </p>
        <Score match={match} />
      </div>

      {!isPrimary && result.primary && (
        <p className="border-b border-line bg-paper-2 px-4 py-2.5 text-[12.5px] leading-relaxed text-ink-2">
          Your top match is{" "}
          <Link href={`/shop/${result.primary.slug}/?match=1`} className="link-rule font-medium text-ink">
            {result.primary.name} · {result.primary.score}/100
          </Link>
          . {product.name} was scored {match.score}/100 for you.
        </p>
      )}

      <div className="p-4 sm:p-5">
        <h2 className="label-mono text-ink">{isPrimary ? "Why this is your match" : "Why it was considered"}</h2>
        <ul className="mt-3 space-y-2.5">
          {match.reasons.map((r) => (
            <ReasonRow key={r.text} reason={r} />
          ))}
        </ul>
        {match.breakdown && (
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted tnum">
            Goal {match.breakdown.goal} · Focus {match.breakdown.focus} · Evidence {match.breakdown.evidence} · Format{" "}
            {match.breakdown.experience}
            {match.breakdown.antiDoping !== 0 ? ` · Anti-doping ${match.breakdown.antiDoping}` : ""}
          </p>
        )}
      </div>

      <div className={cn("border-t border-ink p-4 sm:p-5", review && "bg-caution-soft")}>
        <h3 className="label-mono text-ink">Before you buy</h3>
        {match.cautions.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {match.cautions.map((c) => (
              <li key={c.text} className="flex items-start gap-3 text-[13.5px] leading-snug text-ink">
                <span className={cn("mt-[0.4rem] h-2 w-2 shrink-0", c.kind === "anti_doping" ? "bg-accent-500" : "bg-caution")} aria-hidden />
                <span>
                  {c.text}
                  {c.kind === "anti_doping" && <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-600">WADA</span>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Nothing in your answers raised a caution for this pen. The research-use labelling below still applies.
          </p>
        )}
        {result.unmatchedFocus && result.unmatchedFocus.length > 0 && (
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
            Not covered by the range: {result.unmatchedFocus.join(", ").toLowerCase()} — nothing we sell is researched for{" "}
            {result.unmatchedFocus.length === 1 ? "it" : "these"}.
          </p>
        )}
      </div>

      {others.length > 0 && (
        <p className="border-t border-line px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">
          <span className="label-mono mr-2 text-muted">Also considered</span>
          {others.map((m, i) => {
            const p = getProductBySlug(m.slug);
            return (
              <React.Fragment key={m.slug}>
                {i > 0 && <span className="mx-1.5 text-muted-2">·</span>}
                <Link href={`/shop/${m.slug}/?match=1`} className="link-rule inline-flex items-center gap-1.5 text-ink">
                  {p && <ProductSwatch product={p} className="h-2 w-2" />}
                  {m.name} <span className="font-mono tnum">{m.score}/100</span>
                </Link>
              </React.Fragment>
            );
          })}
        </p>
      )}

      <Footer />
    </section>
  );
}

function Score({ match }: { match: ProductMatch }) {
  return (
    <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink tnum" aria-label={`Fit score ${match.score} out of 100`}>
      Fit <span className="text-[15px] font-medium">{match.score}</span>/100
    </p>
  );
}

function ReasonRow({ reason }: { reason: MatchReason }) {
  return (
    <li className="grid grid-cols-[auto_1fr] items-start gap-3 text-[13.5px] leading-snug text-ink">
      <span
        className={cn(
          "mt-[0.15rem] inline-flex h-5 min-w-[4.5rem] items-center justify-center border px-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em]",
          reason.kind === "goal" || reason.kind === "focus" ? "border-brand-600 bg-brand-600 text-white" : "border-ink bg-white text-ink",
        )}
      >
        {KIND_LABELS[reason.kind]}
      </span>
      <span>{reason.text}</span>
    </li>
  );
}

function Footer() {
  return (
    <div className="border-t border-ink bg-paper-2 px-4 py-3">
      <nav className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em]" aria-label="Your result">
        <Link href="/report/" className="link-rule text-ink">
          Full evidence report
        </Link>
        <Link href="/assessment/" className="link-rule text-ink">
          Retake
        </Link>
      </nav>
      <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
        {DISCLAIMER_SHORT} {MATCHING_LINE}
      </p>
    </div>
  );
}
