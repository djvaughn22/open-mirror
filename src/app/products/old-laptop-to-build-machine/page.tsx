import type { Metadata } from "next";
import Image from "next/image";
import { featuredProduct } from "../../../lib/products";
import { SERVICE_EMAIL } from "../../../lib/services";
import {
  PRICING,
  PRIVACY_PATH,
  SERVICE_TERMS_PATH,
} from "../../../lib/deviceRequest";
import { deviceRequestConfigured } from "../../../lib/deviceRequestServer";
import DeviceRequestForm from "./DeviceRequestForm";

// The first packaged Open Mirror product, featured from the About page.
// Name and promise come from the registry entry (`featured: true`).
//
// 2026-07-19: broadened from laptops only to old computers, then upgraded the
// same day from a mailto compatibility check to a real device-request
// workflow: request → review → manual Novo invoice → shipping instructions.
// The route keeps its original URL so existing links never break.
//
// Honesty rules baked in (and locked by tests/hub.test.ts + deviceRequest.test.ts):
//   - No checkout, no cart, no Buy Now, and no payment collected on this
//     website — ever. Approved requests are invoiced manually through Novo,
//     and payment happens on that hosted invoice.
//   - Pilot prices come only from the centralized PRICING config.
//   - Nobody is told to ship anything before Open Mirror accepts the exact
//     computer, confirms payment, and sends shipping instructions.
//   - No certified-data-destruction, guaranteed-compatibility, or
//     guaranteed-turnaround claims.

const PRODUCT = featuredProduct();
const TITLE = PRODUCT?.name ?? "Old Computer to Build Machine";
const PROMISE =
  PRODUCT?.description ??
  "Turn an old laptop or desktop PC into a clean build machine — ready to turn an idea into a live website.";

export const metadata: Metadata = {
  title: TITLE,
  description: PROMISE,
  alternates: { canonical: "/products/old-laptop-to-build-machine" },
  openGraph: {
    title: `${TITLE} | Open Mirror LLC`,
    description: PROMISE,
    url: "/products/old-laptop-to-build-machine",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${TITLE} | Open Mirror LLC`,
    description: PROMISE,
  },
};

const RELEASE_LIST_MAILTO = `mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(
  "Release list — Build Machine playbook"
)}&body=${encodeURIComponent(
  "Please add me to the release list for the Old Computer to Build Machine playbook.\n\nName:\n"
)}`;

// The manual workflow, spelled out — no step is automated or implied.
const HOW_IT_WORKS: { step: string; detail: string }[] = [
  {
    step: "Request",
    detail:
      "Tell Open Mirror about your laptop or desktop with the device request form below. No account, no payment — just honest answers about the machine.",
  },
  {
    step: "Review",
    detail:
      "Open Mirror reviews every request individually and replies: accepted, more information needed, or declined. Nothing is owed for a review.",
  },
  {
    step: "Invoice",
    detail:
      "An accepted request receives a secure Novo invoice by email. Depending on the payment options enabled on the invoice, you may pay through PayPal, Venmo, card, or another method shown there. No payment is taken on this website.",
  },
  {
    step: "Ship",
    detail:
      "After payment is confirmed, you receive written shipping instructions. Your request number travels with the device, and you hear back when it arrives.",
  },
];

// What happens after the form is submitted — the same promise the
// confirmation page and customer email make.
const WHAT_HAPPENS_NEXT = [
  "Open Mirror reviews your request and replies by your preferred contact method.",
  "No payment is taken on this website, and no payment is requested until a request is accepted.",
  "An accepted request receives a secure Novo invoice by email.",
  "Payment happens on that hosted invoice — PayPal, Venmo, card, or another method enabled on it.",
  "Shipping instructions follow confirmed payment. Until then, keep the device at home.",
];

// Preliminary packing guidance only — final instructions come with approval.
const PACKING_PREVIEW = [
  "Wait for written approval and shipping instructions before packing anything.",
  "A sturdy reused box with proper computer-safe padding is fine; original manufacturer packaging is preferred when you have it.",
  "Laptops: include the charger when requested. Desktops: include the power cable when requested — keep your monitor, keyboard, and mouse.",
  "Write your request number on a note inside the box.",
  "Laptops with swollen or damaged batteries must not be shipped.",
];

// What a finished build machine contains — laptop or desktop.
const MACHINE_CONTAINS = [
  "A clean, supported Linux operating system",
  "Current operating-system updates",
  "A modern browser",
  "Visual Studio Code",
  "Git, connected to GitHub",
  "Node.js",
  "An Open Mirror starter project",
  "A tested path from edit → save → live website",
];

// Why an old desktop can be a strong candidate.
const WHY_DESKTOPS = [
  "Memory and storage are often replaceable",
  "No aging laptop battery to worry about",
  "Strong performance for the cost",
  "Still useful after retiring as the family computer",
  "Usually easier to open, maintain, and upgrade",
  "More ports and stronger cooling",
];

const PLAYBOOK_CONTENTS = [
  "Computer-readiness guidance",
  "Laptop and desktop compatibility guidance",
  "Linux installation instructions",
  "Supported build-tool setup: browser, Visual Studio Code, Git, Node.js",
  "GitHub setup guidance",
  "A starter project",
  "A deployment walkthrough",
  "Verification checklist",
  "Troubleshooting guidance",
  "Recovery preparation",
  "Desktop notes: monitors, Ethernet, Wi-Fi adapters, storage, peripherals",
];

const CONVERSION_INTENDED = [
  "Initial hardware-readiness inspection",
  "Exterior condition and serial-number documentation",
  "Existing internal drive erased as part of installation",
  "Supported Linux installation and operating-system updates",
  "Browser, Visual Studio Code, Git, and Node.js installed",
  "Practical build-tool configuration",
  "Open Mirror starter project",
  "Basic GitHub connection guidance",
  "System boot and USB testing",
  "Sound testing, when supported",
  "Ethernet testing for desktops, when available",
  "Wi-Fi testing when built in, or with a compatible adapter you supply",
  "Keyboard and pointing-device testing",
  "Video-output testing for desktops",
  "A simple returned-device test report",
  "A printed or digital quick-start guide",
  "Limited setup support for 30 days",
];

const NOT_INCLUDED_GROUPS: { heading: string; items: string[] }[] = [
  {
    heading: "Repair work",
    items: [
      "Hardware repair or board-level repair",
      "Broken-screen replacement",
      "Liquid-damage repair",
      "Battery repair or replacement",
      "Power-supply or graphics-card repair",
      "Monitor repair",
    ],
  },
  {
    heading: "Your data",
    items: [
      "Data backup",
      "Data recovery",
      "Transfer of personal files",
    ],
  },
  {
    heading: "Parts, software, and peripherals",
    items: [
      "Parts of any kind",
      "Paid software or Windows licensing",
      "A monitor, keyboard, or mouse",
      "Shipping of monitors, unless specifically approved",
    ],
  },
  {
    heading: "Devices we can't take in the pilot",
    items: [
      "Apple computers and Chromebooks",
      "School, employer, government, leased, or managed devices",
      "Devices with unknown BIOS or firmware passwords, or organizational locks",
      "Devices with swollen, leaking, recalled, or physically damaged batteries",
    ],
  },
  {
    heading: "Guarantees we don't make",
    items: [
      "Guaranteed Linux compatibility",
      "Guaranteed future hardware life",
      "Guaranteed support for unusual internal components or proprietary accessories",
      "Guaranteed performance on unsupported hardware",
    ],
  },
];

const LAPTOP_REQS = [
  "Personally owned Intel or AMD 64-bit laptop",
  "4 GB RAM minimum · 8 GB preferred",
  "64 GB storage minimum · SSD strongly preferred",
  "Working screen, keyboard, and trackpad",
  "Working charging port and Wi-Fi",
  "No BIOS or firmware password",
  "No organizational management lock",
  "No serious physical damage",
  "No swollen or damaged battery",
];

const DESKTOP_REQS = [
  "Personally owned Intel or AMD 64-bit desktop",
  "Mini PC, small-form-factor desktop, or standard tower",
  "4 GB RAM minimum · 8 GB preferred",
  "64 GB storage minimum · SSD strongly preferred",
  "Working video output and USB ports",
  "Working Ethernet, or compatible Wi-Fi capability",
  "Its correct power cable",
  "No BIOS or firmware password",
  "No organizational management lock",
  "No severe physical or internal damage, liquid exposure, or unsafe power supply",
  "No internal contamination that makes safe servicing impractical",
];

const CUSTOMER_RESPONSIBILITIES = [
  "You must own the computer or have legal authority to approve the work.",
  "You are responsible for removing any organizational locks first.",
  "Open Mirror will inspect and approve the exact model before any shipment.",
  "Shipping instructions are sent only after a computer is approved and payment is confirmed.",
  "Customer-paid inbound shipping is anticipated for the mail-in pilot; return-shipping handling is confirmed in writing during review.",
  "A local drop-off pilot may open before broader shipping does.",
  "A sturdy reused box with proper computer-safe padding is fine; original manufacturer packaging is preferred when you have it. Open Mirror may reject inadequate packaging or ask for different packaging.",
  "Include the laptop charger or desktop power cable when requested.",
  "Do not ship a monitor, keyboard, mouse, speakers, printer, or any other peripheral unless specifically approved.",
  "Laptops with swollen or damaged batteries must not be shipped.",
  "Desktop towers may need stronger packaging and a separate shipping quote.",
  "Mini PCs and small-form-factor desktops can be especially good mail-in candidates — compact, and no large laptop battery — though acceptance still depends on the exact model, condition, weight, and packaging.",
];

const LOCAL_PILOT_TESTS = [
  "Intake",
  "Device inspection",
  "Compatibility",
  "Installation time",
  "Quality assurance",
  "Customer communication",
  "Returned-device onboarding",
  "Support needs",
];

const MAIL_IN_ACCEPTS = [
  "Approved laptops",
  "Approved mini PCs",
  "Approved small-form-factor desktops",
  "Selected desktop towers, quoted individually",
];

const MAIL_IN_EXCLUDES = [
  "Monitors",
  "Large gaming towers and custom liquid-cooled systems",
  "Fragile all-in-one desktops",
  "Servers and rack-mounted hardware",
  "Apple computers and Chromebooks",
  "Laptops with damaged batteries",
  "Organizationally managed devices",
];

const ROADMAP = [
  "Finish and verify the self-service playbook.",
  "Complete internal laptop and desktop test machines.",
  "Complete a small local conversion pilot.",
  "Open a limited local paid pilot.",
  "Measure installation time, support needs, compatibility, and real cost.",
  "Test approved laptops, mini PCs, and small desktops through a limited United States mail-in pilot.",
  "Add selected desktop towers once packaging and shipping procedures are proven.",
  "Expand only after the process is safe, profitable, and repeatable.",
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Can I send a desktop instead of a laptop?",
    a: "Yes — laptops and desktops are equally welcome to request. Mini PCs, small-form-factor desktops, and selected towers are all candidates. Every computer is reviewed and approved individually first.",
  },
  {
    q: "What types of desktops are accepted?",
    a: "Mini PCs and small-form-factor desktops are the easiest fits. Standard towers can work but may need an individual shipping quote. All-in-ones are reviewed case by case because they're fragile and screen-dependent.",
  },
  {
    q: "Is a mini PC a good candidate?",
    a: "Often, yes. They're compact, easy to ship, have no large laptop battery, and many have replaceable memory and storage.",
  },
  {
    q: "Do I need to send my monitor?",
    a: "No — please don't. Keep your monitor, and plug the returned machine into it. Monitors are only ever shipped if Open Mirror specifically approves an unusual case.",
  },
  {
    q: "Should I send my keyboard and mouse?",
    a: "No. Keep them — the returned machine will work with the ones you already have.",
  },
  {
    q: "Should I include the power cable or laptop charger?",
    a: "Yes, when requested during approval. The standard desktop service covers the computer and its required power cable.",
  },
  {
    q: "How do I pay?",
    a: "Not on this website. If your request is accepted, Open Mirror sends a secure Novo invoice by email. Depending on the payment options enabled on that invoice, you may pay through PayPal, Venmo, card, or another method shown on the invoice.",
  },
  {
    q: "When do I pay?",
    a: "Only after your request is accepted and you receive the invoice — never at submission. Shipping instructions come after payment is confirmed, so nothing ships before both sides know exactly where things stand.",
  },
  {
    q: "How do I know my request went through?",
    a: "You get an Open Mirror request number on the confirmation page, and a confirmation email when email delivery is available. Every later update — review result, invoice, shipping instructions — references that number.",
  },
  {
    q: "Are desktop computers easier to convert?",
    a: "Sometimes. They're often easier to open, upgrade, and keep cool, and there's no battery to age out. But it always depends on the exact model.",
  },
  {
    q: "Are desktop computers cheaper to ship?",
    a: "Not necessarily. A mini PC can be cheap to ship; a full tower can be heavy and need stronger packaging and an individual quote.",
  },
  {
    q: "Will you repair my computer?",
    a: "No. This is a conversion service for working computers, not a repair shop. Hardware repair of any kind is not included.",
  },
  {
    q: "Will you save my files?",
    a: "No. The internal drive is erased as part of installation. Back up everything you want to keep before anything else — backup, recovery, and file transfer are not included.",
  },
  {
    q: "Will I still have Windows?",
    a: "No. Windows is replaced by a supported Linux system. Windows licensing is not included and is not part of the service.",
  },
  {
    q: "Can every old computer become a build machine?",
    a: "No. Some are too old, too damaged, or incompatible. That's exactly what the request review is for — and meeting the basic requirements still doesn't guarantee acceptance.",
  },
  {
    q: "Can I send a MacBook or Mac desktop?",
    a: "Not during the pilot. Apple computers are excluded for now.",
  },
  {
    q: "Can I send a Chromebook?",
    a: "Not during the pilot. Chromebooks are excluded for now.",
  },
  {
    q: "Can I send an all-in-one desktop?",
    a: "Only after individual review. All-in-ones are more fragile, screen-dependent, and can be expensive to ship safely.",
  },
  {
    q: "Can I send a gaming PC?",
    a: "Large gaming towers and custom liquid-cooled systems are not part of the initial mail-in pilot. A standard tower may qualify with an individual quote.",
  },
  {
    q: "Who pays for shipping?",
    a: "For the mail-in pilot, customer-paid inbound shipping is anticipated, on top of the conversion price. Return-shipping handling is confirmed in writing during review, before any invoice is sent.",
  },
  {
    q: "Can I reuse my box?",
    a: "Yes, if it's structurally sound and padded properly for a computer. Original manufacturer packaging is preferred when you have it. Open Mirror may ask for different packaging before accepting a shipment.",
  },
  {
    q: "Should I send my computer now?",
    a: "No. Do not ship anything until Open Mirror has reviewed your request, explicitly accepted your exact computer, confirmed payment, and sent shipping instructions.",
  },
  {
    q: "What happens if it's not compatible?",
    a: "You'll hear that plainly, before anything ships, and nothing is owed. That's why the review happens first.",
  },
  {
    q: "Is this a secure-wipe or certified data-destruction service?",
    a: "No. The selected internal drive is erased during installation, but this is not marketed as certified data destruction, and permanent unrecoverability is not guaranteed. If you need certified destruction, use a dedicated service.",
  },
  {
    q: "What will I be able to build?",
    a: "A real website, built with the same practical tools used across Open Mirror: Linux, a browser, Visual Studio Code, Git, GitHub, and Node.js — starting from an included starter project.",
  },
  {
    q: "Is support included?",
    a: "The conversion is intended to include limited setup support for 30 days after the machine comes back.",
  },
  {
    q: "Is the service available now?",
    a: "Conversions run as a small pilot. Device requests are open now for laptops and desktops; every request is reviewed individually, and submitting one does not guarantee acceptance. The playbook is preparing for release.",
  },
];

function Check() {
  return (
    <span
      aria-hidden
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#34D399] text-[11px] font-black text-[#0b1220]"
    >
      ✓
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
      {children}
    </p>
  );
}

function CardList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 rounded-xl border border-[#26324c] bg-[#141d2e] px-4 py-3 text-sm font-semibold leading-5"
        >
          <Check />
          {item}
        </li>
      ))}
    </ul>
  );
}

function PlainList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-[#cbd5e1]">
          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function OldComputerToBuildMachine() {
  const requestFormEnabled = deviceRequestConfigured();

  return (
    <main className="min-h-screen bg-[#0b1220] text-[#e8edf5]">
      <div className="mx-auto max-w-2xl px-5 py-14">
        {/* 1 · Hero */}
        <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.2em] text-[#f59e0b]">
          Product · Preparing for Release
        </p>
        <h1 className="mb-4 text-balance text-center text-3xl font-black leading-[1.1] tracking-tight sm:text-4xl">
          {TITLE}
        </h1>
        <p className="mx-auto mb-6 max-w-md text-balance text-center text-base font-semibold leading-7 text-[#94a3b8]">
          Open Mirror turns an old laptop or desktop PC into a clean, working
          build machine — reviewed, approved, and invoiced person to person.
        </p>
        <div className="mb-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#request"
            className="inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-center text-sm font-black text-[#0C0C0C]"
          >
            Start a device request
          </a>
          <a
            href="#how-it-works"
            className="inline-block rounded-full border border-[#26324c] bg-[#141d2e] px-8 py-3.5 text-center text-sm font-black text-[#e8edf5]"
          >
            See how it works
          </a>
        </div>
        <p className="mb-8 text-center text-xs font-bold text-[#64748b]">
          Laptops and desktop PCs. No payment on this website.
        </p>

        {PRODUCT?.image && (
          <Image
            src={PRODUCT.image}
            alt={PRODUCT.imageAlt ?? ""}
            width={1080}
            height={1080}
            sizes="(min-width: 672px) 672px, 100vw"
            className="mb-10 h-auto w-full rounded-3xl border border-[#26324c]"
            priority
          />
        )}

        {/* 2 · Transformation */}
        <section className="mb-10 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 text-center">
          <div className="mb-2 text-3xl" aria-hidden>
            💻 🖥️
          </div>
          <p className="text-sm font-semibold leading-7 text-[#cbd5e1]">
            Old unused computer → clean supported operating system → practical
            build tools → tested development environment → ready to start
            creating. Laptop, mini PC, small-form-factor desktop, or approved
            tower.
          </p>
          <p className="mt-3 text-xs font-semibold leading-6 text-[#64748b]">
            Built from Open Mirror&apos;s original process for turning an older
            desktop PC into the machine used to create and publish its first
            products.
          </p>
        </section>

        {/* 3 · Two offer cards */}
        <section className="mb-10 grid gap-3 sm:grid-cols-2" aria-label="Two ways to get a build machine">
          <div className="flex flex-col rounded-3xl border border-[#26324c] bg-[#141d2e] p-6">
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#34D399]">
              Path 1 · Build It Yourself
            </p>
            <p className="mb-1 text-2xl font-black">{PRICING.playbook}</p>
            <p className="mb-3 text-xs font-bold text-[#94a3b8]">
              One-time · pilot pricing · preparing for release
            </p>
            <p className="mb-4 flex-1 text-sm font-semibold leading-6 text-[#94a3b8]">
              The complete self-service playbook. You keep your computer and do
              the conversion yourself, step by step.
            </p>
            <a
              href={RELEASE_LIST_MAILTO}
              className="inline-block rounded-full bg-[#34D399] px-6 py-3 text-center text-sm font-black text-[#0C0C0C]"
            >
              Join the release list
            </a>
          </div>
          <div className="flex flex-col rounded-3xl border border-[#26324c] bg-[#141d2e] p-6">
            <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#38BDF8]">
              Path 2 · Send Us Your Computer
            </p>
            <p className="mb-1 text-2xl font-black">{PRICING.conversionFrom}</p>
            <p className="mb-3 text-xs font-bold text-[#94a3b8]">
              Plus shipping · pilot pricing · limited availability
            </p>
            <p className="mb-4 flex-1 text-sm font-semibold leading-6 text-[#94a3b8]">
              The Open Mirror Build Machine Conversion: an approved computer is
              erased, configured, tested, and returned ready to build.
            </p>
            <a
              href="#request"
              className="inline-block rounded-full bg-[#38BDF8] px-6 py-3 text-center text-sm font-black text-[#0C0C0C]"
            >
              Start a device request
            </a>
          </div>
        </section>

        <p className="mb-10 text-center text-xs font-semibold leading-6 text-[#64748b]">
          Nothing is purchasable yet on this page and no payment is taken on
          this website — pilot pricing is shown so you know what to expect.
          Expected standard pricing after the pilot: starting at{" "}
          {PRICING.postPilotFrom} plus shipping. The {PRICING.conversionFrom.toLowerCase()}{" "}
          starting price covers an approved laptop, mini PC, or
          small-form-factor desktop needing no hardware repair or unusual
          compatibility work; larger towers, all-in-ones, and heavy or fragile
          systems may need an individual quote. {PRICING.reviewLine}
        </p>

        {/* 4 · How it works */}
        <section id="how-it-works" className="mb-10 scroll-mt-8">
          <Label>How it works</Label>
          <ol className="flex flex-col gap-2">
            {HOW_IT_WORKS.map((s, i) => (
              <li
                key={s.step}
                className="flex items-start gap-3 rounded-2xl border border-[#26324c] bg-[#141d2e] px-4 py-4"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#38BDF8] text-sm font-black text-[#0b1220]"
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block text-sm font-black">{s.step}</span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-[#94a3b8]">
                    {s.detail}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm font-bold leading-6 text-[#fbbf24]">
            Do not ship anything until Open Mirror has reviewed your request,
            accepted the exact computer, confirmed payment, and sent shipping
            instructions.
          </p>
        </section>

        {/* 5 · What the customer gets */}
        <section className="mb-10">
          <Label>What a finished build machine contains</Label>
          <CardList items={MACHINE_CONTAINS} />
        </section>

        {/* 6 · Laptop and desktop support — two equal paths */}
        <section className="mb-10" aria-label="Laptop and desktop support">
          <Label>Laptops and desktops, equally welcome</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-5">
              <p className="mb-1 text-2xl" aria-hidden>
                💻
              </p>
              <h2 className="mb-2 text-lg font-black tracking-tight">Laptop</h2>
              <p className="mb-3 text-sm font-semibold leading-6 text-[#94a3b8]">
                All-in-one and portable — the machine, screen, and keyboard
                travel together. Pilot requirements:
              </p>
              <PlainList items={LAPTOP_REQS} />
            </div>
            <div className="rounded-3xl border border-[#26324c] bg-[#141d2e] p-5">
              <p className="mb-1 text-2xl" aria-hidden>
                🖥️
              </p>
              <h2 className="mb-2 text-lg font-black tracking-tight">Desktop PC</h2>
              <p className="mb-3 text-sm font-semibold leading-6 text-[#94a3b8]">
                Mini PC, small-form-factor desktop, or standard tower — you
                keep your monitor, keyboard, and mouse. Pilot requirements:
              </p>
              <PlainList items={DESKTOP_REQS} />
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold leading-6 text-[#64748b]">
            Neither path is automatically cheaper, safer, or easier to ship —
            it always depends on the exact machine. All-in-one desktops are
            reviewed individually; they are more fragile, screen-dependent,
            and can cost more to ship. Meeting these requirements does not
            guarantee acceptance.
          </p>
        </section>

        {/* 7 · Why desktops */}
        <section className="mb-10">
          <Label>Why an old desktop can be a great build machine</Label>
          <CardList items={WHY_DESKTOPS} />
          <p className="mt-3 text-xs font-semibold leading-6 text-[#64748b]">
            Mini PCs and small-form-factor desktops are compact and easy to
            ship. Traditional towers are heavier, need stronger packaging, and
            may need an individual shipping quote.
          </p>
        </section>

        {/* What the playbook is intended to include */}
        <section className="mb-10">
          <Label>Inside the playbook (preparing for release)</Label>
          <p className="mb-3 text-sm font-semibold leading-6 text-[#94a3b8]">
            The finished playbook is intended to include:
          </p>
          <PlainList items={PLAYBOOK_CONTENTS} />
          <p className="mt-4 text-sm font-semibold leading-6 text-[#94a3b8]">
            Until it opens, the free readiness check is real and available
            today:{" "}
            <a
              href="/downloads/old-laptop-readiness-check.pdf"
              download
              className="font-black text-[#7dd3fc] underline"
            >
              download the free check (PDF)
            </a>
            .
          </p>
        </section>

        {/* 8 · Device request form */}
        <section id="request" className="mb-10 scroll-mt-8 rounded-3xl border border-[#26324c] bg-[#0f1826] p-6">
          <h2 className="mb-2 text-xl font-black tracking-tight">
            Start a device request
          </h2>
          <div className="mb-5 rounded-2xl border border-[#f59e0b]/40 bg-[#1c1608] p-4">
            <p className="text-sm font-bold leading-6 text-[#fbbf24]">
              Your internal drive will be erased. Back up everything you want
              to keep before sending or dropping off a computer. Open
              Mirror&apos;s standard conversion does not include backup,
              recovery, or transfer of personal files.
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#fbbf24]">
              Do not ship anything until Open Mirror has reviewed and
              explicitly accepted your exact computer, confirmed payment, and
              sent shipping instructions.
            </p>
          </div>
          <DeviceRequestForm enabled={requestFormEnabled} />
        </section>

        {/* 9 · What happens next */}
        <section className="mb-10">
          <Label>What happens after you submit</Label>
          <PlainList items={WHAT_HAPPENS_NEXT} />
        </section>

        {/* 10 · Packing preview */}
        <section className="mb-10">
          <Label>Packing, previewed</Label>
          <p className="mb-3 text-sm font-semibold leading-6 text-[#94a3b8]">
            Basic guidance so you know what to expect — the final, binding
            shipping instructions arrive only after your request is accepted
            and payment is confirmed:
          </p>
          <PlainList items={PACKING_PREVIEW} />
        </section>

        {/* 11 · What the service includes */}
        <section className="mb-10">
          <Label>What an approved conversion is intended to include</Label>
          <PlainList items={CONVERSION_INTENDED} />
          <p className="mt-3 text-xs font-semibold leading-6 text-[#64748b]">
            For desktops, the standard service covers the computer itself and
            its required power cable. Keep your own monitor, keyboard, mouse,
            speakers, printer, external drives, and other accessories at home.
          </p>
        </section>

        {/* 12 · What is not included */}
        <section className="mb-10">
          <Label>What this is not</Label>
          <div className="flex flex-col gap-2">
            {NOT_INCLUDED_GROUPS.map((group) => (
              <details
                key={group.heading}
                className="group rounded-2xl border border-[#26324c] bg-[#141d2e]"
              >
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-black">
                  <span aria-hidden className="mr-2 inline-block text-[#38BDF8] transition-transform group-open:rotate-90 motion-reduce:transition-none">
                    ›
                  </span>
                  {group.heading}
                </summary>
                <div className="px-4 pb-4">
                  <PlainList items={group.items} />
                </div>
              </details>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold leading-6 text-[#64748b]">
            Simple upgrades — an SSD, extra RAM, a compatible Wi-Fi adapter, a
            replacement power cable — may become separately quoted options
            later. They are not for sale now.
          </p>
        </section>

        {/* 13 · Data-erasure and ownership responsibilities */}
        <section className="mb-10 rounded-2xl border border-[#f59e0b]/40 bg-[#1c1608] p-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#f59e0b]">
            Before anything ships — your responsibilities
          </p>
          <PlainList items={CUSTOMER_RESPONSIBILITIES} />
        </section>

        {/* 14 · Local pilot */}
        <section className="mb-10">
          <Label>How the local pilot works</Label>
          <p className="mb-3 text-sm font-semibold leading-6 text-[#94a3b8]">
            The first paid conversions are handled through controlled,
            appointment-only local drop-off and pickup. That keeps the pilot
            small while Open Mirror tests every part of the process:
          </p>
          <div className="flex flex-wrap gap-2">
            {LOCAL_PILOT_TESTS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#26324c] bg-[#141d2e] px-3 py-1.5 text-xs font-bold text-[#94a3b8]"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* 15 · Mail-in pilot */}
        <section className="mb-10">
          <Label>The limited mail-in pilot, after that</Label>
          <p className="mb-3 text-sm font-semibold leading-6 text-[#94a3b8]">
            Mail-in service opens only after the local process is proven. The
            initial United States mail-in pilot may accept:
          </p>
          <PlainList items={MAIL_IN_ACCEPTS} />
          <p className="mb-3 mt-4 text-sm font-semibold leading-6 text-[#94a3b8]">
            It will not automatically accept:
          </p>
          <PlainList items={MAIL_IN_EXCLUDES} />
        </section>

        {/* 16 · Roadmap */}
        <section className="mb-10">
          <Label>The pilot roadmap</Label>
          <ol className="flex flex-col gap-2">
            {ROADMAP.map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-sm font-semibold leading-6 text-[#cbd5e1]">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#26324c] bg-[#141d2e] text-xs font-black text-[#38BDF8]"
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* 17 · FAQ */}
        <section className="mb-10">
          <Label>Questions, answered plainly</Label>
          <div className="flex flex-col gap-2">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-[#26324c] bg-[#141d2e]">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-black leading-6">
                  <span aria-hidden className="mr-2 inline-block text-[#38BDF8] transition-transform group-open:rotate-90 motion-reduce:transition-none">
                    ›
                  </span>
                  {f.q}
                </summary>
                <p className="px-4 pb-4 text-sm font-semibold leading-6 text-[#94a3b8]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 18 · Service terms and privacy */}
        <section className="mb-10 rounded-2xl border border-[#26324c] bg-[#141d2e] p-5 text-center">
          <p className="mb-2 text-sm font-black">The fine print, in plain language</p>
          <p className="text-sm font-semibold leading-6 text-[#94a3b8]">
            <a href={SERVICE_TERMS_PATH} className="font-black text-[#7dd3fc] underline">
              Service terms
            </a>{" "}
            ·{" "}
            <a href={PRIVACY_PATH} className="font-black text-[#7dd3fc] underline">
              Privacy notice for device requests
            </a>
          </p>
        </section>

        {/* 19 · Final action */}
        <section className="mb-10 rounded-3xl border border-[#26324c] bg-[#141d2e] p-6 text-center">
          <p className="mb-3 text-sm font-semibold leading-6 text-[#94a3b8]">
            Have an old laptop or desktop gathering dust? Tell Open Mirror
            about it — the review is free, and you&apos;ll get a straight
            answer.
          </p>
          <a
            href="#request"
            className="inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-sm font-black text-[#0C0C0C]"
          >
            Start a device request
          </a>
        </section>

        {/* 20 · Independence statement */}
        <p className="mb-2 text-center text-xs font-semibold leading-6 text-[#64748b]">
          An independent Open Mirror LLC product and service. Built and
          operated using Open Mirror&apos;s own time, equipment, accounts, and
          resources.
        </p>
        <p className="text-center text-xs font-semibold leading-6 text-[#64748b]">
          <a href="/disclaimer" className="underline">Disclaimer and independence</a>
        </p>
      </div>
    </main>
  );
}
