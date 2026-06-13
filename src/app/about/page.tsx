export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <nav className="mb-16 grid grid-cols-3 items-center">
          <a href="/welcome" className="justify-self-start font-bold">
            CrossHeartPray
          </a>

          <span aria-hidden="true" />

          <div className="justify-self-end flex items-center gap-4">
            <a href="https://www.bible.com/verse-of-the-day" target="_blank" rel="noopener noreferrer" aria-label="Open YouVersion Bible App">
              <img src="/brand/youversion-bible-app.png" alt="YouVersion Bible App" className="h-9 w-9 rounded-lg" />
            </a>

            <details className="relative text-sm text-zinc-400">
              <summary className="cursor-pointer list-none text-2xl leading-none">☰</summary>
              <div className="absolute right-0 z-50 mt-4 flex w-56 flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 text-right shadow-2xl">
              <a href="/welcome">Home</a>
              <a href="/cross-heart-pray/cross">Cross</a>
              <a href="/cross-heart-pray/heart">Heart</a>
              <a href="/cross-heart-pray/pray">Pray</a>
              <a href="/the-dj-cares">TheDJCares</a>
              <a href="/what-am-i-ai">WhatAmIAI</a>
              <a href="/bible-explorer">Holy Bible Explorer</a>
              <a href="https://www.bibleportal.com/" target="_blank" rel="noopener noreferrer">
                Bible Portal
              </a>
              <a href="/about">About</a>
            </div>
            </details>
          </div>
        </nav>

      <section className="mx-auto max-w-3xl space-y-6 text-lg leading-8 text-zinc-300">
        <h1 className="text-4xl font-bold text-white">About CrossHeartPray</h1>

        <p>CrossHeartPray is built around a simple idea:</p>

        <p className="text-5xl">✝️ ❤️ 🙏</p>

        <p>Cross. Heart. Pray.</p>

        <p>For generations, people have been taught to turn to God through faith, Scripture, prayer, family, and community.</p>

        <p>This isn&apos;t a new idea.</p>

        <p>It&apos;s an old one.</p>

        <p>CrossHeartPray simply puts those actions into a form that is easy to remember and easy to practice.</p>

        <p>Many of us accept these truths, but there is a difference between accepting something and actively living it.</p>

        <p>CrossHeartPray is about action.</p>

        <p>Coming to the Cross.</p>

        <p>Opening your heart to God&apos;s love.</p>

        <p>Praying through both the small things and the big things.</p>

        <p>The micro moments and the macro moments.</p>

        <p>The daily decisions and the life-changing ones.</p>

        <p>Over time, a consistent practice of Cross. Heart. Pray. can change the way we approach challenges, relationships, decisions, gratitude, suffering, and purpose.</p>

        <p>It is doing that for me.</p>

        <p>Not overnight.</p>

        <p>Not perfectly.</p>

        <p>Just one step at a time.</p>

        <p>After years of practicing these actions through everyday life, difficult seasons, planning, prayer, and reflection, I continue to experience a peace that is difficult to explain unless you&apos;ve experienced it yourself.</p>

        <p>Nothing is ever done in this process.</p>

        <p>Every day brings new decisions, new challenges, new opportunities to help others, and new reasons to return to the Cross, open my heart, and pray through it.</p>

        <p>Part of that journey also made me realize something simple.</p>

        <p>Many people want to open the Bible more often.</p>

        <p>They just don&apos;t always know where to start.</p>

        <p>CrossHeartPray is an attempt to make opening the Bible as easy as opening an app on your phone, clicking a button, exploring a Bible Bingo board, discovering a verse for today, and following that curiosity deeper into Scripture.</p>

        <p>The goal is not to keep people on CrossHeartPray.</p>

        <p>The goal is to help people open the Bible.</p>

        <p>That is why CrossHeartPray points to trusted resources, including the Holy Bible, Bible.com, and Bible Portal&apos;s lessons, verse collections, and Bible content.</p>

        <p>CrossHeartPray doesn&apos;t replace the Bible.</p>

        <p>It doesn&apos;t replace prayer.</p>

        <p>It doesn&apos;t replace church, family, or community.</p>

        <p>It is simply an invitation.</p>

        <p>✝️ Come to the Cross.</p>

        <p>❤️ Open your heart to God&apos;s love.</p>

        <p>🙏 Pray through it.</p>

        <p>Then take the next step.</p>

        <p>The Bible is the guide.</p>

        <p>Jesus is the destination.</p>

        <hr className="border-zinc-800" />

        <p>RIP Travis.</p>

        <p>This is for you.</p>

        <p className="text-5xl">✝️ ❤️ 🙏</p>
      </section>
    </main>
  );
}
