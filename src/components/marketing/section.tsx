import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Marketing section rhythm: `py-20 lg:py-28` with the standard container.
 * `tone` switches surface colour; dark sections get the dot grid + grain.
 */
export function Section({
  children,
  className,
  innerClassName,
  tone = "paper",
  id,
  as: Tag = "section",
  narrow,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: "paper" | "paper-2" | "white" | "ink" | "brand";
  id?: string;
  as?: "section" | "div";
  /** Use the 3xl container instead of 7xl */
  narrow?: boolean;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative py-20 lg:py-28",
        tone === "paper" && "bg-paper",
        tone === "paper-2" && "bg-paper-2",
        tone === "white" && "bg-white",
        tone === "ink" && "bg-ink bg-dots-dark bg-grain text-white",
        tone === "brand" && "bg-brand-50 bg-grain",
        className,
      )}
    >
      <div className={cn(narrow ? "container-narrow" : "container-x", innerClassName)}>{children}</div>
    </Tag>
  );
}
