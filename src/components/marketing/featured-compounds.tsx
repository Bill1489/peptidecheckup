import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { COMPOUNDS } from "@/data/compounds";
import type { Compound, Jurisdiction } from "@/data/types";
import { EvidenceBadge, RegulatoryBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { pluralise } from "./copy";
import { Reveal, Stagger, StaggerItem } from "./reveal";
import { Section } from "./section";

export function CompoundCard({
  compound,
  jurisdiction = "UK",
  className,
}: {
  compound: Compound;
  jurisdiction?: Jurisdiction;
  className?: string;
}) {
  return (
    <Link
      href={`/peptides/${compound.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-muted">{compound.classLabel}</p>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-muted-2 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          aria-hidden
        />
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight text-ink">{compound.name}</h3>
      <p className="mt-2 flex-1 text-pretty text-[0.95rem] leading-relaxed text-muted">{compound.tagline}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <EvidenceBadge level={compound.overallEvidence} size="xs" prefix="Evidence:" />
        <RegulatoryBadge status={compound.regulatory[jurisdiction].status} size="xs" />
      </div>
    </Link>
  );
}

export function FeaturedCompounds({ limit = 6 }: { limit?: number }) {
  const featured = COMPOUNDS.slice(0, limit);
  if (featured.length === 0) return null;
  return (
    <Section tone="paper" id="compounds">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <SectionHeading
            eyebrow="The database"
            title={`${pluralise(COMPOUNDS.length, "compound")}, written to the same standard.`}
            description="Each record covers mechanism, evidence by goal, regulatory status in every major jurisdiction, published dosing studies, contraindications, interactions and sources. Badges below show overall evidence and United Kingdom status."
          />
        </Reveal>
        <Reveal delay={0.1} className="shrink-0">
          <Button href="/peptides" variant="secondary" size="md">
            View all compounds
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Reveal>
      </div>
      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3" stagger={0.07}>
        {featured.map((c) => (
          <StaggerItem key={c.slug} className="h-full">
            <CompoundCard compound={c} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
