"use client";

import { useState } from "react";
import { MdEmail, MdLocalPhone } from "react-icons/md";

const inputClass =
  "w-full rounded-full border border-zinc-200 bg-white px-5 py-3 text-zinc-900 outline-none transition focus:ring-2 focus:ring-[#E63946] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

function getInitialForm() {
  return {
    customerName: "",
    companyName: "",
    contactNumber: "",
    serialNumber: "",
    instrumentName: "",
    warranty: "",
    department: "",
  };
}

export default function ServiceContactForm() {
  const [form, setForm] = useState(getInitialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "contactNumber") {
      setForm((current) => ({
        ...current,
        [name]: value.replace(/[^\d+()\-\s]/g, ""),
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const requiredKeys = Object.keys(getInitialForm());
    if (requiredKeys.some((key) => !form[key])) {
      setStatus({ type: "error", message: "Please fill all required fields (*)" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://inkarppersonal.vercel.app/api/service/enquiry",
        {
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus({
          type: "success",
          message: "Request submitted successfully. Our Service Team will contact you shortly.",
        });
        setForm(getInitialForm());
      } else {
        setStatus({
          type: "error",
          message: data?.message || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Server error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mx-auto w-[95%] rounded-xl py-10 md:px-10 lg:px-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.08),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.08),transparent)] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.12),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.12),transparent)]" />

      <div className="mx-auto max-w-6xl">
        <h3 className="font-maxot mb-2 text-center text-2xl text-[#E63946]">
          Service &amp; Installation Request
        </h3>
        <p className="mb-5 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Fill out the form and our Service Team will get back to you shortly. Fields marked * are required.
        </p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Left: contact info */}
          <div className="flex flex-col items-center rounded-2xl p-7">
            <div className="w-full">
              <div className="flex flex-col items-center rounded-2xl border-l-4 border-[#BE0010] bg-gradient-to-b from-zinc-50 to-zinc-100 p-7 text-center shadow-lg dark:from-zinc-900 dark:to-zinc-950">
                <div className="mb-5 flex flex-col items-center gap-4">
                  <span className="inline-flex items-center gap-3 text-base">
                    <MdEmail className="text-xl text-[#BE0010]" />
                    <span className="font-maxot font-semibold text-[#BE0010]">Email:</span>
                    <a
                      className="text-zinc-700 underline transition hover:text-[#E63946] dark:text-zinc-200"
                      href="mailto:service@inkarp.co.in"
                    >
                      service@inkarp.co.in
                    </a>
                  </span>
                  <span className="inline-flex items-center gap-3 text-base">
                    <MdLocalPhone className="text-xl text-[#BE0010]" />
                    <span className="font-maxot font-semibold text-[#BE0010]">Contact:</span>
                    <a
                      className="text-zinc-700 underline transition hover:text-[#E63946] dark:text-zinc-200"
                      href="tel:+917330731315"
                    >
                      7330731315
                    </a>
                  </span>
                </div>
                <div className="mb-3 h-2 w-24 rounded-full bg-gradient-to-r from-[#BE0010] via-[#E63946] to-transparent opacity-60" />
                <div className="text-xs italic text-zinc-500 dark:text-zinc-400">
                  For urgent requests, call or email us directly.
                </div>
              </div>

              {status.message ? (
                <div
                  className={`mt-6 rounded-xl border-2 p-4 text-center transition ${
                    status.type === "success"
                      ? "border-green-300 bg-gradient-to-r from-green-50 to-green-100 text-green-800 dark:border-green-700 dark:from-green-950 dark:to-green-900 dark:text-green-300"
                      : "border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-800 dark:border-red-700 dark:from-red-950 dark:to-red-900 dark:text-red-300"
                  }`}
                >
                  {status.message}
                </div>
              ) : null}
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow dark:border-zinc-800 dark:bg-zinc-900">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 md:flex-row">
                <input
                  autoComplete="name"
                  className={inputClass}
                  name="customerName"
                  onChange={handleChange}
                  placeholder="Customer Name *"
                  required
                  type="text"
                  value={form.customerName}
                />
                <input
                  className={inputClass}
                  name="companyName"
                  onChange={handleChange}
                  placeholder="Company Name *"
                  required
                  type="text"
                  value={form.companyName}
                />
              </div>

              <div className="flex flex-col gap-4 md:flex-row">
                <input
                  autoComplete="tel"
                  className={inputClass}
                  name="contactNumber"
                  onChange={handleChange}
                  placeholder="Contact Number *"
                  required
                  type="tel"
                  value={form.contactNumber}
                />
                <input
                  className={inputClass}
                  name="serialNumber"
                  onChange={handleChange}
                  placeholder="Serial Number *"
                  required
                  type="text"
                  value={form.serialNumber}
                />
              </div>

              <div className="flex flex-col gap-4 md:flex-row">
                <input
                  className={inputClass}
                  name="instrumentName"
                  onChange={handleChange}
                  placeholder="Instrument Name *"
                  required
                  type="text"
                  value={form.instrumentName}
                />
                <select
                  className={`${inputClass} bg-white dark:bg-zinc-900`}
                  name="warranty"
                  onChange={handleChange}
                  required
                  value={form.warranty}
                >
                  <option value="">Warranty *</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <input
                className={inputClass}
                name="department"
                onChange={handleChange}
                placeholder="Department *"
                required
                type="text"
                value={form.department}
              />

              <button
                className={`mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow transition ${
                  isSubmitting ? "cursor-not-allowed opacity-80" : "hover:opacity-95"
                }`}
                disabled={isSubmitting}
                style={{ background: "linear-gradient(90deg,#BE0010,#E63946)" }}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <svg className="-ml-1 mr-2 size-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-30"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-80"
                        d="M4 12a8 8 0 018-8V0a12 12 0 100 24v-4a8 8 0 01-8-8z"
                        fill="currentColor"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>Submit →</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
