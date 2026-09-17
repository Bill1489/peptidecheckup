"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowUpRight, Link2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { COMPOUNDS, getCompounds } from "@/data/compounds";
import { BRAND } from "@/lib/brand";
import {
  MAX_COMPARE,
  assessmentHref,
  compareHref,
  compoundHref,
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
    <div className="border border-ink bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="p-5 sm:p-8">
        <p className="label-mono">Empty selection</p>
        <h2 className="mt-3 text-balance text-[1.6rem] uppercase leading-[0.98] text-ink sm:text-[2rem]">
          Choose up to {MAX_COMPARE} compounds to see them side by side
        </h2>
        <p className="mt-4 text-pretty text-[14px] leading-relaxed text-muted sm:text-[15px]">
          Every row comes from the same structured record — evidence for each goal, regulatory status in your jurisdiction, adverse
          effects, contraindications, interactions and the human studies behind them, plus the {BRAND.displayName} pen that carries each
          compound and its price. When two or more are selected, the combination notes in our database are checked for every pair.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button size="lg" onClick={onAdd}>
            <Plus className="h-4 w-4" aria-hidden />
            Add a compound
          </Button>
          <Button size="lg" variant="secondary" href="/peptides/">
            Browse the directory
          </Button>
        </div>
      </div>

      <div className="border-t border-ink lg:border-l lg:border-t-0">
        <p className="label-mono border-b border-line bg-paper-2 px-5 py-2.5">
          {suggestions.length > 0 ? `Suggested comparisons · the ${BRAND.displayName} range` : "Start from a compound"}
        </p>
        <ul className="divide-y divide-line">
          {suggestions.length > 0
            ? suggestions.map((s) => (
                <li key={s.slugs.join("+")}>
                  <Link href={compareHref(s.slugs)} className="hover-invert flex min-h-14 items-center justify-between gap-3 px-5 py-3">
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium text-ink">{s.label}</span>
                      <span className="label-mono mt-0.5 block">{s.reason}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                </li>
              ))
            : singles.map((c) => (
                <li key={c.slug}>
                  <Link href={compareHref([c.slug])} className="hover-invert flex min-h-12 items-center justify-between gap-3 px-5 py-3">
                    <span className="text-[14px] font-medium text-ink">{c.name}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                </li>
              ))}
        </ul>
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
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Selected compounds">
          {compounds.map((c) => (
            <span
              key={c.slug}
              className="inline-flex h-11 items-stretch border border-ink bg-white font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink"
            >
              <Link href={compoundHref(c.slug)} className="flex items-center px-3 transition-colors duration-150 hover:bg-paper-2">
                {c.name}
              </Link>
              <button
                type="button"
                onClick={() => removeCompare(c.slug)}
                aria-label={`Remove ${c.name} from comparison`}
                className="inline-flex w-11 items-center justify-center border-l border-ink transition-colors duration-150 hover:bg-ink hover:text-white"
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
            <span className="label-mono hidden sm:inline">Jurisdiction</span>
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
        <p className="border border-ink bg-paper-2 px-4 py-3 text-[14px] text-muted">
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
        <section className="border border-ink bg-ink text-white" aria-labelledby="compare-cta-title">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:items-end lg:gap-10">
            <p className="label-mono text-white/60">Next step</p>
            <div className="max-w-2xl">
              <h2 id="compare-cta-title" className="text-balance text-[1.8rem] uppercase leading-[0.95] sm:text-[2.4rem]">
                Check these against your health profile
              </h2>
              <p className="mt-4 text-pretty text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
                The assessment maps {compounds.length === 1 ? "this compound" : "these compounds"} against your goal, medical history and
                medicines, then gives you a structured report to discuss with a clinician — and says when not to buy.
              </p>
            </div>
            <Button href={assessmentHref(compounds.length === 1 ? compounds[0].slug : undefined)} size="xl" variant="inverted" className="shrink-0">
              Start the assessment
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </section>
      )}

      <ComparePicker open={pickerOpen} onOpenChange={setPickerOpen} selectedSlugs={slugs} onAdd={onAdd} />
    </div>
  );
}
