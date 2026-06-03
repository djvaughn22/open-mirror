import Link from "next/link";

const steps = [
{
emoji: "✝️",
title: "Cross",
href: "/cross",
headline: "Surrender what you cannot carry.",
text: "Bring your burdens, failures, fears, guilt, grief, and regrets to the Cross.",
},
{
emoji: "❤️",
title: "Heart",
href: "/heart",
headline: "Receive love, grace, and truth.",
text: "Allow God's love to speak louder than fear, shame, pride, and doubt.",
},
{
emoji: "🙏",
title: "Pray",
href: "/pray",
headline: "Take the next faithful step.",
text: "Bring everything before God in prayer and walk forward in faith.",
},
];

export default function CrossHeartPrayLandingPage() {
return ( <main className="min-h-screen bg-black px-6 py-10 text-white"> <nav className="mx-auto flex max-w-6xl items-center justify-between py-4"> <Link href="/">Open Mirror</Link>

```
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
      A simple path toward truth, hope, and God.
    </p>

    <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
      The journey begins with honest reflection.
    </p>

    <Link
      href="/cross-heart-pray/reflect"
      className="mt-10 rounded-full bg-white px-8 py-3 font-semibold text-black"
    >
      Begin Reflection
    </Link>
  </section>

  <section className="mx-auto max-w-6xl py-10">
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step) => (
        <Link
          key={step.title}
          href={step.href}
          className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
        >
          <div className="mb-6 text-7xl">{step.emoji}</div>

          <h2 className="text-3xl font-bold">{step.title}</h2>

          <p className="mt-4 text-xl text-zinc-200">
            {step.headline}
          </p>

          <p className="mt-4 text-zinc-400">{step.text}</p>
        </Link>
      ))}
    </div>
  </section>
</main>

);
}
