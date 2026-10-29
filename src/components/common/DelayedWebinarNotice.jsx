"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiClock, FiX } from "react-icons/fi";
import { getUpcomingWebinarDate, webinars } from "@/data/webinars";

const SHOW_DELAY_MS = 8000;
// Closes itself after this long; the countdown pauses while the strip is
// hovered or has keyboard focus, and restarts when the visitor leaves it.
const AUTO_CLOSE_MS = 5000;
const LEAVE_MS = 300;
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
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!webinar) return undefined;
    const storageKey = `${STORAGE_PREFIX}${webinar.id}`;
    if (window.sessionStorage.getItem(storageKey) === "dismissed") return undefined;

    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") setVisible(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [webinar]);

  // Closing by hand or by the timer both count as seen for this session.
  const dismiss = useCallback(() => {
    if (!webinar) return;
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${webinar.id}`, "dismissed");
    setLeaving(true);
  }, [webinar]);

  useEffect(() => {
    if (!visible || leaving || paused) return undefined;
    const timer = window.setTimeout(dismiss, AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [visible, leaving, paused, dismiss]);

  useEffect(() => {
    if (!leaving) return undefined;
    const timer = window.setTimeout(() => setVisible(false), LEAVE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  if (!webinar || !visible) return null;

  return (
    // Sits in the Solution Finder button's spot (bottom centre, between the
    // Compare and Dexter corner buttons); that button is hidden while this is
    // open and takes the spot back once it is closed. Below lg the gap is
    // narrow, so the strip uses two rows: the title, then Register and close.
    <aside
      aria-label="Upcoming webinar"
      data-popup-open=""
      data-webinar-notice=""
      className={`fixed inset-x-0 bottom-4 z-40 mx-auto w-[calc(100vw-10.5rem)] animate-[hvc-fade_500ms_ease] transition duration-300 ease-out print:hidden sm:w-[calc(100vw-27rem)] lg:w-[min(760px,calc(100vw-27rem))] ${
        leaving ? "pointer-events-none translate-y-2 opacity-0" : ""
      }`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-cyan-200/25 bg-[#071d25]/95 px-3 py-2 text-white shadow-[0_14px_40px_rgba(7,29,37,.32)] backdrop-blur-xl lg:flex-nowrap lg:gap-3 lg:rounded-full lg:px-4">
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-red" />
        </span>
        <p className="min-w-0 flex-1 basis-[calc(100%-1rem)] truncate text-xs lg:basis-auto lg:text-sm">
          <strong className="text-cyan-200">Live webinar:</strong>{" "}
          <span className="font-semibold">{webinar.title}</span>
          <span className="hidden text-white/65 lg:inline"> · {webinar.date1}</span>
        </p>
        <Link
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-amber-300 transition hover:text-white lg:text-sm"
          href={webinar.sourceLink || "/webinars"}
          onClick={dismiss}
          rel={webinar.sourceLink ? "noopener noreferrer" : undefined}
          target={webinar.sourceLink ? "_blank" : undefined}
        >
          <FiClock aria-hidden="true" className="hidden lg:block" /> Register <FiArrowRight aria-hidden="true" />
        </Link>
        <button
          aria-label="Dismiss webinar notice"
          className="ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white lg:ml-0"
          onClick={dismiss}
          type="button"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
