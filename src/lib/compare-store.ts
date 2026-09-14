"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { COMPOUND_MAP } from "@/data/compounds";
import { MAX_COMPARE, isSelectableJurisdiction, normaliseSlugs, type SelectableJurisdiction } from "./compare";

/* ------------------------------------------------------------------ */
/* Preferences store (localStorage)                                    */
/* ------------------------------------------------------------------ */

export interface PrefsState {
  /** Jurisdiction used for regulatory badges across the directory and compare tool. */
  jurisdiction: SelectableJurisdiction;
  /** Compounds selected for side-by-side comparison (max MAX_COMPARE). */
  compareSlugs: string[];
  /** True once localStorage has been read on the client. */
  hydrated: boolean;

  setJurisdiction: (jurisdiction: SelectableJurisdiction) => void;
  setCompareSlugs: (slugs: readonly string[]) => void;
  /** Returns false when the selection is full or the slug is unknown. */
  addCompare: (slug: string) => boolean;
  removeCompare: (slug: string) => void;
  /** Returns false when the compound could not be added because the selection is full. */
  toggleCompare: (slug: string) => boolean;
  clearCompare: () => void;
  setHydrated: (hydrated: boolean) => void;
}

type PersistedPrefs = Pick<PrefsState, "jurisdiction" | "compareSlugs">;

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      jurisdiction: "UK",
      compareSlugs: [],
      hydrated: false,

      setJurisdiction: (jurisdiction) => set({ jurisdiction }),
      setCompareSlugs: (slugs) => set({ compareSlugs: normaliseSlugs(slugs) }),
      addCompare: (slug) => {
        const { compareSlugs } = get();
        if (compareSlugs.includes(slug)) return true;
        if (!COMPOUND_MAP[slug] || compareSlugs.length >= MAX_COMPARE) return false;
        set({ compareSlugs: [...compareSlugs, slug] });
        return true;
      },
      removeCompare: (slug) => set({ compareSlugs: get().compareSlugs.filter((s) => s !== slug) }),
      toggleCompare: (slug) => {
        const { compareSlugs, addCompare, removeCompare } = get();
        if (compareSlugs.includes(slug)) {
          removeCompare(slug);
          return true;
        }
        return addCompare(slug);
      },
      clearCompare: () => set({ compareSlugs: [] }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "peptidecheckup.prefs.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s): PersistedPrefs => ({ jurisdiction: s.jurisdiction, compareSlugs: s.compareSlugs }),
      /**
       * Hydration is triggered manually from an effect (see `useHydratePrefs`) so the
       * first client render always matches the prerendered HTML.
       */
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Record<keyof PersistedPrefs, unknown>>;
        const jurisdiction =
          typeof p.jurisdiction === "string" && isSelectableJurisdiction(p.jurisdiction)
            ? p.jurisdiction
            : current.jurisdiction;
        const compareSlugs = Array.isArray(p.compareSlugs)
          ? normaliseSlugs(p.compareSlugs.filter((s): s is string => typeof s === "string"))
          : current.compareSlugs;
        return { ...current, jurisdiction, compareSlugs };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Read localStorage into the store exactly once. Safe to call repeatedly; no-op on the server. */
export function ensurePrefsHydrated() {
  if (typeof window === "undefined") return;
  if (!usePrefsStore.persist.hasHydrated()) void usePrefsStore.persist.rehydrate();
}

/** Call from any client component that reads `usePrefsStore`. */
export function useHydratePrefs() {
  useEffect(() => {
    ensurePrefsHydrated();
  }, []);
}

