"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiClock, FiX } from "react-icons/fi";
import { getUpcomingWebinarDate, webinars } from "@/data/webinars";

const SHOW_DELAY_MS = 8000;
const STORAGE_PREFIX = "inkarp-webinar-notice:";

function getNextWebinar() {
  return webinars
    .map((webinar) => ({ webinar, date: getUpcomingWebinarDate(webinar) }))
    .filter(({ date }) => date)
    .sort((a, b) => a.date - b.date)[0]?.webinar ?? null;
}

export default function DelayedWebinarNotice() {
  const webinar = useMemo(() => getNextWebinar(), []);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!webinar) return undefined;
    const storageKey = `${STORAGE_PREFIX}${webinar.id}`;
    if (window.sessionStorage.getItem(storageKey) === "dismissed") return undefined;

    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") setVisible(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [webinar]);

  if (!webinar || !visible) return null;

  const dismiss = () => {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${webinar.id}`, "dismissed");
    setVisible(false);
  };

  return (
    <aside
      aria-label="Upcoming webinar"
      data-popup-open=""
      className="fixed inset-x-3 bottom-20 z-40 mx-auto w-[min(760px,calc(100vw-1.5rem))] animate-[hvc-fade_500ms_ease] print:hidden"
    >
      <div className="flex items-center gap-2 rounded-full border border-cyan-200/25 bg-[#071d25]/95 px-3 py-2 text-white shadow-[0_14px_40px_rgba(7,29,37,.32)] backdrop-blur-xl sm:gap-3 sm:px-4">
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-red" />
        </span>
        <p className="min-w-0 flex-1 truncate text-xs sm:text-sm">
          <strong className="text-cyan-200">Live webinar:</strong>{" "}
          <span className="font-semibold">{webinar.title}</span>
          <span className="hidden text-white/65 md:inline"> · {webinar.date1}</span>
        </p>
        <Link
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-amber-300 transition hover:text-white sm:text-sm"
          href={webinar.sourceLink || "/webinars"}
          onClick={dismiss}
          rel={webinar.sourceLink ? "noopener noreferrer" : undefined}
          target={webinar.sourceLink ? "_blank" : undefined}
        >
          <FiClock aria-hidden="true" className="hidden sm:block" /> Register <FiArrowRight aria-hidden="true" />
        </Link>
        <button
          aria-label="Dismiss webinar notice"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          onClick={dismiss}
          type="button"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
