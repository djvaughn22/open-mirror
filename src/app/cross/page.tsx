import Link from "next/link";

export default function CrossPage() {
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
        <div className="mb-6 text-7xl">✝️</div>
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-zinc-500">Step One</p>
        <h1 className="mb-6 text-5xl font-bold">Bring it to the Cross.</h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-zinc-300">
          Name what is heavy. Stop hiding it. Give it honestly to Christ.
        </p>

        <div className="grid gap-4 text-left md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">1</p>
            <h2 className="mb-2 text-xl font-semibold">Name it</h2>
            <p className="text-zinc-400">Fear, shame, anger, sin, confusion, regret, or decision.</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">2</p>
            <h2 className="mb-2 text-xl font-semibold">Stop carrying it alone</h2>
            <p className="text-zinc-400">You were not made to save yourself.</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">3</p>
            <h2 className="mb-2 text-xl font-semibold">Surrender it</h2>
            <p className="text-zinc-400">Bring the real thing to Jesus, not the polished version.</p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Reflection Question</p>
          <p className="text-zinc-300">
            What do I need to bring honestly to God today?
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