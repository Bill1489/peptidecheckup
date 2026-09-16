import { COMPOUNDS } from "@/data/compounds";
import { IndexHead } from "./index-head";
import { EvidenceScale } from "./scales";

/** The five-grade ladder, with the live count of compounds at each grade. */
export function EvidenceSection() {
  return (
    <section className="rule-b">
      <div className="container-x py-14 lg:py-20">
        <IndexHead
          index="07"
          label="Evidence grades"
          title="We grade every compound the same way."
          description={`${COMPOUNDS.length} compounds, one five-point scale, human evidence only. A product page shows the same grade as the compound page — whether or not we sell it.`}
          action={{ href: "/peptides", label: "Compound directory" }}
        />
        <EvidenceScale counts className="mt-10" />
      </div>
    </section>
  );
}
