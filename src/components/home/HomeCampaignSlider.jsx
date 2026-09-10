"use client";

import Image from "next/image";
import GaneshCelebration from "./GaneshCelebration";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getActiveCampaigns, getEvergreenCampaign } from "@/data/campaigns";
import { webinars } from "@/data/webinars";
import { pushEvent } from "@/lib/analytics";

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

// Confetti and sparkles falling across the milestone stripe. Items carrying an
// `animationName` override the default fall with the twinkling variant.
const ANNIVERSARY_PARTICLES = [
  { left: "3%", emoji: "🎉", fontSize: "0.9rem", animationDelay: "0s", animationDuration: "4.4s", "--particle-drift": "12px" },
  { left: "9%", emoji: "✨", fontSize: "0.7rem", animationDelay: "1.4s", animationDuration: "5s", animationName: "sparkle-twinkle-fall", "--particle-drift": "-8px" },
  { left: "16%", emoji: "🎊", fontSize: "0.8rem", animationDelay: "2.6s", animationDuration: "4.8s", "--particle-drift": "8px" },
  { left: "24%", emoji: "✨", fontSize: "0.6rem", animationDelay: "0.9s", animationDuration: "5.4s", animationName: "sparkle-twinkle-fall", "--particle-drift": "10px" },
  { left: "33%", emoji: "🎇", fontSize: "0.85rem", animationDelay: "3.1s", animationDuration: "5.1s", "--particle-drift": "-10px" },
  { right: "3%", emoji: "🎊", fontSize: "0.9rem", animationDelay: "0.6s", animationDuration: "4.6s", "--particle-drift": "-12px" },
  { right: "9%", emoji: "✨", fontSize: "0.7rem", animationDelay: "2.1s", animationDuration: "5.2s", animationName: "sparkle-twinkle-fall", "--particle-drift": "6px" },
  { right: "16%", emoji: "🎉", fontSize: "0.8rem", animationDelay: "1.1s", animationDuration: "4.3s", "--particle-drift": "-6px" },
  { right: "24%", emoji: "✨", fontSize: "0.6rem", animationDelay: "3.4s", animationDuration: "5.5s", animationName: "sparkle-twinkle-fall", "--particle-drift": "-9px" },
  { right: "33%", emoji: "🎇", fontSize: "0.85rem", animationDelay: "1.8s", animationDuration: "4.9s", "--particle-drift": "9px" },
];

/** 1 -> st, 2 -> nd, 3 -> rd, 11-13 -> th, everything else th. */
function ordinalSuffix(value) {
  const lastTwo = value % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return "th";
  switch (value % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * The milestone figure rolls up to its final value like an odometer: each digit
 * is keyed by position and value, so changing one replays the roll-in. The final
 * number is what renders on the server, so there is no layout shift and nothing
 * to mismatch on hydration — the climb only starts after mount.
 */
function RollingYears({ years }) {
  const [shown, setShown] = useState(years);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const from = Math.max(0, years - 9);
    setShown(from);

    let current = from;
    let gap = 60;
    let timer = window.setTimeout(function step() {
      current += 1;
      setShown(current);
      if (current >= years) return;
      // Widening gap so the climb decelerates into the milestone.
      gap += 26;
      timer = window.setTimeout(step, gap);
    }, 260);

    return () => window.clearTimeout(timer);
  }, [years]);

  return (
    <span className="relative z-10 flex items-start leading-none text-red">
      <span className="flex h-[1.05em] items-center overflow-hidden text-[15px] font-bold tabular-nums sm:text-lg lg:text-xl">
        {String(shown)
          .split("")
          .map((digit, index) => (
            <span
              className="motion-safe:animate-[hvc-count-flip_340ms_ease-out]"
              key={`${index}-${digit}`}
            >
              {digit}
            </span>
          ))}
      </span>
      <span className="ml-px text-[8px] font-bold uppercase sm:text-[9px]">
        {ordinalSuffix(years)}
      </span>
    </span>
  );
}

function InkarpAnniversarySlide({ campaign }) {
  const years = campaign.years ?? 0;

  return (
    <div className="relative flex h-16 w-full items-center overflow-hidden border-y border-rose-100 bg-[linear-gradient(110deg,#FFF7F7_0%,#FFE3E6_26%,#FFF1F2_50%,#FFE3E6_74%,#FFF7F7_100%)] bg-[length:220%_100%] motion-safe:animate-[celebration-shimmer_9s_ease-in-out_infinite] sm:h-20 lg:h-24">
      {/* Red ribbon edges top and bottom. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-red/55 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-red/55 to-transparent"
      />
      {/* Soft blush pool behind the medallion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-40 w-80 -translate-y-1/2 rounded-full bg-red/10 blur-3xl"
      />
      <FallingParticles items={ANNIVERSARY_PARTICLES} />

      <div className="relative mx-auto flex w-full max-w-[1480px] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="relative flex size-11 shrink-0 items-center justify-center sm:size-14 lg:size-16">
            {/* Turning dashed ring. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-dashed border-red/45 motion-safe:animate-[hvc-spin_16s_linear_infinite]"
            />
            {/* Inner disc with a slow celebratory pulse. */}
            <span
              aria-hidden="true"
              className="absolute inset-[3px] rounded-full bg-white ring-1 ring-red/25 motion-safe:animate-[celebration-glow_3.4s_ease-in-out_infinite]"
              style={{ "--glow-color": "rgba(190, 0, 16, 0.22)" }}
            />
            {/* Light sweeping across the medallion face. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[3px] overflow-hidden rounded-full"
            >
              <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-red/15 to-transparent motion-safe:animate-[hvc-count-sheen_3.6s_ease-in-out_infinite]" />
            </span>
            <RollingYears years={years} />
          </div>

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
            className="inline-flex shrink-0 items-center gap-2 border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50 sm:px-6 sm:py-2.5 sm:text-sm"
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

/**
 * Whole days until `isoDate`, or null until mounted. The page is prerendered, so
 * counting on the server would freeze the build date into the HTML; the dash
 * shows for one frame and is replaced on hydration.
 */
function useDaysUntil(isoDate) {
  const [days, setDays] = useState(null);

  useEffect(() => {
    if (!isoDate) return undefined;

    const compute = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(`${isoDate}T00:00:00`);
      target.setHours(0, 0, 0, 0);
      setDays(Math.max(0, Math.ceil((target - today) / 86400000)));
    };

    compute();
    // A tab left open overnight should not show yesterday's count.
    const timer = window.setInterval(compute, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [isoDate]);

  return days;
}

function countdownLabel(days) {
  if (days === null) return "Coming up";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

function CountdownPill({ className = "", days }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px] ${className}`}
    >
      {days !== null && days <= 1 ? (
        <span aria-hidden="true" className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      ) : null}
      {countdownLabel(days)}
    </span>
  );
}

// Dated webinar: the countdown is the reason this outperforms a plain date.
function WebinarCountdownSlide({ campaign }) {
  const webinar = webinars.find((item) => item.id === campaign.webinarId);
  const days = useDaysUntil(webinar?.date ?? campaign.end);

  return (
    <div className="relative flex h-16 w-full items-center overflow-hidden border-y border-teal/20 bg-[linear-gradient(105deg,#F2FAF9_0%,#E4F3F1_50%,#F2FAF9_100%)] sm:h-20 lg:h-24">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-teal"
      />
      <div className="relative mx-auto flex w-full max-w-[1480px] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-teal/10 text-lg sm:flex"
          >
            {campaign.icon}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CountdownPill className="bg-teal text-white" days={days} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-teal sm:text-[11px]">
                Live webinar
              </span>
            </div>
            <p className="mt-0.5 truncate text-sm font-semibold text-ink sm:text-base">
              {campaign.title}
            </p>
            {webinar?.date1 ? (
              <p className="hidden truncate text-xs text-ink-soft sm:block">{webinar.date1}</p>
            ) : null}
          </div>
        </div>

        {campaign.cta ? (
          <Link
            className="inline-flex shrink-0 items-center gap-2 border border-teal/30 bg-white px-4 py-2 text-xs font-semibold text-teal transition hover:-translate-y-0.5 hover:bg-teal hover:text-white sm:px-6 sm:py-2.5 sm:text-sm"
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

/** Internal links route; an organiser's registration page opens in a new tab. */
function CampaignCta({ campaign, cta }) {
  const className =
    "inline-flex shrink-0 items-center gap-2 border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 sm:px-6 sm:py-2.5 sm:text-sm";
  const trackClick = () => pushEvent("campaign_cta_clicked", { campaign_id: campaign.id, campaign_title: campaign.title });

  if (cta.external) {
    return (
      <a className={className} href={cta.href} onClick={trackClick} rel="noopener noreferrer" target="_blank">
        {cta.label}
        <span aria-hidden="true">→</span>
      </a>
    );
  }

  return (
    <Link className={className} href={cta.href} onClick={trackClick}>
      {cta.label}
      <span aria-hidden="true">→</span>
    </Link>
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
            className="inline-flex shrink-0 items-center gap-2 border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 sm:px-6 sm:py-2.5 sm:text-sm"
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
  if (campaign.variant === "ganesh-chaturthi") {
    return <GaneshCelebration campaign={campaign} />;
  }
  if (campaign.variant === "webinar-countdown") {
    return <WebinarCountdownSlide campaign={campaign} />;
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
  // Every campaign whose date range covers today, highest priority first. The
  // evergreen promo renders on the server — the page is statically prerendered,
  // so evaluating dates during render would freeze the build date into the HTML.
  const [slides, setSlides] = useState(() => {
    const evergreen = getEvergreenCampaign();
    return evergreen ? [evergreen] : [];
  });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Resolve the visitor's date after hydration, keeping prerendered HTML stable.
    const frame = window.requestAnimationFrame(() => {
      const active = getActiveCampaigns();
      const evergreen = getEvergreenCampaign();
      const exclusive = active.find((campaign) => campaign.exclusive);
      const next = exclusive ? [exclusive] : active.length ? active : evergreen ? [evergreen] : [];
      setSlides(next);
      setIndex(0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const campaign = slides[index];
  if (!campaign) return null;

  return (
    <section
      aria-label={campaign.type === "festival" ? "Festive wishes from Inkarp" : "Current promotion"}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
    >
      <div key={campaign.id} className="animate-[hvc-fade_500ms_ease]">
        <CampaignSlide campaign={campaign} />
      </div>

      {slides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-1.5 hidden justify-center gap-1.5 sm:flex">
          {slides.map((slide, slideIndex) => (
            <button
              aria-label={`Show ${slide.title}`}
              className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                slideIndex === index ? "w-5 bg-ink/45" : "w-1.5 bg-ink/20 hover:bg-ink/35"
              }`}
              key={slide.id}
              onClick={() => setIndex(slideIndex)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
