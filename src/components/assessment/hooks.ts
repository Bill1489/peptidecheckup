"use client";

import * as React from "react";
import { useAssessmentStore } from "@/lib/assessment/store";

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true after mount — without a setState-in-effect. */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function subscribeCoarse(cb: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True on touch-first devices (where autofocusing a search box would pop the keyboard). */
export function useCoarsePointer(): boolean {
  return React.useSyncExternalStore(
    subscribeCoarse,
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false),
    () => false,
  );
}

/** Store selectors used across the wizard. */
export function useAnswers() {
  return useAssessmentStore((s) => s.answers);
}

export function useSetAnswer() {
  return useAssessmentStore((s) => s.setAnswer);
}

/**
 * Local-first text state that commits to the store after `delay` ms of
 * inactivity, and flushes immediately on blur / Enter / unmount so nothing is
 * lost when the user continues quickly.
 */
export function useDebouncedField<T>(initial: T, commit: (value: T) => void, delay = 150) {
  const [local, setLocal] = React.useState<T>(initial);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = React.useRef<{ value: T } | null>(null);
  const commitRef = React.useRef(commit);

  React.useEffect(() => {
    commitRef.current = commit;
  }, [commit]);

  const flush = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (pending.current) {
      const { value } = pending.current;
      pending.current = null;
      commitRef.current(value);
    }
  }, []);

  const update = React.useCallback(
    (value: T) => {
      setLocal(value);
      pending.current = { value };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, delay);
    },
    [delay, flush],
  );

  React.useEffect(() => flush, [flush]);

  return [local, update, flush] as const;
}

/** Latest-value ref for callbacks used inside timers, without stale closures. */
export function useLatest<T>(value: T) {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
