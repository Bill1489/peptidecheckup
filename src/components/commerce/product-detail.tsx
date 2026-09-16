import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpecRow } from "@/components/ui/card";
import { CoaPanel } from "@/components/commerce/coa-panel";
import { EvidencePanel } from "@/components/commerce/evidence-panel";
import { GridFillers } from "@/components/commerce/grid-fillers";
import { KitContents } from "@/components/commerce/kit-contents";
import { ProductCard } from "@/components/commerce/product-card";
import { ProductStage } from "@/components/commerce/product-stage";
import { relatedProducts } from "@/components/commerce/product-utils";
import { getCompound } from "@/data/compounds";
import { AVAILABILITY_LABELS, CATEGORY_LABELS, CHANNEL_LABELS, type Availability, type Product } from "@/data/products";
import { formatDate } from "@/lib/utils";

const AVAILABILITY_TONE: Record<Availability, "success" | "warning" | "neutral" | "info" | "brand" | "danger"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "neutral",
  preorder: "info",
  consultation: "brand",
  not_sold: "danger",
};

export function ProductDetail({ product }: { product: Product }) {
  const compound = product.compoundSlug ? getCompound(product.compoundSlug) : undefined;
  const related = relatedProducts(product, 3);

  const intro = (
    <header>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
        <Link href="/shop/" className="hover:text-ink">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <Link href={`/shop/?category=${product.category}`} className="hover:text-ink">
          {CATEGORY_LABELS[product.category]}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="text-ink" aria-current="page">
          {product.name}
        </span>
      </nav>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge tone={AVAILABILITY_TONE[product.availability]} size="xs" dot>
          {AVAILABILITY_LABELS[product.availability]}
        </Badge>
        <Badge tone="outline" size="xs">
          {CHANNEL_LABELS[product.channel]}
        </Badge>
        {product.isNew && (
          <Badge tone="ink" size="xs">
            New
          </Badge>
        )}
        {product.bestseller && (
          <Badge tone="ink" size="xs">
            Bestseller
          </Badge>
        )}
      </div>
      <h1 className="mt-4 text-balance text-[2.25rem] uppercase sm:text-[3rem] lg:text-[3.5rem]">{product.name}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-[16px]">{product.subtitle}</p>
    </header>
  );

  return (
    <article className="pb-24 lg:pb-0">
      <div className="container-x py-8 lg:py-12">
        <ProductStage product={product} intro={intro}>
          {/* Certificate */}
          {product.coa && <CoaPanel coa={product.coa} productName={product.name} className="mt-10" />}

          {/* Kit contents */}
          {product.bundleOf && <KitContents kit={product} className="mt-10" />}

          {/* Spec sheet */}
          <section className="mt-10" aria-labelledby="spec-heading">
            <p className="label-mono">Specification</p>
            <h2 id="spec-heading" className="mt-1.5 text-[1.25rem] uppercase">
              Spec sheet
            </h2>
            <div className="mt-4 border border-ink px-4 py-1">
              <SpecRow label="Form" value={product.form} />
              {product.purity && <SpecRow label="Purity" value={<span className="font-mono text-[13px] tnum">{product.purity}</span>} />}
              {product.specs.map((s) => (
                <SpecRow key={s.label} label={s.label} value={<span className="break-words">{s.value}</span>} />
              ))}
              <SpecRow
                label="Weight"
                value={product.shipping.weightGrams > 0 ? <span className="font-mono text-[13px] tnum">{product.shipping.weightGrams} g</span> : "—"}
              />
              <SpecRow label="Updated" value={formatDate(product.lastUpdated)} />
            </div>
          </section>

          {/* Description */}
          <section className="mt-10" aria-labelledby="about-heading">
            <p className="label-mono">About</p>
            <h2 id="about-heading" className="mt-1.5 text-[1.25rem] uppercase">
              {product.availability === "not_sold" ? "Why we do not sell this" : "What this is"}
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink">{product.description}</p>
          </section>

          {/* Highlights */}
          {product.highlights.length > 0 && (
            <ul className="mt-6 border border-ink" aria-label="Highlights">
              {product.highlights.map((h, i) => (
                <li key={h} className="flex items-center gap-4 border-b border-line px-4 py-3 text-[14px] text-ink last:border-b-0">
                  <span className="font-mono text-[10.5px] text-muted tnum">{String(i + 1).padStart(2, "0")}</span>
                  {h}
                </li>
              ))}
            </ul>
          )}

          {/* Evidence record */}
          {compound && <EvidencePanel compound={compound} className="mt-10" />}
        </ProductStage>
      </div>

      {/* What our assessment says */}
      <section className="rule-y bg-ink text-white">
        <div className="container-x grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-14">
          <div>
            <p className="label-mono text-white/60">What our assessment says</p>
            <p className="mt-4 max-w-3xl font-display text-balance text-[1.5rem] uppercase leading-[1.02] sm:text-[2rem] lg:text-[2.5rem]">
              Our report will tell you if this is a poor fit for your history — even after you&apos;ve bought it.
            </p>
          </div>
          <Button
            href={compound ? `/assessment/?compound=${compound.slug}` : "/assessment/"}
            variant="inverted"
            size="lg"
            className="w-full lg:w-auto"
          >
            Take the 7-minute assessment
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </section>

      {/* Frequently bought with */}
      {related.length > 0 && (
        <section className="container-x py-12 lg:py-16" aria-labelledby="related-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label-mono">Frequently bought with</p>
              <h2 id="related-heading" className="mt-2 text-[1.75rem] uppercase sm:text-[2.25rem]">
                Goes with {product.name}
              </h2>
            </div>
            <Link href="/shop/" className="link-rule hidden items-center gap-1.5 text-[14px] font-medium text-ink sm:inline-flex">
              All products
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="cell-grid mt-6 grid-cols-2 lg:grid-cols-3" aria-label="Related products">
            {related.map((p) => (
              <li key={p.id} className="flex">
                <ProductCard product={p} className="w-full" />
              </li>
            ))}
            <GridFillers count={related.length} cols={{ base: 2, lg: 3, xl: 3 }} />
          </ul>
        </section>
      )}
    </article>
  );
}
