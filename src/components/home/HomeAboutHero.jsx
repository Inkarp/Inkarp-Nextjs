"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiCalendar, FiMapPin } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import RecTag from "./RecTag";
import { featuredEvent } from "@/data/events";

const AUTO_ROTATE_MS = 3000;
const BUILDING_IMAGE = "/assets/our-story/InkarpBuilding.jpg";
const ANNIVERSARY_VIDEO = "/assets/41-anniversary-animation.mp4";
const LAB_IMAGE = "/assets/home/inkarp-lab-hero-generated.png";
// The dedicated stall photo — same asset the home events row uses for this
// event's card — rather than the wider Event1.jpeg shared with the campaign strip.
const ANALYTICA_STALL_IMAGE = "/assets/events/analytica-2026.webp";
// Cropped from the official analytica banner artwork (public/analyticaLogo.jpg) —
// just the icon + wordmark, so it can sit inline in place of the event name.
const ANALYTICA_LOGO = "/assets/events/analytica-logo.png";


/*
function SlideWorkflow() {
  return (
    <div className="bg-white px-4 pb-15 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="max-w-[16ch] text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Your lab has a workflow. 
              <em className="italic text-red">We help build the right{" "} solution</em> around it.
            </h1>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              From global technologies to Inkarp&apos;s own solutions, we match your requirement
              with the right fit, guidance, and support path.
            </p>

            <div className="mb-11 flex flex-wrap gap-3.5">
              <Link
                href="#categories"
                className="border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
              >
                Find My Industry
              </Link>
              <Link
                href="/workflows"
                className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                See a Workflow
              </Link>
            </div>
          </div>

          <div className="relative border border-line-light bg-parchment-alt p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white">
              <Image
                src={LAB_IMAGE}
                alt="Modern scientific laboratory with Inkarp instrumentation workflow"
                loading="eager"
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

function SlideAbout() {
  const openSolutionFinder = () => {
    window.dispatchEvent(new CustomEvent("inkarp:open-solution-finder"));
  };

  return (
    <div className="bg-white px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="flex flex-col">
            <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              <div className="relative flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-red text-center text-red sm:h-[104px] sm:w-[104px]">
                <div className="absolute inset-2 rounded-full border border-dashed border-red/40" />
                <span className="text-[19px] font-semibold tracking-wide">1985</span>
                <span className="mt-0.5 text-[8.5px] uppercase tracking-[0.16em]">Est. &amp; Trusted</span>
              </div>
              <div>
                <RecTag>About Inkarp</RecTag>
                {/* Page-level h1 — the only one on the homepage. Every other
                    section heads with an h2. */}
                <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                  Four decades of supporting
                  <br />
                  India&apos;s <em className="italic text-red">laboratories.</em>
                </h1>
              </div>
            </div>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              Since 1985, Inkarp has helped Indian laboratories move from scientific need to
              supported use — bringing together global principals, product lines, application
              guidance, installation support, and service across India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5 lg:mt-auto lg:pb-1">
              <Link
                href="/products"
                className="border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
              >
                Browse Solutions
              </Link>
              <button
                onClick={openSolutionFinder}
                type="button"
                className="group relative isolate overflow-hidden rounded-full bg-[linear-gradient(110deg,#8f000c_0%,#be0010_45%,#e3232d_100%)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(190,0,16,0.3)] ring-1 ring-red/20 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(190,0,16,0.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-red"
              >
                <span aria-hidden="true" className="absolute inset-y-0 -left-1/2 -z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]" />
                <span className="inline-flex items-center gap-2.5">
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <HiSparkles aria-hidden="true" className="text-white motion-safe:animate-pulse" />
                  </span>
                  Help me choose an instrument
                  <FiArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>

          <div className="relative border border-line-light bg-parchment-alt p-4.5 lg:flex lg:flex-col before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white lg:aspect-auto lg:flex-1">
              {/* Muted is what lets it start on its own: browsers block autoplay with sound. */}
              <video
                aria-label="Inkarp 41st anniversary animation"
                autoPlay
                className="absolute inset-0 h-full w-full object-cover"
                loop
                muted
                playsInline
                preload="auto"
                src={ANNIVERSARY_VIDEO}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytica hero slide — disabled until it's needed again; uncomment this
// block and add SlideAnalytica back to SLIDES below to bring it back.
/*
function useTimeUntil(startsAt) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!startsAt) return undefined;
    const target = new Date(startsAt).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setRemaining({ state: "live" });
        return;
      }
      const totalMinutes = Math.floor(diff / 60000);
      setRemaining({
        state: "counting",
        days: Math.floor(totalMinutes / 1440),
        hours: Math.floor((totalMinutes % 1440) / 60),
        minutes: totalMinutes % 60,
      });
    };

    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [startsAt]);

  return remaining;
}

function CountdownUnit({ label, value }) {
  return (
    <span className="flex flex-col items-center border border-red/20 bg-white px-2.5 py-1.5">
      <span className="font-mono text-base font-bold leading-none text-red sm:text-lg">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {label}
      </span>
    </span>
  );
}

function SlideAnalytica() {
  const remaining = useTimeUntil(featuredEvent.startsAt);

  return (
    <div className="bg-white px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="flex flex-col">
            <RecTag>{featuredEvent.eyebrow}</RecTag>
            <h1 className="flex flex-wrap items-center gap-3 text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              <Image
                alt={featuredEvent.name}
                className="h-10 w-auto object-contain sm:h-14"
                height={58}
                priority
                src={ANALYTICA_LOGO}
                width={234}
              />
              <em className="italic text-red">{featuredEvent.edition}</em>
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-ink">
              <span className="inline-flex items-center gap-2">
                <FiCalendar aria-hidden="true" className="size-4 text-red" />
                {featuredEvent.dateLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiMapPin aria-hidden="true" className="size-4 text-red" />
                {featuredEvent.venue}
              </span>
            </div>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              {featuredEvent.summary}
            </p>

            <div className="mb-2 flex flex-wrap items-center gap-3">
              {featuredEvent.stallNumber ? (
                <p className="inline-flex w-fit shrink-0 items-center gap-1.5 border border-red/30 bg-red/5 px-3 py-1.5 text-sm font-semibold text-red">
                  Stall No: {featuredEvent.stallNumber}
                </p>
              ) : null}

              {remaining?.state === "counting" ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    Doors open in
                  </span>
                  <div className="flex items-center gap-1.5">
                    <CountdownUnit label="Days" value={remaining.days} />
                    <CountdownUnit label="Hrs" value={remaining.hours} />
                    <CountdownUnit label="Mins" value={remaining.minutes} />
                  </div>
                </div>
              ) : remaining?.state === "live" ? (
                <p className="inline-flex w-fit items-center gap-1.5 border border-teal/30 bg-teal/5 px-3 py-1.5 text-sm font-semibold text-teal">
                  <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-teal" />
                  Happening now — come say hello
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-3.5 lg:mt-auto lg:pb-1">
              {featuredEvent.registrationUrl ? (
                <a
                  className="border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
                  href={featuredEvent.registrationUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Register Now
                </a>
              ) : null}
              <Link
                href="/events"
                className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                Event Details
              </Link>
            </div>
          </div>

          <div className="relative border border-line-light bg-parchment-alt p-4.5 lg:flex lg:flex-col before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white lg:aspect-auto lg:flex-1">
              <Image
                alt={`Inkarp stall at ${featuredEvent.name} ${featuredEvent.edition}`}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 520px, 90vw"
                src={ANALYTICA_STALL_IMAGE}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

const SLIDES = [SlideAbout];

export default function HomeAboutHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (SLIDES.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % SLIDES.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, []);

  const ActiveSlide = SLIDES[activeIndex];

  return (
    <section className="relative" id="about" data-reveal>
      <div key={activeIndex} className="animate-[hvc-fade_500ms_ease]">
        <ActiveSlide />
      </div>

      {SLIDES.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              type="button"
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-8 bg-red"
                  : "w-2.5 bg-ink-soft/30 hover:bg-ink-soft/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
