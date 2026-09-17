import { blendProducts, coaLabs, numberWord, productsWithCoa } from "./copy";
import { IndexHead } from "./index-head";

const TESTS: { label: string; method: string; figure: string; body: string }[] = [
  {
    label: "Purity",
    method: "HPLC",
    figure: "≥ 99%",
    body: "High-performance liquid chromatography. The percentage of the main peak is the purity figure on the certificate; the release threshold is 99% — per component for blends.",
  },
  {
    label: "Identity",
    method: "LC-MS",
    figure: "Confirmed",
    body: "Liquid chromatography–mass spectrometry. The measured mass is compared with the expected mass of each compound in the pen. A lot that does not match is not listed.",
  },
  {
    label: "Endotoxin",
    method: "LAL",
    figure: "EU/mg",
    body: "Limulus amebocyte lysate assay for bacterial endotoxin, reported per lot in endotoxin units per milligram of the solution in the pen.",
  },
];

/** Dark lab panel: three tests, three columns, mono figures. Links to the CoA lookup. */
export function LabPanel() {
  const labs = coaLabs();
  const withCoa = productsWithCoa();
  const blends = blendProducts();

  return (
    <section className="bg-ink text-white">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          tone="dark"
          index="06"
          label="What we test"
          title="Every lot. Three tests. One certificate."
          description={`Testing is done by an independent laboratory, not by us. ${blends.length > 0 ? `The ${numberWord(blends.length)} blends — ${blends.map((b) => b.name).join(" and ")} — are tested per component, with the split stated on the certificate. ` : ""}The certificate is published as issued against the lot number printed on the carton.`}
          action={{ href: "/lab-testing", label: "Look up a lot number" }}
        />
        <ul className="mt-10 grid border-t border-white/25 md:grid-cols-3 md:divide-x md:divide-white/25">
          {TESTS.map((t) => (
            <li key={t.label} className="border-b border-white/25 py-6 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="label-mono text-white/60">
                {t.label} · {t.method}
              </p>
              <p className="mt-5 break-words font-mono text-[1.75rem] leading-none tnum sm:text-[2rem] lg:text-[2.5rem]">{t.figure}</p>
              <p className="mt-5 text-[13px] leading-relaxed text-white/70">{t.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-2 border-t border-white/25 pt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/60 sm:flex-row sm:items-baseline sm:justify-between">
          <span>{labs.length > 0 ? `Laboratory: ${labs.join(" · ")}` : "Independent laboratory"}</span>
          <span className="tnum">
            {withCoa > 0 ? `${withCoa} ${withCoa === 1 ? "lot" : "lots"} with a published certificate` : "Certificates published per lot"}
          </span>
        </div>
      </div>
    </section>
  );
}
