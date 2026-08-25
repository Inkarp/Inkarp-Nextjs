"use client";

import Image from "next/image";
import { useEffect } from "react";
import { FiDownload, FiX } from "react-icons/fi";
import { siteConfig } from "@/data/siteConfig";

const DATE_FORMAT = { day: "2-digit", month: "short", year: "numeric" };

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-[12px] leading-5">
      <span className="w-[104px] shrink-0 text-[#6b6b6b]">{label}</span>
      <span className="font-medium text-[#1a1a1a]">{value}</span>
    </div>
  );
}

/**
 * The printable record of a quote request. Deliberately titled "Request for
 * Quotation" rather than "Quotation": the catalogue carries no pricing, so this
 * documents what the buyer asked for and the reference Inkarp will price
 * against. Printing is handled by the browser's own PDF writer, which keeps
 * fonts and the logo crisp without pulling in a PDF library.
 */
export default function QuoteDocument({ buyer, items = [], onClose, reference }) {
  const { address, email, phone } = siteConfig.contact;
  const raisedOn = new Date().toLocaleDateString("en-IN", DATE_FORMAT);

  // Scopes the print stylesheet to this overlay, so printing any other page of
  // the site is unaffected.
  useEffect(() => {
    document.body.classList.add("quote-printing");
    return () => document.body.classList.remove("quote-printing");
  }, []);
  const contactName = [buyer?.firstName, buyer?.lastName].filter(Boolean).join(" ");

  return (
    <div className="quote-print-root fixed inset-0 z-[70] overflow-y-auto bg-ink/60 px-3 py-6 print:static print:overflow-visible print:bg-white print:p-0">
      {/* Screen-only controls; the print stylesheet drops them from the page. */}
      <div className="mx-auto mb-4 flex max-w-[820px] items-center justify-between gap-3 print:hidden">
        <button
          className="inline-flex items-center gap-2 border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          onClick={onClose}
          type="button"
        >
          <FiX aria-hidden /> Close
        </button>
        <button
          className="inline-flex items-center gap-2 border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          onClick={() => window.print()}
          type="button"
        >
          <FiDownload aria-hidden /> Download PDF
        </button>
      </div>

      <article
        className="quote-doc mx-auto w-full max-w-[820px] bg-white px-8 py-9 text-[#1a1a1a] shadow-2xl print:max-w-none print:px-0 print:py-0 print:shadow-none"
        id="quote-document"
      >
        {/* Letterhead */}
        <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-[#d5d5d5] pb-5">
          <div>
            <Image
              alt="Inkarp Instruments"
              className="h-11 w-auto"
              height={44}
              priority
              src="/InkarpLogo.svg"
              width={150}
            />
            <p className="mt-3 max-w-[300px] text-[11px] leading-[18px] text-[#6b6b6b]">{address}</p>
          </div>
          <div className="text-right text-[11px] leading-[18px] text-[#6b6b6b]">
            <p className="text-[15px] font-bold uppercase tracking-[0.12em] text-[#be0010]">
              Request for Quotation
            </p>
            <p className="mt-2">
              <span className="text-[#6b6b6b]">Reference</span>{" "}
              <span className="font-semibold text-[#1a1a1a]">{reference ?? "—"}</span>
            </p>
            <p>
              <span className="text-[#6b6b6b]">Date</span>{" "}
              <span className="font-semibold text-[#1a1a1a]">{raisedOn}</span>
            </p>
            <p className="mt-2">{phone}</p>
            <p>{email}</p>
          </div>
        </header>

        {/* Who it is from and what it covers */}
        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#be0010]">
              Enquiry raised by
            </h2>
            <div className="space-y-1">
              <Field label="Name" value={contactName} />
              <Field label="Designation" value={buyer?.designation} />
              <Field label="Department" value={buyer?.department} />
              <Field label="Organisation" value={buyer?.companyName} />
              <Field label="Industry" value={buyer?.industry} />
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#be0010]">
              Contact details
            </h2>
            <div className="space-y-1">
              <Field label="Email" value={buyer?.email} />
              <Field label="Phone" value={buyer?.contact} />
              <Field label="City" value={buyer?.city} />
              <Field label="State" value={buyer?.state} />
              <Field label="Items" value={`${items.length} product${items.length === 1 ? "" : "s"}`} />
            </div>
          </div>
        </section>

        {/* Line items */}
        <section className="mt-7">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#be0010]">
            Products requested
          </h2>
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#f5f5f5] text-left text-[10px] uppercase tracking-[0.1em] text-[#6b6b6b]">
                <th className="border border-[#d5d5d5] px-2 py-2 font-bold">#</th>
                <th className="border border-[#d5d5d5] px-3 py-2 font-bold">Product</th>
                <th className="border border-[#d5d5d5] px-3 py-2 font-bold">Brand</th>
                <th className="border border-[#d5d5d5] px-3 py-2 font-bold">Origin</th>
                <th className="border border-[#d5d5d5] px-3 py-2 text-right font-bold">Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.slug ?? index}>
                  <td className="border border-[#d5d5d5] px-2 py-2 text-center align-top text-[#6b6b6b]">
                    {index + 1}
                  </td>
                  <td className="border border-[#d5d5d5] px-3 py-2 align-top">
                    <span className="font-semibold text-[#1a1a1a]">{item.name}</span>
                    <span className="mt-0.5 block text-[10px] text-[#6b6b6b]">
                      inkarp.co.in/products/{item.slug}
                    </span>
                  </td>
                  <td className="border border-[#d5d5d5] px-3 py-2 align-top">
                    {item.principalName || "—"}
                  </td>
                  <td className="border border-[#d5d5d5] px-3 py-2 align-top">
                    {item.countryOfOrigin || "—"}
                  </td>
                  <td className="border border-[#d5d5d5] px-3 py-2 text-right align-top">1</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-3 border-l-[3px] border-[#be0010] bg-[#f5f5f5] px-3 py-2 text-[11px] leading-[18px] text-[#6b6b6b]">
            Pricing, taxes, lead time and warranty are confirmed by Inkarp against this reference.
            This document records the products enquired about — it is not a priced quotation.
          </p>
        </section>

        {/* What happens next */}
        <section className="mt-6">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#be0010]">
            What happens next
          </h2>
          <ol className="ml-4 list-decimal space-y-1 text-[11px] leading-[18px] text-[#6b6b6b]">
            <li>An Inkarp specialist reviews the requirement against the application.</li>
            <li>A priced quotation follows with configuration, accessories and delivery.</li>
            <li>Demonstration, installation, training and AMC are arranged on confirmation.</li>
          </ol>
        </section>

        <footer className="mt-8 border-t border-[#d5d5d5] pt-3 text-[10px] leading-[16px] text-[#6b6b6b]">
          <p className="font-semibold text-[#1a1a1a]">
            Inkarp Instruments Private Limited — authorized distributor and service provider in India
          </p>
          <p className="mt-0.5">
            {phone} · {email} · inkarp.co.in
          </p>
          <p className="mt-1">
            Generated from inkarp.co.in on {raisedOn}. Quote reference {reference ?? "—"}.
          </p>
        </footer>
      </article>
    </div>
  );
}
