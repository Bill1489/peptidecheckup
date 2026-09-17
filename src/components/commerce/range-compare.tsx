import * as React from "react";
import Link from "next/link";
import { EvidenceMeter } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import {
  WADA_LABELS,
  formatLine,
  goalLabel,
  priceLine,
  primaryGoalEvidence,
  productPath,
  wadaStatus,
} from "@/components/commerce/product-utils";
import { PRODUCTS, purchasable, type Product } from "@/data/products";
import { EVIDENCE_LABELS } from "@/data/types";
import { cn } from "@/lib/utils";

interface Row {
  id: string;
  label: string;
  cell: (p: Product) => React.ReactNode;
}

const ROWS: Row[] = [
  { id: "contents", label: "Contents", cell: (p) => <span className="text-[13px] text-ink">{p.pen?.composition ?? p.form}</span> },
  {
    id: "concentration",
    label: "Concentration",
    cell: (p) => <span className="font-mono text-[12.5px] tnum text-ink">{p.pen?.concentration ?? "—"}</span>,
  },
  {
    id: "format",
    label: "Format",
    cell: (p) => (
      <span className="text-[13px] text-ink">
        Pre-filled dose-dial {formatLine(p)}
        {p.pen ? ` · ${p.pen.totalMg} mg total` : ""}
      </span>
    ),
  },
  { id: "best", label: "Best for", cell: (p) => <span className="text-[13px] leading-snug text-ink-3">{p.bestFor}</span> },
  {
    id: "evidence",
    label: "Human evidence · main goal",
    cell: (p) => {
      const e = primaryGoalEvidence(p);
      if (!e) return <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Record pending</span>;
      return (
        <span className="flex flex-col gap-1.5">
          <EvidenceMeter level={e.level} />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
            {goalLabel(e.goal)}: <span className="text-ink">{EVIDENCE_LABELS[e.level]}</span>
          </span>
        </span>
      );
    },
  },
  {
    id: "wada",
    label: "WADA status",
    cell: (p) => {
      const s = wadaStatus(p);
      return (
        <span className={cn("flex items-start gap-2 text-[12.5px] leading-snug", s === "clear" ? "text-ink" : "text-ink-3")}>
          <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0", s === "prohibited" ? "bg-accent-500" : s === "clear" ? "bg-brand-600" : "bg-muted-2")} aria-hidden />
          {WADA_LABELS[s]}
        </span>
      );
    },
  },
  { id: "price", label: "Price", cell: (p) => <span className="font-mono text-[15px] tnum text-ink">{priceLine(p) ?? "—"}</span> },
  {
    id: "add",
    label: "Add",
    cell: (p) =>
      purchasable(p) ? (
        <AddToCartButton product={p} size="sm" className="w-full justify-between" />
      ) : (
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Not available</span>
      ),
  },
];

/**
 * "Compare the range": one column per pen, the row labels stuck to the left
 * so the table can scroll horizontally on a phone without losing context.
 */
export function RangeCompare({ products = PRODUCTS, className }: { products?: Product[]; className?: string }) {
  return (
    <div className={cn("overflow-x-auto border border-ink", className)}>
      <table className="w-full min-w-[72rem] border-collapse text-left">
        <caption className="sr-only">The six pens compared: contents, concentration, format, best for, human evidence, WADA status and price.</caption>
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="sticky left-0 z-[1] w-[9rem] min-w-[9rem] border-r border-ink bg-white p-4 align-bottom">
              <span className="label-mono">Pen</span>
            </th>
            {products.map((p) => (
              <th key={p.id} scope="col" className="min-w-[10.5rem] border-r border-line p-0 align-bottom last:border-r-0">
                <div className="border-t-[3px]" style={{ borderTopColor: p.visual.color ?? "#0b0b0c" }}>
                  <Link href={productPath(p.slug)} className="group block p-3" aria-label={`${p.name} — view product`}>
                    <ProductImage product={p} prefer="pack" frame="square" className="mx-auto w-24" sizes="96px" />
                    <span className="mt-3 flex items-center gap-2">
                      <ProductSwatch product={p} />
                      <span className="font-display text-[14px] uppercase leading-none tracking-[-0.02em] text-ink transition-colors group-hover:text-brand-600">
                        {p.name}
                      </span>
                    </span>
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-b-0">
              <th scope="row" className="sticky left-0 z-[1] border-r border-ink bg-white p-4 align-top">
                <span className="label-mono">{row.label}</span>
              </th>
              {products.map((p) => (
                <td key={p.id} className="border-r border-line p-3 align-top last:border-r-0">
                  {row.cell(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
