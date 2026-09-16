# AERVYN — Build Brief v3 (client range + product-matching quiz)

Read this before touching code. It is the single shared contract for every contributor.

## 0. v3 — what changed (read first)

**The client is AERVYN · Performance Science.** The store is their brand; the assessment keeps its product name **"Peptide Checkup"** (`BRAND.assessmentName`). Never hard-code either — use `BRAND.name` ("AERVYN"), `BRAND.displayName` ("Aervyn"), `BRAND.descriptor` ("Performance Science"), `BRAND.assessmentName`. The wordmark is AERV + helix glyph + N (`Logo`/`Wordmark`/`HelixGlyph`/`LogoMark` in `src/components/ui/logo.tsx`).

**The range is exactly six pre-filled 3 mL dose-dial peptide pens** (`src/data/products/catalog.ts`, all `channel: "research"`, real photos in `/public/products`, per-product packaging colour in `visual.color`):

| Product | Contents | Colour | For |
| --- | --- | --- | --- |
| Tesamorelin | 20 mg / 3 mL | red `#c8202f` | abdominal/visceral fat, body composition (strongest human evidence in range) |
| MOTS-C | 60 mg / 3 mL | sky blue `#1fa0d8` | metabolic energy, endurance, healthy ageing (early evidence; WADA-listed) |
| GHK-Cu | 100 mg / 3 mL | orange `#d97a2e` | skin, hair, surface repair |
| NAD+ | 500 mg / 3 mL | royal blue `#1f3fbf` | tiredness, recovery, healthy ageing (a coenzyme, not a peptide) |
| Wolverine | BPC-157 + TB-500, 40 mg / 3 mL | green `#2e8b6e` | tendon/ligament/muscle injury, repair |
| Klow | GHK-Cu + BPC-157 + TB-500 + KPV, 80 mg / 3 mL | teal `#1d8fbf` | skin + repair with inflammation |

Blends carry `blend: string[]` (compound slugs); single-compound pens carry `compoundSlug`. Two compounds were added to the evidence database for this: `nad` and `kpv`. **Everything on the site is specific to these six** — no other products, no supplies, no kits, no consultation products, no vial illustrations where a photo exists.

**Photos, not illustrations.** Use `ProductImage` (`src/components/commerce/product-image.tsx`; `prefer: "pack" | "hand"`, `frame: "square" | "portrait" | "fill"`) everywhere a product is shown. `ProductVisual` is now only the fallback inside `ProductImage`. Photos are 4:5 on pure white — place them on white or `bg-paper-2`, never crop the pen, keep the whole range at one scale. `ProductSwatch` renders the packaging colour.

**The quiz must end at a product.** Every question and answer feeds a deterministic matcher (`src/lib/match/engine.ts` → `MatchResult`, types in `src/lib/match/types.ts`, stored as `lastMatch` in the assessment store). The result routes the user to `/shop/{slug}/?match=1`, where `MatchPanel` (`src/components/commerce/match-panel.tsx`) explains **why it is the right fit** (goal + focus + evidence + format), what to review, and adds to cart — unless the rules engine raised a high flag / Higher concern, in which case the verdict is `not_recommended`, nothing is added, and the panel says so and links to a clinician. Transparency is the brand: show the evidence grade for the goal on the result, say when evidence is early, and never claim an outcome.

**Pricing is placeholder** (pending the client's list) — keep prices from the catalogue, do not invent new products.

## 1. What we are building (v2)

**An e-commerce store for batch-tested peptides, fed by an ad → assessment → report lead funnel.**

- Paid ads ("Feeling tired all the time? Take the 7-minute Peptide Checkup") → symptom landing page `/start/[symptom]` → assessment `/assessment` → rules-engine report `/report` → **product matches** ("Your matches") → cart → checkout → order confirmation.
- The store is the destination: `/shop`, `/shop/[slug]`, cart drawer, `/checkout`, `/order?id=`, `/account/orders`, `/lab-testing`, `/shipping`.
- The evidence layer stays and is a differentiator: `/peptides`, `/peptides/[slug]`, `/compare`, `/methodology`. **Brand promise: the only peptide store whose assessment tells you when *not* to buy.** A "Higher concern" compound is never added to the cart from a report; it links to "speak to a clinician" instead.
- Static export, no backend. Cart, orders and assessment live in the browser (zustand + localStorage). Payments use a provider abstraction (`mock` for the demo; Stripe when keys are set). Leads/orders POST to webhooks when configured.

### Sale channels (legal model — configurable per product, `src/data/products/types.ts`)
- `research` — unlicensed compounds (BPC-157, TB-500, CJC-1295, ipamorelin, GHK-Cu injectable, MOTS-c, epitalon, selank, semax, DSIP, kisspeptin, LL-37, AOD-9604, cagrilintide/retatrutide/survodutide as research reference standards) sold **"for research use only"** with 18+ and intended-use acknowledgement at checkout. Label text: `RESEARCH_USE_LABEL` in `src/lib/brand.ts`.
- `prescription` — authorised prescription-only medicines (semaglutide, tirzepatide, liraglutide, tesamorelin, somatropin, PT-141, elamipretide, thymosin alpha-1). **Never sold directly.** Availability `consultation` → "Start consultation" lead form (partner prescriber). Label: `RX_LABEL` in `catalog.ts`.
- `supplement` (collagen peptides), `cosmetic` (GHK-Cu serum), `supplies` (bacteriostatic water, syringes, swabs, sharps bin, storage).
- `not_sold` — we list but decline to sell: melanotan II, IGF-1 LR3 (regulator warnings / hypoglycaemia risk). Product page explains why and links to the evidence page.

## 2. Brand & voice

- Name **PeptideCheckup** (prose "Peptide Checkup"), from `src/lib/brand.ts`. Tagline: *Batch-tested peptides. Matched to you.*
- Voice: direct, technical, dry. Short sentences. Facts over adjectives. UK English. No exclamation marks, no emojis, no "unlock your potential". Never a health claim for research products ("researched for", "studied in", never "helps you heal").
- Compliance language for the assessment/report is unchanged: suitability labels **Potentially relevant / Higher concern / Insufficient information**; regulatory status only from the database; dosing = research information, not a recommendation; `DISCLAIMER_SHORT` / `DISCLAIMER_REPORT`.
- Commerce honesty: no fake reviews, star ratings, countdown timers, "17 people are viewing", fake press logos. Trust = certificates of analysis, batch numbers, lab names, shipping facts, and the assessment saying no.

## 3. Design system v2 — "Lab Grotesk" (tokens in `src/app/globals.css`)

The previous look (warm paper, serif display, teal, rounded cards, soft shadows, mono eyebrows with gradient blobs) is **retired**. Do not reintroduce it.

**Principles:** flat, technical, high-contrast, typographic. Think lab spec sheet × fashion-forward DTC. One signal colour. Hard rules instead of shadows. Square corners. Big expanded grotesk headlines. Data set in monospace. Colour inversion as the hover state.

- **Colour:** white `bg-white`, warm grey panels `bg-paper-2` (#f4f3f0) / `bg-paper-3`, ink `text-ink` (#0b0b0c) and dark sections `bg-ink text-white`. Signal: cobalt `brand-600` (#1d3bff) — used for the active state, the CTA hover, "Strong" evidence, "Potentially relevant". Alert: orange `accent-500` (#ff4a1c) — "Higher concern", warnings only. Caution amber `caution`. Never teal, never green, never gradients.
- **Type:** Archivo everywhere. Headlines `font-display` (expanded 112%, weight 800, tight tracking, line-height 0.98) — often uppercase for short headlines. Body 15px/1.5. Labels/data: `label-mono` (IBM Plex Mono 11px uppercase tracking 0.12em) — this replaces the old "eyebrow". Prices and numbers: `font-mono tnum`.
- **Shape:** radius 0 everywhere (`rounded-none`; the theme's radius tokens are 0 so `rounded-2xl` is now square — but write `rounded-none` explicitly). Structural borders `border-ink` (1px). Soft dividers `border-line`. No `shadow-*`.
- **Layout patterns:** `cell-grid` (bordered cells sharing 1px lines, spec-sheet style), `SpecRow` label/value rows, full-bleed `rule-t/rule-b` section separators, sticky side rails, dense product grids (4-up desktop / 2-up mobile) with the `ProductVisual` illustration, ticker (`.ticker`) for trust facts, big uppercase index headlines with a mono label on the left.
- **Interaction:** `hover-invert` (ink fill, white text) on cards/rows; `link-rule` for text links; buttons from `Button` (rectangular, uppercase mono-ish label, hover cobalt/invert). Motion is fast and rare: 150–250 ms, opacity/translate ≤ 8px, no floating, no parallax, no per-section fade-up choreography. `motion/react` only for drawers, dialogs, list reordering, and the wizard step transition.
- **Imagery:** `ProductVisual` (`src/components/commerce/product-visual.tsx`) is the only product image. No stock photos, no 3D renders, no illustrations of people. Charts/meters use black squares (`EvidenceMeter` ■■■□□).
- **Components (use these):** `Button`, `Badge`/`EvidenceBadge`/`EvidenceMeter`/`RegulatoryBadge`/`SuitabilityBadge`/`FlagBadge` (`src/components/ui/badge.tsx`), `Card`/`Eyebrow`/`SectionHeading`/`Divider`/`SpecRow` (`src/components/ui/card.tsx`), `Logo`/`LogoMark`/`Wordmark`, `Nav`, `Footer`, `NewsletterForm`, `CartButton`, `ProductVisual`. Radix via `radix-ui`; `cmdk`; `sonner` toasts (styled dark).
- **Accessibility / mobile:** unchanged requirements — keyboard reachable, visible focus (cobalt outline), 44px targets, 390px-first, no horizontal overflow.

## 4. Routing & hosting

Static export, `trailingSlash: true`, `generateStaticParams` for dynamic routes, `useSearchParams` only inside `<Suspense>`, no server actions/API routes. `next/link` handles `basePath`; raw asset paths through `asset()`. `(site)` group has Nav + Footer + CartDrawer; `(flow)` is chrome-less (assessment wizard). The report lives in `(flow)` with its own header.

## 5. Contracts

- Compounds/evidence: `src/data/types.ts`, `src/data/compounds/index.ts` (28 compounds — do not edit records unless fixing an error).
- **Products:** `src/data/products/types.ts` (`Product`, `ProductVariant`, `SaleChannel`, `Availability`), `src/data/products/catalog.ts` (the catalogue; three reference records), `src/data/products/index.ts` (`PRODUCTS`, `getProduct`, `getProductBySlug`, `getVariant`, `getVariantProduct`, `defaultVariant`, `getProductsForCompound`, `productsByCategory`, `productsForGoal`, `purchasable`, `priceRange`, `searchProducts`).
- **Cart:** `src/lib/commerce/cart-store.ts` (`useCartStore` with `lines`, `open`, `promoCode`, `hydrated`, `assessmentCompleted`, `add/remove/setQty/clear/setOpen/applyPromo/removePromo`; pure `computeTotals(lines, { promoCode, shippingOptionId, countryCode })`, `cartHasResearchItems`). Prices are always re-read from the catalogue.
- **Config & money:** `src/lib/commerce/config.ts` (`COMMERCE`: currency, VAT, shipping options, promo codes, ship-to list, acknowledgements, payment provider, webhooks, trust facts), `src/lib/commerce/money.ts` (`formatMoney`, `formatFrom`, `percentOff`, `vatIncluded`).
- **Leads:** `src/lib/leads.ts` `submitLead({ kind: 'report' | 'report_email' | 'newsletter' | 'consultation' | 'restock', email, … })`.
- Assessment: `src/lib/assessment/types.ts`, `store.ts`, `flow.ts`. Engine: `src/lib/engine/*` → `Report`.

## 6. Questionnaire & report specs

Unchanged from v1 (see git history of this file for the full question list): 10 sections / 45 steps with conditional logic; report sections 1–12. **v2 additions:** (a) an optional "Email me my report" lead-capture step shown on the generating screen (skippable, consent checkbox, `submitLead({ kind: 'report_email' })`); (b) report section **"Your matches"** placed after Personal suitability: for each considered compound with a linked product — `potentially_relevant` → product card with price + "Add to cart" (research/supplement/cosmetic) or "Start consultation" (prescription); `higher_concern` → "Not adding this to your cart" card explaining why + "Speak to a clinician"; `insufficient_information` → "Complete the assessment to unlock" link; plus 2–3 goal-matched products the user did not consider (from `productsForGoal`), and "Unlock 10% off — code CHECKUP10" when the assessment is complete (`useCartStore.setAssessmentCompleted(true)`).

## 7. Quality bar

`npm run build` passes with zero TS/ESLint errors; no `any`; no unused imports; no placeholder copy; every page has specific metadata; mobile-first; no v1 visual language.
