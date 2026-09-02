// What a school gets. The page the owner sends an athletic director.

import type { Metadata } from "next";
import Link from "next/link";

import { SERVICE_EMAIL } from "@/lib/services";

export const metadata: Metadata = {
  title: "Free coverage for your team",
  description:
    "Send your final score after the game. Open Mirror writes the story, builds the graphic, keeps the archive and puts it on the St. Louis feed. Free.",
  alternates: { canonical: "/sports/for-schools" },
};

const GETS = [
  ["A game story", "Written from your score the moment you send it. Facts only — nothing invented, ever."],
  ["Your school's sports page", "A permanent page for your program that updates itself."],
  ["A share graphic and caption", "Ready to send to the team group chat or post wherever you post."],
  ["A score archive", "Every result you send, kept and searchable, building season by season."],
  ["St. Louis feed coverage", "Your result alongside every other school we cover."],
];

export default function ForSchoolsPage() {
  return (
    <main className="min-h-screen bg-[#0b0e14] text-[#e8edf5]">
      <div className="mx-auto w-full max-w-[42rem] px-5 pb-24 pt-10">
        <Link href="/sports" className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7dd3fc] hover:underline">
          ← St. Louis sports
        </Link>

        <p className="m-0 mt-8 text-[10px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">For coaches and ADs</p>
        <h1 className="m-0 mt-2 text-[2.3rem] font-black leading-[1.03] tracking-tight sm:text-[2.8rem]">
          Free coverage for your team
        </h1>
        <p className="m-0 mt-4 text-[1.05rem] font-semibold leading-7 text-[#cbd5e1]">
          Send your final score after the game. That is the whole ask — about fifteen seconds on your phone.
        </p>

        <section className="mt-9">
          <h2 className="m-0 mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
            What happens automatically
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {GETS.map(([title, detail]) => (
              <li key={title} className="rounded-2xl border border-[#232a38] bg-[#12161f] p-4">
                <p className="m-0 text-[1rem] font-black text-[#f1f5f9]">
                  <span aria-hidden className="mr-2 text-[#86efac]">✓</span>
                  {title}
                </p>
                <p className="m-0 mt-1.5 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">{detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-9 rounded-2xl border border-[#232a38] bg-[#101520] p-5">
          <h2 className="m-0 text-[11px] font-black uppercase tracking-[0.18em] text-[#7dd3fc]">What it costs</h2>
          <p className="m-0 mt-2.5 text-[0.95rem] font-semibold leading-6 text-[#cbd5e1]">
            Nothing. There is no subscription, no app to install, no account to create and no password to remember.
            You get a link. You tap it, type two numbers, and you are done.
          </p>
        </section>

        <section className="mt-9">
          <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
            Get your team link
          </h2>
          <p className="m-0 text-[0.95rem] font-medium leading-6 text-[#94a3b8]">
            Links are issued by hand, on purpose — one per program, so a link can only ever report that school&rsquo;s
            games. Email the school and sport and we will send yours back.
          </p>
          <a
            href={`mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent("Team reporting link")}&body=${encodeURIComponent(
              "School:\nSport(s):\nWho will send scores:\n",
            )}`}
            className="mt-4 inline-block rounded-2xl bg-[#7dd3fc] px-5 py-3.5 text-[1rem] font-black text-[#0b0e14]"
          >
            Request your team link
          </a>
          <p className="m-0 mt-4 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">
            Not with a program?{" "}
            <Link href="/sports/report" className="text-[#7dd3fc] underline underline-offset-2">
              Report a score here
            </Link>{" "}
            — a person checks community reports before they publish.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="m-0 mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
            How we handle your results
          </h2>
          <p className="m-0 text-[0.9rem] font-medium leading-6 text-[#94a3b8]">
            We publish facts: score, date, opponent, sport. We do not invent statistics, we do not write anything the
            evidence does not support, and we do not mock a losing team. If your report disagrees with another source,
            we hold it and ask rather than guessing. These are teenagers, and we cover them the way we would want ours
            covered.
          </p>
        </section>
      </div>
    </main>
  );
}
