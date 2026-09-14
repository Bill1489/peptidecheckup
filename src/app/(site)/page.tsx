import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";

// Placeholder — replaced by the marketing build.
export default function HomePage() {
  return (
    <section className="container-x py-24">
      <SectionHeading
        eyebrow="Evidence-led peptide comparison"
        title={BRAND.tagline}
        description={BRAND.description}
        as="h1"
      />
      <div className="mt-8 flex gap-3">
        <Button href="/assessment" size="lg">Start assessment</Button>
        <Button href="/peptides" size="lg" variant="secondary">Browse peptides</Button>
      </div>
    </section>
  );
}
