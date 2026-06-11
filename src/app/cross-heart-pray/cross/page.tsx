export default function CrossPage() {
  return (
    <main className="min-h-screen bg-black text-white">



        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/cross-heart-pray/heart"
            className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black"
          >
            Next: Heart
          </a>
          <a
            href="/cross-heart-pray/reflect"
            className="rounded-full border border-zinc-700 px-8 py-3 text-center font-semibold text-white hover:border-white"
          >
            Begin Reflection
          </a>
        </div>
      </section>
    </main>
  );
}