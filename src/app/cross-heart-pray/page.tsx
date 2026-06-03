"use client";

import Link from "next/link";
import { useState } from "react";

const reflections = [
  {
    keywords: ["enough", "worth", "failure", "ashamed", "shame"],
    title: "Identity and Worth",
    mirror:
      "You may be carrying a question about whether you are enough. That is a heavy question to carry alone.",
    cross:
      "Bring the striving, comparison, shame, and fear to the Cross. Christ is enough where you are not.",
    heart:
      "Receive God’s love. Your worth is not measured by performance, approval, success, or failure.",
    verse:
      "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.",
    reference: "Ephesians 2:8",
    prayer:
      "Father, thank You for Your grace. Help me stop trying to prove my worth and rest in Christ. Amen.",
    step:
      "Do one faithful thing today without trying to earn your value.",
  },
  {
    keywords: ["afraid", "fear", "anxious", "anxiety", "worry", "worried"],
    title: "Fear and Trust",
    mirror:
      "You may be carrying fear about something you cannot fully control.",
    cross:
      "Bring that fear to the Cross. You were not made to carry tomorrow by yourself.",
    heart:
      "Receive God’s care. He does not shame you for being afraid. He invites you to trust Him in the middle of fear.",
    verse: "Casting all your anxieties on him, because he cares for you.",
    reference: "1 Peter 5:7",
    prayer:
      "Father, I give this fear to You. Give me peace, courage, and wisdom for the next step. Amen.",
    step:
      "Name the fear clearly, pray it honestly, and take one small faithful step.",
  },
  {
    keywords: ["forgive", "resent", "bitter", "anger", "angry"],
    title: "Anger and Forgiveness",
    mirror:
      "You may be carrying hurt, anger, or resentment that has not had a safe place to be named.",
    cross:
      "Bring the wound to the Cross. Jesus does not ignore sin, pain, justice, or mercy.",
    heart:
      "Receive God’s love before trying to force forgiveness. Healing often begins with honesty.",
    verse:
      "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
    reference: "Ephesians 4:32",
    prayer:
      "Father, You know the hurt I am carrying. Help me receive Your mercy and walk toward peace. Amen.",
    step:
      "Pray for willingness, wisdom, and one peaceful next step.",
  },
];

const fallback = {
  title: "Burden and Rest",
  mirror:
    "Something is weighing on your heart. Naming it honestly is already a meaningful first step.",
  cross:
    "Bring this burden to the Cross. Surrender what you cannot carry and what you cannot control.",
  heart:
    "Receive God’s love. You do not have to pretend to be stronger than you are.",
  verse:
    "Come to me, all who labor and are heavy laden, and I will give you rest.",
  reference: "Matthew 11:28",
  prayer:
    "Father, I bring this burden to You. Help me receive Your love, seek truth, and take the next faithful step. Amen.",
  step:
    "Pause. Breathe. Pray honestly. Choose one faithful step in front of you.",
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

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between py-4">
        <Link href="/" className="font-semibold">
          Open Mirror
        </Link>

        <div className="flex gap-6 text-sm text-zinc-400">
          <Link href="/">Home</Link>
          <Link href="/cross-heart-pray">Cross Heart Pray</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 text-6xl">🪞</div>

        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
          Look In The Mirror
        </p>

        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          The Truth Will Set You Free.
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-9 text-zinc-300">
          Pause.
          <br />
          Take a breath.
          <br />
          Reflect honestly.
        </p>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Life moves fast. Most of us spend our days solving problems, carrying
          responsibilities, helping others, and trying to keep up. This is a
          place to slow down and name what is really going on.
        </p>

        <div className="mt-12 w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left">
          <label className="text-sm font-semibold text-zinc-300">
            What is weighing on your heart today?
          </label>

          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="mt-4 min-h-40 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none"
            placeholder="Write honestly. A few words is enough to begin."
          />

          <button
            onClick={beginReflection}
            className="mt-5 rounded-full bg-white px-8 py-3 font-semibold text-black"
          >
            Begin Reflection
          </button>
        </div>

        {showReflection && (
          <div className="mt-10 w-full space-y-6 text-left">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-400">
                Reflection
              </p>
              <h2 className="mt-3 text-2xl font-bold">{reflection.title}</h2>
              <p className="mt-4 text-zinc-300">{reflection.mirror}</p>
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
              <p className="mt-4 text-zinc-300">“{reflection.verse}”</p>
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

        <div className="mt-12 max-w-3xl text-center text-sm text-zinc-500">
          Cross Heart Pray offers biblical reflection and prayer guidance. It is
          not medical, legal, or crisis care. When needed, seek help from trusted
          people, your local church, or professional support.
        </div>
      </section>
    </main>
  );
}