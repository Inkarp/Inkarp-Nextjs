"use client";

import { useEffect } from"react";
import { FiPhone, FiRefreshCw } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineErrorOutline } from"react-icons/md";
import DexterFigure from "@/components/dexter/DexterFigure";
import { DEXTER_PLACES } from "@/data/dexter";
import { siteConfig, whatsappEnquiryHref } from "@/data/siteConfig";

const outline = "inline-flex items-center gap-2 border border-line-light bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-red hover:text-red";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (DEXTER_PLACES.errorPage) {
    const phone = siteConfig.contact.phone;
    return (
      <main className="bg-white px-4 py-14 text-ink sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-[1000px] items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14">
          <div className="flex justify-center rounded-sm bg-parchment-alt px-8 pt-8 md:px-10">
            <DexterFigure decorative height={300} mood="worried" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red">Something went wrong</p>
            <h1 className="mt-3 text-[34px] leading-[1.08] text-ink sm:text-[44px]">That didn&apos;t load properly.</h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
              The page had a problem while loading. Try again, or reach a person straight away.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <button className="inline-flex items-center gap-2 bg-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a3000e]" onClick={reset} type="button">
                <FiRefreshCw aria-hidden="true" /> Try again
              </button>
              <a className={outline} href={`tel:${phone.replace(/\s/g, "")}`}>
                <FiPhone aria-hidden="true" /> {phone}
              </a>
              <a className={outline} href={whatsappEnquiryHref("")} rel="noopener noreferrer" target="_blank">
                <FaWhatsapp aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-6 text-ink">
      <div className="max-w-md border border-line-light bg-white p-8">
        <MdOutlineErrorOutline className="mb-4 text-4xl text-red" />
        <h1 className="text-2xl font-semibold text-ink">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          The page had a problem while loading. You can try again from here.
        </p>
        <button
          className="mt-6 border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
