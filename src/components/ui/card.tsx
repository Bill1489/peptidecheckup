import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  as: Tag = "div",
  interactive,
  padding = "md",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-line bg-white shadow-soft",
        padding === "sm" && "p-4",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        interactive &&
          "transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-700",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  tone = "dark",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className={cn("mb-4", tone === "light" && "text-brand-300")}>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          "font-display text-balance text-3xl font-normal leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-4 text-pretty text-base leading-relaxed sm:text-lg", tone === "light" ? "text-white/70" : "text-muted")}>
          {description}
        </p>
      )}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}
