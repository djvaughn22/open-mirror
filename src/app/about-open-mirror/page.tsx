import type { Metadata } from "next";
import Link from "next/link";
import { foundationProduct, STUDIO } from "../../lib/products";

export const metadata: Metadata = {
  title: "About",
  description:
    "Open Mirror is a creative digital platform. It began after CrossHeartPray became real: original ideas turned into live websites, apps, games, and tools, open to the world.",
  alternates: { canonical: "/about-open-mirror" },
};

// The origin and purpose page, in the owner's plain voice (rewritten
// 2026-07-19 on the owner's direction). The project directory lives on the
// homepage; credits, resources, and products live on their own pages — this
// page only says what Open Mirror is and where it came from. Change words
// only on the owner's instruction.

const body = "mt-4 text-pretty text-base font-semibold leading-8 text-[#94a3b8]";
const heading = "text-2xl font-black tracking-tight";

export default function AboutOpenMirror() {
  const foundation = foundationProduct();

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">

        <header>
          <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
            About Open Mirror
          </h1>
          <p className="mt-6 text-pretty text-lg font-semibold leading-8 text-[#94a3b8]">
            Open Mirror is a creative digital platform. It takes original ideas
            and makes them real — websites, mobile apps, games, and tools, live
            and open to the world.
          </p>
        </header>

        {/* The one CrossHeartPray connection — its accent on the rule, one
            quiet registry-derived link in the prose. A nod, not an ad. */}
        <section
          className="mt-16 border-l-4 pl-5 sm:pl-6"
          style={{ borderColor: foundation?.accent ?? "#C4B5FD" }}
        >
          <h2 className={heading}>It started with CrossHeartPray.</h2>
          <p className={body}>
            CrossHeartPray came from a daily routine: Scripture, prayer, and
            trying to keep the right things in front of me each day. It became
            the first website.
          </p>
          <p className={body}>
            Once{" "}
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
            was live, one thing was clear: an original idea can become a real
            website, app, game, or tool quickly, and be open to people
            anywhere. Open Mirror became the place for those ideas.
          </p>
        </section>

        <section className="mt-16">
          <h2 className={heading}>Who it&apos;s for</h2>
          <p className={body}>
            Faith. Family. Friends I have lost, and friends still to gain.
          </p>
          <p className={body}>
            And anyone in the world who finds something useful, encouraging,
            meaningful, or fun here.
          </p>
        </section>

        <section className="mt-16">
          <h2 className={heading}>How it gets built</h2>
          <p className={body}>
            The speed matters. Modern tools make it possible to start quickly,
            build a real first version, test it, change it, and put it live.
            New features and updates keep coming after that.
          </p>
          <p className={body}>
            The tools made the speed possible. They did not create the ideas,
            the purpose, the faith, the words, the judgment, or the point of
            view. The projects and the content are original.
          </p>
          <p className={body}>
            AI helps with coding, testing, troubleshooting, and deployment. It
            is not the author of this site&apos;s faith, message, or content,
            and it is never an authority on Scripture.
          </p>
        </section>

        {/* Closing — one quiet path back to where the work lives. */}
        <section className="mt-16 border-t border-[#26324c] pt-10 text-center">
          <Link
            href="/"
            className="inline-block rounded-full px-6 py-3 text-sm font-black"
            style={{ background: "var(--om-accent)", color: "var(--om-ink)" }}
          >
            Explore Open Mirror →
          </Link>
        </section>

        {/* A quiet anchor so existing #disclaimer deep links still land. The
            full legal text lives only on /disclaimer, and the shared footer
            already carries the link — no repeat here. */}
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
