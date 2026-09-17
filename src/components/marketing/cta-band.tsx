import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_MINUTES, CHECKUP, CHECKUP_SHORT } from "./copy";

/**
 * Flat cobalt closing band. One headline, one button, one line of small print.
 * The footer that follows carries the full legal text, so this stays short.
 */
export function CtaBand({
  label = CHECKUP,
  title = `Find your pen in ${ASSESSMENT_MINUTES} minutes.`,
  href = "/assessment",
  cta = `Start the ${CHECKUP_SHORT}`,
  secondary,
}: {
  label?: string;
  title?: string;
  href?: string;
  cta?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="bg-brand-600 text-white">
      <div className="container-x grid gap-6 py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:py-20">
        <p className="label-mono text-white/70">{label}</p>
        <div className="min-w-0">
          <h2 className="text-balance text-[2.25rem] uppercase sm:text-[3rem] lg:text-[3.75rem]">{title}</h2>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button href={href} size="xl" variant="inverted">
              {cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex min-h-[44px] items-center font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white underline decoration-1 underline-offset-[3px] hover:decoration-2"
              >
                {secondary.label}
              </Link>
            )}
          </div>
          <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/70">
            Not medical advice · Research-use labelling applies · 18+ only · It can say no
          </p>
        </div>
      </div>
    </section>
  );
}
