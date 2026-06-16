"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <section className="relative mx-auto w-[98%] py-10 md:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="relative rounded-lg border border-zinc-200 bg-white p-6 text-center sm:p-8">
          <h3 className="font-maxot mb-1 text-2xl text-[#E63946]">
            Contact Our Team
          </h3>
          <p className="mb-6 text-sm text-zinc-700">
            Fill out the form and our team will get back to you shortly. Fields
            marked * are required.
          </p>

          {status.message ? (
            <div
              className={`mb-6 rounded-lg border p-4 text-sm ${
                status.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 md:flex-row">
              <input
                autoComplete="name"
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="name"
                onChange={handleChange}
                placeholder="Your Name *"
                required
                type="text"
              />
              <input
                autoComplete="email"
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="email"
                onChange={handleChange}
                placeholder="Your Email *"
                required
                type="email"
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <input
                autoComplete="tel"
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="phone"
                onChange={handleChange}
                placeholder="Your Phone *"
                required
                type="tel"
              />
              <input
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="jobTitle"
                onChange={handleChange}
                placeholder="Designation *"
                required
                type="text"
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <input
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="company"
                onChange={handleChange}
                placeholder="Company"
                required
                type="text"
              />
              <input
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="inquiryType"
                onChange={handleChange}
                placeholder="Department *"
                required
                type="text"
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <input
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="city"
                onChange={handleChange}
                placeholder="City"
                required
                type="text"
              />
              <input
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="state"
                onChange={handleChange}
                placeholder="State"
                required
                type="text"
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <input
                className="w-full rounded-full border border-zinc-200 px-5 py-3 focus:ring-2 focus:ring-[#E63946]"
                name="application"
                onChange={handleChange}
                placeholder="Application/Product"
                required
                type="text"
              />
            </div>

            <textarea
              className="h-32 w-full resize-none rounded-lg border border-zinc-200 px-5 py-4 focus:ring-2 focus:ring-[#E63946]"
              name="message"
              onChange={handleChange}
              placeholder="Please elaborate your requirement"
            />

            <button
              className={`mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#BE0010] to-[#E63946] px-6 py-3 text-base font-semibold text-white shadow transition ${
                isSubmitting ? "cursor-not-allowed opacity-80" : "hover:opacity-95"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="-ml-1 mr-2 size-5 animate-spin text-white"
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
                <>Submit <span aria-hidden="true">-&gt;</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
