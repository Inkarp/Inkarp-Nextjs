"use client";

import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiMail, FiMapPin, FiPhone, FiTool, FiUser } from "react-icons/fi";
import RecTag from "./RecTag";
import { collectTracking } from "@/lib/browserTracking";

const initialForm = {
  productName: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  state: "",
  inquiryType: "Demo request",
  application: "",
  message: "",
};

const inquiryTypes = [
  "Demo request",
  "Quote request",
  "Technical question",
  "Service enquiry",
  "General enquiry",
];

function Field({ icon: Icon, label, children }) {
  return (
    <label className="group block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {Icon ? <Icon className="size-3.5 text-red" /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full border border-line-light bg-white px-4 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-red focus:ring-2 focus:ring-red/15";

export default function HomeProductEnquiry() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "demo-booking",
          source: "Home page product demo/enquiry form",
          ...form,
          ...collectTracking(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result?.success) {
        setStatus({
          type: "success",
          message: "Enquiry sent. An Inkarp specialist will contact you shortly.",
        });
        setForm(initialForm);
      } else {
        setStatus({
          type: "error",
          message: result?.message || "Could not send your enquiry. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Could not send your enquiry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-parchment-alt px-4 py-[78px] sm:px-6 lg:px-8" id="product-enquiry" data-reveal>
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <RecTag>Product Demo / Enquiry</RecTag>
          <h2 className="text-[30px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Need the right instrument for your workflow?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">
            Share your product, application, and location details. Our team will route the enquiry to the right product specialist for a demo, quote, or technical discussion.
          </p>

          <div className="mt-8 grid gap-px border border-line-light bg-line-light sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              ["01", "Product fit"],
              ["02", "Demo or quote"],
              ["03", "Specialist callback"],
            ].map(([num, label]) => (
              <div className="bg-white p-4" key={num}>
                <span className="text-lg font-semibold text-red">{num}</span>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-line-light bg-white p-5 sm:p-7">
          {status.message ? (
            <div
              className={`mb-5 flex items-start gap-3 border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red/20 bg-red/5 text-red"
              }`}
            >
              {status.type === "success" ? <FiCheckCircle className="mt-0.5 size-4 shrink-0" /> : null}
              {status.message}
            </div>
          ) : null}

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Field icon={FiTool} label="Product / instrument">
              <input
                className={inputClass}
                name="productName"
                onChange={handleChange}
                placeholder="Instrument or product name"
                required
                value={form.productName}
              />
            </Field>

            <Field icon={FiArrowRight} label="Request type">
              <select
                className={inputClass}
                name="inquiryType"
                onChange={handleChange}
                required
                value={form.inquiryType}
              >
                {inquiryTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </Field>

            <Field icon={FiUser} label="Name">
              <input
                autoComplete="name"
                className={inputClass}
                name="name"
                onChange={handleChange}
                placeholder="Your name"
                required
                value={form.name}
              />
            </Field>

            <Field icon={FiMail} label="Email">
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
            </Field>

            <Field icon={FiPhone} label="Phone">
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
            </Field>

            <Field icon={FiTool} label="Company / institute">
              <input
                className={inputClass}
                name="company"
                onChange={handleChange}
                placeholder="Company or institution"
                required
                value={form.company}
              />
            </Field>

            <Field icon={FiMapPin} label="City">
              <input
                className={inputClass}
                name="city"
                onChange={handleChange}
                placeholder="City"
                required
                value={form.city}
              />
            </Field>

            <Field icon={FiMapPin} label="State">
              <input
                className={inputClass}
                name="state"
                onChange={handleChange}
                placeholder="State"
                required
                value={form.state}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field icon={FiTool} label="Application / workflow">
                <input
                  className={inputClass}
                  name="application"
                  onChange={handleChange}
                  placeholder="Tell us your application or workflow"
                  required
                  value={form.application}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Message">
                <textarea
                  className="min-h-28 w-full resize-y border border-line-light bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-red focus:ring-2 focus:ring-red/15"
                  name="message"
                  onChange={handleChange}
                  placeholder="Any sample, configuration, timeline, or quote details"
                  value={form.message}
                />
              </Field>
            </div>

            <button
              className="inline-flex h-12 items-center justify-center gap-2 border border-red bg-red px-6 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Send enquiry"}
              <FiArrowRight aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}