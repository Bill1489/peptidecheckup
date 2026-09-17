import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/commerce/product-image";
import { productPath } from "@/components/commerce/product-utils";
import { Button } from "@/components/ui/button";
import { PRODUCTS, type Product } from "@/data/products";
import { BRAND } from "@/lib/brand";
import { titleCase } from "@/lib/utils";
import { ASSESSMENT_MINUTES, CHECKUP, numberWord } from "./copy";
import { PenCaption } from "./pen-cell";

/**
 * Store hero. Left: mono brand line, uppercase headline, one paragraph, two
 * buttons. Right: one pen photographed in the hand, in a bordered frame on
 * white, with a mono caption strip. Nothing else — the pen is the image.
 */
export function HomeHero({ product }: { product: Product }) {
  const count = PRODUCTS.length;

  return (
    <section className="rule-b">
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1.05fr_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-16">
        <div className="min-w-0">
          <p className="label-mono text-ink">
            {BRAND.name} · {BRAND.descriptor} · UK
          </p>
          <h1 className="mt-6 text-[2.75rem] uppercase leading-[0.95] sm:text-[4rem] lg:text-[3.5rem] xl:text-[4.5rem] 2xl:text-[5.25rem]">
            {numberWord(count)} pens.
            <br />
            One honest
            <br />
            answer.
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-[15px] leading-relaxed text-ink-3 sm:text-[17px]">
            {titleCase(numberWord(count))} pre-filled 3 mL dose-dial pens, each lot tested by an
            independent laboratory with the certificate published against the lot number. The {ASSESSMENT_MINUTES}-minute {CHECKUP} matches you to
            one of them — or tells you not to buy.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/assessment" size="xl" variant="primary">
              Find my pen — {ASSESSMENT_MINUTES} min
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href="/shop" size="xl" variant="secondary">
              Shop the range
            </Button>
          </div>
        </div>

        <Link
          href={productPath(product.slug)}
          className="group block w-full border border-ink bg-white text-ink lg:max-w-[32rem] lg:justify-self-end"
          aria-label={`${product.name} — view pen`}
        >
          <ProductImage product={product} prefer="hand" frame="portrait" priority sizes="(min-width: 1024px) 40vw, 100vw" />
          <span className="flex items-center justify-between gap-4 border-t border-ink px-4 py-3 text-ink">
            <PenCaption product={product} />
            <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] underline decoration-transparent underline-offset-[3px] transition-colors duration-150 group-hover:text-brand-600 group-hover:decoration-current">
              Details
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
