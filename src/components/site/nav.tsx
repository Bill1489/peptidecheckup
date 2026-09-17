"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/commerce/cart-button";
import { COMMERCE } from "@/lib/commerce/config";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "The range" },
  { href: "/assessment", label: "Peptide Checkup" },
  { href: "/peptides", label: "Evidence" },
  { href: "/compare", label: "Compare" },
  { href: "/lab-testing", label: "Lab testing" },
];

const MOBILE_EXTRA = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/methodology", label: "Methodology" },
  { href: "/shipping", label: "Shipping & returns" },
  { href: "/faq", label: "FAQ" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Ticker */}
      <div className="rule-b overflow-hidden bg-ink text-white" aria-hidden>
        <div className="ticker">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {COMMERCE.trustFacts.map((fact) => (
                <span key={`${k}-${fact}`} className="flex items-center gap-4 whitespace-nowrap px-6 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em]">
                  <span className="h-1.5 w-1.5 bg-brand-400" />
                  {fact}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div className="rule-b">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center md:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative flex h-16 items-center px-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink-3 transition-colors hover:text-ink",
                    active && "text-ink",
                  )}
                >
                  {l.label}
                  {active && <span className="absolute inset-x-4 bottom-0 h-[2px] bg-brand-600" aria-hidden />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button href="/assessment" size="md" variant="primary" className="hidden lg:inline-flex">
              Find my pen
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <CartButton />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center border border-ink text-ink hover:bg-ink hover:text-white md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-[6.1rem] z-40 overflow-y-auto bg-white md:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="flex items-center justify-between border-b border-ink px-5 py-5 font-display text-[1.75rem] uppercase text-ink hover:bg-ink hover:text-white"
                >
                  {l.label}
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              ))}
              <div className="grid grid-cols-2 border-b border-ink">
                {MOBILE_EXTRA.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className="border-r border-line px-5 py-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3 last:border-r-0 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="p-5" onClick={close}>
                <Button href="/assessment" size="xl" variant="primary" className="w-full">
                  Find my pen — 7-minute Checkup
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="mt-3 text-center font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  Get matched · unlock 10% off
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
