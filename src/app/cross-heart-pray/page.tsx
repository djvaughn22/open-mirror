cat > src/app/heart/page.tsx <<'EOF'
import Link from "next/link";

export default function HeartPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-5">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Open Mirror
          </Link>

          <div className="flex gap-5 text-sm text-zinc-400">
            <Link href="/cross-heart-pray">Cross Heart Pray</Link>
            <Link href="/cross-heart-pray/reflect">Talk To The Mirror</Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mb-6 text-7xl">❤️</div>

        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-zinc-500">
          Step Two
        </p>

        <h1 className="mb-6 text-5xl font-bold">
          Receive God&apos;s Love
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl leading-9 text-zinc-300">
          God does not merely tolerate you.
          <br />
          He loves you.
        </p>

        <div className="mx-auto max-w-3xl space-y-6 text-left text-lg leading-8 text-zinc-300">
          <p>
            Not because you earned it.
          </p>

          <p>
            Not because you deserve it.
          </p>

          <p>
            Because that is who He is.
          </p>

          <p>
            His mercy is new every morning.
          </p>

          <p>
            His grace is sufficient.
          </p>

          <p>
            His promises are true.
          </p>
        </div>

        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">1</p>
            <h2 className="mb-2 text-xl font-semibold">Receive Love</h2>
            <p className="text-zinc-400">
              Let God&apos;s love speak louder than shame, fear, pride, or failure.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">2</p>
            <h2 className="mb-2 text-xl font-semibold">Trust Mercy</h2>
            <p className="text-zinc-400">
              You are not beyond grace. You are not forgotten. You are not alone.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-3 text-3xl">3</p>
            <h2 className="mb-2 text-xl font-semibold">Share Love</h2>
            <p className="text-zinc-400">
              Love received becomes love given.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Reflection Question</p>
          <p className="text-zinc-300">
            What would change if you truly believed God loved you?
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-2 font-semibold">Scripture</p>
          <p className="text-zinc-300">
            &quot;We love because He first loved us.&quot;
          </p>
          <p className="mt-2 text-zinc-500">1 John 4:19</p>
        </div>

        <Link
          href="/cross-heart-pray/reflect"
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black"
        >
          Talk To The Mirror
        </Link>
      </section>
    </main>
  );
}
EOF