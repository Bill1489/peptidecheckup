import type { Product } from "@/data/products";
import { IndexHead } from "./index-head";
import { ProductRow } from "./product-tile";

/** Bestseller row. Tiles carry a one-tap Add for single-variant products; everything else links through. */
export function Bestsellers({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="04"
          label="Bestsellers"
          title="Ordered most often."
          description="Each ships with the certificate for its lot. Single-size products add to the cart from here; the rest open the product page to choose a size."
          action={{ href: "/shop", label: "Shop everything" }}
        />
        <ProductRow products={products} action="add" className="mt-10" />
      </div>
    </section>
  );
}
