'use client';

import { useMemo, useState } from 'react';
import SectionDisclaimer from './SectionDisclaimer';

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
    <section id="standards" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px]">
        <div className="relative max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            <span className="inline-block size-2 bg-red" />
            Standards &amp; certificates
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {section?.title ?? 'Quality, safety & certification'}
          </h2>
          <p className="mt-4 text-base leading-7 text-black">
            {section?.description ?? `The certifications and safety standards behind ${productName ?? 'this product'}.`}
          </p>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                className={`h-10 border px-5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-black bg-red text-white'
                    : 'border-line-light bg-parchment text-black hover:border-red/30 hover:text-red'
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
              className="flex flex-col gap-4 border border-line-light bg-parchment p-5 transition hover:border-red/25-900/5 md:flex-row md:items-center md:justify-between"
              key={card.title}
            >
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
                <div className="inline-flex h-9 min-w-12 shrink-0 items-center justify-center border border-line-light bg-parchment-alt px-3 text-xs font-bold text-ink">
                  {card.badge}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug tracking-tight text-ink">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="mt-2 text-sm leading-6 text-black">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>

              {card.tags.length > 0 && (
                <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                  {card.tags.map((tag) => (
                    <span
                      className="inline-flex h-9 items-center border border-line-light bg-parchment-alt px-3 text-sm font-medium text-black"
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

        <SectionDisclaimer>
          Certifications and documentation are provided on request for product evaluation and compliance review. Final regulatory compliance remains your organisation&apos;s responsibility.
        </SectionDisclaimer>
      </div>
    </section>
  );
}
