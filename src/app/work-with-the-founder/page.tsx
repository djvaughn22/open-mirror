import type { Metadata } from "next";
import WorkWithFounderIntake from "../../components/WorkWithFounderIntake";
import { products } from "../../lib/products";
import {
  BOUNDARIES,
  FOR_LIST,
  offers,
  PROCESS,
  PROOF,
  SERVICE_EMAIL,
  type ServiceOffer,
} from "../../lib/services";

const PAGE_TITLE = "Work With the Founder";
const PAGE_DESCRIPTION =
  "Work directly with the founder of Open Mirror to clarify an idea, shape the right first version, and create a practical path from concept to something real. Offered through Open Mirror LLC.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/work-with-the-founder" },
  openGraph: {
    title: `${PAGE_TITLE} | Open Mirror LLC`,
    description: PAGE_DESCRIPTION,
    url: "/work-with-the-founder",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${PAGE_TITLE} | Open Mirror LLC`,
    description: PAGE_DESCRIPTION,
  },
};

// Accurate structured data only: the service, who offers it, and list prices.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Work With the Founder — Open Mirror LLC",
  description: PAGE_DESCRIPTION,
  url: "https://openmirrorllc.com/work-with-the-founder",
  email: SERVICE_EMAIL,
  brand: { "@type": "Organization", name: "Open Mirror LLC" },
  makesOffer: offers.map((o) => ({
    "@type": "Offer",
    name: o.name,
    description: o.summary,
    price: o.price.replace(/[^0-9.]/g, ""),
    priceCurrency: "USD",
  })),
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
      {children}
    </p>
  );
}

function OfferCard({ o }: { o: ServiceOffer }) {
  return (
    <article
      id={o.id}
      className="flex flex-col gap-4 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7"
      style={{ borderLeft: `5px solid ${o.accent}` }}
    >
      <div>
        {o.kicker && (
          <p
            className="mb-2 text-[11px] font-black uppercase tracking-[0.14em]"
            style={{ color: o.accent }}
          >
            {o.kicker}
          </p>
        )}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-xl font-black text-[#e8edf5]">{o.name}</h3>
          <p className="text-lg font-black" style={{ color: o.accent }}>
            {o.price}
          </p>
        </div>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#94a3b8]">{o.summary}</p>
      </div>

      {o.sections.map((s) => (
        <div key={s.label}>
          <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#94a3b8]">
            {s.label}
          </p>
          <ul className="flex flex-col gap-1.5">
            {s.items.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-sm font-semibold leading-6 text-[#e8edf5]"
              >
                <span aria-hidden style={{ color: o.accent }}>
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-1 flex flex-wrap gap-3">
        {/* data-offer is picked up by the intake form to preselect this offer */}
        <a
          href="#intake"
          data-offer={o.name}
          className="rounded-full px-6 py-2.5 text-sm font-black text-[#0C0C0C]"
          style={{ background: o.accent }}
        >
          Request this →
        </a>
        {o.paymentUrl && (
          <a
            href={o.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#26324c] bg-[#0b1220] px-6 py-2.5 text-sm font-black text-[#e8edf5]"
          >
            Pay for {o.name} →
          </a>
        )}
        {o.schedulingUrl && (
          <a
            href={o.schedulingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#26324c] bg-[#0b1220] px-6 py-2.5 text-sm font-black text-[#e8edf5]"
          >
            Schedule →
          </a>
        )}
      </div>

      {o.note && (
        <p className="text-xs font-semibold leading-5 text-[#64748b]">{o.note}</p>
      )}
    </article>
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
            I help you turn it into something real.
          </h1>
          <p className="mx-auto max-w-lg text-base font-semibold leading-7 text-[#94a3b8]">
            Every site in Open Mirror was once just an idea. I built them, I use
            them, and they&apos;re live right now. You can hire me to bring that
            same clarity and direction to yours.
          </p>
          <a
            href="#offers"
            className="mt-7 inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
          >
            See how it works →
          </a>
        </section>

        {/* 2 — What working with the founder means */}
        <section className="mb-14 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            <strong className="text-[#e8edf5]">
              Open Mirror is the platform and the proof. The founder is the
              person you work with.
            </strong>{" "}
            The websites, engines, games, and products in this studio aren&apos;t
            case studies written after the fact — they&apos;re how I work, in
            public, every day. What you&apos;re hiring is judgment: creative
            direction, simplification, prioritization, product thinking, and a
            practical build path. Not a big agency. Not generic AI consulting.
            You work directly with me, through Open Mirror LLC, in a process
            designed to skip unnecessary meetings and endless back-and-forth.
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

        {/* 4 — The three offers */}
        <section id="offers" className="mb-14 scroll-mt-20">
          <SectionLabel>Three ways to work together</SectionLabel>
          <h2 className="mb-6 text-center text-2xl font-black">
            Pick the one that matches where you are
          </h2>
          <div className="flex flex-col gap-6">
            {offers.map((o) => (
              <OfferCard key={o.id} o={o} />
            ))}
          </div>
        </section>

        {/* 5 — Why the founder / Why Open Mirror */}
        <section className="mb-14 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
          <h2 className="mb-3 text-xl font-black">Why the founder, why Open Mirror</h2>
          <p className="mb-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            I don&apos;t sell strategy I haven&apos;t used. Everything in this
            studio — the faith apps, the family tools, the puzzle-game engine,
            the idea-to-build process — was an idea I defined, simplified, and
            shipped. Most of it gets used in my own house, by my own family,
            every week.
          </p>
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            That&apos;s the skill you&apos;re buying: taking something fuzzy and
            finding the version of it that&apos;s worth building first — then
            actually getting it built. There&apos;s no team you get handed off
            to. If we work together, you work with me.
          </p>
        </section>

        {/* 6 — Portfolio proof */}
        <section className="mb-14">
          <SectionLabel>The proof</SectionLabel>
          <h2 className="mb-2 text-center text-2xl font-black">
            Built here, live now
          </h2>
          <p className="mx-auto mb-6 max-w-md text-center text-sm font-semibold leading-6 text-[#94a3b8]">
            A few of the Open Mirror products, and what each one demonstrates.
            All of them are live — click through and judge for yourself.
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

        {/* 7 — How the process works */}
        <section className="mb-14">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mb-6 text-center text-2xl font-black">
            Four steps, few meetings
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

        {/* 8 — Intake */}
        <section id="intake" className="mb-14 scroll-mt-20">
          <SectionLabel>Start here</SectionLabel>
          <h2 className="mb-6 text-center text-2xl font-black">
            Tell me what you&apos;re building
          </h2>
          <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 sm:p-7">
            <WorkWithFounderIntake />
          </div>
        </section>

        {/* 9 — Boundaries and expectations */}
        <section className="mb-14">
          <SectionLabel>Boundaries, plainly</SectionLabel>
          <ul className="mx-auto flex max-w-lg flex-col gap-2">
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

        {/* 10 — Final call to action */}
        <section className="text-center">
          <h2 className="mb-3 text-2xl font-black">
            If it&apos;s been sitting in your head, that&apos;s the sign.
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm font-semibold leading-6 text-[#94a3b8]">
            Send the intake. You&apos;ll get a direct answer — including
            &quot;this isn&apos;t a fit&quot; if that&apos;s the honest one.
          </p>
          <a
            href="#intake"
            className="inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
          >
            Work with the Founder →
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
