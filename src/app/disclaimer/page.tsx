import type { Metadata } from "next";
import { STUDIO } from "../../lib/products";

export const metadata: Metadata = {
  title: "Disclaimer",
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
        <p className="mb-10 max-w-prose text-pretty text-base font-semibold leading-7 text-[#94a3b8]">
          Open Mirror LLC is a personal, independent company built outside
          normal working hours. It is a place to create useful products, explore
          ideas, and learn skills that support the owner&apos;s continued
          professional growth.
        </p>

        <div className="flex flex-col gap-8">
          <Section title="Independent work">
            <p>Open Mirror LLC is separate from the owner&apos;s employment.</p>
            <p>
              It is not affiliated with, sponsored by, or endorsed by the
              owner&apos;s employer. Its projects and views belong solely to
              Open Mirror LLC and do not represent any employer, client, or
              other organization.
            </p>
            <p>
              The company&apos;s work is created on personal time and kept
              separate from the owner&apos;s employment responsibilities.
            </p>
            <p>
              If something appears to create a conflict or unintended overlap,
              email <Mail /> so it can be reviewed and corrected.
            </p>
          </Section>

          <Section title="Projects and learning">
            <p>Many Open Mirror projects begin as practical experiments.</p>
            <p>
              They are built to learn, test ideas, solve real problems, and turn
              promising concepts into useful products. Some will continue
              growing. Others may change, be replaced, or remain simple
              experiments.
            </p>
            <p>
              Information, features, and availability may change as the projects
              improve.
            </p>
          </Section>

          <Section title="Information and tools">
            <p>
              Open Mirror provides creative tools, guides, recommendations,
              experiments, and other general information.
            </p>
            <p>
              They are provided as available and may not fit every person or
              situation. When a decision carries meaningful personal,
              professional, financial, legal, medical, or other consequences,
              confirm the information with an appropriate trusted source.
            </p>
          </Section>

          <Section title="Products and purchases">
            <p>
              Some Open Mirror projects are free. Others may become paid
              products.
            </p>
            <p>
              A product is not available for purchase until the site provides a
              working checkout and delivery process. Anything marked{" "}
              <span className="font-semibold text-[#e8edf5]">
                Preparing for Release
              </span>{" "}
              is not yet for sale.
            </p>
            <p>
              The applicable price, delivery details, terms, and refund
              information will be shown before a purchase is completed.
            </p>
          </Section>

          <Section title="Third-party services">
            <p>
              Open Mirror sites may use or link to services operated by other
              companies, including hosting platforms, embedded media, public
              APIs, adoption resources, and app services.
            </p>
            <p>
              Open Mirror does not control the content, availability, privacy
              practices, or terms of those services.
            </p>
            <p>
              Sources and materials used with permission or under applicable
              platform terms are credited where appropriate.
            </p>
          </Section>

          <Section title="Corrections and concerns">
            <p>
              To report incorrect information, a broken link, an attribution or
              rights concern, or a possible conflict, email <Mail />.
            </p>
            <p>The concern will be reviewed and corrected where appropriate.</p>
          </Section>
        </div>

        <p className="mt-12 border-t border-[#26324c] pt-6 text-center text-xs font-semibold text-[#64748b]">
          {STUDIO.name} · <Mail />
        </p>
      </div>
    </main>
  );
}
