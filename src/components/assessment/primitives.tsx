"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RadioGroup } from "radix-ui";
import { Check, ChevronDown, CircleAlert, Info, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small form primitives shared by the question components. Everything here
 * follows the design system: inputs `rounded-xl h-12`, pills for chips,
 * brand teal for selection states, ≥ 44px tap targets.
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
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink-2">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-muted-2">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p role="alert" className={cn("flex items-start gap-1.5 text-sm text-concern", className)}>
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

export const inputClass =
  "h-12 w-full rounded-xl border border-line-strong bg-white px-4 text-base text-ink shadow-inset placeholder:text-muted-2 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 aria-[invalid=true]:border-concern";

export const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(inputClass, className)} {...props} />,
);
TextInput.displayName = "TextInput";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(inputClass, "h-auto min-h-[7.5rem] resize-y py-3 leading-relaxed", className)}
      {...props}
    />
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
      <select className={cn(inputClass, "appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chips (toggle pills)                                                */
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
        "inline-flex items-center gap-1.5 rounded-full border bg-white font-medium transition-all duration-200 ease-out-expo active:scale-[0.98]",
        size === "md" ? "min-h-11 px-4 py-2 text-sm" : "min-h-9 px-3 py-1.5 text-xs",
        selected
          ? "border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500"
          : "border-line-strong text-ink-2 hover:border-ink/30 hover:bg-paper-2",
        className,
      )}
      {...props}
    >
      {selected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
      {children}
    </button>
  );
}

export function RemovableChip({ children, onRemove, label }: { children: React.ReactNode; onRemove: () => void; label: string }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-1 rounded-full border border-brand-200 bg-brand-50 pl-3 pr-0.5 text-sm font-medium text-brand-800">
      <span className="py-1.5">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-100 hover:text-brand-900"
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
      className={cn("grid w-full rounded-xl border border-line-strong bg-paper-2 p-1", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <RadioGroup.Item
            key={o.value}
            value={o.value}
            className={cn(
              "truncate rounded-lg px-2 font-medium transition-all duration-200 ease-out-expo",
              size === "md" ? "h-11 text-sm" : "h-11 text-xs",
              active ? "bg-white text-brand-800 shadow-soft ring-1 ring-brand-500" : "text-ink-3 hover:text-ink",
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
  const Icon = tone === "caution" ? CircleAlert : Info;
  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed",
        tone === "info" && "border-info/20 bg-info-soft text-ink-2",
        tone === "caution" && "border-caution/30 bg-caution-soft text-ink-2",
        tone === "brand" && "border-brand-200 bg-brand-50 text-brand-900",
        className,
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0",
          tone === "info" && "text-info",
          tone === "caution" && "text-caution",
          tone === "brand" && "text-brand-600",
        )}
        aria-hidden
      />
      <div>
        {title && <p className="font-medium text-ink">{title}</p>}
        <div className={cn(title && "mt-1")}>{children}</div>
      </div>
    </div>
  );
}

/** Animated reveal for follow-up inputs and notices. */
export function Reveal({ show, children, className }: { show: boolean; children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={reduced ? false : { opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.28, ease: EASE }}
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
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
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, marginBottom: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease: EASE }}
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-soft sm:p-5",
        invalid ? "border-concern/50" : "border-line",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-700">
          {title} {index + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="-mr-2 -mt-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/6 hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="grid gap-4">{children}</div>
    </motion.div>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong bg-transparent px-4 text-sm font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
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
          className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-30 max-h-64 overflow-y-auto rounded-2xl border border-line bg-white p-1.5 shadow-lift"
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
                "cursor-pointer rounded-xl px-3 py-2.5 text-sm transition-colors",
                i === activeIndex ? "bg-brand-50 text-brand-900" : "text-ink-2",
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
  return (
    <p className={cn("font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-700", className)}>
      {children}
    </p>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line-strong bg-paper px-1 font-mono text-[0.65rem] text-muted">
      {children}
    </kbd>
  );
}
