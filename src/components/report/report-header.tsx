"use client";

import { AlertDialog } from "radix-ui";
import { Columns2, Printer, RotateCcw } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function ReportHeader({
  generatedAt,
  compareHref,
  onStartOver,
}: {
  generatedAt: string;
  compareHref?: string;
  onStartOver: () => void;
}) {
  const print = () => window.print();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line glass">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Logo />
          <span className="hidden h-5 w-px bg-line-strong sm:block" aria-hidden />
          <p className="hidden truncate font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted sm:block">
            Report · {formatDate(generatedAt)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {compareHref && (
            <Button href={compareHref} variant="secondary" size="sm" className="hidden md:inline-flex">
              <Columns2 className="h-4 w-4" aria-hidden />
              Compare these
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={print} className="hidden sm:inline-flex">
            <Printer className="h-4 w-4" aria-hidden />
            Print / Save PDF
          </Button>
          <button
            type="button"
            onClick={print}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/6 sm:hidden"
            aria-label="Print or save as PDF"
          >
            <Printer className="h-5 w-5" aria-hidden />
          </button>

          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-full px-2.5 text-sm font-medium text-ink-3 hover:bg-ink/6 hover:text-ink sm:px-4"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Start over</span>
                <span className="sr-only sm:hidden">Start over</span>
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-fade-in" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-white p-6 shadow-lift focus:outline-none data-[state=open]:animate-fade-up sm:p-7">
                <AlertDialog.Title className="font-display text-2xl font-normal tracking-[-0.02em] text-ink">
                  Start a new assessment?
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                  This clears your saved responses and this report from this browser. Print or save it as a PDF
                  first if you want to keep a copy.
                </AlertDialog.Description>
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <AlertDialog.Cancel asChild>
                    <Button variant="secondary" size="md">
                      Keep this report
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button variant="primary" size="md" onClick={onStartOver}>
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
