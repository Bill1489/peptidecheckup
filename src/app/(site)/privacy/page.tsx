import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { formatDate } from "@/lib/utils";
import { CtaBand } from "@/components/marketing/cta-band";
import { Callout, MetaStrip, Prose, TrustPage } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "Plain-English privacy notice: assessment answers are stored only in your browser, nothing is transmitted unless you request clinician contact, no accounts, no analytics by default, and how to delete your data.",
  alternates: { canonical: "/privacy/" },
};

const LAST_UPDATED = "2026-09-14";

const TOC = [
  { id: "summary", label: "In one paragraph" },
  { id: "collect", label: "What we collect" },
  { id: "storage", label: "Where your answers live" },
  { id: "contact-request", label: "Clinician contact requests" },
  { id: "analytics", label: "Analytics and cookies" },
  { id: "third-parties", label: "Hosting and third parties" },
  { id: "delete", label: "Deleting your data" },
  { id: "rights", label: "Your rights" },
  { id: "children", label: "Children" },
  { id: "changes", label: "Changes to this notice" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <TrustPage
      eyebrow="Privacy notice"
      title="Your answers stay on your device."
      description="This notice is written to be read, not scrolled past. It describes what the site stores, where, and the one situation in which anything leaves your browser."
      meta={`Last updated ${formatDate(LAST_UPDATED)} · ${BRAND.legalName}`}
      toc={TOC}
      after={<CtaBand showDisclaimer={false} />}
    >
      <Prose>
        <h2 id="summary">In one paragraph</h2>
        <Callout tone="brand">
          {BRAND.displayName} is a static website with no accounts and no server-side database. The assessment runs in
          your browser and saves your answers to your browser’s local storage so you can pause and resume. Nothing you
          enter is transmitted to us unless you explicitly ask to be contacted for a clinician review and provide an
          email address. We run no analytics by default. You can delete everything by choosing “Start over” or clearing
          the site’s data in your browser.
        </Callout>
      </Prose>

      <Prose>
        <h2 id="collect">What we collect</h2>
        <p>
          By default, <strong>nothing</strong>. Browsing compound pages, comparisons and this notice sends no information
          to us. We do not set accounts, profiles or identifiers.
        </p>
        <p>The assessment asks you for health information — your goal, age, sex, measurements, country, medical history,
          medicines, previous experience, product source and safety answers. This is sensitive information and we
          treat it accordingly: it is processed entirely in your browser to generate the report and is stored only there.
        </p>
      </Prose>

      <Prose>
        <h2 id="storage">Where your answers live</h2>
        <ul>
          <li>
            <strong>Local storage in your browser.</strong> Answers and your generated report are saved under this
            site’s origin so that you can pause, resume and reopen the report on the same device and browser.
          </li>
          <li>
            <strong>Not on our servers.</strong> There is no server component to send them to. If you switch devices or
            browsers, or use a private window, the data will not follow you.
          </li>
          <li>
            <strong>Shared devices.</strong> Anyone using the same browser profile on that device could open the site and
            see a saved report. Use “Start over” or clear site data when you are done on a shared machine.
          </li>
          <li>
            <strong>Printing and saving.</strong> If you print or save the report as a file, that copy is yours and is
            outside this notice.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="contact-request">Clinician contact requests</h2>
        <p>
          Near the end of the assessment you can ask to be contacted for a professional review. This is optional, asks
          for a separate, explicit consent, and requires an email address. It is the <strong>only</strong> point at which
          information leaves your device, and only what you choose to send: your contact details and, if you choose to
          include it, your report. We use it solely to respond to your request. We do not add you to marketing lists and
          we do not share it with vendors, clinics or advertisers. If you change your mind, email us and we will delete
          it.
        </p>
      </Prose>

      <Prose>
        <h2 id="analytics">Analytics and cookies</h2>
        <p>
          <strong>None by default.</strong> We do not run analytics, advertising pixels or session recording, and the
          site sets no cookies. If we ever add privacy-preserving, cookie-free aggregate analytics to understand which
          pages are read, we will say so here first, it will not include assessment answers, and it will not identify
          you.
        </p>
        <p>
          Advertising platforms that bring you to a landing page may append parameters to the URL (such as UTM tags).
          The assessment may record the landing page you arrived from alongside your answers, in your browser only, so
          that the report can address the goal you came with.
        </p>
      </Prose>

      <Prose>
        <h2 id="third-parties">Hosting and third parties</h2>
        <ul>
          <li>
            <strong>Hosting.</strong> The site is served as static files by a hosting provider. Like any web host, it may
            keep standard server logs (IP address, browser type, pages requested) for security and operations. Those logs
            never contain assessment answers, which are not transmitted.
          </li>
          <li>
            <strong>Fonts.</strong> Fonts are bundled with the site and served from the same place as the pages, so no
            request goes to a font provider.
          </li>
          <li>
            <strong>Links to sources.</strong> Compound pages link to trial reports and regulator documents. Those sites
            have their own privacy practices.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="delete">Deleting your data</h2>
        <ol>
          <li>
            Open the <Link href="/assessment">assessment page</Link> and choose <strong>Start over</strong>. This removes
            saved answers and the report from your browser.
          </li>
          <li>
            Or clear this site’s data in your browser settings (usually under privacy, site data or storage), which
            removes everything stored under this origin.
          </li>
          <li>
            If you sent a clinician contact request, email{" "}
            <a href={`mailto:${BRAND.supportEmail}?subject=Delete%20my%20contact%20request`}>{BRAND.supportEmail}</a>{" "}
            and we will delete it.
          </li>
        </ol>
      </Prose>

      <Prose>
        <h2 id="rights">Your rights</h2>
        <p>
          Where data-protection law applies to information you send us (a contact request), you have the right to access
          it, correct it, have it deleted, and object to or restrict its processing. Because everything else stays in
          your browser, you exercise those rights over your assessment data directly, by deleting it. To exercise any
          right over a contact request, email us. You also have the right to complain to your data-protection authority
          — in the United Kingdom, the Information Commissioner’s Office.
        </p>
      </Prose>

      <Prose>
        <h2 id="children">Children</h2>
        <p>
          The assessment is for adults and stops if an age under 18 is entered. We do not knowingly collect information
          from children. If you believe a child has sent us a contact request, email us and we will delete it.
        </p>
      </Prose>

      <Prose>
        <h2 id="changes">Changes to this notice</h2>
        <p>
          If we change how the site handles information — for example by adding analytics or a way to save reports
          across devices — we will update this notice before the change takes effect and change the date at the top. We
          will not weaken the default position described here without saying so plainly.
        </p>
      </Prose>
      <MetaStrip
        items={[
          { label: "Controller", value: BRAND.legalName },
          { label: "Default data sent to us", value: "None" },
          { label: "Contact", value: <a href={`mailto:${BRAND.supportEmail}`} className="text-brand-700 underline underline-offset-4">{BRAND.supportEmail}</a> },
        ]}
      />

      <Prose>
        <h2 id="contact">Contact</h2>
        <p>
          Privacy questions go to <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>. See also the{" "}
          <Link href="/terms">terms of use</Link> and the <Link href="/safety">safety page</Link>.
        </p>
      </Prose>
    </TrustPage>
  );
}
