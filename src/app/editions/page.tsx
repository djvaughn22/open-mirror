import type { Metadata } from "next";
import EditionsForm from "./EditionsForm";
import { EDITION_PROPERTIES, EDITION_START_PRICE } from "../../lib/editions";

export const metadata: Metadata = {
  title: "Customer editions",
  description: `Ask Open Mirror LLC for your own edition of one of its websites. Proposed starting price ${EDITION_START_PRICE}. Every request is reviewed by the owner first.`,
  alternates: { canonical: "/editions" },
};

const bg = "#0b1220";
const card = "#111a2e";
const border = "#26324c";
const text = "#e8edf5";
const sub = "#94a3b8";
const accent = "#38BDF8";

const STEPS = [
  ["Explore", "Look at the live site you have in mind."],
  ["Request", "Send the short form below. Nothing is charged."],
  ["Owner review", "The owner reads every request and says yes or no by email."],
  ["Approval and payment", "Only after a yes, you get a written quote. You pay only if you agree."],
  ["Your edition", "Your name, colours, words and pictures, set up as your own site."],
] as const;

export default function EditionsPage() {
  return (
    <main style={{ background: bg, minHeight: "100vh", color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "44px 20px 90px" }}>
        <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: accent, margin: "0 0 10px" }}>
          Customer editions
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 7vw, 2.8rem)", fontWeight: 900, lineHeight: 1.08, margin: "0 0 14px" }}>
          Your own version of one of our sites
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: sub, fontWeight: 600, margin: "0 0 22px" }}>
          Some Open Mirror websites could be set up for a business, school, club or family, with your own name and look.
          Ask, and the owner will read your request and reply.
        </p>

        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "18px 20px", margin: "0 0 30px" }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, fontWeight: 600 }}>
            <strong style={{ color: text, fontSize: 22, fontWeight: 900 }}>From {EDITION_START_PRICE}</strong>{" "}
            <span style={{ color: sub }}>proposed starting price for one customised edition.</span>
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.65, color: sub }}>
            Sending a request costs nothing and commits you to nothing. There is no checkout on this page.
            The owner approves or declines every request, and nothing is licensed, charged or built until you both agree in writing.
          </p>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 12px" }}>How it works</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: "0 0 34px", display: "grid", gap: 10 }}>
          {STEPS.map(([title, line], i) => (
            <li key={title} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
              <span aria-hidden style={{ color: accent, fontWeight: 900, minWidth: 20 }}>{i + 1}</span>
              <span style={{ lineHeight: 1.6 }}>
                <strong>{title}.</strong> <span style={{ color: sub }}>{line}</span>
              </span>
            </li>
          ))}
        </ol>

        <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>What you can ask about</h2>
        <p style={{ fontSize: 14, color: sub, lineHeight: 1.65, margin: "0 0 14px" }}>
          These are ideas under consideration. None is ready to license yet; the owner checks each one before saying yes.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "grid", gap: 10 }}>
          {EDITION_PROPERTIES.filter((p) => p.id !== "other").map((p) => (
            <li key={p.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                <strong>{p.name}</strong>
                <span style={{ fontSize: 12, fontWeight: 800, color: p.rightsVerified ? "#86efac" : "#fbbf24" }}>
                  {p.rightsVerified ? "Available on request" : "Under consideration"}
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: sub, lineHeight: 1.55 }}>{p.line}</p>
            </li>
          ))}
        </ul>

        <h2 id="request" style={{ fontSize: 20, fontWeight: 900, margin: "0 0 12px" }}>Send a request</h2>
        <EditionsForm />

        <p style={{ fontSize: 13, color: sub, lineHeight: 1.65, marginTop: 28 }}>
          We use what you send only to reply to this request. We never ask for card, bank or ID numbers here.
          Prefer email? Write to <a href="mailto:ask@openmirrorllc.com?subject=Edition%20request" style={{ color: accent }}>ask@openmirrorllc.com</a>.
        </p>
      </div>
    </main>
  );
}
