"use client";

import Image from"next/image";
import Link from"next/link";
import { useMemo, useState } from"react";
import { FiChevronDown, FiSearch, FiX } from"react-icons/fi";

function formatVolumeLabel(volume ="") {
  return volume.replace("-","");
}

function parseDate(dateStr ="") {
  const [month = "", year = ""] = dateStr.trim().split(/\s+/);
  return { month, year };
}

function useGroupedVolumes(catalystCards) {
  const groupedByVolume = useMemo(() => {
    return catalystCards.reduce((accumulator, card) => {
      accumulator[card.Volume] ||= [];
      accumulator[card.Volume].push(card);
      return accumulator;
    }, {});
  }, [catalystCards]);

  const sortedVolumeKeys = useMemo(() => {
    return Object.keys(groupedByVolume).sort((a, b) => {
      const numA = Number.parseInt(a.split("-")[1], 10);
      const numB = Number.parseInt(b.split("-")[1], 10);
      return numB - numA;
    });
  }, [groupedByVolume]);

  return { groupedByVolume, sortedVolumeKeys };
}

function useFilteredCards(catalystCards, filters) {
  return useMemo(() => {
    const { search, volume, issue, year, month } = filters;
    return catalystCards.filter((card) => {
      if (search) {
        const s = search.toLowerCase();
        const hit =
          (card.title ||"").toLowerCase().includes(s) ||
          (card.subTitle ||"").toLowerCase().includes(s) ||
          (card.Date ||"").toLowerCase().includes(s) ||
          (card.Volume ||"").toLowerCase().includes(s);
        if (!hit) return false;
      }
      if (volume && card.Volume !== volume) return false;
      if (issue && card.subTitle !== issue) return false;
      const { month: cardMonth, year: cardYear } = parseDate(card.Date);
      if (year && cardYear !== year) return false;
      if (month && cardMonth !== month) return false;
      return true;
    });
  }, [catalystCards, filters]);
}

const MONTH_ORDER = ["January","February","March","April","May","June","July","August","September","October","November","December",
];

function issueSortValue(card) {
  const { month, year } = parseDate(card.Date);
  const monthIndex = MONTH_ORDER.indexOf(month);
  const parsedYear = Number.parseInt(year, 10);

  if (monthIndex >= 0 && Number.isFinite(parsedYear)) {
    return parsedYear * 12 + monthIndex;
  }

  return Number(card.id) || 0;
}

function newestFirst(a, b) {
  return issueSortValue(b) - issueSortValue(a) || Number(b.id) - Number(a.id);
}

const SELECT_CLASS ="h-9 appearance-none cursor-pointer border border-line-light bg-white pl-3 pr-8 text-sm text-ink-soft focus:border-red focus:outline-none focus:ring-1 focus:ring-red/30 transition";

function FilterBar({ allCards, filters, setFilters }) {
  const { search, volume, issue, year, month } = filters;

  const volumes = useMemo(
    () =>
      [...new Set(allCards.map((c) => c.Volume))].sort((a, b) => {
        const na = Number.parseInt(a.split("-")[1], 10);
        const nb = Number.parseInt(b.split("-")[1], 10);
        return na - nb;
      }),
    [allCards],
  );

  const issues = useMemo(
    () =>
      [...new Set(allCards.map((c) => c.subTitle))].sort((a, b) => {
        const na = Number.parseInt(a.split("")[1], 10);
        const nb = Number.parseInt(b.split("")[1], 10);
        return na - nb;
      }),
    [allCards],
  );

  const years = useMemo(
    () =>
      [...new Set(allCards.map((c) => parseDate(c.Date).year))]
        .filter(Boolean)
        .sort(),
    [allCards],
  );

  const months = useMemo(
    () =>
      [...new Set(allCards.map((c) => parseDate(c.Date).month))]
        .filter(Boolean)
        .sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)),
    [allCards],
  );

  const hasFilters = search || volume || issue || year || month;
  const clear = () =>
    setFilters({ search:"", volume:"", issue:"", year:"", month:"" });

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[180px] flex-1">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          className="h-9 w-full border border-line-light bg-white pl-9 pr-4 text-sm placeholder:text-ink-muted focus:border-red focus:outline-none focus:ring-1 focus:ring-red/30 transition"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder="Search issues…"
          type="text"
          value={search}
        />
      </div>

      <div className="relative">
        <select
          className={SELECT_CLASS}
          onChange={(e) => setFilters((f) => ({ ...f, volume: e.target.value }))}
          value={volume}
        >
          <option value="">All Volumes</option>
          {volumes.map((v) => (
            <option key={v} value={v}>
              {formatVolumeLabel(v)}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft" />
      </div>

      <div className="relative">
        <select
          className={SELECT_CLASS}
          onChange={(e) => setFilters((f) => ({ ...f, issue: e.target.value }))}
          value={issue}
        >
          <option value="">All Issues</option>
          {issues.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft" />
      </div>

      <div className="relative">
        <select
          className={SELECT_CLASS}
          onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
          value={year}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft" />
      </div>

      <div className="relative">
        <select
          className={SELECT_CLASS}
          onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
          value={month}
        >
          <option value="">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft" />
      </div>

      {hasFilters ? (
        <button
          className="inline-flex h-9 items-center gap-1.5 border border-line-light px-3 text-sm text-ink-soft transition hover:border-line-light hover:text-ink-soft"
          onClick={clear}
          type="button"
        >
          <FiX className="size-3.5" />
          Clear
        </button>
      ) : null}
    </div>
  );
}

// The cover is deliberately NOT a link — reading an issue happens through the
// explicit "Read Issue" button below it.
function IssueCard({ card }) {
  return (
    <article className="flex flex-col overflow-hidden border border-line-light bg-white text-ink transition hover:-translate-y-0.5 hover:border-red">
      <div className="relative aspect-[260/366] w-full overflow-hidden bg-parchment-alt">
        <Image
          alt={card.subTitle}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 85vw"
          src={card.image}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-line-light bg-parchment px-3 py-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <h3 className="font-semibold leading-snug text-ink">{card.subTitle}</h3>
          <span aria-hidden="true" className="text-red">|</span>
          <p className="text-ink-soft">{card.Date}</p>
        </div>

        <Link
          className="mt-auto inline-flex items-center justify-center gap-1.5 border border-red bg-red px-4 py-2 text-xs font-semibold text-white transition hover:bg-transparent hover:text-red"
          href={`/magazine/${encodeURIComponent(card.slug)}`}
        >
          Read Issue
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center text-sm text-ink-soft">
      No issues match your filters.{" "}
      <span className="text-ink-soft">Try clearing some filters.</span>
    </div>
  );
}

function ArchiveTabbed({ catalystCards }) {
  const { groupedByVolume, sortedVolumeKeys } = useGroupedVolumes(catalystCards);
  const [activeVolume, setActiveVolume] = useState(sortedVolumeKeys[0]);

  // Keep the selection valid when filtering removes the active volume.
  const currentVolume = sortedVolumeKeys.includes(activeVolume)
    ? activeVolume
    : sortedVolumeKeys[0];

  const activeCards = useMemo(() => {
    return [...(groupedByVolume[currentVolume] || [])].sort(newestFirst);
  }, [groupedByVolume, currentVolume]);

  if (!catalystCards.length) return <EmptyState />;

  return (
    <div>
      <div
        aria-label="Volumes"
        className="mb-8 flex flex-wrap gap-3"
        role="tablist"
      >
        {sortedVolumeKeys.map((volume) => (
          <button
            aria-selected={currentVolume === volume}
            className={`px-5 py-2 text-sm font-bold uppercase transition ${
              currentVolume === volume
                ?"bg-red text-parchment"
                :"border border-line-light text-ink-soft hover:border-red hover:text-red"
            }`}
            key={volume}
            onClick={() => setActiveVolume(volume)}
            role="tab"
            type="button"
          >
            {formatVolumeLabel(volume)}
          </button>
        ))}
      </div>
      {activeCards.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeCards.map((card) => (
            <IssueCard card={card} key={card.slug} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// Only the tabbed-by-volume layout is offered now; the shelves, accordion and
// timeline variants and the layout switcher above them have been removed.
export default function CatalystArchive({ catalystCards }) {
  const [filters, setFilters] = useState({
    search:"",
    volume:"",
    issue:"",
    year:"",
    month:"",
  });

  const filteredCards = useFilteredCards(catalystCards, filters);

  return (
    <div>
      <FilterBar allCards={catalystCards} filters={filters} setFilters={setFilters} />
      <ArchiveTabbed catalystCards={filteredCards} />
    </div>
  );
}
