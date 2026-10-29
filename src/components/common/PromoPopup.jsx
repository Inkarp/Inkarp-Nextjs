"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import styles from "./PromoPopup.module.css";

// The pill slides up as the flask disc alone, then opens out to the prompt.
const EXPAND_DELAY_MS = 450;

function getPopupConfig(pathname) {
  if (pathname === "/products") {
    return {
      id: "products-quote",
      threshold: 14,
      href: "/contact?interest=quote",
    };
  }

  if (pathname.startsWith("/products/")) {
    return {
      id: "product-detail-interest",
      threshold: 15,
      href: `/contact?interest=quote&product=${encodeURIComponent(pathname.split("/").pop() ?? "")}`,
    };
  }

  return null;
}

function FlaskMark() {
  const clipId = useId();

  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <defs>
        <clipPath id={clipId}>
          <path d="M10 8.2 5.2 17.4A2 2 0 0 0 7 20.4h10a2 2 0 0 0 1.8-3L14 8.2Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect className={styles.liquid} fill="#fff" fillOpacity="0.9" height="8" width="16" x="4" y="13.2" />
      </g>
      <circle className={styles.bubble} cx="11" cy="15.6" fill="#fff" r="0.9" />
      <circle className={styles.bubble} cx="13.4" cy="16.8" fill="#fff" r="0.7" />
      <path
        d="M9 3h6M10 3v5.2L5.2 17.4A2 2 0 0 0 7 20.4h10a2 2 0 0 0 1.8-3L14 8.2V3"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function PromoPopup() {
  const pathname = usePathname();
  const config = useMemo(() => getPopupConfig(pathname), [pathname]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  // Detailed product pages carry their own enquiry form (#booking): the pill
  // leads there instead of the Contact page and steps aside once it is reached.
  const [hasBooking, setHasBooking] = useState(false);
  const [atBooking, setAtBooking] = useState(false);
  const isShown = isVisible && !atBooking;

  useEffect(() => {
    setIsVisible(false);
    setIsExpanded(false);
    setIsDismissed(false);
    setHasBooking(false);
    setAtBooking(false);

    if (!config) {
      return;
    }

    const storageKey = `inkarp-bottom-popup:${config.id}`;
    const dismissed = window.sessionStorage.getItem(storageKey) === "dismissed";

    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    function updateVisibility() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 100;

      if (progress >= config.threshold) {
        setIsVisible(true);
      }

      const booking = document.getElementById("booking");
      setHasBooking(Boolean(booking));
      setAtBooking(Boolean(booking && booking.getBoundingClientRect().top < window.innerHeight - 120));
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [config]);

  useEffect(() => {
    if (!isVisible) return undefined;
    const timer = window.setTimeout(() => setIsExpanded(true), EXPAND_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isVisible]);

  if (!config || isDismissed) {
    return null;
  }

  function closePopup() {
    window.sessionStorage.setItem(
      `inkarp-bottom-popup:${config.id}`,
      "dismissed"
    );
    setIsDismissed(true);
  }

  function handleClick(event) {
    if (hasBooking) {
      event.preventDefault();
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closePopup();
  }

  return (
    // Shares the bottom-centre spot with the Solution Finder pill and the
    // webinar strip; both step aside while this is up (globals.css).
    <div
      data-floating-widget
      data-popup-open={isShown ? "" : undefined}
      data-bottom-banner={isShown ? "" : undefined}
      className={`${styles.dock} pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center transition duration-500 ease-out print:hidden sm:bottom-6 ${
        isShown ? "translate-y-0 opacity-100" : "translate-y-[160%] opacity-0"
      }`}
      inert={!isShown}
    >
      <div className="relative">
        <Link
          className={`${styles.pill} ${isExpanded ? styles.expanded : ""} pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-full border border-line-light bg-white p-1.5 shadow-[0_14px_36px_rgba(15,23,42,0.18)] hover:shadow-[0_16px_40px_rgba(190,0,16,0.22)]`}
          href={hasBooking ? "#booking" : config.href}
          onClick={handleClick}
        >
          <span className={`${styles.disc} relative inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-red text-red`}>
            <FlaskMark />
          </span>
          <span className={`${styles.text} flex flex-col whitespace-nowrap leading-tight`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-red">Need pricing?</span>
            <span className="mt-0.5 text-sm font-semibold text-ink">Request a quote</span>
          </span>
          <span className={`${styles.arrow} ml-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-white`}>
            <FiArrowRight aria-hidden="true" />
          </span>
        </Link>

        <button
          aria-label="Close quote prompt"
          className={`${styles.close} pointer-events-auto absolute -right-1.5 -top-1.5 inline-flex size-6 items-center justify-center rounded-full border border-line-light bg-white text-xs text-ink-soft shadow-sm hover:text-red`}
          onClick={closePopup}
          type="button"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
