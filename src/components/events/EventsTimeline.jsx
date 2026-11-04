"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiArrowUpRight, FiCamera, FiMapPin } from "react-icons/fi";
import EventLightbox from "./EventLightbox";
import { FALLBACK_NAME, STATUS_LABELS, eventsByYear, listedEvents, liveStatus } from "./eventDisplay";
import styles from "./EventsTimeline.module.css";

/**
 * The events list as a timeline (events page, layout "timeline"): a line down
 * the page, a marker for each year that stays in view while its events pass,
 * and each event as a card off the line, newest first: its poster, dates,
 * name, venue and status. A card opens the event (EventLightbox); a past
 * event with photos says so. Year chips at the top jump to a year. Cards
 * slide in from the line as they come into view (not with reduced motion).
 */

export default function EventsTimeline() {
  const listRef = useRef(null);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  // Cards slide in as they come into view.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const cards = list.querySelectorAll("[data-timeline-card]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.in = "";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    cards.forEach((card) => observer.observe(card));
    list.dataset.ready = "";
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="events-timeline-title" className="relative bg-white px-4 pb-20 pt-16 sm:px-6 lg:px-8" data-scroll-skip="">
      <div className="mx-auto max-w-[1080px]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-red">Events archive</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#001e36] sm:text-4xl" id="events-timeline-title">
          Our events, year by year
        </h2>
        <nav aria-label="Jump to a year" className="mt-6 flex flex-wrap gap-2">
          {eventsByYear.map(({ year, events }) => (
            <a
              className="inline-flex items-center gap-2 rounded-full border border-[#001e36]/15 bg-white px-4 py-2 text-sm font-semibold text-[#001e36] transition hover:border-red hover:bg-red hover:text-white"
              href={`#events-${year}`}
              key={year}
            >
              {year}
              <span className="font-mono text-[11px] font-normal opacity-70">
                {events.length} {events.length === 1 ? "event" : "events"}
              </span>
            </a>
          ))}
        </nav>

        <div className={styles.timeline} ref={listRef}>
          {eventsByYear.map(({ year, events }) => (
            <div className={styles.year} id={`events-${year}`} key={year}>
              <div className={styles.yearMarker}>
                <span className={styles.yearPill}>{year}</span>
              </div>
              <ol className="grid gap-5">
                {events.map((event, index) => {
                  const { status, registerUrl } = liveStatus(event);
                  const name = event.name ?? FALLBACK_NAME;
                  return (
                    <li className={styles.item} key={event.id}>
                      <span aria-hidden="true" className={styles.node} />
                      <article className={styles.card} data-timeline-card="" style={{ "--d": `${(index % 3) * 70}ms` }}>
                        <button
                          aria-label={`${name}, ${event.dateText}: open`}
                          className={styles.cardButton}
                          onClick={() => setOpen({ event, startOn: "poster" })}
                          type="button"
                        />
                        <div className={styles.poster}>
                          <Image alt="" className="object-contain" fill sizes="160px" src={event.image} />
                        </div>
                        <div className="flex min-w-0 flex-col gap-1.5 py-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-red">{event.dateText}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] ${
                                status === "past" ? "bg-[#eef1f5] text-[#5a6573]" : "bg-red text-white"
                              }`}
                            >
                              {STATUS_LABELS[status]}
                            </span>
                          </div>
                          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[#001e36]">{name}</h3>
                          {event.place ? (
                            <p className="flex items-start gap-1.5 text-sm text-[#5a6573]">
                              <FiMapPin aria-hidden="true" className="mt-[3px] size-3.5 shrink-0 text-red" />
                              <span className="line-clamp-2">{event.place}</span>
                            </p>
                          ) : null}
                          <div className="relative z-10 mt-2 flex flex-wrap gap-2">
                            {event.collageImage ? (
                              <button
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#001e36] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red"
                                onClick={() => setOpen({ event, startOn: "photos" })}
                                type="button"
                              >
                                <FiCamera aria-hidden="true" className="size-3.5" />
                                See photos
                              </button>
                            ) : null}
                            {registerUrl ? (
                              <a
                                className="inline-flex items-center gap-1.5 rounded-full bg-red px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#99000d]"
                                href={registerUrl}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                Register
                                <FiArrowUpRight aria-hidden="true" className="size-3.5" />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
        <p className="sr-only">{listedEvents.length} events in all.</p>
      </div>

      {open ? <EventLightbox event={open.event} key={`${open.event.id}-${open.startOn}`} onClose={close} startOn={open.startOn} /> : null}
    </section>
  );
}
