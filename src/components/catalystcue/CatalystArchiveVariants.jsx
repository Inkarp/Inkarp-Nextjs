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

function IssueCard({ card }) {
  return (
    <Link
      className="flex w-[260px] shrink-0 flex-col overflow-hidden border border-line-light bg-white text-ink transition hover:-translate-y-0.5 hover:border-red"
      href={`/magazine/${encodeURIComponent(card.slug)}`}
    >
      <Image
        alt={card.subTitle}
        className="h-[366px] w-[260px] object-cover"
        height={366}
        src={card.image}
        width={260}
      />
      <div className="flex min-h-[54px] items-center justify-center gap-2 border-t border-line-light bg-parchment px-3 py-2 text-center text-sm">
        <h3>{card.subTitle}</h3>
        <span className="text-red">|</span>
        <p>{card.Date}</p>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center text-sm text-ink-soft">
      No issues match your filters.{""}
      <span className="text-ink-soft">Try clearing some filters.</span>
    </div>
  );
}

export function ArchiveTabbed({ catalystCards }) {
  const { groupedByVolume, sortedVolumeKeys } = useGroupedVolumes(catalystCards);
  const [activeVolume, setActiveVolume] = useState(sortedVolumeKeys[0]);

  const activeCards = useMemo(() => {
    return [...(groupedByVolume[activeVolume] || [])].sort(newestFirst);
  }, [groupedByVolume, activeVolume]);

  if (!catalystCards.length) return <EmptyState />;

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {sortedVolumeKeys.map((volume) => (
          <button
            className={`px-5 py-2 text-sm font-bold uppercase transition ${
              activeVolume === volume
                ?"bg-red text-parchment"
                :"border border-line-light text-ink-soft hover:border-red hover:text-red"
            }`}
            key={volume}
            onClick={() => setActiveVolume(volume)}
            type="button"
          >
            {formatVolumeLabel(volume)}
          </button>
        ))}
      </div>
      {activeCards.length ? (
        <div className="flex flex-wrap items-start justify-center gap-8 xl:justify-start">
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

export function ArchiveShelves({ catalystCards }) {
  const { groupedByVolume, sortedVolumeKeys } = useGroupedVolumes(catalystCards);

  if (!catalystCards.length) return <EmptyState />;

  return (
    <div className="space-y-12">
      {sortedVolumeKeys.map((volume) => {
        const cards = [...groupedByVolume[volume]].sort(newestFirst);

        return (
          <section key={volume}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold uppercase text-ink">
                {formatVolumeLabel(volume)}
              </h3>
              <span className="text-sm text-ink-soft">{cards.length} issues</span>
            </div>
            <div className="flex items-start gap-6 overflow-x-auto pb-4">
              {cards.map((card) => (
                <IssueCard card={card} key={card.slug} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function ArchiveAccordion({ catalystCards }) {
  const { groupedByVolume, sortedVolumeKeys } = useGroupedVolumes(catalystCards);
  const [openVolume, setOpenVolume] = useState(sortedVolumeKeys[0]);

  if (!catalystCards.length) return <EmptyState />;

  return (
    <div className="mx-auto max-w-[1180px] divide-y divide-line-light border border-line-light">
      {sortedVolumeKeys.map((volume) => {
        const cards = [...groupedByVolume[volume]].sort(newestFirst);
        const isOpen = openVolume === volume;

        return (
          <div key={volume}>
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold uppercase text-ink"
              onClick={() => setOpenVolume(isOpen ? null : volume)}
              type="button"
            >
              <span>{formatVolumeLabel(volume)}</span>
              <span className="flex items-center gap-3 text-sm font-medium text-ink-soft">
                {cards.length} issues
                <FiChevronDown
                  className={`transition-transform ${isOpen ?"rotate-180" :""}`}
                />
              </span>
            </button>
            {isOpen ? (
              <div className="flex flex-wrap items-start justify-center gap-8 p-5 xl:justify-start">
                {cards.map((card) => (
                  <IssueCard card={card} key={card.slug} />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ArchiveTimeline({ catalystCards }) {
  const sorted = useMemo(
    () => [...catalystCards].sort(newestFirst),
    [catalystCards],
  );

  if (!catalystCards.length) return <EmptyState />;

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="relative space-y-10 border-l border-line-light pl-6">
        {sorted.map((card) => (
          <li className="relative" key={card.slug}>
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 bg-red" />
            <Link className="group flex gap-5" href={`/magazine/${encodeURIComponent(card.slug)}`}>
              <Image
                alt={card.subTitle}
                className="h-28 w-20 shrink-0 object-cover"
                height={112}
                src={card.image}
                width={80}
              />
              <div>
                <span className="text-xs font-bold uppercase text-red">
                  {formatVolumeLabel(card.Volume)} &middot; {card.subTitle}
                </span>
                <h3 className="mt-1 font-semibold text-ink transition-colors group-hover:text-red">
                  {card.metaTitle || card.title}
                </h3>
                <p className="text-sm text-ink-soft">{card.Date}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

const variants = [
  { key:"tabbed", label:"Tabbed Volumes", Component: ArchiveTabbed },
  { key:"shelves", label:"Horizontal Shelves", Component: ArchiveShelves },
  { key:"accordion", label:"Accordion List", Component: ArchiveAccordion },
  { key:"timeline", label:"Timeline View", Component: ArchiveTimeline },
];

export default function CatalystArchiveSwitcher({ catalystCards }) {
  const [variant, setVariant] = useState(variants[0].key);
  const [filters, setFilters] = useState({
    search:"",
    volume:"",
    issue:"",
    year:"",
    month:"",
  });

  const filteredCards = useFilteredCards(catalystCards, filters);

  const Active = variants.find((item) => item.key === variant).Component;

  return (
    <div>
      <FilterBar allCards={catalystCards} filters={filters} setFilters={setFilters} />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {variants.map((item) => (
          <button
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
              variant === item.key
                ?"bg-[#1A2D51] text-parchment"
                :"border border-line-light text-ink-soft hover:border-red hover:text-ink"
            }`}
            key={item.key}
            onClick={() => setVariant(item.key)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <Active catalystCards={filteredCards} />
    </div>
  );
}
