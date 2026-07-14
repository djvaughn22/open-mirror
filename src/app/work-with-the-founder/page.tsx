import type { Metadata } from "next";
import WorkWithFounderIntake from "../../components/WorkWithFounderIntake";
import { products } from "../../lib/products";
import { ENGAGEMENT, FOR_LIST, PROCESS, PROOF, SERVICE_EMAIL } from "../../lib/services";

const PAGE_TITLE = "Work With the Founder";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: ENGAGEMENT,
  alternates: { canonical: "/work-with-the-founder" },
  openGraph: {
    title: `${PAGE_TITLE} | Open Mirror LLC`,
    description: ENGAGEMENT,
    url: "/work-with-the-founder",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${PAGE_TITLE} | Open Mirror LLC`,
    description: ENGAGEMENT,
  },
};

// Accurate structured data only: the service and who offers it. No prices —
// terms are set per engagement.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Work With the Founder — Open Mirror LLC",
  description: ENGAGEMENT,
  url: "https://openmirrorllc.com/work-with-the-founder",
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

export default function WorkWithTheFounder() {
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
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
            Open Mirror LLC
          </p>
          <h1 className="mb-5 text-4xl font-black leading-tight sm:text-5xl">
            You bring the idea.
            <br />
            We make it real.
          </h1>
          <p className="mx-auto max-w-lg text-base font-semibold leading-7 text-[#94a3b8]">
            Consulting and digital product creation, directly with the founder.
            One engagement, shaped to your project — an hour of direction or a
            product built end to end.
          </p>
          <a
            href="#intake"
            className="mt-7 inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
          >
            Start the conversation →
          </a>
        </section>

        {/* 2 — What this is */}
        <section className="mb-14 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            <strong className="text-[#e8edf5]">
              No packages. No menus. No meetings you don&apos;t need.
            </strong>{" "}
            You describe the project; the engagement is scoped to fit it. Scope
            and terms depend on what you&apos;re making — you&apos;ll know both
            before anything starts.
          </p>
        </section>

        {/* 3 — Who this is for */}
        <section className="mb-14">
          <SectionLabel>Who this is for</SectionLabel>
          <h2 className="mb-5 text-center text-2xl font-black">
            You have something. It isn&apos;t clear yet.
          </h2>
          <ul className="mx-auto flex max-w-lg flex-col gap-2.5">
            {FOR_LIST.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-[#26324c] bg-[#141d2e] px-5 py-3.5 text-sm font-semibold leading-6 text-[#e8edf5]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 4 — Portfolio proof */}
        <section className="mb-14">
          <SectionLabel>The proof</SectionLabel>
          <h2 className="mb-2 text-center text-2xl font-black">
            Built here, live now
          </h2>
          <p className="mx-auto mb-6 max-w-md text-center text-sm font-semibold leading-6 text-[#94a3b8]">
            Every product below is live. Click through and judge for yourself.
          </p>
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
                  <h3 className="text-base font-black">
                    {p.name}
                    <span style={{ color: p.accent }}>.com</span>
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">
                    {p.proves}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 5 — How it works */}
        <section className="mb-14">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mb-6 text-center text-2xl font-black">
            Three steps, few meetings
          </h2>
          <ol className="flex flex-col gap-3">
            {PROCESS.map((step, i) => (
              <li
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5"
              >
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#38BDF8] text-sm font-black text-[#0C0C0C]"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-black">{step.title}</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 6 — Intake */}
        <section id="intake" className="mb-14 scroll-mt-20">
          <SectionLabel>Start here</SectionLabel>
          <h2 className="mb-6 text-center text-2xl font-black">
            Tell us what you&apos;re making
          </h2>
          <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 sm:p-7">
            <WorkWithFounderIntake />
          </div>
        </section>

        {/* 7 — Final call to action */}
        <section className="text-center">
          <h2 className="mb-3 text-2xl font-black">
            If it&apos;s been sitting in your head, that&apos;s the sign.
          </h2>
          <a
            href="#intake"
            className="inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
          >
            Start the conversation →
          </a>
          <p className="mt-8 text-xs font-semibold text-[#64748b]">
            Services offered through Open Mirror LLC ·{" "}
            <a href={`mailto:${SERVICE_EMAIL}`} className="font-black text-[#7dd3fc]">
              {SERVICE_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
