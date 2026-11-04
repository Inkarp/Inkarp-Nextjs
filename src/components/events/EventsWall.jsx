"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { FiCamera } from "react-icons/fi";
import EventLightbox from "./EventLightbox";
import { FALLBACK_NAME, eventsByYear, listedEvents, liveStatus } from "./eventDisplay";
import styles from "./EventsWall.module.css";

/**
 * The events list as a wall of posters (events page, layout "wall"): each
 * event's poster pinned to a board on white paper, at a slight angle, newest
 * first, events still to come first of all with a red ribbon. Tabs show one
 * year at a time. Hovering straightens and lifts a poster; clicking opens
 * the event (EventLightbox) with its poster and, for a past event, its
 * photos. The posters carry the events' names themselves.
 */

const shortDate = (event) =>
  new Date(event.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export default function EventsWall() {
  const [year, setYear] = useState(null);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  const shown = year === null ? listedEvents : (eventsByYear.find((group) => group.year === year)?.events ?? []);
  // Still to come first.
  const ordered = [...shown].sort((a, b) => Number(liveStatus(b).status !== "past") - Number(liveStatus(a).status !== "past"));
  const tabs = [{ key: null, label: "All", count: listedEvents.length }, ...eventsByYear.map((group) => ({ key: group.year, label: String(group.year), count: group.events.length }))];

  return (
    <section aria-labelledby="events-wall-title" className={`${styles.board} px-4 pb-20 pt-16 sm:px-6 lg:px-8`} data-scroll-skip="">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-red">Events archive</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#001e36] sm:text-4xl" id="events-wall-title">
              Our events wall
            </h2>
          </div>
          <div aria-label="Show a year" className="flex flex-wrap gap-1 rounded-full bg-white p-1 shadow-[0_6px_20px_rgba(0,30,54,0.08)]" role="tablist">
            {tabs.map((tab) => (
              <button
                aria-selected={year === tab.key}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  year === tab.key ? "bg-[#001e36] text-white" : "text-[#3c556b] hover:text-red"
                }`}
                key={tab.label}
                onClick={() => setYear(tab.key)}
                role="tab"
                type="button"
              >
                {tab.label}
                <span className="ml-1.5 font-mono text-[11px] font-normal opacity-70">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Keyed by the year shown, so the posters pin up afresh on a change. */}
        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4" key={year ?? "all"}>
          {ordered.map((event, index) => {
            const { status } = liveStatus(event);
            const name = event.name ?? FALLBACK_NAME;
            return (
              <li className={styles.slot} key={event.id} style={{ "--i": Math.min(index, 12) }}>
                <button
                  aria-label={`${name}, ${event.dateText}: open`}
                  className={styles.poster}
                  onClick={() => setOpen({ event, startOn: "poster" })}
                  type="button"
                >
                  <span aria-hidden="true" className={styles.pin} />
                  {status !== "past" ? <span className={styles.ribbon}>Upcoming</span> : null}
                  <span className={styles.paper}>
                    <Image alt="" className="object-contain" fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 30vw, 45vw" src={event.image} />
                  </span>
                </button>
                <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#3c556b]">
                  {shortDate(event)}
                  {event.collageImage ? (
                    <button
                      className="inline-flex items-center gap-1 rounded-full bg-[#001e36] px-2 py-0.5 text-[10px] text-white transition hover:bg-red"
                      onClick={() => setOpen({ event, startOn: "photos" })}
                      type="button"
                    >
                      <FiCamera aria-hidden="true" className="size-3" />
                      Photos
                    </button>
                  ) : null}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {open ? <EventLightbox event={open.event} key={`${open.event.id}-${open.startOn}`} onClose={close} startOn={open.startOn} /> : null}
    </section>
  );
}
