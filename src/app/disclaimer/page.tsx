import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "What to understand before relying on Open Mirror LLC websites, software, products, and content.",
  alternates: { canonical: "/disclaimer" },
};

// Full disclaimer (owner's brief, 2026-07-19). Ten sections carry the whole
// thing: general information, as-is, not professional advice, AI, third
// parties, trademarks, user responsibility, limitation of responsibility,
// independent ownership, and questions. The employer is never named, never
// titled. Change words only on the owner's instruction.

const INTRO =
  "Open Mirror LLC creates and publishes original software, websites, games, creative tools, digital products, and informational resources. Please use them thoughtfully and understand the following before relying on anything published here.";

const SECTIONS = [
  {
    heading: "General information",
    copy: "Open Mirror content and products are provided for general informational, educational, creative, and entertainment purposes. They may be changed, improved, removed, or discontinued at any time.",
  },
  {
    heading: "Provided as-is",
    copy: "Websites, software, downloads, recommendations, and other materials are provided “as is” and “as available.” Open Mirror LLC does not guarantee that every feature will always be available, uninterrupted, accurate, complete, secure, or suitable for every person or purpose.",
  },
  {
    heading: "Not professional advice",
    copy: "Nothing published by Open Mirror LLC should be treated as legal, financial, medical, mental-health, safety, employment, or other professional advice. Important decisions should be reviewed with an appropriately qualified professional.",
  },
  {
    heading: "Artificial intelligence",
    copy: "Some Open Mirror products may use artificial intelligence to organize information, generate ideas, or assist with creative work. AI-generated results can be incomplete, outdated, or incorrect. Users are responsible for reviewing and verifying outputs before relying on, publishing, purchasing, or acting on them.",
  },
  {
    heading: "Third-party services",
    copy: "Open Mirror products may reference or connect to third-party websites, stores, platforms, videos, APIs, products, or services. Open Mirror LLC does not control those third parties and is not responsible for their availability, content, security, policies, pricing, or actions.",
  },
  {
    heading: "Names and trademarks",
    copy: "Third-party names, trademarks, logos, media, and other property belong to their respective owners. Their appearance does not imply sponsorship, partnership, approval, or endorsement unless explicitly stated.",
  },
  {
    heading: "Your responsibility",
    copy: "You are responsible for how you use Open Mirror products, the information you provide, the decisions you make, and any files, accounts, devices, purchases, or third-party services involved. Maintain appropriate backups and independently verify anything important.",
  },
  {
    heading: "Limitation of responsibility",
    copy: "To the fullest extent permitted by law, Open Mirror LLC is not responsible for losses, damages, interruptions, missed opportunities, data loss, device problems, purchasing decisions, or other consequences resulting from the use of—or inability to use—its products, content, links, or third-party services.",
  },
  {
    heading: "Independent ownership",
    copy: "Open Mirror LLC is independently owned and operated. Nothing published by Open Mirror LLC is sponsored by, affiliated with, endorsed by, or representative of the owner’s full-time employer.",
  },
  {
    heading: "Questions",
    copy: "Questions about this disclaimer or any Open Mirror product may be sent to ask@openmirrorllc.com.",
  },
];

const EMAIL = "ask@openmirrorllc.com";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]";

/** Renders the section copy, linking the email address where it appears. */
function SectionCopy({ copy }: { copy: string }) {
  if (!copy.includes(EMAIL)) return <>{copy}</>;
  const [before, after] = copy.split(EMAIL);
  return (
    <>
      {before}
      <a
        href={`mailto:${EMAIL}`}
        className={`font-black text-[#7dd3fc] transition hover:underline ${focusRing}`}
      >
        {EMAIL}
      </a>
      {after}
    </>
  );
}

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">

        <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          Disclaimer
        </h1>

        <p className="mt-8 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
          {INTRO}
        </p>

        <div className="mt-10 divide-y divide-[#1d2941] rounded-3xl border border-[#26324c] bg-[#0f1826] px-6 sm:px-8">
          {SECTIONS.map((section) => (
            <section key={section.heading} className="py-6">
              <h2 className="text-lg font-black tracking-tight">{section.heading}</h2>
              <p className="mt-2 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
                <SectionCopy copy={section.copy} />
              </p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm font-semibold leading-7 text-[#64748b]">
          Last updated: July 2026
        </p>

      </div>
    </main>
  );
}
