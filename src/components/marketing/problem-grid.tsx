import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductSwatch } from "@/components/commerce/product-image";
import { resolveProblems } from "@/lib/funnel";
import { CHECKUP_SHORT, index } from "./copy";
import { IndexHead } from "./index-head";
import { PenThumb } from "./pen-cell";

/**
 * "Start from the problem": six problems, each naming the pen the Checkup
 * usually lands on — in the catalogue's own words — and handing off to the
 * assessment with the goal and symptom pre-selected. The answers decide.
 */
export function ProblemGrid() {
  const cells = resolveProblems();
  if (cells.length === 0) return null;

  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="03"
          label="Start from the problem"
          title="Say what’s wrong. The Checkup says which pen — or none."
          description={`Each cell names the pen the ${CHECKUP_SHORT} usually lands on for that problem, quoting the catalogue’s own description of who the pen is for. It is a starting point, not a verdict: the assessment checks your history and medicines first and can end at no pen at all.`}
          action={{ href: "/start", label: "All entry points" }}
        />
        <ul className="cell-grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell, i) => (
            <li key={`${cell.symptom.slug}-${cell.product.slug}`} className="flex">
              <Link
                href={cell.href}
                className="hover-invert flex min-h-[15rem] flex-1 flex-col justify-between gap-6 p-5 text-ink sm:p-6"
                aria-label={`${cell.title} — start the ${CHECKUP_SHORT} for ${cell.goal.label.toLowerCase()}`}
              >
                <span className="flex flex-col gap-3">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="label-mono tnum">{index(i + 1)}</span>
                    <span className="label-mono text-right">{cell.goal.short}</span>
                  </span>
                  <span className="font-display text-balance text-[1.35rem] uppercase leading-[1.02] tracking-[-0.02em] sm:text-[1.6rem]">
                    {cell.title}
                  </span>
                  <span className="text-[13px] leading-relaxed text-ink-3">“{cell.matchLine}”</span>
                </span>
                <div className="flex items-end justify-between gap-4">
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="label-mono">Usually lands on</span>
                    <span className="flex items-center gap-2">
                      <ProductSwatch product={cell.product} />
                      <span className="font-display text-[15px] uppercase leading-none tracking-[-0.02em]">{cell.product.name}</span>
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">— if your answers allow it</span>
                  </span>
                  <div className="flex shrink-0 items-end gap-3">
                    <PenThumb product={cell.product} className="h-16 w-16" />
                    <ArrowRight className="mb-1 h-4 w-4" aria-hidden />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
