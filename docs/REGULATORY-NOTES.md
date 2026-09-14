# Regulatory notes — US compounding status of research peptides (as of 14 Sep 2026)

Source material for the `regulatory.US.detail` fields in the compound database. Keep this file and the database in sync; each database entry carries a `lastReviewed` date.

## Background

Under FD&C Act §503A, a bulk drug substance may be used in patient-specific compounding only if it has a USP/NF monograph, is a component of an FDA-approved drug, or appears on the 503A Bulks List. FDA's *interim* policy sorts nominated substances into:

- **Category 1** — under evaluation, no significant safety risk identified; FDA exercises enforcement discretion (compounding tolerated).
- **Category 2** — significant safety risks identified; compounding not permitted.
- **Category 3** — nominated without adequate support.

None of these categories is an approval. No peptide below is an FDA-approved medicine unless stated.

## Timeline

| Date | Action |
| --- | --- |
| 29 Sep 2023 | FDA adds to **Category 2**: AOD-9604, BPC-157, LL-37, CJC-1295, dihexa, DSIP (emideltide), epitalon, GHK-Cu (injectable routes only), ibutamoren, ipamorelin, kisspeptin-10, KPV, melanotan II, PEG-MGF, MOTS-c, selank, semax, thymosin alpha-1, thymosin beta-4 fragment (TB-500). Non-injectable GHK-Cu placed in Category 1. |
| 20–27 Sep 2024 | AOD-9604, CJC-1295, ipamorelin, thymosin alpha-1 and selank **removed from Category 2** because nominators withdrew nominations (removal ≠ authorisation). |
| 29 Oct 2024 | PCAC votes **against** adding ibutamoren (1–13), ipamorelin free base/acetate (0–12) and kisspeptin-10 (0–11) to the 503A Bulks List. |
| 4 Dec 2024 | PCAC votes **against** adding CJC-1295 (all forms; acetate 1–12, others unanimous), AOD-9604 (unanimous) and thymosin alpha-1 (4–17). |
| 15–22 Apr 2026 | FDA removes 12 peptides from Category 2 (nominations withdrawn) — including BPC-157, TB-500, MOTS-c, epitalon, semax, DSIP, KPV, GHK-Cu (injectable), LL-37, dihexa, PEG-MGF, melanotan II — and GHK-Cu from Category 1. Announces PCAC meetings for 23–24 Jul 2026 and before end Feb 2027. |
| 23–24 Jul 2026 | PCAC **recommends adding** BPC-157 (8–6–1), KPV (8–6–1), TB-500 (8–6–1), MOTS-c (7–5–2), epitalon (7–4–1) and semax (8–5–1) to the 503A Bulks List, against FDA staff advice. PCAC votes **against** DSIP/emideltide (6–7–1). Advisory only — FDA notice-and-comment rulemaking is required before any substance is formally listed; legal status unchanged as of this note. |
| Before end Feb 2027 | PCAC scheduled to consider GHK-Cu, dihexa, LL-37, PEG-MGF and melanotan II. |

## Standard wording used in the database (US)

- **Recommended by PCAC July 2026 (BPC-157, TB-500, MOTS-c, epitalon, semax):** "Not FDA-approved. Placed in Category 2 of the interim 503A bulks list in Sept 2023 (significant safety risks); removed in April 2026 after the nomination was withdrawn. In July 2026 the Pharmacy Compounding Advisory Committee narrowly recommended adding it to the 503A Bulks List against FDA staff advice — an advisory vote; FDA rulemaking is pending and it remains unapproved."
- **Rejected by PCAC (DSIP):** "...In July 2026 the advisory committee voted against adding it to the 503A Bulks List."
- **Pending PCAC review (GHK-Cu injectable, LL-37, melanotan II):** "...removed from Category 2 in April 2026; advisory-committee review scheduled before the end of February 2027. Remains unapproved."
- **Rejected by PCAC late 2024 (CJC-1295, ipamorelin, AOD-9604, thymosin alpha-1, kisspeptin-10):** "Not FDA-approved. Placed in Category 2 of the interim 503A bulks list in Sept 2023; the Pharmacy Compounding Advisory Committee voted against adding it to the 503A Bulks List in late 2024. Not eligible for compounding."
- **Selank:** "Not FDA-approved. Category 2 (Sept 2023); removed Sept 2024 after nomination withdrawal; no advisory-committee recommendation to list. Remains unapproved."

## Sources

- FDA, *Certain Bulk Drug Substances for Use in Compounding that May Present Significant Safety Risks* — https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks
- FDA PCAC meeting materials, 29 Oct 2024 and 4 Dec 2024 — https://www.fda.gov/media/183155/download, https://www.fda.gov/media/185642/download
- FACA database, PCAC FY2026 report (vote tallies)
- Orrick, *FDA Announces Removal of 12 Peptides from Category 2* (16 Apr 2026)
- McDermott, *PCAC backs majority of peptides in two-day public meeting* (Jul 2026); Bass Berry & Sims, *FDA Advisory Committee Recommends Six Peptides for Compounding* (Jul 2026)
