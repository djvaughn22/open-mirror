"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    window.location.href = "/welcome";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="mx-auto grid max-w-6xl grid-cols-3 items-center px-6 py-6">
        <span aria-hidden="true" />

        <a
          href="https://www.bible.com/app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open YouVersion Bible App"
          className="justify-self-center"
        >
          <img
            src="/brand/youversion-bible-app.png"
            alt="YouVersion Bible App"
            className="h-9 w-9 rounded-lg"
          />
        </a>

        <span aria-hidden="true" />
      </nav>

      <section className="mx-auto flex min-h-[82vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-8 text-5xl tracking-[0.35em] md:text-6xl">
          ✝️ ❤️ 🙏
        </p>

        <h1 className="text-6xl font-bold leading-tight md:text-8xl">
          Open the Bible.
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">
          The truth will set you free.
        </h2>

        <a
          href="https://www.bible.com/search/bible?q=John%208%3A31-32"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm text-zinc-500 underline decoration-zinc-700 underline-offset-4 hover:text-white"
        >
          John 8:31–32
        </a>

        <form
          onSubmit={handleSubmit}
          className="mt-12 flex w-full max-w-xl flex-col gap-4 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email to begin"
            className="min-h-12 flex-1 rounded-full border border-zinc-800 bg-zinc-950 px-6 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
          />

          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-full bg-white px-8 py-3 font-semibold text-black disabled:opacity-60"
          >
            {status === "saving" ? "Opening..." : "Enter"}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-6 max-w-lg text-sm leading-6 text-red-300">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="mt-8 max-w-xl text-sm leading-7 text-zinc-500">
          Open Mirror helps connect honest reflections with potentially relevant
          Scripture. AI can be wrong. Scripture is the authority.
        </p>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. Open God&apos;s Word. Pray. Follow Jesus.
      </footer>
    </main>
  );
}
