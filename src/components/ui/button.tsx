"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "brand" | "secondary" | "ghost" | "accent" | "danger" | "link" | "inverted";
type Size = "sm" | "md" | "lg" | "xl" | "icon";

/**
 * Soft pills. Sentence case, dusty-rose primary, quiet hover.
 * Sharp enough to read as a pharmacy control, round enough for a clinic.
 */
const base =
  "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border font-sans font-medium tracking-normal transition-[background-color,color,border-color,box-shadow] duration-150 ease-out select-none disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "border-brand-700 bg-brand-700 text-white shadow-soft hover:bg-brand-800 hover:border-brand-800",
  brand: "border-brand-700 bg-brand-700 text-white shadow-soft hover:bg-brand-800 hover:border-brand-800",
  secondary: "border-brand-200 bg-white text-ink hover:border-brand-400 hover:bg-brand-50",
  ghost: "border-transparent bg-transparent text-ink hover:bg-brand-50",
  accent: "border-accent-600 bg-accent-600 text-white hover:bg-accent-700 hover:border-accent-700",
  danger: "border-accent-600 bg-white text-accent-700 hover:bg-accent-600 hover:text-white",
  link: "border-transparent bg-transparent tracking-normal font-medium text-ink underline underline-offset-4 decoration-1 hover:text-brand-700 hover:decoration-2 px-0 h-auto",
  inverted: "border-white bg-white text-brand-800 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
  xl: "h-14 px-8 text-[16px]",
  icon: "h-11 w-11 p-0",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  href?: string;
  external?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, href, external, children, disabled, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);
    if (href) {
      if (external) {
        return (
          <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes} aria-disabled={disabled}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
