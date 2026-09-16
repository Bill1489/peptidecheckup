"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mobile-only fixed action bar for ad landing pages. Appears once the hero
 * CTA has scrolled away; hidden near the page end so it never covers the footer.
 * Motion is a 200 ms opacity / 8 px translate — nothing floats.
 */
export function StickyCta({
  href,
  label,
  note,
  revealAfter = 480,
  hideBeforeEnd = 720,
}: {
  href: string;
  label: string;
  note?: string;
  revealAfter?: number;
  hideBeforeEnd?: number;
}) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - hideBeforeEnd;
      setVisible(y > revealAfter && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [revealAfter, hideBeforeEnd]);

  return (
    <div
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-white transition-[opacity,transform] duration-200 ease-out md:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
    >
      <div className="flex items-center gap-4 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {note && <p className="label-mono shrink-0 text-ink">{note}</p>}
        <Button href={href} size="lg" variant="primary" className="flex-1">
          {label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
