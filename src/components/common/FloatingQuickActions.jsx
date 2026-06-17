"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUp, FiPhone } from "react-icons/fi";

const whatsappNumber = "918125580808";
const phoneNumber = "+918125580808";

export default function FloatingQuickActions() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    function updateScrollPercent() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

      setScrollPercent(Math.min(100, Math.max(0, Math.round(progress))));
    }

    updateScrollPercent();
    window.addEventListener("scroll", updateScrollPercent, { passive: true });
    window.addEventListener("resize", updateScrollPercent);

    return () => {
      window.removeEventListener("scroll", updateScrollPercent);
      window.removeEventListener("resize", updateScrollPercent);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-3">
      <a
        aria-label="Chat with Inkarp on WhatsApp"
        className="group inline-flex h-12 items-center overflow-hidden rounded-full bg-[#25D366] text-white shadow-lg shadow-zinc-900/15 transition hover:bg-[#1fb85a]"
        href={`https://wa.me/${whatsappNumber}`}
        rel="noreferrer"
        target="_blank"
      >
        <span className="inline-flex size-12 items-center justify-center text-2xl">
          <FaWhatsapp />
        </span>
        <span className="max-w-0 whitespace-nowrap pr-0 text-sm font-semibold transition-all duration-300 group-hover:max-w-36 group-hover:pr-4">
          WhatsApp
        </span>
      </a>

      <a
        aria-label="Call Inkarp"
        className="group inline-flex h-12 items-center overflow-hidden rounded-full bg-zinc-950 text-white shadow-lg shadow-zinc-900/15 transition hover:bg-[#BE0010]"
        href={`tel:${phoneNumber}`}
      >
        <span className="inline-flex size-12 items-center justify-center text-xl">
          <FiPhone />
        </span>
        <span className="max-w-0 whitespace-nowrap pr-0 text-sm font-semibold transition-all duration-300 group-hover:max-w-28 group-hover:pr-4">
          Call
        </span>
      </a>

      <button
        aria-label={`Scroll to top, page scrolled ${scrollPercent}%`}
        className="relative inline-flex size-14 items-center justify-center rounded-full shadow-lg shadow-zinc-900/15"
        onClick={scrollToTop}
        style={{
          background: `conic-gradient(#BE0010 ${scrollPercent * 3.6}deg, #e4e4e7 0deg)`,
        }}
        type="button"
      >
        <span className="flex size-11 flex-col items-center justify-center rounded-full bg-white text-zinc-950 transition hover:text-[#BE0010]">
          <FiArrowUp className="text-base" />
          <span className="text-[10px] font-bold leading-none">
            {scrollPercent}%
          </span>
        </span>
      </button>
    </div>
  );
}
