import * as React from "react";
import { Eyebrow } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Toc, type TocItem } from "./toc";
import { BeadRule } from "./bead-chain";

/** Header for interior pages: eyebrow → display H1 → description → mono meta. */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  children,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header className={cn("relative isolate overflow-hidden border-b border-line bg-paper-2/60", className)}>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots [mask-image:radial-gradient(70%_90%_at_50%_0%,black,transparent)]"
      />
      <div className="container-x py-14 lg:py-20">
        <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-4xl font-normal leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">{description}</p>}
          {meta && (
            <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-2">{meta}</p>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}

const PROSE = cn(
  "text-[1.02rem] leading-[1.75] text-ink-2",
  "[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:font-display [&_h2]:text-[1.75rem] [&_h2]:font-normal [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.02em] [&_h2]:text-ink [&_h2:first-child]:mt-0",
  "[&_h3]:mt-9 [&_h3]:mb-3 [&_h3]:scroll-mt-28 [&_h3]:font-display [&_h3]:text-[1.3rem] [&_h3]:font-normal [&_h3]:leading-snug [&_h3]:text-ink",
  "[&_p]:my-4 [&_p]:text-pretty",
  "[&_strong]:font-medium [&_strong]:text-ink",
  "[&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&_a]:decoration-brand-300 [&_a]:underline-offset-4 [&_a:hover]:decoration-brand-600",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
  "[&_li::marker]:text-brand-500 [&_ol>li::marker]:font-mono [&_ol>li::marker]:text-[0.85em] [&_ol>li::marker]:text-muted",
  "[&_hr]:my-12 [&_hr]:border-line",
  "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-brand-300 [&_blockquote]:pl-5 [&_blockquote]:text-muted",
  "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[0.95rem] [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-medium [&_th]:text-ink [&_td]:border-t [&_td]:border-line [&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top",
);

/** Editorial typography for long-form trust and legal pages. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(PROSE, className)}>{children}</div>;
}

/** An h2 styled like the ones inside <Prose>, for custom blocks placed between prose segments. */
export function ProseH2({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <h2
      id={id}
      className={cn(
        "mt-14 mb-4 scroll-mt-28 font-display text-[1.75rem] font-normal leading-[1.15] tracking-[-0.02em] text-ink",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/**
 * Standard shell for trust/legal pages: header, a 42rem content column and an
 * optional sticky TOC on desktop. Author text inside <Prose> blocks (plain
 * h2/h3/p/ul) and place custom blocks between them with <ProseH2> headings.
 */
export function TrustPage({
  eyebrow,
  title,
  description,
  meta,
  toc,
  children,
  after,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  toc?: TocItem[];
  children: React.ReactNode;
  /** Full-width content rendered below the prose column (e.g. CTA band). */
  after?: React.ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} meta={meta} />
      <div className="container-x py-14 lg:py-20">
        <div
          className={cn(
            "lg:grid lg:justify-center lg:gap-16",
            toc ? "lg:grid-cols-[minmax(0,42rem)_13rem]" : "lg:grid-cols-[minmax(0,42rem)]",
          )}
        >
          <div className="mx-auto w-full max-w-2xl lg:mx-0">
            {children}
            <div className="mt-14 flex items-center gap-4" aria-hidden>
              <BeadRule />
            </div>
          </div>
          {toc && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <Toc items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
      {after}
    </>
  );
}

/** Callout used inside <Prose>. Children are inline text (no <p>) so prose spacing is not inherited. */
export function Callout({
  title,
  children,
  tone = "brand",
  className,
}: {
  title?: string;
  children: React.ReactNode;
  tone?: "brand" | "warn" | "danger" | "neutral";
  className?: string;
}) {
  return (
    <div
      role="note"
      className={cn(
        "my-6 rounded-2xl border p-5 text-[0.95rem] leading-relaxed",
        tone === "brand" && "border-brand-200 bg-brand-50 text-brand-900",
        tone === "warn" && "border-amber-200 bg-caution-soft text-amber-900",
        tone === "danger" && "border-rose-200 bg-concern-soft text-rose-900",
        tone === "neutral" && "border-line bg-paper-2 text-ink-2",
        className,
      )}
    >
      {title && <div className="mb-1.5 font-medium text-ink">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

/** Mono key/value strip used on trust pages (e.g. version, last updated, contact). */
export function MetaStrip({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="my-8 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted-2">{item.label}</dt>
          <dd className="mt-1 text-sm text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
