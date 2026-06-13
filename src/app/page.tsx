"use client";

import { useState } from "react";

export default function EmailGatePage() {
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

    window.location.href = "/home";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div
          aria-label="Cross Heart Pray"
          className="mb-12 flex items-center justify-center gap-10 text-7xl md:gap-16 md:text-8xl"
        >
          <span>✝️</span>
          <span>❤️</span>
          <span>🙏</span>
        </div>

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Email Gate
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            temporary testing access
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xl flex-col gap-4 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="min-h-12 flex-1 rounded-full border border-zinc-800 bg-zinc-950 px-6 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
          />

          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-full bg-white px-8 py-3 font-semibold text-black disabled:opacity-60"
          >
            {status === "saving" ? "Opening..." : "Enter Test Site"}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-6 max-w-lg text-sm leading-6 text-red-300">
            Something went wrong. Please try again.
          </p>
        )}
      </section>
    </main>
  );
}
