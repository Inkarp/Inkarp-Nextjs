"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiSearch,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import HeaderSearchModal from "@/components/common/HeaderSearchModal";
import { getAllProducts } from "@/data/products/principals";
import { heroSlides, homeBannerConfig } from "@/data/homeSlides";

const searchProducts = getAllProducts();

function getVideoType(src = "") {
  const extension = src.split("?")[0].split(".").pop()?.toLowerCase();

  return extension === "webm" ? "video/webm" : "video/mp4";
}

function hasSlideCaption(slide) {
  return Boolean(slide.title?.trim() || slide.subtitle?.trim());
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const isMutedRef = useRef(isMuted);
  const activeSlide = heroSlides[activeIndex];
  const isVideoSlide = activeSlide.media.type === "video";
  const hasCaption = hasSlideCaption(activeSlide);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (index) => {
      clearTimer();
      setActiveIndex((index + heroSlides.length) % heroSlides.length);
    },
    [clearTimer]
  );

  const goToNextSlide = useCallback(() => {
    clearTimer();
    setActiveIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
  }, [clearTimer]);

  const goToPreviousSlide = useCallback(() => {
    clearTimer();
    setActiveIndex(
      (currentIndex) => (currentIndex - 1 + heroSlides.length) % heroSlides.length
    );
  }, [clearTimer]);

  useEffect(() => {
    clearTimer();

    if (!isVideoSlide) {
      timerRef.current = window.setTimeout(
        goToNextSlide,
        homeBannerConfig.autoSlideDelay
      );

      return clearTimer;
    }

    const video = videoRef.current;

    if (!video) {
      timerRef.current = window.setTimeout(goToNextSlide, 6000);
      return clearTimer;
    }

    const advanceAfterVideo = () => {
      clearTimer();
      timerRef.current = window.setTimeout(
        goToNextSlide,
        homeBannerConfig.videoEndDelay
      );
    };

    const setFallbackTimer = () => {
      const duration = Number.isFinite(video.duration)
        ? video.duration * 1000
        : 6000;

      clearTimer();
      timerRef.current = window.setTimeout(
        advanceAfterVideo,
        duration + homeBannerConfig.videoEndDelay
      );
    };

    video.muted = isMutedRef.current;
    video.currentTime = 0;
    video.onended = advanceAfterVideo;
    video.onloadedmetadata = setFallbackTimer;

    if (Number.isFinite(video.duration) && video.duration > 0) {
      setFallbackTimer();
    } else {
      timerRef.current = window.setTimeout(advanceAfterVideo, 6000);
    }

    video.play().catch(() => {
      timerRef.current = window.setTimeout(goToNextSlide, 2500);
    });

    return () => {
      video.onended = null;
      video.onloadedmetadata = null;
      clearTimer();
    };
  }, [activeIndex, clearTimer, goToNextSlide, isVideoSlide]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const toggleSound = () => {
    const video = videoRef.current;
    const nextMutedState = !isMuted;

    isMutedRef.current = nextMutedState;
    setIsMuted(nextMutedState);

    if (video) {
      video.muted = nextMutedState;
      video.volume = 1;
      video.play().catch(() => {});
    }
  };

  return (
    <section className="relative bg-white py-2 sm:py-3">
      <div className="relative mx-auto h-[320px] w-[98%] max-w-[98vw] overflow-hidden rounded-xl bg-zinc-950 shadow-xl shadow-zinc-900/10 sm:h-[450px] md:h-[520px] lg:h-[680px]">
        <div className="absolute inset-0">
          {isVideoSlide ? (
            <video
              key={activeSlide.id}
              ref={videoRef}
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
              muted={isMuted}
              playsInline
              poster={activeSlide.media.poster}
              preload="auto"
            >
              <source
                src={activeSlide.media.src}
                type={getVideoType(activeSlide.media.src)}
              />
            </video>
          ) : (
            <Image
              key={activeSlide.id}
              alt={activeSlide.media.alt}
              className="object-cover transition-transform duration-700"
              fill
              priority={activeIndex === 0}
              sizes={activeSlide.media.sizes ?? "98vw"}
              src={activeSlide.media.src}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/10" />
        </div>

        <a
          className="absolute left-4 top-4 z-20 hidden items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-blue-700 md:flex"
          href={homeBannerConfig.linkedin.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {homeBannerConfig.linkedin.label}
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-white text-blue-600">
            <FaLinkedinIn />
          </span>
        </a>

        <button
          className="absolute right-3 top-3 z-20 inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-xl border-2 border-[#BE0010] bg-white/85 px-4 text-sm font-semibold text-zinc-800 shadow-md backdrop-blur transition hover:bg-white hover:text-[#BE0010] sm:right-5 sm:top-5 sm:min-w-60"
          onClick={() => setIsSearchOpen(true)}
          type="button"
        >
          <span className="absolute -right-2 -top-2 rounded-full bg-[#BE0010] px-2 py-0.5 text-[10px] font-bold text-white shadow">
            {homeBannerConfig.search.badge}
          </span>
          <FiSearch className="text-base" />
          {homeBannerConfig.search.label}
        </button>

        {isVideoSlide ? (
          <button
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="absolute bottom-16 right-4 z-20 inline-flex size-11 items-center justify-center rounded-full bg-black/65 text-xl text-white shadow-lg transition hover:bg-black/85 sm:bottom-6 sm:right-6"
            onClick={toggleSound}
            type="button"
          >
            {isMuted ? <FiVolumeX /> : <FiVolume2 />}
          </button>
        ) : null}

        {hasCaption ? (
          <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-4">
            <Link
              className="max-w-4xl rounded-t-2xl bg-white/90 px-5 py-4 text-center shadow-lg backdrop-blur transition hover:bg-white sm:px-8"
              href={activeSlide.href ?? "/products"}
            >
              {activeSlide.title?.trim() ? (
                <p className="inline-flex rounded-full border border-[#BE0010]/20 bg-white px-3 py-1 text-sm font-bold uppercase tracking-widest text-[#BE0010] sm:text-base">
                  {activeSlide.title}
                </p>
              ) : null}
              {activeSlide.subtitle?.trim() ? (
                <h1 className="font-maxot mt-2 text-lg font-bold uppercase leading-tight text-zinc-950 sm:text-2xl">
                  {activeSlide.subtitle}
                </h1>
              ) : null}
            </Link>
          </div>
        ) : null}

        <div className="absolute right-0 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3 rounded-l-xl bg-zinc-50 p-2 shadow-lg shadow-zinc-900/15 sm:p-3">
          <button
            aria-label="Previous banner"
            className="inline-flex size-9 items-center justify-center rounded-full bg-zinc-200 text-lg text-zinc-950 transition hover:bg-red-100 hover:text-[#BE0010] sm:size-10"
            onClick={goToPreviousSlide}
            type="button"
          >
            <FiChevronLeft />
          </button>
          <button
            aria-label="Next banner"
            className="inline-flex size-9 items-center justify-center rounded-full bg-zinc-200 text-lg text-zinc-950 transition hover:bg-red-100 hover:text-[#BE0010] sm:size-10"
            onClick={goToNextSlide}
            type="button"
          >
            <FiChevronRight />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5">
          {heroSlides.map((slide, index) => (
            <button
              aria-label={`Show ${slide.media.alt}`}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-8 bg-[#BE0010]"
                  : "w-2.5 bg-white/70 hover:bg-white"
              }`}
              key={slide.id}
              onClick={() => goToSlide(index)}
              type="button"
            />
          ))}
        </div>

        {activeIndex === homeBannerConfig.watchMore.slideIndex ? (
          <a
            className="absolute bottom-4 right-4 z-20 hidden items-center gap-2 rounded-full bg-red-50 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-lg transition hover:bg-[#BE0010] hover:text-white sm:flex"
            href={homeBannerConfig.watchMore.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#BE0010] text-white">
              <FiPlay />
            </span>
            {homeBannerConfig.watchMore.label}
          </a>
        ) : null}
      </div>

      <HeaderSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={searchProducts}
      />
    </section>
  );
}
