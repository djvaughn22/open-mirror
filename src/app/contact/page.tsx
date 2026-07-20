import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import {
  AVAILABILITY_NOTE,
  CORE_MESSAGE,
  FIT_MESSAGE,
  META_DESCRIPTION,
  PAGE_TITLE,
  PRIVACY_NOTE,
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
// or in its metadata. The studio's public identity lives in src/lib/owner.ts
// alone, and it stays empty. This is a ContactPage, not a person or a
// professional-service listing. Independence and conflict language lives on
// /disclaimer (linked from the shared footer) — never repeated here.
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
        {/* 1 — Heading + the two short paragraphs. Nothing else above the form. */}
        <section className="mb-12">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
            Open Mirror LLC
          </p>
          <h1 className="mb-5 text-balance text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl">
            Project inquiry
          </h1>
          <p className="max-w-prose text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
            {FIT_MESSAGE}
          </p>
          <p className="mt-4 max-w-prose text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
            {CORE_MESSAGE} Send a project inquiry to{" "}
            <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc]">
              {SERVICE_EMAIL}
            </a>{" "}
            or use the form below.
          </p>
        </section>

        {/* 2 — Form (the single primary action) */}
        <section id="idea" className="mb-6 scroll-mt-20">
          <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 sm:p-7">
            <ContactForm />
          </div>
        </section>

        {/* 3 — Availability + privacy, once each, small. */}
        <p className="mx-auto mb-2 max-w-md text-center text-xs font-semibold leading-6 text-[#94a3b8]">
          {AVAILABILITY_NOTE}
        </p>
        <p className="mx-auto mb-14 max-w-md text-center text-xs font-semibold leading-6 text-[#64748b]">
          {PRIVACY_NOTE}
        </p>

        <p className="text-center text-xs font-semibold text-[#64748b]">
          Open Mirror LLC ·{" "}
          <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc]">
            {SERVICE_EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}
