// ─── Medprovia Form → Email Dispatcher ───────────────────────────────────────
// All submissions (Orders, Verification, Contact) are sent to medprovia@gmail.com
// via Formspree — no env vars needed, works on any static host (Cloudflare Pages).
//
// HOW TO ACTIVATE (one-time, 2 minutes):
//   1. Go to https://formspree.io → sign up with medprovia@gmail.com
//   2. Click "New Form" → name it "Medprovia" → copy the form ID (e.g. xpwzjrgk)
//   3. Replace FORMSPREE_FORM_ID below with your real ID
//   4. Commit & push — emails will start arriving in your Gmail immediately.

const FORMSPREE_FORM_ID = "xzerbjlj"; // → https://formspree.io/f/xzerbjlj → medprovia@gmail.com
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

export const OFFICIAL_EMAIL = "info@medprovia.com";

export type EmailPayload = {
  type: "verification" | "order" | "contact" | "quote" | "newsletter";
  subject: string;
  senderName?: string | undefined;
  senderEmail?: string | undefined;
  clinicName?: string | undefined;
  data: Record<string, unknown>;
};

export type SendResult = {
  success: boolean;
  message: string;
  timestamp: string;
};

/**
 * Flatten the payload into a simple key→value object for Formspree.
 * Formspree emails every field as a table row — no template setup needed.
 */
function flattenPayload(payload: EmailPayload): Record<string, string> {
  const sender = payload.senderEmail || OFFICIAL_EMAIL;
  const flat: Record<string, string> = {
    _subject: payload.subject,
    email: sender,
    _replyto: sender,
    "Form type": payload.type.toUpperCase(),
    "Sent to": OFFICIAL_EMAIL,
    "Sender name": payload.senderName || "—",
    "Sender email": sender,
    "Clinic name": payload.clinicName || "—",
  };

  for (const [key, value] of Object.entries(payload.data)) {
    if (value === undefined || value === null || value === "") continue;
    flat[key] = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
  }

  flat["Platform"] = "medprovia.com B2B Portal";
  flat["Timestamp"] = new Date().toISOString();
  return flat;
}

/**
 * Send a form submission to medprovia@gmail.com via Formspree.
 * Falls back to localStorage + console if Formspree ID is not yet configured.
 */
export async function sendEmailNotification(payload: EmailPayload): Promise<SendResult> {
  const timestamp = new Date().toISOString();

  // Always persist locally — no submission is ever lost
  try {
    const existing = JSON.parse(localStorage.getItem("medprovia_submissions") || "[]");
    existing.unshift({ timestamp, ...payload });
    localStorage.setItem("medprovia_submissions", JSON.stringify(existing.slice(0, 50)));
  } catch {
    // ignore
  }

  console.group(`[Medprovia] ${payload.subject}`);
  console.table(flattenPayload(payload));
  console.groupEnd();

  // Skip real send if ID not configured
  if (!FORMSPREE_FORM_ID || (FORMSPREE_FORM_ID as string) === "REPLACE_WITH_YOUR_FORMSPREE_ID") {
    console.warn("[Medprovia] Formspree ID not set — email not sent. See src/lib/email.ts");
    return { success: true, message: "Logged locally (Formspree not configured)", timestamp };
  }

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(flattenPayload(payload)),
    });

    if (res.ok) {
      return { success: true, message: `Delivered to ${OFFICIAL_EMAIL}`, timestamp };
    }

    const err = await res.json().catch(() => ({}));
    console.error("[Medprovia] Formspree error:", err);
    return { success: false, message: "Formspree delivery failed", timestamp };
  } catch (err) {
    console.error("[Medprovia] Network error:", err);
    return { success: false, message: "Network error — please email us directly", timestamp };
  }
}
