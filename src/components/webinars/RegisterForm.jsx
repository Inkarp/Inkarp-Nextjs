"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
} from "react-icons/fi";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

function getMetaInfo() {
  if (typeof window === "undefined") {
    return { pageUrl: "", referrer: "", searchKeyword: "" };
  }

  const pageUrl = window.location.href;
  const referrer = document.referrer || "";
  let searchKeyword = "";

  try {
    if (referrer && referrer.includes("google.")) {
      const refUrl = new URL(referrer);
      const q = refUrl.searchParams.get("q");
      if (q) {
        searchKeyword = q;
      }
    }

    const currentUrl = new URL(pageUrl);
    const utmTerm =
      currentUrl.searchParams.get("utm_term") ||
      currentUrl.searchParams.get("keyword");

    if (!searchKeyword && utmTerm) {
      searchKeyword = utmTerm;
    }
  } catch (error) {
    console.warn("Error parsing search keyword:", error);
  }

  return { pageUrl, referrer, searchKeyword };
}

function InputField({ name, label, value, onChange, required = false, type = "text", icon: Icon }) {
  return (
    <div className="group relative">
      {Icon ? (
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-[#BE0010]" />
      ) : null}
      <input
        className={`peer w-full rounded-md border border-zinc-200 bg-white pb-2 pt-5 text-sm text-zinc-900 outline-none transition-all duration-300 placeholder:text-transparent hover:border-zinc-300 focus:border-[#BE0010] focus:ring-2 focus:ring-[#BE0010]/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 ${
          Icon ? "pl-11 pr-4" : "px-4"
        }`}
        name={name}
        onChange={onChange}
        placeholder=" "
        required={required}
        type={type}
        value={value}
      />
      <label
        className={`absolute top-2 text-xs text-zinc-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#BE0010] dark:text-zinc-400 ${
          Icon ? "left-11" : "left-4"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export default function RegisterForm({ isOpen, onClose, preselected = null }) {
  const router = useRouter();
  const today = useMemo(() => startOfToday(), []);
  const backdropRef = useRef(null);

  const selectedTitle = useMemo(() => {
    if (!preselected) {
      return "";
    }
    const eventDate = new Date(preselected.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today ? preselected.title : "";
  }, [preselected, today]);

  const getInitialFormData = () => ({
    webinarTitle: selectedTitle,
    name: "",
    email: "",
    contact: "",
    companyName: "",
    department: "",
    designation: "",
    country: "",
    state: "",
    city: "",
    ...getMetaInfo(),
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        "https://inkarppersonal.vercel.app/api/webinar/register",
        {
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus({
          type: "success",
          message: "Registration successful. Redirecting...",
        });
        setFormData(getInitialFormData());

        window.setTimeout(() => {
          onClose?.();
          router.push("/thank-you");
        }, 400);
      } else {
        setStatus({
          type: "error",
          message: data?.message || "An error occurred. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Couldn't reach the server. Please try again or check your network.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactFields = [
    ["name", "Your Name", "text", FiUser],
    ["email", "Email Address", "email", FiMail],
    ["contact", "Phone Number", "tel", FiPhone],
    ["companyName", "Company Name", "text", FiBriefcase],
  ];

  const profileFields = [
    ["department", "Department", FiUsers],
    ["designation", "Designation", FiBriefcase],
    ["city", "City", FiMapPin],
    ["state", "State", FiMapPin],
    ["country", "Country", FiGlobe],
  ];

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#0F2A33]/70 backdrop-blur-md"
      onClick={handleBackdropClick}
      ref={backdropRef}
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-5">
        <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-white/60 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="relative overflow-hidden border-b border-zinc-200 bg-zinc-100 px-5 py-5 sm:px-7 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#BE0010]" />
            <button
              aria-label="Close registration form"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:border-[#BE0010] hover:text-[#BE0010] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              onClick={onClose}
              type="button"
            >
              <FiX size={20} />
            </button>

            <div className="pr-11">
              <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-[#BE0010]">
                Reserve Your Seat
              </p>
              <h2 className="font-maxot text-2xl leading-tight text-zinc-950 sm:text-3xl dark:text-zinc-100">
                Webinar Registration
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Share a few details and our team will send the joining information to your inbox.
              </p>
            </div>
          </div>

          {status.message ? (
            <div
              className={`mx-5 mt-4 flex items-start gap-3 rounded-md border px-4 py-3 text-sm sm:mx-7 ${
                status.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/40 dark:text-green-400"
                  : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400"
              }`}
            >
              {status.type === "success" ? (
                <FiCheckCircle className="mt-0.5 size-4 shrink-0" />
              ) : null}
              {status.message}
            </div>
          ) : null}

          <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900">
            <form
              className="grid grid-cols-1 gap-4 px-5 py-5 sm:px-7 md:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <div className="rounded-md border border-[#BE0010]/15 bg-[#BE0010]/5 px-4 py-4 md:col-span-2 dark:border-[#BE0010]/30 dark:bg-[#BE0010]/10">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-md bg-white text-[#BE0010] shadow-sm dark:bg-zinc-900">
                    <FiCalendar size={18} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-[#BE0010]">
                      Selected Webinar
                    </p>
                    <p className="font-maxot text-base leading-snug text-zinc-950 dark:text-zinc-100">
                      {formData.webinarTitle || "Webinar"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-normal text-zinc-500 md:col-span-2 dark:text-zinc-400">
                Contact Details
              </p>
              {contactFields.map(([field, label, type, icon]) => (
                <InputField
                  icon={icon}
                  key={field}
                  label={label}
                  name={field}
                  onChange={handleChange}
                  required
                  type={type}
                  value={formData[field]}
                />
              ))}

              <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-zinc-500 md:col-span-2 dark:text-zinc-400">
                Professional Information
              </p>
              {profileFields.map(([field, label, icon]) => (
                <InputField
                  icon={icon}
                  key={field}
                  label={label}
                  name={field}
                  onChange={handleChange}
                  required
                  value={formData[field]}
                />
              ))}

              <button
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#BE0010] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#BE0010]/15 transition hover:bg-[#E63946] disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? <FiLoader className="size-4 animate-spin" /> : null}
                {isSubmitting ? "Submitting..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
