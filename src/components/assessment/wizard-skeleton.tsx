import * as React from "react";
import { LogoMark } from "@/components/ui/logo";

/** Rendered until the persisted store has hydrated, to avoid SSR/CSR mismatch. */
export function WizardSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper" aria-busy="true" aria-label="Loading your assessment">
      <header className="sticky top-0 z-40 glass">
        <div className="container-x flex h-14 items-center justify-between gap-4 sm:h-16">
          <LogoMark className="h-7 w-7" />
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="skeleton h-1.5 w-1.5 rounded-full" />
            ))}
          </div>
          <span className="skeleton h-8 w-24 rounded-full" />
        </div>
        <div className="h-0.5 w-full bg-ink/8" />
      </header>
      <div className="container-narrow flex-1 py-8 sm:py-12">
        <span className="skeleton block h-3 w-40 rounded-full" />
        <span className="skeleton mt-4 block h-8 w-3/4 rounded-lg" />
        <span className="skeleton mt-3 block h-4 w-1/2 rounded-full" />
        <div className="mt-8 grid gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="skeleton block h-14 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-line glass">
        <div className="container-narrow flex items-center justify-between py-3">
          <span className="skeleton h-11 w-20 rounded-full" />
          <span className="skeleton h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}
