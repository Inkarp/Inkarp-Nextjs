"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiBell, FiClock, FiFileText, FiX } from "react-icons/fi";
import useRecentlyViewed from "@/components/products/useRecentlyViewed";
import { getPulseUpdates } from "@/data/updates";
import { getLastSeenPulse, markPulseSeen } from "@/lib/pulseSeen";

const TYPE_LABEL = { blog: "Blog", webinar: "Webinar", magazine: "CatalystCue" };

const TAB_CLASS =
  "relative inline-flex size-10 items-center justify-center border border-line-light bg-white text-ink shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 hover:border-red/40 hover:text-red";

function relativeLabel(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const diffDays = Math.round((date - Date.now()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays > 0) return diffDays === 1 ? "Tomorrow" : `In ${diffDays}d`;
  const pastDays = -diffDays;
  if (pastDays < 30) return `${pastDays}d ago`;
  return `${Math.round(pastDays / 30)}mo ago`;
}

// Read the visitor-specific seen state after hydration because this component
// can render inside the server-rendered header.
// initializer below rather than an effect — there's no SSR pass to mismatch.
function computeInitialPulse() {
  const items = getPulseUpdates();
  const lastSeen = Date.parse(getLastSeenPulse() ?? "") || 0;
  return { updates: items, unseenCount: items.filter((item) => Date.parse(item.date) > lastSeen).length };
}

export default function RailUtilityDock({ placement = "rail" }) {
  const [open, setOpen] = useState(null);
  const [{ updates, unseenCount }, setPulse] = useState(() => ({ updates: getPulseUpdates(), unseenCount: 0 }));
  const recentlyViewed = useRecentlyViewed();
  const dockRef = useRef(null);

  useEffect(() => {
    setPulse(computeInitialPulse());
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (dockRef.current && !dockRef.current.contains(event.target)) setOpen(null);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function togglePulse() {
    const opening = open !== "pulse";
    setOpen(opening ? "pulse" : null);
    if (opening) {
      markPulseSeen(new Date().toISOString());
      setPulse((current) => ({ ...current, unseenCount: 0 }));
    }
  }

  const isHeader = placement === "header";

  return (
    <div
      className={`pointer-events-auto relative flex items-center gap-2.5 ${isHeader ? "flex-row" : "flex-col"}`}
      ref={dockRef}
    >
      <button
        aria-label={`What's new${unseenCount ? `, ${unseenCount} unseen` : ""}`}
        className={`${TAB_CLASS} ${unseenCount > 0 ? "motion-safe:animate-pulse border-red/50 text-red" : ""}`}
        onClick={togglePulse}
        type="button"
      >
        <FiBell aria-hidden="true" />
        {unseenCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center bg-red px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        ) : null}
      </button>

      {recentlyViewed.length > 0 ? (
        <button
          aria-label="Recently viewed products"
          className={TAB_CLASS}
          onClick={() => setOpen((current) => (current === "recent" ? null : "recent"))}
          type="button"
        >
          <FiClock aria-hidden="true" />
        </button>
      ) : null}

      {open ? (
        <div
          className={`absolute max-h-[min(64vh,480px)] w-[min(320px,calc(100vw-32px))] overflow-y-auto border border-line-light bg-white shadow-2xl shadow-zinc-900/20 animate-[hvc-fade_200ms_ease] ${
            isHeader ? "right-0 top-[calc(100%+12px)]" : "left-[calc(100%+10px)] top-0"
          }`}
          role="dialog"
        >
          <div className="sticky top-0 flex items-center justify-between gap-2 border-b border-line-light bg-white px-3.5 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-ink">
              {open === "pulse" ? "What's new" : "Recently viewed"}
            </p>
            <button aria-label="Close" className="text-ink-soft transition hover:text-red" onClick={() => setOpen(null)} type="button">
              <FiX />
            </button>
          </div>

          {open === "pulse" ? (
            <ul className="divide-y divide-line-light">
              {updates.length === 0 ? (
                <li className="px-3.5 py-6 text-center text-xs text-ink-soft">Nothing new right now.</li>
              ) : null}
              {updates.map((item) => (
                <li key={item.id}>
                  <Link
                    className="flex items-start gap-2.5 px-3.5 py-3 transition hover:bg-parchment-alt"
                    href={item.href}
                    onClick={() => setOpen(null)}
                  >
                    <span className="mt-0.5 inline-flex shrink-0 items-center bg-red/8 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red">
                      {TYPE_LABEL[item.type] ?? item.type}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-xs font-semibold leading-5 text-ink">{item.title}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-[10px] text-ink-soft">
                        {item.statusLabel ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 font-bold uppercase tracking-wide ${
                              item.status === "live"
                                ? "bg-red text-white motion-safe:animate-pulse"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.status === "live" ? <span className="mr-1 size-1.5 rounded-full bg-white" /> : null}
                            {item.statusLabel}
                          </span>
                        ) : (
                          relativeLabel(item.date)
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="divide-y divide-line-light">
              {recentlyViewed.map((item) => (
                <li key={`${item.principalSlug}:${item.slug}`}>
                  <Link
                    className="flex items-center gap-2.5 px-3.5 py-3 transition hover:bg-parchment-alt"
                    href={`/products/${item.slug}`}
                    onClick={() => setOpen(null)}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center border border-line-light bg-parchment-alt">
                      {item.image ? (
                        <Image alt="" className="h-full w-full object-contain p-1" height={36} src={item.image} width={36} />
                      ) : (
                        <FiFileText className="text-ink-soft" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-xs font-semibold leading-5 text-ink">{item.name}</span>
                      {item.principalName ? (
                        <span className="mt-0.5 block text-[10px] text-ink-soft">{item.principalName}</span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
