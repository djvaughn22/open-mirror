import type { Metadata } from "next";

import {
  PRIVACY_PATH,
  TERMS_EFFECTIVE_DATE,
  TERMS_VERSION,
} from "../../../../lib/deviceRequest";
import { SERVICE_EMAIL } from "../../../../lib/services";

// Service terms for the Build Machine conversion service only. Deliberately
// separate from the site-wide /disclaimer (owner's exact copy — untouched).
// Plain language, no invented policy: anything not yet decided by the owner
// says "confirmed in writing during review" instead of pretending a rule
// exists. Not presented as attorney-approved legal language.

export const metadata: Metadata = {
  title: "Build Machine service terms",
  description:
    "Plain-language service terms for the Open Mirror Build Machine conversion service.",
  alternates: {
    canonical: "/products/old-laptop-to-build-machine/service-terms",
  },
};

const TERMS: { heading: string; body: string[] }[] = [
  {
    heading: "Ownership and authorization",
    body: [
      "You must own the device you send, or have clear permission from its owner to request this work. Open Mirror will not knowingly accept a device reported lost or stolen, or a device controlled by a school, employer, government agency, leasing company, or other organization.",
    ],
  },
  {
    heading: "Intentional data erasure",
    body: [
      "This service includes intentionally erasing the device's internal drive as part of installing a clean operating system. Erased data may be permanently unrecoverable. Backing up everything you want to keep, before anything ships, is entirely your responsibility. Backup, data recovery, and file transfer are not part of this service, and this is not a certified data-destruction service.",
    ],
  },
  {
    heading: "Existing hardware condition",
    body: [
      "Your device arrives as used hardware in whatever condition it is genuinely in. Open Mirror does not repair hardware, does not warrant existing components, and does not guarantee how long aging hardware will keep working.",
    ],
  },
  {
    heading: "Request review and acceptance",
    body: [
      "Every request is reviewed individually. Submitting a request does not guarantee acceptance. Open Mirror may accept a request, ask for more information, or decline it — including declining devices that are unsafe, locked, reported lost or stolen, organizationally managed, prohibited to ship, or otherwise unsuitable.",
    ],
  },
  {
    heading: "Payment",
    body: [
      "No payment is taken on this website, and the request form never asks for payment information. If a request is accepted, Open Mirror sends a secure Novo invoice by email. Depending on the payment options enabled on that invoice, you may pay through PayPal, Venmo, card, or another method shown on the invoice. Shipping instructions are sent only after payment is confirmed.",
    ],
  },
  {
    heading: "Shipping",
    body: [
      "Do not ship anything until Open Mirror has accepted your request, confirmed payment, and sent written shipping instructions. You are responsible for inbound shipping and for packing the device safely; a sturdy reused box with proper padding is fine, and original manufacturer packaging is preferred when you have it. Your request number must accompany the shipment. Return-shipping handling is confirmed in writing during review, before any invoice is sent.",
    ],
  },
  {
    heading: "If the received device differs from the request",
    body: [
      "If a received device differs materially from what was described — different model, undisclosed damage, a firmware lock, an unsafe battery — work pauses and Open Mirror contacts you before anything else happens. Options at that point, including return of the device, are worked out with you in writing under the same request number.",
    ],
  },
  {
    heading: "Cancellation and refunds",
    body: [
      "Cancellation and refund handling for an accepted request is confirmed with you in writing during review, before any invoice is sent, so you know exactly where you stand before paying anything. Declined requests owe nothing.",
    ],
  },
];

export default function ServiceTermsPage() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
          Build Machine conversion service
        </p>
        <h1 className="mb-4 text-balance text-center text-3xl font-black leading-[1.1] tracking-tight">
          Service terms
        </h1>
        <p className="mx-auto mb-10 max-w-md text-center text-sm font-semibold leading-6 text-[#94a3b8]">
          Plain language, on purpose. These terms cover the Build Machine
          conversion service only. Version {TERMS_VERSION} · effective{" "}
          {TERMS_EFFECTIVE_DATE}.
        </p>

        <div className="flex flex-col gap-6">
          {TERMS.map((t) => (
            <section key={t.heading}>
              <h2 className="mb-2 text-base font-black tracking-tight">{t.heading}</h2>
              {t.body.map((p) => (
                <p key={p} className="text-sm font-semibold leading-7 text-[#94a3b8]">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5">
          <h2 className="mb-2 text-base font-black tracking-tight">Contact</h2>
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            Questions about these terms or about a request? Email{" "}
            <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc] underline">
              {SERVICE_EMAIL}
            </a>{" "}
            and include your request number if you have one.
          </p>
        </section>

        <p className="mt-8 text-center text-xs font-semibold leading-6 text-[#64748b]">
          See also the{" "}
          <a href={PRIVACY_PATH} className="underline">
            privacy notice for device requests
          </a>{" "}
          and the{" "}
          <a href="/disclaimer" className="underline">
            general Open Mirror disclaimer
          </a>
          .
        </p>
      </div>
    </main>
  );
}
