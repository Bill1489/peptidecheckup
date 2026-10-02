import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { joinNames } from "@/components/commerce/product-utils";
import { ASSESSMENT_MINUTES, CHECKUP, CHECKUP_SHORT, coaLabs, NAMED_JURISDICTIONS, numberWord, REPORT_CONTENTS, SECTION_COUNT } from "@/components/marketing/copy";
import { Faq } from "@/components/marketing/faq";
import { ALL_FAQ, type FaqItem } from "@/components/marketing/faq-data";
import { IndexHead } from "@/components/marketing/index-head";
import { NumberedRows } from "@/components/marketing/page-shell";
import { PenCell } from "@/components/marketing/pen-cell";
import { Logo } from "@/components/ui/logo";
import { COMPOUNDS } from "@/data/compounds";
import { GOAL_MAP, type GoalDef } from "@/data/goals";
import { getProductBySlug, PRODUCTS, type Product } from "@/data/products";
import { BRAND, DISCLAIMER_SHORT, RESEARCH_USE_LABEL } from "@/lib/brand";
import { assessmentHref, goalForSymptom, pensForSymptom, type SymptomDef } from "@/lib/funnel";
import { VERDICT_LABELS } from "@/lib/match/types";
import { LandingCta, LandingStickyCta } from "./landing-cta";
import { ResultPreview } from "./result-preview";

/* ------------------------------------------------------------------ */
/* Copy                                                                */
/* ------------------------------------------------------------------ */

const PROMISE = `Find out which pen fits — if any — in ${ASSESSMENT_MINUTES} minutes.`;

const GENERIC = {
  hook: "Not sure which peptide fits?",
  sub: `Answer ${numberWord(SECTION_COUNT)} short sections about your goal, your history and your medicines. A rules engine checks them against our evidence and regulatory database and scores all ${PRODUCTS.length} ${BRAND.range.name} pens in the range. You land on the one that fits — with the reasons spelled out — or you are told not to buy.`,
  checks: [
    "Whether anything in the range has human evidence for your goal — and how strong it is, on a five-point scale from Strong to Insufficient",
    "Conditions in your history that change the picture, from thyroid, cardiovascular and metabolic conditions to cancer history, pregnancy and mental health",
    "Your medicines and supplements by class, and the interactions a clinician would ask about before anything else",
    `Regulatory status where you live, anti-doping status if you compete in tested sport, and whether a clinician should be your first call`,
  ] as const,
};

const STEPS = [
  {
    title: "Answer",
    meta: `≈${ASSESSMENT_MINUTES} min`,
    body: `Your goal and the specific problem behind it, then your history in categories, your medicines by class and a short safety screen. Skip what does not apply. No account, no essays, nothing uploaded.`,
  },
  {
    title: "We check",
    meta: "Deterministic",
    body: `A fixed set of rules — not a chatbot — checks your answers against ${COMPOUNDS.length} compound records and the regulatory status in ${NAMED_JURISDICTIONS.length} jurisdictions, then scores every pen in the range on goal, focus, evidence, experience and the safety verdict. Same answers, same result.`,
  },
  {
    title: "You land",
    meta: "On a pen, or on a no",
    body: "You arrive on the pen that fits with the reasons spelled out, the evidence grade for your goal, what to review first and two alternatives. If your answers raise a flag, you are told not to buy — and exactly why.",
  },
];

const YOU_GET = [
  {
    title: "One pen, with the reasons",
    body: `Every pen in the range is scored against your goal, focus areas and the evidence. You land on the one that fits, with the answers that put it there.`,
  },
  {
    title: "The evidence grade for your goal",
    body: "Strong to Insufficient, from a database we maintain by hand. When the evidence is early or animal-only, the result says so before it says anything else.",
  },
  {
    title: "Regulatory status where you live",
    body: `Authorised, investigational or not authorised in your jurisdiction, with the date we last reviewed it — taken from the record, never inferred.`,
  },
  {
    title: "A no, when your history says no",
    body: "A safety flag or a Higher concern label rules a pen out. Nothing goes in the cart; you get the reasons and a clinician link instead.",
  },
];

const VERDICTS: { verdict: keyof typeof VERDICT_LABELS; tone: string; body: string }[] = [
  {
    verdict: "match",
    tone: "text-brand-300",
    body: "The pen fits your goal and nothing in your answers rules it out. You land on its page with the reasons and the option to add it to your cart.",
  },
  {
    verdict: "match_with_review",
    tone: "text-white",
    body: "The pen fits, but something needs a look first — a compound that is an authorised medicine elsewhere, one still in trials, or a condition to check. The page says exactly what.",
  },
  {
    verdict: "not_recommended",
    tone: "text-accent-400",
    body: "A safety flag or a Higher concern label rules it out. Nothing goes in your cart. You get the reasons, the alternatives and a clinician link instead.",
  },
];

const FAQ_IDS = ["medical-advice", "not-a-fit", "data", "research-use", "licensed-medicines", "discount"];
/** The questions a cold visitor asks before starting, in that order — also fed to the page's FAQPage JSON-LD. */
export const LANDING_FAQ: FaqItem[] = FAQ_IDS.map((id) => ALL_FAQ.find((f) => f.id === id)).filter((f): f is FaqItem => f !== undefined);

/** How many pens the generic range strip shows before the "+N more" cell. */
const STRIP_SIZE = 7;
const STRIP: Product[] = Array.from(new Set([...PRODUCTS.filter((p) => p.bestseller), ...PRODUCTS.filter((p) => p.featured), ...PRODUCTS])).slice(0, STRIP_SIZE);

/** The pen used for the sample result when the symptom has none of its own. */
function fallbackPen(): Product {
  return getProductBySlug("nad") ?? PRODUCTS.find((p) => p.bestseller) ?? PRODUCTS[0];
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/**
 * The paid-traffic landing page for the Checkup. One job: get a cold visitor
 * from an ad into the assessment with an accurate idea of what they will get.
 * Message-matched when a symptom is given (the ad's own question becomes the
 * headline); generic otherwise. No site chrome — a slim header, the Checkup,
 * and a legal footer.
 */
export function CheckupLanding({ symptom }: { symptom?: SymptomDef }) {
  const goal: GoalDef = symptom ? goalForSymptom(symptom) : GOAL_MAP.general_wellbeing;
  const pens = symptom ? pensForSymptom(symptom) : [];
  const sample = pens[0] ?? fallbackPen();
  const href = assessmentHref(symptom);
  const goalLower = goal.label.toLowerCase();
  const hook = symptom ? goal.funnelHeadline : GENERIC.hook;
  const sub = symptom ? symptom.subheadline : GENERIC.sub;
  const checks = symptom ? symptom.checks : GENERIC.checks;
  const labs = coaLabs();
  const startLabel = `Start the ${CHECKUP_SHORT}`;

  return (
    <div className="flex min-h-dvh flex-col bg-white pb-20 md:pb-0">
      {/* Slim header — logo, the facts, one button */}
      <header className="rule-b sticky top-0 z-30 bg-white">
        <div className="container-x flex h-14 items-center justify-between gap-4 sm:h-16">
          <Logo href="/" />
          <div className="flex items-center gap-5">
            <p className="label-mono hidden text-ink md:block">Free · ≈{ASSESSMENT_MINUTES} min · No account</p>
            <div className="hidden sm:block" data-cta="checkup-start-header">
              <LandingCta href={href} size="sm" variant="primary">
                {startLabel}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </LandingCta>
            </div>
          </div>
        </div>
      </header>

      {/* Hero — the ad's question, the promise, the CTA, and what the end looks like */}
      <section className="rule-b">
        <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-10 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:items-start lg:gap-16 lg:py-16">
          <div className="min-w-0">
            <p className="label-mono text-ink">
              {CHECKUP} · {symptom ? `Goal · ${goal.label}` : `${PRODUCTS.length} ${BRAND.range.name} pens`} · Can end at no pen
            </p>
            <h1 className="mt-6 break-words text-[2.5rem] uppercase leading-[0.95] sm:text-[3.5rem] lg:text-[3.4rem] xl:text-[4.25rem]">{hook}</h1>
            <p className="mt-4 font-display text-[1.35rem] uppercase leading-[1.02] tracking-[-0.02em] text-brand-600 sm:text-[1.75rem]">{PROMISE}</p>
            <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-3 sm:text-[17px]">{sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div data-cta="checkup-start-hero">
                <LandingCta href={href} size="xl" variant="primary" className="w-full sm:w-auto">
                  {startLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </LandingCta>
              </div>
              <a href="#how" className="label-mono inline-flex min-h-[44px] items-center gap-2 text-ink link-rule">
                How it works
                <ArrowDown className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted" aria-label="The basics">
              <li>Free</li>
              <li>No account</li>
              <li>Answers stay in your browser</li>
              <li>18+ only</li>
            </ul>
          </div>
          <ResultPreview product={sample} goal={goal.id} className="min-w-0 lg:pt-1" />
        </div>
      </section>

      {/* Proof strip — the numbers behind the claim, all from the data */}
      <section className="rule-b" aria-label="In numbers">
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          <Stat value={PRODUCTS.length} label={`${BRAND.range.name} pens scored against your answers`} />
          <Stat value={COMPOUNDS.length} label="compound records, maintained by hand" />
          <Stat value={NAMED_JURISDICTIONS.length} label="jurisdictions with regulatory status on record" />
          <Stat value={SECTION_COUNT} label={`short sections · about ${ASSESSMENT_MINUTES} minutes`} />
        </dl>
      </section>

      {/* How it works */}
      <section id="how" className="rule-b scroll-mt-20">
        <div className="container-x py-12 lg:py-16">
          <IndexHead
            index="01"
            label="How it works"
            title="Answer. Check. Land on a pen — or on a no."
            description={`The ${CHECKUP} is the front door to the range. It exists to say which pen fits and, just as often, that none of them does.`}
          />
          <NumberedRows className="mt-8" items={STEPS} />
        </div>
      </section>

      {/* What it checks */}
      <section className="rule-b">
        <div className="container-x py-12 lg:py-16">
          <IndexHead
            index="02"
            label={`What the ${CHECKUP_SHORT} checks`}
            title={symptom ? `Four things it checks for ${goalLower}.` : "Four things it checks before it names a pen."}
            description={`${ASSESSMENT_MINUTES} minutes of structured questions — categories, not essays — run through a deterministic rules engine against the evidence and regulatory database, then scored against the range.`}
          />
          <NumberedRows className="mt-8" items={checks.map((check) => ({ body: check }))} />
        </div>
      </section>

      {/* Where it lands — the pens for this goal, or the range it chooses from */}
      {symptom ? <SymptomPens symptom={symptom} goal={goal} pens={pens} href={href} /> : <RangeStrip />}

      {/* What you get */}
      <section className="rule-b">
        <div className="container-x py-12 lg:py-16">
          <IndexHead
            index="04"
            label="What you get"
            title="A pen with the reasons. Or the reasons not to."
            description={`Plus the full report — ${REPORT_CONTENTS.length} sections from evidence and regulatory status to dosing context and questions for a clinician — saved on your device and printable.`}
          />
          <ol className="cell-grid mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {YOU_GET.map((item, i) => (
              <li key={item.title} className="p-5">
                <p className="label-mono tnum">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[1.05rem] font-bold leading-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The rule — three verdicts, on ink */}
      <section className="bg-ink text-white">
        <div className="container-x py-12 lg:py-16">
          <IndexHead
            tone="dark"
            index="05"
            label="The rule"
            title={`The ${CHECKUP_SHORT} can tell you not to buy. That's the point.`}
            description="Every result is one of three verdicts. The third one links to a clinician, not a checkout — and it is the reason the first two mean something."
          />
          <ul className="mt-8 grid gap-px border border-white/25 bg-white/25 md:grid-cols-3" aria-label="The three verdicts">
            {VERDICTS.map((v, i) => (
              <li key={v.verdict} className="bg-ink p-5">
                <p className="label-mono text-white/50 tnum">{String(i + 1).padStart(2, "0")}</p>
                <p className={`mt-3 font-display text-[1.2rem] uppercase leading-[1.02] tracking-[-0.02em] ${v.tone}`}>{VERDICT_LABELS[v.verdict]}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/75">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The pens themselves — format and testing, briefly */}
      <section className="rule-b">
        <div className="container-x py-10 lg:py-12">
          <ul className="cell-grid sm:grid-cols-3" aria-label="About the pens">
            <li className="p-5">
              <p className="label-mono text-ink">Pre-filled pens</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
                Every pen in the range is a pre-filled 3 mL dose-dial pen from {BRAND.range.name}. No vials, no reconstitution, no drawing up.
              </p>
            </li>
            <li className="p-5">
              <p className="label-mono text-ink">Every lot tested</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
                Purity by HPLC, identity by LC-MS and endotoxin by LAL — by an independent laboratory{labs.length > 0 ? ` (${joinNames(labs)})` : ""}, not by us.
              </p>
            </li>
            <li className="p-5">
              <p className="label-mono text-ink">Certificate published</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
                The certificate of analysis is published against the lot number on the carton, and a copy ships in the box.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Questions */}
      <section className="rule-b">
        <div className="container-x py-12 lg:py-16">
          <IndexHead index="06" label="Questions" title="Before you start." />
          <Faq items={LANDING_FAQ} className="mt-8" />
        </div>
      </section>

      {/* Closing band */}
      <section className="bg-brand-600 text-white">
        <div className="container-x grid gap-6 py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:py-20">
          <p className="label-mono text-white/70">{CHECKUP}</p>
          <div className="min-w-0">
            <h2 className="text-balance break-words text-[2.25rem] uppercase sm:text-[3rem] lg:text-[3.75rem]">
              {symptom ? `Take the ${ASSESSMENT_MINUTES}-minute ${CHECKUP_SHORT} for ${goalLower}.` : `Find your pen in ${ASSESSMENT_MINUTES} minutes. Or find out it's none of them.`}
            </h2>
            <div className="mt-8" data-cta="checkup-start-footer">
              <LandingCta href={href} size="xl" variant="inverted">
                {startLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </LandingCta>
            </div>
            <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/70">
              Not medical advice · Research-use labelling applies · 18+ only · It can say no
            </p>
          </div>
        </div>
      </section>

      {/* Legal footer */}
      <footer className="rule-t">
        <div className="container-x flex flex-col gap-4 py-6 text-xs leading-relaxed text-muted lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <p className="max-w-2xl">
            {DISCLAIMER_SHORT} {RESEARCH_USE_LABEL}
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em]" aria-label="Legal">
            <Link href="/privacy" className="link-rule text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="link-rule text-ink">
              Terms
            </Link>
            <Link href="/safety" className="link-rule text-ink">
              Safety
            </Link>
            <Link href="/methodology" className="link-rule text-ink">
              Methodology
            </Link>
            <Link href="/shop" className="link-rule text-ink">
              The range
            </Link>
          </nav>
        </div>
        <div className="container-x pb-6">
          <p className="label-mono">
            © {new Date().getFullYear()} {BRAND.legalName} · {BRAND.range.relationship} of {BRAND.range.name}
          </p>
        </div>
      </footer>

      <LandingStickyCta href={href} label={startLabel} note={`≈${ASSESSMENT_MINUTES} min`} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** One figure in the proof strip. Two columns on small screens (hairline between and under), four in a row from lg. */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="py-6 odd:pr-5 even:border-l even:border-line even:pl-5 [&:nth-child(n+3)]:border-t [&:nth-child(n+3)]:border-line lg:py-8 lg:odd:pr-6 lg:even:pl-6 lg:[&:nth-child(n+3)]:border-t-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-line lg:[&:not(:first-child)]:pl-6 lg:[&:not(:last-child)]:pr-6">
      <dd className="font-display text-[2.5rem] uppercase leading-none tnum text-ink sm:text-[3rem]">{value}</dd>
      <dt className="label-mono mt-2 break-words">{label}</dt>
    </div>
  );
}

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Where the Checkup usually lands for this symptom — the pen(s), photographed, with the evidence note. */
function SymptomPens({ symptom, goal, pens, href }: { symptom: SymptomDef; goal: GoalDef; pens: Product[]; href: string }) {
  const goalLower = goal.label.toLowerCase();
  const honest = "Your answers decide — including whether to buy at all.";

  if (pens.length === 0) {
    return (
      <section className="rule-b">
        <div className="container-x py-12 lg:py-16">
          <IndexHead index="03" label={`Where the ${CHECKUP_SHORT} lands`} title={`Nothing in the range is researched for ${goalLower}.`} description={`${symptom.penNote} ${honest}`} />
          <div className="mt-8 flex flex-col gap-4 border border-ink p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="max-w-xl text-[14px] leading-relaxed text-ink-3">
              Take the {CHECKUP_SHORT} anyway. The report still maps your history and medicines against the evidence, lists the licensed options a clinician
              is likely to raise, and gives you the questions to take to that appointment.
            </p>
            <LandingCta href={href} size="lg" variant="primary" className="shrink-0">
              Start the {CHECKUP_SHORT}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </LandingCta>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rule-b">
      <div className="container-x py-12 lg:py-16">
        <IndexHead
          index="03"
          label={`Where the ${CHECKUP_SHORT} usually lands`}
          title={pens.length === 1 ? `One pen is researched for ${goalLower}.` : `${capitalise(numberWord(pens.length))} pens are researched for ${goalLower}.`}
          description={`${symptom.penNote} ${honest}`}
        />
        <ul className={`cell-grid mt-8 grid-cols-1 sm:grid-cols-2 ${pens.length >= 3 ? "lg:grid-cols-4" : pens.length === 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`} aria-label="Pens named for this goal">
          {pens.map((p) => (
            <li key={p.id} className="flex">
              <PenCell product={p} bestFor />
            </li>
          ))}
          <li className="flex flex-col justify-between bg-white p-5">
            <div>
              <p className="label-mono text-ink">Not the only outcome</p>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-3">
                The {CHECKUP_SHORT} names {pens.length === 1 ? "this pen" : "one of these"} only when your answers allow it. A flag in your history, a tested-sport
                answer or a timeframe the trials never measured can all end at a no — with the reasons and a clinician link.
              </p>
            </div>
            <div className="mt-6">
              <LandingCta href={href} size="lg" variant="primary">
                Start the {CHECKUP_SHORT}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </LandingCta>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

/** The range the generic page chooses from: bestsellers first, then the rest, then "+N more". */
function RangeStrip() {
  const rest = Math.max(0, PRODUCTS.length - STRIP.length);
  return (
    <section className="rule-b">
      <div className="container-x py-12 lg:py-16">
        <IndexHead
          index="03"
          label="The range it chooses from"
          title={`${PRODUCTS.length} pre-filled pens. One is scored highest for you — if any is.`}
          description={`Single compounds and blends across weight, recovery, skin, energy, sleep and more — every one a pre-filled ${BRAND.range.name} pen with a published certificate for its lot. The ${CHECKUP_SHORT} scores all of them; it never picks from a shortlist.`}
          action={{ href: "/shop", label: "See the whole range" }}
        />
        <ul className="cell-grid mt-8 grid-cols-4 lg:grid-cols-8" aria-label={`The range: ${PRODUCTS.length} pens`}>
          {STRIP.map((p) => (
            <li key={p.id} className="flex flex-col p-2.5 sm:p-3">
              <ProductImage product={p} prefer="pack" frame="square" sizes="(min-width: 1024px) 12vw, 25vw" className="w-full" />
              <span className="mt-2 flex items-start gap-1.5">
                <ProductSwatch product={p} className="mt-[0.2rem]" />
                <span className="min-w-0 break-words font-mono text-[9.5px] uppercase leading-snug tracking-[0.06em] text-ink sm:text-[10.5px]">{p.name}</span>
              </span>
            </li>
          ))}
          {rest > 0 && (
            <li className="flex">
              <Link href="/shop/" className="hover-invert flex w-full flex-col items-start justify-between p-2.5 sm:p-3" aria-label={`${rest} more pens in the range`}>
                <span className="font-display text-[1.5rem] uppercase leading-none tnum sm:text-[2rem]">+{rest}</span>
                <span className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.06em] sm:text-[10.5px]">
                  more
                  <ArrowRight className="ml-1 inline h-3 w-3 align-[-0.1em]" aria-hidden />
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
