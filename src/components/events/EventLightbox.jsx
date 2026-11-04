"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiArrowUpRight, FiCalendar, FiMapPin, FiX } from "react-icons/fi";
import { FALLBACK_NAME, STATUS_LABELS, liveStatus } from "./eventDisplay";

/**
 * An event opened up (from the events page's list layouts): its poster and,
 * for a past event with one, the collage of photos from it, with its dates,
 * venue and status, and registration while it is still to come. A dialog:
 * Esc or a click outside closes it, focus stays inside while it is open and
 * goes back where it was after. `event` from eventDisplay's listedEvents;
 * `startOn`: "photos" to open on the photos.
 */

// The site's floating buttons (chat, WhatsApp…) sit above any overlay; they
// step aside while this is open. React hoists this into <head> once.
const FLOATS_HIDDEN_CSS = `body[data-event-lightbox] [data-floating-widget]{visibility:hidden!important}`;

export default function EventLightbox({ event, startOn = "poster", onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [view, setView] = useState(startOn === "photos" && event?.collageImage ? "photos" : "poster");

  useEffect(() => {
    if (!event) return undefined;
    const opener = document.activeElement;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    document.body.dataset.eventLightbox = "";
    closeRef.current?.focus();

    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === "Escape") {
        onClose();
        return;
      }
      if (keyEvent.key !== "Tab" || !panelRef.current) return;
      // Keep Tab inside the dialog.
      const focusable = panelRef.current.querySelectorAll("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (keyEvent.shiftKey && document.activeElement === first) {
        keyEvent.preventDefault();
        last.focus();
      } else if (!keyEvent.shiftKey && document.activeElement === last) {
        keyEvent.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
      delete document.body.dataset.eventLightbox;
      opener?.focus?.();
    };
  }, [event, onClose]);

  if (!event) return null;

  const { status, registerUrl } = liveStatus(event);
  const name = event.name ?? FALLBACK_NAME;
  const src = view === "photos" && event.collageImage ? event.collageImage : event.image;

  return createPortal(
    <>
      <style href="event-lightbox-floats" precedence="default">
        {FLOATS_HIDDEN_CSS}
      </style>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1220]/80 p-3 backdrop-blur-sm motion-safe:animate-[hvc-fade_250ms_ease] sm:p-6"
        onClick={onClose}
      >
        <div
          aria-labelledby="event-lightbox-title"
          aria-modal="true"
          className="relative grid max-h-[92vh] w-full max-w-[980px] overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          onClick={(clickEvent) => clickEvent.stopPropagation()}
          ref={panelRef}
          role="dialog"
        >
          <div className="relative flex flex-col bg-[#f2f4f7]">
            {event.collageImage ? (
              <div className="flex gap-1 p-3 pb-0" role="tablist">
                {[
                  ["poster", "Poster"],
                  ["photos", "Event photos"],
                ].map(([key, label]) => (
                  <button
                    aria-selected={view === key}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      view === key ? "bg-[#001e36] text-white" : "text-[#3c556b] hover:bg-white"
                    }`}
                    key={key}
                    onClick={() => setView(key)}
                    role="tab"
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="relative m-3 aspect-[4/5] max-h-[60vh] md:max-h-[78vh]">
              <Image alt={view === "photos" ? `${name}: photos from the event` : name} className="object-contain" fill key={src} sizes="(min-width: 768px) 520px, 92vw" src={src} />
            </div>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto p-6 sm:p-8">
            <span
              className={`w-fit rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${
                status === "past" ? "bg-[#eef1f5] text-[#5a6573]" : "bg-red text-white"
              }`}
            >
              {STATUS_LABELS[status]}
            </span>
            <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-[#001e36]" id="event-lightbox-title">
              {name}
            </h3>
            <dl className="grid gap-3 text-sm text-[#3c556b]">
              <div className="flex items-start gap-2.5">
                <FiCalendar aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-red" />
                <div>
                  <dt className="sr-only">Dates</dt>
                  <dd>{event.dateText}</dd>
                </div>
              </div>
              {event.place ? (
                <div className="flex items-start gap-2.5">
                  <FiMapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-red" />
                  <div>
                    <dt className="sr-only">Venue</dt>
                    <dd>{event.place}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
            {registerUrl ? (
              <a
                className="mt-2 inline-flex w-fit items-center gap-2 bg-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#99000d]"
                href={registerUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Register now
                <FiArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
          </div>

          <button
            aria-label="Close"
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-[#001e36] shadow-md transition hover:bg-red hover:text-white focus-visible:outline-2 focus-visible:outline-red"
            onClick={onClose}
            ref={closeRef}
            type="button"
          >
            <FiX aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
