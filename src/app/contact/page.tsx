import type { Metadata } from "next";
import {
  AVAILABILITY_NOTE,
  CTA_BUTTON,
  CTA_COPY,
  CTA_HEADING,
  EYEBROW,
  HEADLINE,
  INTRO,
  MAILTO_SUBJECT,
  META_DESCRIPTION,
  PAGE_TITLE,
  SERVICES,
  SERVICE_EMAIL,
} from "../../lib/services";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${PAGE_TITLE} | Open Mirror LLC`,
    description: META_DESCRIPTION,
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${PAGE_TITLE} | Open Mirror LLC`,
    description: META_DESCRIPTION,
  },
};

// Faceless by design: no personal name, photo, or bio anywhere on this page
// or in its metadata. If a title is ever needed here, "owner" is the word.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `${PAGE_TITLE} — Open Mirror LLC`,
  description: META_DESCRIPTION,
  url: "https://openmirrorllc.com/contact",
  email: SERVICE_EMAIL,
  publisher: { "@type": "Organization", name: "Open Mirror LLC" },
};

const MAILTO = `mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(MAILTO_SUBJECT)}`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">

        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
          {EYEBROW}
        </p>

        <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          {HEADLINE}
        </h1>

        {INTRO.map((line) => (
          <p
            key={line}
            className="mt-6 text-pretty text-base font-semibold leading-8 text-[#94a3b8]"
          >
            {line}
          </p>
        ))}

        <section className="mt-12" aria-label="How Open Mirror can help">
          <h2 className="text-2xl font-black tracking-tight">How I can help</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5"
              >
                <h3 className="text-base font-black leading-6">{service.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#94a3b8]">
                  {service.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mt-12 rounded-3xl border border-[#26324c] bg-[#0f1826] p-6 sm:p-8"
          aria-label={CTA_HEADING}
        >
          <h2 className="text-2xl font-black tracking-tight">{CTA_HEADING}</h2>
          <p className="mt-3 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
            {CTA_COPY}
          </p>
          <p className="mt-6">
            <a
              href={MAILTO}
              className={`inline-block rounded-full px-7 py-3.5 text-sm font-black transition hover:opacity-90 ${focusRing}`}
              style={{ background: "var(--om-accent)", color: "var(--om-ink)" }}
            >
              {CTA_BUTTON}
            </a>
          </p>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            Or write directly:{" "}
            <a
              href={MAILTO}
              className={`font-black text-[#7dd3fc] transition hover:underline ${focusRing}`}
            >
              {SERVICE_EMAIL}
            </a>
          </p>
        </section>

        <p className="mt-8 text-sm font-semibold leading-7 text-[#64748b]">
          {AVAILABILITY_NOTE}
        </p>

      </div>
    </main>
  );
}
