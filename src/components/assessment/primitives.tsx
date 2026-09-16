"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { RadioGroup } from "radix-ui";
import { ChevronDown, CircleAlert, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form primitives shared by the question components. Design system v2
 * ("Lab Grotesk"): square corners, 1px ink borders, mono labels, colour
 * inversion for selection and hover, ≥ 44px tap targets, no shadows.
 */

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/* Field wrapper                                                       */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  error,
  htmlFor,
  optional,
  className,
  children,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  htmlFor?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3">
        <span className="label-mono text-ink">{label}</span>
        {optional && <span className="label-mono text-muted-2">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p role="alert" className={cn("flex items-start gap-1.5 text-sm text-accent-600", className)}>
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

export const inputClass =
  "h-12 w-full rounded-none border border-ink bg-white px-3 text-[15px] text-ink placeholder:text-muted-2 transition-colors focus:border-brand-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-40 aria-[invalid=true]:border-accent-500";

export const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(inputClass, className)} {...props} />,
);
TextInput.displayName = "TextInput";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(inputClass, "h-auto min-h-[7.5rem] resize-y py-3 leading-relaxed", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <div className="relative">
      <select className={cn(inputClass, "appearance-none pr-9", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chips (square mono tags)                                            */
/* ------------------------------------------------------------------ */

export function Chip({
  selected,
  onClick,
  children,
  className,
  size = "md",
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={Boolean(selected)}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-none border border-ink font-mono font-medium uppercase tracking-[0.1em] transition-colors duration-150",
        size === "md" ? "min-h-11 px-3.5 text-[11px]" : "min-h-9 px-3 text-[10.5px]",
        selected ? "bg-ink text-white" : "bg-white text-ink hover:bg-ink hover:text-white",
        className,
      )}
      {...props}
    >
      <span className={cn("h-2 w-2 shrink-0 border border-current", selected && "border-brand-400 bg-brand-400")} aria-hidden />
      {children}
    </button>
  );
}

export function RemovableChip({ children, onRemove, label }: { children: React.ReactNode; onRemove: () => void; label: string }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-1 rounded-none border border-ink bg-ink pl-3 text-white">
      <span className="py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em]">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="inline-flex h-11 w-11 items-center justify-center text-white/70 transition-colors hover:bg-brand-600 hover:text-white"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented control                                                   */
/* ------------------------------------------------------------------ */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
  className,
}: {
  value: T | undefined;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <RadioGroup.Root
      value={value ?? ""}
      onValueChange={(v) => onChange(v as T)}
      aria-label={label}
      className={cn("grid w-full rounded-none border border-ink bg-white", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <RadioGroup.Item
            key={o.value}
            value={o.value}
            className={cn(
              "h-11 truncate px-2 font-mono font-medium uppercase tracking-[0.08em] transition-colors duration-150",
              size === "md" ? "text-[11px]" : "text-[10.5px]",
              i > 0 && "border-l border-ink",
              active ? "bg-ink text-white" : "text-ink hover:bg-paper-2",
            )}
          >
            {o.label}
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Notices                                                             */
/* ------------------------------------------------------------------ */

export function InlineNotice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "caution" | "brand";
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-none border border-ink border-l-[3px] p-4 text-sm leading-relaxed text-ink-2",
        tone === "info" && "border-l-brand-600 bg-white",
        tone === "brand" && "border-l-brand-600 bg-paper-2",
        tone === "caution" && "border-l-caution bg-caution-soft",
        className,
      )}
    >
      {title && <p className="label-mono mb-1.5 text-ink">{title}</p>}
      <div>{children}</div>
    </div>
  );
}

/** Conditional wrapper for follow-up inputs and notices. No motion — content simply appears. */
export function Reveal({ show, children, className }: { show: boolean; children: React.ReactNode; className?: string }) {
  if (!show) return null;
  return <div className={className}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Repeatable entries                                                  */
/* ------------------------------------------------------------------ */

export function EntryCard({
  index,
  title,
  onRemove,
  removeLabel,
  children,
  invalid,
}: {
  index: number;
  title: string;
  onRemove: () => void;
  removeLabel: string;
  children: React.ReactNode;
  invalid?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={cn("rounded-none border bg-white", invalid ? "border-accent-500" : "border-ink")}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink pl-4">
        <p className="label-mono text-ink">
          {title} · {String(index + 1).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="inline-flex h-11 w-11 items-center justify-center border-l border-ink text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="grid gap-4 p-4 sm:p-5">{children}</div>
    </motion.div>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover-invert flex h-12 w-full items-center justify-center gap-2 rounded-none border border-ink px-4 font-mono text-[11px] font-medium uppercase tracking-[0.1em]"
    >
      <Plus className="h-4 w-4" aria-hidden />
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Combobox (text input with suggestions)                              */
/* ------------------------------------------------------------------ */

export interface ComboboxProps<T> {
  id: string;
  value: string;
  onInputChange: (text: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  placeholder?: string;
  invalid?: boolean;
  autoFocus?: "always" | "pointer";
  ariaLabel?: string;
}

export function Combobox<T>({
  id,
  value,
  onInputChange,
  onBlur,
  onKeyDown,
  items,
  getKey,
  renderItem,
  onSelect,
  placeholder,
  invalid,
  autoFocus,
  ariaLabel,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const listId = `${id}-listbox`;
  const show = open && items.length > 0;
  const activeIndex = Math.min(active, Math.max(items.length - 1, 0));

  return (
    <div className="relative">
      <TextInput
        id={id}
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={show ? `${listId}-${activeIndex}` : undefined}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        data-autofocus={autoFocus}
        onChange={(e) => {
          onInputChange(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          onBlur?.();
        }}
        onKeyDown={(e) => {
          if (show && e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, items.length - 1));
            return;
          }
          if (show && e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
            return;
          }
          if (show && e.key === "Enter") {
            e.preventDefault();
            onSelect(items[activeIndex]);
            setOpen(false);
            return;
          }
          if (e.key === "Escape" && open) {
            e.preventDefault();
            setOpen(false);
            return;
          }
          onKeyDown?.(e);
        }}
      />
      {show && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 -mt-px max-h-64 overflow-y-auto rounded-none border border-ink bg-white"
          onMouseDown={(e) => e.preventDefault()}
        >
          {items.map((item, i) => (
            <li
              key={getKey(item)}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActive(i)}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className={cn(
                "cursor-pointer border-b border-line px-3 py-2.5 text-sm last:border-b-0",
                i === activeIndex ? "bg-ink text-white [&_*]:text-inherit" : "text-ink",
              )}
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

export function MonoLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("label-mono text-ink", className)}>{children}</p>;
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-none border border-ink bg-white px-1 font-mono text-[10px] text-ink">
      {children}
    </kbd>
  );
}