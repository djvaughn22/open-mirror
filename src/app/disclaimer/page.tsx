import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "What to understand before relying on Open Mirror LLC websites, software, products, and content.",
  alternates: { canonical: "/disclaimer" },
};

// Full disclaimer (owner's brief, 2026-07-19; property-by-property revision,
// owner's brief 2026-11-03). Each site is read in light of its own purpose —
// there is no blanket "informational or entertainment" label — and Scripture
// on CrossHeartPray sits outside the general limits. Then: as-is, not
// professional advice, AI, third parties, trademarks, user responsibility,
// limitation of responsibility, independent ownership, and questions.
// Change words only on the owner's instruction.

const INTRO =
  "Open Mirror LLC publishes a group of separate websites. This page applies to all of them, and each site's About page covers what is specific to that site.";

const SECTIONS = [
  {
    heading: "Each site has its own purpose",
    copy: "Each Open Mirror website has its own purpose. CrossHeartPray is a Christian resource centered on Scripture. The other sites offer Christian music and media, dog-rescue listings, games, sports scores, emergency-preparation checklists and product suggestions, reflection and creative tools, and a movie, TV, and book tracker. What each site publishes, and its limits, should be understood in light of that site's purpose. Sites and features may change, improve, or be retired at any time.",
  },
  {
    heading: "Scripture",
    copy: "CrossHeartPray presents Scripture as God's Word. Its Bible text comes from published translations and is shown as published; Open Mirror LLC does not write, rewrite, or alter it. Prayers, reading plans, devotional and study notes, original-language helps, and teaching from other ministries are the work of people, shared alongside Scripture to help in reading it; they are not Scripture. The limits described on this page apply to the websites, their features, and those materials, not to Scripture itself.",
  },
  {
    heading: "Provided as-is",
    copy: "Websites, software, downloads, recommendations, and other materials are provided “as is” and “as available.” Open Mirror LLC does not guarantee that every feature will always be available, uninterrupted, accurate, complete, secure, or suitable for every person or purpose.",
  },
  {
    heading: "Not professional advice",
    copy: "Nothing published by Open Mirror LLC should be treated as legal, financial, medical, mental-health, safety, employment, or other professional advice. Important decisions should be reviewed with an appropriately qualified professional. In an emergency, contact emergency services and follow official local guidance.",
  },
  {
    heading: "Artificial intelligence",
    copy: "Some Open Mirror products may use artificial intelligence to organize information, generate ideas, or assist with creative work. AI-generated results can be incomplete, outdated, or incorrect. Users are responsible for reviewing and verifying outputs before relying on, publishing, purchasing, or acting on them.",
  },
  {
    heading: "Third-party services",
    copy: "Open Mirror products may reference or connect to third-party websites, stores, platforms, videos, APIs, products, or services. Open Mirror LLC does not control those third parties and is not responsible for their availability, content, security, policies, pricing, or actions. Sites that include affiliate links say so, and Open Mirror LLC may earn a commission from qualifying purchases made through them.",
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
    // 2026-10-08 (owner): the employer-independence statement is back, in
    // general terms — no employer is named and no claim is made about any
    // employer's resources. Supersedes the 2026-08-17 removal.
    copy: "Open Mirror LLC and its projects are independently owned and operated. They are not affiliated with, sponsored by, or endorsed by the owner's current or former employers or their affiliates. The projects, and any views expressed in them, are independent and do not represent any employer.",
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
          Last updated: November 2026
        </p>

      </div>
    </main>
  );
}
