"use client";

import Image from"next/image";
import { useRouter } from"next/navigation";
import { useState } from"react";
import { FiArrowRight, FiClock, FiMail, FiMapPin, FiPhoneCall } from"react-icons/fi";
import { siteConfig } from"@/data/siteConfig";
import RecTag from"@/components/home/RecTag";
import { collectTracking } from"@/lib/browserTracking";

const inputClass ="min-h-14 w-full border border-line-light bg-parchment-alt px-5 text-sm font-medium text-ink outline-none transition-colors duration-200 placeholder:text-ink-soft/70 focus:border-red/40 focus:bg-white focus:ring-2 focus:ring-red/15";

function getInitialFormData() {
  return {
    name:"",
    email:"",
    phone:"",
    jobTitle:"",
    company:"",
    city:"",
    state:"",
    inquiryType:"",
    isExistingCustomer:"",
    purchaseTimeline:"",
    application:"",
    message:"",
  };
}

export default function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(getInitialFormData);
  const [status, setStatus] = useState({ type:"", message:"" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contact } = siteConfig;

  const contactItems = [
    {
      label:"Have any question?",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s+/g,"")}`,
      icon: FiPhoneCall,
    },
    {
      label:"Send email",
      value: contact.email,
      // Gmail compose rather than mailto: — mailto hands off to whatever
      // desktop mail app Windows has registered and does nothing at all when
      // none is set, which is the common case for people living in webmail.
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        contact.email
      )}&su=${encodeURIComponent("Enquiry for Inkarp Instruments")}`,
      icon: FiMail,
    },
    {
      label:"Head office",
      value: contact.address,
      // The verified Google Maps pin for the office, not a name search that
      // can resolve to the wrong place.
      href: siteConfig.mapPlaceUrl,
      icon: FiMapPin,
    },
    {
      label:"Working days",
      value: ["Mon-Fri · 09:30am - 05:30pm","1st & 3rd Sat · 09:30am - 01:30pm","2nd & 4th Sat · Holiday",
      ],
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
    setStatus({ type:"", message:"" });

    try {
      const response = await fetch("/api/forms", {
        body: JSON.stringify({ formType:"contact", ...formData, ...collectTracking() }),
        headers: {"Content-Type":"application/json",
        },
        method:"POST",
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setStatus({
          type:"success",
          message:"Thank you for contacting us. Redirecting...",
        });
        setFormData(getInitialFormData());
        event.target.reset();
        window.setTimeout(() => router.push("/thank-you?type=contact"), 200);
      } else {
        setStatus({
          type:"error",
          message:
            data?.message ||"An error occurred while sending your message",
        });
      }
    } catch {
      setStatus({
        type:"error",
        message:"An error occurred while sending your message",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-b border-line-light bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.86fr_1.34fr] lg:items-stretch">
        {/* Contact details */}
        <aside className="flex flex-col border border-line-light bg-white p-7 sm:p-8">
          <div className="space-y-6">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const isMultiline = Array.isArray(item.value);
              const content = (
                <>
                  <span className="inline-flex size-12 shrink-0 items-center justify-center bg-parchment-alt text-xl text-red">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      {item.label}
                    </span>
                    {isMultiline ? (
                      <span className="mt-1 block space-y-0.5 text-sm font-medium leading-snug text-ink">
                        {item.value.map((line) => (
                          <span className="block" key={line}>
                            {line}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="mt-1 block text-sm font-semibold leading-snug text-ink">
                        {item.value}
                      </span>
                    )}
                  </span>
                </>
              );

              return item.href ? (
                <a
                  className="group flex items-start gap-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red/40 [&_span]:transition-colors hover:border-red/35[&_.contact-value]:text-red"
                  href={item.href}
                  key={item.label}
                  rel={item.href.startsWith("http") ?"noopener noreferrer" : undefined}
                  target={item.href.startsWith("http") ?"_blank" : undefined}
                >
                  {content}
                </a>
              ) : (
                <div className="flex items-start gap-4" key={item.label}>
                  {content}
                </div>
              );
            })}
          </div>

          <div className="relative mt-8 min-h-64 flex-1 overflow-hidden border border-line-light sm:min-h-72">
            <Image
              alt="Inkarp Instruments head office building in Hyderabad"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              src="/assets/our-story/InkarpBuilding.jpg"
            />
          </div>
        </aside>

        {/* Form */}
        <div className="py-2 lg:py-4">
          <div className="mb-9">
            <RecTag>Contact with us</RecTag>
            {/* Section-level heading, so h2 rather than h3 — it is not nested
                under any h2 on the page. */}
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Feel free to write us anytime
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Share your requirement and our team will route it to the right
              sales, service, or application specialist.
            </p>
          </div>

          {status.message ? (
            <div
              role="status"
              className={`mb-5 border px-4 py-3 text-sm ${
                status.type ==="success"
                  ?"border-green-200 bg-green-50 text-green-700"
                  :"border-red/20 bg-red/5 text-red"
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
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

            <div className="grid gap-4 md:grid-cols-2">
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

            <div className="grid gap-4 md:grid-cols-2">
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

            <div className="grid gap-4 md:grid-cols-2">
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
              className={`${inputClass} min-h-48 resize-y py-4`}
              name="message"
              onChange={handleChange}
              placeholder="Write a message"
            />

            <button
              className={`inline-flex h-13 w-full items-center justify-center gap-2 bg-red px-8 py-3.5 text-sm font-semibold text-parchment transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red/40 sm:w-fit ${
                isSubmitting
                  ?"cursor-not-allowed opacity-70"
                  :"hover:bg-transparent hover:text-red"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="size-5 animate-spin text-parchment motion-reduce:hidden"
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
