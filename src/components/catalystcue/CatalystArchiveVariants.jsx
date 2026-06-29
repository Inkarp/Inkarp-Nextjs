"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

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

function formatVolumeLabel(volume = "") {
  return volume.replace("-", " ");
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

export function ArchiveTabbed({ catalystCards }) {
  const { groupedByVolume, sortedVolumeKeys } = useGroupedVolumes(catalystCards);
  const [activeVolume, setActiveVolume] = useState(sortedVolumeKeys[0]);

  const activeCards = useMemo(() => {
    return [...(groupedByVolume[activeVolume] || [])].sort((a, b) => b.id - a.id);
  }, [groupedByVolume, activeVolume]);

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
      <div className="flex flex-wrap justify-center gap-8">
        {activeCards.map((card) => (
          <IssueCard card={card} key={card.slug} />
        ))}
      </div>
    </div>
  );
}

export function ArchiveShelves({ catalystCards }) {
  const { groupedByVolume, sortedVolumeKeys } = useGroupedVolumes(catalystCards);

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
    [catalystCards]
  );

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
  const Active = variants.find((item) => item.key === variant).Component;

  return (
    <div>
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
      <Active catalystCards={catalystCards} />
    </div>
  );
}
