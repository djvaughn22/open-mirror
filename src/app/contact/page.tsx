import type { Metadata } from "next";
import {
  AVAILABILITY_NOTE,
  CORE_MESSAGE,
  META_DESCRIPTION,
  PAGE_TITLE,
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
// or in its metadata. Say-less rewrite (owner, 2026-07-19): the email address
// is enough — the intake form and /api/intake route were removed with it.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `${PAGE_TITLE} — Open Mirror LLC`,
  description: META_DESCRIPTION,
  url: "https://openmirrorllc.com/contact",
  email: SERVICE_EMAIL,
  publisher: { "@type": "Organization", name: "Open Mirror LLC" },
};

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">

        <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          Contact
        </h1>

        <p className="mt-8 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
          {CORE_MESSAGE}
        </p>
        <p className="mt-5 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
          For general questions:{" "}
          <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc]">
            {SERVICE_EMAIL}
          </a>
        </p>

        <p className="mt-10">
          <a
            href={`mailto:${SERVICE_EMAIL}`}
            className="inline-block rounded-full px-6 py-3 text-sm font-black"
            style={{ background: "var(--om-accent)", color: "var(--om-ink)" }}
          >
            Send an email
          </a>
        </p>

        <p className="mt-6 text-sm font-semibold leading-7 text-[#64748b]">
          {AVAILABILITY_NOTE}
        </p>

      </div>
    </main>
  );
}
