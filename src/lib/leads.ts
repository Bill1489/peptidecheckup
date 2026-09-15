/**
 * Lead capture (newsletter, report-by-email, consultation requests,
 * clinician-review requests).
 *
 * The site is a static export with no backend, so leads are POSTed as JSON to
 * an external webhook (Zapier, Make, HubSpot, a serverless function…) set via
 * `NEXT_PUBLIC_LEAD_WEBHOOK`. When unset, the request is simulated so every
 * flow can be exercised end-to-end, and a copy is kept in localStorage so the
 * demo can show captured leads.
 */

export type LeadKind = "report" | "report_email" | "newsletter" | "consultation" | "restock";

export interface LeadPayload {
  kind: LeadKind;
  email: string;
  name?: string;
  phone?: string;
  /** Where on the site the lead was captured */
  source?: string;
  reportId?: string;
  generatedAt?: string;
  goal?: string;
  compounds?: string[];
  productSlug?: string;
  countryCode?: string;
  jurisdiction?: string;
  /** Explicit consent captured at the point of submission */
  consent?: boolean;
  utm?: Record<string, string>;
  notes?: string;
}

export interface LeadResult {
  ok: boolean;
  /** true when a webhook actually received the payload; false when simulated */
  delivered: boolean;
  error?: string;
}

const SIMULATED_DELAY_MS = 600;
const LOCAL_KEY = "peptidecheckup.leads.v1";

function rememberLocally(payload: LeadPayload) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(window.localStorage.getItem(LOCAL_KEY) ?? "[]") as unknown[];
    existing.push({ ...payload, submittedAt: new Date().toISOString() });
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(existing.slice(-50)));
  } catch {
    /* ignore quota / privacy mode */
  }
}

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_WEBHOOK;
  rememberLocally(payload);

  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    return { ok: true, delivered: false };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
    });
    if (!res.ok) return { ok: false, delivered: false, error: `Webhook responded ${res.status}` };
    return { ok: true, delivered: true };
  } catch (err) {
    return { ok: false, delivered: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
