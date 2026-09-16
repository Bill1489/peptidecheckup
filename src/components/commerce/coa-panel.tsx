import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SpecRow } from "@/components/ui/card";
import { CoaDownload } from "@/components/commerce/coa-download";
import type { CertificateOfAnalysis } from "@/data/products";
import { formatDate } from "@/lib/utils";

/** Certificate of analysis block: batch, date, lab, results, download. */
export function CoaPanel({ coa, productName, className }: { coa: CertificateOfAnalysis; productName: string; className?: string }) {
  return (
    <section className={className} aria-labelledby="coa-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label-mono">Certificate of analysis</p>
          <h2 id="coa-heading" className="mt-1.5 text-[1.25rem] uppercase">
            Lot {coa.batch}
          </h2>
        </div>
        <CoaDownload url={coa.url} batch={coa.batch} />
      </div>
      <div className="mt-4 grid gap-px border border-ink bg-ink sm:grid-cols-2">
        <div className="bg-white px-4 py-1">
          <SpecRow label="Batch" value={<span className="font-mono text-[13px] tnum">{coa.batch}</span>} />
          <SpecRow label="Tested on" value={formatDate(coa.testedOn)} />
          <SpecRow label="Laboratory" value={coa.lab} />
        </div>
        <div className="bg-white px-4 py-1">
          <SpecRow label="Purity" value={<span className="font-mono text-[13px] tnum">{coa.purity}</span>} />
          <SpecRow label="Identity" value={coa.identity ?? "—"} />
          <SpecRow label="Endotoxin" value={coa.endotoxin ? <span className="font-mono text-[13px] tnum">{coa.endotoxin}</span> : "—"} />
        </div>
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
        Independent test of a sample from lot {coa.batch} of {productName}. Testing confirms what is in the vial and how pure it is; it does not
        speak to safety or effect in people.{" "}
        <Link href="/lab-testing/" className="link-rule inline-flex items-center gap-1 text-ink">
          How we test
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </p>
    </section>
  );
}
