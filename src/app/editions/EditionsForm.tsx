"use client";

import { useEffect, useState } from "react";
import { EDITION_PROPERTIES, LIMITS } from "../../lib/editions";

type Fields = Partial<Record<"property" | "name" | "email" | "business" | "message", string>>;
type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; ref: string }
  | { kind: "error"; message: string; fields: Fields };

const border = "#26324c";
const sub = "#94a3b8";
const text = "#e8edf5";
const warn = "#fbbf24";

const input: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", background: "#0f1729", color: text, border: `1px solid ${border}`,
  borderRadius: 10, padding: "11px 12px", fontSize: 16, fontFamily: "inherit",
};
const label: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 800, margin: "0 0 6px" };

export default function EditionsForm() {
  const [stamp, setStamp] = useState<number | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [online, setOnline] = useState(true);

  useEffect(() => {
    fetch("/api/editions", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { stamp?: number; online?: boolean }) => {
        setStamp(typeof j.stamp === "number" ? j.stamp : Date.now());
        setOnline(j.online !== false);
      })
      .catch(() => setStamp(Date.now()));
  }, []);

  // Online delivery not set up on this deployment: say so and offer email,
  // rather than letting someone fill in a form that cannot arrive.
  if (!online) {
    return (
      <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: "18px 20px" }}>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Requests are taken by email for now. Say which site you have in mind and what you would like it to do.
        </p>
        <p style={{ margin: "14px 0 0" }}>
          <a
            href="mailto:ask@openmirrorllc.com?subject=Edition%20request"
            style={{ display: "inline-block", background: "var(--om-accent, #38BDF8)", color: "var(--om-ink, #0b1220)", borderRadius: 999, padding: "13px 26px", fontSize: 15, fontWeight: 900, textDecoration: "none" }}
          >
            Email a request
          </a>
        </p>
      </div>
    );
  }

  if (state.kind === "sent") {
    return (
      <div role="status" style={{ border: "1px solid #86efac", borderRadius: 14, padding: "18px 20px" }}>
        <p style={{ margin: 0, fontWeight: 900, fontSize: 18 }}>We have your request.</p>
        <p style={{ margin: "8px 0 0", color: sub, lineHeight: 1.65 }}>
          Reference <strong style={{ color: text }}>{state.ref}</strong>. The owner will read it and reply by email.
          Nothing has been approved or charged.
        </p>
      </div>
    );
  }

  const fields: Fields = state.kind === "error" ? state.fields : {};
  const err = (k: keyof Fields) =>
    fields[k] ? <p id={`ed-${k}-err`} style={{ color: warn, fontSize: 13, margin: "6px 0 0" }}>{fields[k]}</p> : null;
  const aria = (k: keyof Fields) => (fields[k] ? { "aria-invalid": true, "aria-describedby": `ed-${k}-err` } : {});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/editions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, stamp }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; error?: string; fields?: Fields };
      if (res.ok && j.ok && j.ref) setState({ kind: "sent", ref: j.ref });
      else setState({ kind: "error", message: j.error ?? "That did not send. Email ask@openmirrorllc.com instead.", fields: j.fields ?? {} });
    } catch {
      setState({ kind: "error", message: "That did not send. Check your connection, or email ask@openmirrorllc.com instead.", fields: {} });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: 16 }}>
      <div>
        <label htmlFor="ed-property" style={label}>Which site?</label>
        <select id="ed-property" name="property" required defaultValue="" style={input} {...aria("property")}>
          <option value="" disabled>Choose one</option>
          {EDITION_PROPERTIES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {err("property")}
      </div>
      <div>
        <label htmlFor="ed-name" style={label}>Your name</label>
        <input id="ed-name" name="name" autoComplete="name" required maxLength={LIMITS.name} style={input} {...aria("name")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="ed-email" style={label}>Email for our reply</label>
        <input id="ed-email" name="email" type="email" autoComplete="email" required maxLength={LIMITS.email} style={input} {...aria("email")} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="ed-business" style={label}>Business, school or group <span style={{ color: sub, fontWeight: 600 }}>(optional)</span></label>
        <input id="ed-business" name="business" autoComplete="organization" maxLength={LIMITS.business} style={input} {...aria("business")} />
        {err("business")}
      </div>
      <div>
        <label htmlFor="ed-message" style={label}>What would you like it to do?</label>
        <textarea id="ed-message" name="message" required rows={5} maxLength={LIMITS.message} style={{ ...input, resize: "vertical" }} {...aria("message")} />
        {err("message")}
      </div>
      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="ed-website">Leave this empty</label>
        <input id="ed-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.kind === "error" && (
        <p role="alert" style={{ color: warn, margin: 0, fontWeight: 700, lineHeight: 1.6 }}>{state.message}</p>
      )}
      <div>
        <button
          type="submit"
          disabled={state.kind === "sending" || stamp === null}
          style={{ background: "var(--om-accent, #38BDF8)", color: "var(--om-ink, #0b1220)", border: 0, borderRadius: 999, padding: "13px 26px", fontSize: 15, fontWeight: 900, cursor: "pointer", minHeight: 44 }}
        >
          {state.kind === "sending" ? "Sending…" : "Send request"}
        </button>
        <p style={{ fontSize: 13, color: sub, margin: "10px 0 0" }}>Sending a request is not a purchase.</p>
      </div>
    </form>
  );
}
