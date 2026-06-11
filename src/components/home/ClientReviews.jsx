"use client";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from "react-icons/fi";
import SectionHeading from "@/components/home/SectionHeading";
import { clientReviews } from "@/data/homeSections";

function getVisibleCount() {
  if (typeof window === "undefined") {
    return 3;
  }

  if (window.innerWidth >= 1024) {
    return 3;
  }

  if (window.innerWidth >= 768) {
    return 2;
  }

  return 1;
}

export default function ClientReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const maxIndex = Math.max(clientReviews.length - visibleCount, 0);
  const safeActiveIndex = Math.min(activeIndex, maxIndex);

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(getVisibleCount());
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex >= maxIndex ? 0 : currentIndex + 1
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [maxIndex]);

  const goToPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? maxIndex : currentIndex - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex >= maxIndex ? 0 : currentIndex + 1
    );
  };

  const visibleReviews = Array.from({ length: visibleCount }, (_, offset) => {
    const index = (safeActiveIndex + offset) % clientReviews.length;
    return clientReviews[index];
  });

  return (
    <section className="relative mx-auto w-[98%] overflow-hidden px-4 py-12 sm:px-6 lg:px-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_420px_at_15%_0%,rgba(190,0,16,0.08),transparent),radial-gradient(900px_420px_at_90%_100%,rgba(230,57,70,0.08),transparent)]" />

      <SectionHeading
        eyebrow="Reviews"
        title="What Our Customers Say About Us"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleReviews.map((review) => (
          <figure
            className="relative flex min-h-72 flex-col overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            key={`${review.name}-${review.message.slice(0, 20)}`}
          >
            <div className="h-1 bg-gradient-to-r from-[#BE0010] to-[#E63946]" />
            <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-lg bg-white p-3 text-[#BE0010] shadow-md">
              <FiMessageSquare aria-hidden="true" />
            </div>

            <blockquote className="flex flex-1 flex-col px-5 pb-6 pt-16 text-center">
              <p className="text-sm italic leading-7 text-zinc-700 sm:text-base">
                {review.message}
              </p>
              <figcaption className="font-maxot mt-auto pt-5 text-base font-bold text-zinc-950">
                {review.name}
              </figcaption>
            </blockquote>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          aria-label="Previous review"
          className="inline-flex size-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-900 shadow-sm transition hover:border-[#BE0010] hover:text-[#BE0010]"
          onClick={goToPrevious}
          type="button"
        >
          <FiChevronLeft />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              aria-label={`Show review set ${index + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                safeActiveIndex === index
                  ? "w-8 bg-[#BE0010]"
                  : "w-2.5 bg-zinc-300 hover:bg-zinc-500"
              }`}
              key={index}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label="Next review"
          className="inline-flex size-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-900 shadow-sm transition hover:border-[#BE0010] hover:text-[#BE0010]"
          onClick={goToNext}
          type="button"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
}
