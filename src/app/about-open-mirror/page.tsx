import type { Metadata } from "next";
import Link from "next/link";
import { OWNER, ownerHasPublicProfile } from "../../lib/owner";
import { STUDIO } from "../../lib/products";

export const metadata: Metadata = {
  title: "About Open Mirror",
  description: "This mirror is for you. What do you want to create?",
  alternates: { canonical: "/about-open-mirror" },
};

export default function AboutOpenMirror() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14">

        {/* The idea */}
        <section className="mb-14 text-center">
          <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            This mirror is for you.
          </h1>
          <p className="text-xl font-black text-[#7dd3fc]">
            What do you want to create?
          </p>
        </section>

        <section className="mb-14 text-center">
          <p className="mx-auto max-w-md text-base font-semibold leading-8 text-[#94a3b8]">
            Open Mirror is where ideas become things.
            <br />
            You do not need to know every step.
            <br />
            You need to sit down and start.
          </p>
          <p className="mx-auto mt-6 max-w-md text-base font-semibold leading-8 text-[#94a3b8]">
            Bring your idea, your brain, your time, and your commitment.
            <br />
            Technology makes building easier than ever.
          </p>
          <p className="mx-auto mt-6 max-w-md text-base font-semibold leading-8 text-[#e8edf5]">
            Start with what you know. Learn the next step.
            <br />
            Fix what does not work. Keep going.
          </p>
          <p className="mx-auto mt-6 max-w-md text-base font-semibold leading-8 text-[#94a3b8]">
            That is how Open Mirror was built.
          </p>
        </section>

        {/* How it is built */}
        <section className="mb-14 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
          <h2 className="mb-3 text-xl font-black">Built after work.</h2>
          <p className="mb-3 text-sm font-semibold leading-7 text-[#94a3b8]">
            Open Mirror is an independent evenings-and-weekends company, built
            on personal time alongside a full-time job. It is separate from
            that job and does not represent the owner&apos;s employer.
          </p>
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            Every project builds more skill, judgment, and experience. That
            experience can help someone else move faster.
          </p>
        </section>

        {/* Optional public profile — renders nothing while OWNER is anonymous. */}
        {ownerHasPublicProfile() && (
          <section className="mb-14 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
            <h2 className="mb-3 text-xl font-black">The owner</h2>
            {OWNER.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={OWNER.photoUrl}
                alt={OWNER.publicName ?? "The owner of Open Mirror LLC"}
                className="mb-4 h-24 w-24 rounded-full object-cover"
              />
            )}
            {OWNER.publicName && (
              <p className="mb-2 text-base font-black">{OWNER.publicName}</p>
            )}
            {OWNER.bio && (
              <p className="mb-3 text-sm font-semibold leading-7 text-[#94a3b8]">
                {OWNER.bio}
              </p>
            )}
            {OWNER.links.length > 0 && (
              <p className="text-sm font-semibold text-[#94a3b8]">
                {OWNER.links.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && " · "}
                    <a href={l.href} className="font-black text-[#7dd3fc]">
                      {l.label}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </section>
        )}

        {/* Where to begin */}
        <section className="mb-14 text-center">
          <h2 className="mb-4 text-2xl font-black tracking-tight">
            Your idea. Your move.
          </h2>
          <p className="mx-auto mb-7 max-w-md text-sm font-semibold leading-7 text-[#94a3b8]">
            Start building in StepInTheRing. Keep going on your own. Or talk
            with the owner when you need help getting from an idea to
            production.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://stepinthering.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-base font-black text-[#0C0C0C]"
            >
              Start Building
            </a>
            <Link
              href="/talk-with-the-owner"
              className="inline-block rounded-full border border-[#26324c] bg-[#141d2e] px-8 py-3.5 text-base font-black text-[#e8edf5] transition hover:border-[#38BDF8]"
            >
              Talk with the Owner
            </Link>
          </div>
        </section>

        {/* Free resources & credits — attribution stays; some content is used
            with permission. */}
        <section className="mb-10">
          <h2 className="mb-2 text-xl font-black">Free resources</h2>
          <div className="flex flex-col gap-3">
            <a
              href="/resources/52-week-bible-reading-plan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="pop flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#1c2740]"
            >
              <span className="text-2xl">📖</span>
              <div>
                <h3 className="text-base font-black">Bible Reading Plan <span className="text-[10px] font-black uppercase tracking-wider text-[#94a3b8]">PDF</span></h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">A 52-week plan to read through the Bible — print it or keep it on your phone.</p>
              </div>
            </a>
          </div>
          <p className="mb-3 mt-6 text-sm font-black text-[#e8edf5]">
            Credit where credit is due
          </p>
          <div className="flex flex-col gap-2">
            {[
              { name: "52-Week Bible Reading Plan", credit: "© 1995–2009 Michael Coley, Bible-Reading.com — used with permission (CrossHeartPray)", href: "http://www.bible-reading.com" },
              { name: "Life Essentials · Bible Principles", credit: "Dr. Gene Getz / B&H Publishing — principles & official videos (CrossHeartPray, TheDJCares)", href: "https://bibleprinciples.org" },
              { name: "YouVersion Bible App", credit: "bible.com — verse and chapter links across the family", href: "https://www.bible.com" },
              { name: "BibleHub", credit: "Original-language and Strong's references (CrossHeartPray Deep Dive)", href: "https://biblehub.com" },
              { name: "RescueGroups.org", credit: "Free adoptable-pets API behind DontCloneMeTom's live dogs", href: "https://rescuegroups.org" },
              { name: "Petfinder & Adopt-a-Pet", credit: "Adoption searches linked from DontCloneMeTom", href: "https://www.petfinder.com" },
              { name: "YouTube", credit: "Video and music embeds (TheDJCares, iDontCry)", href: "https://www.youtube.com" },
            ].map((r) => (
              <a
                key={r.name}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 transition hover:border-[#1c2740]"
              >
                <span className="text-sm font-black text-[#e8edf5]">{r.name}</span>
                <span className="block text-xs font-semibold leading-5 text-[#94a3b8]">{r.credit}</span>
              </a>
            ))}
          </div>
        </section>

        <p className="text-center text-xs font-semibold text-[#64748b]">
          {STUDIO.name} ·{" "}
          <a href={`mailto:${STUDIO.email}`} className="font-black text-[#7dd3fc]">
            {STUDIO.email}
          </a>
        </p>

      </div>
    </main>
  );
}
