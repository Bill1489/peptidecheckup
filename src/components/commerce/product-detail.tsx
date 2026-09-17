import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoaPanel } from "@/components/commerce/coa-panel";
import { EvidencePanel } from "@/components/commerce/evidence-panel";
import { GridFillers } from "@/components/commerce/grid-fillers";
import { PenSpec } from "@/components/commerce/pen-spec";
import { ProductCard } from "@/components/commerce/product-card";
import { ProductSwatch } from "@/components/commerce/product-image";
import { ProductStage } from "@/components/commerce/product-stage";
import { assessmentPath, componentSlugs, otherProducts } from "@/components/commerce/product-utils";
import { AVAILABILITY_LABELS, CHANNEL_LABELS, type Availability, type Product } from "@/data/products";
import { BRAND } from "@/lib/brand";

const AVAILABILITY_TONE: Record<Availability, "success" | "warning" | "neutral" | "info" | "brand" | "danger"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "neutral",
  preorder: "info",
  consultation: "brand",
  not_sold: "danger",
};

/** General operation of a dose-dial pen. Device handling only — no dosing. */
const PEN_STEPS: { title: string; body: string }[] = [
  {
    title: "Attach a pen needle",
    body: "Take the cap off, wipe the septum with an alcohol swab and screw a compatible pen needle on until it seats. Use a fresh needle every time and never share a pen.",
  },
  {
    title: "Prime",
    body: "Dial a small test amount, hold the pen needle-up and press the button until a drop appears at the tip. This clears air from the needle and confirms the pen delivers.",
  },
  {
    title: "Dial",
    body: "Turn the dial to the volume you intend to deliver; the window shows the setting in the pen's increments. The dial sets a volume of solution — nothing more.",
  },
  {
    title: "Inject",
    body: "Insert as the pen-needle instructions describe, press the button fully and hold for ten seconds before withdrawing. Remove and bin the needle in a sharps container, recap and refrigerate.",
  },
];

export function ProductDetail({ product }: { product: Product }) {
  const others = otherProducts(product);
  const components = componentSlugs(product);

  const intro = (
    <header>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
        <Link href="/shop/" className="hover:text-ink">
          The range
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="text-ink" aria-current="page">
          {product.name}
        </span>
      </nav>
      <div className="mt-5 flex items-center gap-3">
        <ProductSwatch product={product} className="h-4 w-4" />
        <h1 className="text-balance text-[2.25rem] uppercase sm:text-[3rem] lg:text-[3.5rem]">{product.name}</h1>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-[16px]">{product.subtitle}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
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
    </header>
  );

  return (
    <article className="pb-24 lg:pb-0">
      <div className="container-x py-8 lg:py-12">
        <ProductStage product={product} intro={intro}>
          {/* About */}
          <section className="mt-10" aria-labelledby="about-heading">
            <p className="label-mono">About</p>
            <h2 id="about-heading" className="mt-1.5 text-[1.25rem] uppercase">
              What this is
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink">{product.description}</p>
            {product.highlights.length > 0 && (
              <ul className="mt-4 border border-ink" aria-label="Highlights">
                {product.highlights.map((h, i) => (
                  <li key={h} className="flex items-center gap-4 border-b border-line px-4 py-2.5 text-[13.5px] text-ink last:border-b-0">
                    <span className="font-mono text-[10.5px] text-muted tnum">{String(i + 1).padStart(2, "0")}</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* What's in the pen */}
          <PenSpec product={product} className="mt-10" />

          {/* How the pen works */}
          <section className="mt-10" aria-labelledby="steps-heading">
            <p className="label-mono">Device</p>
            <h2 id="steps-heading" className="mt-1.5 text-[1.25rem] uppercase">
              How the pen works
            </h2>
            <ol className="mt-4 border border-ink">
              {PEN_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4 border-b border-line p-4 last:border-b-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-ink font-mono text-[11px] font-semibold text-white tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-3 border-l-2 border-ink pl-3 text-[12.5px] leading-relaxed text-ink-3">
              Dosing is not provided; see the research information in the evidence record. These steps describe how the device operates, not how or
              whether to use its contents.
            </p>
          </section>

          {/* Certificate */}
          {product.coa && <CoaPanel coa={product.coa} productName={product.name} componentCount={components.length} className="mt-10" />}

          {/* Evidence record */}
          {components.length > 0 && <EvidencePanel product={product} className="mt-10" />}

          {/* Who this is for */}
          <section className="mt-10" aria-labelledby="fit-heading">
            <p className="label-mono">Fit</p>
            <h2 id="fit-heading" className="mt-1.5 text-[1.25rem] uppercase">
              Who this is for
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">{product.bestFor}</p>
            <ul className="mt-4 border border-ink" aria-label="Matched against">
              {product.matchFor.map((m) => (
                <li key={m} className="flex items-start gap-3 border-b border-line px-4 py-3 text-[14px] text-ink last:border-b-0">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden />
                  {m}
                </li>
              ))}
            </ul>
            <div className="mt-4 border border-ink bg-ink p-5 text-white">
              <p className="label-mono text-white/60">Check your fit</p>
              <p className="mt-2 text-pretty text-[14px] leading-relaxed text-white/85">
                The {BRAND.assessmentName} maps your goal and history against the evidence for this pen and tells you if it is a poor fit — even
                after you have bought it.
              </p>
              <Button href={assessmentPath(product)} variant="inverted" size="md" className="mt-4 w-full justify-between sm:w-auto">
                Check your fit · 7 minutes
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </section>
        </ProductStage>
      </div>

      {/* Also in the range */}
      {others.length > 0 && (
        <section className="rule-t bg-paper-2" aria-labelledby="range-heading">
          <div className="container-x py-12 lg:py-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label-mono">Also in the range</p>
                <h2 id="range-heading" className="mt-2 text-[1.75rem] uppercase sm:text-[2.25rem]">
                  The other {others.length}
                </h2>
              </div>
              <Link href="/shop/" className="link-rule hidden items-center gap-1.5 text-[14px] font-medium text-ink sm:inline-flex">
                Compare the range
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
            <ul className="cell-grid mt-6 grid-cols-2 lg:grid-cols-5" aria-label="Other pens in the range">
              {others.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} size="sm" className="w-full" />
                </li>
              ))}
              <GridFillers count={others.length} cols={{ base: 2, lg: 5, xl: 5 }} />
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
