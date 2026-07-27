"use client";

import { useState } from "react";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import RecTag from "@/components/home/RecTag";
import { collectTracking } from "@/lib/tracking";

const inputClass =
  "w-full border border-line-light bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/70 focus:border-red focus:ring-2 focus:ring-red/20";

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
      const response = await fetch("/api/forms", {
        body: JSON.stringify({ formType: "service", ...form, ...collectTracking() }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

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
    <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8" id="service-request" data-reveal>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag>Service Request</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Tell us what your instrument needs.
            </h2>
          </div>
          <p className="max-w-[430px] text-sm leading-6 text-ink-soft">
            Fill out the form and our service team will get back to you shortly.
            Fields marked * are required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.38fr_0.62fr]">
          <aside className="border border-line-light bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red">
              Direct Support
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
              Reach the service desk.
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              For urgent breakdowns or installation coordination, contact us directly.
            </p>

            <div className="mt-8 space-y-4">
              <a
                className="flex items-center gap-3 border border-line-light bg-parchment-alt p-4 text-sm text-ink transition hover:border-red hover:text-red"
                href="mailto:service@inkarp.co.in"
              >
                <MdEmail className="size-5 shrink-0 text-red" />
                service@inkarp.co.in
              </a>
              <a
                className="flex items-center gap-3 border border-line-light bg-parchment-alt p-4 text-sm text-ink transition hover:border-red hover:text-red"
                href="tel:+917330731315"
              >
                <MdLocalPhone className="size-5 shrink-0 text-red" />
                7330731315
              </a>
            </div>

            {status.message ? (
              <div
                className={`mt-6 border p-4 text-sm leading-6 ${
                  status.type === "success"
                    ? "border-green-300 bg-green-50 text-green-800"
                    : "border-red/30 bg-red/8 text-red"
                }`}
              >
                {status.message}
              </div>
            ) : null}
          </aside>

          <div className="border border-line-light bg-white p-6 sm:p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
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

              <div className="grid gap-4 md:grid-cols-2">
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

              <div className="grid gap-4 md:grid-cols-2">
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
                  className={inputClass}
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
                className={`mt-2 inline-flex border border-red bg-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red ${
                  isSubmitting ? "cursor-not-allowed opacity-70" : "hover:-translate-y-0.5"
                }`}
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}