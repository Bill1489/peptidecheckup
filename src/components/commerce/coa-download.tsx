"use client";

import * as React from "react";
import { Tooltip } from "radix-ui";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * "Download CoA". When the certificate has no public URL the button is
 * disabled and a tooltip explains that the PDF travels with the shipment.
 */
export function CoaDownload({ url, batch }: { url?: string; batch: string }) {
  if (url) {
    return (
      <Button variant="secondary" size="sm" href={url} external>
        <Download className="h-3.5 w-3.5" aria-hidden />
        Download CoA
      </Button>
    );
  }
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span tabIndex={0} className="inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" aria-label={`Download CoA ${batch} — PDF attached to each shipment`}>
            <Button variant="secondary" size="sm" disabled aria-hidden tabIndex={-1}>
              <Download className="h-3.5 w-3.5" aria-hidden />
              Download CoA
            </Button>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="z-50 border border-ink bg-ink px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white data-[state=delayed-open]:animate-fade-in"
          >
            PDF attached to each shipment
            <Tooltip.Arrow className="fill-ink" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
