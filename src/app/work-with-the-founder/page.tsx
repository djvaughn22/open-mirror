import type { Metadata } from "next";
import WorkWithFounderIntake from "../../components/WorkWithFounderIntake";
import { products } from "../../lib/products";
import { BOUNDARIES, ENGAGEMENT, FOR_LIST, PROCESS, PROOF, SERVICE_EMAIL, STATS } from "../../lib/services";

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
        <section className="mb-16 text-center">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
            Open Mirror LLC
          </p>
          <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            You bring the idea.
            <br />
            I make it real.
          </h1>
          <p className="mx-auto max-w-md text-base font-semibold leading-7 text-[#94a3b8]">
            Consulting and digital product creation, one engagement at a time —
            an hour of direction or a product built end to end.
          </p>
          <a
            href="#intake"
            className="mt-8 inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
          >
            Start the conversation →
          </a>
          <p className="mt-9 text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">
            {STATS.join("  ·  ")}
          </p>
        </section>

        {/* 2 — What you're hiring */}
        <section className="mb-16 border-y border-[#26324c] py-9 text-center">
          <p className="mx-auto max-w-lg text-[15px] font-semibold leading-8 text-[#94a3b8]">
            <strong className="text-[#e8edf5]">What you&apos;re hiring is judgment.</strong>{" "}
            Creative direction, simplification, prioritization, product thinking,
            and a practical path from concept to launch. Not an agency. Not AI
            consulting. One person, accountable, through Open Mirror LLC — and
            one engagement at a time: while your project is on the bench,
            it&apos;s the only one there.
          </p>
        </section>

        {/* 3 — Who this is for */}
        <section className="mb-16">
          <SectionLabel>Who this is for</SectionLabel>
          <h2 className="mb-5 text-center text-2xl font-black tracking-tight">
            You have something. It isn&apos;t clear yet.
          </h2>
          <ul className="mx-auto max-w-lg divide-y divide-[#26324c] rounded-2xl border border-[#26324c] bg-[#141d2e]">
            {FOR_LIST.map((item) => (
              <li
                key={item}
                className="px-5 py-3.5 text-sm font-semibold leading-6 text-[#e8edf5]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 4 — Portfolio proof */}
        <section className="mb-16">
          <SectionLabel>The proof</SectionLabel>
          <h2 className="mb-2 text-center text-2xl font-black tracking-tight">
            Built here. Live now.
          </h2>
          <p className="mx-auto mb-6 max-w-md text-center text-sm font-semibold leading-6 text-[#94a3b8]">
            Judge the work, not the pitch — everything below is one click away.
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
        <section className="mb-16">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mb-6 text-center text-2xl font-black tracking-tight">
            Three steps. Few meetings.
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
          <h2 className="mb-6 text-center text-2xl font-black tracking-tight">
            Tell me what you&apos;re making
          </h2>
          <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 sm:p-7">
            <WorkWithFounderIntake />
          </div>
        </section>

        {/* 7 — Boundaries, quietly */}
        <section className="mb-16">
          <ul className="mx-auto flex max-w-lg flex-col gap-1.5">
            {BOUNDARIES.map((b) => (
              <li
                key={b}
                className="text-center text-xs font-semibold leading-6 text-[#64748b]"
              >
                {b}
              </li>
            ))}
          </ul>
        </section>

        {/* 8 — Final call to action */}
        <section className="text-center">
          <h2 className="mb-5 text-2xl font-black tracking-tight">
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
