import type { Metadata } from "next";
import TalkWithOwnerIntake from "../../components/TalkWithOwnerIntake";
import { products } from "../../lib/products";
import {
  AVAILABILITY,
  DECIDE_LIST,
  ENGAGEMENT,
  PROOF,
  SCOPE_LINE,
  SERVICE_EMAIL,
  TIERS,
} from "../../lib/services";

const PAGE_TITLE = "Talk with the Owner";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: ENGAGEMENT,
  alternates: { canonical: "/talk-with-the-owner" },
  openGraph: {
    title: `${PAGE_TITLE} | Open Mirror LLC`,
    description: ENGAGEMENT,
    url: "/talk-with-the-owner",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${PAGE_TITLE} | Open Mirror LLC`,
    description: ENGAGEMENT,
  },
};

// Accurate structured data only: the service and who offers it. No personal
// identity — the owner's public profile lives in src/lib/owner.ts alone.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Talk with the Owner — Open Mirror LLC",
  description: ENGAGEMENT,
  url: "https://openmirrorllc.com/talk-with-the-owner",
  email: SERVICE_EMAIL,
  brand: { "@type": "Organization", name: "Open Mirror LLC" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
      {children}
    </p>
  );
}

export default function TalkWithTheOwner() {
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
        {/* 1 — Hero */}
        <section className="mb-14 text-center">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
            Open Mirror LLC
          </p>
          <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Bring me what you built.
          </h1>
          <p className="mx-auto max-w-md text-base font-semibold leading-7 text-[#94a3b8]">
            You started. You made something.
            <br />
            Now you need the next real step.
            <br />
            Talk directly with the owner of Open Mirror LLC.
          </p>
          <a
            href="#intake"
            className="mt-8 inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
          >
            Tell Me What You Are Building
          </a>
        </section>

        {/* 2 — What you get */}
        <section className="mb-14">
          <SectionLabel>Get a clear production path</SectionLabel>
          <p className="mb-4 text-center text-sm font-semibold leading-6 text-[#94a3b8]">
            Submit what you have. The owner helps you decide:
          </p>
          <ul className="mx-auto max-w-sm divide-y divide-[#26324c] rounded-2xl border border-[#26324c] bg-[#141d2e]">
            {DECIDE_LIST.map((item) => (
              <li
                key={item}
                className="px-5 py-3 text-sm font-semibold leading-6 text-[#e8edf5]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 3 — The help, plain */}
        <section className="mb-14">
          <SectionLabel>Three kinds of help</SectionLabel>
          <div className="flex flex-col gap-3">
            {TIERS.map((t, i) => (
              <div
                key={t.name}
                className="flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5"
              >
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#38BDF8] text-sm font-black text-[#0C0C0C]"
                >
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-base font-black">{t.name}</h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">
                    {t.how}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs font-semibold leading-6 text-[#64748b]">
            {SCOPE_LINE}
          </p>
        </section>

        {/* 4 — Availability */}
        <section className="mb-14 border-y border-[#26324c] py-8 text-center">
          <h2 className="mb-3 text-xl font-black tracking-tight">
            Built around real life.
          </h2>
          <p className="mx-auto max-w-md text-sm font-semibold leading-7 text-[#94a3b8]">
            {AVAILABILITY}
          </p>
        </section>

        {/* 5 — Intake */}
        <section id="intake" className="mb-14 scroll-mt-20">
          <SectionLabel>Tell me what you are building</SectionLabel>
          <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 sm:p-7">
            <TalkWithOwnerIntake />
          </div>
        </section>

        {/* 6 — Portfolio proof */}
        <section className="mb-14">
          <SectionLabel>Built here.</SectionLabel>
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
          Services offered through Open Mirror LLC ·{" "}
          <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc]">
            {SERVICE_EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}
