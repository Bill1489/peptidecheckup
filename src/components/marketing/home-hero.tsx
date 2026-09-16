import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductVisual } from "@/components/commerce/product-visual";
import { Button } from "@/components/ui/button";
import { PRODUCTS, type Product } from "@/data/products";
import { ASSESSMENT_MINUTES } from "./copy";
import { priceLabel } from "./product-tile";

/**
 * Store hero. Left: label, headline, one paragraph, two buttons. Right: a
 * 2×2 cell grid of featured products. No decoration — the products are the image.
 */
export function HomeHero({ products }: { products: Product[] }) {
  const cells = products.slice(0, 4);
  const padWithShopAll = cells.length < 4;

  return (
    <section className="rule-b">
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1.05fr_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-16">
        <div className="min-w-0">
          <p className="label-mono text-ink">
            <span className="tnum">01 — </span>Batch-tested · CoA per lot · UK
          </p>
          <h1 className="mt-6 text-[2.75rem] uppercase leading-[0.95] sm:text-[4rem] lg:text-[3.5rem] xl:text-[4.5rem] 2xl:text-[5.25rem]">
            Peptides
            <br />
            with the
            <br />
            paperwork.
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-[15px] leading-relaxed text-ink-3 sm:text-[17px]">
            Research peptides tested at an independent laboratory every batch, with the certificate published against
            the lot number on your vial. A {ASSESSMENT_MINUTES}-minute assessment matches products to your goal and
            history — and says when not to buy.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" size="xl" variant="primary">
              Shop peptides
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href="/assessment" size="xl" variant="secondary">
              Find my match — {ASSESSMENT_MINUTES} min
            </Button>
          </div>
        </div>

        <ul className="cell-grid grid-cols-2" aria-label="Featured products">
          {cells.map((p) => (
            <li key={p.id} className="flex">
              <Link href={`/shop/${p.slug}/`} className="hover-invert flex flex-1 flex-col">
                <div className="border-b border-ink">
                  <ProductVisual product={p} className="aspect-square" />
                </div>
                <span className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                  <span className="font-display text-[12px] uppercase leading-none tracking-[-0.01em] text-ink sm:text-[13px]">{p.name}</span>
                  <span className="font-mono text-[12px] text-muted tnum">{priceLabel(p)}</span>
                </span>
              </Link>
            </li>
          ))}
          {padWithShopAll && (
            <li className="flex">
              <Link href="/shop" className="hover-invert flex min-h-[11rem] flex-1 flex-col justify-between p-4">
                <span className="label-mono">All products</span>
                <span className="flex items-end justify-between gap-3">
                  <span className="font-display text-[1.5rem] uppercase leading-[0.98] text-ink sm:text-[1.75rem]">
                    Shop all
                    <br />
                    {PRODUCTS.length}
                  </span>
                  <ArrowRight className="mb-1 h-5 w-5 shrink-0" aria-hidden />
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
