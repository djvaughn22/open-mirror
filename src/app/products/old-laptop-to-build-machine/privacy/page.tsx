import type { Metadata } from "next";

import { SERVICE_TERMS_PATH } from "../../../../lib/deviceRequest";
import { SERVICE_EMAIL } from "../../../../lib/services";

// Privacy notice for the device request workflow specifically. Honest about
// what is actually retained: requests are delivered and kept as email
// correspondence — there is no customer database behind this form. No
// perfect-security claims.

export const metadata: Metadata = {
  title: "Device request privacy notice",
  description:
    "What Open Mirror collects when you submit a device request, why, and how payment information is handled by the invoice provider instead.",
  alternates: {
    canonical: "/products/old-laptop-to-build-machine/privacy",
  },
};

export default function DeviceRequestPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
          Build Machine conversion service
        </p>
        <h1 className="mb-4 text-balance text-center text-3xl font-black leading-[1.1] tracking-tight">
          Privacy notice for device requests
        </h1>
        <p className="mx-auto mb-10 max-w-md text-center text-sm font-semibold leading-6 text-[#94a3b8]">
          What the request form collects, why, and where it goes — in plain
          language.
        </p>

        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-2 text-base font-black tracking-tight">
              What is collected
            </h2>
            <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
              The request form collects your name, email address, optional
              phone number, ZIP code, preferred contact method, a description
              of your device (type, manufacturer, model, age, condition,
              whether it powers on), what you want to use the finished machine
              for, any notes you add, and your required confirmations with the
              terms version and submission time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-black tracking-tight">
              Why it is collected
            </h2>
            <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
              Only to review your request, reply to you, prepare an invoice if
              the request is accepted, coordinate shipping, and keep the work
              tied to one request number. It is not sold, and it is not used
              for advertising.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-black tracking-tight">
              How it is kept
            </h2>
            <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
              Submitted requests are delivered to Open Mirror by email and
              retained as email correspondence for as long as needed to handle
              the request and keep honest business records. There is no
              customer database behind this form. The website itself keeps a
              short-lived copy of your confirmation in your own browser so the
              confirmation page can show it — that copy never leaves your
              browser. Basic, short-lived technical information may be used to
              limit automated abuse of the form; it is not kept as a profile
              of you.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-black tracking-tight">
              Payment information
            </h2>
            <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
              Open Mirror never collects payment information on this website.
              If your request is accepted, payment happens on a secure Novo
              invoice, and your payment details are handled by Novo, PayPal,
              or whichever payment processor runs the method you choose on
              that invoice — under their own privacy terms, not this notice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-black tracking-tight">
              What you must never submit
            </h2>
            <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
              Never enter a password, PIN, encryption key, account credential,
              financial account number, government identification number, or
              private file contents in the request form or in email about a
              request. Open Mirror does not need them and will not ask for
              them.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-black tracking-tight">
              An honest note on security
            </h2>
            <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
              Open Mirror handles request information carefully and shares it
              with no one beyond the delivery and invoicing services named
              above — but no website or email system can promise perfect
              security, and this one doesn&apos;t.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-black tracking-tight">
              Questions about your request
            </h2>
            <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
              Email{" "}
              <a
                href={`mailto:${SERVICE_EMAIL}`}
                className="font-black text-[#7dd3fc] underline"
              >
                {SERVICE_EMAIL}
              </a>{" "}
              with your request number to ask what is on file for your
              request, correct it, or ask for it to be removed once the work
              and its records no longer require it.
            </p>
          </section>
        </div>

        <p className="mt-8 text-center text-xs font-semibold leading-6 text-[#64748b]">
          See also the{" "}
          <a href={SERVICE_TERMS_PATH} className="underline">
            service terms
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
