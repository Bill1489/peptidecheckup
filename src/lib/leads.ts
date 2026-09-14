/**
 * Clinician-review lead capture.
 *
 * The site is a static export with no backend, so leads are POSTed as JSON to
 * an external webhook (Zapier, Make, a serverless function…) configured via
 * `NEXT_PUBLIC_LEAD_WEBHOOK`. When the variable is not set, the request is
 * simulated so the UI flow can be exercised end-to-end.
 */

export interface LeadPayload {
  email: string;
  name?: string;
  reportId: string;
  generatedAt: string;
  goal?: string;
  compounds: string[];
  countryCode?: string;
  jurisdiction: string;
  /** Explicit consent captured in the assessment (always true when this is called) */
  consent: true;
  source: "report";
}

export interface LeadResult {
  ok: boolean;
  /** true when a webhook actually received the payload; false when simulated */
  delivered: boolean;
  error?: string;
}

const SIMULATED_DELAY_MS = 600;

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_WEBHOOK;

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
    if (!res.ok) {
      return { ok: false, delivered: false, error: `Webhook responded ${res.status}` };
    }
    return { ok: true, delivered: true };
  } catch (err) {
    return { ok: false, delivered: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
