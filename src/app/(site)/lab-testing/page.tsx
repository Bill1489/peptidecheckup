import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecRow } from "@/components/ui/card";
import { ProductImage, ProductSwatch } from "@/components/commerce/product-image";
import { componentSlugs, isBlend, productComponents, productPath, productsWithCoa } from "@/components/commerce/product-utils";
import { JsonLd } from "@/components/marketing/json-ld";
import { PRODUCTS } from "@/data/products";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { formatDate } from "@/lib/utils";

const certified = productsWithCoa();
const labs = Array.from(new Set(certified.map((p) => p.coa!.lab))).sort();
const blends = PRODUCTS.filter(isBlend);
const componentCount = certified.reduce((n, p) => n + Math.max(1, componentSlugs(p).length), 0);
const purities = certified.map((p) => Number.parseFloat(p.coa!.purity.replace(/^[^\d]*/, ""))).filter((n) => Number.isFinite(n));
const minPurity = purities.length ? Math.min(...purities).toFixed(1) : "—";
const latest = certified[0]?.coa?.testedOn;
const blendNames = blends.map((p) => p.name).join(" and ");

export const metadata: Metadata = {
  title: `Lab testing — ${certified.length} pens, ${certified.length} published certificates of analysis`,
  description: `How every ${BRAND.name} pen lot is tested (HPLC purity, LC-MS identity, LAL endotoxin), how blends are tested per component, which independent laboratory we use, how to read a certificate and batch number, and the certificate for each of the ${certified.length} pens in the range.`,
  alternates: { canonical: "/lab-testing/" },
  openGraph: {
    images: OG_IMAGES,
    title: "Lab testing & certificates of analysis",
    description: `Every pen lot tested by an independent laboratory before it ships. ${certified.length} certificates published; ${componentCount} components identity-confirmed.`,
    url: "/lab-testing/",
    siteName: BRAND.displayName,
  },
};

const STATS: { label: string; value: string }[] = [
  { label: "Pens in the range", value: String(certified.length) },
  { label: "Certificates published", value: String(certified.length) },
  { label: "Components identity-confirmed", value: String(componentCount) },
  { label: "Lowest accepted purity", value: `${minPurity}%` },
];

const TESTS: { code: string; title: string; what: string; rows: { label: string; value: string }[] }[] = [
  {
    code: "01",
    title: "Purity · HPLC",
    what: "Reverse-phase high-performance liquid chromatography separates the target compound from truncated, deletion and oxidised by-products and reports the target as a percentage of total peak area at 214–220 nm. In a blend, each component is resolved and reported separately.",
    rows: [
      { label: "Reports", value: "Target peak area % · per component in blends" },
      { label: "Release limit", value: "≥ 99% for every component" },
      { label: "Catches", value: "Truncations, deletions, oxidation, dimerisation" },
      { label: "Does not catch", value: "Identity — a pure pen of the wrong compound still scores high" },
    ],
  },
  {
    code: "02",
    title: "Identity · LC-MS",
    what: "Liquid chromatography–mass spectrometry measures the molecular mass of each main peak and compares it with the theoretical mass of the labelled compound. A match within instrument tolerance confirms the pen contains what the carton says — every component of a blend, not just the largest.",
    rows: [
      { label: "Reports", value: "Observed vs theoretical mass, per component" },
      { label: "Release limit", value: "Within ± 0.1% of theoretical (± 1 Da at 1 kDa)" },
      { label: "Catches", value: "Wrong compound, wrong salt form, missing component in a blend" },
      { label: "Does not catch", value: "Low-level impurities that co-elute with the main peak" },
    ],
  },
  {
    code: "03",
    title: "Endotoxin · LAL",
    what: "Limulus amoebocyte lysate assay for bacterial endotoxin, the pyrogenic residue left when gram-negative bacteria contaminate a process. Run on the finished solution in the pen and reported in endotoxin units per milligram of compound.",
    rows: [
      { label: "Reports", value: "EU / mg" },
      { label: "Release limit", value: "< 1.0 EU/mg (current lots < 0.5)" },
      { label: "Catches", value: "Bacterial contamination during synthesis, fill or handling" },
      { label: "Does not catch", value: "Sterility of the finished pen — research pens are not medicines filled under GMP" },
    ],
  },
];

const READING: { step: string; title: string; body: string }[] = [
  {
    step: "A",
    title: "Match the batch",
    body: "The batch on the certificate must equal the batch printed on the carton and the pen label, and on the product page. If they differ, the certificate is not for your pen.",
  },
  {
    step: "B",
    title: "Check the date",
    body: "Tested on is the date the laboratory issued the report — not the fill date and not the ship date. We retest a lot if it has been in stock for more than nine months.",
  },
  {
    step: "C",
    title: "Read the lab, not the logo",
    body: "The laboratory is named and accepts samples from anyone, so a certificate can be re-run by a customer using the batch number.",
  },
  {
    step: "D",
    title: "Purity is one number per component",
    body: "99.3% means 0.7% of what was detected was not the target compound. Blends show one figure per component. Purity says nothing about how much is in the pen — the mass on the carton describes that.",
  },
  {
    step: "E",
    title: "Identity is yes or no",
    body: "Confirmed (LC-MS) means the observed mass matched the theoretical one. Anything else — 'consistent with', 'presumed' — should be read as unconfirmed. A blend certificate names every component confirmed.",
  },
  {
    step: "F",
    title: "Endotoxin is a ceiling",
    body: "< 0.5 EU/mg is a detection limit, not a measurement. Lower limits reflect a cleaner assay, not a purer compound.",
  },
];

const STORAGE: { label: string; value: string }[] = [
  { label: "Unopened pen", value: "2–8 °C in the carton; use by the date on the label" },
  { label: "In use", value: "2–8 °C between uses; cap on, out of direct light" },
  { label: "Freezing", value: "Do not freeze. A pen that has frozen should not be used" },
  { label: "Room temperature", value: "Short excursions in transit only — not for storage" },
  { label: "Copper peptide (GHK-Cu, Klow)", value: "As above; keep out of direct light between uses" },
  { label: "In transit", value: "Insulated packaging with gel packs, tracked; shipped chilled" },
  { label: "Dispatch", value: "Same working day before 2 pm (UK)" },
  { label: "Pen needles", value: "Not included; a pen-needle compatibility note is in the box" },
];

const LIMITS: string[] = [
  "Testing confirms the identity and purity of what is in the pen. It says nothing about safety or effectiveness in humans — that is what the evidence record is for.",
  "A certificate describes a sample from the lot, not every pen in it. Fill-volume variation between pens is not measured.",
  "For blends, each component is tested on its own. The combination is not tested as a combination, and nobody has studied these combinations in people.",
  "Research pens are not manufactured as medicines. They are not filled under GMP, and no regulator has inspected the process.",
  "We pay the laboratory. The results are independent of us in method and reporting, but the commercial relationship exists and you should know it.",
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
            <p className="label-mono">Lab testing · {certified.length} pens · {certified.length} certificates</p>
            <h1 className="mt-4 max-w-4xl text-balance text-[2.5rem] uppercase leading-[0.95] sm:text-[3.75rem] lg:text-[4.75rem]">
              Every lot.
              <br />
              Third-party tested.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:text-[16px]">
              A sample from every pen lot goes to an independent laboratory before the lot is listed. Purity by HPLC, identity by LC-MS, endotoxin
              by LAL — per component for the blends. The certificate is published against the batch number printed on the carton. Below: what each
              test does, how to read a certificate, and the certificate for each of the {certified.length} pens.
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
              {labs.length > 1 ? "Laboratories" : "Laboratory"}: {labs.join(" and ")}. {labs.length > 1 ? "Both accept" : "It accepts"} public
              submissions, so any certificate can be re-run against the same batch number.
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
                A specimen certificate for the current Tesamorelin lot, annotated. The same six fields appear on every pen page.
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

      {/* Blends — per-component testing */}
      {blends.length > 0 && (
        <section className="rule-t" aria-labelledby="blends-heading">
          <div className="container-x grid gap-8 py-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-16">
            <div>
              <p className="label-mono">03 — Blends</p>
              <h2 id="blends-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
                Tested per component
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">
                {blendNames} put more than one compound in one pen. The certificate treats each as its own analyte: identity confirmed and purity
                reported for every component, endotoxin on the finished solution.
              </p>
            </div>
            <div className="cell-grid grid-cols-1 lg:grid-cols-2">
              {blends.map((p) => {
                const components = productComponents(p);
                return (
                  <article key={p.id} className="flex flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <ProductSwatch product={p} />
                        <h3 className="text-[1.1rem] uppercase">{p.name}</h3>
                      </div>
                      <span className="shrink-0 border border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
                        {components.length} components
                      </span>
                    </div>
                    <p className="mt-2 text-[12.5px] text-muted">{p.subtitle}</p>
                    <ul className="mt-4 border border-ink">
                      {components.map((c) => (
                        <li key={c.slug} className="flex items-center justify-between gap-3 border-b border-line px-3 py-2.5 text-[13px] last:border-b-0">
                          <span className="font-semibold text-ink">{c.name}</span>
                          <span className="font-mono text-[11px] tnum text-muted">{c.amount ?? "Split on certificate"}</span>
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink">Identity · Purity</span>
                        </li>
                      ))}
                    </ul>
                    {p.coa && (
                      <div className="mt-3 border-t border-ink">
                        <SpecRow label="Purity" value={<span className="font-mono text-[12.5px] tnum">{p.coa.purity}</span>} className="items-start" />
                        <SpecRow label="Identity" value={p.coa.identity ?? "—"} className="items-start" />
                      </div>
                    )}
                    <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                      What testing cannot do is say anything about the combination: each component is graded on its own evidence record and the
                      blend has not been studied in people.
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Batch numbering + storage */}
      <section className="rule-t" aria-labelledby="batch-heading">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div>
            <p className="label-mono">04 — Batch numbering</p>
            <h2 id="batch-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
              AV-CCC-YYMM-L
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-muted">
              Every lot number has four parts. It is printed on the carton, on the pen label, on the certificate and on the product page, and is
              what you quote if you want a laboratory to re-run the test.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-px border border-ink bg-ink sm:grid-cols-4">
              {[
                { part: "AV", label: "Brand", body: `${BRAND.name} — every lot we release starts here.` },
                { part: "TES", label: "Pen code", body: "Three characters per pen: TES Tesamorelin, MOT MOTS-C, GHK GHK-Cu, NAD NAD+, WOL Wolverine, KLW Klow." },
                { part: "2609", label: "Release", body: "Year and month the lot was released: 26 = 2026, 09 = September." },
                { part: "A", label: "Lot letter", body: "Sequential within the month. A is the first lot released, B the second." },
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
            <p className="label-mono">05 — Storage & shipping</p>
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
              <p className="label-mono">06 — Certificates in force</p>
              <h2 id="certs-heading" className="mt-3 text-[1.75rem] uppercase sm:text-[2.25rem]">
                {certified.length} pens, {latest ? `latest ${formatDate(latest, { month: "short" })}` : "current"}
              </h2>
            </div>
            <p className="max-w-md text-[13px] leading-relaxed text-muted">
              Generated from the catalogue. When a lot sells out its certificate stays here until the next lot replaces it.
            </p>
          </div>
          <div className="mt-6 overflow-x-auto border border-ink">
            <table className="w-full min-w-[52rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-ink bg-paper-2">
                  {["Pen", "Batch", "Tested on", "Laboratory", "Purity", "Identity", "Endotoxin"].map((h) => (
                    <th key={h} scope="col" className="label-mono px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certified.map((p) => {
                  const coa = p.coa!;
                  const n = componentSlugs(p).length;
                  return (
                    <tr key={p.id} className="border-b border-line last:border-b-0 hover:bg-paper-2">
                      <th scope="row" className="px-4 py-3 font-semibold text-ink">
                        <Link href={productPath(p.slug)} className="group flex items-center gap-3">
                          <span className="w-10 shrink-0 border border-line bg-white">
                            <ProductImage product={p} prefer="pack" frame="square" sizes="40px" />
                          </span>
                          <span className="flex min-w-0 flex-col">
                            <span className="flex items-center gap-2 group-hover:text-brand-600">
                              <ProductSwatch product={p} />
                              {p.name}
                            </span>
                            <span className="font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-muted">
                              {n > 1 ? `${n} components` : "Single compound"}
                            </span>
                          </span>
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
            <p className="label-mono text-white/60">07 — What testing cannot tell you</p>
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

/** Annotated specimen certificate, built from the current Tesamorelin record so it never drifts from the catalogue. */
function SpecimenCoa() {
  const specimen = certified.find((p) => p.slug === "tesamorelin") ?? certified[0];
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
          <p className="mt-2 flex items-center gap-2 font-display text-[1.25rem] uppercase">
            <ProductSwatch product={specimen} />
            {specimen.name}
          </p>
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
        <p className="text-[12px] text-muted">The live certificate for this lot sits on the pen page.</p>
        <Link href={productPath(specimen.slug)} className="link-rule inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-ink">
          View
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
