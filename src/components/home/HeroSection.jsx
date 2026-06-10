"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { heroSlides } from "@/data/homeSlides";

const autoSlideDelay = 5000;

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = heroSlides[activeIndex];

  const goToSlide = (index) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    goToSlide(activeIndex + 1);
  };

  const goToPreviousSlide = () => {
    goToSlide(activeIndex - 1);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
    }, autoSlideDelay);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative min-h-[calc(100vh-6rem)]">
        {heroSlides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <article
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              } ${slide.theme}`}
              key={slide.title}
            >
              <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
                <div className="relative z-10 max-w-2xl">
                  <p className="font-maxot text-sm font-semibold uppercase text-[#BE0010]">
                    {slide.eyebrow}
                  </p>
                  <h1 className="font-maxot mt-5 text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-8 text-zinc-600 sm:text-lg">
                    {slide.description}
                  </p>
                  <Link
                    className="mt-8 inline-flex h-12 items-center rounded-md bg-[#BE0010] px-6 text-sm font-semibold text-white transition hover:bg-[#9f000d]"
                    href={slide.href}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {slide.cta}
                  </Link>
                </div>

                <div className="relative min-h-72 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 sm:min-h-96 lg:min-h-[520px]">
                  {slide.media.type === "video" ? (
                    <video
                      autoPlay
                      className="h-full w-full object-cover"
                      loop
                      muted
                      playsInline
                      poster={slide.media.poster}
                    >
                      <source src={slide.media.src} />
                    </video>
                  ) : (
                    <Image
                      alt={slide.media.alt}
                      className={`p-10 ${
                        slide.media.fit === "contain"
                          ? "object-contain"
                          : "object-cover"
                      }`}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1024px) 52vw, 100vw"
                      src={slide.media.src}
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          <button
            aria-label="Previous slide"
            className="inline-flex size-11 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-900 shadow-lg shadow-zinc-900/10 transition hover:border-[#BE0010] hover:text-[#BE0010]"
            onClick={goToPreviousSlide}
            type="button"
          >
            <FiArrowLeft />
          </button>

          <div className="flex items-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                aria-label={`Go to ${slide.eyebrow} slide`}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-8 bg-[#BE0010]"
                    : "w-2.5 bg-zinc-300 hover:bg-zinc-500"
                }`}
                key={slide.title}
                onClick={() => goToSlide(index)}
                type="button"
              />
            ))}
          </div>

          <button
            aria-label="Next slide"
            className="inline-flex size-11 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-900 shadow-lg shadow-zinc-900/10 transition hover:border-[#BE0010] hover:text-[#BE0010]"
            onClick={goToNextSlide}
            type="button"
          >
            <FiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
