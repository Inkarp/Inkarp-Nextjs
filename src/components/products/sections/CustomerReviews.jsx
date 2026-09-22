'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import RecTag from '@/components/home/RecTag';

export default function CustomerReviews({ reviews = [] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  if (!reviews.length) return null;

  const filters = ['All', ...Array.from(new Set(reviews.map((review) => review.category))).filter(Boolean)];
  const visibleReviews = activeFilter === 'All' ? reviews : reviews.filter((review) => review.category === activeFilter);

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag>Customer Reviews</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              What Indian labs are saying.
            </h2>
          </div>
          <p className="max-w-[430px] text-sm leading-6 text-ink-soft">
            Filter by your industry to find relevant experiences from labs across India.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              className={`flex h-10 w-full items-center justify-center border px-4 text-sm font-semibold transition sm:inline-flex sm:w-auto ${
                activeFilter === filter
                  ? 'border-red bg-red text-white'
                  : 'border-line-light bg-white text-ink-soft hover:border-red hover:text-red'
              }`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((review) => (
            <article className="flex flex-col border border-line-light bg-parchment-alt p-6" key={`${review.name}-${review.location}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-0.5 text-red">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar className={i < review.rating ? '' : 'text-line-light'} key={i} />
                  ))}
                </div>
                <span className="border border-line-light bg-white px-2.5 py-1 text-xs font-semibold text-ink-soft">
                  {review.category ?? 'Lab'}
                </span>
              </div>

              <p className="mt-4 flex-1 text-sm italic leading-7 text-ink-soft">
                &ldquo;{review.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center bg-red text-sm font-bold text-white">
                  {review.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{review.name}</p>
                  <p className="text-xs text-ink-soft">{review.role} - {review.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}