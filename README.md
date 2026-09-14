# PeptideCheckup

**Compare peptides. Check your fit.**

An evidence-led peptide comparison website with a personalised health assessment. Users arrive from paid ads ("Feeling tired all the time? Take the 7-minute Peptide Checkup"), complete a structured 10-section questionnaire, and receive a report that maps their goal, medical history and medicines against a maintained database of compound evidence, regulatory status (UK / US / EU / AU / CA) and published dosing research — so they know exactly what to discuss with a clinician.

Live demo: **https://bill1489.github.io/peptidecheckup/**

## What's inside

| Surface | Route | Notes |
| --- | --- | --- |
| Home | `/` | Hero, how it works, goal grid, evidence grading, FAQ |
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

- **Clinician-review leads** — `src/lib/leads.ts` posts to `NEXT_PUBLIC_LEAD_WEBHOOK` when set (Formspree, Zapier, HubSpot, your CRM). Without it, requests resolve locally.
- **Analytics** — none installed by default (privacy page states this). Add your tag in `src/app/layout.tsx`.
- **Clinical review** — the compound records, regulatory entries and rules in `src/lib/engine/rules/*` are written to be reviewed line-by-line by a clinician/pharmacist. Each regulatory entry carries a `lastReviewed` date.

## Disclaimer

PeptideCheckup provides educational information and a structured summary of published research and regulatory status. It is not medical advice and does not replace consultation with a qualified healthcare professional.
