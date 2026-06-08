"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
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
        <a href="/" className="justify-self-start font-bold">Open Mirror</a>

        <a href="https://www.bible.com/app" target="_blank" rel="noopener noreferrer" aria-label="Open YouVersion Bible App" className="justify-self-center">
          <img src="/brand/youversion-bible-app.png" alt="YouVersion Bible App" className="h-9 w-9 rounded-lg" />
        </a>

        <span className="justify-self-end text-sm text-zinc-500">Look Closer</span>
      </nav>

      <section className="mx-auto flex min-h-[82vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">Truth · Reflection · Freedom</p>

        <h1 className="text-5xl font-bold leading-tight md:text-8xl">Look in the mirror.</h1>

        <h2 className="mt-6 text-3xl font-semibold text-zinc-300 md:text-5xl">What do you see?</h2>

        <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-400">The truth will set you free.</p>

        <form onSubmit={handleSubmit} className="mt-10 flex w-full max-w-xl flex-col gap-4 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="min-h-12 flex-1 rounded-full border border-zinc-800 bg-zinc-950 px-6 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
          />

          <button type="submit" disabled={status === "saving"} className="rounded-full bg-white px-8 py-3 font-semibold text-black disabled:opacity-60">
            {status === "saving" ? "Saving..." : "Look Closer"}
          </button>
        </form>

        {status === "saved" && <p className="mt-6 max-w-lg text-sm leading-6 text-zinc-300">You&apos;re on the list. The mirror is waiting.</p>}

        {status === "error" && <p className="mt-6 max-w-lg text-sm leading-6 text-red-300">Something went wrong. Please try again.</p>}

        <p className="mt-6 max-w-lg text-sm leading-6 text-zinc-500">Enter your email to look closely.</p>

        <a href="https://www.bible.com/app" target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-3 rounded-full border border-zinc-800 px-5 py-3 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white">
          <img src="/brand/youversion-bible-app.png" alt="" className="h-7 w-7 rounded-md" />
          Open the Bible
        </a>
      </section>

      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-sm text-zinc-500">
        © Open Mirror LLC. The mirror doesn&apos;t judge. The mirror reveals.
      </footer>
    </main>
  );
}
