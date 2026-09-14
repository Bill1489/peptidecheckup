"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "brand" | "secondary" | "ghost" | "accent" | "danger" | "link" | "inverted";
type Size = "sm" | "md" | "lg" | "xl" | "icon";

const base =
  "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 ease-out-expo select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white shadow-soft hover:bg-brand-800 hover:shadow-lift",
  brand: "bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-glow",
  secondary: "bg-white text-ink border border-line-strong hover:border-ink/30 hover:bg-paper-2 shadow-inset",
  ghost: "bg-transparent text-ink hover:bg-ink/6",
  accent: "bg-accent-400 text-ink hover:bg-accent-300 shadow-soft",
  danger: "bg-concern text-white hover:bg-rose-700",
  link: "bg-transparent text-brand-700 underline-offset-4 hover:underline px-0 h-auto",
  inverted: "bg-white text-ink hover:bg-paper-2 shadow-lift",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-[1.05rem]",
  icon: "h-10 w-10 p-0",
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
