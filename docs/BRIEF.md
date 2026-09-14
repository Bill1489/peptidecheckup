# PeptideCheckup — Build Brief

Read this before touching code. It is the single shared contract for every contributor (human or agent).

## 1. What we are building

An evidence-led **peptide comparison + personalised health assessment** website.

Funnel: paid ads ("Feeling tired all the time? Take the 7-minute Peptide Checkup") → symptom landing page (`/start/[symptom]`) → assessment (`/assessment`) with the goal pre-selected → deterministic rules engine → **personal report** (`/report`) → CTAs (clinician review request, compare tool, print/save).

Secondary surfaces: peptide directory (`/peptides`), detail pages (`/peptides/[slug]`), side-by-side compare (`/compare`), trust pages (methodology, safety, about, FAQ, privacy, terms).

Everything is a **static export** (Next.js `output: "export"`) and runs client-side. There is no backend. The "AI" is a deterministic, clinician-reviewable rules engine reading a maintained database — this is a feature, not a limitation, and the copy should say so.

## 2. Brand

- Name: **PeptideCheckup** (prose: "Peptide Checkup"). Import from `src/lib/brand.ts` — never hard-code.
- Tagline: *Compare peptides. Check your fit.*
- Voice: calm, precise, evidence-first, human. Think Function Health × a good pharmacist. No hype, no fear-mongering, no emojis in UI, no exclamation marks in body copy.
- Compliance language (mandatory):
  - Never tell the user to take anything. Never "you should take X" / "X will fix Y".
  - Use: "researched for", "studied in", "authorised for", "your responses identified factors that…", "discuss with a qualified healthcare professional".
  - Report suitability labels are exactly: **Potentially relevant**, **Higher concern**, **Insufficient information** (see `src/lib/engine/types.ts`).
  - Regulatory status always comes from the database (`compound.regulatory[jurisdiction]`), never inferred.
  - Dosing information is labelled **research information, not a recommendation**.
  - The site provides "educational information", it is "not medical advice". Use `DISCLAIMER_SHORT` / `DISCLAIMER_REPORT` from `src/lib/brand.ts`.

## 3. Design system (Tailwind v4 tokens in `src/app/globals.css`)

**Aesthetic:** premium clinical editorial. Warm off-white paper, deep ink navy, evergreen teal brand, citrine accent used sparingly. Serif display headings (Fraunces) + Inter body + JetBrains Mono for eyebrows/labels/data.

Tokens → utilities:
- Surfaces: `bg-paper`, `bg-paper-2`, `bg-paper-3`, `bg-white`, dark sections `bg-ink`
- Text: `text-ink`, `text-ink-2`, `text-ink-3`, `text-muted`, `text-muted-2`
- Brand: `bg-brand-50…950`, `text-brand-600` etc. Accent: `accent-100…700`
- Semantic: `evidence-strong|moderate|limited|preliminary|insufficient`, `relevant`, `concern`, `caution`, `unknown`, `info` (+ `-soft` variants)
- Borders: `border-line`, `border-line-strong`, `border-line-dark`
- Shadows: `shadow-soft`, `shadow-card`, `shadow-lift`, `shadow-glow`
- Fonts: `font-display`, `font-sans`, `font-mono`
- Utilities: `container-x` (max-w-7xl), `container-narrow` (3xl), `container-prose` (2xl), `bg-grain`, `bg-dots`, `bg-dots-dark`, `glass`, `glass-dark`, `skeleton`, `text-gradient-brand`, `text-balance`, `text-pretty`, `no-scrollbar`, `hairline`
- Animations: `animate-fade-up`, `animate-fade-in`, `animate-shimmer`, `animate-float`, `animate-pulse-soft`, `animate-marquee`
- Easing: `ease-out-expo`

**Typography rhythm:** eyebrow (mono, uppercase, tracking-[0.18em], brand-700) → display heading (`font-display`, normal weight, tracking-tight, leading-[1.08]) → muted description. H1 on marketing: `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl`. Body `text-base/relaxed`. Never use bold serif.

**Shape:** cards `rounded-2xl border border-line bg-white shadow-soft`; buttons are pills (`rounded-full`); inputs `rounded-xl h-12`. Generous whitespace (`py-20 lg:py-28` sections).

**Motion:** `motion/react` (Framer Motion v12). Fade-up on scroll (`whileInView`, once), staggered lists, subtle hover lifts, layout animations in the wizard. Respect `prefers-reduced-motion` (CSS handles it globally; use `useReducedMotion` for heavy effects).

**Icons:** `lucide-react` only.

**Shared components (use, don't duplicate):**
- `src/components/ui/button.tsx` — `Button` (variants: primary, brand, secondary, ghost, accent, danger, link, inverted; sizes sm…xl; `href` renders a Link)
- `src/components/ui/badge.tsx` — `Badge`, `EvidenceBadge`, `EvidenceMeter`, `RegulatoryBadge`, `SuitabilityBadge`, `FlagBadge`
- `src/components/ui/card.tsx` — `Card`, `Eyebrow`, `SectionHeading`, `Divider`
- `src/components/ui/logo.tsx` — `Logo`, `LogoMark`, `Wordmark`
- `src/components/site/nav.tsx`, `footer.tsx` (already wired in `src/app/(site)/layout.tsx`)
- Toasts: `import { toast } from "sonner"`
- Radix primitives: `import { Dialog, Tooltip, Popover, Tabs, Accordion, Slider, Checkbox, RadioGroup } from "radix-ui"` (unified package)
- Command palette / searchable lists: `cmdk`
- State: `zustand` (+ `persist` middleware, localStorage)
- Class merge: `cn()` from `src/lib/utils.ts`

**Accessibility:** every interactive element keyboard-reachable, visible focus (global `:focus-visible` style), labelled inputs, `aria-live` for wizard step changes, colour is never the only signal (badges have text).

**Mobile first:** ads drive mobile traffic. Design at 390px first, then scale. Tap targets ≥ 44px. Sticky bottom action bar in the wizard on mobile.

## 4. Routing & hosting constraints

- Static export with `trailingSlash: true`. Dynamic routes MUST implement `generateStaticParams`. No server actions, no API routes, no `headers()`/`cookies()`.
- Sub-path hosting: `next/link` and `next/image` handle `basePath` automatically. For raw `<img src>` or CSS URLs use `asset()` from `src/lib/utils.ts`.
- Client-only state (localStorage) must be read inside `useEffect`/zustand `persist` with hydration guards — pages must render without it.
- `useSearchParams()` must be wrapped in `<Suspense>`.
- Route groups: `src/app/(site)/*` has Nav+Footer. `src/app/(flow)/*` is chrome-less (assessment wizard, report get their own minimal headers).

## 5. Data contracts (do not change without coordinating)

- `src/data/types.ts` — `Compound`, `GoalId`, `EvidenceQuality`, `Jurisdiction`, `RegulatoryEntry`, `ConditionId`, `MedicationClassId`, `DosingStudy`, `StudyExposure`, `StackNote` + label maps.
- `src/data/goals.ts`, `conditions.ts`, `medications.ts`, `countries.ts`
- `src/data/compounds/index.ts` — registry & helpers (`COMPOUNDS`, `getCompound`, `compoundsForGoal`, `searchCompounds`, `getStackNote`). Individual compound files live alongside; `semaglutide.ts` is the **reference record** for tone, depth and structure.
- `src/lib/assessment/types.ts` — `AssessmentAnswers` (what the wizard writes), `SECTION_ORDER`, `SECTION_META`, option label maps.
- `src/lib/engine/types.ts` — `Report`, `CompoundReport`, `Flag`, `StackAnalysis`… (what the engine emits, what the report renders).

## 6. The questionnaire (spec — implement faithfully)

Sections & questions (conditional logic in brackets):

1. **Goal** — Q1 primary goal (12 options, from `GOALS`); Q2 what would success look like (free text); Q3 importance (Curious / Moderately / Very / Extremely); Q4 timeframe (No timeframe / 3–6 months / 1–3 months / < 1 month → unrealistic expectations become a flag).
2. **Considering** — Q5 compounds (searchable multi-select from `COMPOUNDS` + "Other" free text; show goal-relevant suggestions first); for each selected compound an optional "dose you're considering" (amount, unit, frequency, route); Q6 currently taking any (Y/N); Q7 considering more than one (No / Yes / Not sure) [if ≥ 2 selected]; Q8 combinations (dynamic — default is all selected together; allow the user to pick which they'd combine) [if Q7 = Yes]; Q9 why these compounds (free text) + optional chips for where the idea came from (`INFLUENCE_LABELS`).
3. **Basics** — Q10 age (reject < 18 with a respectful full-stop screen); Q11 sex; Q12 height & Q13 weight with metric/imperial toggle (compute BMI live, subtle); Q14 country (searchable, `COUNTRIES`); Q15 pregnant / trying / breastfeeding (Yes / No / N/A / Prefer not) [ask if sex ≠ male; if Yes → immediate inline safety notice].
4. **Medical history** — Q16 conditions grid: base list + extended conditions referenced by selected compounds' `contraindications`; each Current / Previous / Unsure / None (default None; one tap per row); Q17 relevant surgery (Y/N + details); Q18 current concerning symptoms (Y/N + describe).
5. **Medicines & substances** — Q19 prescriptions (Y/N → repeatable entry: searchable name via `searchMedications`, strength, frequency, reason, prescribed by clinician Y/N); Q20 OTC regular (multi: painkillers, antihistamines, acid reducers, sleep aids, other); Q21 supplements (Y/N → name, amount, frequency); Q22 recreational substances (optional, explain why we ask); Q23 alcohol (4 bands); Q24 nicotine (4 bands).
6. **Previous experience** (skippable) — Q25 used a peptide before (Y/N) → Q26 which (search), Q27 how long, Q28 adverse effects (None/Mild/Moderate/Severe/Unsure), Q29 stopped because of adverse effect, Q30 supervised; Q31 previously stopped a treatment because ineffective.
7. **Product / source** (skippable) — Q32 where obtaining (8 options); Q33 prescribed (Y/N/NA); Q34 authorised for use in your country (Y/N/Unsure); Q35 independent quality documentation (Y/N/Unsure).
8. **Risk screening** — Q36–Q42 as yes/no cards: serious allergic reaction to a medicine; known allergy to a component; previous serious reaction to similar treatment; unexplained/severe current symptoms; advised by a professional not to use this type of treatment; under investigation for a relevant condition; receiving treatment that could interact. Show compound-tailored hints (e.g. for GLP-1s mention thyroid cancer/MEN2, pancreatitis).
9. **Your report** — Q43 what would you like the report to tell you (multi, `REPORT_WANTS`); Q44 contact for professional/clinical review (separate explicit consent + email).
10. **Final** — "Is there anything else we should know?" (free text) → Generate report.

UX requirements: one focused screen per question group, big tappable option cards, auto-advance on single-select (with a short delay), keyboard (Enter/arrow keys), progress with section labels, "Skip section" on optional sections, save/resume via localStorage, "Save & exit" returns to `/assessment` with a resume card, review screen before generating, and a generating animation (≈1.5–2.5 s) before the report.

## 7. The report (spec — render faithfully from `Report`)

1. **Your objective** — goal, success statement, importance, timeframe (+ flag if unrealistic)
2. **What you are considering** — compound cards
3. **Evidence assessment** — per compound: evidence quality (Strong / Moderate / Limited / Preliminary / Insufficient) for the user's goal and overall
4. **Regulatory status** — for the user's jurisdiction: Authorised / Not authorised / Investigational / Unclear, with `lastReviewed`
5. **Personal suitability assessment** — per compound one of three labels + rationale + flags
6. **Dosing — three layers**: (a) *What the evidence says about dosing* (studies: population, duration, route, doses, outcome, adverse events — labelled research information); (b) *How this compares with what you're considering* (within/above/below study exposure, frequency differs, no human data); (c) *Personal suitability and risk* → "This requires professional review before you make a decision."
7. **Stack intelligence** [if ≥ 2 compounds] — number of compounds, evidence supporting combination, overlapping considerations, evidence gaps, overall uncertainty, summary sentence
8. **What we would not recommend proceeding with without professional review** — compounds flagged + reasons ("Flagged because of the medical information you provided", not "don't take X")
9. **Other options researched for your goal**, **Potential alternatives**, **Questions to ask a clinician**, **Monitoring considerations**, **Product / source considerations**, **Completeness** (what's missing; link back to skipped sections), **Your responses** appendix, disclaimer, print/save, request clinician review CTA.

## 8. Quality bar

- `npm run build` must pass with zero TypeScript errors and zero ESLint errors.
- No `any`. No unused imports.
- No placeholder text ("lorem", "TODO") left in UI. No fake testimonials, fake press logos, fake statistics. Use real trial numbers from the database instead.
- Every page: `export const metadata` (or `generateMetadata`) with a specific title + description.
- Images: use inline SVG / CSS illustration rather than stock photos.
