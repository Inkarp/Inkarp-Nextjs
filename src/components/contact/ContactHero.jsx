"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiFileText, FiMail, FiMapPin, FiPhoneCall, FiTool } from "react-icons/fi";
import ContactForm from "@/components/contact/ContactForm";
import RecTag from "@/components/home/RecTag";
import { branches } from "@/data/branches";
import { QUOTE_DEPARTMENT } from "@/data/contactDirectory";
import { getOfficeStatus, OFFICE_HOURS_LINES } from "@/data/officeHours";
import { gmailComposeHref, siteConfig, whatsappEnquiryHref } from "@/data/siteConfig";
import { pushEvent } from "@/lib/analytics";

const tileClass =
  "group flex min-h-24 flex-col justify-between gap-3 border p-4 text-left outline-none transition duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-red/40 motion-reduce:hover:translate-y-0";
const plainTileClass = `${tileClass} border-line-light bg-white hover:border-red/40`;

// Figures the site already states elsewhere (home page, Our Story, SEO copy).
const TRUST_FIGURES = [
  { value: "1985", label: "Serving labs since" },
  { value: "45+", label: "Global principals" },
  { value: String(branches.length), label: "Branches in India" },
];

function TileText({ title, detail, inverted = false }) {
  return (
    <span className="block">
      <span className={`block text-sm font-semibold ${inverted ? "text-white" : "text-ink"}`}>{title}</span>
      <span className={`mt-0.5 block text-xs ${inverted ? "text-white/80" : "text-ink-soft"}`}>{detail}</span>
    </span>
  );
}

// Worked out in the browser after load: it depends on the current time, so
// rendering it on the server would mismatch on hydration.
function OfficeStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const update = () => setStatus(getOfficeStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!status) return null;

  return (
    <span
      className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        status.open ? "bg-green-50 text-green-700" : "bg-parchment-alt text-ink-soft"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${status.open ? "bg-green-500" : "bg-ink-soft/50"}`}
      />
      {status.label}
    </span>
  );
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <li className="flex items-start gap-4">
      <span className="inline-flex size-11 shrink-0 items-center justify-center bg-parchment-alt text-lg text-red">
        <Icon aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</span>
        <span className="mt-1 block text-sm font-medium leading-snug text-ink">{children}</span>
      </span>
    </li>
  );
}

export default function ContactHero() {
  const [department, setDepartment] = useState("");
  const { contact } = siteConfig;

  const requestQuote = () => {
    setDepartment(QUOTE_DEPARTMENT);
    pushEvent("request_quote_clicked", { source: "contact_page" });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("contact-form")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    document.getElementById("contact-name")?.focus({ preventScroll: true });
  };

  return (
    // data-scroll-skip: first-paint section, so ScrollAnimations must not
    // hide it and fade it back in (that registers as layout shift).
    <section
      className="border-b border-line-light bg-white px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pt-6"
      data-scroll-skip
      id="contact"
    >
      {/* Desktop: intro and details on the left, the form spanning both rows on
          the right. Phones read top to bottom: intro, form, then details. */}
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <RecTag>Contact Inkarp</RecTag>
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Talk to <em className="italic text-red">Inkarp</em>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Quotes, demos, service or spares: tell us what you need and we&apos;ll route it to the right
            sales, service or application specialist.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button className={`${tileClass} border-red bg-red hover:bg-[#a3000e]`} onClick={requestQuote} type="button">
              <FiFileText aria-hidden="true" className="size-5 text-white" />
              <TileText detail="Prices, availability, demos" inverted title="Request a quote" />
            </button>

            <Link
              className={plainTileClass}
              href="/service#service-request"
              onClick={() => pushEvent("service_request_clicked", { source: "contact_page" })}
            >
              <FiTool aria-hidden="true" className="size-5 text-red" />
              <TileText detail="Breakdowns, AMC, installation" title="Book service" />
            </Link>

            <a
              className={plainTileClass}
              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
              onClick={() => pushEvent("phone_clicked", { source: "contact_page" })}
            >
              <FiPhoneCall aria-hidden="true" className="size-5 text-red" />
              <TileText detail={contact.phone} title="Call us" />
            </a>

            <a
              className={plainTileClass}
              href={whatsappEnquiryHref()}
              onClick={() => pushEvent("whatsapp_clicked", { source: "contact_page" })}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaWhatsapp aria-hidden="true" className="size-5 text-[#25D366]" />
              <TileText detail="Send us a message" title="WhatsApp" />
            </a>
          </div>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ContactForm department={department} onDepartmentChange={setDepartment} />
        </div>

        <div className="space-y-8 lg:col-start-1 lg:row-start-2">
          <ul className="space-y-5 border-t border-line-light pt-8">
            <DetailRow icon={FiMail} label="Email">
              <a
                className="transition-colors hover:text-red"
                href={gmailComposeHref(contact.email, "Enquiry for Inkarp Instruments")}
                onClick={() => pushEvent("email_clicked", { source: "contact_page" })}
                rel="noopener noreferrer"
                target="_blank"
              >
                {contact.email}
              </a>
            </DetailRow>
            <DetailRow icon={FiMapPin} label="Head office">
              {/* The verified Google Maps pin for the office, not a name search
                  that can resolve to the wrong place. */}
              <a
                className="transition-colors hover:text-red"
                href={siteConfig.mapPlaceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {contact.address}
              </a>
            </DetailRow>
            <DetailRow icon={FiClock} label="Working hours">
              {OFFICE_HOURS_LINES.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
              <OfficeStatus />
            </DetailRow>
          </ul>

          <dl className="grid grid-cols-3 border border-line-light bg-parchment-alt">
            {TRUST_FIGURES.map(({ value, label }, index) => (
              <div className={`flex flex-col px-3 py-4 text-center ${index ? "border-l border-line-light" : ""}`} key={label}>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{label}</dt>
                <dd className="order-first text-2xl font-semibold text-ink sm:text-3xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
