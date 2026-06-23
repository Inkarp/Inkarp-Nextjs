"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiArrowRight, FiClock, FiMail, FiMapPin, FiPhoneCall } from "react-icons/fi";
import { siteConfig } from "@/data/siteConfig";

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

const inputClass =
  "min-h-14 w-full rounded-md border border-transparent bg-zinc-100 px-5 text-sm font-semibold text-zinc-700 outline-none transition placeholder:text-zinc-500 focus:border-[#BE0010]/40 focus:bg-white focus:ring-4 focus:ring-[#BE0010]/10";

function getMetaInfo() {
  if (typeof window === "undefined") {
    return {
      pageUrl: "",
      referrer: "",
      searchKeyword: "",
    };
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

  return {
    pageUrl,
    referrer,
    searchKeyword,
  };
}

function getInitialFormData() {
  return {
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    company: "",
    city: "",
    state: "",
    inquiryType: "",
    isExistingCustomer: "",
    purchaseTimeline: "",
    application: "",
    message: "",
    ...getMetaInfo(),
  };
}

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(getInitialFormData);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contact, socials } = siteConfig;

  const contactItems = [
    {
      label: "Have any question?",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s+/g, "")}`,
      icon: FiPhoneCall,
    },
    {
      label: "Send email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: FiMail,
    },
    {
      label: "Visit anytime",
      value: contact.addressNav,
      href: "https://maps.google.com/?q=Inkarp%20Instruments%20Hyderabad",
      icon: FiMapPin,
    },
    {
      label: "Working hours",
      value: "Mon-Fri, 09:30am - 05:30pm",
      icon: FiClock,
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        "https://inkarppersonal.vercel.app/api/contact/submit",
        {
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus({
          type: "success",
          message: "Message sent successfully! Redirecting...",
        });
        setFormData(getInitialFormData());
        event.target.reset();
        window.setTimeout(() => router.push("/thank-you"), 200);
      } else {
        setStatus({
          type: "error",
          message:
            data?.message || "An error occurred while sending your message",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "An error occurred while sending your message",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.34fr] lg:items-stretch">
        <aside className="relative overflow-hidden rounded-md bg-[#BE0010] p-8 text-white shadow-[0_22px_70px_rgba(190,0,16,0.22)] sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-white/30" />
          <div className="space-y-7">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl text-white ring-1 ring-white/20">
                    <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white/80">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-lg font-bold leading-snug text-white">
                      {item.value}
                    </span>
                  </span>
                </>
              );

              return item.href ? (
                <a
                  className="flex items-center gap-5 transition hover:translate-x-1"
                  href={item.href}
                  key={item.label}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                >
                  {content}
                </a>
              ) : (
                <div className="flex items-center gap-5" key={item.label}>
                  {content}
                </div>
              );
            })}
          </div>

          <div className="relative mt-10 h-72 overflow-hidden rounded-md border border-white/20 bg-white/10 sm:h-80">
            <Image
              alt="Laboratory instrument support from Inkarp"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              src="/assets/images/productImages/Bruker/hyperion-FTIR-microscope.jpeg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5f0008]/50 via-transparent to-transparent" />
          </div>

          <div className="relative mx-auto -mt-9 flex w-[min(15.5rem,90%)] items-center justify-center gap-3 rounded-md bg-white px-5 py-4 text-zinc-950 shadow-xl">
            {Object.entries(socials).map(([name, href]) => {
              const Icon = socialIcons[name];
              return Icon ? (
                <a
                  aria-label={name}
                  className="inline-flex size-9 items-center justify-center rounded-md text-sm transition hover:bg-[#BE0010] hover:text-white"
                  href={href}
                  key={name}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden="true" />
                </a>
              ) : null;
            })}
          </div>
        </aside>

        <div className="py-2 lg:py-4">
          <div className="mb-9">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[#BE0010]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#BE0010]">
                Contact with us
              </span>
            </div>
            <h3 className="font-maxot text-2xl leading-tight text-zinc-950 sm:text-xl">
              Feel free to write us anytime
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
              Share your requirement and our team will route it to the right sales,
              service, or application specialist.
            </p>
          </div>

          {status.message ? (
            <div
              className={` rounded-md border p-2 text-sm ${
                status.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <input
                autoComplete="name"
                className={inputClass}
                name="name"
                onChange={handleChange}
                placeholder="Your name *"
                required
                type="text"
              />
              <input
                autoComplete="email"
                className={inputClass}
                name="email"
                onChange={handleChange}
                placeholder="Email address *"
                required
                type="email"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                autoComplete="tel"
                className={inputClass}
                name="phone"
                onChange={handleChange}
                placeholder="Phone *"
                required
                type="tel"
              />
              <input
                className={inputClass}
                name="inquiryType"
                onChange={handleChange}
                placeholder="Subject / department *"
                required
                type="text"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                className={inputClass}
                name="jobTitle"
                onChange={handleChange}
                placeholder="Designation *"
                required
                type="text"
              />
              <input
                className={inputClass}
                name="company"
                onChange={handleChange}
                placeholder="Company *"
                required
                type="text"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                className={inputClass}
                name="city"
                onChange={handleChange}
                placeholder="City *"
                required
                type="text"
              />
              <input
                className={inputClass}
                name="state"
                onChange={handleChange}
                placeholder="State *"
                required
                type="text"
              />
            </div>

            <input
              className={inputClass}
              name="application"
              onChange={handleChange}
              placeholder="Application / product *"
              required
              type="text"
            />

            <textarea
              className={`${inputClass} min-h-60 resize-y py-5`}
              name="message"
              onChange={handleChange}
              placeholder="Write a message"
            />

            <button
              className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[#BE0010] px-7 text-sm font-bold text-white shadow-[0_16px_36px_rgba(190,0,16,0.22)] transition sm:w-fit ${
                isSubmitting ? "cursor-not-allowed opacity-80" : "hover:bg-[#9f000d]"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="size-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  Sending...
                </>
              ) : (
                <>
                  Send a message
                  <FiArrowRight aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
