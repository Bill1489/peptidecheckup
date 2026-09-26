import { GridFillers } from "@/components/commerce/grid-fillers";
import { rangeCategoriesWithProducts, rangeHighlights } from "@/components/commerce/product-utils";
import { PRODUCTS } from "@/data/products";
import { blendNames, blendProducts, CHECKUP_SHORT } from "./copy";
import { IndexHead } from "./index-head";
import { PenCell } from "./pen-cell";

/**
 * The featured and bestselling pens as one bordered strip — two cells across
 * on a phone, three from 768px, four from 1280px — with the count of the whole
 * range and a link to it. Every cell is the same size and every photo the same
 * scale, so the pens read as a set rather than a list.
 */
export function RangeStrip() {
  const highlights = rangeHighlights(8);
  const blends = blendProducts().length;
  const singles = PRODUCTS.length - blends;
  const categories = rangeCategoriesWithProducts().length;

  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="02"
          label={`The range · ${highlights.length} of ${PRODUCTS.length}`}
          title={`One format. ${PRODUCTS.length} pens. No vials, no kits, no reconstitution.`}
          description={`Pre-filled 3 mL dose-dial pens across ${categories} categories, photographed as they ship where photography exists. ${singles} are single compounds and ${blends} — ${blendNames()} — are blends; each carries a lot number and a published certificate of analysis. The featured and bestselling pens are below. Which one — if any — is the ${CHECKUP_SHORT}’s job, not the strip’s.`}
          action={{ href: "/shop", label: `View all ${PRODUCTS.length}` }}
        />
        <ul className="cell-grid mt-10 grid-cols-2 md:grid-cols-3 xl:grid-cols-4" aria-label="Featured and bestselling pens">
          {highlights.map((p, i) => (
            <li key={p.id} className="flex">
              <PenCell product={p} priority={i < 4} />
            </li>
          ))}
          <GridFillers count={highlights.length} cols={{ base: 2, md: 3, lg: 3, xl: 4 }} />
        </ul>
      </div>
    </section>
  );
}
