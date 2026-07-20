# PayPal + Novo Manual Setup (for DJ)

**No PayPal API integration is required.** The website never touches
payment. It only collects device requests; you invoice manually through
Novo. No PayPal secret, Novo credential, or bank detail goes anywhere near
the repository — ever.

## One-time account setup

1. **Create a separate PayPal Business account for Open Mirror LLC.**
   Use an Open Mirror email address and the LLC's details. Keep your
   personal PayPal completely separate — never mix the two.
2. **Link Novo in the PayPal Wallet** of that business account (bank
   linking, small-deposit verification if asked).
3. **Connect PayPal through Novo Apps** (Novo dashboard → Apps → PayPal).
4. **Enable PayPal on Novo Invoices** so invoices offer PayPal/Venmo/card,
   whichever Novo shows as available.

## Per-request workflow

1. A device request arrives by email with a request number like
   `OM-DEV-XXXXXX` (see `DEVICE_REQUEST_OPERATIONS.md`).
2. Review it. Reply: accepted, more information needed, or declined.
3. If accepted, **create the invoice manually in Novo** using the
   copy-ready block at the bottom of the notification email.
4. **Include the request number on the invoice** (line item or memo).
5. The customer pays on the hosted invoice.
6. **Confirm payment inside Novo or PayPal** — never from a screenshot.
7. **Only after confirmed payment**, send shipping instructions.

## Never

- Never use Friends and Family for a customer payment.
- Never ask a customer to ship before you've accepted the request and
  confirmed payment.
- Never put a PayPal, Novo, or bank secret into the repository, an env
  file that gets committed, or any web page.

## Remaining environment configuration (to turn the form's email delivery on)

In the Vercel project **open-mirror** → Settings → Environment Variables,
add these three (Production), then redeploy:

| Name | What to put in it |
| --- | --- |
| `RESEND_API_KEY` | An API key from your Resend account |
| `DEVICE_REQUEST_NOTIFY_EMAIL` | The inbox where you want requests (e.g. ask@openmirrorllc.com) |
| `DEVICE_REQUEST_FROM_EMAIL` | A sender on a Resend-verified domain, e.g. `Open Mirror <requests@openmirrorllc.com>` |

Until those are set, the form still works safely: submitting composes the
request in the customer's own email app instead, and nothing is lost.
Optional kill switch: set `DEVICE_REQUEST_FORM_ENABLED=0` to turn online
submission off.

## Final launch test

1. Open `/products/old-laptop-to-build-machine` on your phone and desktop.
2. Submit one test request **using your own email** (device type Laptop,
   manufacturer "Test — ignore").
3. Confirm: confirmation page shows a request number; the notification
   email arrives; the customer confirmation email arrives and says
   **do not ship yet**.
4. Create one $1 test invoice in Novo to yourself, pay it, confirm it shows
   paid, then refund/void it in Novo.
5. Delete the test request email thread when done.
