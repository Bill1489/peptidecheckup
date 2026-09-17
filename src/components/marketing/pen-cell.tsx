import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { productPath } from "@/components/commerce/product-utils";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { penDose, penPrice } from "./copy";

/**
 * One pen as a bordered cell: the pack photo on white, then swatch, name,
 * contents and price. The whole cell links to the pen page and inverts on
 * hover; the photo keeps its white ground so the pen stays visible.
 */
export function PenCell({
  product,
  bestFor,
  priority,
  className,
}: {
  product: Product;
  /** Show the catalogue's one-line "who this is for" under the name. */
  bestFor?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={productPath(product.slug)}
      className={cn("hover-invert flex flex-1 flex-col bg-white text-ink", className)}
      aria-label={`${product.name} — ${penDose(product)} — ${penPrice(product)}`}
    >
      <div className="border-b border-current">
        <ProductImage product={product} prefer="pack" frame="square" priority={priority} sizes="(min-width: 1280px) 16vw, (min-width: 768px) 33vw, 50vw" />
      </div>
      <span className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <span className="flex items-center gap-2">
          <ProductSwatch product={product} />
          <span className="font-display text-[15px] uppercase leading-none tracking-[-0.02em] sm:text-[16px]">{product.name}</span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{penDose(product)}</span>
        {bestFor && <span className="mt-1 text-[13px] leading-relaxed text-ink-3">{product.bestFor}</span>}
        <span className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-mono text-[14px] tnum">{penPrice(product)}</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em]">
            Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </span>
      </span>
    </Link>
  );
}

/** Small square thumbnail of the pack photo, bordered, on white — for lists and index rows. */
export function PenThumb({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("h-14 w-14 shrink-0 border border-current bg-white", className)} title={product.name}>
      <ProductImage product={product} prefer="pack" frame="fill" sizes="56px" />
    </div>
  );
}

/** Mono caption line: swatch · name · contents · price. */
export function PenCaption({ product, className }: { product: Product; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]", className)}>
      <ProductSwatch product={product} />
      <span className="truncate">
        {product.name} · {penDose(product)} · <span className="tnum">{penPrice(product)}</span>
      </span>
    </span>
  );
}
