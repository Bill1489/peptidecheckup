# PeptideCheckup

**Batch-tested peptides. Matched to you.**

An e-commerce store for batch-tested peptides, fed by an evidence-led assessment funnel. Users arrive from paid ads ("Feeling tired all the time? Take the 7-minute Peptide Checkup"), complete a structured 10-section questionnaire, and receive a report that maps their goal, medical history and medicines against a maintained database of compound evidence, regulatory status (UK / US / EU / AU / CA) and published dosing research — then shows product matches, or tells them not to buy.

Live demo: **https://bill1489.github.io/peptidecheckup/**

## What's inside

| Surface | Route | Notes |
| --- | --- | --- |
| Store home | `/` | Featured products, shop by goal, bestsellers, lab testing, FAQ |
| Shop | `/shop`, `/shop/[slug]` | Catalogue with filters; product pages with variants, CoA, spec sheet, evidence record |
| Cart & checkout | drawer, `/checkout`, `/order?id=`, `/account/orders` | Client-side cart (localStorage), mock/Stripe payment abstraction, orders posted to a webhook |
| Lab testing | `/lab-testing` | How batches are tested; CoA table |
| Shipping | `/shipping` | Shipping & returns policy generated from config |
| Ad landing pages | `/start/[symptom]` | `tired`, `weight`, `fat-loss`, `muscle`, `performance`, `recovery`, `skin`, `hair`, `libido`, `sleep`, `longevity` — pre-select the goal and pass UTM context |
| Assessment | `/assessment` → `/assessment/start` | 10 sections, ~45 questions with conditional logic, save/resume (localStorage), 18+ gate, pregnancy handling |
| Report | `/report` | Deterministic rules-engine output: evidence, regulatory status, suitability labels, 3-layer dosing, stack intelligence, "not without professional review", clinician questions, monitoring, source assessment, print/PDF |
| Directory | `/peptides` | 28 compounds, filters by goal / family / evidence / regulatory status / WADA |
| Detail | `/peptides/[slug]` | Evidence by goal, regulatory tabs, dosing research, safety, interactions, combinations, references |
| Compare | `/compare?c=a,b,c` | Side-by-side table + combination intelligence |
| Trust | `/methodology`, `/safety`, `/about`, `/faq`, `/privacy`, `/terms`, `/how-it-works` | |

## Architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind v4**, fully static export (`output: "export"`). No backend: the assessment state lives in the browser (zustand + localStorage) and the report is produced by a deterministic rules engine in `src/lib/engine`.
- **Compound database** — `src/data/compounds/*.ts`, one file per compound, typed by `src/data/types.ts`. Every label in the report is derived from these structured fields (evidence grades, regulatory entries with `lastReviewed`, contraindications by condition id, interactions by medication class, study exposures for dose comparison, stack notes).
- **Questionnaire contract** — `src/lib/assessment/types.ts` (`AssessmentAnswers`) is what the wizard writes and the engine reads.
- **Report contract** — `src/lib/engine/types.ts` (`Report`) is what the engine emits and the report UI renders.
- **Commerce** — products in `src/data/products/catalog.ts` (typed by `types.ts`), cart in `src/lib/commerce/cart-store.ts`, store config (currency, VAT, shipping, promo codes, payment provider, webhooks) in `src/lib/commerce/config.ts`, orders/payments in `src/lib/commerce/orders.ts` and `payments.ts`. Sale channels per product: `research` (research-use labelling + 18+/intended-use acknowledgement), `prescription` (consultation-gated, never sold directly), `supplement`, `cosmetic`, `supplies`, or `not_sold`.
- **Brand** — a single constant in `src/lib/brand.ts`; the logo lives in `src/components/ui/logo.tsx` and `src/app/icon.svg`.

See `docs/BRIEF.md` for the full build brief, design system and questionnaire/report spec.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → ./out
npm run lint
```

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the static export with the correct `basePath` and publishes to GitHub Pages. The same `out/` folder can be dropped onto Netlify, Vercel, Cloudflare Pages or any static host — set `NEXT_PUBLIC_BASE_PATH` to `""` for a root domain (e.g. `peptidecheckup.com`).

## Integration points (before public launch)

- **Payments** — `src/lib/commerce/payments.ts`. Default provider `mock` completes demo orders locally. Set `NEXT_PUBLIC_PAYMENT_PROVIDER=stripe` plus keys and add a server-side Checkout Session (or Payment Links) to take real payments.
- **Orders** — every placed order is POSTed as JSON to `NEXT_PUBLIC_ORDER_WEBHOOK` (Zapier/Make/your API → fulfilment, receipts).
- **Leads** — newsletter, report-by-email, consultation requests and clinician-review requests POST to `NEXT_PUBLIC_LEAD_WEBHOOK`. Without it, requests resolve locally.
- **Legal model** — confirm the sale channel per product (`research` vs `prescription` vs `not_sold`) with a regulatory adviser before launch; the store is configured to sell unlicensed compounds only under research-use labelling and to route licensed medicines through a partner prescriber.
- **Analytics** — none installed by default (privacy page states this). Add your tag in `src/app/layout.tsx`.
- **Clinical review** — the compound records, regulatory entries and rules in `src/lib/engine/rules/*` are written to be reviewed line-by-line by a clinician/pharmacist. Each regulatory entry carries a `lastReviewed` date.

## Disclaimer

PeptideCheckup provides educational information and a structured summary of published research and regulatory status. It is not medical advice and does not replace consultation with a qualified healthcare professional.
