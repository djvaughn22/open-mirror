import type { Metadata } from "next";
import Link from "next/link";
import { BOTTOM_PIN_LABEL, bottomPinnedProducts, productsByStatus, STATUS_LABEL, STATUS_ORDER, STUDIO } from "../../lib/products";

export const metadata: Metadata = {
  title: "About Open Mirror",
  description: STUDIO.mission,
  alternates: { canonical: "/about-open-mirror" },
};

type FamilyItem = { emoji: string; name: string; accent: string; text: string; href: string; status?: string };

// Family list comes from the product registry (src/lib/products.ts).
// Foundation and Live carry their status in the group label; the rest get a badge.
const groups: { label: string; items: FamilyItem[] }[] = STATUS_ORDER.map((status) => ({
  label: STATUS_LABEL[status],
  items: productsByStatus(status).map((p) => ({
    emoji: p.emoji,
    name: p.href.startsWith("http") ? `${p.name}.com` : p.name,
    accent: p.accent,
    text: p.aboutText ?? p.description,
    href: p.href,
    status: status === "foundation" || status === "live" ? undefined : STATUS_LABEL[status],
  })),
})).filter((g) => g.items.length > 0);

export default function AboutOpenMirror() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-12">

        <section className="mb-12 text-center">
          <div className="mb-5" style={{ fontSize: 30, letterSpacing: 6 }}>✝️ 🧩 🧰 🎵 🐶</div>
          <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl">About Open Mirror</h1>
          <p className="mx-auto max-w-lg text-lg font-semibold leading-8 text-[#94a3b8]">
            Open Mirror begins with CrossHeartPray.
          </p>
        </section>

        <section className="mb-10 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
          <h2 className="mb-3 text-xl font-black">The short version</h2>
          <p className="mb-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            {STUDIO.mission}
          </p>
          <p className="mb-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            {STUDIO.whyTheName}
          </p>
          <p className="mb-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            CrossHeartPray is a Bible-first app built around daily Scripture, prayer, and
            consistency. Every other product grew from there.
          </p>
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            <strong className="text-[#e8edf5]">CrossHeartPray is the anchor. Open Mirror is the workshop.</strong>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-xl font-black">Every site in the hub</h2>
          {groups.map((g) => (
          <div key={g.label} className="mb-6">
            <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">{g.label}</p>
          <div className="flex flex-col gap-3">
            {g.items.map((f) => (
              <a
                key={f.name}
                href={f.href}
                {...(f.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="pop flex items-start gap-4 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 transition hover:border-[#1c2740]"
              >
                <span className="text-2xl">{f.emoji}</span>
                <div>
                  <h3 className="text-base font-black">
                    {f.name.endsWith(".com") ? (
                      <>
                        {f.name.slice(0, -4)}
                        <span style={{ color: f.accent }}>.com</span>
                      </>
                    ) : (
                      f.name
                    )}
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">{f.text}</p>
                </div>
                {f.status ? (
                  <span className="ml-auto shrink-0 self-start rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: f.accent, borderColor: `${f.accent}55` }}>{f.status}</span>
                ) : null}
              </a>
            ))}
          </div>
          </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="mb-2 text-xl font-black">Free resources</h2>
          <p className="mb-4 text-sm font-semibold text-[#94a3b8]">
            What we share, and the free tools and data our sites are built on — credit where credit is due.
          </p>
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
          <div className="mt-4 flex flex-col gap-2">
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

        <section className="mb-10">
          <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">{BOTTOM_PIN_LABEL}</p>
          <div className="flex flex-col gap-3">
            {bottomPinnedProducts().map((p) => (
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
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#94a3b8]">{p.aboutText ?? p.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-[#26324c] bg-[#141d2e] p-7">
          <h2 className="mb-3 text-xl font-black">The founder</h2>
          <p className="mb-3 text-sm font-semibold leading-7 text-[#94a3b8]">
            {STUDIO.founderNote}
          </p>
          <p className="text-sm font-semibold leading-7 text-[#94a3b8]">
            You can also work with the founder directly on your own idea or
            project:{" "}
            <Link href="/work-with-the-founder" className="font-black text-[#7dd3fc]">
              Work with the Founder →
            </Link>
          </p>
        </section>

        {/* Quiet footnotes — kept small on purpose (DJ, 2026-07-11). */}
        <p className="mx-auto mb-4 max-w-lg text-center text-xs font-semibold leading-6 text-[#64748b]">
          This whole portfolio was built in about 40 days, on evenings and weekends. We mention
          that not for the speed, but for what made it possible: a process, and a set of tools
          built along the way that are saved and reused — so every build makes the next one
          faster.
        </p>
        <p className="text-center text-xs font-semibold text-[#64748b]">
          Ideas, projects, collaborations, or something here you&apos;d like to talk about:{" "}
          <a href={`mailto:${STUDIO.email}`} className="font-black text-[#7dd3fc]">
            {STUDIO.email}
          </a>
        </p>

      </div>
    </main>
  );
}
