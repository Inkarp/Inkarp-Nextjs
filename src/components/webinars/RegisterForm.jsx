"use client";

import { useEffect, useMemo, useRef, useState } from"react";
import { useRouter } from"next/navigation";
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
} from"react-icons/fi";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

function getMetaInfo() {
  if (typeof window ==="undefined") {
    return { pageUrl:"", referrer:"", searchKeyword:"" };
  }

  const pageUrl = window.location.href;
  const referrer = document.referrer ||"";
  let searchKeyword ="";

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

function InputField({ name, label, value, onChange, required = false, type ="text", icon: Icon }) {
  return (
    <div className="group relative">
      {Icon ? (
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft transition group-focus-within:text-red" />
      ) : null}
      <input
        className={`peer w-full border border-line-light bg-parchment pb-2 pt-5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-transparent hover:border-red/35 focus:border-red focus:ring-2 focus:ring-red/15 ${
          Icon ?"pl-11 pr-4" :"px-4"
        }`}
        name={name}
        onChange={onChange}
        placeholder=""
        required={required}
        type={type}
        value={value}
      />
      <label
        className={`absolute top-2 text-xs text-ink-soft transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-ink-soft peer-focus:top-2 peer-focus:text-xs peer-focus:text-red ${
          Icon ?"left-11" :"left-4"
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
      return"";
    }
    const eventDate = new Date(preselected.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today ? preselected.title :"";
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
    ...getMetaInfo(),
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type:"", message:"" });

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKey = (event) => {
      if (event.key ==="Escape") {
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
        body: JSON.stringify({ formType:"webinar", ...formData }),
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
    ["name","Your Name","text", FiUser],
    ["email","Email Address","email", FiMail],
    ["contact","Phone Number","tel", FiPhone],
    ["companyName","Company Name","text", FiBriefcase],
  ];

  const profileFields = [
    ["department","Department", FiUsers],
    ["designation","Designation", FiBriefcase],
    ["city","City", FiMapPin],
    ["state","State", FiMapPin],
    ["country","Country", FiGlobe],
  ];

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#0F2A33]/70 backdrop-blur-md"
      onClick={handleBackdropClick}
      ref={backdropRef}
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-5">
        <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden border border-white/60 bg-parchment">
          <div className="relative overflow-hidden border-b border-line-light bg-parchment-alt px-5 py-5 sm:px-7">
            <div className="absolute inset-x-0 top-0 h-1 bg-red" />
            <button
              aria-label="Close registration form"
              className="absolute right-4 top-4 grid size-9 place-items-center border border-line-light bg-parchment text-ink-soft transition hover:border-red hover:text-red"
              onClick={onClose}
              type="button"
            >
              <FiX size={20} />
            </button>

            <div className="pr-11">
              <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-red">
                Reserve Your Seat
              </p>
              <h2 className="text-2xl leading-tight text-ink-soft sm:text-3xl">
                Webinar Registration
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
                Share a few details and our team will send the joining information to your inbox.
              </p>
            </div>
          </div>

          {status.message ? (
            <div
              className={`mx-5 mt-4 flex items-start gap-3 border px-4 py-3 text-sm sm:mx-7 ${
                status.type ==="success"
                  ?"border-green-200 bg-green-50 text-green-800"
                  :"border-red/20 bg-red/5 text-red"
              }`}
            >
              {status.type ==="success" ? (
                <FiCheckCircle className="mt-0.5 size-4 shrink-0" />
              ) : null}
              {status.message}
            </div>
          ) : null}

          <div className="flex-1 overflow-y-auto bg-parchment">
            <form
              className="grid grid-cols-1 gap-4 px-5 py-5 sm:px-7 md:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <div className="border border-red/15 bg-red/5 px-4 py-4 md:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center bg-parchment text-red">
                    <FiCalendar size={18} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-red">
                      Selected Webinar
                    </p>
                    <p className="text-base leading-snug text-ink-soft">
                      {formData.webinarTitle ||"Webinar"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-normal text-ink-soft md:col-span-2">
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

              <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-ink-soft md:col-span-2">
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
                className="mt-2 inline-flex items-center justify-center gap-2 bg-red px-5 py-3 text-sm font-semibold text-parchment transition hover:bg-red disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? <FiLoader className="size-4 animate-spin" /> : null}
                {isSubmitting ?"Submitting..." :"Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
