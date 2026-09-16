"use client";

import * as React from "react";
import { Check, ChevronDown, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Checkout form primitives — design system v2. Inputs are 48px, square, with a
 * 1px ink border and a cobalt outline on focus. Errors turn the border orange
 * and are announced through `aria-describedby`.
 */

export const inputClass = cn(
  "h-12 w-full rounded-none border border-ink bg-white px-3 text-[15px] text-ink placeholder:text-muted-2",
  "focus:outline-2 focus:outline-brand-600 focus:outline-offset-0",
  "disabled:opacity-50 aria-[invalid=true]:border-accent-500",
);

/* ------------------------------------------------------------------ */
/* Field wrapper                                                       */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  className,
  children,
}: {
  label: React.ReactNode;
  htmlFor: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3 text-[13px] font-medium text-ink">
        <span>{label}</span>
        {optional && <span className="label-mono">Optional</span>}
      </label>
      {children}
      {error ? (
        <FieldError id={`${htmlFor}-error`}>{error}</FieldError>
      ) : hint ? (
        <p className="text-[12.5px] leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function FieldError({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <p id={id} className={cn("flex items-start gap-1.5 text-[12.5px] leading-relaxed text-accent-600", className)}>
      <CircleAlert className="mt-[2px] h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  invalid?: boolean;
  /** Mono text pinned to the right inside the input (card brand, currency). */
  trailing?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, invalid, trailing, id, ...props }, ref) => {
  const input = (
    <input
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cn(inputClass, trailing && "pr-20", className)}
      {...props}
    />
  );
  if (!trailing) return input;
  return (
    <div className="relative">
      {input}
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        {trailing}
      </span>
    </div>
  );
});
Input.displayName = "Input";

export interface TextFieldProps extends Omit<InputProps, "onChange" | "value"> {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  wrapperClassName?: string;
}

/** Label + input + error in one. */
export function TextField({ label, value, onChange, error, hint, optional, wrapperClassName, id, ...props }: TextFieldProps) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint} optional={optional} className={wrapperClassName}>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} invalid={Boolean(error)} {...props} />
    </Field>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  invalid?: boolean;
  placeholder?: string;
}

export function Select({ id, value, onChange, options, invalid, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cn(inputClass, "appearance-none pr-10", className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" aria-hidden />
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  ...props
}: SelectProps & { label: React.ReactNode; error?: string; hint?: React.ReactNode; optional?: boolean; wrapperClassName?: string }) {
  return (
    <Field label={label} htmlFor={props.id} error={error} hint={hint} optional={optional} className={wrapperClassName}>
      <Select invalid={Boolean(error)} {...props} />
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox                                                            */
/* ------------------------------------------------------------------ */

export function Checkbox({
  id,
  checked,
  onChange,
  label,
  description,
  error,
  required,
  className,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="flex min-h-[44px] cursor-pointer items-start gap-3 py-2">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required || undefined}
        />
        <span
          aria-hidden
          className={cn(
            "mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center border transition-colors duration-150",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-brand-600 peer-focus-visible:outline-offset-2",
            checked ? "border-ink bg-ink text-white" : "bg-white text-transparent",
            error ? "border-accent-500" : "border-ink",
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1 text-[14px] leading-snug text-ink">
          <span>{label}</span>
          {description && <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">{description}</span>}
        </span>
      </label>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bordered radio rows                                                 */
/* ------------------------------------------------------------------ */

export interface RadioRowOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned mono value, e.g. a price. */
  meta?: React.ReactNode;
  disabled?: boolean;
}

export function RadioRows({
  name,
  value,
  onChange,
  options,
  legend,
  error,
  className,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioRowOption[];
  legend: string;
  error?: string;
  className?: string;
}) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="sr-only">{legend}</legend>
      <div className={cn("divide-y divide-ink border", error ? "border-accent-500" : "border-ink")}>
        {options.map((o) => {
          const selected = o.value === value;
          const id = `${name}-${o.value}`;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={cn(
                "flex min-h-[56px] cursor-pointer items-center gap-3 px-4 py-3 transition-colors duration-150",
                selected ? "bg-paper-2" : "bg-white hover:bg-paper-2",
                o.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                disabled={o.disabled}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-ink bg-white",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-brand-600 peer-focus-visible:outline-offset-2",
                )}
              >
                <span className={cn("h-2 w-2 bg-ink transition-opacity duration-150", selected ? "opacity-100" : "opacity-0")} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium leading-snug text-ink">{o.label}</span>
                {o.description && <span className="mt-0.5 block text-[12.5px] text-muted">{o.description}</span>}
              </span>
              {o.meta !== undefined && <span className="shrink-0 font-mono text-[13px] tnum text-ink">{o.meta}</span>}
            </label>
          );
        })}
      </div>
      {error && <FieldError className="mt-1.5">{error}</FieldError>}
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

/** Bordered informational panel with a mono label. */
export function NoticePanel({
  label,
  children,
  tone = "grey",
  className,
}: {
  label?: string;
  children: React.ReactNode;
  tone?: "grey" | "ink" | "white";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border p-4 text-[13px] leading-relaxed",
        tone === "grey" && "border-ink bg-paper-2 text-ink",
        tone === "ink" && "border-ink bg-ink text-white",
        tone === "white" && "border-ink bg-white text-ink",
        className,
      )}
    >
      {label && <p className={cn("label-mono mb-1.5", tone === "ink" ? "text-white/70" : "text-ink")}>{label}</p>}
      <div className={tone === "ink" ? "text-white/85" : "text-ink-3"}>{children}</div>
    </div>
  );
}

/** Orange-bordered error panel, announced as an alert. */
export function ErrorPanel({ label = "Problem", children, className }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn("border border-accent-500 bg-concern-soft p-4 text-[13px] leading-relaxed text-accent-700", className)}>
      <p className="label-mono mb-1.5 flex items-center gap-1.5 text-accent-700">
        <CircleAlert className="h-3.5 w-3.5" aria-hidden />
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}
