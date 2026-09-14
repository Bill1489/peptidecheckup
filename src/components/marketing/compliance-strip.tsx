import Link from "next/link";
import { Ban, Lock, Stethoscope } from "lucide-react";
import { DISCLAIMER_SHORT } from "@/lib/brand";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    icon: Stethoscope,
    title: "Not medical advice",
    body: "Educational information to discuss with a qualified healthcare professional.",
    href: "/safety",
  },
  {
    icon: Ban,
    title: "We never sell peptides",
    body: "No products, no vendor links, no commissions. Nothing to buy here.",
    href: "/about",
  },
  {
    icon: Lock,
    title: "Your answers stay on your device",
    body: "Stored in your browser only. Nothing is sent unless you ask for clinician contact.",
    href: "/privacy",
  },
] as const;

/**
 * Compliance strip used on landing pages and below CTAs. Plain, calm, linked
 * to the trust pages so the claims are checkable.
 */
export function ComplianceStrip({
  className,
  showDisclaimer = true,
}: {
  className?: string;
  showDisclaimer?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white shadow-soft", className)}>
      <ul className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {ITEMS.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="flex h-full items-start gap-3.5 p-5 transition-colors hover:bg-paper-2/60 sm:flex-col sm:gap-4"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <item.icon className="h-[1.15rem] w-[1.15rem]" aria-hidden strokeWidth={1.75} />
              </span>
              <span>
                <span className="block text-[0.95rem] font-medium text-ink">{item.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{item.body}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {showDisclaimer && (
        <p className="border-t border-line px-5 py-4 text-xs leading-relaxed text-muted">{DISCLAIMER_SHORT}</p>
      )}
    </div>
  );
}
