"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getActiveCampaign, getEvergreenCampaign } from "@/data/campaigns";

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

function FallingParticles({ items, className }) {
  return items.map((item, index) => {
    const { emoji, ...style } = item;
    return (
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute select-none animate-[particle-fall_5s_linear_infinite] ${className ?? ""}`}
        key={index}
        style={style}
      >
        {emoji}
      </span>
    );
  });
}

const INDEPENDENCE_PARTICLES = [
  { left: "3%", emoji: "✨", fontSize: "0.8rem", animationDelay: "0s", animationDuration: "4.5s", "--particle-drift": "10px" },
  { left: "10%", emoji: "🌼", fontSize: "0.9rem", animationDelay: "1.1s", animationDuration: "5.2s", "--particle-drift": "-8px" },
  { left: "18%", emoji: "✨", fontSize: "0.65rem", animationDelay: "2.3s", animationDuration: "4s", "--particle-drift": "6px" },
  { left: "27%", emoji: "🌸", fontSize: "0.85rem", animationDelay: "0.6s", animationDuration: "5.6s", "--particle-drift": "-10px" },
  { right: "3%", emoji: "✨", fontSize: "0.8rem", animationDelay: "0.8s", animationDuration: "4.3s", "--particle-drift": "-10px" },
  { right: "10%", emoji: "🌼", fontSize: "0.9rem", animationDelay: "1.9s", animationDuration: "5s", "--particle-drift": "8px" },
  { right: "18%", emoji: "✨", fontSize: "0.65rem", animationDelay: "0.3s", animationDuration: "4.7s", "--particle-drift": "-6px" },
  { right: "27%", emoji: "🌸", fontSize: "0.85rem", animationDelay: "2.6s", animationDuration: "5.4s", "--particle-drift": "10px" },
];

const ASHOKA_SPOKES = Array.from({ length: 24 }, (_, i) => {
  const angle = (i * Math.PI) / 12;
  return {
    x2: (50 + 42 * Math.cos(angle)).toFixed(2),
    y2: (50 + 42 * Math.sin(angle)).toFixed(2),
  };
});

function WavingFlag() {
  return (
    <div className="flex shrink-0 items-center">
      <span
        aria-hidden="true"
        className="h-9 w-[3px] rounded-full bg-gradient-to-b from-neutral-300 to-neutral-500 sm:h-11 lg:h-12"
      />
      <div
        aria-hidden="true"
        className="relative h-9 w-14 origin-left overflow-hidden rounded-[2px] shadow-[0_2px_10px_rgba(0,0,0,0.35)] [transform-style:preserve-3d] animate-[flag-wave_2.4s_ease-in-out_infinite] sm:h-11 sm:w-16 lg:h-12 lg:w-[4.5rem]"
      >
        <div className="h-1/3 w-full bg-[#FF9933]" />
        <div className="flex h-1/3 w-full items-center justify-center bg-white">
          <svg className="h-[55%] w-[55%] text-[#000080]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" fill="currentColor" r="4" />
            {ASHOKA_SPOKES.map((spoke, index) => (
              <line
                key={index}
                stroke="currentColor"
                strokeWidth="2"
                x1="50"
                x2={spoke.x2}
                y1="50"
                y2={spoke.y2}
              />
            ))}
          </svg>
        </div>
        <div className="h-1/3 w-full bg-[#138808]" />
      </div>
    </div>
  );
}

function IndependenceFlagSlide({ campaign }) {
  return (
    // Soft tricolour wash — saffron to white to green — instead of a flat dark
    // panel, so the stripe reads as a celebration and keeps dark text legible.
    <div className="relative flex h-16 w-full items-center overflow-hidden bg-gradient-to-r from-[#FFDCB0] via-[#FFFDF8] to-[#C7E7BE] sm:h-20 lg:h-24">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#138808] via-white to-[#FF9933]"
      />
      {/* Faint Ashoka-blue glow behind the centre so the white band isn't flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#000080]/5 blur-3xl"
      />
      <FallingParticles className="text-amber-500" items={INDEPENDENCE_PARTICLES} />
      <div className="relative mx-auto flex w-full max-w-[1480px] items-center justify-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <WavingFlag />
        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-semibold text-[#0f1b2d] sm:text-base lg:text-lg">
            {campaign.title}
          </p>
          <p className="hidden truncate text-xs font-normal text-[#0f1b2d]/70 sm:block sm:text-sm">
            {campaign.message}
          </p>
        </div>
      </div>
    </div>
  );
}

const ANNIVERSARY_PARTICLES = [
  { left: "4%", emoji: "🎉", fontSize: "0.85rem", animationDelay: "0s", animationDuration: "4.4s", "--particle-drift": "10px" },
  { left: "12%", emoji: "✨", fontSize: "0.7rem", animationDelay: "1.4s", animationDuration: "5s", "--particle-drift": "-8px" },
  { left: "20%", emoji: "🌸", fontSize: "0.85rem", animationDelay: "2.1s", animationDuration: "4.8s", "--particle-drift": "8px" },
  { right: "4%", emoji: "🎊", fontSize: "0.85rem", animationDelay: "0.7s", animationDuration: "4.6s", "--particle-drift": "-10px" },
  { right: "12%", emoji: "✨", fontSize: "0.7rem", animationDelay: "1.9s", animationDuration: "5.3s", "--particle-drift": "6px" },
  { right: "20%", emoji: "🌸", fontSize: "0.85rem", animationDelay: "0.4s", animationDuration: "4.2s", "--particle-drift": "-6px" },
];

function InkarpAnniversarySlide({ campaign }) {
  return (
    <div className="relative flex h-16 w-full items-center overflow-hidden bg-gradient-to-r from-[#8c000d] via-red to-[#8c000d] sm:h-20 lg:h-24">
      <FallingParticles items={ANNIVERSARY_PARTICLES} />
      <div className="relative mx-auto flex w-full max-w-[1480px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-300/80 text-amber-300 sm:h-12 sm:w-12">
            <span className="text-xs font-bold sm:text-sm">41</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white sm:text-base lg:text-lg">
              {campaign.title}
            </p>
            <p className="hidden truncate text-xs font-normal text-white/75 sm:block sm:text-sm">
              {campaign.message}
            </p>
          </div>
        </div>
        {campaign.cta ? (
          <Link
            className="hidden shrink-0 items-center gap-1 rounded-full border border-white/50 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
            href={campaign.cta.href}
          >
            {campaign.cta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

// Year-round fallback slide, shown whenever no dated campaign is running.
function ExploreProductsSlide({ campaign }) {
  return (
    <div className="relative flex h-16 w-full items-center overflow-hidden border-y border-line-light bg-parchment-alt sm:h-20 lg:h-24">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red via-red/30 to-teal"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,var(--ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--ink)_1px,transparent_1px)] [background-size:34px_34px]"
      />
      <div className="relative mx-auto flex w-full max-w-[1480px] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-red/10 text-lg text-red sm:flex"
          >
            {campaign.icon}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink sm:text-base lg:text-lg">
              {campaign.title}
            </p>
            <p className="hidden truncate text-xs font-normal text-ink-soft sm:block sm:text-sm">
              {campaign.message}
            </p>
          </div>
        </div>

        {campaign.cta ? (
          <Link
            className="inline-flex shrink-0 items-center gap-2 border border-red bg-red px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red sm:px-6 sm:py-2.5 sm:text-sm"
            href={campaign.cta.href}
          >
            {campaign.cta.label}
            <span aria-hidden="true">→</span>
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

function CampaignSlide({ campaign }) {
  if (campaign.variant === "flag-wave") {
    return <IndependenceFlagSlide campaign={campaign} />;
  }
  if (campaign.variant === "inkarp-anniversary") {
    return <InkarpAnniversarySlide campaign={campaign} />;
  }
  if (campaign.variant === "explore-products") {
    return <ExploreProductsSlide campaign={campaign} />;
  }
  if (campaign.image) {
    return <ImageSlide campaign={campaign} />;
  }
  return <TextSlide campaign={campaign} />;
}

export default function HomeCampaignSlider() {
  // One stripe at a time: the highest-priority campaign whose date range covers
  // today, falling back to the evergreen promo. The evergreen entry is also what
  // renders on the server — the page is statically prerendered, so evaluating
  // dates during render would freeze the build date into the HTML and mismatch
  // on hydration. The real date is applied after mount instead.
  const [campaign, setCampaign] = useState(getEvergreenCampaign);

  useEffect(() => {
    setCampaign(getActiveCampaign() ?? getEvergreenCampaign());
  }, []);

  if (!campaign) {
    return null;
  }

  return (
    <section
      aria-label="Current promotion"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
    >
      <div key={campaign.id} className="animate-[hvc-fade_500ms_ease]">
        <CampaignSlide campaign={campaign} />
      </div>
    </section>
  );
}
