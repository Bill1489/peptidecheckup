import type * as React from "react";
import {
  EVIDENCE_DESCRIPTIONS,
  EVIDENCE_LABELS,
  type EvidenceQuality,
  type RegulatoryStatus,
} from "@/data/types";
import { SUITABILITY_DESCRIPTIONS, SUITABILITY_LABELS, type Suitability } from "@/lib/engine/types";
import { EvidenceMeter, RegulatoryBadge, SuitabilityBadge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/card";
import { NAMED_JURISDICTIONS } from "./copy";
import { Reveal } from "./reveal";
import { Section } from "./section";

export const EVIDENCE_ORDER: EvidenceQuality[] = ["strong", "moderate", "limited", "preliminary", "insufficient"];
export const REGULATORY_ORDER: RegulatoryStatus[] = ["authorised", "investigational", "not_authorised", "unclear"];
export const SUITABILITY_ORDER: Suitability[] = ["potentially_relevant", "higher_concern", "insufficient_information"];

/** Plain-English meaning of each regulatory status, as used on compound pages and in reports. */
export const REGULATORY_DESCRIPTIONS: Record<RegulatoryStatus, string> = {
  authorised: "Licensed as a medicine for at least one indication by that jurisdiction’s regulator. Usually prescription-only, and only for the licensed use.",
  investigational: "In registered human clinical trials in that jurisdiction but not licensed. Legitimate access is normally through a trial.",
  not_authorised: "Not licensed as a medicine in that jurisdiction. Products sold anyway are unregulated, often labelled “for research use”, and are not quality-assured.",
  unclear: "We could not confirm the status from regulator sources at the last review. Treated cautiously in reports until confirmed.",
};

export function EvidenceScale({ compact = false }: { compact?: boolean }) {
  return (
    <ul className="divide-y divide-line">
      {EVIDENCE_ORDER.map((level) => (
        <li key={level} className={compact ? "py-3" : "py-4"}>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[0.95rem] font-medium text-ink">{EVIDENCE_LABELS[level]}</span>
            <EvidenceMeter level={level} />
          </div>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted">{EVIDENCE_DESCRIPTIONS[level]}</p>
        </li>
      ))}
    </ul>
  );
}

export function RegulatoryScale() {
  return (
    <ul className="divide-y divide-line">
      {REGULATORY_ORDER.map((status) => (
        <li key={status} className="py-4">
          <RegulatoryBadge status={status} size="sm" />
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{REGULATORY_DESCRIPTIONS[status]}</p>
        </li>
      ))}
    </ul>
  );
}

export function SuitabilityScale() {
  return (
    <ul className="divide-y divide-line">
      {SUITABILITY_ORDER.map((level) => (
        <li key={level} className="py-4">
          <SuitabilityBadge level={level} size="sm" />
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{SUITABILITY_DESCRIPTIONS[level]}</p>
          <span className="sr-only">{SUITABILITY_LABELS[level]}</span>
        </li>
      ))}
    </ul>
  );
}

function Panel({ eyebrow, title, children, delay }: { eyebrow: string; title: string; children: React.ReactNode; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
        <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-brand-700">{eyebrow}</p>
        <h3 className="mt-2 font-display text-2xl leading-snug text-ink">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </Reveal>
  );
}

export function Grades() {
  return (
    <Section tone="white" id="grading">
      <Reveal>
        <SectionHeading
          eyebrow="What we grade and how"
          title="Nothing in your report is guessed."
          description={`Every label you see is derived from a structured field in the database: a five-point evidence grade for each goal, a regulatory status per jurisdiction across ${NAMED_JURISDICTIONS.length} regions, and one of three suitability labels from the rules engine.`}
        />
      </Reveal>
      <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3">
        <Panel eyebrow="Evidence · 5 grades" title="How strong is the human evidence?" delay={0}>
          <EvidenceScale />
        </Panel>
        <Panel eyebrow="Regulatory · 4 statuses" title="Is it a licensed medicine where you live?" delay={0.08}>
          <RegulatoryScale />
        </Panel>
        <Panel eyebrow="Suitability · 3 labels" title="What did your answers identify?" delay={0.16}>
          <SuitabilityScale />
        </Panel>
      </div>
    </Section>
  );
}
