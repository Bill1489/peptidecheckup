import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { AVAILABILITY_LABELS, defaultVariant } from "@/data/products";
import type { Compound } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { joinNames, productHref, rangeProductsFor, variantPriceLabel } from "@/lib/compare";
import { CellGrid } from "./primitives";

/**
 * "In the range": every Aervyn pen that carries the compound — its own pen and
 * any blend it is part of — as a strip of cells under the detail hero. Photos
 * sit on white inside a 1px frame; the whole cell inverts to ink on hover.
 * Server-safe; renders nothing for compounds outside the range.
 */
export function RangeStrip({ compound, className }: { compound: Compound; className?: string }) {
  const pens = rangeProductsFor(compound.slug);
  if (pens.length === 0) return null;

  return (
    <section aria-labelledby="range-strip-title" className={className}>
      {/* The cell grid draws its own 1px frame; the header bar sits on top of it. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border border-b-0 border-ink bg-paper-2 px-4 py-2.5 sm:px-5">
        <h2 id="range-strip-title" className="label-mono text-ink">
          In the {BRAND.displayName} range
        </h2>
        <p className="label-mono tnum">
          {pens.length === 1 ? "1 pen carries" : `${pens.length} pens carry`} {compound.name}
        </p>
      </div>

      <CellGrid as="ul" itemAs="li" cols={[1, 2]} count={pens.length} className="grid-cols-1 sm:grid-cols-2" role="list">
        {pens.map(({ product, inBlend, partners }) => {
          const variant = defaultVariant(product);
          return (
            <li key={product.id} className="min-w-0">
              <Link
                href={productHref(product.slug)}
                className="group flex h-full items-center gap-4 bg-white p-4 text-ink transition-colors duration-150 hover:bg-ink hover:text-white sm:p-5"
              >
                <div className="w-20 shrink-0 border border-line bg-white transition-colors duration-150 group-hover:border-white/20 sm:w-24">
                  <ProductImage product={product} prefer="pack" frame="square" sizes="96px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="label-mono flex items-center gap-1.5 group-hover:text-white/60">
                    <ProductSwatch product={product} className="h-2 w-2" />
                    {inBlend ? "Blend pen" : "Single-compound pen"}
                  </p>
                  <p className="font-display mt-1.5 break-words text-[1.15rem] uppercase leading-none">{product.name}</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-muted group-hover:text-white/70">{product.subtitle}</p>
                  {inBlend && partners.length > 0 && (
                    <p className="mt-1 text-[12.5px] leading-snug text-ink-3 group-hover:text-white/80">
                      {compound.name} with {joinNames(partners)}
                    </p>
                  )}
                  <p className="mt-2 font-mono text-[13px] tnum">
                    {variantPriceLabel(product, variant)}
                    <span className="text-muted group-hover:text-white/60"> · {AVAILABILITY_LABELS[product.availability]}</span>
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </li>
          );
        })}
      </CellGrid>
    </section>
  );
}
