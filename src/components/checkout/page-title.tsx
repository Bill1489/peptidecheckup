import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Index-style page header: mono label on the left, big expanded uppercase
 * headline on the right, optional one-line description and meta row.
 */
export function PageTitle({
  label,
  title,
  description,
  meta,
  children,
  size = "lg",
  className,
}: {
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <header className={cn("rule-b bg-white", className)}>
      <div className={cn("container-x grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10", size === "lg" ? "py-10 lg:py-14" : "py-8 lg:py-10")}>
        <p className="label-mono text-brand-600">{label}</p>
        <div className="min-w-0">
          <h1
            className={cn(
              "text-balance uppercase text-ink",
              size === "lg" ? "text-[2.25rem] sm:text-[3rem] lg:text-[3.75rem]" : "text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem]",
            )}
          >
            {title}
          </h1>
          {description && <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[16px]">{description}</p>}
          {meta && <p className="label-mono mt-5">{meta}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
