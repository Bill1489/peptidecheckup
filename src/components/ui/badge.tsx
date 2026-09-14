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

const tones: Record<Tone, string> = {
  neutral: "bg-paper-3 text-ink-3",
  brand: "bg-brand-100 text-brand-800",
  accent: "bg-accent-100 text-accent-700",
  success: "bg-relevant-soft text-emerald-800",
  warning: "bg-caution-soft text-amber-800",
  danger: "bg-concern-soft text-rose-800",
  info: "bg-info-soft text-blue-800",
  ink: "bg-ink text-white",
  outline: "bg-transparent text-ink border border-line-strong",
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
        "inline-flex items-center gap-1.5 rounded-full font-medium tracking-[-0.01em]",
        size === "xs" && "px-2 py-0.5 text-[0.7rem]",
        size === "sm" && "px-2.5 py-1 text-xs",
        size === "md" && "px-3 py-1.5 text-sm",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />}
      {children}
    </span>
  );
}

/* ---------------- Semantic badges ---------------- */

export const EVIDENCE_TONE: Record<EvidenceQuality, Tone> = {
  strong: "success",
  moderate: "brand",
  limited: "warning",
  preliminary: "warning",
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
      <span className={cn("h-1.5 w-1.5 rounded-full", EVIDENCE_COLOR_CLASS[level])} aria-hidden />
      {prefix ? `${prefix} ` : ""}
      {EVIDENCE_LABELS[level]}
    </Badge>
  );
}

/** Five-segment evidence meter used on cards and compare tables. */
export function EvidenceMeter({ level, className }: { level: EvidenceQuality; className?: string }) {
  const rank = { strong: 5, moderate: 4, limited: 3, preliminary: 2, insufficient: 1 }[level];
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Evidence: ${EVIDENCE_LABELS[level]}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-3 rounded-full transition-colors",
            i <= rank ? EVIDENCE_COLOR_CLASS[level] : "bg-ink/10",
          )}
        />
      ))}
    </span>
  );
}

export const REGULATORY_TONE: Record<RegulatoryStatus, Tone> = {
  authorised: "success",
  not_authorised: "danger",
  investigational: "info",
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
  potentially_relevant: "success",
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
