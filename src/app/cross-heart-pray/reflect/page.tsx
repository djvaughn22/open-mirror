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
      "Lay your striving, comparison, shame, and fear at the foot of the Cross. You do not have to prove your worth to God. Christ is enough where you are not.",
    heart:
      "Receive God's love in your heart. Your value is not measured by performance, approval, success, or being enough. Let God's grace speak louder than shame.",
    prayer:
      "Father, I praise You for Your grace. Thank You for loving me through Jesus Christ. Help me stop trying to prove I am enough. Let Your will be done in my heart, and give me strength to follow You today. Amen.",
    step:
      "Pause before striving. Thank God for grace. Then do one faithful thing today without trying to earn your worth.",
  },
  {
    keywords: ["forgive", "resent", "bitter", "anger", "angry"],
    title: "Forgiveness and Anger",
    verse:
      "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
    reference: "Ephesians 4:32",
    cross:
      "Lay your hurt, anger, and desire for revenge at the Cross. Jesus does not ignore sin; He carries judgment, mercy, and justice perfectly.",
    heart:
      "Receive God's love in your heart before trying to force forgiveness. Be honest about the wound, the fear, and the cost. God can meet you there.",
    prayer:
      "Father, I praise You for Your mercy. You know the hurt I am carrying. Help me trust Your justice and receive Your love. Let Your will be done, and teach me to forgive as I have been forgiven in Christ. Amen.",
    step:
      "Do not pretend everything is fine. Pray honestly for willingness, wisdom, and the next faithful step toward peace.",
  },
  {
    keywords: [
      "daughter",
      "son",
      "child",
      "marriage",
      "wife",
      "husband",
      "relationship",
    ],
    title: "Relationship and Reconciliation",
    verse:
      "If possible, so far as it depends on you, live peaceably with all.",
    reference: "Romans 12:18",
    cross:
      "Lay this relationship at the Cross. You cannot force reconciliation, control another person's heart, or carry the whole outcome yourself.",
    heart:
      "Receive God's love in your heart. Let Him reveal fear, grief, pride, control, loneliness, or the longing to be understood.",
    prayer:
      "Father, I praise You because You are faithful. I give this relationship to You. Help me love with humility, patience, truth, and courage. Let Your will be done, and help me follow where You lead. Amen.",
    step:
      "Pray for the person by name. Then take one peaceful step without demanding control of the result.",
  },
  {
    keywords: ["afraid", "fear", "anxious", "anxiety", "worry", "worried"],
    title: "Fear and Trust",
    verse: "Casting all your anxieties on him, because he cares for you.",
    reference: "1 Peter 5:7",
    cross:
      "Lay your fear at the Cross. You were not made to carry tomorrow by yourself. Give God what you cannot control.",
    heart:
      "Receive God's love in your heart. He does not shame you for being afraid. He invites you to trust His care in the middle of fear.",
    prayer:
      "Father, I praise You because You care for me. I confess that I am afraid and trying to carry what belongs to You. Let Your will be done. Give me courage, peace, and strength to follow You today. Amen.",
    step:
      "Name the fear clearly. Pray it honestly. Then take only the next faithful step in front of you.",
  },
];

const fallback = {
  title: "Burden and Rest",
  verse:
    "Come to me, all who labor and are heavy laden, and I will give you rest.",
  reference: "Matthew 11:28",
  cross:
    "Lay this burden at the foot of the Cross. Before trying to fix everything yourself, surrender it to God and trust Him with what you cannot control.",
  heart:
    "Receive God's love in your heart. God already sees your fear, anger, grief, shame, confusion, and hope. You do not have to pretend to be stronger than you are.",
  prayer:
    "Father, I praise You because You are good. Thank You for loving me through Jesus Christ. I give this burden to You. Let Your will be done, and give me strength to follow wherever You lead. Amen.",
  step:
    "Pause. Pray honestly. Name what you are feeling. Choose one small faithful action instead of trying to solve everything at once.",
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
          <Link href="/cross-heart-pray">CrossHeartPray</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 text-6xl">✝️❤️🙏</div>

        <h1 className="text-5xl font-bold tracking-tight">
          Begin Reflection
        </h1>

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

        <div className="mt-12 w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-left shadow-2xl">
          <label className="text-sm font-semibold text-zinc-300">
            What is weighing on your heart today?
          </label>

          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="mt-4 min-h-36 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none"
            placeholder="I don't feel enough, I'm afraid, I'm angry, I can't forgive..."
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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
                {reflection.title}
              </p>
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
              <p className="mt-4 text-zinc-300">&quot;{reflection.verse}&quot;</p>
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
          CrossHeartPray provides biblical reflection and prayer guidance. It is
          not pastoral counseling, medical advice, legal advice, or a substitute
          for your local church, trusted relationships, or professional care
          when needed.
        </div>
      </section>
    </main>
  );
}