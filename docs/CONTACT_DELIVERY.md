# Contact form delivery — setup and verification

The `/contact` form posts to `POST /api/intake`
(`src/app/api/intake/route.ts`), which emails the inquiry to the studio
address using [Resend](https://resend.com). This document lists exactly what
has to be configured for real delivery, and how to confirm it works.

No secret values live in this repository. The keys below are set in the
hosting environment (Vercel project → Settings → Environment Variables).

## Required environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `RESEND_API_KEY` | **Yes, for live delivery** | Resend API key. When absent, `/api/intake` returns `503` and the form falls back to the visitor's own email app — no inquiry is lost, and the user is never shown a fake "Sent." |
| `INTAKE_FROM_EMAIL` | Optional | The `From:` address for the notification email. Must be on a domain verified in Resend. Defaults to `Open Mirror LLC <ask@openmirrorllc.com>`. |

The recipient (`to`) is always `SERVICE_EMAIL` (`ask@openmirrorllc.com`, from
`src/lib/products.ts` → `STUDIO.email`). The visitor's own address is set as
`replyTo`, so replying goes straight back to them.

## Sender / domain configuration in Resend

1. Create a Resend account and add the sending domain (e.g.
   `openmirrorllc.com`).
2. Add the DNS records Resend provides (SPF, DKIM) at the domain registrar
   (GoDaddy, for this estate) and wait for Resend to show the domain as
   **Verified**.
3. Create an API key scoped to sending only. Copy it once.
4. In Vercel, set `RESEND_API_KEY` to that value for the Production (and
   Preview, if desired) environment.
5. If sending from an address other than `ask@openmirrorllc.com`, set
   `INTAKE_FROM_EMAIL` to an address on the verified domain.
6. Redeploy so the new environment variables take effect.

Until the domain is verified, Resend will reject sends and `/api/intake`
returns `502` — the form falls back to the email app, same as the `503`
path, so nothing breaks for visitors in the meantime.

## How the honesty contract works

`/api/intake` only returns `200 { ok: true }` when the message was actually
sent (or was silently dropped spam). The form shows "Sent." **only** on that
`200`. Every other outcome falls back to opening the visitor's email app
prefilled with their message:

- `503` — `RESEND_API_KEY` not set (delivery not configured)
- `502` — Resend rejected the send (e.g. domain not yet verified)
- `429` — client hit the per-instance rate limit
- `400` — invalid/missing fields (the client validates first, so this is rare)

## Spam and abuse protection

- **Honeypot** — a hidden `company` field. Real users never see it; bots
  that fill every field trip it, and the server accepts-and-drops those
  quietly (returns `200`, sends nothing).
- **Rate limit** — best-effort in-memory limit of 5 submissions per client
  per 10-minute window, keyed on `x-forwarded-for`. Serverless instances
  don't share memory, so this throttles per warm instance rather than
  globally; it blunts a naive flood without needing an external store. For
  stricter global limits, move this to a shared store (e.g. Upstash/Redis)
  — noted as a future option, not required for launch.
- **Length caps** — every field is trimmed and length-capped server-side
  before use.

## Verifying end to end

1. Set `RESEND_API_KEY` (and `INTAKE_FROM_EMAIL` if used) in Vercel and
   redeploy.
2. Open `/contact`, fill in a real message, and submit.
3. Confirm the form shows the green **"Sent."** state (not the email-app
   fallback message).
4. Confirm the email arrives at `ask@openmirrorllc.com`, and that replying
   to it goes to the address you entered.
5. To confirm the honest-fallback path, temporarily unset `RESEND_API_KEY`
   in a Preview deployment and submit — the form should open your email app
   instead of claiming success.

## Local development

Without `RESEND_API_KEY` in `.env.local`, the form always uses the email-app
fallback locally — which is the correct, honest behavior, and lets you test
the whole flow without sending real email.
