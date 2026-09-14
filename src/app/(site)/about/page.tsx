import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Ban, MessageSquareText, Stethoscope, type LucideIcon } from "lucide-react";
import { COMPOUNDS } from "@/data/compounds";
import { BRAND } from "@/lib/brand";
import { NAMED_JURISDICTIONS, pluralise } from "@/components/marketing/copy";
import { CtaBand } from "@/components/marketing/cta-band";
import { Callout, MetaStrip, Prose, ProseH2, TrustPage } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${BRAND.displayName} exists, the principles it is built on, what it deliberately is not, and who maintains it.`,
  alternates: { canonical: "/about/" },
};

const TOC = [
  { id: "mission", label: "Why this exists" },
  { id: "principles", label: "Principles" },
  { id: "not", label: "What we are not" },
  { id: "team", label: "Who we are" },
  { id: "contact", label: "Contact" },
];

const PRINCIPLES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BookOpen,
    title: "Evidence first",
    body: "Human trials and regulator labels decide the grade. Animal data, anecdote and marketing do not. Where the evidence is thin, we say so in the same size type.",
  },
  {
    icon: Ban,
    title: "Never sell",
    body: "No products, no vendor links, no affiliate commissions, no sponsored placements. We have nothing to gain from what you decide.",
  },
  {
    icon: MessageSquareText,
    title: "Plain English",
    body: "Written so a person without a science background can follow it, without losing the precision a clinician expects. UK English, no hype, no fear.",
  },
  {
    icon: Stethoscope,
    title: "Clinician-reviewable",
    body: "Every record lists its sources; every flag names the answer that caused it; the same inputs always give the same report. A clinician can check the reasoning, and we want them to.",
  },
];

export default function AboutPage() {
  return (
    <TrustPage
      eyebrow="About"
      title="Built for the conversation you should be having with a clinician."
      description={`${BRAND.displayName} exists because the people asking about peptides deserve better information than vendor pages and podcast clips — and clinicians deserve patients who arrive with structured questions.`}
      meta={`${BRAND.legalName} · est. ${BRAND.foundedYear}`}
      toc={TOC}
      after={<CtaBand secondary={{ href: "/methodology", label: "Read the methodology" }} />}
    >
      <Prose>
        <h2 id="mission">Why this exists</h2>
        <p>
          Interest in peptides has run far ahead of the information available about them. Most of what people find is
          written by people selling something, or by people repeating what they heard from someone selling something.
          The evidence — where it exists — sits in trial reports and regulator documents that are hard to find and
          harder to read. The result is that people make decisions about injecting unlicensed compounds with less
          information than they would have about a new phone.
        </p>
        <p>
          We think the honest position is this: some peptides are licensed medicines with large trials behind them;
          some are investigational; many have never been studied in humans. Which category a compound is in matters more
          than anything an advert says, and whether it is worth discussing at all depends on your own history and
          medicines. So we built a database that records those facts consistently, an assessment that collects your
          history in a structured way, and a rules engine that puts the two together into a report you can take to
          someone qualified to help.
        </p>
      </Prose>

      <ProseH2 id="principles">Principles</ProseH2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <li key={p.title} className="rounded-2xl border border-line bg-white p-5 shadow-soft">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <p.icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 font-sans text-[1.02rem] font-medium text-ink [font-variation-settings:normal]">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ul>

      <Prose>
        <h2 id="not">What we are not</h2>
        <ul>
          <li>
            <strong>Not a clinic or a healthcare provider.</strong> Nobody here is your clinician, and using the site
            does not create a professional relationship. See the <Link href="/terms">terms</Link>.
          </li>
          <li>
            <strong>Not a shop, a marketplace or an affiliate.</strong> We do not sell peptides, link to anyone who does,
            or take money from vendors, clinics or manufacturers.
          </li>
          <li>
            <strong>Not an AI chatbot.</strong> There is no language model in the pipeline. Reports are assembled from
            database fields by fixed, reviewable rules.
          </li>
          <li>
            <strong>Not an advocate for or against peptides.</strong> Where the evidence is strong we say so; where it
            is absent we say that too, in the same tone.
          </li>
          <li>
            <strong>Not a data business.</strong> There are no accounts, no tracking by default, and your answers stay in
            your browser. See the <Link href="/privacy">privacy notice</Link>.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="team">Who we are</h2>
        <p>
          {BRAND.displayName} is maintained by a small, independent team with clinical, pharmacy and engineering
          backgrounds. Compound records are written from regulator labels and peer-reviewed trials and reviewed before
          publication; the rules engine is reviewed against the same sources. We publish the sources for every record so
          the work can be checked rather than taken on trust.
        </p>
        <Callout tone="neutral" title="A note on names and photographs">
          We do not publish individual names, credentials or photographs on this page yet, and we will not invent any.
          When we do, they will be real people who are accountable for the content. Until then, judge the work by its
          sources and its <Link href="/methodology" className="font-medium text-brand-700 underline underline-offset-4">methodology</Link>.
        </Callout>
      </Prose>
      <MetaStrip
        items={[
          { label: "Database", value: `${pluralise(COMPOUNDS.length, "compound")} · ${NAMED_JURISDICTIONS.length} jurisdictions` },
          { label: "Business model", value: "No sales, no commissions, no vendor advertising" },
          { label: "Legal entity", value: BRAND.legalName },
        ]}
      />

      <Prose>
        <h2 id="contact">Contact</h2>
        <p>
          Corrections, questions and requests for clinician review all go to{" "}
          <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>. A person reads every message. If you are a
          clinician, pharmacist or researcher who would like to review records or rules, we would like to hear from you.
        </p>
      </Prose>
    </TrustPage>
  );
}
