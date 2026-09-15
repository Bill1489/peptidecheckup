"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "brand" | "secondary" | "ghost" | "accent" | "danger" | "link" | "inverted";
type Size = "sm" | "md" | "lg" | "xl" | "icon";

/**
 * Design system v2: rectangular, uppercase mono-ish labels, hard borders,
 * colour inversion on hover. No pills, no shadows.
 */
const base =
  "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border font-sans font-semibold uppercase tracking-[0.08em] transition-[background-color,color,border-color] duration-150 ease-out select-none disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "border-ink bg-ink text-white hover:bg-brand-600 hover:border-brand-600",
  brand: "border-brand-600 bg-brand-600 text-white hover:bg-ink hover:border-ink",
  secondary: "border-ink bg-white text-ink hover:bg-ink hover:text-white",
  ghost: "border-transparent bg-transparent text-ink hover:border-ink",
  accent: "border-accent-500 bg-accent-500 text-white hover:bg-ink hover:border-ink",
  danger: "border-accent-600 bg-white text-accent-600 hover:bg-accent-600 hover:text-white",
  link: "border-transparent bg-transparent normal-case tracking-normal font-medium text-ink underline underline-offset-4 decoration-1 hover:text-brand-600 hover:decoration-2 px-0 h-auto",
  inverted: "border-white bg-white text-ink hover:bg-transparent hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[11px]",
  md: "h-11 px-5 text-[12px]",
  lg: "h-12 px-6 text-[13px]",
  xl: "h-14 px-8 text-[13px]",
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
