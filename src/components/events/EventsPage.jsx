"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import {
  events,
  formatDateRange,
  getDaysToStart,
  getEventStatus,
  getNextUpcomingEvent,
} from "@/data/events";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const spotlightEvent = getNextUpcomingEvent();
  const timelineEvents = [...events].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(230,57,70,0.08),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <span
            className="font-maxot inline-flex rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs font-semibold uppercase text-zinc-800 md:text-sm dark:bg-zinc-900 dark:text-zinc-100"
            data-reveal
          >
            On the Road
          </span>
          <h1
            className="font-maxot mt-4 text-3xl font-bold leading-tight text-[#E63946] sm:text-4xl"
            data-reveal
          >
            Meet Us at Industry Events
          </h1>
          <p
            className="mx-auto mt-3 max-w-2xl text-base text-zinc-700 sm:text-lg dark:text-zinc-300"
            data-reveal
          >
            Catch our team and instrument demos at exhibitions, conferences,
            and trade shows across India.
          </p>
        </div>
      </section>

      {spotlightEvent ? (
        <section className="mx-auto max-w-5xl px-4 pb-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-3xl bg-[#0F2A33] text-white shadow-2xl"
            data-reveal
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_90%_-10%,rgba(230,57,70,0.35),transparent)]" />

            <div className="relative flex flex-col gap-6 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E63946]">
                  Next Up
                </p>
                <h2 className="font-maxot mt-2 text-2xl leading-snug sm:text-3xl">
                  {spotlightEvent.title}
                </h2>
                <p className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="size-4" />
                    {formatDateRange(spotlightEvent)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="size-4" />
                    {spotlightEvent.venue}, {spotlightEvent.city}
                  </span>
                </p>
                <button
                  className="font-maxot mt-6 inline-flex items-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm text-white transition hover:bg-white hover:text-[#0F2A33]"
                  onClick={() => setSelectedEvent(spotlightEvent)}
                  type="button"
                >
                  View Details
                  <FiArrowRight className="size-4" />
                </button>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-3">
                <div className="relative flex size-28 items-center justify-center rounded-full border-4 border-[#E63946] bg-white/5 sm:size-32">
                  <div className="text-center">
                    <p className="font-maxot text-3xl leading-none sm:text-4xl">
                      {Math.max(getDaysToStart(spotlightEvent), 0)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-white/70">
                      days to go
                    </p>
                  </div>
                </div>
                <div className="flex size-14 items-center justify-center rounded-xl bg-white p-2">
                  <Image
                    alt=""
                    className="h-full w-full object-contain"
                    height={48}
                    src={spotlightEvent.logo}
                    width={48}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-px bg-zinc-200 sm:left-1/2 dark:bg-zinc-700"
          />

          <div className="space-y-10">
            {timelineEvents.map((event, index) => {
              const status = getEventStatus(event);
              const alignRight = index % 2 === 1;

              return (
                <div
                  className="relative flex flex-col gap-4 pl-12 sm:grid sm:grid-cols-2 sm:gap-10 sm:pl-0"
                  data-reveal
                  key={event.id}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-4 top-1.5 -translate-x-1/2 rounded-full border-4 border-white shadow sm:left-1/2 dark:border-zinc-900 ${
                      status === "past"
                        ? "size-3 bg-zinc-400"
                        : status === "ongoing"
                          ? "size-4 bg-green-500"
                          : "size-4 bg-[#E63946]"
                    }`}
                  />

                  <div
                    className={`${
                      alignRight ? "sm:order-2 sm:pl-10" : "sm:order-1 sm:pr-10 sm:text-right"
                    }`}
                  >
                    <button
                      className={`group inline-block w-full rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                        status === "past"
                          ? "border-zinc-200 bg-zinc-50 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/60"
                          : "border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                      } ${alignRight ? "text-left" : "sm:text-right"}`}
                      onClick={() => setSelectedEvent(event)}
                      type="button"
                    >
                      <div
                        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 ${
                          alignRight ? "" : "sm:justify-end"
                        }`}
                      >
                        <span
                          className={`rounded-full px-2 py-0.5 ${
                            status === "past"
                              ? "bg-zinc-200 dark:bg-zinc-800"
                              : status === "ongoing"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                : "bg-[#E63946]/10 text-[#E63946]"
                          }`}
                        >
                          {status === "ongoing" ? "Happening now" : event.type}
                        </span>
                        <span>{formatDateRange(event)}</span>
                      </div>

                      <h3 className="font-maxot mt-2 text-lg text-zinc-900 group-hover:text-[#E63946] dark:text-zinc-100">
                        {event.title}
                      </h3>

                      <p
                        className={`mt-1 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 ${
                          alignRight ? "" : "sm:justify-end"
                        }`}
                      >
                        <FiMapPin className="size-3.5 shrink-0" />
                        {event.venue}, {event.city}
                      </p>
                    </button>
                  </div>

                  <div className={alignRight ? "sm:order-1" : "sm:order-2"} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-6 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Want to schedule a dedicated meeting with our team at any of these
          events?
        </p>
        <Link
          className="font-maxot mt-3 inline-flex items-center gap-2 rounded-full border border-[#E63946] px-6 py-3 text-sm text-[#E63946] transition hover:bg-[#E63946] hover:text-white"
          href="/contact"
        >
          Get in Touch
          <FiArrowRight className="size-4" />
        </Link>
      </section>

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <button
              aria-label="Close event details"
              className="absolute right-4 top-4 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              onClick={() => setSelectedEvent(null)}
              type="button"
            >
              <FiX className="size-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-zinc-50 p-2 dark:bg-zinc-800">
                <Image
                  alt=""
                  className="h-full w-full object-contain"
                  height={40}
                  src={selectedEvent.logo}
                  width={40}
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E63946]">
                  {selectedEvent.type}
                </p>
                <h3 className="font-maxot text-lg text-zinc-900 dark:text-zinc-100">
                  {selectedEvent.title}
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-1 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <p className="flex items-center gap-2">
                <FiCalendar className="size-4 shrink-0 text-[#E63946]" />
                {formatDateRange(selectedEvent)}
              </p>
              <p className="flex items-center gap-2">
                <FiMapPin className="size-4 shrink-0 text-[#E63946]" />
                {selectedEvent.venue}, {selectedEvent.city}
              </p>
              {selectedEvent.boothNo ? (
                <p className="pl-6 text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedEvent.boothNo}
                </p>
              ) : null}
            </div>

            <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
              {selectedEvent.description}
            </p>

            {selectedEvent.highlights?.length ? (
              <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {selectedEvent.highlights.map((highlight) => (
                  <li className="flex items-start gap-2" key={highlight}>
                    <FiCheck className="mt-0.5 size-4 shrink-0 text-green-600" />
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}

            <Link
              className="font-maxot mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#BE0010] px-5 py-3 text-sm text-white transition hover:bg-[#E63946]"
              href="/contact"
            >
              Schedule a Meeting
              <FiArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
