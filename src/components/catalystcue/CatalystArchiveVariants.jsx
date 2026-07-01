"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

function formatVolumeLabel(volume = "") {
  return volume.replace("-", " ");
}

function parseDate(dateStr = "") {
  const parts = dateStr.trim().split(" ");
  return { month: parts[0] || "", year: parts[1] || "" };
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
          (card.title || "").toLowerCase().includes(s) ||
          (card.subTitle || "").toLowerCase().includes(s) ||
          (card.Date || "").toLowerCase().includes(s) ||
          (card.Volume || "").toLowerCase().includes(s);
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

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const SELECT_CLASS =
  "h-9 appearance-none cursor-pointer rounded-full border border-zinc-200 bg-white pl-3 pr-8 text-sm text-zinc-700 focus:border-[#BE0010] focus:outline-none focus:ring-1 focus:ring-[#BE0010]/30 transition";

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
        const na = Number.parseInt(a.split(" ")[1], 10);
        const nb = Number.parseInt(b.split(" ")[1], 10);
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
    setFilters({ search: "", volume: "", issue: "", year: "", month: "" });

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[180px] flex-1">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          className="h-9 w-full rounded-full border border-zinc-200 bg-white pl-9 pr-4 text-sm placeholder-zinc-400 focus:border-[#BE0010] focus:outline-none focus:ring-1 focus:ring-[#BE0010]/30 transition"
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
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400" />
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
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400" />
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
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400" />
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
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400" />
      </div>

      {hasFilters ? (
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 px-3 text-sm text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700"
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
      className="flex w-[220px] shrink-0 flex-col overflow-hidden border border-white bg-[#1A2D51] text-white transition-transform duration-500 hover:scale-105"
      href={`/magazine/${encodeURIComponent(card.slug)}`}
    >
      <Image
        alt={card.subTitle}
        className="h-[310px] w-[220px] object-cover"
        height={310}
        src={card.image}
        width={220}
      />
      <div className="flex min-h-10 items-center justify-center gap-2 p-2 text-center text-sm">
        <h3>{card.subTitle}</h3>
        <span>|</span>
        <p>{card.Date}</p>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center text-sm text-zinc-500">
      No issues match your filters.{" "}
      <span className="text-zinc-400">Try clearing some filters.</span>
    </div>
  );
}

export function ArchiveTabbed({ catalystCards }) {
  const { groupedByVolume, sortedVolumeKeys } = useGroupedVolumes(catalystCards);
  const [activeVolume, setActiveVolume] = useState(sortedVolumeKeys[0]);

  const activeCards = useMemo(() => {
    return [...(groupedByVolume[activeVolume] || [])].sort((a, b) => b.id - a.id);
  }, [groupedByVolume, activeVolume]);

  if (!catalystCards.length) return <EmptyState />;

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {sortedVolumeKeys.map((volume) => (
          <button
            className={`rounded-full px-5 py-2 text-sm font-bold uppercase transition ${
              activeVolume === volume
                ? "bg-[#BE0010] text-white"
                : "border border-zinc-300 text-zinc-600 hover:border-[#BE0010] hover:text-[#BE0010]"
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
        <div className="flex flex-wrap justify-center gap-8">
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
        const cards = [...groupedByVolume[volume]].sort((a, b) => b.id - a.id);

        return (
          <section key={volume}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold uppercase text-[#1A2D51]">
                {formatVolumeLabel(volume)}
              </h3>
              <span className="text-sm text-zinc-500">{cards.length} issues</span>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4">
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
    <div className="mx-auto max-w-5xl divide-y divide-zinc-200 border border-zinc-200">
      {sortedVolumeKeys.map((volume) => {
        const cards = [...groupedByVolume[volume]].sort((a, b) => b.id - a.id);
        const isOpen = openVolume === volume;

        return (
          <div key={volume}>
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold uppercase text-[#1A2D51]"
              onClick={() => setOpenVolume(isOpen ? null : volume)}
              type="button"
            >
              <span>{formatVolumeLabel(volume)}</span>
              <span className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                {cards.length} issues
                <FiChevronDown
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>
            {isOpen ? (
              <div className="flex flex-wrap justify-center gap-8 p-5">
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
    () => [...catalystCards].sort((a, b) => b.id - a.id),
    [catalystCards],
  );

  if (!catalystCards.length) return <EmptyState />;

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="relative space-y-10 border-l border-zinc-200 pl-6">
        {sorted.map((card) => (
          <li className="relative" key={card.slug}>
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-[#BE0010]" />
            <Link className="group flex gap-5" href={`/magazine/${encodeURIComponent(card.slug)}`}>
              <Image
                alt={card.subTitle}
                className="h-28 w-20 shrink-0 object-cover"
                height={112}
                src={card.image}
                width={80}
              />
              <div>
                <span className="text-xs font-bold uppercase text-[#BE0010]">
                  {formatVolumeLabel(card.Volume)} &middot; {card.subTitle}
                </span>
                <h3 className="mt-1 font-semibold text-[#1A2D51] transition-colors group-hover:text-[#BE0010]">
                  {card.metaTitle || card.title}
                </h3>
                <p className="text-sm text-zinc-500">{card.Date}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

const variants = [
  { key: "tabbed", label: "Tabbed Volumes", Component: ArchiveTabbed },
  { key: "shelves", label: "Horizontal Shelves", Component: ArchiveShelves },
  { key: "accordion", label: "Accordion List", Component: ArchiveAccordion },
  { key: "timeline", label: "Timeline View", Component: ArchiveTimeline },
];

export default function CatalystArchiveSwitcher({ catalystCards }) {
  const [variant, setVariant] = useState(variants[0].key);
  const [filters, setFilters] = useState({
    search: "",
    volume: "",
    issue: "",
    year: "",
    month: "",
  });

  const filteredCards = useFilteredCards(catalystCards, filters);
  const Active = variants.find((item) => item.key === variant).Component;

  return (
    <div>
      <FilterBar allCards={catalystCards} filters={filters} setFilters={setFilters} />

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {variants.map((item) => (
          <button
            className={`rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
              variant === item.key
                ? "bg-[#1A2D51] text-white"
                : "border border-zinc-300 text-zinc-600 hover:border-[#1A2D51] hover:text-[#1A2D51]"
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
