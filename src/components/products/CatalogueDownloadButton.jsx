"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiDownload, FiLoader, FiLock, FiMail, FiX } from "react-icons/fi";
import { validateCatalogueDetails } from "@/lib/formValidation";
import { workflowIndustries } from "@/data/homeShowcase";
import { INDIA_STATES } from "@/data/indiaStates";
import { collectTracking } from "@/lib/browserTracking";

const FIELDS = [
  { key: "firstName", label: "Name", autoComplete: "name" },
  { key: "designation", label: "Designation", autoComplete: "organization-title" },
  { key: "department", label: "Department" },
  { key: "companyName", label: "Company Name", autoComplete: "organization" },
  { key: "industry", label: "Industry", type: "select" },
  { key: "country", label: "Country", readOnly: true },
  { key: "state", label: "State / Union Territory", type: "state-select", autoComplete: "address-level1" },
  { key: "city", label: "City", autoComplete: "address-level2" },
  { key: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "name@company.com" },
  { key: "contact", label: "Contact", type: "tel", autoComplete: "tel", placeholder: "9876543210", maxLength: 15 },
];

const INDUSTRY_OPTIONS = workflowIndustries.map((item) => item.industry);

export default function CatalogueDownloadButton({ productName, productSlug }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("details");
  const [form, setForm] = useState({ productName, country: "India" });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const firstInput = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => firstInput.current?.focus(), 50);
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, busy]);

  const update = (event) => {
    const { name, value: rawValue } = event.target;
    const value = rawValue;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setMessage("");
  };

  async function requestOtp(event) {
    event.preventDefault();
    const validationErrors = validateCatalogueDetails(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setMessageType("error");
      setMessage("Please correct the highlighted fields.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/catalogue/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productSlug, ...collectTracking() }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.errors && typeof result.errors === "object") setErrors(result.errors);
        throw new Error(result.message || "Could not send the code.");
      }
      if (result.alreadyVerified && result.downloadUrl) {
        setStep("done");
        setMessageType("success");
        setMessage("Your verified email is trusted for 24 hours. The catalogue download has started.");
        window.location.assign(result.downloadUrl);
        return;
      }
      setRequestId(result.requestId);
      setStep("otp");
      setMessageType("success");
      setMessage(result.message);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Could not send the code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/catalogue/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, otp }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not verify the code.");
      setStep("done");
      setMessageType("success");
      setMessage("Verified for 24 hours. Your catalogue download has started.");
      window.location.assign(result.downloadUrl);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Could not verify the code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function resetAndClose() {
    if (busy) return;
    setOpen(false);
    setStep("details");
    setOtp("");
    setRequestId("");
    setMessage("");
    setMessageType("info");
    setErrors({});
    setForm({ productName, country: "India" });
  }

  return (
    <>
      <button
        className="inline-flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap border border-red bg-red px-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#99000d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:px-6"
        onClick={() => setOpen(true)}
        type="button"
      >
        <FiDownload aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span>Download Catalogue</span>
      </button>

      {open && (
        <div
          aria-labelledby="catalogue-dialog-title"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => event.target === event.currentTarget && resetAndClose()}
          role="dialog"
        >
          <div className="relative max-h-[96vh] w-full max-w-5xl overflow-y-auto border border-line-light bg-white p-4 shadow-2xl sm:p-5">
            <button
              aria-label="Close catalogue form"
              className="absolute right-3 top-3 inline-flex size-10 items-center justify-center text-ink-soft transition hover:bg-parchment-alt hover:text-red"
              disabled={busy}
              onClick={resetAndClose}
              type="button"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pr-10">
              <span className="inline-flex size-11 shrink-0 items-center justify-center bg-red/10 text-red">
                {step === "done" ? <FiCheck className="h-5 w-5" /> : <FiDownload className="h-5 w-5" />}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight text-ink" id="catalogue-dialog-title">
                  {step === "otp" ? "Verify your email" : step === "done" ? "Catalogue ready" : "Download Catalogue"}
                </h2>
                {step === "details" ? (
                  <p className="mt-0.5 truncate text-sm font-semibold text-red" title={productName}>
                    {productName}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm leading-5 text-ink-soft">
                    {step === "otp"
                      ? `We sent a 6-digit code to ${form.email}. It expires in 10 minutes.`
                      : `The product profile for ${productName} is downloading.`}
                  </p>
                )}
              </div>
            </div>

            {step === "details" && (
              <form className="mt-3" noValidate onSubmit={requestOtp}>
                <p className="mb-2 text-xs text-ink-soft">All fields are required.</p>
                <div className="grid gap-x-3 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
                  {FIELDS.map((field, index) => {
                    const invalid = Boolean(errors[field.key]);
                    return (
                      <label className="block text-xs font-semibold uppercase tracking-wide text-ink" key={field.key}>
                        {field.label}{!field.readOnly && <span className="ml-0.5 text-red">*</span>}
                        {field.type === "select" || field.type === "state-select" ? (
                          <select
                            aria-invalid={invalid}
                            className={`mt-1 h-10 w-full border bg-parchment-alt px-3 font-normal normal-case outline-none transition focus:border-red ${invalid ? "border-red bg-red/5" : "border-line-light"}`}
                            name={field.key}
                            onChange={update}
                            value={form[field.key] ?? ""}
                          >
                            <option value="">{field.type === "state-select" ? "Select a state / UT..." : "Select an industry..."}</option>
                            {(field.type === "state-select" ? INDIA_STATES.map((state) => state.name) : INDUSTRY_OPTIONS)
                              .map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                        ) : (
                          <input
                            ref={index === 0 ? firstInput : undefined}
                            aria-invalid={invalid}
                            autoComplete={field.autoComplete}
                            className={`mt-1 h-10 w-full border px-3 font-normal normal-case outline-none transition focus:border-red ${field.readOnly ? "cursor-not-allowed border-line-light bg-line-light/40 text-ink-soft" : invalid ? "border-red bg-red/5" : "border-line-light bg-parchment-alt"}`}
                            inputMode={field.type === "email" ? "email" : field.type === "tel" ? "tel" : undefined}
                            maxLength={field.maxLength ?? 160}
                            name={field.key}
                            onChange={field.readOnly ? undefined : update}
                            placeholder={field.placeholder}
                            readOnly={field.readOnly}
                            type={field.type ?? "text"}
                            value={form[field.key] ?? ""}
                          />
                        )}
                        {invalid && <span className="mt-1 block text-[11px] font-semibold normal-case text-red">{errors[field.key]}</span>}
                      </label>
                    );
                  })}
                </div>
                <div className="mt-3">
                <SubmitButton busy={busy} label="Email me a verification code" />
                </div>
              </form>
            )}

            {step === "otp" && (
              <form className="mt-6" onSubmit={verifyOtp}>
                <label className="block text-sm font-semibold text-ink">
                  Verification code
                  <input
                    ref={firstInput}
                    autoComplete="one-time-code"
                    className="mt-1.5 h-14 w-full border border-line-light px-3 text-center text-xl font-semibold tracking-[0.45em] outline-none transition focus:border-red"
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                    pattern="[0-9]{6}"
                    required
                    value={otp}
                  />
                </label>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button className="h-12 border border-line-light px-5 text-sm font-semibold text-ink transition hover:border-red hover:text-red" disabled={busy} onClick={() => { setStep("details"); setMessage(""); setMessageType("info"); }} type="button">
                    Change email
                  </button>
                  <div className="flex-1"><SubmitButton busy={busy} label="Verify & download" /></div>
                </div>
              </form>
            )}

            {step === "done" && (
              <button className="mt-6 h-12 w-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-red" onClick={resetAndClose} type="button">Done</button>
            )}

            {message && (
              <p aria-live="polite" className={`mt-4 text-sm ${messageType === "success" ? "text-emerald-700" : messageType === "error" ? "text-red" : "text-ink-soft"}`} role="status">
                {message}
              </p>
            )}
            <p className="mt-3 flex items-start gap-2 border-t border-line-light pt-2 text-xs leading-4 text-ink-soft">
              <FiLock aria-hidden="true" className="mt-0.5 shrink-0" />
              Your email is verified only for this secure download. We do not share your details with third parties.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function SubmitButton({ busy, label }) {
  return (
    <button className="inline-flex h-12 w-full items-center justify-center gap-2 bg-red px-5 text-sm font-semibold text-white transition hover:bg-[#99000d] disabled:cursor-not-allowed disabled:opacity-60" disabled={busy} type="submit">
      {busy ? <FiLoader className="animate-spin" /> : <FiMail />}
      {busy ? "Please wait…" : label}
    </button>
  );
}
