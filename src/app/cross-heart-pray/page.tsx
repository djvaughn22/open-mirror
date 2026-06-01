import Link from "next/link";

export default function CrossHeartPrayLandingPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between py-4">
        <Link href="/" className="font-semibold">Open Mirror</Link>

        <div className="flex gap-6 text-sm text-zinc-400">
          <Link href="/">Home</Link>
          <Link href="/what-am-i-ai">What Am I AI?</Link>
          <Link href="/the-dj-cares">The DJ Cares</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-4xl flex-col items-center py-20 text-center">
        <div className="mb-6 text-6xl">✝️❤️🙏</div>

        <h1 className="text-5xl font-bold tracking-tight">CrossHeartPray</h1>

        <p className="mt-6 max-w-2xl text-xl leading-9 text-zinc-300">
          Bring your burden to God.
          <br />
          Lay it at the Cross.
          <br />
          Receive God&apos;s love in your heart.
          <br />
          Hear His Word.
          <br />
          Pray for His will to be done.
          <br />
          Take the next faithful step.
        </p>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
          CrossHeartPray helps you bring what is weighing on your heart before
          God — not to force an easy answer, but to surrender your burden at the
          Cross, receive God&apos;s love in your heart, hear His truth through
          Scripture, pray for His will to be done, and follow where He leads.
        </p>

        <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
          <Link
            href="/cross-heart-pray/reflect"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-white hover:bg-zinc-900"
          >
            <div className="text-4xl">✝️</div>
            <h2 className="mt-4 text-xl font-bold">Cross</h2>
            <p className="mt-3 text-zinc-400">
              Lay your burden at the foot of the Cross. Release what you cannot
              carry and trust God with what you cannot control.
            </p>
          </Link>

          <Link
            href="/cross-heart-pray/reflect"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-white hover:bg-zinc-900"
          >
            <div className="text-4xl">❤️</div>
            <h2 className="mt-4 text-xl font-bold">Heart</h2>
            <p className="mt-3 text-zinc-400">
              Receive God&apos;s love and examine your heart. Allow His grace to
              reveal fear, pride, anger, grief, shame, hope, and truth.
            </p>
          </Link>

          <Link
            href="/cross-heart-pray/reflect"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-white hover:bg-zinc-900"
          >
            <div className="text-4xl">🙏</div>
            <h2 className="mt-4 text-xl font-bold">Pray</h2>
            <p className="mt-3 text-zinc-400">
              Praise God. Seek His will. Ask for wisdom, courage, and strength
              to follow wherever He leads.
            </p>
          </Link>
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