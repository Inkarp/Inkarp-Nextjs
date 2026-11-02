"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import DnaScrollProgress from "./DnaScrollProgress";

const whatsappNumber = "918125580808";
const phoneNumber = "+918125580808";

export default function FloatingQuickActions() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    let restTimer;

    function updateScrollPercent() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

      setScrollPercent(Math.min(100, Math.max(0, Math.round(progress))));
    }

    // The DNA turns while the page moves and rests shortly after it stops.
    function onScroll() {
      updateScrollPercent();
      setScrolling(true);
      window.clearTimeout(restTimer);
      restTimer = window.setTimeout(() => setScrolling(false), 600);
    }

    updateScrollPercent();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollPercent);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollPercent);
      window.clearTimeout(restTimer);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="fixed right-0 top-2/3 z-50 flex -translate-y-1/2 flex-col items-end gap-3" data-floating-widget>
      <a
        aria-label="Chat with Inkarp on WhatsApp"
        className="group inline-flex h-12 items-center overflow-hidden rounded-full bg-[#25D366] text-parchment shadow-lg shadow-zinc-900/15 transition hover:bg-[#1fb85a]"
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
        className="group inline-flex h-12 items-center overflow-hidden rounded-full border border-rose-200 bg-rose-50 text-rose-700 shadow-lg shadow-zinc-900/15 transition hover:bg-rose-100"
        href={`tel:${phoneNumber}`}
      >
        <span className="inline-flex size-12 items-center justify-center text-xl">
          <FiPhone />
        </span>
        <span className="max-w-0 whitespace-nowrap pr-0 text-sm font-semibold transition-all duration-300 group-hover:max-w-28 group-hover:pr-4">
          Call
        </span>
      </a>

      <DnaScrollProgress onClick={scrollToTop} percent={scrollPercent} spinning={scrolling} />
    </div>
  );
}
