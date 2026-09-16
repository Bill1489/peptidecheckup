import Link from "next/link";
import { ProductVisual } from "@/components/commerce/product-visual";
import { Badge } from "@/components/ui/badge";
import { defaultVariant, priceRange, purchasable, type Product, type SaleChannel, type Availability } from "@/data/products";
import { formatFrom, formatMoney } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";
import { QuickAdd } from "./quick-add";

type BadgeTone = "neutral" | "brand" | "outline" | "warning" | "danger";

/** Footer action styling shared by the quick-add button and the "View" link. */
const TILE_ACTION_CLASS =
  "relative z-10 inline-flex h-11 shrink-0 items-center justify-center border-l border-ink px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors duration-150 hover:bg-ink hover:text-white";

const CHANNEL_SHORT: Record<SaleChannel, string> = {
  research: "Research use only",
  prescription: "Rx · consultation",
  supplement: "Food supplement",
  cosmetic: "Cosmetic",
  supplies: "Supplies",
};

const CHANNEL_TONE: Record<SaleChannel, BadgeTone> = {
  research: "outline",
  prescription: "brand",
  supplement: "neutral",
  cosmetic: "neutral",
  supplies: "neutral",
};

const AVAILABILITY_NOTE: Partial<Record<Availability, { label: string; tone: BadgeTone }>> = {
  low_stock: { label: "Low stock", tone: "warning" },
  preorder: { label: "Pre-order", tone: "neutral" },
  out_of_stock: { label: "Out of stock", tone: "neutral" },
  not_sold: { label: "Not sold", tone: "danger" },
};

/** Price cell text: a single price, a "from" range, or the channel state. */
export function priceLabel(product: Product): string {
  if (product.availability === "consultation") return "Consultation";
  if (product.availability === "not_sold") return "Not sold";
  const { min, max } = priceRange(product);
  if (min === 0) return "—";
  if (min === max) return formatMoney(min);
  return formatFrom(product.variants.map((v) => v.price).filter((p) => p > 0));
}

/**
 * Dense product tile for marketing surfaces. Illustration, channel badge,
 * name, subtitle, lot line, then a bordered footer with price and one action.
 * The whole tile links to the product page; the action sits above that link.
 */
export function ProductTile({
  product,
  action = "view",
  className,
}: {
  product: Product;
  /** add = quick-add when single-variant and purchasable, otherwise "View" */
  action?: "add" | "view" | "none";
  className?: string;
}) {
  const href = `/shop/${product.slug}/`;
  const variant = defaultVariant(product);
  const canQuickAdd = action === "add" && purchasable(product) && product.variants.length === 1;
  const availability = AVAILABILITY_NOTE[product.availability];
  const viewLabel = product.availability === "consultation" ? "Consult" : product.availability === "not_sold" ? "Why not" : "View";

  return (
    <article className={cn("group relative flex h-full flex-col bg-white", className)}>
      <div className="border-b border-ink">
        <ProductVisual product={product} className="aspect-square" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge size="xs" tone={CHANNEL_TONE[product.channel]}>
            {CHANNEL_SHORT[product.channel]}
          </Badge>
          {availability && (
            <Badge size="xs" tone={availability.tone}>
              {availability.label}
            </Badge>
          )}
        </div>
        <h3 className="font-display mt-3 text-[1.05rem] uppercase leading-[1.05] tracking-[-0.02em] text-ink">
          <Link href={href} className="transition-colors duration-150 after:absolute after:inset-0 after:content-[''] group-hover:text-brand-600">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[13px] leading-snug text-muted">{product.subtitle}</p>
        {product.coa && (
          <p className="label-mono mt-auto pt-3 text-[10px] tnum">
            Lot {product.coa.batch} · {product.coa.purity}
          </p>
        )}
      </div>

      <div className="flex items-stretch border-t border-ink">
        <span className="flex h-11 flex-1 items-center px-4 font-mono text-[13px] text-ink tnum">{priceLabel(product)}</span>
        {canQuickAdd ? (
          <QuickAdd
            productId={product.id}
            variantId={variant.id}
            name={product.name}
            variantLabel={variant.label}
            className={TILE_ACTION_CLASS}
          />
        ) : (
          action !== "none" && (
            <Link href={href} className={TILE_ACTION_CLASS} aria-label={`${viewLabel}: ${product.name}`}>
              {viewLabel}
            </Link>
          )
        )}
      </div>
    </article>
  );
}

/**
 * A row of tiles that scrolls horizontally on small screens and stretches to
 * fill the container on desktop, whatever the count (4–6). Hard 1px dividers.
 */
export function ProductRow({ products, action = "view", className }: { products: Product[]; action?: "add" | "view" | "none"; className?: string }) {
  return (
    <ul
      className={cn(
        "no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto border-y border-ink px-4 sm:mx-0 sm:border-x sm:px-0 lg:overflow-visible",
        className,
      )}
    >
      {products.map((p) => (
        <li
          key={p.id}
          className="w-[72vw] shrink-0 snap-start border-r border-ink first:border-l sm:w-[300px] sm:first:border-l-0 sm:last:border-r-0 lg:w-auto lg:min-w-0 lg:flex-1"
        >
          <ProductTile product={p} action={action} />
        </li>
      ))}
    </ul>
  );
}
