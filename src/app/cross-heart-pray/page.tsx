import Link from "next/link";

export default function CrossHeartPrayLandingPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between py-4">
        <Link href="/" className="font-semibold">
          Open Mirror
        </Link>

        <div className="flex gap-6 text-sm text-zinc-400">
          <Link href="/">Home</Link>
          <Link href="/what-am-i-ai">What Am I AI?</Link>
          <Link href="/the-dj-cares">The DJ Cares</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-4xl flex-col items-center py-20 text-center">
        <div className="mb-6 text-6xl">✝️❤️🙏</div>

        <h1 className="text-5xl font-bold tracking-tight">
          CrossHeartPray
        </h1>

        <p className="mt-6 max-w-2xl text-xl text-zinc-300">
          Bring your situation.
          <br />
          Seek wisdom.
          <br />
          Pray with confidence.
        </p>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          CrossHeartPray helps you bring what is weighing on your heart before
          God — not to force an easy answer, but to reflect through the Cross,
          receive God&apos;s love, pray with Scripture, and take the next
          faithful step.
        </p>

        <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="text-4xl">✝️</div>
            <h2 className="mt-4 text-xl font-bold">Cross</h2>
            <p className="mt-3 text-zinc-400">
              Start with what Christ has already done before trying to fix
              yourself or the situation.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="text-4xl">❤️</div>
            <h2 className="mt-4 text-xl font-bold">Heart</h2>
            <p className="mt-3 text-zinc-400">
              Honestly name fear, shame, anger, grief, pride, hurt, or control
              before God.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="text-4xl">🙏</div>
            <h2 className="mt-4 text-xl font-bold">Pray</h2>
            <p className="mt-3 text-zinc-400">
              Pray with Scripture, humility, confession, thanksgiving, and
              trust.
            </p>
          </div>
        </div>

        <Link
          href="/cross-heart-pray/reflect"
          className="mt-12 rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Begin Reflection
        </Link>
      </section>
    </main>
  );
}