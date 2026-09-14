"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_OUT_EXPO } from "./reveal";

/**
 * Mobile-only sticky action bar for ad landing pages. Appears once the hero
 * CTA has scrolled out of view so the primary action is always one tap away.
 */
export function StickyCta({
  href,
  label = "Start your free assessment",
  note,
  revealAfter = 420,
  hideBeforeEnd = 760,
}: {
  href: string;
  label?: string;
  note?: string;
  /** Scroll offset (px) after which the bar appears */
  revealAfter?: number;
  /** Hide the bar within this many px of the page end so it never covers the footer */
  hideBeforeEnd?: number;
}) {
  const [visible, setVisible] = React.useState(false);
  const reduce = useReducedMotion();

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
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: reduce ? 0 : 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : 72, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT_EXPO }}
          className="fixed inset-x-0 bottom-0 z-40 md:hidden"
        >
          <div className="glass border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lift">
            <Button href={href} size="xl" variant="primary" className="w-full">
              {label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            {note && <p className="mt-2 text-center text-[0.7rem] text-muted">{note}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
