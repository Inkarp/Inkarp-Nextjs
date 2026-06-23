"use client";

import { useEffect, useState } from "react";
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

  const visibleReviews = Array.from({ length: visibleCount }, (_, offset) => {
    const index = (safeActiveIndex + offset) % clientReviews.length;
    return clientReviews[index];
  });

  return (
    <section className="relative flex h-screen items-center overflow-hidden bg-[#fff3f4] px-4 py-8 sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center text-center">
          <p className="rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
            Testimonials
          </p>
          <h2 className="font-maxot mt-3 text-2xl leading-tight text-[#BE0010] sm:text-3xl">
            What Our Customers Say
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-0.5 w-10 bg-[#BE0010]" />
            <span className="h-2 w-2 bg-[#E63946]" />
            <span className="h-0.5 w-10 bg-[#BE0010]" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((review) => (
            <figure
              className="group relative flex min-h-[300px] flex-col"
              key={`${review.name}-${review.message.slice(0, 20)}`}
            >
              <blockquote className="relative flex flex-1 flex-col justify-center bg-white px-7 py-10 shadow-lg shadow-[#BE0010]/10 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-[#BE0010]/15 sm:px-9 dark:bg-zinc-900">
                <span className="absolute left-0 top-0 h-14 w-14 bg-[#fff3f4] [clip-path:polygon(0_0,100%_0,0_100%)] dark:bg-zinc-950" />
                <span
                  aria-hidden="true"
                  className="font-maxot absolute left-6 top-3 text-7xl leading-none text-[#BE0010]"
                >
                  &ldquo;
                </span>
                <p className="mx-auto max-w-sm pt-8 text-center text-sm italic leading-8 text-zinc-600 sm:text-base dark:text-zinc-400">
                  {review.message}
                </p>
                <span className="absolute -bottom-9 left-14 h-10 w-20 bg-white [clip-path:polygon(0_0,100%_0,0_100%)] dark:bg-zinc-900" />
              </blockquote>
              <figcaption className="mt-14 pl-0 sm:pl-1">
                <p className="font-maxot text-xl font-bold text-[#BE0010]">
                  {review.name}
                </p>
                <p className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-400">
                  Inkarp Customer
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
