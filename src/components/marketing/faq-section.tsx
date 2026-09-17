import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Faq } from "./faq";
import { ALL_FAQ, HOME_FAQ } from "./faq-data";

/** Home FAQ: label and headline in the left column, the accordion on the right. */
export function FaqSection() {
  return (
    <section className="rule-b">
      <div className="container-x grid gap-8 py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:py-20">
        <div>
          <p className="label-mono text-ink">
            <span className="tnum">08 — </span>FAQ
          </p>
          <h2 className="mt-4 break-words text-[2rem] uppercase sm:text-[2.6rem] lg:text-[2.25rem] xl:text-[2.75rem]">Questions.</h2>
          <Link
            href="/faq"
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink link-rule"
          >
            All {ALL_FAQ.length} questions
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <Faq items={HOME_FAQ} />
      </div>
    </section>
  );
}
