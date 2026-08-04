"use client";

// Build Machine interest form — mailto-composing only. This is deliberately
// the safest working contact mechanism on the site: it opens the visitor's
// own mail app with a structured message to the service inbox. No backend,
// no storage, no configuration required, nothing collected on this website.
//
// Never add fields for serial numbers, passwords, payment details, or
// confidential company information (test-locked in tests/buildMachine.test.ts).

import { useMemo, useState } from "react";
import {
  buildInterestEmailBody,
  buildInterestMailto,
  INTEREST_COMPUTER_TYPES,
  INTEREST_TYPES,
  type InterestType,
} from "../../../lib/buildMachineInterest";

const INPUT_CLASS =
  "w-full rounded-xl border border-[#26324c] bg-[#0b1220] px-4 py-3 text-sm font-semibold text-[#e8edf5] placeholder:text-[#475569] focus:border-[#38BDF8] focus:outline-none";

const LABEL_CLASS = "mb-1.5 block text-xs font-black text-[#94a3b8]";

export default function BuildMachineInterestForm({
  serviceEmail,
}: {
  serviceEmail: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interestType, setInterestType] = useState<InterestType>(
    INTEREST_TYPES[0]
  );
  const [approximateQuantity, setApproximateQuantity] = useState("");
  const [computerType, setComputerType] = useState("");
  const [manufacturerModel, setManufacturerModel] = useState("");
  const [cityState, setCityState] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [composed, setComposed] = useState(false);

  const data = useMemo(
    () => ({
      name,
      email,
      interestType,
      approximateQuantity,
      computerType,
      manufacturerModel,
      cityState,
      message,
    }),
    [
      name,
      email,
      interestType,
      approximateQuantity,
      computerType,
      manufacturerModel,
      cityState,
      message,
    ]
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please add your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please add a valid email address so Open Mirror can reply.");
      return;
    }
    setError(null);
    setComposed(true);
    window.location.href = buildInterestMailto(serviceEmail, data);
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-4">
        <label htmlFor="interest-type" className={LABEL_CLASS}>
          What describes you best?
        </label>
        <select
          id="interest-type"
          value={interestType}
          onChange={(e) => setInterestType(e.target.value as InterestType)}
          className={INPUT_CLASS}
        >
          {INTEREST_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="interest-name" className={LABEL_CLASS}>
            Name
          </label>
          <input
            id="interest-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT_CLASS}
            maxLength={120}
          />
        </div>
        <div>
          <label htmlFor="interest-email" className={LABEL_CLASS}>
            Email
          </label>
          <input
            id="interest-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS}
            maxLength={254}
          />
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="interest-quantity" className={LABEL_CLASS}>
            Approximate quantity <span className="font-semibold">(optional)</span>
          </label>
          <input
            id="interest-quantity"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 1, 12, 40"
            value={approximateQuantity}
            onChange={(e) => setApproximateQuantity(e.target.value)}
            className={INPUT_CLASS}
            maxLength={40}
          />
        </div>
        <div>
          <label htmlFor="interest-computer-type" className={LABEL_CLASS}>
            Computer type <span className="font-semibold">(optional)</span>
          </label>
          <select
            id="interest-computer-type"
            value={computerType}
            onChange={(e) => setComputerType(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">Choose one…</option>
            {INTEREST_COMPUTER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="interest-model" className={LABEL_CLASS}>
            Manufacturer / model if known{" "}
            <span className="font-semibold">(optional)</span>
          </label>
          <input
            id="interest-model"
            type="text"
            placeholder="e.g. Dell OptiPlex 7050"
            value={manufacturerModel}
            onChange={(e) => setManufacturerModel(e.target.value)}
            className={INPUT_CLASS}
            maxLength={120}
          />
        </div>
        <div>
          <label htmlFor="interest-city" className={LABEL_CLASS}>
            City / state <span className="font-semibold">(optional)</span>
          </label>
          <input
            id="interest-city"
            type="text"
            placeholder="e.g. St. Louis, MO"
            value={cityState}
            onChange={(e) => setCityState(e.target.value)}
            className={INPUT_CLASS}
            maxLength={120}
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="interest-message" className={LABEL_CLASS}>
          Message <span className="font-semibold">(optional)</span>
        </label>
        <textarea
          id="interest-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={INPUT_CLASS}
          maxLength={1000}
        />
        <p className="mt-1.5 text-xs font-semibold leading-5 text-[#64748b]">
          Please don&apos;t include serial numbers, passwords, or confidential
          company information.
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-3 text-sm font-bold text-[#fca5a5]">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-[#34D399] px-6 py-3.5 text-sm font-black text-[#0C0C0C] sm:w-auto sm:px-10"
      >
        Compose the email
      </button>
      <p className="mt-2 text-xs font-semibold leading-5 text-[#64748b]">
        This opens your own email app with the message ready to send to{" "}
        {serviceEmail}. Nothing is submitted or stored on this website.
      </p>

      {composed && (
        <details className="mt-4 rounded-2xl border border-[#26324c] bg-[#0b1220] p-4">
          <summary className="cursor-pointer text-xs font-black text-[#94a3b8]">
            Mail app didn&apos;t open? Copy the message instead
          </summary>
          <p className="mt-2 text-xs font-semibold leading-5 text-[#64748b]">
            Send it to {serviceEmail}:
          </p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#141d2e] p-3 text-xs font-semibold leading-5 text-[#cbd5e1]">
            {buildInterestEmailBody(data)}
          </pre>
        </details>
      )}
    </form>
  );
}
