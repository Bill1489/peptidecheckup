import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { BRAND } from "@/lib/brand";
import { BeadChain } from "@/components/marketing/bead-chain";

const LINKS = [
  { href: "/peptides", label: "Peptide directory", body: "Every compound, written to the same standard." },
  { href: "/compare", label: "Compare peptides", body: "Evidence, status and dosing studies side by side." },
  { href: "/start", label: "Start with your goal", body: "Pick the goal that brought you here." },
  { href: "/faq", label: "FAQ", body: "What this is, and what it is not." },
];

/**
 * Root 404. Renders outside the (site) layout, so it carries its own minimal
 * chrome: logo, message, useful routes, support email.
 */
export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-paper">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />
      <BeadChain
        className="pointer-events-none absolute -right-32 top-1/3 -z-10 w-[40rem] text-brand-200/60 sm:-right-16"
        tone="light"
      />

      <header className="container-x flex h-16 items-center sm:h-[4.5rem]">
        <Logo />
      </header>

      <main className="container-x flex flex-1 flex-col justify-center py-16 lg:py-24">
        <div className="max-w-2xl">
          <Eyebrow>404 · Page not found</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-4xl font-normal leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">
            That page isn’t in our database.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
            The link may be out of date, or the address may have been typed differently. Nothing you entered has been
            lost — assessment progress stays in your browser.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/" size="lg" variant="primary">
              Back to the home page
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href="/assessment" size="lg" variant="secondary">
              Start the assessment
            </Button>
          </div>
        </div>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift"
              >
                <span className="text-[0.95rem] font-medium text-ink">{l.label}</span>
                <span className="mt-1 flex-1 text-sm leading-relaxed text-muted">{l.body}</span>
                <ArrowRight className="mt-4 h-4 w-4 text-muted-2 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className="container-x flex flex-col gap-2 border-t border-line py-6 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Think this is our mistake?{" "}
          <a href={`mailto:${BRAND.supportEmail}`} className="text-brand-700 underline-offset-4 hover:underline">
            {BRAND.supportEmail}
          </a>
        </p>
        <p className="font-mono uppercase tracking-[0.14em]">{BRAND.domain}</p>
      </footer>
    </div>
  );
}
