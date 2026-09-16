const FACTS: { label: string; value: string; body: string }[] = [
  { label: "Purity", value: "HPLC", body: "Every batch. The percentage of the main peak is printed on the certificate." },
  { label: "Identity", value: "LC-MS", body: "Measured mass checked against the expected mass of the sequence. Confirmed or rejected." },
  { label: "Endotoxin", value: "LAL", body: "Bacterial endotoxin tested per lot for lyophilised vials, reported in EU/mg." },
  { label: "Assessment", value: "Says no", body: "If your answers raise a flag, the report tells you not to buy — and nothing is added to your cart." },
];

/** Four bordered cells of facts under the hero. Method names, not adjectives. */
export function TrustStrip() {
  return (
    <section className="rule-b">
      <div className="container-x grid gap-4 py-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:py-8">
        <p className="label-mono text-ink">
          <span className="tnum">02 — </span>Tested
        </p>
        <ul className="cell-grid grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f) => (
            <li key={f.label} className="flex flex-col gap-3 p-4 sm:p-5">
              <span className="label-mono">{f.label}</span>
              <span className="font-display text-[1.35rem] uppercase leading-none text-ink sm:text-[1.6rem]">{f.value}</span>
              <span className="text-[13px] leading-relaxed text-ink-3">{f.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
