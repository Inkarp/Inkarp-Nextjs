"use client";

import { useState } from "react";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import RecTag from "@/components/home/RecTag";
import { collectTracking } from "@/lib/browserTracking";
import SubmitButton from "@/components/common/SubmitButton";
import { SERVICE_DESK } from "@/data/contactDirectory";

const inputClass =
  "w-full border border-line-light bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/70 focus:border-red focus:ring-2 focus:ring-red/20";

function Field({ id, label, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-semibold text-ink" htmlFor={id}>
        {label}
        <span aria-hidden="true" className="ml-0.5 text-red">
          *
        </span>
      </label>
      {children}
    </div>
  );
}

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
                href={`mailto:${SERVICE_DESK.email}`}
              >
                <MdEmail className="size-5 shrink-0 text-red" />
                {SERVICE_DESK.email}
              </a>
              <a
                className="flex items-center gap-3 border border-line-light bg-parchment-alt p-4 text-sm text-ink transition hover:border-red hover:text-red"
                href={`tel:+91${SERVICE_DESK.phone}`}
              >
                <MdLocalPhone className="size-5 shrink-0 text-red" />
                {SERVICE_DESK.phone}
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
                <Field id="service-customerName" label="Customer name">
                  <input
                    autoComplete="name"
                    className={inputClass}
                    id="service-customerName"
                    name="customerName"
                    onChange={handleChange}
                    required
                    type="text"
                    value={form.customerName}
                  />
                </Field>
                <Field id="service-companyName" label="Company name">
                  <input
                    autoComplete="organization"
                    className={inputClass}
                    id="service-companyName"
                    name="companyName"
                    onChange={handleChange}
                    required
                    type="text"
                    value={form.companyName}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field id="service-contactNumber" label="Contact number">
                  <input
                    autoComplete="tel"
                    className={inputClass}
                    id="service-contactNumber"
                    name="contactNumber"
                    onChange={handleChange}
                    required
                    type="tel"
                    value={form.contactNumber}
                  />
                </Field>
                <Field id="service-serialNumber" label="Serial number">
                  <input
                    className={inputClass}
                    id="service-serialNumber"
                    name="serialNumber"
                    onChange={handleChange}
                    required
                    type="text"
                    value={form.serialNumber}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field id="service-instrumentName" label="Instrument name">
                  <input
                    className={inputClass}
                    id="service-instrumentName"
                    name="instrumentName"
                    onChange={handleChange}
                    required
                    type="text"
                    value={form.instrumentName}
                  />
                </Field>
                <Field id="service-warranty" label="Under warranty?">
                  <select
                    className={inputClass}
                    id="service-warranty"
                    name="warranty"
                    onChange={handleChange}
                    required
                    value={form.warranty}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </Field>
              </div>

              <Field id="service-department" label="Department">
                <input
                  className={inputClass}
                  id="service-department"
                  name="department"
                  onChange={handleChange}
                  required
                  type="text"
                  value={form.department}
                />
              </Field>

              <SubmitButton
                className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 bg-red px-7 text-sm font-semibold text-white shadow-lg shadow-red/15 transition hover:bg-[#a3000e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red disabled:cursor-not-allowed disabled:opacity-70"
                doneLabel="Request sent"
                sending={isSubmitting}
                sendingLabel="Submitting..."
                succeeded={status.type === "success"}
              >
                Submit Request
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}