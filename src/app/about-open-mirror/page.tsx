import type { Metadata } from "next";
import Link from "next/link";
import {
  ACCESS_TONE,
  aboutFamilyProducts,
  bottomPinnedProducts,
  featuredProduct,
  foundationProduct,
  type Product,
} from "../../lib/products";
import { MISSION_HAIKUS } from "../../lib/haikus";
import { BE_PREPARED_CARD, OPEN_MIRROR_RESALE_CARD } from "../../lib/destinations";
import { MAILTO_SUBJECT, SERVICE_EMAIL } from "../../lib/services";
import AboutDestinationCard from "../../components/AboutDestinationCard";

const META_DESCRIPTION =
  "Open Mirror LLC is the business behind the projects collected here — websites, apps, games, creative tools, and digital products.";

export const metadata: Metadata = {
  title: "About",
  description: META_DESCRIPTION,
  alternates: { canonical: "/about-open-mirror" },
};

// Plain-voice rewrite (owner's brief, 2026-07-20): the page is about Open
// Mirror and its projects, nothing else. No slogans, no manifesto, no
// personal names or backstory, no explanatory sections before the projects.
// Every project entry derives from the registry; the haikus render from
// src/lib/haikus.ts with no commentary around them.

const OPENING = [
  "Open Mirror LLC is the business behind the projects collected here.",
  "It builds websites, apps, games, creative tools, digital products, and other things worth trying.",
  "Some projects are finished. Some are still being tested. Some will change as they are used.",
  "CrossHeartPray came first and remains its own faith-based project. The rest are separate products with their own names, purposes, and audiences.",
];

const PROJECTS_INTRO = "Here is what Open Mirror is working on.";

// Say-less (owner, 2026-07-20): one plain line, one email button. No pitch.
const WORK_WITH = [
  "Have something you want to build, fix, or finish? Email me and we'll talk.",
];

const heading2 = "text-2xl font-black tracking-tight";
const body = "mt-3 text-pretty text-base font-semibold leading-8 text-[#94a3b8]";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]";

/** A project's name as a link — external sites open in a new tab. */
function ProductName({ product }: { product: Product }) {
  const cls = `font-black text-[#e8edf5] underline decoration-[#26324c] underline-offset-4 transition hover:decoration-[#7dd3fc] ${focusRing}`;
  return product.href.startsWith("/") ? (
    <Link href={product.href} className={cls}>
      {product.name}
    </Link>
  ) : (
    <a href={product.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {product.name}
    </a>
  );
}

/** Small status chip — only for projects still being built, tested, or prepared. */
function StatusChip({ product }: { product: Product }) {
  const label =
    product.accessNote ?? (product.access === "Exploring" ? "Exploring" : undefined);
  if (!label || product.status === "live" || product.status === "foundation") return null;
  return (
    <span
      className="rounded-full border border-[#26324c] px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.08em]"
      style={{ color: ACCESS_TONE[product.access] }}
    >
      {label}
    </span>
  );
}

function ProjectCard({ product, note }: { product: Product; note?: string }) {
  return (
    <div className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5">
      {note && (
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#34D399]">
          {note}
        </p>
      )}
      <p className="flex flex-wrap items-center gap-2 text-base leading-6">
        <span aria-hidden>{product.emoji}</span>
        <ProductName product={product} />
        <StatusChip product={product} />
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#94a3b8]">
        {product.aboutLine ?? product.description}
      </p>
    </div>
  );
}

export default function AboutOpenMirror() {
  const foundation = foundationProduct();
  const family = aboutFamilyProducts().filter((p) => p.pinBottom !== true);
  const pinned = bottomPinnedProducts();
  const featured = featuredProduct();

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">

        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
          About
        </p>

        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Open Mirror LLC
        </h1>

        {OPENING.map((line) => (
          <p key={line} className="mt-4 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
            {line}
          </p>
        ))}

        <section className="mt-10" aria-label="Projects">
          <h2 className={heading2}>Projects</h2>
          <p className={body}>{PROJECTS_INTRO}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {foundation && <ProjectCard product={foundation} />}
            {family.map((p) => (
              <ProjectCard key={p.name} product={p} />
            ))}
          </div>
          <div className="mt-3 grid gap-3">
            {featured && <ProjectCard product={featured} />}
          </div>
        </section>

        <div className="mt-10 grid gap-3 sm:grid-cols-3" aria-label="How Open Mirror works">
          {MISSION_HAIKUS.map((haiku) => (
            <div key={haiku.title} className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
                {haiku.title}
              </p>
              <p className="mt-3 text-[13px] font-semibold leading-6 text-[#94a3b8]">
                {haiku.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* Shops: PleaseBeReady's Amazon-oriented card and, beside it, the
            eBay-oriented Open Mirror Resale card. Each renders only while its
            destination is confirmed live in the registry — the resale card
            stays hidden until the real eBay Store URL exists and is enabled
            in src/lib/destinations.ts. */}
        <div className="mt-10 grid gap-3" aria-label="Shops">
          {pinned.length > 0 && <AboutDestinationCard card={BE_PREPARED_CARD} />}
          <AboutDestinationCard card={OPEN_MIRROR_RESALE_CARD} />
        </div>

        {/* The footer's Contact and Disclaimer links land on these two
            sections (family standard, 2026-08-02). No services offered —
            just the one way to reach the owner. */}
        <section id="contact" className="mt-10 scroll-mt-24">
          <h2 className={heading2}>Contact</h2>
          {WORK_WITH.map((line) => (
            <p key={line} className={body}>
              {line}
            </p>
          ))}
          <p className="mt-5">
            <a
              href={`mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(MAILTO_SUBJECT)}`}
              className={`inline-block rounded-full px-7 py-3.5 text-sm font-black transition hover:opacity-90 ${focusRing}`}
              style={{ background: "var(--om-accent)", color: "var(--om-ink)" }}
            >
              Email me
            </a>
          </p>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#94a3b8]">
            {SERVICE_EMAIL}
          </p>
        </section>

        <section id="disclaimer" className="mt-10 scroll-mt-24">
          <h2 className={heading2}>Disclaimer</h2>
          <p className={body}>
            Open Mirror LLC is independently owned and operated. Nothing
            published by Open Mirror LLC is sponsored by, affiliated with,
            endorsed by, or representative of the owner&rsquo;s full-time
            employer.
          </p>
          <p className={body}>
            <Link
              href="/disclaimer"
              className={`font-black text-[#7dd3fc] transition hover:underline ${focusRing}`}
            >
              Read the full disclaimer
            </Link>
            .
          </p>
        </section>

      </div>
    </main>
  );
}
