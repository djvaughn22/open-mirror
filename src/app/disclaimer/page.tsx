import type { Metadata } from "next";
import { STUDIO } from "../../lib/products";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Open Mirror LLC is independently owned and operated. Its projects are created and operated independently.",
  alternates: { canonical: "/disclaimer" },
};

// The dedicated home for the independence, conflict, and general legal
// language. Kept off About, Contact, the homepage, and product copy so
// visitors only read it if they come looking for it — the shared footer
// carries the link, nothing more.
//
// The "Independent work" wording is the owner's conflict-of-interest shield
// (rewritten on the owner's direction, July 2026). Do not weaken or drop any
// of it without DJ. It never names an employer, job title, or industry.

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
          Open Mirror LLC builds and operates its own projects. The practical
          and legal details live on this page so the rest of the site does not
          have to repeat them.
        </p>

        <div className="flex flex-col gap-8">
          <Section title="Independent work">
            <p>
              Open Mirror LLC is independently owned and operated. It is
              separate from the owner&apos;s employment and is not sponsored,
              endorsed, or operated by the owner&apos;s employer.
            </p>
            <p>
              Open Mirror uses its own accounts, systems, information,
              equipment, and resources. Employer confidential information,
              customer information, internal systems, and work product are not
              used.
            </p>
            <p>
              An inquiry may be declined because of an actual or potential
              conflict. Sending an inquiry does not create a consulting
              relationship. Any accepted work requires a separate written
              agreement.
            </p>
          </Section>

          <Section title="Projects and availability">
            <p>
              Open Mirror projects are built to solve real problems and test
              ideas. Some will keep growing. Others may change, be replaced, or
              remain simple. Information, features, and availability may change
              as the projects improve.
            </p>
          </Section>

          <Section title="Information and tools">
            <p>
              Open Mirror provides creative tools, guides, recommendations,
              experiments, and other general information. They are provided as
              available, without warranties, and may not fit every person or
              situation.
            </p>
            <p>
              When a decision carries meaningful personal, professional,
              financial, legal, medical, or other consequences, confirm the
              information with an appropriate trusted source.
            </p>
          </Section>

          <Section title="Products and purchases">
            <p>
              Some Open Mirror projects are free. Others may become paid
              products. A product is not available for purchase until the site
              provides a working checkout and delivery process; anything marked{" "}
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

          <Section title="Original content">
            <p>
              Open Mirror projects, names, and content are original work of
              Open Mirror LLC unless credited otherwise. Do not reuse them
              without permission.
            </p>
          </Section>

          <Section title="Third-party services">
            <p>
              Open Mirror sites may use or link to services operated by other
              companies, including hosting platforms, embedded media, public
              APIs, and app services. Open Mirror does not control the content,
              availability, privacy practices, or terms of those services.
            </p>
            <p>
              Sources and materials used with permission or under applicable
              platform terms are credited where appropriate.
            </p>
          </Section>

          <Section title="Corrections and concerns">
            <p>
              To report incorrect information, a broken link, an attribution or
              rights concern, or a possible conflict, email <Mail />. The
              concern will be reviewed and corrected where appropriate.
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
