"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import SubmitButton from "@/components/common/SubmitButton";
import { parseBranchPhones, phoneHref } from "@/data/branches";
import {
  contactDirectory,
  ENQUIRY_DEPARTMENTS,
  HR_DEPARTMENT,
  SERVICE_DEPARTMENT,
} from "@/data/contactDirectory";
import { nearestBranchForState, STATE_OPTIONS } from "@/data/indiaStates";
import { gmailComposeHref } from "@/data/siteConfig";
import { pushEvent } from "@/lib/analytics";
import { collectTracking } from "@/lib/browserTracking";
import { isValidEmail, isValidIndianPhone } from "@/lib/formValidation";

const inputClass =
  "min-h-12 w-full border border-line-light bg-parchment-alt px-4 text-sm font-medium text-ink outline-none transition-colors duration-200 placeholder:text-ink-soft/60 focus:border-red/40 focus:bg-white focus:ring-2 focus:ring-red/15 aria-[invalid=true]:border-red aria-[invalid=true]:bg-white";

const linkClass =
  "font-semibold text-ink underline decoration-line-light underline-offset-2 transition-colors hover:text-red hover:decoration-red/40";

// Required fields in on-screen order, so the first error gets focus.
const REQUIRED_ORDER = ["name", "email", "phone", "company", "inquiryType"];

function getInitialFormData() {
  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    state: "",
    city: "",
    application: "",
    message: "",
  };
}

/** Indian numbers get the strict check; "+country" numbers just a sane length. */
function isValidPhone(value) {
  const text = String(value ?? "").trim();
  const digits = text.replace(/\D/g, "");
  return isValidIndianPhone(text) || (text.startsWith("+") && digits.length >= 8 && digits.length <= 15);
}

function validate(values, department) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!isValidEmail(values.email)) {
    errors.email = values.email.trim() ? "Please enter a valid email address." : "Please enter your email.";
  }
  if (!isValidPhone(values.phone)) {
    errors.phone = values.phone.trim()
      ? "Please enter a valid phone number. Outside India, start with your country code (+)."
      : "Please enter your phone number.";
  }
  if (!values.company.trim()) errors.company = "Please enter your company or institution.";
  if (!department) errors.inquiryType = "Please choose what you need help with.";
  return errors;
}

function Field({ id, label, optional = false, error, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-semibold text-ink" htmlFor={id}>
        <span>
          {label}
          {optional ? null : (
            <span aria-hidden="true" className="ml-0.5 text-red">
              *
            </span>
          )}
        </span>
        {optional ? <span className="font-medium text-ink-soft">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Extra help under the department choices, for teams with their own route. */
function DepartmentHint({ department }) {
  const entry = ENQUIRY_DEPARTMENTS.find((d) => d.label === department);
  const direct = entry?.directoryId ? contactDirectory.find((c) => c.id === entry.directoryId) : null;

  if (department === SERVICE_DEPARTMENT) {
    return (
      <p className="mt-3 border-l-2 border-red bg-parchment-alt px-3.5 py-2.5 text-xs leading-relaxed text-ink-soft">
        Have the instrument&apos;s serial number to hand? The{" "}
        <Link className={linkClass} href="/service#service-request">
          service request form
        </Link>{" "}
        collects everything the service team needs.
      </p>
    );
  }

  if (!direct) return null;

  return (
    <p className="mt-3 border-l-2 border-red bg-parchment-alt px-3.5 py-2.5 text-xs leading-relaxed text-ink-soft">
      {department === HR_DEPARTMENT ? (
        <>
          Looking for open roles? See{" "}
          <Link className={linkClass} href="/careers">
            Careers
          </Link>
          . Direct line:{" "}
        </>
      ) : (
        "Direct line: "
      )}
      <a
        className={linkClass}
        href={gmailComposeHref(direct.email, `Enquiry — ${direct.title.replace(/\n/g, " ")}`)}
        onClick={() => pushEvent("email_clicked", { source: "contact_form_hint", department })}
        rel="noopener noreferrer"
        target="_blank"
      >
        {direct.email}
      </a>{" "}
      ·{" "}
      <a
        className={linkClass}
        href={`tel:+91${direct.phone}`}
        onClick={() => pushEvent("phone_clicked", { source: "contact_form_hint", department })}
      >
        +91 {direct.phone}
      </a>
    </p>
  );
}

/** Nearest branch to the chosen state, with its sales line. */
function NearestBranch({ branch }) {
  const sales = parseBranchPhones(branch.phone).find((p) => /sales/i.test(p.label));
  const number = sales?.numbers[0];

  return (
    <p className="flex items-start gap-2 border border-line-light bg-white px-3.5 py-2.5 text-xs leading-relaxed text-ink-soft md:col-span-2">
      <FiMapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-red" />
      <span>
        Nearest Inkarp branch: <strong className="font-semibold text-ink">{branch.name}</strong>
        {number ? (
          <>
            {" "}· Sales{" "}
            <a
              className={linkClass}
              href={`tel:${phoneHref(number)}`}
              onClick={() => pushEvent("phone_clicked", { source: "contact_form_nearest", branch: branch.name })}
            >
              {number}
            </a>
          </>
        ) : null}
      </span>
    </p>
  );
}

// The enquiry type is controlled by the page, so its "Request a quote" button
// can preselect it.
export default function ContactForm({ department, onDepartmentChange }) {
  const router = useRouter();
  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef({ timer: 0, controller: null });

  const nearestBranch = nearestBranchForState(formData.state);

  const clearError = (key) => {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  // Suggest catalogue product names as the visitor types. /api/search matches
  // specs and synonyms too, so results whose name contains the text go first.
  const searchProducts = (text) => {
    const query = text.trim();
    window.clearTimeout(searchRef.current.timer);
    searchRef.current.controller?.abort();
    if (query.length < 2) return;

    searchRef.current.timer = window.setTimeout(async () => {
      const controller = new AbortController();
      searchRef.current.controller = controller;
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=24`, {
          signal: controller.signal,
        });
        const data = await response.json();
        const lower = query.toLowerCase();
        const nameMatch = (product) => Number(product.name.toLowerCase().includes(lower));
        const ranked = [...(data?.results ?? [])].sort((a, b) => nameMatch(b) - nameMatch(a));
        setSuggestions(ranked.slice(0, 8));
      } catch {
        // Suggestions are a convenience; typing still works without them.
      }
    }, 250);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    clearError(name);
    if (name === "application") searchProducts(value);
  };

  const handleDepartment = (label) => {
    onDepartmentChange(label);
    clearError("inquiryType");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const found = validate(formData, department);
    setErrors(found);
    const firstInvalid = REQUIRED_ORDER.find((key) => found[key]);
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forms", {
        body: JSON.stringify({
          formType: "contact",
          ...formData,
          inquiryType: department,
          nearestBranch: nearestBranch?.name ?? "",
          ...collectTracking(),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        pushEvent("contact_form_submit", {
          department,
          state: formData.state,
          nearest_branch: nearestBranch?.name ?? "",
        });
        setStatus({ type: "success", message: "Thank you for contacting us. Redirecting..." });
        setFormData(getInitialFormData());
        onDepartmentChange("");
        window.setTimeout(() => router.push("/thank-you?type=contact"), 200);
      } else {
        setStatus({
          type: "error",
          message: data?.message || "An error occurred while sending your message",
        });
      }
    } catch {
      setStatus({ type: "error", message: "An error occurred while sending your message" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    "aria-invalid": errors[name] ? true : undefined,
    className: inputClass,
    id: `contact-${name}`,
    name,
    value: formData[name],
  });

  return (
    <div
      className="scroll-mt-28 border border-line-light border-t-2 border-t-red bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8"
      id="contact-form"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">Send us your enquiry</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Only the fields marked <span className="font-semibold text-red">*</span> are required. The rest help us
        route it to the right specialist.
      </p>

      {status.message ? (
        <div
          className={`mt-5 border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red/20 bg-red/5 text-red"
          }`}
          role={status.type === "success" ? "status" : "alert"}
        >
          {status.message}
        </div>
      ) : null}

      <form className="mt-6 grid gap-5" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field error={errors.name} id="contact-name" label="Full name">
            <input autoComplete="name" required type="text" {...fieldProps("name")} onChange={handleChange} />
          </Field>
          <Field error={errors.email} id="contact-email" label="Email">
            <input autoComplete="email" required type="email" {...fieldProps("email")} onChange={handleChange} />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field error={errors.phone} id="contact-phone" label="Phone">
            <input autoComplete="tel" inputMode="tel" required type="tel" {...fieldProps("phone")} onChange={handleChange} />
          </Field>
          <Field error={errors.company} id="contact-company" label="Company / institution">
            <input autoComplete="organization" required type="text" {...fieldProps("company")} onChange={handleChange} />
          </Field>
        </div>

        <fieldset aria-describedby={errors.inquiryType ? "contact-inquiryType-error" : undefined}>
          <legend className="mb-2 text-xs font-semibold text-ink">
            What do you need help with?
            <span aria-hidden="true" className="ml-0.5 text-red">
              *
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {ENQUIRY_DEPARTMENTS.map(({ label }, index) => (
              <label className="cursor-pointer" key={label}>
                <input
                  checked={department === label}
                  className="peer sr-only"
                  id={index === 0 ? "contact-inquiryType" : undefined}
                  name="inquiryType"
                  onChange={() => handleDepartment(label)}
                  required
                  type="radio"
                  value={label}
                />
                <span
                  className={`inline-flex min-h-10 items-center border px-3.5 text-xs font-semibold transition-colors duration-200 peer-checked:border-red peer-checked:bg-red peer-checked:text-white peer-checked:hover:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-red/40 ${
                    errors.inquiryType
                      ? "border-red/50 bg-white text-ink"
                      : "border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-ink"
                  }`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
          {errors.inquiryType ? (
            <p className="mt-1.5 text-xs font-medium text-red" id="contact-inquiryType-error">
              {errors.inquiryType}
            </p>
          ) : null}
          <DepartmentHint department={department} />
        </fieldset>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id="contact-state" label="State" optional>
            <select autoComplete="address-level1" {...fieldProps("state")} onChange={handleChange}>
              <option value="">Select your state</option>
              {STATE_OPTIONS.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>
          <Field id="contact-city" label="City" optional>
            <input autoComplete="address-level2" type="text" {...fieldProps("city")} onChange={handleChange} />
          </Field>
          {nearestBranch ? <NearestBranch branch={nearestBranch} /> : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id="contact-jobTitle" label="Designation" optional>
            <input autoComplete="organization-title" type="text" {...fieldProps("jobTitle")} onChange={handleChange} />
          </Field>
          <Field id="contact-application" label="Product or application" optional>
            <input
              autoComplete="off"
              list="contact-product-suggestions"
              placeholder="Start typing a product name"
              type="text"
              {...fieldProps("application")}
              onChange={handleChange}
            />
            <datalist id="contact-product-suggestions">
              {suggestions.map((product) => (
                <option
                  key={product.slug}
                  value={product.principalName ? `${product.name} (${product.principalName})` : product.name}
                />
              ))}
            </datalist>
          </Field>
        </div>

        <Field id="contact-message" label="Message" optional>
          <textarea
            {...fieldProps("message")}
            onChange={handleChange}
            className={`${inputClass} min-h-36 resize-y py-3.5`}
            placeholder="Tell us about your requirement"
          />
        </Field>

        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
          <SubmitButton
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 bg-red px-7 text-sm font-semibold text-white shadow-lg shadow-red/15 transition hover:bg-[#a3000e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            doneLabel="Message sent"
            sending={isSubmitting}
            succeeded={status.type === "success"}
          >
            Send enquiry
            <FiArrowRight aria-hidden="true" />
          </SubmitButton>
          <p className="text-xs leading-relaxed text-ink-soft">
            By sending this form, you agree to our{" "}
            <Link className={linkClass} href="/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
