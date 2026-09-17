import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { PRODUCTS } from "@/data/products";
import { BRAND } from "@/lib/brand";
import { titleCase } from "@/lib/utils";
import { ASSESSMENT_MINUTES, CHECKUP, numberWord } from "@/components/marketing/copy";

const LINKS = [
  { href: "/shop", label: "The range", body: `${titleCase(numberWord(PRODUCTS.length))} pens, one format, a certificate per lot.` },
  { href: "/assessment", label: CHECKUP, body: `${ASSESSMENT_MINUTES} minutes. Ends at a pen — or says not to buy.` },
  { href: "/peptides", label: "Compound directory", body: "Evidence and regulatory status, graded the same way." },
  { href: "/faq", label: "FAQ", body: "Labelling, needles, storage, certificates, shipping, returns, data." },
];

/**
 * Root 404. Renders outside the (site) layout, so it carries its own minimal
 * chrome: logo bar, message, four useful routes, support email.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="rule-b">
        <div className="container-x flex h-16 items-center">
          <Logo />
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="rule-b">
          <div className="container-x grid gap-6 py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:py-24">
            <div className="flex flex-col gap-1.5">
              <p className="label-mono text-ink">Error · 404</p>
              <p className="label-mono">Page not found</p>
            </div>
            <div className="min-w-0">
              <h1 className="text-balance text-[2.75rem] uppercase sm:text-[4rem] lg:text-[5rem]">
                Nothing at
                <br />
                this address.
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-3 sm:text-[17px]">
                The link may be out of date, or the address may have been typed differently. Nothing you entered has been lost — {CHECKUP} progress,
                your match and your cart stay in your browser.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/" size="lg" variant="primary">
                  Home
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button href="/shop" size="lg" variant="secondary">
                  Shop the range
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container-x py-10 lg:py-14">
          <ul className="cell-grid sm:grid-cols-2 lg:grid-cols-4">
            {LINKS.map((l) => (
              <li key={l.href} className="flex">
                <Link href={l.href} className="hover-invert flex min-h-[9rem] flex-1 flex-col justify-between gap-6 p-5">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-display text-[1.2rem] uppercase leading-[1.02] text-ink">{l.label}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                  </span>
                  <span className="text-[13px] leading-relaxed text-muted">{l.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="rule-t">
        <div className="container-x flex flex-col gap-2 py-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Think this is our mistake?{" "}
            <a href={`mailto:${BRAND.supportEmail}`} className="text-ink link-rule">
              {BRAND.supportEmail}
            </a>
          </p>
          <p>
            {BRAND.name} · {BRAND.descriptor} · {BRAND.domain}
          </p>
        </div>
      </footer>
    </div>
  );
}
