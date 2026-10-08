import type { Metadata } from "next";
import Link from "next/link";
import {
  ACCESS_TONE,
  aboutFamilyProducts,
  bottomPinnedProducts,
  featuredProduct,
  foundationProduct,
  siteName,
  STUDIO,
  type Product,
} from "../../lib/products";
import { OPEN_MIRROR_RESALE_CARD } from "../../lib/destinations";
import { MAILTO_SUBJECT, SERVICE_EMAIL } from "../../lib/services";
import AboutDestinationCard from "../../components/AboutDestinationCard";

const META_DESCRIPTION =
  "Open Mirror LLC is an independent company behind a group of separate websites: prayer and Christian media, family entertainment, turning ideas into real projects, and supporting dog rescue.";

export const metadata: Metadata = {
  title: "About",
  description: META_DESCRIPTION,
  alternates: { canonical: "/about-open-mirror" },
};

// Plain, warm, direct (owner, 2026-10-08, second pass). The opening is the
// owner's direction, kept in the registry (`STUDIO.purpose`); every project
// line is a short factual description from the registry. No slogans, no
// sentimental reminders, no haiku sequence, no repeated taglines.

const PROJECTS_INTRO = "Each name links to the project's own website.";

const WORK_WITH = [
  "Questions, corrections, or a project you'd like help with? Send an email.",
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
      {/* The site's canonical ".com" brand name (owner, 2026-10-08). */}
      {siteName(product).base}
      <span style={{ color: product.accent }}>{siteName(product).dot}</span>
    </a>
  );
}

/** Small status chip — only for projects still being built, tested, or prepared. */
function StatusChip({ product }: { product: Product }) {
  if (product.experiment && product.status === "live") {
    return (
      <span
        className="rounded-full border border-[#26324c] px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.08em]"
        style={{ color: ACCESS_TONE.Exploring }}
      >
        Beta
      </span>
    );
  }
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
  const allFamily = aboutFamilyProducts().filter((p) => p.pinBottom !== true);
  // PleaseBeReady.com is listed, low-key, after everything else — never part
  // of the opening.
  const family = allFamily.filter((p) => !p.experiment);
  const experiments = allFamily.filter((p) => p.experiment);
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

        {STUDIO.purpose.map((line) => (
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
          {(experiments.length > 0 || featured) && (
            <>
              <h3 className="mt-8 text-lg font-black tracking-tight">Betas and experiments</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {experiments.map((p) => (
                  <ProjectCard key={p.name} product={p} />
                ))}
              </div>
              <div className="mt-3 grid gap-3">
                {featured && <ProjectCard product={featured} />}
              </div>
            </>
          )}
          {pinned.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-black tracking-tight">Also</h3>
              <div className="mt-3 grid gap-3">
                {pinned.map((p) => (
                  <ProjectCard key={p.name} product={p} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* The eBay resale card renders only once its real store exists
            (gated in src/lib/destinations.ts); until then nothing shows. */}
        <div className="mt-10 grid gap-3" aria-label="Shops">
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
            Open Mirror LLC and its projects are
            independently owned and operated. They are
            not affiliated with, sponsored by, or endorsed by the owner&apos;s current or former employers or their affiliates,
            and the projects and any views in them are independent.
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
