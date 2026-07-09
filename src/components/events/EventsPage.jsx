"use client";

import { useState } from"react";
import Image from"next/image";
import { events, eventsBanner, eventYears, isPastEvent } from"@/data/events";

function LabCard({ title, image, collageImage, date, formLink }) {
  const isPast = isPastEvent({ date });
  const alt = title ||"Inkarp event";

  return (
    <div className="flex h-full flex-col">
      <div className="group relative overflow-hidden bg-parchment-alt p-2 transition-all duration-300">
        <div className="relative h-[360px] w-full overflow-hidden sm:h-[400px] lg:h-[440px]">
          <Image
            alt={alt}
            className={`object-cover transition duration-300 ${
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

      <div className="mt-4 flex h-10 items-start justify-center">
        {!isPast && formLink ? (
          <a href={formLink} rel="noopener noreferrer" target="_blank">
            <button
              className="cursor-pointer bg-red px-6 py-2 text-sm font-medium text-parchment transition-transform duration-300 hover:scale-105 hover:bg-red"
              type="button"
            >
              Join Us
            </button>
          </a>
        ) : null}
      </div>
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
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[300px] lg:h-[380px]">
        <Image
          alt="Inkarp events"
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src={eventsBanner}
        />
      </div>

      <div className="mx-auto mt-6 flex w-[95%] flex-col flex-wrap items-center justify-around gap-6 border border-line-light bg-parchment-alt py-8 sm:flex-row">
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

      <div className="grid grid-cols-1 items-stretch gap-4 px-2 py-4 sm:grid-cols-2 sm:gap-6 sm:px-4 md:px-6 lg:grid-cols-3 lg:gap-8 lg:px-10">
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
