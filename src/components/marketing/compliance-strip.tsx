import { BRAND, DISCLAIMER_SHORT, RESEARCH_USE_LABEL } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Two bordered cells: the research-use label on the pens and the not-medical-advice statement on the Checkup. */
export function ComplianceStrip({ className }: { className?: string }) {
  return (
    <div className={cn("cell-grid md:grid-cols-2", className)}>
      <div className="p-5">
        <p className="label-mono text-ink">Research-use pens</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{RESEARCH_USE_LABEL}</p>
      </div>
      <div className="p-5">
        <p className="label-mono text-ink">{BRAND.assessmentName}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{DISCLAIMER_SHORT}</p>
      </div>
    </div>
  );
}
