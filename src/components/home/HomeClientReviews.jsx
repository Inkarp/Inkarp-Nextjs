"use client";

import { FaStar } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import RecTag from "./RecTag";
import { googleReviews, googleReviewsSummary } from "@/data/homeSections";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-red">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar className={i < rating ? "" : "text-line-light"} key={i} />
      ))}
    </div>
  );
}

export default function HomeClientReviews() {
  const reviewLoop = [...googleReviews, ...googleReviews];

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
            className="inline-flex items-center gap-2 border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
            href={googleReviewsSummary.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            See us on Google
            <FiArrowRight aria-hidden="true" />
          </a>
        </div>

        <div className="mt-10 overflow-hidden">
          <div className="-mx-2.5">
            <div className="home-review-marquee flex w-max items-stretch">
              {reviewLoop.map((review, index) => {
                const isDuplicate = index >= googleReviews.length;

                return (
                  <div
                    aria-hidden={isDuplicate ? "true" : undefined}
                    className="w-[min(82vw,360px)] shrink-0 px-2.5 sm:w-[340px] lg:w-[380px]"
                    key={`${review.id}-${index}`}
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .home-review-marquee {
          animation: home-review-marquee 52s linear infinite;
        }

        .home-review-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes home-review-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-review-marquee {
            animation: none;
            overflow-x: auto;
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
