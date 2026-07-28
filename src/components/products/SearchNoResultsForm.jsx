"use client";

import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiMail, FiPhone, FiSearch, FiUser } from "react-icons/fi";
import { collectTracking } from "@/lib/browserTracking";

const inputClass =
  "h-11 w-full border border-line-light bg-white px-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-red focus:ring-2 focus:ring-red/20";

function getInitialForm(query) {
  return {
    searchQuery: query,
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  };
}

export default function SearchNoResultsForm({
  className = "",
  query = "",
  source = "Product search no-result form",
}) {
  const trimmedQuery = query.trim();
  const [form, setForm] = useState(() => getInitialForm(trimmedQuery));
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const searchQuery = form.searchQuery.trim();
    if (!searchQuery) {
      setStatus({ type: "error", message: "Please enter what you were searching for." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "product-search-no-results",
          source,
          ...form,
          searchQuery,
          productName: searchQuery,
          resultsCount: 0,
          ...collectTracking(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Could not send your request. Please try again.");
      }

      setStatus({
        type: "success",
        message: "Thanks. We have received your search request and will help you find the right product.",
      });
      setForm(getInitialForm(trimmedQuery));
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not send your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`border border-line-light bg-white p-5 text-left ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-red">No product match</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">
            Share the product you searched for
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
            Our team will use this exact search query to check alternatives, availability, or equivalent instruments.
          </p>
        </div>
      </div>

      {status.message ? (
        <div
          className={`mt-4 flex items-start gap-2 border px-3 py-2.5 text-sm ${
            status.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red/20 bg-red/5 text-red"
          }`}
          role="status"
        >
          {status.type === "success" ? <FiCheckCircle className="mt-0.5 size-4 shrink-0" /> : null}
          <span>{status.message}</span>
        </div>
      ) : null}

      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="sm:col-span-2">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <FiSearch className="text-red" />
            Search query
          </span>
          <input
            className={inputClass}
            name="searchQuery"
            onChange={handleChange}
            placeholder="Product, model, brand, or application"
            required
            value={form.searchQuery}
          />
        </label>

        <label>
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <FiUser className="text-red" />
            Name
          </span>
          <input
            autoComplete="name"
            className={inputClass}
            name="name"
            onChange={handleChange}
            placeholder="Your name"
            required
            value={form.name}
          />
        </label>

        <label>
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <FiMail className="text-red" />
            Email
          </span>
          <input
            autoComplete="email"
            className={inputClass}
            name="email"
            onChange={handleChange}
            placeholder="Email address"
            required
            type="email"
            value={form.email}
          />
        </label>

        <label>
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <FiPhone className="text-red" />
            Phone
          </span>
          <input
            autoComplete="tel"
            className={inputClass}
            name="phone"
            onChange={handleChange}
            placeholder="Phone number"
            required
            type="tel"
            value={form.phone}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Company / institute
          </span>
          <input
            className={inputClass}
            name="company"
            onChange={handleChange}
            placeholder="Company or institution"
            value={form.company}
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Details
          </span>
          <textarea
            className="min-h-24 w-full resize-y border border-line-light bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-red focus:ring-2 focus:ring-red/20"
            name="message"
            onChange={handleChange}
            placeholder="Add model number, application, sample type, or urgency"
            value={form.message}
          />
        </label>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 border border-red bg-red px-5 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:w-fit"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Sending..." : "Send search request"}
          <FiArrowRight aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
