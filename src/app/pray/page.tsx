import Link from "next/link";

export default function PrayPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-5">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">Cross Heart Pray</Link>
          <Link href="/cross-heart-pray/reflect" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">
            Begin Reflection
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mb-6 text-7xl">🙏</div>
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-zinc-500">Step Three</p>
        <h1 className="mb-6 text-5xl font-bold">Pray into the next faithful step.</h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-zinc-300">
          Praise God, ask for His will, and ask for strength to follow.
        </p>

        <div className="grid gap-4 text-left md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">1</p>
            <h2 className="mb-2 text-xl font-semibold">Praise</h2>
            <p className="text-zinc-400">Remember who God is before reacting to what happened.</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">2</p>
            <h2 className="mb-2 text-xl font-semibold">Ask</h2>
            <p className="text-zinc-400">Ask for His will, wisdom, peace, courage, and humility.</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">3</p>
            <h2 className="mb-2 text-xl font-semibold">Follow</h2>
            <p className="text-zinc-400">Take the next faithful step, even if it is small.</p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Reflection Question</p>
          <p className="text-zinc-300">
            What is the next faithful step God may be calling me to take?
          </p>
        </div>

        <Link
          href="/cross-heart-pray/reflect"
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Begin Reflection
        </Link>
      </section>
    </main>
  );
}