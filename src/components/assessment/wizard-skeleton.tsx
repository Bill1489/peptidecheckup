import * as React from "react";
import { FLOW_SECTIONS } from "@/lib/assessment/flow";
import { LogoMark } from "@/components/ui/logo";

/** Rendered until the persisted store has hydrated, to avoid SSR/CSR mismatch. */
export function WizardSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col bg-white" aria-busy="true" aria-label="Loading your assessment">
      <header className="rule-b sticky top-0 z-40 bg-white">
        <div className="container-x flex h-14 items-center justify-between gap-4 sm:h-16">
          <div className="flex items-center gap-3">
            <LogoMark className="h-7 w-7" />
            <span className="skeleton h-3 w-32" />
          </div>
          <div className="hidden items-center gap-1 md:flex">
            {FLOW_SECTIONS.map((_, i) => (
              <span key={i} className="skeleton h-6 w-6" />
            ))}
          </div>
          <span className="skeleton h-3 w-16" />
        </div>
        <div className="h-[2px] w-full bg-line" />
      </header>
      <div className="container-narrow flex-1 py-8 sm:py-12">
        <span className="skeleton block h-3 w-40" />
        <span className="skeleton mt-4 block h-9 w-3/4" />
        <span className="skeleton mt-4 block h-4 w-1/2" />
        <div className="mt-8 grid gap-px border border-line">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="skeleton block h-14" />
          ))}
        </div>
      </div>
      <div className="rule-t sticky bottom-0 bg-white">
        <div className="container-narrow flex items-center justify-between py-3">
          <span className="skeleton h-4 w-16" />
          <span className="skeleton h-12 w-36" />
        </div>
      </div>
    </div>
  );
}
