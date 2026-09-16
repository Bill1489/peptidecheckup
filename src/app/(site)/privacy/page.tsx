import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, OG_IMAGES } from "@/lib/brand";
import { COMMERCE } from "@/lib/commerce/config";
import { formatDate } from "@/lib/utils";
import { CtaBand } from "@/components/marketing/cta-band";
import { Note, Prose, SpecSheet, TrustPage } from "@/components/marketing/page-shell";

const DESCRIPTION =
  "Plain-English privacy notice: assessment answers stay in your browser; the cart and orders are stored on your device and sent to the merchant’s fulfilment webhook when configured; card details go to the payment provider; no cookies by default; marketing by opt-in only.";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: DESCRIPTION,
  alternates: { canonical: "/privacy/" },
  openGraph: { images: OG_IMAGES, title: `Privacy notice · ${BRAND.displayName}`, description: DESCRIPTION, url: "/privacy/" },
};

const LAST_UPDATED = "2026-09-15";

const TOC = [
  { id: "summary", label: "In one paragraph" },
  { id: "assessment", label: "Assessment answers" },
  { id: "orders", label: "Cart, orders and payment" },
  { id: "leads", label: "Email you give us" },
  { id: "cookies", label: "Cookies and analytics" },
  { id: "third-parties", label: "Hosting and third parties" },
  { id: "delete", label: "Deleting your data" },
  { id: "rights", label: "Your rights" },
  { id: "children", label: "Children" },
  { id: "changes", label: "Changes to this notice" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  const stripe = COMMERCE.paymentProvider === "stripe";

  return (
    <TrustPage
      label="Privacy notice"
      meta={[`Updated ${formatDate(LAST_UPDATED)}`, BRAND.legalName]}
      title="Your answers stay on your device."
      description="This notice is written to be read. It describes what the site stores, where, and the three situations in which anything leaves your browser: you place an order, you give us an email address, or you pay."
      toc={TOC}
      after={<CtaBand />}
    >
      <Prose>
        <h2 id="summary">In one paragraph</h2>
        <Note tone="brand">
          {BRAND.displayName} is a static website with no accounts and no server-side database of visitors. The assessment runs in your browser and
          saves your answers to your browser’s local storage. Your cart and order history are stored there too. When you place an order, the order
          details are sent to our fulfilment system so it can be shipped, and your card details go directly to the payment provider — never to us. We set
          no cookies by default and run no analytics. Marketing email is opt-in only.
        </Note>
      </Prose>

      <Prose>
        <h2 id="assessment">Assessment answers</h2>
        <p>
          The assessment asks for health information — your goal, age, sex, measurements, country, medical history, medicines, previous experience,
          product source and safety answers. This is sensitive information and we treat it accordingly: it is processed entirely in your browser to
          generate the report and is stored only there, under this site’s origin, so that you can pause, resume and reopen the report on the same device
          and browser.
        </p>
        <ul>
          <li>
            <strong>Not on our servers.</strong> There is no server component to send answers to. If you switch devices or browsers, or use a private
            window, the data will not follow you.
          </li>
          <li>
            <strong>Not attached to your order.</strong> The store reads the report’s suitability labels to decide what it may add to the cart, in your
            browser. Your answers are not included in an order.
          </li>
          <li>
            <strong>Shared devices.</strong> Anyone using the same browser profile could open the site and see a saved report. Use “Start over” or clear
            site data when you finish on a shared machine.
          </li>
          <li>
            <strong>Advert parameters.</strong> If you arrive from an advert, the landing page and any UTM tags may be recorded alongside your answers, in
            your browser only, so the report can address the goal you came with.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="orders">Cart, orders and payment</h2>
        <ul>
          <li>
            <strong>Cart.</strong> Stored in your browser. Prices are re-read from the catalogue each time, so nothing about you is in it beyond the
            products and quantities.
          </li>
          <li>
            <strong>Orders.</strong> When you place an order we need your name, delivery address, email address, the items and the acknowledgements you
            gave (18+, research use). In this demonstration build the order is stored on your device and, when the store is connected to a fulfilment
            system, also sent to it as JSON so the order can be picked, shipped and supported. That system is the only place an order lives outside your
            browser, and it is used for fulfilment, tax records and answering your queries.
          </li>
          <li>
            <strong>Payment.</strong> Card details are entered into the payment provider’s own form and processed by them{stripe ? " (Stripe)" : ""}.
            We never see or store card numbers. The provider’s privacy notice governs that data.
          </li>
          <li>
            <strong>Order history.</strong> The account page reads orders from your browser. There is no login; clearing site data removes the local
            history, so keep the confirmation email.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="leads">Email you give us</h2>
        <p>There are four places you can give us an email address. Each is optional and each says what it is for.</p>
        <ul>
          <li>
            <strong>Email me my report.</strong> Sent with your explicit consent so we can deliver a copy of your report. Used for that and, if you tick the
            separate box, for the newsletter.
          </li>
          <li>
            <strong>Newsletter.</strong> Batch alerts and evidence updates only. Every message has an unsubscribe link.
          </li>
          <li>
            <strong>Start consultation.</strong> Your contact details are passed to {COMMERCE.prescriberPartner} so they can begin the clinical consultation
            under their own registration and privacy notice.
          </li>
          <li>
            <strong>Restock alerts and order emails.</strong> Used for the notification or order you asked for, and nothing else.
          </li>
        </ul>
        <p>
          These submissions are sent to our lead-handling system when one is configured; in the demonstration build they are simulated and a copy is kept
          in your browser. We do not sell or share email addresses with vendors, advertisers or data brokers.
        </p>
      </Prose>

      <Prose>
        <h2 id="cookies">Cookies and analytics</h2>
        <p>
          <strong>None by default.</strong> The site sets no cookies and runs no analytics, advertising pixels or session recording. Local storage — the
          mechanism that keeps your answers, cart and orders on your device — is not a cookie and is never sent to a server. If we add privacy-preserving,
          cookie-free aggregate analytics to understand which pages are read, we will say so here first, it will not include assessment answers, and it
          will not identify you.
        </p>
      </Prose>

      <Prose>
        <h2 id="third-parties">Hosting and third parties</h2>
        <ul>
          <li>
            <strong>Hosting.</strong> The site is served as static files by a hosting provider. Like any web host, it may keep standard server logs (IP
            address, browser type, pages requested) for security and operations. Those logs never contain assessment answers, which are not transmitted.
          </li>
          <li>
            <strong>Fulfilment and payment.</strong> Orders go to our fulfilment system and payments to the payment provider, as described above.
          </li>
          <li>
            <strong>Prescriber partner.</strong> Consultation requests go to {COMMERCE.prescriberPartner}, a separate registered business.
          </li>
          <li>
            <strong>Fonts.</strong> Fonts are bundled with the site and served from the same place as the pages, so no request goes to a font provider.
          </li>
          <li>
            <strong>Links to sources.</strong> Compound pages link to trial reports and regulator documents. Those sites have their own privacy practices.
          </li>
        </ul>
      </Prose>

      <Prose>
        <h2 id="delete">Deleting your data</h2>
        <ol>
          <li>
            Open the <Link href="/assessment">assessment page</Link> and choose <strong>Start over</strong>. This removes saved answers and the report from
            your browser.
          </li>
          <li>
            Clear this site’s data in your browser settings (usually under privacy, site data or storage). This removes everything stored under this
            origin, including the cart and local order history.
          </li>
          <li>
            For anything you sent us — an order, an email address, a consultation request — email{" "}
            <a href={`mailto:${BRAND.supportEmail}?subject=Delete%20my%20data`}>{BRAND.supportEmail}</a>. We delete what we can; records we are required to
            keep for tax or product-safety reasons are kept only for as long as the law requires.
          </li>
        </ol>
      </Prose>

      <Prose>
        <h2 id="rights">Your rights</h2>
        <p>
          Where UK data-protection law applies to information you send us, you have the right to access it, correct it, have it deleted, and object to or
          restrict its processing. Because assessment data stays in your browser, you exercise those rights over it directly, by deleting it. To exercise
          any right over an order or an email address, email us. You also have the right to complain to the Information Commissioner’s Office.
        </p>
      </Prose>

      <Prose>
        <h2 id="children">Children</h2>
        <p>
          The assessment and the store are for adults. The assessment stops if an age under 18 is entered, and checkout requires confirmation that you are
          18 or over. We do not knowingly collect information from children. If you believe a child has sent us anything, email us and we will delete it.
        </p>
      </Prose>

      <Prose>
        <h2 id="changes">Changes to this notice</h2>
        <p>
          If we change how the site handles information — by adding analytics, accounts or a way to save reports across devices — we will update this
          notice before the change takes effect and change the date at the top. We will not weaken the default position described here without saying
          so plainly.
        </p>
      </Prose>
      <SpecSheet
        items={[
          { label: "Controller", value: BRAND.legalName },
          { label: "Sent by default", value: "Nothing" },
          { label: "Cookies", value: "None" },
          { label: "Contact", value: <a href={`mailto:${BRAND.supportEmail}`} className="link-rule">{BRAND.supportEmail}</a> },
        ]}
      />

      <Prose>
        <h2 id="contact">Contact</h2>
        <p>
          Privacy questions go to <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>. See also the <Link href="/terms">terms</Link> and the{" "}
          <Link href="/safety">safety page</Link>.
        </p>
      </Prose>
    </TrustPage>
  );
}
