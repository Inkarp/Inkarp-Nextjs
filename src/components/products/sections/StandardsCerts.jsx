'use client';

import { useMemo, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'safety', label: 'Safety' },
  { key: 'quality', label: 'Quality' },
];

function getCategory(card) {
  if (card.category) return card.category;

  const title = card.title.toLowerCase();
  if (title.includes('ce') || title.includes('nrtl') || title.includes('continuous')) {
    return 'certifications';
  }
  if (title.includes('thermal') || title.includes('safety') || title.includes('heat')) {
    return 'safety';
  }
  return 'quality';
}

function getBadge(card) {
  if (card.badge) return card.badge;

  const title = card.title.toLowerCase();
  if (title.includes('ce')) return 'CE';
  if (title.includes('nrtl')) return 'NRTL';
  if (title.includes('continuous')) return 'Continuous';
  if (title.includes('thermal')) return '50 deg C';
  if (title.includes('bath')) return 'V4A';
  if (title.includes('germany')) return 'DE';
  return 'QA';
}

function getTags(card) {
  if (Array.isArray(card.tags) && card.tags.length) return card.tags;

  const title = card.title.toLowerCase();
  if (title.includes('ce')) return ['EU', 'Conformity'];
  if (title.includes('nrtl')) return ['Safety', 'North America'];
  if (title.includes('continuous')) return ['24/7', 'Reliability'];
  if (title.includes('thermal')) return ['Protection', 'Bath safety'];
  if (title.includes('bath')) return ['Durability', 'Cleanability'];
  if (title.includes('germany')) return ['German build', 'Quality'];
  return [];
}

export default function StandardsCerts({ cards = [], section, productName }) {
  const [activeFilter, setActiveFilter] = useState('certifications');

  const enrichedCards = useMemo(
    () =>
      cards.map((card) => ({
        ...card,
        badge: getBadge(card),
        category: getCategory(card),
        tags: getTags(card),
      })),
    [cards]
  );

  const visibleCards =
    activeFilter === 'all'
      ? enrichedCards
      : enrichedCards.filter((card) => card.category === activeFilter);

  if (!cards.length) return null;

  return (
    <section id="standards" className="scroll-mt-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 -top-8 select-none font-maxot text-[120px] font-bold leading-none text-zinc-100 dark:text-zinc-900 sm:text-[150px]"
        >
          16
        </span>

        <div className="relative max-w-3xl">
          <p className="font-maxot flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-black dark:text-zinc-100">
            <span className="inline-block size-2 rounded-full bg-[#BE0010]" />
            Standards &amp; certificates
          </p>
          <h2 className="font-maxot mt-4 text-3xl font-bold leading-tight text-black dark:text-zinc-100 sm:text-4xl">
            {section?.title ?? 'Quality, safety & certification'}
          </h2>
          <p className="mt-4 text-base leading-7 text-black dark:text-zinc-400">
            {section?.description ?? `The certifications and safety standards behind ${productName ?? 'this product'}.`}
          </p>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                className={`h-10 rounded-full border px-5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-[#BE0010] bg-[#BE0010] text-white shadow-sm shadow-[#BE0010]/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 hover:border-[#BE0010]/30 hover:text-[#BE0010]'
                }`}
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                type="button"
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 space-y-3">
          {visibleCards.map((card) => (
            <article
              className="flex flex-col gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition hover:border-[#BE0010]/25 hover:shadow-lg hover:shadow-zinc-900/5 md:flex-row md:items-center md:justify-between"
              key={card.title}
            >
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
                <div className="inline-flex h-9 min-w-12 shrink-0 items-center justify-center rounded-full border border-[#BE0010]/20 bg-[#fff3f4] px-3 text-xs font-bold text-[#BE0010]">
                  {card.badge}
                </div>
                <div className="min-w-0">
                  <h3 className="font-maxot text-base font-bold leading-snug text-black dark:text-zinc-100">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="mt-2 text-sm leading-6 text-black dark:text-zinc-400">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>

              {card.tags.length > 0 && (
                <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                  {card.tags.map((tag) => (
                    <span
                      className="inline-flex h-9 items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm font-medium text-black dark:text-zinc-100"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="relative mt-5 flex max-w-4xl gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-xs leading-5 text-black dark:text-zinc-400">
          <FiInfo className="mt-0.5 size-4 shrink-0 text-black dark:text-zinc-400" />
          <p>
            Disclaimer: certifications and documentation are provided on request for product evaluation and compliance review. Final regulatory compliance remains your organisation's responsibility.
          </p>
        </div>
      </div>
    </section>
  );
}
