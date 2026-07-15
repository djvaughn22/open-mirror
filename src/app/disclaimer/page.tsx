import type { Metadata } from "next";
import { STUDIO } from "../../lib/products";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Legal disclaimer for Open Mirror LLC — an independent company operated on personal time.",
  alternates: { canonical: "/disclaimer" },
};

// The dedicated home for the full legal / non-affiliation language. Kept off
// the main About and product copy so visitors only read it if they come
// looking for it. Wording is the owner's conflict-of-interest shield — do
// not shorten or reword without DJ.
export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">
          Disclaimer
        </p>
        <h1 className="mb-6 text-2xl font-black tracking-tight sm:text-3xl">
          About Open Mirror LLC
        </h1>

        <div className="flex flex-col gap-4 text-sm font-medium leading-7 text-[#94a3b8]">
          <p>
            Open Mirror LLC is an independent company, created and operated
            entirely on personal time. It is not affiliated with, sponsored
            by, or endorsed by its owner&apos;s employer, and its projects —
            small consumer experiments built to learn — neither compete with
            nor draw on that employer&apos;s business.
          </p>
          <p>
            Any apparent overlap is unintentional; report it to{" "}
            <a
              href={`mailto:${STUDIO.email}`}
              className="font-semibold text-[#7dd3fc]"
            >
              {STUDIO.email}
            </a>{" "}
            and it will be corrected. The views expressed across its sites are
            solely its own.
          </p>
          <p>
            Some Open Mirror products are free to use; others are one-time paid
            playbooks. Nothing on these sites is a subscription. Where a paid
            product is described before a checkout exists, it is marked as being
            prepared for release — not offered for sale.
          </p>
        </div>

        <p className="mt-10 border-t border-[#26324c] pt-6 text-center text-xs font-semibold text-[#64748b]">
          {STUDIO.name} ·{" "}
          <a href={`mailto:${STUDIO.email}`} className="font-black text-[#7dd3fc]">
            {STUDIO.email}
          </a>
        </p>
      </div>
    </main>
  );
}
