"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi"; // FiFileText re-enable with the View Quote button below
import QuoteDocument from "./QuoteDocument";
import useQuoteBasket from "./useQuoteBasket";
import { clearBasket, itemKey, pushBasketEvent, removeFromBasket } from "@/lib/quoteBasket";
import { collectTracking } from "@/lib/browserTracking";
import { validateQuoteRequest } from "@/lib/formValidation";
import { workflowIndustries } from "@/data/homeShowcase";

// Same buyer details as a single-product enquiry, minus the product name (the
// list supplies it) and minus GSTIN, which would shut out institutes that have none.
const FIELDS = [
  { key: "firstName", label: "First Name", type: "text", autoComplete: "given-name" },
  { key: "lastName", label: "Last Name", type: "text", autoComplete: "family-name" },
  { key: "designation", label: "Designation", type: "text", autoComplete: "organization-title" },
  { key: "department", label: "Department", type: "text" },
  { key: "companyName", label: "Company / Institute Name", type: "text", autoComplete: "organization" },
  { key: "industry", label: "Industry", type: "select" },
  { key: "state", label: "State", type: "text", autoComplete: "address-level1" },
  { key: "city", label: "City", type: "text", autoComplete: "address-level2" },
  { key: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "name@company.com" },
  { key: "contact", label: "Contact", type: "tel", autoComplete: "tel", placeholder: "9876543210", maxLength: 15 },
];

const INDUSTRY_OPTIONS = workflowIndustries.map((item) => item.industry);

const INPUT_BASE =
  "w-full border bg-parchment-alt px-3 py-2.5 text-sm text-black transition focus:outline-none focus:ring-2";
const INPUT_OK = "border-line-light focus:border-rose-400 focus:ring-rose-200";
const INPUT_BAD = "border-red bg-red/5 focus:border-red focus:ring-red/20";

export default function QuoteRequest() {
  const basket = useQuoteBasket();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  // The basket empties on success, so the document renders from a snapshot of
  // exactly what was submitted.
  const [sent, setSent] = useState({ buyer: null, items: [], reference: null });
  const [showDocument, setShowDocument] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef(null);

  const liveErrors = useMemo(() => validateQuoteRequest(form), [form]);

  const set = (key, value) => {
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const showError = (key) => (touched[key] || errors[key]) && liveErrors[key];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.keys(liveErrors).length) {
      setErrors(liveErrors);
      setTouched(Object.fromEntries(FIELDS.map((field) => [field.key, true])));
      setError("Please correct the highlighted fields before submitting.");
      errorRef.current?.focus();
      return;
    }

    setLoading(true);
    pushBasketEvent("begin_checkout", basket);

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "quote-basket",
          ...form,
          items: basket.map((item) => ({
            slug: item.slug,
            name: item.name,
            principalSlug: item.principalSlug,
            principalName: item.principalName,
            addedAt: item.addedAt,
          })),
          ...collectTracking(),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        if (result?.errors && typeof result.errors === "object") {
          setErrors(result.errors);
          setTouched(Object.fromEntries(FIELDS.map((field) => [field.key, true])));
        }
        setError(result?.message || "Something went wrong. Please try again.");
        errorRef.current?.focus();
        return;
      }

      pushBasketEvent("generate_lead", basket);
      setSent({ buyer: form, items: basket, reference: result?.reference ?? null });
      setSubmitted(true);
      clearBasket();
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      errorRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        {showDocument && (
          <QuoteDocument
            buyer={sent.buyer}
            items={sent.items}
            onClose={() => setShowDocument(false)}
            reference={sent.reference}
          />
        )}
      <div className="mx-auto max-w-2xl border border-line-light bg-parchment p-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold tracking-tight text-ink">Quote request sent</h2>
        <p className="mx-auto max-w-md text-sm leading-6 text-black">
          {`We have your request for ${sent.items.length === 1 ? "1 product" : `${sent.items.length} products`}. An Inkarp specialist will come back with pricing and availability shortly.`}
        </p>
        {sent.reference ? (
          <p className="mt-3 text-xs text-ink-soft">
            Your reference: <span className="font-semibold text-ink">{sent.reference}</span>
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {/* View Quote (PDF) button temporarily hidden — re-enable once ready.
          <button
            className="inline-flex items-center gap-2 border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            onClick={() => setShowDocument(true)}
            type="button"
          >
            <FiFileText aria-hidden /> View Quote
          </button>
          */}
          <Link
            className="inline-flex items-center justify-center border border-line-light bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-red hover:text-red"
            href="/products"
          >
            Continue browsing products
          </Link>
        </div>
      </div>
      </>
    );
  }

  if (!basket.length) {
    return (
      <div className="mx-auto max-w-2xl border border-dashed border-line-light bg-parchment p-10 text-center">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Your quote list is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
          Add products from the catalogue and request pricing for all of them together, filling
          your details only once.
        </p>
        <Link
          className="mt-6 inline-flex items-center justify-center border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          href="/products"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div className="border border-line-light bg-parchment p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            {basket.length === 1 ? "1 product" : `${basket.length} products`}
          </h2>
          <button
            className="text-xs font-semibold text-ink-soft transition hover:text-red"
            onClick={clearBasket}
            type="button"
          >
            Clear all
          </button>
        </div>

        <ul className="divide-y divide-line-light border-y border-line-light">
          {basket.map((item) => {
            const key = itemKey(item);
            return (
              <li className="flex items-center gap-3 py-3" key={key}>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-line-light bg-white">
                  {item.image ? (
                    <Image
                      alt={item.imageAlt ?? item.name}
                      className="h-full w-full object-contain p-1"
                      height={56}
                      src={item.image}
                      width={56}
                    />
                  ) : (
                    <span className="text-[10px] text-ink-soft">No image</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    className="text-sm font-semibold leading-snug text-ink transition hover:text-red"
                    href={`/products/${item.slug}`}
                  >
                    {item.name}
                  </Link>
                  {item.principalName ? (
                    <p className="mt-0.5 text-xs text-ink-soft">{item.principalName}</p>
                  ) : null}
                </div>
                <button
                  aria-label={`Remove ${item.name}`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-ink-soft transition hover:text-red"
                  onClick={() => removeFromBasket(key)}
                  type="button"
                >
                  <FiTrash2 />
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-xs leading-6 text-ink-soft">
          Need something else quoted alongside these?{" "}
          <Link className="font-semibold text-red hover:underline" href="/products">
            Add more products
          </Link>
          .
        </p>
      </div>

      <div className="border border-line-light bg-parchment p-6">
        <form noValidate onSubmit={handleSubmit}>
          <p className="mb-4 text-xs text-ink-soft">All fields are required.</p>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => {
              const invalid = Boolean(showError(field.key));
              const describedBy = invalid ? `${field.key}-error` : undefined;

              return (
                <div key={field.key}>
                  <label
                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black"
                    htmlFor={`quote-${field.key}`}
                  >
                    {field.label}
                    <span aria-hidden="true" className="ml-0.5 text-red">*</span>
                  </label>

                  {field.type === "select" ? (
                    <select
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      className={`${INPUT_BASE} ${invalid ? INPUT_BAD : INPUT_OK}`}
                      id={`quote-${field.key}`}
                      name={field.key}
                      onBlur={() => setTouched((c) => ({ ...c, [field.key]: true }))}
                      onChange={(event) => set(field.key, event.target.value)}
                      value={form[field.key] ?? ""}
                    >
                      <option value="">Select an industry...</option>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      aria-describedby={describedBy}
                      aria-invalid={invalid}
                      autoComplete={field.autoComplete}
                      className={`${INPUT_BASE} ${invalid ? INPUT_BAD : INPUT_OK} placeholder:text-ink-soft`}
                      id={`quote-${field.key}`}
                      maxLength={field.maxLength}
                      name={field.key}
                      onBlur={() => setTouched((c) => ({ ...c, [field.key]: true }))}
                      onChange={(event) => set(field.key, event.target.value)}
                      placeholder={field.placeholder ?? field.label}
                      type={field.type}
                      value={form[field.key] ?? ""}
                    />
                  )}

                  {invalid ? (
                    <p className="mt-1 text-[11px] font-semibold text-red" id={`${field.key}-error`}>
                      {liveErrors[field.key]}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div aria-live="polite" ref={errorRef} tabIndex={-1}>
            {error ? (
              <div className="mb-4 border border-red/20 bg-red/5 px-4 py-3 text-xs font-semibold text-red">
                {error}
              </div>
            ) : null}
          </div>

          <button
            className="w-full border border-rose-200 bg-rose-50 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading
              ? "Sending..."
              : `Request quote for ${basket.length === 1 ? "1 product" : `${basket.length} products`}`}
          </button>
        </form>
      </div>
    </div>
  );
}
