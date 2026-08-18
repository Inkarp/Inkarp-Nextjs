"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUp, FiMoon, FiPhone, FiSun } from "react-icons/fi";
import { useTheme } from "@/components/common/ThemeProvider";

const whatsappNumber = "918125580808";
const phoneNumber = "+918125580808";

export default function FloatingQuickActions() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const showThemeToggle = pathname === "/products" || pathname?.startsWith("/products/");
  const [showThemeTip, setShowThemeTip] = useState(false);
  const hideTipTimeout = useRef(null);

  useEffect(() => {
    if (!showThemeToggle || theme === "dark") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setShowThemeTip(true);
      hideTipTimeout.current = window.setTimeout(() => setShowThemeTip(false), 4000);
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
      if (hideTipTimeout.current) window.clearTimeout(hideTipTimeout.current);
      setShowThemeTip(false);
    };
  }, [showThemeToggle, theme]);

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
      {/* Dark mode toggle for product pages is intentionally disabled. */}
      {false ? (
        <div className="relative">
          {showThemeTip ? (
            <div
              className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-parchment shadow-lg animate-[hvc-fade_300ms_ease] dark:bg-zinc-800"
              role="status"
            >
              Try dark mode
              <span className="absolute -right-2 top-1/2 h-0 w-0 -translate-y-1/2 border-y-8 border-l-8 border-y-transparent border-l-navy dark:border-l-zinc-800" />
            </div>
          ) : null}

          <button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
            type="button"
          >
          <span
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              theme === "dark" ? "bg-red" : "bg-black"
            }`}
          >
            <span
              className={`inline-flex size-5 items-center justify-center rounded-full bg-white text-[10px] shadow transition-transform ${
                theme === "dark" ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            >
              {theme === "dark" ? (
                <FiMoon className="text-zinc-900" />
              ) : (
                <FiSun className="text-amber-500" />
              )}
            </span>
          </span>
          {/* <span className="text-xs font-semibold whitespace-nowrap">
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </span> */}
          </button>
        </div>
      ) : null}

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

      <button
        aria-label={`Scroll to top, page scrolled ${scrollPercent}%`}
        className="relative inline-flex size-14 items-center justify-center rounded-full shadow-lg shadow-zinc-900/15"
        onClick={scrollToTop}
        style={{
          background: `conic-gradient(#BE0010 ${scrollPercent * 3.6}deg, #e4e4e7 0deg)`,
        }}
        type="button"
      >
        <span className="flex size-11 flex-col items-center justify-center rounded-full bg-parchment text-zinc-950 transition hover:text-red dark:bg-zinc-900 dark:text-zinc-100">
          <FiArrowUp className="text-base" />
          <span className="text-[10px] font-bold leading-none">
            {scrollPercent}%
          </span>
        </span>
      </button>
    </div>
  );
}
