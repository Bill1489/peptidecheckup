"use client";

import * as React from "react";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { Button } from "@/components/ui/button";
import { SpecRow } from "@/components/ui/card";
import type { Product } from "@/data/products";
import type { Compound } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { formatFrom, formatMoney } from "@/lib/commerce/money";
import { COMMERCE_STATE_LABELS, commerceForCompound, joinNames } from "@/lib/compare";
import { formatDate } from "@/lib/utils";
import { AddToCartButton } from "./commerce-cta";
import { Segmented } from "./segmented";

/** First `n` sentences of a paragraph, for a short "why" snippet. */
function firstSentences(text: string, n: number): string {
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!parts) return text;
  return parts.slice(0, n).join("").trim();
}

function PanelHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h2 className="label-mono text-ink">{title}</h2>
      {meta && <p className="label-mono">{meta}</p>}
    </div>
  );
}

/** Pen photograph (pack shot on white) in a 1px frame, at the panel's thumbnail size. */
function PenPhoto({ product }: { product: Product }) {
  return (
    <div className="w-24 shrink-0 border border-ink bg-white sm:w-28">
      <ProductImage product={product} prefer="pack" frame="square" sizes="112px" />
    </div>
  );
}

/** Pen name with its packaging swatch, plus the contents line. */
function PenName({ product }: { product: Product }) {
  return (
    <>
      <p className="flex items-center gap-2 text-[1.15rem] uppercase leading-none">
        <ProductSwatch product={product} />
        {product.name}
      </p>
      <p className="mt-1.5 text-[13px] leading-snug text-muted">{product.subtitle}</p>
    </>
  );
}

/**
 * Detail-page "Buy" panel. Renders from the static catalogue, so the server and
 * first client render match; the cart is only touched on click. A compound that
 * is only stocked inside a blend (BPC-157 → Wolverine, KPV → Klow) resolves to
 * that pen and says so.
 */
export function BuyPanel({ compound }: { compound: Compound }) {
  const commerce = commerceForCompound(compound.slug);
  const { product, state, href, availabilityLabel, channelLabel, inBlend, blendPartners } = commerce;
  const [variantId, setVariantId] = React.useState(commerce.variant?.id);
  const variant = product?.variants.find((v) => v.id === variantId) ?? commerce.variant;

  const panelTitle = inBlend ? "In the range · blend" : "In the range";

  /* ---------------------------------------------------------- Purchasable */
  if (state === "buy" && product && variant) {
    const prices = product.variants.map((v) => v.price).filter((p) => p > 0);
    const multi = product.variants.length > 1;
    // Only worth saying "from £x" when a cheaper size than the one shown exists.
    const cheaperExists = multi && prices.some((p) => p < variant.price);
    return (
      <section className="p-5 sm:p-6" aria-label={`Buy ${product.name}`}>
        <PanelHead title={panelTitle} meta={[availabilityLabel, channelLabel].filter(Boolean).join(" · ")} />

        {inBlend && (
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">
            Available in <span className="font-medium text-ink">{product.name}</span>
            {blendPartners && blendPartners.length > 0 && <> (with {joinNames(blendPartners)})</>}. {compound.name} is not sold on its own
            in the {BRAND.displayName} range.
          </p>
        )}

        <div className="mt-4 flex gap-4">
          <PenPhoto product={product} />
          <div className="min-w-0 flex-1">
            <PenName product={product} />
            <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
              <span className="font-mono text-[1.35rem] leading-none tnum">{formatMoney(variant.price)}</span>
              {variant.compareAtPrice !== undefined && variant.compareAtPrice > variant.price && (
                <s className="font-mono text-[12px] text-muted tnum">{formatMoney(variant.compareAtPrice)}</s>
              )}
            </p>
            <p className="label-mono mt-1.5">
              {variant.label}
              {variant.unitNote ? ` · ${variant.unitNote}` : ""}
              {cheaperExists ? ` · ${formatFrom(prices)}` : ""}
            </p>
          </div>
        </div>

        {multi && (
          <Segmented
            size="sm"
            fill
            className="mt-4"
            label={`${product.name} size`}
            value={variant.id}
            onChange={setVariantId}
            options={product.variants.map((v) => ({
              value: v.id,
              label: v.label,
              title: `${v.label} · ${formatMoney(v.price)}`,
            }))}
          />
        )}

        <dl className="mt-4 border-t border-line">
          {inBlend && product.pen && <SpecRow label="Pen contents" value={product.pen.composition} />}
          {product.coa && (
            <>
              <SpecRow label="Batch" value={<span className="font-mono text-[13px] tnum">{product.coa.batch}</span>} />
              <SpecRow label="Purity" value={product.coa.purity} />
              <SpecRow label="Tested" value={`${product.coa.lab} · ${formatDate(product.coa.testedOn, { month: "short" })}`} />
            </>
          )}
        </dl>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <AddToCartButton product={product} variant={variant}>
            {inBlend ? `Add ${product.name}` : COMMERCE_STATE_LABELS.buy}
          </AddToCartButton>
          <Button href={href} variant="secondary">
            View pen
          </Button>
        </div>
        <p className="mt-3 text-[11.5px] leading-snug text-muted">{product.regulatoryLabel}</p>
      </section>
    );
  }

  /* ---------------------------------------------------------- Prescription */
  if (state === "consultation" && product) {
    return (
      <section className="p-5 sm:p-6" aria-label={`${product.name} consultation`}>
        <PanelHead title="Prescription-only" meta={availabilityLabel} />
        <div className="mt-4 flex gap-4">
          <PenPhoto product={product} />
          <div className="min-w-0 flex-1">
            <PenName product={product} />
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">{product.regulatoryLabel}</p>
          </div>
        </div>
        <Button href={href} className="mt-4 w-full">
          {COMMERCE_STATE_LABELS.consultation}
        </Button>
        <p className="mt-3 text-[11.5px] leading-snug text-muted">
          Eligibility is decided by the prescriber. The consultation can end without a prescription.
        </p>
      </section>
    );
  }

  /* ---------------------------------------------------------- Declined */
  if (state === "not_sold" && product) {
    return (
      <section className="p-5 sm:p-6" aria-label={`Why ${compound.name} is not sold`}>
        <PanelHead title="Not sold" meta="Listed for information" />
        <p className="mt-4 text-[1.15rem] uppercase leading-none">We don&rsquo;t sell {compound.name}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">{firstSentences(product.description, 2)}</p>
        <Button href={href} variant="secondary" className="mt-4 w-full">
          {COMMERCE_STATE_LABELS.not_sold}
        </Button>
      </section>
    );
  }

  /* ---------------------------------------------------------- Out of stock */
  if (product) {
    return (
      <section className="p-5 sm:p-6" aria-label={`${product.name} availability`}>
        <PanelHead title={panelTitle} meta={[availabilityLabel, channelLabel].filter(Boolean).join(" · ")} />
        <div className="mt-4 flex gap-4">
          <PenPhoto product={product} />
          <div className="min-w-0 flex-1">
            <PenName product={product} />
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">
              {inBlend ? `${compound.name} is carried in this pen, which is ` : "Currently "}out of stock. Register on the pen&rsquo;s page to be
              told when the next tested batch is released.
            </p>
          </div>
        </div>
        <Button href={href} variant="secondary" className="mt-4 w-full">
          {COMMERCE_STATE_LABELS.unstocked}
        </Button>
      </section>
    );
  }

  /* ---------------------------------------------------------- Not in the range */
  return (
    <section className="p-5 sm:p-6" aria-label={`${compound.name} availability`}>
      <PanelHead title="In the range" meta={availabilityLabel} />
      <p className="mt-4 text-[1.15rem] uppercase leading-none">Not in the range</p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">
        No {BRAND.displayName} pen contains {compound.name}. The record on this page stands on its own; the shop lists the pens that have
        passed batch testing.
      </p>
      <Button href={href} variant="secondary" className="mt-4 w-full">
        See the range
      </Button>
    </section>
  );
}
