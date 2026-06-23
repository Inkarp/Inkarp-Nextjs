'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const CATEGORY_STYLES = {
  Pharma: {
    badge: 'Pharma',
    badgeClass:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    avatarClass:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  Food: {
    badge: 'Food',
    badgeClass:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    avatarClass:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  Plastics: {
    badge: 'Plastics',
    badgeClass:
      'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
    avatarClass:
      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  },
  Chemicals: {
    badge: 'Chem',
    badgeClass:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    avatarClass:
      'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  },
};

export default function CustomerReviews({ reviews = [] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  if (!reviews.length) return null;

  const filters = [
    'All',
    ...Array.from(new Set(reviews.map((review) => review.category))).filter(Boolean),
  ];

  const visibleReviews =
    activeFilter === 'All'
      ? reviews
      : reviews.filter((review) => review.category === activeFilter);

  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Section 08 — Customer Reviews
        </p>
        <h2 className="font-maxot mt-2 text-2xl font-bold leading-tight text-zinc-950 sm:text-3xl dark:text-zinc-100">
          What Indian labs are saying
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-400">
          Filter by your industry to find relevant experiences from labs across India.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              className={`inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${
                activeFilter === filter
                  ? 'border-[#BE0010] bg-[#BE0010] text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-[#BE0010]/40 hover:text-[#BE0010] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
              }`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((review) => {
            const style = CATEGORY_STYLES[review.category] ?? {
              badge: review.category,
              badgeClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
              avatarClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
            };

            return (
              <article
                className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                key={`${review.name}-${review.location}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        className={i < review.rating ? '' : 'text-zinc-200 dark:text-zinc-700'}
                        key={i}
                      />
                    ))}
                  </div>
                  <span
                    className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ${style.badgeClass}`}
                  >
                    {style.badge}
                  </span>
                </div>

                <p className="mt-4 flex-1 text-sm italic leading-7 text-zinc-700 dark:text-zinc-300">
                  &ldquo;{review.quote}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.avatarClass}`}
                  >
                    {review.initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-zinc-950 dark:text-zinc-100">
                      {review.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {review.role} · {review.location}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
