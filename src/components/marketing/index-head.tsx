import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Section headline in the spec-sheet idiom: a numbered mono label in the left
 * column, the uppercase headline (and optional description / link) on the right.
 */
export function IndexHead({
  index,
  label,
  title,
  description,
  action,
  tone = "light",
  as: Tag = "h2",
  className,
}: {
  index?: string;
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { href: string; label: string };
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("grid gap-4 xl:grid-cols-[14rem_minmax(0,1fr)] xl:gap-10", className)}>
      <p className={cn("label-mono", dark ? "text-white/60" : "text-ink")}>
        {index && <span className="tnum">{index} — </span>}
        {label}
      </p>
      <div className="min-w-0">
        <Tag className={cn("min-w-0 text-balance break-words text-[2rem] uppercase sm:text-[2.6rem] xl:text-[3.25rem]", dark ? "text-white" : "text-ink")}>
          {title}
        </Tag>
        {description && (
          <p className={cn("mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed", dark ? "text-white/70" : "text-muted")}>
            {description}
          </p>
        )}
        {action && (
          <Link
            href={action.href}
            className={cn(
              "mt-5 inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em]",
              dark
                ? "text-white underline decoration-1 underline-offset-[3px] transition-[text-decoration-thickness] duration-150 hover:decoration-2"
                : "text-ink link-rule",
            )}
          >
            {action.label}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
