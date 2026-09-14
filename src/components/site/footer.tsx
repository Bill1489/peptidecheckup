import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { BRAND, DISCLAIMER_SHORT } from "@/lib/brand";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/assessment", label: "Start assessment" },
      { href: "/peptides", label: "Peptide directory" },
      { href: "/compare", label: "Compare peptides" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Goals",
    links: [
      { href: "/start/weight", label: "Weight management" },
      { href: "/start/recovery", label: "Injury & recovery" },
      { href: "/start/tired", label: "Energy & wellbeing" },
      { href: "/start/skin", label: "Skin & hair" },
      { href: "/start/sleep", label: "Sleep" },
      { href: "/start/libido", label: "Sexual health" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/methodology", label: "Methodology" },
      { href: "/safety", label: "Safety & disclaimer" },
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: `mailto:${BRAND.supportEmail}`, label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-paper-2">
      <div className="container-x py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">{BRAND.shortDescription}</p>
            <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-2">
              Evidence database last reviewed · September 2026
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-3">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-white/60 p-5 text-xs leading-relaxed text-muted">
          <strong className="font-medium text-ink-3">Important. </strong>
          {DISCLAIMER_SHORT} Many compounds listed are not authorised as medicines in any jurisdiction and some are prohibited in sport. Regulatory status is maintained manually and may change — verify with your national regulator.
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.14em]">{BRAND.domain}</p>
        </div>
      </div>
    </footer>
  );
}
