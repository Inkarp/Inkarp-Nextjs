"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUp, FiMoon, FiPhone, FiSun } from "react-icons/fi";
import { useTheme } from "@/components/common/ThemeProvider";

const whatsappNumber = "918125580808";
const phoneNumber = "+918125580808";

export default function FloatingQuickActions() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const showThemeToggle = pathname?.startsWith("/products/");

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
    <div className="fixed right-0 top-2/3 z-50 flex -translate-y-1/2 flex-col items-end gap-3">
      {showThemeToggle ? (
        <button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="inline-flex size-12 items-center justify-center rounded-full bg-zinc-950 text-lg text-white shadow-lg shadow-zinc-900/15 transition hover:bg-[#BE0010] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-[#BE0010] dark:hover:text-white"
          onClick={toggleTheme}
          type="button"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
      ) : null}

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
        <span className="flex size-11 flex-col items-center justify-center rounded-full bg-white text-zinc-950 transition hover:text-[#BE0010] dark:bg-zinc-900 dark:text-zinc-100">
          <FiArrowUp className="text-base" />
          <span className="text-[10px] font-bold leading-none">
            {scrollPercent}%
          </span>
        </span>
      </button>
    </div>
  );
}
