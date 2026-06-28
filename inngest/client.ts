import { Inngest } from "inngest";

// `id` is required by Inngest and must be a non-empty string, so fall back to a
// stable default when INNGEST_ID is not set (e.g. local dev). The event/signing
// keys are genuinely optional — the Inngest dev server works without them.
export const inngest = new Inngest({
  id: process.env.INNGEST_ID || "nextcrm-app",
  name: process.env.INNGEST_APP_NAME || "NextCRM",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
