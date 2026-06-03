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
          <Link href="/cross">Cross</Link>
          <Link href="/heart">Heart</Link>
          <Link href="/pray">Pray</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-4xl flex-col items-center py-20 text-center">
        <div className="mb-6 text-6xl">✝️❤️🙏</div>

        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Cross Heart Pray
        </p>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          A Simple Path Toward Truth, Hope, and God
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-9 text-zinc-300">
          Cross Heart Pray helps move honest reflection toward faith, freedom,
          and a deeper relationship with God.
        </p>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Not through perfection. Not through performance. Through surrender,
          grace, and prayer.
        </p>

        <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
          <Link
            href="/cross"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-white hover:bg-zinc-900"
          >
            <div className="text-4xl">✝️</div>
            <h2 className="mt-4 text-xl font-bold">Cross</h2>
            <p className="mt-3 text-zinc-400">
              Surrender. Repent. Receive forgiveness. Freedom begins at the
              Cross.
            </p>
          </Link>

          <Link
            href="/heart"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-white hover:bg-zinc-900"
          >
            <div className="text-4xl">❤️</div>
            <h2 className="mt-4 text-xl font-bold">Heart</h2>
            <p className="mt-3 text-zinc-400">
              Receive God&apos;s love. Trust His promises. Share His love with
              others.
            </p>
          </Link>

          <Link
            href="/pray"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-white hover:bg-zinc-900"
          >
            <div className="text-4xl">🙏</div>
            <h2 className="mt-4 text-xl font-bold">Pray</h2>
            <p className="mt-3 text-zinc-400">
              Talk with God. Listen. Trust. Take the next faithful step.
            </p>
          </Link>
        </div>

        <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-lg leading-8 text-zinc-300">
            Cross. Heart. Pray.
            <br />
            Surrender to Christ.
            <br />
            Receive His love.
            <br />
            Walk forward in prayer.
          </p>
        </div>

        <Link
          href="/cross-heart-pray/reflect"
          className="mt-12 rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Talk To The Mirror
        </Link>
      </section>
    </main>
  );
}

