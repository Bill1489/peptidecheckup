import Link from "next/link";
import { ProductImage } from "@/components/commerce/product-image";
import { productPath } from "@/components/commerce/product-utils";
import { SpecRow } from "@/components/ui/card";
import type { Product } from "@/data/products";
import { IndexHead } from "./index-head";
import { PenCaption } from "./pen-cell";

const NEEDLE_NOTE = "Standard pen needles. Not included unless the box contents say so — check the listing before you order.";
const LOT_NOTE = "Printed on the outer carton. The certificate of analysis is published against it and a copy travels in the box.";
const COA_NOTE = "Purity by HPLC, identity by LC-MS, endotoxin by LAL — per lot, and per component for blends.";

/**
 * "What's in every box": the pen format explained once, with the spec rows
 * read from the catalogue record of the pen shown, so the copy cannot drift
 * from the product page.
 */
export function PenFormat({ product }: { product: Product }) {
  const pen = product.pen;
  const inTheBox = product.specs.find((s) => s.label === "In the box")?.value;

  return (
    <section className="rule-b">
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-16 lg:py-20">
        <Link
          href={productPath(product.slug)}
          className="group order-2 block w-full border border-ink bg-white text-ink lg:order-1"
          aria-label={`${product.name} — view pen`}
        >
          <ProductImage product={product} prefer="hand" frame="portrait" sizes="(min-width: 1024px) 26rem, 100vw" />
          <span className="flex items-center justify-between gap-4 border-t border-ink px-4 py-3">
            <PenCaption product={product} />
            <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] underline decoration-transparent underline-offset-[3px] transition-colors duration-150 group-hover:text-brand-600 group-hover:decoration-current">
              Details
            </span>
          </span>
        </Link>

        <div className="order-1 min-w-0 lg:order-2">
          <IndexHead
            index="05"
            label="What’s in every box"
            title="Pre-filled. Dose-dial. Refrigerated. Numbered."
            description="Every pen in the range is the same object: 3 mL of solution in a multi-dose pen with a numbered dial window. No powder, no diluent, no drawing up. The rows below are read from the catalogue record for the pen shown."
          />
          <div className="mt-8 border border-ink px-5">
            <SpecRow label="Format" value={pen ? `Pre-filled multi-dose pen · ${pen.volumeMl} mL` : product.form} />
            <SpecRow label="Dose window" value={pen?.dialing ?? "Dose-dial pen with a numbered window"} />
            <SpecRow label="Storage" value={pen?.storage ?? "Refrigerate at 2–8 °C. Do not freeze."} />
            <SpecRow label="Lot number" value={LOT_NOTE} />
            <SpecRow label="Certificate" value={COA_NOTE} />
            <SpecRow label="Pen needles" value={NEEDLE_NOTE} />
            {inTheBox && <SpecRow label="In the box" value={inTheBox} />}
          </div>
          <p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-muted">
            {product.regulatoryLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
