import * as React from "react";
import { cn } from "@/lib/utils";
import {
  EVIDENCE_LABELS,
  REGULATORY_LABELS,
  type EvidenceQuality,
  type RegulatoryStatus,
} from "@/data/types";
import { SUITABILITY_LABELS, type FlagSeverity, type Suitability } from "@/lib/engine/types";

type Tone = "neutral" | "brand" | "accent" | "success" | "warning" | "danger" | "info" | "ink" | "outline";

/**
 * Design system v2: badges are square mono labels with a 1px border.
 * Colour is used semantically only (cobalt = positive/relevant, orange = concern).
 */
const tones: Record<Tone, string> = {
  neutral: "border-line bg-paper-2 text-ink-3",
  brand: "border-brand-600 bg-brand-50 text-brand-700",
  accent: "border-accent-500 bg-accent-100 text-accent-700",
  success: "border-brand-600 bg-white text-brand-700",
  warning: "border-caution bg-caution-soft text-[#7a5a05]",
  danger: "border-accent-500 bg-concern-soft text-accent-700",
  info: "border-brand-300 bg-brand-50 text-brand-700",
  ink: "border-ink bg-ink text-white",
  outline: "border-ink bg-transparent text-ink",
};

export function Badge({
  tone = "neutral",
  className,
  dot,
  children,
  size = "sm",
}: {
  tone?: Tone;
  className?: string;
  dot?: boolean;
  size?: "xs" | "sm" | "md";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-none border font-mono font-medium uppercase tracking-[0.08em] whitespace-nowrap",
        size === "xs" && "h-5 px-1.5 text-[10px]",
        size === "sm" && "h-6 px-2 text-[10.5px]",
        size === "md" && "h-7 px-2.5 text-[11.5px]",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 bg-current" aria-hidden />}
      {children}
    </span>
  );
}

/* ---------------- Semantic badges ---------------- */

export const EVIDENCE_TONE: Record<EvidenceQuality, Tone> = {
  strong: "brand",
  moderate: "ink",
  limited: "outline",
  preliminary: "neutral",
  insufficient: "neutral",
};

export const EVIDENCE_COLOR_CLASS: Record<EvidenceQuality, string> = {
  strong: "bg-evidence-strong",
  moderate: "bg-evidence-moderate",
  limited: "bg-evidence-limited",
  preliminary: "bg-evidence-preliminary",
  insufficient: "bg-evidence-insufficient",
};

export function EvidenceBadge({
  level,
  className,
  size,
  prefix,
}: {
  level: EvidenceQuality;
  className?: string;
  size?: "xs" | "sm" | "md";
  prefix?: string;
}) {
  return (
    <Badge tone={EVIDENCE_TONE[level]} className={className} size={size}>
      <span className={cn("h-1.5 w-1.5", EVIDENCE_COLOR_CLASS[level])} aria-hidden />
      {prefix ? `${prefix} ` : ""}
      {EVIDENCE_LABELS[level]}
    </Badge>
  );
}

/** Five-block evidence meter (■■■□□). */
export function EvidenceMeter({ level, className }: { level: EvidenceQuality; className?: string }) {
  const rank = { strong: 5, moderate: 4, limited: 3, preliminary: 2, insufficient: 1 }[level];
  return (
    <span className={cn("inline-flex items-center gap-[3px]", className)} aria-label={`Evidence: ${EVIDENCE_LABELS[level]}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "h-2.5 w-2.5 border border-ink transition-colors",
            i <= rank ? (level === "strong" ? "bg-brand-600 border-brand-600" : "bg-ink") : "bg-white",
          )}
        />
      ))}
    </span>
  );
}

export const REGULATORY_TONE: Record<RegulatoryStatus, Tone> = {
  authorised: "brand",
  not_authorised: "outline",
  investigational: "neutral",
  unclear: "neutral",
};

export function RegulatoryBadge({
  status,
  className,
  size,
}: {
  status: RegulatoryStatus;
  className?: string;
  size?: "xs" | "sm" | "md";
}) {
  return (
    <Badge tone={REGULATORY_TONE[status]} className={className} size={size} dot>
      {REGULATORY_LABELS[status]}
    </Badge>
  );
}

export const SUITABILITY_TONE: Record<Suitability, Tone> = {
  potentially_relevant: "brand",
  higher_concern: "danger",
  insufficient_information: "neutral",
};

export function SuitabilityBadge({
  level,
  className,
  size = "md",
}: {
  level: Suitability;
  className?: string;
  size?: "xs" | "sm" | "md";
}) {
  return (
    <Badge tone={SUITABILITY_TONE[level]} className={className} size={size} dot>
      {SUITABILITY_LABELS[level]}
    </Badge>
  );
}

export const FLAG_TONE: Record<FlagSeverity, Tone> = {
  info: "info",
  caution: "warning",
  high: "danger",
};

export function FlagBadge({ severity, className }: { severity: FlagSeverity; className?: string }) {
  const label = { info: "Note", caution: "Caution", high: "Review required" }[severity];
  return (
    <Badge tone={FLAG_TONE[severity]} className={className} size="xs" dot>
      {label}
    </Badge>
  );
}
