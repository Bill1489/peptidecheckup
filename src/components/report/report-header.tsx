"use client";

import Link from "next/link";
import { AlertDialog } from "radix-ui";
import { ArrowRight, Columns2, Printer, RotateCcw } from "lucide-react";
import { getProductBySlug } from "@/data/products";
import { BRAND } from "@/lib/brand";
import { VERDICT_LABELS, type MatchResult } from "@/lib/match";
import { LogoMark } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { formatDate } from "@/lib/utils";
import { scrollToSection } from "./report-toc";

export function ReportHeader({
  generatedAt,
  jurisdiction,
  compareHref,
  onStartOver,
}: {
  generatedAt: string;
  /** Country or jurisdiction label shown in the mono title */
  jurisdiction: string;
  compareHref?: string;
  onStartOver: () => void;
}) {
  const print = () => window.print();

  return (
    <header className="no-print rule-b sticky top-0 z-40 bg-white">
      <div className="container-x flex h-14 items-center justify-between gap-3 sm:h-16">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link href="/" aria-label={`${BRAND.displayName} home`} className="inline-flex shrink-0 items-center">
            <LogoMark className="h-7 w-7" />
          </Link>
          <p className="label-mono truncate text-ink">
            Report
            <span className="mx-1.5 text-muted-2" aria-hidden>
              ·
            </span>
            <span className="tnum">{formatDate(generatedAt, { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span className="hidden sm:inline">
              <span className="mx-1.5 text-muted-2" aria-hidden>
                ·
              </span>
              {jurisdiction}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {compareHref && (
            <Button href={compareHref} variant="secondary" size="sm" className="hidden md:inline-flex">
              <Columns2 className="h-3.5 w-3.5" aria-hidden />
              Compare
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={print} aria-label="Print or save as PDF">
            <Printer className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <Button variant="secondary" size="sm" aria-label="Start over">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Start over</span>
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 z-50 bg-ink/60 data-[state=open]:animate-fade-in" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-none border border-ink bg-white p-6 focus:outline-none data-[state=open]:animate-fade-in sm:p-8">
                <p className="label-mono text-ink">Confirm</p>
                <AlertDialog.Title className="mt-3 font-display text-[1.6rem] uppercase leading-[0.98] text-ink">
                  Start a new assessment?
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-4 text-sm leading-relaxed text-muted">
                  This clears your saved responses and this report from this browser. Print or save it as a PDF first if
                  you want to keep a copy.
                </AlertDialog.Description>
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <AlertDialog.Cancel asChild>
                    <Button variant="secondary" size="md">
                      Keep this report
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button variant="danger" size="md" onClick={onStartOver}>
                      Clear and start over
                    </Button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </div>
    </header>
  );
}

/**
 * Compact "Your match" band directly under the header: the matched pen's
 * photograph, fit score and verdict, linking to its product page — or, when
 * nothing matched, one line saying why, linking to the matches section.
 */
export function MatchStrip({ match }: { match: MatchResult }) {
  const primary = match.primary;
  const product = primary ? getProductBySlug(primary.slug) : undefined;

  if (!primary || !product) {
    return (
      <div className="rule-b bg-paper-2">
        <div className="container-x flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] leading-relaxed text-ink-2">
            <span className="label-mono mr-2 text-accent-600">No match</span>
            {match.summary}
          </p>
          <button
            type="button"
            onClick={() => scrollToSection("matches")}
            className="link-rule no-print inline-flex min-h-11 items-center gap-1.5 self-start font-mono text-[11px] uppercase tracking-[0.1em] text-ink sm:self-auto"
          >
            Why
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  const review = primary.verdict === "match_with_review";
  return (
    <div className="rule-b bg-white" style={{ borderTop: `3px solid ${product.visual.color ?? "#0b0b0c"}` }}>
      <div className="container-x flex items-center gap-4 py-3">
        <Link href={`/shop/${product.slug}/?match=1`} className="h-12 w-12 shrink-0 border border-ink bg-white" aria-hidden tabIndex={-1}>
          <ProductImage product={product} prefer="pack" frame="square" sizes="48px" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className={review ? "label-mono text-ink" : "label-mono text-brand-600"}>
            <ProductSwatch product={product} className="mr-2 align-middle" />
            {VERDICT_LABELS[primary.verdict]}
          </p>
          <p className="mt-0.5 truncate text-[15px] text-ink">
            <span className="font-display uppercase">{product.name}</span>
            <span className="mx-2 text-muted-2" aria-hidden>
              ·
            </span>
            <span className="font-mono text-[13px] tnum">Fit {primary.score}/100</span>
          </p>
        </div>
        <Button href={`/shop/${product.slug}/?match=1`} size="sm" className="no-print shrink-0">
          <span className="hidden sm:inline">View pen</span>
          <span className="sm:hidden">View</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
