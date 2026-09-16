import Link from "next/link";
import { ProductVisual } from "@/components/commerce/product-visual";
import { kitContents, kitSaving, productPath } from "@/components/commerce/product-utils";
import type { Product } from "@/data/products";
import { formatMoney } from "@/lib/commerce/money";

/** Resolved bundle lines plus the saving against buying each line separately. */
export function KitContents({ kit, className }: { kit: Product; className?: string }) {
  const lines = kitContents(kit);
  const { separately, price, saving, percent } = kitSaving(kit);
  if (lines.length === 0) return null;

  return (
    <section className={className} aria-labelledby="kit-heading">
      <p className="label-mono">In the box</p>
      <h2 id="kit-heading" className="mt-1.5 text-[1.25rem] uppercase">
        {lines.length} items, each with its own batch
      </h2>
      <ul className="mt-4 border border-ink">
        {lines.map((line) => (
          <li key={line.variant.id} className="flex items-center gap-4 border-b border-line px-3 py-3 last:border-b-0">
            <span className="h-12 w-12 shrink-0 border border-line">
              <ProductVisual product={line.product} meta={line.variant.label} grid={false} />
            </span>
            <div className="min-w-0 flex-1">
              <Link href={productPath(line.product.slug)} className="link-rule decoration-transparent hover:decoration-current text-[14px] font-semibold text-ink">
                {line.product.name}
              </Link>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">
                {line.qty} × {line.variant.label}
                {line.product.coa ? ` · Lot ${line.product.coa.batch}` : ""}
              </p>
            </div>
            <span className="font-mono text-[13px] tnum text-ink">{formatMoney(line.variant.price * line.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="grid grid-cols-3 gap-px border border-t-0 border-ink bg-ink">
        <div className="bg-white px-3 py-2.5">
          <dt className="label-mono">Separately</dt>
          <dd className="mt-1 font-mono text-[14px] tnum text-muted line-through">{formatMoney(separately)}</dd>
        </div>
        <div className="bg-white px-3 py-2.5">
          <dt className="label-mono">Kit price</dt>
          <dd className="mt-1 font-mono text-[14px] tnum text-ink">{formatMoney(price)}</dd>
        </div>
        <div className="bg-ink px-3 py-2.5 text-white">
          <dt className="label-mono text-white/60">You save</dt>
          <dd className="mt-1 font-mono text-[14px] tnum">
            {formatMoney(saving)} · {percent}%
          </dd>
        </div>
      </dl>
    </section>
  );
}
