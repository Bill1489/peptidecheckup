"use client";

import Link from "next/link";
import { AlertDialog } from "radix-ui";
import { Columns2, Printer, RotateCcw } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { LogoMark } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function ReportHeader({
  generatedAt,
  jurisdiction,
  compareHref,
  onStartOver,
}: {
  generatedAt: string;
  /** Country or jurisdiction label shown in the mono title */
  jurisdiction: string;
  compareHref?: string;
  onStartOver: () => void;
}) {
  const print = () => window.print();

  return (
    <header className="no-print rule-b sticky top-0 z-40 bg-white">
      <div className="container-x flex h-14 items-center justify-between gap-3 sm:h-16">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link href="/" aria-label={`${BRAND.displayName} home`} className="inline-flex shrink-0 items-center">
            <LogoMark className="h-7 w-7" />
          </Link>
          <p className="label-mono truncate text-ink">
            Report
            <span className="mx-1.5 text-muted-2" aria-hidden>
              ·
            </span>
            <span className="tnum">{formatDate(generatedAt, { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span className="hidden sm:inline">
              <span className="mx-1.5 text-muted-2" aria-hidden>
                ·
              </span>
              {jurisdiction}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {compareHref && (
            <Button href={compareHref} variant="secondary" size="sm" className="hidden md:inline-flex">
              <Columns2 className="h-3.5 w-3.5" aria-hidden />
              Compare
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={print} aria-label="Print or save as PDF">
            <Printer className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <Button variant="secondary" size="sm" aria-label="Start over">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Start over</span>
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 z-50 bg-ink/60 data-[state=open]:animate-fade-in" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-none border border-ink bg-white p-6 focus:outline-none data-[state=open]:animate-fade-in sm:p-8">
                <p className="label-mono text-ink">Confirm</p>
                <AlertDialog.Title className="mt-3 font-display text-[1.6rem] uppercase leading-[0.98] text-ink">
                  Start a new assessment?
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-4 text-sm leading-relaxed text-muted">
                  This clears your saved responses and this report from this browser. Print or save it as a PDF first if
                  you want to keep a copy.
                </AlertDialog.Description>
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <AlertDialog.Cancel asChild>
                    <Button variant="secondary" size="md">
                      Keep this report
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button variant="danger" size="md" onClick={onStartOver}>
                      Clear and start over
                    </Button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </div>
    </header>
  );
}
