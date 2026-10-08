import type { Metadata } from "next";

import { partnershipConfigured } from "../../lib/partnershipServer";
import { SERVICE_EMAIL } from "../../lib/services";
import PartnershipForm from "./PartnershipForm";

// A quiet invitation (owner brief, 2026-10-08): for Christian investors and
// experienced operators who share Open Mirror's values. Reached from one line
// on About — never the nav, the homepage, or a satellite. Kept out of search
// results on purpose; it is a door for people who come looking, not an ad.
//
// Rules for this page:
//   - It invites a conversation. It never promises a return, names an
//     amount, or reads like a securities offering.
//   - It never asks for proof of funds or personal financial details.
//   - Faceless like /contact: no personal name, photo, or bio.
//   - The owner's inbox is never in this page's source; the form posts to
//     /api/partnership, which holds it in server config.

const META_DESCRIPTION =
  "An invitation to Christian investors and experienced operators who value useful products, honest work, and long-term partnership.";

export const metadata: Metadata = {
  title: "Partnership",
  description: META_DESCRIPTION,
  alternates: { canonical: "/partnership" },
  robots: { index: false, follow: true },
};

const VALUES = [
  {
    title: "Useful products",
    line: "Every project has to help someone. If it doesn't, it waits.",
  },
  {
    title: "Honest work",
    line: "No hype, no invented numbers, and no tricks to keep people clicking.",
  },
  {
    title: "Stewardship",
    line: "Time, money, and trust are things to look after, not to spend fast.",
  },
  {
    title: "Long-term partnership",
    line: "Better to grow slowly with the right people than quickly with the wrong ones.",
  },
];

const heading2 = "text-2xl font-black tracking-tight";
const body = "mt-4 text-pretty text-base font-semibold leading-8 text-[#94a3b8]";

export default function Partnership() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-5 sm:py-16">

        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
          Partnership
        </p>

        <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          Partners for the long run
        </h1>

        <p className="mt-6 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
          Open Mirror LLC is a small, independent company that builds useful websites for faith,
          family, and making things. It is growing carefully, one honest project at a time.
        </p>
        <p className={body}>
          Christian faith guides the work. Open Mirror would welcome a conversation with Christian
          investors and experienced operators who care about the same things.
        </p>

        <section className="mt-12" aria-labelledby="values">
          <h2 id="values" className={heading2}>
            What matters here
          </h2>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5">
                <dt className="text-base font-black text-[#e8edf5]">{v.title}</dt>
                <dd className="mt-2 text-sm font-semibold leading-6 text-[#94a3b8]">{v.line}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="explore" className="mt-12 scroll-mt-24" aria-labelledby="explore-heading">
          <h2 id="explore-heading" className={heading2}>
            Explore a partnership
          </h2>
          <p className={body}>
            Three short questions, about five minutes. No pitch deck, no proof of funds, and nothing
            to sign. Every note is read personally, and if there seems to be a fit, the owner will
            reply to set up a conversation.
          </p>
          <div className="mt-6">
            <PartnershipForm initiallyOnline={partnershipConfigured()} fallbackEmail={SERVICE_EMAIL} />
          </div>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#64748b]">
            Your answers go by email to Open Mirror and are used only to reply to you. They are never
            sold or shared.
          </p>
        </section>

        <p className="mt-12 border-t border-[#26324c] pt-6 text-xs font-semibold leading-6 text-[#64748b]">
          This page is an invitation to a conversation. It is not an offer to sell, or a request for an
          offer to buy, any security, and nothing on it promises or implies a return. Please don&apos;t
          send financial statements, proof of funds, or personal financial information — none of it is
          needed to start talking.
        </p>

      </div>
    </main>
  );
}
