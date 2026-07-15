import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import { products } from "../../lib/products";
import {
  CORE_MESSAGE,
  CORE_MESSAGE_SHORT,
  META_DESCRIPTION,
  PAGE_TITLE,
  PRIVACY_NOTE,
  PROOF,
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
// professional-service listing.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `${PAGE_TITLE} — Open Mirror LLC`,
  description: META_DESCRIPTION,
  url: "https://openmirrorllc.com/contact",
  email: SERVICE_EMAIL,
  publisher: { "@type": "Organization", name: "Open Mirror LLC" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
      {children}
    </p>
  );
}

export default function Contact() {
  // Join proof picks with the product registry so names, links, accents, and
  // emoji stay in sync with the single source of truth.
  const proof = PROOF.flatMap(({ product, proves }) => {
    const p = products.find((x) => x.name === product);
    return p ? [{ ...p, proves }] : [];
  });

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-2xl px-5 py-14">
        {/* 1 — Hero + core message */}
        <section className="mb-12 text-center">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
            Open Mirror LLC
          </p>
          <h1 className="mb-5 text-balance text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl">
            Have an idea you want to bring to life?
          </h1>
          <p className="mx-auto hidden max-w-md text-base font-semibold leading-7 text-[#94a3b8] sm:block">
            {CORE_MESSAGE}
          </p>
          <p className="mx-auto max-w-md text-base font-semibold leading-7 text-[#94a3b8] sm:hidden">
            {CORE_MESSAGE_SHORT}
          </p>
          <a
            href="#idea"
            className="mt-8 inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
          >
            Share your idea
          </a>
        </section>

        {/* 2 — Form */}
        <section id="idea" className="mb-6 scroll-mt-20">
          <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 sm:p-7">
            <ContactForm />
          </div>
        </section>

        {/* 3 — Privacy note */}
        <p className="mx-auto mb-14 max-w-md text-center text-xs font-semibold leading-6 text-[#64748b]">
          {PRIVACY_NOTE}
        </p>

        {/* 4 — Quiet portfolio proof */}
        <section className="mb-14">
          <SectionLabel>Already live</SectionLabel>
          <div className="flex flex-col gap-3">
            {proof.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pop flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#1c2740]"
              >
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <h2 className="text-base font-black">
                    {p.name}
                    <span style={{ color: p.accent }}>.com</span>
                    {p.status !== "live" && p.status !== "foundation" && (
                      <span className="ml-2 align-middle text-[10px] font-black uppercase tracking-wider text-[#64748b]">
                        {p.status}
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">
                    {p.proves}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

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
