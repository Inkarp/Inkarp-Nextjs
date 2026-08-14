"use client";

import { useEffect, useState } from"react";
import Image from"next/image";
import { FiArrowUpRight, FiCalendar, FiCheckCircle, FiMapPin } from"react-icons/fi";
import RecTag from"@/components/home/RecTag";
import { events, eventYears, featuredEvent, isPastEvent } from"@/data/events";

const COUNTDOWN_UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

function splitRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

// One cell of the countdown. `key`-ing the digits on their value restarts the
// flip animation only when that unit actually changes, so days/hours stay still
// while the seconds tick.
function CountdownCell({ value, label, isLive }) {
  const display = String(value).padStart(2, "0");

  return (
    <div
      className={`relative overflow-hidden border border-line-light bg-parchment px-2 py-4 text-center sm:px-3 sm:py-5 ${
        isLive ? "animate-[hvc-count-glow_1s_ease-in-out_infinite]" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-1px] top-[-1px] h-2.5 w-2.5 border-l border-t border-red"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-1px] right-[-1px] h-2.5 w-2.5 border-b border-r border-red"
      />

      <span className="block overflow-hidden">
        <span
          className="block font-mono text-3xl font-semibold leading-none tracking-tight text-ink tabular-nums animate-[hvc-count-flip_420ms_cubic-bezier(0.22,0.9,0.28,1)] sm:text-4xl lg:text-5xl"
          key={display}
        >
          {display}
        </span>
      </span>

      <span className="mt-2 block font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-soft sm:text-[10.5px]">
        {label}
      </span>
    </div>
  );
}

function EventCountdown({ event }) {
  // null until mounted: the remaining time depends on the current clock, and
  // computing it during render would bake the build time into the static HTML
  // and mismatch on hydration.
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const startsAt = new Date(event.startsAt).getTime();
    const endsAt = new Date(event.endsAt).getTime();

    const tick = () => {
      const now = Date.now();
      if (now >= endsAt) return setRemaining({ state: "over" });
      if (now >= startsAt) return setRemaining({ state: "live" });
      return setRemaining({ state: "counting", ...splitRemaining(startsAt - now) });
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [event.startsAt, event.endsAt]);

  const isCounting = remaining?.state === "counting";
  const canRegister = Boolean(event.registrationUrl) && remaining?.state !== "over";

  return (
    <div className="relative border border-line-light bg-parchment-alt p-5 sm:p-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-1px] top-[-1px] h-4 w-4 border-l-[1.5px] border-t-[1.5px] border-red"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-1px] right-[-1px] h-4 w-4 border-b-[1.5px] border-r-[1.5px] border-red"
      />
      {/* Sheen sweeping across the panel keeps the block feeling alive. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-[hvc-count-sheen_4.5s_ease-in-out_infinite]"
      />

      <div className="relative">
        <p className="flex items-center justify-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft">
          <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-red" />
          {remaining?.state === "live"
            ? "Happening now — come say hello"
            : remaining?.state === "over"
              ? "This edition has wrapped"
              : "Doors open in"}
        </p>

        <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
          {COUNTDOWN_UNITS.map((unit) => (
            <CountdownCell
              isLive={isCounting && unit.key === "seconds"}
              key={unit.key}
              label={unit.label}
              // Dashes until the clock is read on the client.
              value={isCounting ? remaining[unit.key] : 0}
            />
          ))}
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-ink">
          {event.dateLabel}
        </p>
        <p className="mt-1 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">
          {event.venue}
        </p>

        {canRegister ? (
          <a
            className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
            href={event.registrationUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Register Now
            <FiArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

// Page banner for the next show. Deliberately not a flat JPEG: the copy is real
// text so it is readable, searchable and translatable, with the event artwork
// alongside it.
function FeaturedEventBanner() {
  const event = featuredEvent;

  if (!event) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-b border-line-light bg-parchment-alt">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-red via-red/35 to-teal"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,var(--ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--ink)_1px,transparent_1px)] [background-size:46px_46px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red/6 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div>
          <RecTag>{event.eyebrow}</RecTag>

          <h1 className="max-w-[18ch] text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {event.name}{" "}
            <em className="italic text-red">{event.edition}</em>
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-ink">
            <span className="inline-flex items-center gap-2">
              <FiCalendar aria-hidden="true" className="size-4 text-red" />
              {event.dateLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <FiMapPin aria-hidden="true" className="size-4 text-red" />
              {event.venue}
            </span>
          </div>

          <p className="mt-4 max-w-[560px] text-base leading-relaxed text-ink-soft">
            {event.summary}
          </p>

          <ul className="mt-6 grid max-w-[560px] gap-2 sm:grid-cols-3">
            {event.highlights.map((item) => (
              <li
                className="flex items-start gap-2 border border-line-light bg-parchment p-3"
                key={item}
              >
                <FiCheckCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-red" />
                <span className="text-xs font-semibold leading-snug text-ink">{item}</span>
              </li>
            ))}
          </ul>

        </div>

        <EventCountdown event={event} />
      </div>
    </section>
  );
}

function LabCard({ title, image, collageImage, date, formLink }) {
  const isPast = isPastEvent({ date });
  const alt = title ||"Inkarp event";

  return (
    <div className="flex h-full flex-col">
      <div className="group relative overflow-hidden bg-parchment-alt p-1 transition-all duration-300">
        <div className="relative h-[420px] w-full overflow-hidden bg-white sm:h-[470px] lg:h-[560px] xl:h-[520px]">
          <Image
            alt={alt}
            className={`object-contain transition duration-300 ${
              isPast && !collageImage ?"group-hover:blur-sm group-hover:brightness-75" :""
            }`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={image}
          />
          {isPast && collageImage ? (
            <Image
              alt={`${alt} collage`}
              className="object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={collageImage}
            />
          ) : null}
        </div>
      </div>

      {/* Only reserve space when there is actually a button. This row was a
          fixed h-10 plus mt-4 rendered unconditionally, leaving ~56px of dead
          space under every past event — which is all of them. */}
      {!isPast && formLink ? (
        <div className="mt-4 flex items-start justify-center">
          <a href={formLink} rel="noopener noreferrer" target="_blank">
            <button
              className="cursor-pointer bg-red px-6 py-2 text-sm font-medium text-parchment transition-transform duration-300 hover:scale-105 hover:bg-red"
              type="button"
            >
              Register Now
            </button>
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default function EventsPage() {
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const resetFilters = () => {
    setFilterMonth("");
    setFilterYear("");
    setUpcomingOnly(false);
  };

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const matchesMonth = filterMonth ? eventDate.getMonth() + 1 === parseInt(filterMonth, 10) : true;
      const matchesYear = filterYear ? eventDate.getFullYear() === parseInt(filterYear, 10) : true;
      const isUpcoming = upcomingOnly ? eventDate >= today : true;
      return matchesMonth && matchesYear && isUpcoming;
    })
    .sort((a, b) => b.id - a.id);

  return (
    <main>
      <FeaturedEventBanner />

      <div
        className="mx-auto mt-6 flex w-[95%] flex-col flex-wrap items-center justify-around gap-6 border border-line-light bg-parchment-alt py-8 sm:flex-row"
        id="events-list"
      >
        <div className="flex w-full flex-col items-center gap-3 px-3 sm:w-auto sm:flex-row sm:gap-5">
          <label className="min-w-[80px] text-lg font-semibold text-ink">Month</label>
          <select
            className="w-full border border-line-light bg-parchment px-4 py-2 text-sm outline-none transition focus:border-red focus:ring-2 focus:ring-red/40 sm:w-44"
            onChange={(event) => setFilterMonth(event.target.value)}
            value={filterMonth}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month:"long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full flex-col items-center gap-3 px-3 sm:w-auto sm:flex-row sm:gap-5">
          <label className="min-w-[80px] text-lg font-semibold text-ink">Year</label>
          <select
            className="w-full border border-line-light bg-parchment px-4 py-2 text-sm outline-none transition focus:border-red focus:ring-2 focus:ring-red/40 sm:w-36"
            onChange={(event) => setFilterYear(event.target.value)}
            value={filterYear}
          >
            <option value="">All Years</option>
            {eventYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full select-none items-center gap-3 px-5 sm:w-auto">
          <input
            checked={upcomingOnly}
            className="size-5 border border-line-light accent-red outline-none transition focus:ring-2 focus:ring-red/40"
            id="upcoming"
            onChange={() => setUpcomingOnly((current) => !current)}
            type="checkbox"
          />
          <label className="cursor-pointer text-lg font-semibold text-ink" htmlFor="upcoming">
            Upcoming Only
          </label>
        </div>

        <button
          className="w-full bg-red px-5 py-2 font-semibold text-parchment transition-transform active:scale-95 sm:w-auto"
          onClick={resetFilters}
          type="button"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 px-2 py-4 sm:grid-cols-2 sm:gap-4 sm:px-4 md:px-6 lg:grid-cols-2 lg:px-10 xl:grid-cols-3">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full py-8 text-center text-ink-soft">
            <p className="text-sm sm:text-base">No events found for selected filters.</p>
          </div>
        ) : (
          filteredEvents.map((event) => <LabCard key={event.id} {...event} />)
        )}
      </div>
    </main>
  );
}
