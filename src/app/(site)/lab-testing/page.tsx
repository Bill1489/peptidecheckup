import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecRow } from "@/components/ui/card";
import { productPath, productsWithCoa } from "@/components/commerce/product-utils";
import { JsonLd } from "@/components/marketing/json-ld";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { formatDate } from "@/lib/utils";

const certified = productsWithCoa();
const labs = Array.from(new Set(certified.map((p) => p.coa!.lab))).sort();
const peptideCerts = certified.filter((p) => p.category === "peptide");
const purities = peptideCerts.map((p) => Number.parseFloat(p.coa!.purity)).filter((n) => Number.isFinite(n));
const meanPurity = purities.length ? (purities.reduce((a, b) => a + b, 0) / purities.length).toFixed(1) : "—";
const minPurity = purities.length ? Math.min(...purities).toFixed(1) : "—";
const latest = certified[0]?.coa?.testedOn;

export const metadata: Metadata = {
  title: `Lab testing — ${certified.length} published certificates of analysis`,
  description: `How every batch is tested (HPLC purity, LC-MS identity, LAL endotoxin), which independent laboratories we use, how to read a certificate of analysis and batch number, and the full list of ${certified.length} current certificates. Mean peptide purity ${meanPurity}%.`,
  alternates: { canonical: "/lab-testing/" },
  openGraph: {
    images: OG_IMAGES,
    title: "Lab testing & certificates of analysis",
    description: `Every lot tested by an independent laboratory before it ships. ${certified.length} certificates published; mean purity ${meanPurity}% (HPLC).`,
    url: "/lab-testing/",
    siteName: BRAND.displayName,
  },
};

const STATS: { label: string; value: string }[] = [
  { label: "Certificates published", value: String(certified.length) },
  { label: "Independent labs", value: String(labs.length) },
  { label: "Mean peptide purity", value: `${meanPurity}%` },
  { label: "Lowest accepted lot", value: `${minPurity}%` },
];

const TESTS: { code: string; title: string; what: string; rows: { label: string; value: string }[] }[] = [
  {
    code: "01",
    title: "Purity · HPLC",
    what: "Reverse-phase high-performance liquid chromatography separates the target peptide from truncated, deletion and oxidised by-products and reports the target as a percentage of total peak area at 214–220 nm.",
    rows: [
      { label: "Reports", value: "Target peak area %" },
      { label: "Release limit", value: "≥ 98.5% peptides · ≥ 99% where stated on the product" },
      { label: "Catches", value: "Truncations, deletions, oxidation, dimerisation" },
      { label: "Does not catch", value: "Identity — a pure vial of the wrong peptide still scores high" },
    ],
  },
  {
    code: "02",
    title: "Identity · LC-MS",
    what: "Liquid chromatography–mass spectrometry measures the molecular mass of the main peak and compares it with the theoretical mass of the labelled sequence. A match within instrument tolerance confirms the vial contains what the label says.",
    rows: [
      { label: "Reports", value: "Observed vs theoretical mass" },
      { label: "Release limit", value: "Within ± 0.1% of theoretical (± 1 Da at 1 kDa)" },
      { label: "Catches", value: "Wrong peptide, wrong salt form, wrong modification (e.g. DAC absent)" },
      { label: "Does not catch", value: "Low-level impurities that co-elute with the main peak" },
    ],
  },
  {
    code: "03",
    title: "Endotoxin · LAL",
    what: "Limulus amoebocyte lysate assay for bacterial endotoxin, the pyrogenic residue left when gram-negative bacteria contaminate a process. Reported in endotoxin units per milligram of peptide.",
    rows: [
      { label: "Reports", value: "EU / mg" },
      { label: "Release limit", value: "< 1.0 EU/mg (most lots < 0.5)" },
      { label: "Catches", value: "Bacterial contamination during synthesis, fill or handling" },
      { label: "Does not catch", value: "Sterility of the finished vial — research vials are not sterile-filled medicines" },
    ],
  },
];

const READING: { step: string; title: string; body: string }[] = [
  { step: "A", title: "Match the batch", body: "The batch on the certificate must equal the batch printed on the vial label and on the product page. If they differ, the certificate is not for your vial." },
  { step: "B", title: "Check the date", body: "Tested on is the date the laboratory issued the report — not the synthesis date and not the ship date. We retest a lot if it has been in stock for more than nine months." },
  { step: "C", title: "Read the lab, not the logo", body: "The laboratory is named. Both labs we use accept samples from anyone, so a certificate can be re-run by a customer using the batch number." },
  { step: "D", title: "Purity is one number", body: "99.4% means 0.6% of what was detected was not the target peptide. It says nothing about how much powder is in the vial, which the mass on the label describes." },
  { step: "E", title: "Identity is yes or no", body: "Confirmed (LC-MS) means the observed mass matched the theoretical one. Anything else — 'consistent with', 'presumed' — should be read as unconfirmed." },
  { step: "F", title: "Endotoxin is a ceiling", body: "< 0.5 EU/mg is a detection limit, not a measurement. Lower limits reflect a cleaner assay, not a purer peptide." },
];

const STORAGE: { label: string; value: string }[] = [
  { label: "Unopened vials", value: "−20 °C in the dark; stable 24 months from the test date" },
  { label: "Short-term", value: "2–8 °C for up to 30 days if freezing is impractical" },
  { label: "After reconstitution", value: "2–8 °C, use within 28 days; do not refreeze" },
  { label: "Copper peptide (GHK-Cu)", value: "2–8 °C sealed; protect from light" },
  { label: "Diluent", value: "Room temperature; 28 days after first puncture" },
  { label: "In transit", value: "Ambient, tracked; insulated pouch and gel pack June–September" },
  { label: "Cold chain", value: "Prescription medicines only, dispatched by the dispensing pharmacy" },
  { label: "Dispatch", value: "Same working day before 2 pm (UK); pre-order lots ship when the CoA is issued" },
];

const LIMITS: string[] = [
  "Testing confirms the identity and purity of the vial contents. It says nothing about safety or effectiveness in humans — that is what the evidence record is for.",
  "A certificate describes a sample from the lot, not every vial in it. Fill-weight variation between vials is not measured.",
  "Research vials are not manufactured as medicines. They are not sterile-filled under GMP, and no regulator has inspected the process.",
  "We pay the laboratories. The results are independent of us in method and reporting, but the commercial relationship exists and you should know it.",
  "Prescription medicines listed here are not tested by us; they carry the manufacturer's release testing and the dispensing pharmacy's controls.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Lab testing & certificates of analysis",
  url: `${BRAND.url}/lab-testing/`,
  inLanguage: "en-GB",
  description: metadata.description,
  publisher: { "@type": "Organization", name: BRAND.legalName, url: BRAND.url },
  dateModified: latest,
};

export default function LabTestingPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Header */}
      <section className="rule-b">
        <div className="container-x grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="label-mono">Lab testing · {certified.length} certificates</p>
            <h1 className="mt-4 max-w-4xl text-balance text-[2.5rem] uppercase leading-[0.95] sm:text-[3.75rem] lg:text-[4.75rem]">
              Every batch.
              <br />
              Third-party tested.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[16px]">
              A sample from every research lot goes to an independent laboratory before the lot is listed. Purity by HPLC, identity by LC-MS,
              endotoxin by LAL. The certificate is published against the batch number printed on the vial. Below: what each test does, how to read
              a certificate, and every certificate currently in force.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px border border-ink bg-ink sm:grid-cols-4 lg:grid-cols-2">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white px-4 py-3">
                <dt className="label-mono">{s.label}</dt>
                <dd className="mt-1 font-mono text-[15px] text-ink tnum">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* What we test */}
      <section className="container-x py-12 lg:py-16" aria-labelledby="tests-heading">
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div>
            <p className="label-mono">01 — Methods</p>
            <h2 id="tests-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
              Three tests, one lot
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-muted">
              Laboratories: {labs.join(" and ")}. Both accept public submissions, so any certificate can be re-run against the same batch number.
            </p>
          </div>
          <div className="cell-grid grid-cols-1 lg:grid-cols-3">
            {TESTS.map((t) => (
              <article key={t.code} className="flex flex-col p-5">
                <p className="font-mono text-[11px] tnum text-muted">{t.code}</p>
                <h3 className="mt-2 text-[1.1rem] uppercase">{t.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">{t.what}</p>
                <div className="mt-4 border-t border-ink">
                  {t.rows.map((r) => (
                    <SpecRow key={r.label} label={r.label} value={r.value} className="items-start" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How to read a CoA */}
      <section className="rule-t bg-paper-2" aria-labelledby="reading-heading">
        <div className="container-x py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <div>
              <p className="label-mono">02 — Reading a certificate</p>
              <h2 id="reading-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
                Six lines that matter
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">
                A specimen certificate for the current TB-500 lot, annotated. The same six fields appear on every product page.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <SpecimenCoa />
              <ol className="border border-ink bg-white">
                {READING.map((r) => (
                  <li key={r.step} className="flex gap-4 border-b border-line p-4 last:border-b-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-ink font-mono text-[11px] font-semibold text-white">{r.step}</span>
                    <div>
                      <h3 className="text-[14px] font-semibold text-ink">{r.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{r.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Batch numbering + storage */}
      <section className="rule-t" aria-labelledby="batch-heading">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div>
            <p className="label-mono">03 — Batch numbering</p>
            <h2 id="batch-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
              CCC-YYMM-L
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-muted">
              Every lot number has three parts. It is printed on the vial label, on the certificate and on the product page, and is what you quote
              if you want a laboratory to re-run the test.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-px border border-ink bg-ink">
              {[
                { part: "TB5", label: "Compound code", body: "Three characters per compound. TB5 = TB-500, BPC = BPC-157, CJC = CJC-1295." },
                { part: "2609", label: "Release", body: "Year and month the lot was released: 26 = 2026, 09 = September." },
                { part: "B", label: "Lot letter", body: "Sequential within the month. A is the first lot released, B the second." },
              ].map((b) => (
                <div key={b.part} className="bg-white p-4">
                  <p className="font-mono text-[1.5rem] font-semibold tnum text-ink">{b.part}</p>
                  <p className="label-mono mt-2">{b.label}</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink-3">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="label-mono">04 — Storage & shipping</p>
            <h2 className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">Cold, dark, tracked</h2>
            <div className="mt-6 border border-ink px-4 py-1">
              {STORAGE.map((s) => (
                <SpecRow key={s.label} label={s.label} value={s.value} className="items-start" />
              ))}
            </div>
            <Link href="/shipping/" className="link-rule mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
              Shipping and returns
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Certificates table */}
      <section className="rule-t" aria-labelledby="certs-heading">
        <div className="container-x py-12 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-mono">05 — Certificates in force</p>
              <h2 id="certs-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
                {certified.length} lots, {latest ? `latest ${formatDate(latest, { month: "short" })}` : "current"}
              </h2>
            </div>
            <p className="max-w-md text-[13px] leading-relaxed text-muted">
              Generated from the catalogue. When a lot sells out its certificate stays here until the next lot replaces it.
            </p>
          </div>
          <div className="mt-6 overflow-x-auto border border-ink">
            <table className="w-full min-w-[46rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-ink bg-paper-2">
                  {["Product", "Batch", "Tested on", "Laboratory", "Purity", "Identity", "Endotoxin"].map((h) => (
                    <th key={h} scope="col" className="label-mono px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certified.map((p) => {
                  const coa = p.coa!;
                  return (
                    <tr key={p.id} className="border-b border-line last:border-b-0 hover:bg-paper-2">
                      <th scope="row" className="px-4 py-3 font-semibold text-ink">
                        <Link href={productPath(p.slug)} className="link-rule decoration-transparent hover:decoration-current">
                          {p.name}
                        </Link>
                      </th>
                      <td className="px-4 py-3 font-mono text-[12px] tnum">{coa.batch}</td>
                      <td className="px-4 py-3 font-mono text-[12px] tnum">{formatDate(coa.testedOn, { month: "short" })}</td>
                      <td className="px-4 py-3">{coa.lab}</td>
                      <td className="px-4 py-3 font-mono text-[12px] tnum">{coa.purity}</td>
                      <td className="px-4 py-3">{coa.identity ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-[12px] tnum">{coa.endotoxin ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Honest limits */}
      <section className="rule-t bg-ink text-white" aria-labelledby="limits-heading">
        <div className="container-x grid gap-8 py-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-16">
          <div>
            <p className="label-mono text-white/60">06 — What testing cannot tell you</p>
            <h2 id="limits-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
              The limits, stated
            </h2>
          </div>
          <div>
            <ol className="border border-white/30">
              {LIMITS.map((l, i) => (
                <li key={l} className="flex gap-4 border-b border-white/20 p-4 text-[14px] leading-relaxed text-white/85 last:border-b-0">
                  <span className="font-mono text-[11px] tnum text-white/50">{String(i + 1).padStart(2, "0")}</span>
                  {l}
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button href="/peptides/" variant="inverted" size="md">
                Evidence directory
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/methodology/" variant="ghost" size="md" className="border-white/40 text-white hover:border-white hover:bg-white hover:text-ink">
                How we grade evidence
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Annotated specimen certificate, built from the current TB-500 record so it never drifts from the catalogue. */
function SpecimenCoa() {
  const specimen = certified.find((p) => p.slug === "tb-500") ?? certified[0];
  if (!specimen?.coa) return null;
  const coa = specimen.coa;
  const rows: { step: string; label: string; value: string }[] = [
    { step: "A", label: "Batch", value: coa.batch },
    { step: "B", label: "Tested on", value: formatDate(coa.testedOn) },
    { step: "C", label: "Laboratory", value: coa.lab },
    { step: "D", label: "Purity (HPLC)", value: coa.purity },
    { step: "E", label: "Identity (LC-MS)", value: coa.identity ?? "—" },
    { step: "F", label: "Endotoxin (LAL)", value: coa.endotoxin ?? "—" },
  ];
  return (
    <div className="border border-ink bg-white">
      <div className="flex items-start justify-between gap-4 border-b border-ink p-4">
        <div>
          <p className="label-mono">Certificate of analysis · specimen</p>
          <p className="mt-2 font-display text-[1.25rem] uppercase">{specimen.name}</p>
          <p className="text-[12.5px] text-muted">{specimen.subtitle}</p>
        </div>
        <span className="shrink-0 border border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">Lot {coa.batch}</span>
      </div>
      <dl>
        {rows.map((r) => (
          <div key={r.step} className="flex items-center gap-4 border-b border-line px-4 py-3 last:border-b-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-ink font-mono text-[10px] font-semibold">{r.step}</span>
            <dt className="label-mono w-32 shrink-0">{r.label}</dt>
            <dd className="ml-auto text-right font-mono text-[12.5px] tnum text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between gap-3 border-t border-ink px-4 py-3">
        <p className="text-[12px] text-muted">The live certificate for this lot sits on the product page.</p>
        <Link href={productPath(specimen.slug)} className="link-rule inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-ink">
          View
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
