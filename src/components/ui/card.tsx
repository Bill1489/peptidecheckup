import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Design system v2: cards are bordered cells — 1px ink border, square,
 * white or warm-grey fill. Interactive cards invert on hover.
 */
export function Card({
  className,
  children,
  as: Tag = "div",
  interactive,
  padding = "md",
  tone = "white",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "white" | "grey" | "ink";
}) {
  return (
    <Tag
      className={cn(
        "rounded-none border",
        tone === "white" && "border-ink bg-white text-ink",
        tone === "grey" && "border-line bg-paper-2 text-ink",
        tone === "ink" && "border-ink bg-ink text-white",
        padding === "sm" && "p-4",
        padding === "md" && "p-5 sm:p-6",
        padding === "lg" && "p-6 sm:p-8",
        interactive && "hover-invert",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("label-mono", className)}>{children}</p>;
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
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow className={cn("mb-4", tone === "light" ? "text-white/60" : "text-brand-600")}>{eyebrow}</Eyebrow>
      )}
      <Tag
        className={cn(
          "text-balance text-[2rem] sm:text-[2.6rem] lg:text-[3.2rem]",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed sm:text-[17px]",
            align === "center" && "mx-auto",
            tone === "light" ? "text-white/70" : "text-muted",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-ink", className)} />;
}

/** Label / value row used in spec sheets, receipts, report tables. */
export function SpecRow({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0", className)}>
      <span className="label-mono shrink-0">{label}</span>
      <span className="min-w-0 break-words text-right text-[14px] text-ink">{value}</span>
    </div>
  );
}
