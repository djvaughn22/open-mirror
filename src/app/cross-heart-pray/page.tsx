import Link from "next/link";

const steps = [
  {
    emoji: "✝️",
    title: "Cross",
    href: "/cross",
    headline: "Lay down what you've been carrying.",
    text: "Bring the truth to Jesus. Find forgiveness, freedom, and a new beginning.",
  },
  {
    emoji: "❤️",
    title: "Heart",
    href: "/heart",
    headline: "Receive God's love, grace, mercy, and truth.",
    text: "Let His love speak louder than fear, shame, pride, and doubt. You are loved more than you know.",
  },
  {
    emoji: "🙏",
    title: "Pray",
    href: "/pray",
    headline: "Talk honestly with God.",
    text: "Praise Him. Thank Him. Ask for help. Trust Him with the next step.",
  },
];

export default function CrossHeartPrayLandingPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between py-4">
        <Link href="/">Open Mirror</Link>

        <div className="flex gap-6 text-sm text-zinc-400">
          <Link href="/">Home</Link>
          <Link href="/cross-heart-pray/reflect">Reflect</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-5xl flex-col items-center py-20 text-center">
        <div className="mb-8 text-8xl">✝️❤️🙏</div>

        <h1 className="max-w-4xl text-5xl font-bold md:text-7xl">
          Cross Heart Pray
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-9 text-zinc-300">
          Bring what you see to God.
        </p>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Cross Heart Pray is a simple path for turning honest reflection into
          prayer, Scripture, hope, and the next step.
        </p>

        <Link
          href="/cross-heart-pray/reflect"
          className="mt-10 rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Talk To The Mirror
        </Link>
      </section>

      <section className="mx-auto max-w-6xl py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Link
              key={step.title}
              href={step.href}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 transition hover:-translate-y-1 hover:border-white"
            >
              <div className="mb-6 text-7xl">{step.emoji}</div>

              <h2 className="text-3xl font-bold">{step.title}</h2>

              <p className="mt-4 text-xl text-zinc-200">{step.headline}</p>

              <p className="mt-4 text-zinc-400">{step.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl py-20 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Scripture · Prayer · Next Step
        </p>

        <h2 className="text-4xl font-bold md:text-5xl">
          The Mirror helps you name what you are carrying.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          As Open Mirror grows, AI will help connect your reflection with
          prayer, relevant Scripture, encouragement, and a next step rooted in
          truth.
        </p>

        <Link
          href="/cross-heart-pray/reflect"
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Begin With The Mirror
        </Link>
      </section>
    </main>
  );
}