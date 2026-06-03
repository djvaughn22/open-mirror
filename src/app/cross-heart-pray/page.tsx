"use client";

import Link from "next/link";
import { useState } from "react";

const reflections = [
{
keywords: ["enough", "worth", "failure", "ashamed", "shame"],
title: "Identity and Worth",
verse:
"For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.",
reference: "Ephesians 2:8",
cross:
"Lay your striving, comparison, shame, and fear at the foot of the Cross. Christ is enough where you are not.",
heart:
"Receive God's love. Your value is not measured by performance, approval, success, or being enough.",
prayer:
"Father, thank You for Your grace. Help me stop trying to prove I am enough and rest in Christ.",
step:
"Thank God for His grace and do one faithful thing today without trying to earn your worth.",
},
];

const fallback = {
title: "Burden and Rest",
verse:
"Come to me, all who labor and are heavy laden, and I will give you rest.",
reference: "Matthew 11:28",
cross:
"Lay this burden at the foot of the Cross. Surrender what you cannot control.",
heart:
"Receive God's love. He already sees your fear, anger, grief, shame, confusion, and hope.",
prayer:
"Father, I give this burden to You. Let Your will be done and guide my next step.",
step:
"Pause. Pray honestly. Choose one small faithful action instead of trying to solve everything at once.",
};

export default function CrossHeartPrayReflectPage() {
const [problem, setProblem] = useState("");
const [reflection, setReflection] = useState(fallback);
const [showReflection, setShowReflection] = useState(false);

function beginReflection() {
const text = problem.toLowerCase();

const match =
  reflections.find((item) =>
    item.keywords.some((keyword) => text.includes(keyword))
  ) || fallback;

setReflection(match);
setShowReflection(true);

}

return ( <main className="min-h-screen bg-black px-6 py-10 text-white"> <nav className="mx-auto flex max-w-5xl items-center justify-between py-4"> <Link href="/">Open Mirror</Link>

    <div className="flex gap-6 text-sm text-zinc-400">
      <Link href="/">Home</Link>
      <Link href="/cross-heart-pray">Cross Heart Pray</Link>
    </div>
  </nav>

  <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
    <div className="mb-6 text-6xl">🪞</div>

    <h1 className="text-5xl font-bold tracking-tight">
      Look In The Mirror
    </h1>

    <p className="mt-6 max-w-2xl text-xl leading-9 text-zinc-300">
      The Truth Will Set You Free.
      <br />
      <br />
      The mirror doesn't judge.
      <br />
      The mirror reveals.
      <br />
      <br />
      What are you feeling?
      <br />
      What are you seeking?
      <br />
      What are you avoiding?
      <br />
      What truth are you refusing to face?
    </p>

    <div className="mt-12 w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left">
      <label className="text-sm font-semibold text-zinc-300">
        What is weighing on your heart today?
      </label>

      <textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        className="mt-4 min-h-36 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none"
        placeholder="Be honest. Don't lie to the mirror."
      />

      <button
        onClick={beginReflection}
        className="mt-5 rounded-full bg-white px-8 py-3 font-semibold text-black"
      >
        Talk To The Mirror
      </button>
    </div>

    {showReflection && (
      <div className="mt-10 w-full space-y-6 text-left">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">🪞 The Mirror</h2>
          <p className="mt-4 text-zinc-300">
            Here's what I notice. Let's explore this together.
          </p>
          <p className="mt-4 text-zinc-400">{reflection.title}</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">✝️ Cross</h2>
          <p className="mt-4 text-zinc-300">{reflection.cross}</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">❤️ Heart</h2>
          <p className="mt-4 text-zinc-300">{reflection.heart}</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">📖 Scripture</h2>
          <p className="mt-4 text-zinc-300">"{reflection.verse}"</p>
          <p className="mt-2 text-zinc-500">{reflection.reference}</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">🙏 Prayer</h2>
          <p className="mt-4 text-zinc-300">{reflection.prayer}</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">👣 Next Faithful Step</h2>
          <p className="mt-4 text-zinc-300">{reflection.step}</p>
        </div>
      </div>
    )}
  </section>
</main>

);
}
