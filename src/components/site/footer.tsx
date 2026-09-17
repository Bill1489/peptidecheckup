import Link from "next/link";
import { LogoMark } from "@/components/ui/logo";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { BRAND, DISCLAIMER_SHORT, RESEARCH_USE_LABEL } from "@/lib/brand";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "The range",
    links: [
      { href: "/shop", label: "The range" },
      { href: "/shop/tesamorelin", label: "Tesamorelin" },
      { href: "/shop/mots-c", label: "MOTS-C" },
      { href: "/shop/ghk-cu", label: "GHK-Cu" },
      { href: "/shop/nad", label: "NAD+" },
      { href: "/shop/wolverine", label: "Wolverine" },
      { href: "/shop/klow", label: "Klow" },
      { href: "/lab-testing", label: "Lab testing & CoAs" },
    ],
  },
  {
    title: "Assess",
    links: [
      { href: "/assessment", label: "Take the Peptide Checkup" },
      { href: "/start/weight", label: "Weight" },
      { href: "/start/recovery", label: "Injury & recovery" },
      { href: "/start/tired", label: "Energy" },
      { href: "/start/skin", label: "Skin & hair" },
      { href: "/start/sleep", label: "Sleep" },
    ],
  },
  {
    title: "Evidence",
    links: [
      { href: "/peptides", label: "Compound directory" },
      { href: "/compare", label: "Compare" },
      { href: "/methodology", label: "Methodology" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/safety", label: "Safety" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/shipping", label: "Shipping & returns" },
      { href: "/faq", label: "FAQ" },
      { href: "/about", label: "About" },
      { href: "/account/orders", label: "Your orders" },
      { href: `mailto:${BRAND.supportEmail}`, label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="rule-t mt-24 bg-white">
      {/* Newsletter band */}
      <div className="rule-b">
        <div className="container-x grid gap-8 py-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="label-mono text-brand-600">Lot alerts &amp; evidence updates</p>
            <h2 className="mt-3 text-[2rem] uppercase sm:text-[2.75rem]">
              New lots. New trials.
              <br />
              No hype.
            </h2>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Link columns */}
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="label-mono text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-ink-3 link-rule decoration-transparent hover:decoration-current">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Regulatory */}
      <div className="rule-t">
        <div className="container-x grid gap-6 py-8 text-[12px] leading-relaxed text-muted md:grid-cols-2">
          <p>
            <strong className="font-semibold text-ink">Research products. </strong>
            {RESEARCH_USE_LABEL} Aervyn pens are pre-filled for laboratory research and shipped chilled with the lot certificate.
          </p>
          <p>
            <strong className="font-semibold text-ink">{BRAND.assessmentName}. </strong>
            {DISCLAIMER_SHORT} Regulatory status is maintained manually per jurisdiction and may change.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="rule-t bg-ink text-white">
        <div className="container-x flex flex-col gap-4 py-6 font-mono text-[10.5px] uppercase tracking-[0.14em] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark tone="light" className="h-5 w-5" />
            <span>
              © {new Date().getFullYear()} {BRAND.legalName}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/70">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/shipping" className="hover:text-white">Refunds</Link>
            <span>{BRAND.domain}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
