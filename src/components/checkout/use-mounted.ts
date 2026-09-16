"use client";

import * as React from "react";

const noopSubscribe = () => () => {};

/**
 * False during SSR and the hydration render, true after mount. Lets components
 * that read persisted stores render a stable server snapshot first.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
