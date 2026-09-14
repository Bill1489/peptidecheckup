"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, GitCompareArrows, Link2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/card";
import { COMPOUNDS, getCompounds } from "@/data/compounds";
import {
  MAX_COMPARE,
  compareHref,
  parseCompareParam,
  sameSlugs,
  suggestedComparisons,
} from "@/lib/compare";
import { ensurePrefsHydrated, usePrefsStore } from "@/lib/compare-store";
import { CombinationPanel } from "./combination-panel";
import { ComparePicker } from "./compare-picker";
import { CompareSkeleton } from "./compare-skeleton";
import { CompareTable } from "./compare-table";
import { JurisdictionSwitch } from "./jurisdiction-switch";

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  const suggestions = suggestedComparisons();
  const singles = suggestions.length === 0 ? COMPOUNDS.slice(0, 6) : [];

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <GitCompareArrows className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-2xl leading-tight tracking-[-0.02em] text-ink sm:text-3xl">
            Choose up to {MAX_COMPARE} compounds to see them side by side
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-muted sm:text-base">
            Every row comes from the same structured record — evidence for each goal, regulatory status in your jurisdiction,
            adverse effects, contraindications, interactions and the human studies behind them. When two or more are selected,
            the combination notes in our database are checked for every pair.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={onAdd}>
              <Plus className="h-4 w-4" aria-hidden />
              Add a compound
            </Button>
            <Button size="lg" variant="secondary" href="/peptides/">
              Browse the directory
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper-2/60 p-5 sm:p-6">
          <Eyebrow>Suggested comparisons</Eyebrow>
          {suggestions.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s.slugs.join("+")}>
                  <Link
                    href={compareHref(s.slugs)}
                    className="group inline-flex flex-col items-start gap-0.5 rounded-2xl border border-line bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-soft"
                  >
                    <span className="text-sm font-medium text-ink">{s.label}</span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-2">{s.reason}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Pair suggestions appear once a family has at least two compounds. Start from any of these:
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {singles.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={compareHref([c.slug])}
                      className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:border-ink/20 hover:bg-paper"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tool                                                                */
/* ------------------------------------------------------------------ */

export function CompareTool() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("c");

  const hydrated = usePrefsStore((s) => s.hydrated);
  const slugs = usePrefsStore((s) => s.compareSlugs);
  const jurisdiction = usePrefsStore((s) => s.jurisdiction);
  const setJurisdiction = usePrefsStore((s) => s.setJurisdiction);
  const addCompare = usePrefsStore((s) => s.addCompare);
  const removeCompare = usePrefsStore((s) => s.removeCompare);
  const clearCompare = usePrefsStore((s) => s.clearCompare);

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const lastUrlRef = React.useRef<string | null | undefined>(undefined);

  /**
   * Two-way sync between `?c=` and the saved selection.
   * - When the URL changes (first load, shared link, history), it wins.
   * - Otherwise the URL follows the store via `router.replace` without scrolling.
   */
  React.useEffect(() => {
    ensurePrefsHydrated();
    const state = usePrefsStore.getState();

    if (lastUrlRef.current !== urlParam) {
      lastUrlRef.current = urlParam;
      const fromUrl = parseCompareParam(urlParam);
      if (fromUrl.length > 0 && !sameSlugs(fromUrl, state.compareSlugs)) {
        state.setCompareSlugs(fromUrl);
        return;
      }
    }

    const current = urlParam ?? "";
    const target = state.compareSlugs.join(",");
    if (current !== target) router.replace(compareHref(state.compareSlugs), { scroll: false });
  }, [urlParam, slugs, router]);

  if (!hydrated) return <CompareSkeleton />;

  const compounds = getCompounds(slugs);
  const canAdd = compounds.length < MAX_COMPARE;

  const onAdd = (slug: string) => {
    if (!addCompare(slug)) {
      toast(`You can compare up to ${MAX_COMPARE} compounds`, { description: "Remove one from the selection to add another." });
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied", { description: "Anyone opening it sees this exact comparison." });
    } catch {
      toast.error("The link could not be copied", { description: "Copy it from the address bar instead." });
    }
  };

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {compounds.map((c) => (
            <span
              key={c.slug}
              className="inline-flex h-11 items-center gap-1 rounded-full border border-line bg-white pl-4 pr-1.5 text-sm font-medium text-ink shadow-soft sm:h-10"
            >
              {c.name}
              <button
                type="button"
                onClick={() => removeCompare(c.slug)}
                aria-label={`Remove ${c.name} from comparison`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </span>
          ))}
          {canAdd && (
            <Button variant={compounds.length === 0 ? "primary" : "secondary"} size="md" onClick={() => setPickerOpen(true)}>
              <Plus className="h-4 w-4" aria-hidden />
              {compounds.length === 0 ? "Add a compound" : "Add"}
            </Button>
          )}
          {compounds.length > 1 && (
            <Button variant="ghost" size="md" onClick={clearCompare}>
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-2 sm:inline">Jurisdiction</span>
            <JurisdictionSwitch value={jurisdiction} onChange={setJurisdiction} />
          </div>
          {compounds.length > 0 && (
            <Button variant="secondary" size="md" onClick={copyLink}>
              <Link2 className="h-4 w-4" aria-hidden />
              Copy link
            </Button>
          )}
        </div>
      </div>

      {compounds.length === 1 && (
        <p className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted">
          <span className="font-medium text-ink">{compounds[0].name}</span> is ready. Add at least one more compound to see the
          differences side by side and check the combination notes.
        </p>
      )}

      {compounds.length === 0 ? (
        <EmptyState onAdd={() => setPickerOpen(true)} />
      ) : (
        <CompareTable compounds={compounds} jurisdiction={jurisdiction} onRemove={removeCompare} onAdd={() => setPickerOpen(true)} />
      )}

      {compounds.length >= 2 && <CombinationPanel compounds={compounds} />}

      {compounds.length > 0 && (
        <section
          className="bg-grain relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-white sm:px-10 sm:py-12"
          aria-labelledby="compare-cta-title"
        >
          <div className="bg-dots-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow className="text-brand-300">Next step</Eyebrow>
              <h2 id="compare-cta-title" className="mt-3 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-balance sm:text-3xl">
                Check these against your health profile
              </h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
                The assessment maps {compounds.length === 1 ? "this compound" : "these compounds"} against your goal, medical
                history and medicines, then gives you a structured report to discuss with a clinician.
              </p>
            </div>
            <Button href="/assessment/" size="xl" variant="inverted" className="shrink-0">
              Start the assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
            </Button>
          </div>
        </section>
      )}

      <ComparePicker open={pickerOpen} onOpenChange={setPickerOpen} selectedSlugs={slugs} onAdd={onAdd} />
    </div>
  );
}
