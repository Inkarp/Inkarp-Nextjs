"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { campaigns } from "@/data/campaigns";

const AUTO_ROTATE_MS = 6000;

const ACCENT_TEXT_CLASSES = {
  red: "text-red",
  teal: "text-teal",
};

function TextSlide({ campaign }) {
  const accentTextClass = ACCENT_TEXT_CLASSES[campaign.accent] ?? ACCENT_TEXT_CLASSES.red;

  return (
    <div className="flex h-16 w-full items-center bg-parchment-alt text-ink sm:h-20 lg:h-24">
      <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className={`shrink-0 text-xl sm:text-2xl ${accentTextClass}`}>
            {campaign.icon}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold sm:text-base">{campaign.title}</p>
            <p className="hidden truncate text-xs font-normal text-ink-soft sm:block sm:text-sm">
              {campaign.message}
            </p>
          </div>
        </div>
        {campaign.cta ? (
          <Link
            className={`hidden shrink-0 items-center gap-1 rounded-full border border-current/40 px-4 py-1.5 text-xs font-semibold transition hover:bg-black/5 sm:inline-flex ${accentTextClass}`}
            href={campaign.cta.href}
          >
            {campaign.cta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ImageSlide({ campaign }) {
  const content = (
    <div className="relative h-16 w-full overflow-hidden sm:h-20 lg:h-24">
      <Image
        alt={campaign.title}
        className="object-cover"
        fill
        sizes="100vw"
        src={campaign.image}
      />
    </div>
  );

  if (!campaign.cta?.href) {
    return content;
  }

  return (
    <Link className="block" href={campaign.cta.href}>
      {content}
    </Link>
  );
}

export default function HomeCampaignSlider() {
  // Not date-gated on purpose — every entry in campaigns.js shows here
  // continuously. Add/remove entries in that file to control what's live.
  const slides = campaigns;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Current promotions"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(100 / slides.length) * activeIndex}%)`,
        }}
      >
        {slides.map((campaign) => (
          <div
            className="shrink-0"
            key={campaign.id}
            style={{ width: `${100 / slides.length}%` }}
          >
            {campaign.image ? (
              <ImageSlide campaign={campaign} />
            ) : (
              <TextSlide campaign={campaign} />
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink/20 px-2 py-1 backdrop-blur-sm">
          {slides.map((campaign, index) => (
            <button
              aria-label={`Show promotion ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
              key={campaign.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
