"use client";

// "Check My Computer" — the pilot-interest and compatibility form.
//
// There is deliberately no backend here. The hub's only safe contact pattern
// is the plain mailto (Contact page, owner rule 2026-07-19), so submitting
// composes an email to ask@openmirrorllc.com with the answers filled in.
// Nothing is stored, uploaded, or sent by this site itself, and the form
// never asks for device passwords or any sensitive personal data.

import { useState } from "react";
import { SERVICE_EMAIL } from "../../../lib/services";

const DEVICE_TYPES = [
  "Laptop",
  "Mini PC",
  "Small-form-factor desktop",
  "Desktop tower",
  "All-in-one desktop",
  "Not sure",
] as const;

const YNU = ["Yes", "No", "Not sure"];

type Values = Record<string, string>;

const REQUIRED_ALWAYS: { key: string; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "deviceType", label: "Device type" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "turnsOn", label: "Whether it turns on" },
  { key: "biosPassword", label: "BIOS or firmware password" },
  { key: "orgControlled", label: "Organizational control" },
  { key: "backedUp", label: "Backup status" },
  { key: "preference", label: "Service preference" },
];

function fieldClasses(invalid: boolean) {
  return `w-full rounded-xl border bg-[#0f1826] px-3.5 py-2.5 text-sm font-semibold text-[#e8edf5] outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/40 ${
    invalid ? "border-[#f87171]" : "border-[#26324c]"
  }`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs font-bold text-[#f87171]">
      {message}
    </p>
  );
}

function LabelText({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-bold text-[#94a3b8]">{children}</span>
  );
}

export default function CheckMyComputerForm() {
  const [v, setV] = useState<Values>({});
  const [checks, setChecks] = useState<{ owned: boolean; erase: boolean }>({
    owned: false,
    erase: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mailBody, setMailBody] = useState<string | null>(null);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((prev) => ({ ...prev, [key]: e.target.value }));

  const isLaptop = v.deviceType === "Laptop";
  const isDesktop =
    v.deviceType === "Mini PC" ||
    v.deviceType === "Small-form-factor desktop" ||
    v.deviceType === "Desktop tower" ||
    v.deviceType === "All-in-one desktop";

  function text(key: string, label: string, opts?: { required?: boolean; type?: string; hint?: string }) {
    const err = errors[key];
    const errId = `err-${key}`;
    return (
      <label className="block">
        <LabelText>
          {label}
          {opts?.required ? " *" : ""}
        </LabelText>
        <input
          type={opts?.type ?? "text"}
          name={key}
          value={v[key] ?? ""}
          onChange={set(key)}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? errId : undefined}
          className={fieldClasses(Boolean(err))}
        />
        {opts?.hint && (
          <span className="mt-1 block text-xs font-semibold text-[#64748b]">{opts.hint}</span>
        )}
        <FieldError id={errId} message={err} />
      </label>
    );
  }

  function select(key: string, label: string, options: readonly string[], opts?: { required?: boolean }) {
    const err = errors[key];
    const errId = `err-${key}`;
    return (
      <label className="block">
        <LabelText>
          {label}
          {opts?.required ? " *" : ""}
        </LabelText>
        <select
          name={key}
          value={v[key] ?? ""}
          onChange={set(key)}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? errId : undefined}
          className={fieldClasses(Boolean(err))}
        >
          <option value="">Choose…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <FieldError id={errId} message={err} />
      </label>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    for (const f of REQUIRED_ALWAYS) {
      if (!(v[f.key] ?? "").trim()) next[f.key] = `${f.label} is required.`;
    }
    if ((v.email ?? "").trim() && !/^\S+@\S+\.\S+$/.test(v.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!checks.owned) {
      next.owned = "Please confirm ownership or legal authority before we can review the computer.";
    }
    if (!checks.erase) {
      next.erase = "Please confirm you understand the internal drive will be erased.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setMailBody(null);
      return;
    }

    const line = (label: string, key: string) => `${label}: ${(v[key] ?? "").trim() || "—"}`;
    const lines = [
      "Build Machine pilot — compatibility check",
      "",
      line("Name", "name"),
      line("Email", "email"),
      line("Device type", "deviceType"),
      line("Manufacturer", "manufacturer"),
      line("Model", "model"),
      line("Approximate age", "age"),
      line("Processor", "processor"),
      line("Memory (RAM)", "ram"),
      line("Storage size", "storageSize"),
      line("SSD or hard drive", "storageType"),
      line("Turns on", "turnsOn"),
      line("Reaches its current operating system", "reachesOS"),
      line("USB ports work", "usb"),
      line("Wi-Fi works or adapter available", "wifi"),
      ...(isDesktop
        ? [
            line("Ethernet works", "ethernet"),
            line("Video output works", "videoOutput"),
            line("Compatible power cable available", "powerCable"),
            line("Uses a separate monitor", "separateMonitor"),
            line("Keeping own monitor, keyboard, and mouse", "keepPeripherals"),
          ]
        : []),
      ...(isLaptop
        ? [
            line("Screen works", "screen"),
            line("Keyboard and trackpad work", "keyboard"),
            line("Charging port works", "chargingPort"),
            line("Battery condition", "battery"),
          ]
        : []),
      line("BIOS or firmware password", "biosPassword"),
      "Personally owned / legal authority confirmed: Yes",
      line("Controlled by a school, employer, government, leasing company, or other organization", "orgControlled"),
      line("All needed files already backed up", "backedUp"),
      "Understands the internal drive will be erased: Yes",
      line("Service preference", "preference"),
      line("Notes", "notes"),
    ];
    const body = lines.join("\n");
    setMailBody(body);
    window.location.href = `mailto:${SERVICE_EMAIL}?subject=${encodeURIComponent(
      "Build Machine pilot — check my computer"
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <p className="text-sm font-semibold leading-6 text-[#94a3b8]">
        Answer what you know — “Not sure” is a fine answer. Submitting opens
        your own email app with the answers filled in; nothing is stored on
        this site. Never include passwords of any kind.
      </p>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="rounded-xl border border-[#f87171]/50 bg-[#2a1215] px-4 py-3 text-sm font-bold text-[#fca5a5]">
          Please fix the highlighted fields below.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {text("name", "Name", { required: true })}
        {text("email", "Email", { required: true, type: "email" })}
      </div>

      {select("deviceType", "Device type", DEVICE_TYPES, { required: true })}

      <div className="grid gap-4 sm:grid-cols-2">
        {text("manufacturer", "Manufacturer", { required: true, hint: "For example: Dell, HP, Lenovo, ASUS." })}
        {text("model", "Exact model, if known")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {text("age", "Approximate age", { hint: "A guess is fine — “about 8 years old.”" })}
        {text("processor", "Processor, if known")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {text("ram", "Memory (RAM), if known")}
        {text("storageSize", "Storage size, if known")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {select("storageType", "Is the storage an SSD or a hard drive?", ["SSD", "Hard drive", "Not sure"])}
        {select("turnsOn", "Does it currently turn on?", YNU, { required: true })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {select("reachesOS", "Does it reach its current operating system?", YNU)}
        {select("usb", "Do the USB ports work?", YNU)}
      </div>

      {select("wifi", "Does Wi-Fi work?", ["Yes", "No", "No, but I have a USB Wi-Fi adapter", "Not sure"])}

      {isLaptop && (
        <fieldset className="grid gap-4 rounded-2xl border border-[#26324c] p-4 sm:grid-cols-2">
          <legend className="px-1 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
            Laptop details
          </legend>
          {select("screen", "Does the screen work?", YNU)}
          {select("keyboard", "Do the keyboard and trackpad work?", YNU)}
          {select("chargingPort", "Does the charging port work?", YNU)}
          {select("battery", "Battery condition", [
            "No known problems",
            "Unreliable or won't hold a charge",
            "Swollen or damaged",
            "Not sure",
          ])}
        </fieldset>
      )}

      {isDesktop && (
        <fieldset className="grid gap-4 rounded-2xl border border-[#26324c] p-4 sm:grid-cols-2">
          <legend className="px-1 text-xs font-black uppercase tracking-[0.2em] text-[#94a3b8]">
            Desktop details
          </legend>
          {select("videoOutput", "Does video output work?", YNU)}
          {select("ethernet", "Does Ethernet work?", YNU)}
          {select("powerCable", "Do you have its power cable?", YNU)}
          {select("separateMonitor", "Does it use a separate monitor?", YNU)}
          {select("keepPeripherals", "Will you keep your monitor, keyboard, and mouse?", [
            "Yes — I'll keep them",
            "Not sure",
          ])}
        </fieldset>
      )}

      {select("biosPassword", "Is there a BIOS or firmware password?", ["No", "Yes", "Not sure"], { required: true })}

      {select(
        "orgControlled",
        "Is it controlled by a school, employer, government agency, leasing company, or another organization?",
        ["No", "Yes", "Not sure"],
        { required: true }
      )}

      {select("backedUp", "Are all the files you need already backed up?", [
        "Yes — backed up",
        "Not yet",
        "Nothing on it that I need",
      ], { required: true })}

      {select("preference", "Which service are you interested in?", [
        "Local drop-off and pickup",
        "Future mail-in service",
        "Either",
      ], { required: true })}

      <label className="block">
        <LabelText>Anything else we should know? (optional)</LabelText>
        <textarea
          name="notes"
          rows={3}
          value={v.notes ?? ""}
          onChange={set("notes")}
          className={fieldClasses(false)}
        />
      </label>

      <label className="flex items-start gap-3 text-sm font-semibold leading-6">
        <input
          type="checkbox"
          checked={checks.owned}
          onChange={(e) => setChecks((c) => ({ ...c, owned: e.target.checked }))}
          aria-invalid={errors.owned ? true : undefined}
          aria-describedby={errors.owned ? "err-owned" : undefined}
          className="mt-1 h-5 w-5 accent-[#38BDF8]"
        />
        <span>
          I own this computer, or I have the legal authority to approve this
          work. *
        </span>
      </label>
      <FieldError id="err-owned" message={errors.owned} />

      <label className="flex items-start gap-3 text-sm font-semibold leading-6">
        <input
          type="checkbox"
          checked={checks.erase}
          onChange={(e) => setChecks((c) => ({ ...c, erase: e.target.checked }))}
          aria-invalid={errors.erase ? true : undefined}
          aria-describedby={errors.erase ? "err-erase" : undefined}
          className="mt-1 h-5 w-5 accent-[#38BDF8]"
        />
        <span>
          I understand the internal drive will be erased, and backup, recovery,
          and file transfer are not included. *
        </span>
      </label>
      <FieldError id="err-erase" message={errors.erase} />

      <button
        type="submit"
        className="mt-2 inline-block rounded-full bg-[#38BDF8] px-8 py-3.5 text-sm font-black text-[#0C0C0C]"
      >
        Check My Computer
      </button>

      {mailBody && (
        <div className="rounded-2xl border border-[#34D399]/40 bg-[#0e1f19] p-4">
          <p className="text-sm font-bold leading-6 text-[#a7f3d0]">
            Your email app should have opened with these answers. If it did
            not, copy the text below and email it to{" "}
            <a href={`mailto:${SERVICE_EMAIL}`} className="underline">
              {SERVICE_EMAIL}
            </a>
            .
          </p>
          <textarea
            readOnly
            aria-label="Your answers, ready to copy"
            rows={8}
            value={mailBody}
            className="mt-3 w-full rounded-xl border border-[#26324c] bg-[#0f1826] px-3 py-2 text-xs font-medium text-[#94a3b8]"
          />
        </div>
      )}
    </form>
  );
}
