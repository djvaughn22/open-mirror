import Link from "next/link";

export default function HeartPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-5">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">Cross Heart Pray</Link>
          <Link href="/#begin" className="rounded-full border border-zinc-700 px-4 py-2 text-sm">
            Begin Reflection
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mb-6 text-7xl">❤️</div>
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-zinc-500">Step Two</p>
        <h1 className="mb-6 text-5xl font-bold">Let God’s love tell the truth.</h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-zinc-300">
          Your feelings are real, but they are not your foundation. God’s Word is.
        </p>

        <div className="grid gap-4 text-left md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">1</p>
            <h2 className="mb-2 text-xl font-semibold">Notice the lie</h2>
            <p className="text-zinc-400">Fear, shame, pride, rejection, or self-condemnation.</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">2</p>
            <h2 className="mb-2 text-xl font-semibold">Receive the truth</h2>
            <p className="text-zinc-400">You are loved by God through Christ.</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">3</p>
            <h2 className="mb-2 text-xl font-semibold">Walk in grace</h2>
            <p className="text-zinc-400">God’s love frees you to repent, heal, and move forward.</p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Reflection Question</p>
          <p className="text-zinc-300">
            What truth about God’s love do I need to receive today?
          </p>
        </div>

        <Link
          href="/#begin"
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Begin Reflection
        </Link>
      </section>
    </main>
  );
}