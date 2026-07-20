import type { Metadata } from "next";
import Link from "next/link";
import { foundationProduct, STUDIO } from "../../lib/products";

export const metadata: Metadata = {
  title: "About",
  description:
    "An idea should not have to stay an idea. How one daily Bible routine became CrossHeartPray, and how one idea leading to another became Open Mirror.",
  alternates: { canonical: "/about-open-mirror" },
};

// The origin and purpose page. The project directory lives on the homepage;
// credits, resources, and products live on their own pages — this page only
// tells the story. The copy is the owner's, approved 2026-07-19; change words
// only on the owner's instruction.

const body = "mt-4 text-pretty text-base font-semibold leading-8 text-[#94a3b8]";
const heading = "text-2xl font-black tracking-tight";

const STANDARD = [
  "Make something original.",
  "Be honest about what it is.",
  "Put it where people can use it.",
  "Listen, learn, and make it better.",
];

export default function AboutOpenMirror() {
  const foundation = foundationProduct();

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">

        <header>
          <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
            An idea should not have to stay an idea.
          </h1>
          <p className="mt-6 text-pretty text-lg font-semibold leading-8 text-[#94a3b8]">
            Open Mirror is a creative digital platform for building original
            websites, mobile apps, games, tools, and encouragement—and putting
            them live for the world to use.
          </p>
        </header>

        {/* The one CrossHeartPray connection — its accent on the rule, one
            quiet link in the prose. A nod, not an advertisement. */}
        <section
          className="mt-16 border-l-4 pl-5 sm:pl-6"
          style={{ borderColor: foundation?.accent ?? "#C4B5FD" }}
        >
          <h2 className={heading}>CrossHeartPray came first.</h2>
          <p className={body}>
            It began with a daily Bible routine I wanted to carry with me.
            Scripture, prayer, notes, and the things I did not want to lose.
          </p>
          <p className={body}>
            {foundation ? (
              <a
                href={foundation.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-[#7dd3fc] underline"
              >
                CrossHeartPray
              </a>
            ) : (
              "CrossHeartPray"
            )}{" "}
            turned that routine into something real and useful. It was inspired
            by Travis, built around faith, and made available to anyone who
            might need it.
          </p>
        </section>

        <section className="mt-16">
          <h2 className={heading}>Then one idea led to another.</h2>
          <p className={body}>
            I realized I did not need a large company, a development team, or
            years of waiting to put an original idea online. I could start with
            something meaningful, build the first version, see what worked, and
            improve it while people were already using it.
          </p>
          <p className="mt-4 text-lg font-black text-[#e8edf5]">
            That became Open Mirror.
          </p>
        </section>

        <section className="mt-16">
          <h2 className={heading}>Why it exists</h2>
          <p className="mt-4 text-base font-black leading-8 text-[#e8edf5]">
            Open Mirror is for faith and family.
          </p>
          <p className={body}>
            It is for friends I have lost, friends I have yet to meet, and
            people anywhere in the world who may find encouragement, help, a
            laugh, a useful tool, or a reason to begin something of their own.
          </p>
          <p className={body}>
            Some projects are serious. Some solve small problems. Some are
            simply fun. They all begin with an original idea and the belief
            that it is worth finding out what the idea can become.
          </p>
        </section>

        <section className="mt-16">
          <h2 className={heading}>The tools changed the speed.</h2>
          <p className={body}>
            Modern building tools make it possible to move from an idea to a
            working product faster than ever before.
          </p>
          <p className={body}>
            I use them to write code, solve technical problems, test ideas,
            deploy updates, and keep improving what is already live. New
            features can sometimes move from a thought to the internet in a
            single day.
          </p>
          <p className={body}>
            The tools help build the software. They are not the voice behind
            it.
          </p>
          <p className={body}>
            The ideas, purpose, faith, words, curation, decisions, and
            responsibility remain human. AI is a building tool here—not the
            source of the message and never an authority on Scripture.
          </p>
        </section>

        <section className="mt-16">
          <h2 className={heading}>Always being built</h2>
          <p className={body}>
            Open Mirror is not meant to look finished and sit still.
          </p>
          <p className={body}>
            Projects will grow. Some will change direction. Some will remain
            simple. New ideas will appear, and useful features will continue to
            be added.
          </p>
          <p className={body}>The standard is straightforward:</p>
          <ul className="mt-4 space-y-1.5">
            {STANDARD.map((line) => (
              <li key={line} className="text-base font-black leading-8 text-[#e8edf5]">
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* Closing — the story ends where the work lives. */}
        <section className="mt-16 border-t border-[#26324c] pt-10 text-center">
          <p className="text-lg font-black leading-8">
            <span className="block">This started personally.</span>
            <span className="block">Now it is open to the world.</span>
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-black"
            style={{ background: "var(--om-accent)", color: "var(--om-ink)" }}
          >
            Explore the projects →
          </Link>
        </section>

        {/* A quiet anchor so existing #disclaimer deep links still land. The
            full legal text lives only on /disclaimer, and the shared footer
            already carries the one-line independence note — no repeat here. */}
        <section id="disclaimer" className="mt-14 scroll-mt-24 border-t border-[#26324c] pt-6 text-center">
          <Link href="/disclaimer" className="text-xs font-semibold text-[#94a3b8] underline">
            Disclaimer and independence
          </Link>
        </section>

        <p className="mt-6 text-center text-xs font-semibold text-[#64748b]">
          {STUDIO.name} ·{" "}
          <a href={`mailto:${STUDIO.email}`} className="font-black text-[#7dd3fc]">
            {STUDIO.email}
          </a>
        </p>

      </div>
    </main>
  );
}
