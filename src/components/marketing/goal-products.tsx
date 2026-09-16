import type { GoalDef } from "@/data/goals";
import type { Product } from "@/data/products";
import { IndexHead } from "./index-head";
import { ProductRow } from "./product-tile";

/**
 * "Products people research for {goal}" on ad landing pages. Listed because the
 * compound has an evidence entry for the goal — with the honest note that the
 * assessment, not the list, decides what fits.
 */
export function GoalProducts({ goal, products, total }: { goal: GoalDef; products: Product[]; total: number }) {
  const goalLower = goal.label.toLowerCase();

  if (products.length === 0) {
    return (
      <section className="rule-b">
        <div className="container-x py-12 lg:py-16">
          <IndexHead
            index="02"
            label="Products"
            title={`Nothing in the catalogue is researched for ${goalLower}.`}
            description="That is the honest position, and the report will say the same. The compound directory explains where the evidence stands for each compound."
            action={{ href: "/peptides", label: "Compound directory" }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="rule-b">
      <div className="container-x py-12 lg:py-16">
        <IndexHead
          index="02"
          label="Products"
          title={`Products people research for ${goalLower}.`}
          description="Listed because their compound has an evidence entry for this goal — not because they suit you. The assessment decides what fits; if your answers raise a flag for a product, the report says so and it is not added to your cart."
          action={{ href: `/shop/?goal=${goal.id}`, label: total > products.length ? `All ${total} products` : "Open the shop" }}
        />
        <ProductRow products={products} action="view" className="mt-8" />
      </div>
    </section>
  );
}
