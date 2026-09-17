import { PRODUCTS } from "@/data/products";
import { titleCase } from "@/lib/utils";
import { blendProducts, CHECKUP_SHORT, numberWord } from "./copy";
import { IndexHead } from "./index-head";
import { PenCell } from "./pen-cell";

/**
 * The whole range as one bordered strip: three cells across, six from 1280px.
 * Every cell is the same size and every photo the same scale, so the pens read
 * as a set rather than a list.
 */
export function RangeStrip() {
  const blends = blendProducts().length;
  const singles = PRODUCTS.length - blends;

  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="02"
          label="The range"
          title={`One format. ${titleCase(numberWord(PRODUCTS.length))} pens. No vials, no kits, no reconstitution.`}
          description={`Pre-filled 3 mL dose-dial pens, photographed as they ship. ${titleCase(numberWord(singles))} are single compounds and ${numberWord(blends)} are blends; each carries a lot number and a published certificate of analysis. Which one — if any — is the ${CHECKUP_SHORT}’s job, not the strip’s.`}
          action={{ href: "/shop", label: "Shop the range" }}
        />
        <ul className="cell-grid mt-10 grid-cols-2 md:grid-cols-3 xl:grid-cols-6" aria-label="The range">
          {PRODUCTS.map((p, i) => (
            <li key={p.id} className="flex">
              <PenCell product={p} priority={i < 3} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
