"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Report } from "@/lib/engine/types";
import type { MatchResult } from "@/lib/match/types";
import { EMPTY_ANSWERS, type AssessmentAnswers, type EntryContext, type SectionId } from "./types";

/**
 * Persistent assessment state (localStorage). Shared by the wizard (writer)
 * and the report (reader). Always check `hydrated` before trusting `answers`
 * on first render to avoid SSR/CSR mismatches.
 */
export interface AssessmentState {
  answers: AssessmentAnswers;
  /** Wizard position — section id + step index within the section */
  position: { section: SectionId; step: number };
  lastReport: Report | null;
  /** Product match derived from the last report (quiz result) */
  lastMatch: MatchResult | null;
  hydrated: boolean;

  setAnswers: (patch: Partial<AssessmentAnswers>) => void;
  setAnswer: <K extends keyof AssessmentAnswers>(key: K, value: AssessmentAnswers[K]) => void;
  setPosition: (position: { section: SectionId; step: number }) => void;
  markSectionComplete: (id: SectionId) => void;
  markSectionSkipped: (id: SectionId) => void;
  unskipSection: (id: SectionId) => void;
  start: (entry?: EntryContext) => void;
  complete: () => void;
  setLastReport: (report: Report | null) => void;
  setLastMatch: (match: MatchResult | null) => void;
  reset: () => void;
  setHydrated: (v: boolean) => void;
}

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      answers: { ...EMPTY_ANSWERS },
      position: { section: "goals", step: 0 },
      lastReport: null,
      lastMatch: null,
      hydrated: false,

      setAnswers: (patch) => set({ answers: { ...get().answers, ...patch } }),
      setAnswer: (key, value) => set({ answers: { ...get().answers, [key]: value } }),
      setPosition: (position) => set({ position }),

      markSectionComplete: (id) =>
        set((s) => ({
          answers: {
            ...s.answers,
            completedSections: uniq([...s.answers.completedSections, id]),
            skippedSections: s.answers.skippedSections.filter((x) => x !== id),
          },
        })),
      markSectionSkipped: (id) =>
        set((s) => ({
          answers: {
            ...s.answers,
            skippedSections: uniq([...s.answers.skippedSections, id]),
            completedSections: s.answers.completedSections.filter((x) => x !== id),
          },
        })),
      unskipSection: (id) =>
        set((s) => ({
          answers: { ...s.answers, skippedSections: s.answers.skippedSections.filter((x) => x !== id) },
        })),

      start: (entry) =>
        set((s) => ({
          answers: {
            ...s.answers,
            startedAt: s.answers.startedAt ?? new Date().toISOString(),
            entry: entry ?? s.answers.entry,
            primaryGoal: s.answers.primaryGoal ?? entry?.goal,
          },
        })),
      complete: () => set((s) => ({ answers: { ...s.answers, completedAt: new Date().toISOString() } })),
      setLastReport: (report) => set({ lastReport: report }),
      setLastMatch: (match) => set({ lastMatch: match }),
      reset: () =>
        set({
          answers: { ...EMPTY_ANSWERS },
          position: { section: "goals", step: 0 },
          lastReport: null,
          lastMatch: null,
        }),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "peptidecheckup.assessment.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ answers: s.answers, position: s.position, lastReport: s.lastReport, lastMatch: s.lastMatch }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AssessmentState>;
        // Backfill fields added after v1 so older saved answers keep working.
        const answers = { ...EMPTY_ANSWERS, ...(p.answers ?? {}) } as AssessmentAnswers;
        return { ...current, ...p, answers };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Convenience selector: has the user answered anything meaningful yet? */
export function hasProgress(a: AssessmentAnswers) {
  return Boolean(a.primaryGoal || a.consideredCompounds.length || a.age || a.completedSections.length);
}
