"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCamera } from "react-icons/fi";
import EventLightbox from "./EventLightbox";
import { FALLBACK_NAME, eventsByYear, listedEvents, liveStatus } from "./eventDisplay";
import styles from "./EventsYearRows.module.css";

/**
 * The events list as a row per year (events page, layout "rows"): a strip of
 * headline numbers that count up as it comes into view (all worked out from
 * the events list), then each year as a row of cards, newest first, that
 * swipes sideways (← → buttons on wider screens). The cards wear the
 * showcase cards' grey theme: the poster on white, the dates, name and venue
 * in white on grey. A card opens the event (EventLightbox).
 */

const years = eventsByYear.map((group) => group.year);
const STATS = [
  { value: listedEvents.length, label: "Events" },
  { value: years.length, label: `Years, ${Math.min(...years)}–${Math.max(...years)}` },
  { value: listedEvents.filter((event) => event.collageImage).length, label: "Photo albums" },
];
const COUNT_MS = 1200;

function Stats() {
  const ref = useRef(null);
  const [shown, setShown] = useState(STATS.map((stat) => stat.value));

  // Counting up from nothing as the strip comes into view (the numbers are
  // in the page as they are, for anyone without the animation).
  useEffect(() => {
    const strip = ref.current;
    if (!strip || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const k = Math.min(1, (now - start) / COUNT_MS);
          const eased = 1 - (1 - k) ** 3;
          setShown(STATS.map((stat) => Math.round(stat.value * eased)));
          if (k < 1) frame = window.requestAnimationFrame(tick);
        };
        frame = window.requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(strip);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <dl className="mt-8 grid grid-cols-3 divide-x divide-[#001e36]/10 rounded-2xl border border-[#001e36]/10 bg-white shadow-[0_10px_30px_rgba(0,30,54,0.06)]" ref={ref}>
      {STATS.map((stat, index) => (
        <div className="flex flex-col items-center gap-1 px-3 py-5 text-center sm:py-6" key={stat.label}>
          <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5a6573] sm:text-[11px]">{stat.label}</dt>
          <dd className="order-1 text-3xl font-semibold tabular-nums text-[#001e36] sm:text-4xl">{shown[index]}</dd>
        </div>
      ))}
    </dl>
  );
}

function YearRow({ year, events, onOpen }) {
  const trackRef = useRef(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEnds({ start: track.scrollLeft < 4, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const frame = window.requestAnimationFrame(measure);
    track.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const move = (direction) => {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.offsetWidth + 20) * 2, behavior: "smooth" });
  };

  return (
    <div className="mt-14" id={`events-${year}`}>
      <div className="flex items-end justify-between gap-4">
        <h3 className="flex items-baseline gap-3 text-[#001e36]">
          <span className="text-4xl font-semibold tracking-tight sm:text-5xl">{year}</span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#5a6573]">
            {events.length} {events.length === 1 ? "event" : "events"}
          </span>
        </h3>
        <div className="hidden gap-2 sm:flex">
          <button aria-label={`Earlier in ${year}`} className={styles.arrow} disabled={ends.start} onClick={() => move(-1)} type="button">
            <FiArrowLeft aria-hidden="true" className="size-4" />
          </button>
          <button aria-label={`Later in ${year}`} className={styles.arrow} disabled={ends.end} onClick={() => move(1)} type="button">
            <FiArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <ul className={styles.track} ref={trackRef}>
        {events.map((event) => {
          const { registerUrl } = liveStatus(event);
          const name = event.name ?? FALLBACK_NAME;
          return (
            <li className={styles.cardSlot} key={event.id}>
              <article className={styles.card}>
                <button aria-label={`${name}, ${event.dateText}: open`} className={styles.cover} onClick={() => onOpen(event, "poster")} type="button" />
                <div className={styles.poster}>
                  <Image alt="" className="object-contain p-2" fill sizes="270px" src={event.image} />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/75">{event.dateText}</span>
                  <h4 className="line-clamp-2 text-[15px] font-bold leading-snug">{name}</h4>
                  {event.place ? <p className="line-clamp-1 text-xs text-white/65">{event.place}</p> : null}
                  <div className="relative z-10 mt-auto flex flex-wrap gap-3 pt-2">
                    {event.collageImage ? (
                      <button
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white"
                        onClick={() => onOpen(event, "photos")}
                        type="button"
                      >
                        <span className="grid size-5 place-items-center rounded-full bg-red">
                          <FiCamera aria-hidden="true" className="size-3" />
                        </span>
                        See photos
                      </button>
                    ) : null}
                    {registerUrl ? (
                      <a className="inline-flex items-center gap-1.5 text-xs font-semibold text-white" href={registerUrl} rel="noopener noreferrer" target="_blank">
                        <span className="grid size-5 place-items-center rounded-full bg-red">
                          <FiArrowUpRight aria-hidden="true" className="size-3" />
                        </span>
                        Register
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function EventsYearRows() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const openEvent = useCallback((event, startOn) => setOpen({ event, startOn }), []);

  return (
    <section aria-labelledby="events-rows-title" className="bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)] px-4 pb-20 pt-16 sm:px-6 lg:px-8" data-scroll-skip="">
      <div className="mx-auto max-w-[1180px]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-red">Events archive</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#001e36] sm:text-4xl" id="events-rows-title">
          Our events, year by year
        </h2>
        <Stats />
        {eventsByYear.map(({ year, events }) => (
          <YearRow events={events} key={year} onOpen={openEvent} year={year} />
        ))}
      </div>

      {open ? <EventLightbox event={open.event} key={`${open.event.id}-${open.startOn}`} onClose={close} startOn={open.startOn} /> : null}
    </section>
  );
}
