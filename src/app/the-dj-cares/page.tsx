const features = [
  {
    title: "Christian Music & Artists",
    emoji: "🎵",
    text: "Songs, artists, videos, playlists, and concerts that lift the heart and keep worship moving through everyday life.",
  },
  {
    title: "Sermons, Podcasts & Digital Media",
    emoji: "🎙️",
    text: "Messages, testimonies, videos, podcasts, and conversations that encourage faith and point people back to truth.",
  },
  {
    title: "Pastor Dave Blog",
    emoji: "✍️",
    text: "Pastoral wisdom, Bible reflection, encouragement, and teaching for individuals, families, churches, and communities.",
  },
  {
    title: "Bible Study Repository",
    emoji: "📖",
    text: "Bible studies, devotionals, lessons, sermon notes, and group resources to help people open Scripture and go deeper.",
  },
  {
    title: "Local Churches",
    emoji: "⛪",
    text: "A place to help people discover churches serving their communities and pointing people to Jesus.",
  },
  {
    title: "Christian Charities & Ministries",
    emoji: "🤝",
    text: "A way to connect people with ministries and charities serving real needs with faith, compassion, and action.",
  },
  {
    title: "Christian Businesses & Bookstores",
    emoji: "🛍️",
    text: "Local and online Christian-preferred businesses, retailers, privately owned bookstores, and used Christian bookshops.",
  },
  {
    title: "Shareable Encouragement",
    emoji: "❤️",
    text: "Simple resources people can send to family, friends, churches, small groups, and anyone who needs hope.",
  },
];

export default function TheDJCaresPage() {
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const verseOfTheDayUrl = `https://www.bibleportal.com/verse-of-the-day?version=NIV&date=${todayDate}`;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="grid grid-cols-3 items-center">
          <a href="/welcome" className="justify-self-start font-bold">
            Cross Heart Pray
          </a>

          <a
            href={verseOfTheDayUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open today's Bible verse"
            className="justify-self-center"
          >
            <img
              src="/brand/youversion-bible-app.png"
              alt="Holy Bible"
              className="h-10 w-10 rounded-lg"
            />
          </a>

          <details className="relative justify-self-end text-sm text-zinc-400">
            <summary className="cursor-pointer list-none text-2xl leading-none">
              ☰
            </summary>

            <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
              <a href="/welcome">Home</a>
              <a href="/cross-heart-pray/cross">Cross</a>
              <a href="/cross-heart-pray/heart">Heart</a>
              <a href="/cross-heart-pray/pray">Pray</a>
              <a href="/the-dj-cares">TheDJCares</a>
              <a href="/what-am-i-ai">WhatAmIAI</a>
              <a href="/bible-explorer">Bible Explorer</a>
            </div>
          </details>
        </nav>

        <section className="px-6 py-16 text-center">
          <div className="mb-6 text-7xl">🎵 ❤️ 🤝</div>

          <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-yellow-400">
            Coming Soon
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            TheDJCares
          </h1>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 px-8 py-14 text-center">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-yellow-400">
            Cross Heart Pray Stamped
          </p>

          <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
            Gospel first.
            <br />
            Encouragement always.
            <br />
            Jesus at the center.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            Featured resources should be encouraging, Scripture-aligned, widely
            trusted, and pure in purpose. Cross Heart Pray stamped means one
            question leads the review: does this point people toward Jesus?
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center"
              style={{
                minHeight: "250px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-5xl">{feature.emoji}</div>

              <h2 className="mt-8 text-2xl font-bold">{feature.title}</h2>

              <p className="mt-4 leading-7 text-zinc-400">{feature.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 px-8 py-14 text-center">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-yellow-400">
            Churches, Ministries & Christian Charities
          </p>

          <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
            Let&apos;s talk about how TheDJCares may serve your community.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            If your church, ministry, charity, bookstore, or Christian business
            wants to share Gospel-first resources, encourage people, highlight
            service opportunities, or explore how this platform may support your
            mission, we want to hear from you.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:ask@openmirrorllc.com?subject=TheDJCares%20Church%20%2F%20Ministry%20Interest"
              className="rounded-full bg-white px-8 py-3 font-semibold text-black"
            >
              Connect With TheDJCares
            </a>

            <a
              href="/welcome"
              className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-white"
            >
              Back to Cross Heart Pray
            </a>
          </div>
        </section>

        <section className="border-t border-zinc-900 px-6 py-20 text-center">
          <a
            href="/bible-explorer"
            className="rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Open Bible Explorer
          </a>
        </section>

        <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
          © 2026 Open Mirror LLC. Follow Jesus. Love God. Pray.
        </footer>
      </div>
    </main>
  );
}
