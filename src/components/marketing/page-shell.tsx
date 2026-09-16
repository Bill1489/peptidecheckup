import * as React from "react";
import { SpecRow } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Toc, TocRow, type TocItem } from "./toc";

/**
 * Header for interior pages: a mono label column on the left, the uppercase
 * headline on the right, and a hard rule underneath. No decoration.
 */
export function PageHeader({
  label,
  meta,
  title,
  description,
  children,
  className,
}: {
  label: string;
  /** Extra mono lines under the label (dates, counts, entity). */
  meta?: string[];
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("rule-b", className)}>
      <div className="container-x grid gap-6 py-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:py-16">
        <div className="flex flex-col gap-1.5">
          <p className="label-mono text-ink">{label}</p>
          {meta?.map((line) => (
            <p key={line} className="label-mono">
              {line}
            </p>
          ))}
        </div>
        <div className="min-w-0 max-w-4xl">
          <h1 className="text-balance text-[2.25rem] uppercase sm:text-[3rem] lg:text-[3.75rem]">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[17px]">{description}</p>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}

const PROSE = cn(
  "text-[15px] leading-[1.65] text-ink-2",
  "[&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:scroll-mt-32 [&_h2]:border-t [&_h2]:border-ink [&_h2]:pt-5 [&_h2]:text-[1.5rem] [&_h2]:uppercase [&_h2]:text-ink [&_h2:first-child]:mt-0 sm:[&_h2]:text-[1.75rem]",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-32 [&_h3]:font-mono [&_h3]:text-[11px] [&_h3]:font-medium [&_h3]:uppercase [&_h3]:text-ink [&_h3]:[letter-spacing:0.12em] [&_h3]:[font-stretch:100%] [&_h3]:[font-variation-settings:normal]",
  "[&_p]:my-4 [&_p]:text-pretty",
  "[&_strong]:font-semibold [&_strong]:text-ink",
  "[&_a]:text-ink [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-[3px] [&_a:hover]:text-brand-600 [&_a:hover]:decoration-2",
  "[&_ul]:my-4 [&_ul]:space-y-2 [&_ul>li]:relative [&_ul>li]:pl-5 [&_ul>li::before]:absolute [&_ul>li::before]:left-0 [&_ul>li::before]:top-[0.62em] [&_ul>li::before]:h-1.5 [&_ul>li::before]:w-1.5 [&_ul>li::before]:bg-ink [&_ul>li::before]:content-['']",
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol>li::marker]:font-mono [&_ol>li::marker]:text-[12px] [&_ol>li::marker]:text-muted",
  "[&_blockquote]:my-6 [&_blockquote]:border [&_blockquote]:border-ink [&_blockquote]:p-5 [&_blockquote]:text-[14px] [&_blockquote]:leading-relaxed [&_blockquote]:text-ink",
  "[&_hr]:my-10 [&_hr]:border-ink",
);

/** Typography for long-form trust and legal pages. Author plain h2/h3/p/ul/ol inside. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(PROSE, className)}>{children}</div>;
}

/** An h2 styled like the ones inside <Prose>, for custom blocks placed between prose segments. */
export function ProseH2({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <h2
      id={id}
      className={cn("mt-14 mb-5 scroll-mt-32 border-t border-ink pt-5 text-[1.5rem] uppercase text-ink sm:text-[1.75rem]", className)}
    >
      {children}
    </h2>
  );
}

/**
 * Shell for trust/legal pages: header, a sticky TOC rail on the left (desktop)
 * and a 42rem content column. Custom blocks go between <Prose> segments.
 */
export function TrustPage({
  label,
  meta,
  title,
  description,
  toc,
  children,
  after,
}: {
  label: string;
  meta?: string[];
  title: React.ReactNode;
  description?: React.ReactNode;
  toc?: TocItem[];
  children: React.ReactNode;
  /** Full-width content rendered below the content column (e.g. CTA band). */
  after?: React.ReactNode;
}) {
  return (
    <>
      <PageHeader label={label} meta={meta} title={title} description={description} />
      {toc && <TocRow items={toc} />}
      <div className="container-x py-10 lg:py-16">
        <div className="lg:grid lg:grid-cols-[14rem_minmax(0,42rem)] lg:gap-10">
          <aside className="hidden lg:block">
            {toc && (
              <div className="sticky top-28">
                <Toc items={toc} />
              </div>
            )}
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
      {after}
    </>
  );
}

/** Bordered note used inside <Prose>. Children are inline text (no <p>). */
export function Note({
  title,
  children,
  tone = "ink",
  className,
}: {
  title?: string;
  children: React.ReactNode;
  /** ink = neutral · brand = commitment/positive · alert = warning */
  tone?: "ink" | "brand" | "alert";
  className?: string;
}) {
  return (
    <aside
      role="note"
      className={cn(
        "my-6 border p-5 text-[14px] leading-relaxed text-ink-2",
        tone === "ink" && "border-ink",
        tone === "brand" && "border-brand-600",
        tone === "alert" && "border-accent-500",
        className,
      )}
    >
      {title && (
        <p
          className={cn(
            "label-mono mb-2",
            tone === "ink" && "text-ink",
            tone === "brand" && "text-brand-600",
            tone === "alert" && "text-accent-600",
          )}
        >
          {title}
        </p>
      )}
      <div>{children}</div>
    </aside>
  );
}

/** Bordered label/value sheet (version, dates, counts, entity). */
export function SpecSheet({ items, className }: { items: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <div className={cn("my-8 border border-ink px-5", className)}>
      {items.map((item) => (
        <SpecRow key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}

/** Numbered bordered list — the spec-sheet way to present steps or checks. */
export function NumberedRows({
  items,
  className,
  as: Tag = "ol",
}: {
  items: { title?: React.ReactNode; body: React.ReactNode; meta?: React.ReactNode }[];
  className?: string;
  as?: "ol" | "ul";
}) {
  return (
    <Tag className={cn("border-t border-ink", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            "grid gap-x-4 gap-y-1.5 border-b border-ink py-5",
            item.title ? "grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_11rem_1fr]" : "grid-cols-[2.5rem_1fr]",
          )}
        >
          <span className="label-mono pt-[3px] tnum">{String(i + 1).padStart(2, "0")}</span>
          {item.title && (
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px] font-semibold text-ink">
              {item.title}
              {item.meta && <span className="label-mono">{item.meta}</span>}
            </span>
          )}
          <span className={cn("text-[14px] leading-relaxed text-ink-3", item.title && "col-start-2 sm:col-start-3")}>{item.body}</span>
        </li>
      ))}
    </Tag>
  );
}
