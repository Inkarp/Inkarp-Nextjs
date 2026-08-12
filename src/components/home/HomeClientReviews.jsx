"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import RecTag from "./RecTag";
import { googleReviews, googleReviewsSummary } from "@/data/homeSections";

const AUTO_ROTATE_MS = 6000;

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-red">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar className={i < rating ? "" : "text-line-light"} key={i} />
      ))}
    </div>
  );
}

// 3 cards per page on desktop, 2 on tablet, 1 on mobile.
function useCardsPerPage() {
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const tablet = window.matchMedia("(min-width: 640px)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => setPerPage(desktop.matches ? 3 : tablet.matches ? 2 : 1);

    update();
    tablet.addEventListener("change", update);
    desktop.addEventListener("change", update);
    return () => {
      tablet.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  return perPage;
}

export default function HomeClientReviews() {
  const perPage = useCardsPerPage();
  const pageCount = Math.max(1, Math.ceil(googleReviews.length / perPage));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  // Keep the page in range when the breakpoint changes.
  const safePage = Math.min(page, pageCount - 1);

  useEffect(() => {
    if (pageCount < 2 || paused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [pageCount, paused]);

  return (
    <section className="bg-parchment-alt py-[78px]" id="client-reviews" data-reveal>
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <RecTag>Rated By Our Customers</RecTag>
        <h2 className="max-w-2xl text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
          What labs say about working with us
        </h2>
        <p className="mt-3 max-w-xl text-sm text-ink-soft">
          Real reviews from the researchers and labs we support across India.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5 rounded-xl border border-line-light bg-white px-6 py-5">
            <div>
              <div className="text-4xl font-semibold text-ink">{googleReviewsSummary.rating}</div>
              <StarRating rating={5} />
            </div>
            <div className="h-10 w-px bg-line-light" />
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="flex size-6 items-center justify-center rounded-full bg-red/10 text-xs font-bold text-red">
                  G
                </span>
                Google Reviews
              </div>
              <p className="mt-0.5 text-xs text-ink-soft">
                Based on {googleReviewsSummary.count} reviews
              </p>
            </div>
          </div>

          <a
            className="inline-flex items-center gap-2 bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-soft"
            href={googleReviewsSummary.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            See us on Google
            <FiArrowRight aria-hidden="true" />
          </a>
        </div>

        <div
          className="mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* -mx-2.5 cancels the per-slide gutter so cards align with the section edges. */}
          <div className="-mx-2.5 overflow-hidden">
            <div
              className="flex items-stretch transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${safePage * 100}%)` }}
            >
              {googleReviews.map((review) => (
                <div
                  className="shrink-0 px-2.5"
                  key={review.id}
                  style={{ width: `${100 / perPage}%` }}
                >
                  <div className="flex h-full flex-col rounded-xl border border-line-light bg-white p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red/10 text-sm font-bold text-red">
                        {review.initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{review.name}</p>
                        <p className="text-xs text-ink-soft">{review.date}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ink-soft">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pageCount > 1 ? (
            <div className="mt-7 flex items-center justify-center gap-4">
              <button
                aria-label="Previous reviews"
                className="flex size-9 items-center justify-center rounded-full border border-line-light bg-white text-ink-soft transition hover:border-red hover:text-red"
                onClick={() => setPage((current) => (current - 1 + pageCount) % pageCount)}
                type="button"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    aria-label={`Show reviews page ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      safePage === index ? "w-6 bg-red" : "w-2 bg-ink-soft/25 hover:bg-ink-soft/45"
                    }`}
                    key={index}
                    onClick={() => setPage(index)}
                    type="button"
                  />
                ))}
              </div>

              <button
                aria-label="Next reviews"
                className="flex size-9 items-center justify-center rounded-full border border-line-light bg-white text-ink-soft transition hover:border-red hover:text-red"
                onClick={() => setPage((current) => (current + 1) % pageCount)}
                type="button"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
