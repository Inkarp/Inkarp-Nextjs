"use client";

import { useEffect, useMemo, useRef, useState } from"react";
import { useRouter } from"next/navigation";
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiGlobe,
  FiLoader,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
  FiX,
} from"react-icons/fi";
import { collectTracking } from"@/lib/browserTracking";
import { getDaysLeft } from"@/data/webinars";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

function InputField({ name, label, value, onChange, required = false, type = "text", icon: Icon, autoComplete, placeholder }) {
  return (
    <div className="min-w-0">
      <label htmlFor={`webinar-${name}`} className="mb-1 block text-xs font-medium text-ink">
        {label}{required ? <span className="ml-1 text-red" aria-hidden="true">*</span> : null}
      </label>
      <div className="group relative">
        {Icon ? <Icon aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400 group-focus-within:text-red" /> : null}
        <input
          id={`webinar-${name}`}
          className="min-h-11 w-full rounded-lg border border-zinc-200 bg-zinc-50/70 py-2 pl-11 pr-3 text-base text-ink outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-red focus:bg-white focus:ring-4 focus:ring-red/10"
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          type={type}
          value={value}
        />
      </div>
    </div>
  );
}

export default function RegisterForm({ isOpen, onClose, preselected = null }) {
  const router = useRouter();
  const today = useMemo(() => startOfToday(), []);
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);

  const selectedTitle = useMemo(() => {
    if (!preselected) {
      return"";
    }
    return getDaysLeft(preselected, today) > 0 ? preselected.title :"";
  }, [preselected, today]);

  const getInitialFormData = () => ({
    webinarTitle: selectedTitle,
    name:"",
    email:"",
    contact:"",
    companyName:"",
    department:"",
    designation:"",
    country:"",
    state:"",
    city:"",
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type:"", message:"" });

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Tab") {
        const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), summary, [tabindex="0"]')].filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
          event.preventDefault();
          first?.focus();
        }
      }
      if (event.key ==="Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow ="hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === backdropRef.current) {
      onClose?.();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type:"", message:"" });

    try {
      const response = await fetch("/api/forms", {
        body: JSON.stringify({ formType:"webinar", ...formData, ...collectTracking() }),
        headers: {"Content-Type":"application/json" },
        method:"POST",
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus({
          type:"success",
          message:"Registration successful. Redirecting...",
        });
        setFormData(getInitialFormData());

        window.setTimeout(() => {
          onClose?.();
          router.push("/thank-you");
        }, 400);
      } else {
        setStatus({
          type:"error",
          message: data?.message ||"An error occurred. Please try again.",
        });
      }
    } catch {
      setStatus({
        type:"error",
        message:"Couldn't reach the server. Please try again or check your network.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactFields = [
    ["name", "Full name", "text", FiUser, "name", "Your full name"],
    ["email", "Email address", "email", FiMail, "email", "you@company.com"],
    ["contact", "Phone number", "tel", FiPhone, "tel", "+91 98765 43210"],
  ];
  const profileFields = [
    ["companyName", "Company / institution", FiBriefcase, "organization"],
    ["designation", "Job title", FiBriefcase, "organization-title"],
    ["department", "Department", FiUsers, "off"],
    ["country", "Country", FiGlobe, "country-name"],
    ["state", "State / region", FiMapPin, "address-level1"],
    ["city", "City", FiMapPin, "address-level2"],
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/65 p-2 backdrop-blur-sm sm:p-6"
      onClick={handleBackdropClick}
      ref={backdropRef}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="webinar-registration-heading"
        aria-describedby="webinar-selected-title"
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-1rem)] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl outline-none sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl"
      >
        <button
          aria-label="Close registration form"
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:right-4 sm:top-4"
          onClick={onClose}
          type="button"
        >
          <FiX aria-hidden="true" size={20} />
        </button>
        <div>
          <header className="relative overflow-hidden bg-[#171c24] px-4 py-4 pr-16 text-white sm:px-6 sm:pr-20">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-200">
              <span className="size-2 rounded-full bg-rose-400" /> You are registering for
            </p>
            <h3 id="webinar-selected-title" className="mt-2 break-words text-sm font-semibold leading-snug sm:text-lg">
              {formData.webinarTitle || "Expert-led webinar"}
            </h3>
            {preselected?.date1 ? (
              <p className="mt-2 flex items-center gap-2 text-xs text-zinc-300">
                <FiCalendar aria-hidden="true" className="size-3.5 shrink-0 text-rose-200" />
                {preselected.date1}
              </p>
            ) : null}
          </header>

          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 id="webinar-registration-heading" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Save your seat.</h2>
              <p className="text-xs text-ink-soft"><span className="text-red">*</span> All fields are required</p>
            </div>
            <form className="mt-3 space-y-3" onSubmit={handleSubmit} aria-busy={isSubmitting}>
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 sm:gap-x-4">
                {contactFields.map(([field, label, type, icon, autoComplete, placeholder]) => (
                  <InputField key={field} name={field} label={label} type={type} icon={icon} autoComplete={autoComplete} placeholder={placeholder} value={formData[field]} onChange={handleChange} required />
                ))}
                {profileFields.map(([field, label, icon, autoComplete]) => (
                  <InputField key={field} name={field} label={label} icon={icon} autoComplete={autoComplete} value={formData[field]} onChange={handleChange} required />
                ))}
              </div>

              {status.message ? (
                <div role={status.type === "error" ? "alert" : "status"} className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red/5 text-red"}`}>
                  {status.type === "success" ? <FiCheckCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> : null}
                  {status.message}
                </div>
              ) : null}
              <button
                className="inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-red px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-red/15 transition hover:bg-[#a3000e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting || status.type === "success"}
                type="submit"
              >
                {isSubmitting ? <FiLoader aria-hidden="true" className="size-5 animate-spin" /> : null}
                {isSubmitting ? "Registering..." : status.type === "success" ? "Registration complete" : "Reserve my seat"}
                {!isSubmitting && status.type !== "success" ? <FiArrowRight aria-hidden="true" className="size-5" /> : null}
              </button>
              <p className="text-center text-xs leading-5 text-ink-soft">Joining information will be sent to your email.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
