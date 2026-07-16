import type { Metadata } from "next";
import { STUDIO } from "../../lib/products";

export const metadata: Metadata = {
  title: "Disclaimer and independence",
  description:
    "Open Mirror LLC is an independent company. Its projects are created and operated independently.",
  alternates: { canonical: "/disclaimer" },
};

// The dedicated home for the full legal / non-affiliation language. Kept off
// the About, homepage, and product copy so visitors only read it if they come
// looking for it — the footer carries one quiet line and a link, nothing more.
//
// The non-affiliation wording is the owner's conflict-of-interest shield.
// It was reorganized into sections (owner-directed, July 2026); the substance
// is unchanged. Do not weaken or drop any of it without DJ.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#26324c] pt-6">
      <h2 className="mb-2 text-base font-black text-[#e8edf5]">{title}</h2>
      <div className="flex flex-col gap-3 text-sm font-medium leading-7 text-[#94a3b8]">
        {children}
      </div>
    </section>
  );
}

function Mail() {
  return (
    <a href={`mailto:${STUDIO.email}`} className="font-semibold text-[#7dd3fc]">
      {STUDIO.email}
    </a>
  );
}

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="mb-4 text-2xl font-black tracking-tight sm:text-3xl">
          Disclaimer and independence
        </h1>
        <p className="mb-10 text-balance text-base font-semibold leading-7 text-[#94a3b8]">
          Open Mirror LLC is an independent company. Its projects are created
          and operated independently.
        </p>

        <div className="flex flex-col gap-8">
          <Section title="Independent company">
            <p>
              Open Mirror LLC is an independent company, created and operated
              entirely on personal time. The views expressed across its sites
              are solely its own.
            </p>
          </Section>

          <Section title="Ownership and non-affiliation">
            <p>
              Open Mirror LLC is not affiliated with, sponsored by, or endorsed
              by its owner&apos;s employer, and its projects — small consumer
              experiments built to learn — neither compete with nor draw on that
              employer&apos;s business.
            </p>
            <p>
              Any apparent overlap is unintentional. Report it to <Mail /> and
              it will be corrected.
            </p>
          </Section>

          <Section title="Projects and information">
            <p>
              Open Mirror projects, experiments, guides, recommendations, and
              tools change as they are built. Information on these sites is
              provided as it is, and may be updated or replaced at any time.
              Where something matters to your own situation, check it against a
              source you trust before relying on it.
            </p>
          </Section>

          <Section title="Products and purchases">
            <p>
              Some Open Mirror products are free to use; others are one-time
              paid playbooks. Nothing on these sites is a subscription.
            </p>
            <p>
              A project is not available for purchase until a real checkout and
              delivery process exist. Where a product is marked{" "}
              <span className="font-semibold text-[#e8edf5]">
                preparing for release
              </span>
              , it is being described before that exists — it is not currently
              for sale.
            </p>
            <p>
              Product terms, delivery details, and refund information will be
              shown where purchasing actually happens.
            </p>
          </Section>

          <Section title="Third-party services and links">
            <p>
              These sites link to other sites and use services Open Mirror does
              not control — including embedded video and music, public data and
              adoption APIs, hosting, and app platforms. Their content,
              availability, and terms are their own.
            </p>
            <p>
              Source material used with permission or under a platform&apos;s
              terms is credited on the{" "}
              <a href="/about-open-mirror#disclaimer" className="font-semibold text-[#7dd3fc]">
                About page
              </a>
              .
            </p>
          </Section>

          <Section title="Contact and corrections">
            <p>
              To report incorrect information, an attribution or rights concern,
              a broken link, or a potential conflict, email <Mail />. It will be
              looked at and corrected.
            </p>
          </Section>
        </div>

        <p className="mt-12 border-t border-[#26324c] pt-6 text-center text-xs font-semibold text-[#64748b]">
          {STUDIO.name} · <Mail />
        </p>
      </div>
    </main>
  );
}
