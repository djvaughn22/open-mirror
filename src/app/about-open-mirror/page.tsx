import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ACCESS_TONE,
  BOTTOM_PIN_LABEL,
  aboutFamilyProducts,
  bottomPinnedProducts,
  featuredProduct,
  foundationProduct,
  type Product,
} from "../../lib/products";
import { MISSION_HAIKUS } from "../../lib/haikus";

const META_DESCRIPTION =
  "Open Mirror LLC is an independent product studio creating websites, apps, games, digital products, creative tools, and media experiences.";

export const metadata: Metadata = {
  title: "About",
  description: META_DESCRIPTION,
  alternates: { canonical: "/about-open-mirror" },
};

// Studio-story rewrite (owner's brief, 2026-07-19): product-first, no
// personal biography — no owner name, photo, employer, job title, or origin
// story beyond CrossHeartPray's. If a title is ever needed, "owner" is the
// word. Every project entry derives from the registry (name, link, aboutLine,
// status labels); the haikus render from src/lib/haikus.ts, never inline.

const INTRO = [
  "Open Mirror LLC is an independent product studio creating websites, apps, games, digital products, creative tools, and media experiences.",
  "The projects may look different from one another, but they share the same purpose: start with something meaningful, make a useful first version, and keep improving it until people can actually use it.",
];

const ONE_STUDIO_COPY =
  "Some Open Mirror projects help people build. Some help families play, learn, remember, prepare, or find something worth sharing. Each product keeps its own name, audience, and purpose, while Open Mirror gives the work a common home.";

const CHP_COPY = [
  "CrossHeartPray began as a practical way to keep a daily rhythm of Scripture, reflection, and prayer available wherever there is an internet connection.",
  "It remains the foundation of Open Mirror and stands on its own. It is not a sales funnel, and it does not need to become one.",
];

const CHP_TRAVIS_LINE = "Travis remains the inspiration for CrossHeartPray.";

const FAMILY_INTRO =
  "One finished idea made the next idea feel possible. Open Mirror grew into a collection of independent products built around faith, family, creativity, play, preparedness, and practical problem-solving.";

const BUILT_BY_STARTING = [
  "Open Mirror follows a simple process: make the first version, use it, find what is weak, and build it better.",
  "The goal is not to make every idea enormous. The goal is to give good ideas a fair chance to become useful.",
];

const OWN_IDEA_COPY =
  "Open Mirror is focused on building its own products, but the owner also works with a small number of people who need help shaping an idea, improving a build, or finding the clearest next step.";

const heading2 = "text-2xl font-black tracking-tight";
const body = "mt-3 text-pretty text-base font-semibold leading-8 text-[#94a3b8]";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]";

/** A product's name as a link — external sites open in a new tab. */
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

/** Small status chip — only for products still being built, tested, or prepared. */
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

function FamilyEntry({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5">
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
      <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">

        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
          About Open Mirror
        </p>

        <h1 className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          Ideas are better when they become real.
        </h1>

        {INTRO.map((line) => (
          <p key={line} className="mt-6 text-pretty text-base font-semibold leading-8 text-[#94a3b8]">
            {line}
          </p>
        ))}

        <section className="mt-12">
          <h2 className={heading2}>One studio. Many starting points.</h2>
          <p className={body}>{ONE_STUDIO_COPY}</p>
        </section>

        <section className="mt-12 rounded-3xl border border-[#26324c] bg-[#0f1826] p-6 sm:p-8">
          <h2 className={heading2}>It started with{" "}
            {foundation ? <ProductName product={foundation} /> : "CrossHeartPray"}.
          </h2>
          {CHP_COPY.map((line) => (
            <p key={line} className={body}>
              {line}
            </p>
          ))}
          <p className="mt-4 text-sm font-semibold leading-7 text-[#64748b]">
            {CHP_TRAVIS_LINE}
          </p>
        </section>

        <section className="mt-12" aria-label="The Open Mirror project family">
          <h2 className={heading2}>What grew from it</h2>
          <p className={body}>{FAMILY_INTRO}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {family.map((p) => (
              <FamilyEntry key={p.name} product={p} />
            ))}
          </div>
          {pinned.length > 0 && (
            <div className="mt-3 grid gap-3">
              {pinned.map((p) => (
                <div key={p.name} className="rounded-2xl border border-[#26324c] bg-[#141d2e] p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#34D399]">
                    {BOTTOM_PIN_LABEL}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-base leading-6">
                    <span aria-hidden>{p.emoji}</span>
                    <ProductName product={p} />
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#94a3b8]">
                    {p.aboutLine ?? p.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className={heading2}>Built by starting</h2>
          {BUILT_BY_STARTING.map((line) => (
            <p key={line} className={body}>
              {line}
            </p>
          ))}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
        </section>

        {featured && (
          <section className="mt-12 rounded-3xl border border-[#26324c] bg-[#0f1826] p-6 sm:p-8">
            {featured.image && (
              <Image
                src={featured.image}
                alt={featured.imageAlt ?? ""}
                width={1200}
                height={675}
                className="mb-5 h-auto w-full rounded-2xl border border-[#26324c]"
              />
            )}
            <p className="flex flex-wrap items-center gap-2">
              <span className={heading2}>
                <span aria-hidden>{featured.emoji}</span> {featured.name}
              </span>
              <StatusChip product={featured} />
            </p>
            <p className={body}>{featured.aboutLine ?? featured.description}</p>
            <p className="mt-5">
              <Link
                href={featured.href}
                className={`inline-block rounded-full border border-[#26324c] bg-[#141d2e] px-6 py-3 text-sm font-black text-[#e8edf5] transition hover:border-[#7dd3fc] ${focusRing}`}
              >
                {featured.aboutAction ?? "View the product"} →
              </Link>
            </p>
          </section>
        )}

        {/* id="disclaimer" keeps old /about-open-mirror#disclaimer deep links
            landing near the bottom; the footer carries the visible link. */}
        <section id="disclaimer" className="mt-12 scroll-mt-24">
          <h2 className={heading2}>Have something of your own?</h2>
          <p className={body}>{OWN_IDEA_COPY}</p>
          <p className="mt-5">
            <Link
              href="/contact"
              className={`inline-block rounded-full px-7 py-3.5 text-sm font-black transition hover:opacity-90 ${focusRing}`}
              style={{ background: "var(--om-accent)", color: "var(--om-ink)" }}
            >
              Work with Open Mirror
            </Link>
          </p>
        </section>

      </div>
    </main>
  );
}
