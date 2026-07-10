"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import RecTag from "./RecTag";

const AUTO_ROTATE_MS = 7000;
const BUILDING_IMAGE = "/assets/our-story/InkarpBuilding.jpg";

const STAT_TAGS = [
  { num: "1985", label: "Serving Indian Science Since" },
  { num: "49", label: "Global Principals" },
  { num: "191", label: "Product Lines" },
  { num: "18", label: "Offices Across India" },
  { num: "All India", label: "Installation and Service" },
];

function SlideWorkflow() {
  return (
    <div className="bg-white px-4 pb-15 pt-19 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {/* <RecTag>Since 1985 / 18 Offices / 49 Principals</RecTag> */}
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
                className="border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
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
                src={BUILDING_IMAGE}
                alt="Inkarp scientific solutions and support network"
                loading="eager"
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
              <span>Fig. 01 — Inkarp Scientific Solutions</span>
              <span>Workflow-Led Approach</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideAbout() {
  return (
    <div className="bg-white px-4 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 flex items-start gap-6">
              <div className="relative flex h-[104px] w-[104px] shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-red text-center text-red">
                <div className="absolute inset-2 rounded-full border border-dashed border-red/40" />
                <span className="text-[19px] font-semibold tracking-wide">1985</span>
                <span className="mt-0.5 text-[8.5px] uppercase tracking-[0.16em]">Est. &amp; Trusted</span>
              </div>
              <div>
                <RecTag>About Inkarp</RecTag>
                <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                  Four decades of supporting
                  <br />
                  India&apos;s <em className="italic text-red">laboratories.</em>
                </h2>
              </div>
            </div>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              Since 1985, Inkarp has helped Indian laboratories move from scientific need to
              supported use — bringing together global principals, product lines, application
              guidance, installation support, and service across India.
            </p>

            <div className="mb-11 flex flex-wrap gap-3.5">
              <Link
                href="/products"
                className="border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
              >
                Browse Solutions
              </Link>
              <Link
                href="/contact"
                className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>

          <div className="relative border border-line-light bg-parchment-alt p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white">
              <Image
                src={BUILDING_IMAGE}
                alt="Inkarp scientific solutions and support network"
                loading="eager"
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
              <span>Fig. 01 — Inkarp Scientific Solutions</span>
              <span>Pan-India Support</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {STAT_TAGS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 border border-line-light bg-parchment-alt px-5 py-3"
            >
              <span className="text-lg font-semibold text-red">{stat.num}</span>
              <span className="text-[9.5px] uppercase leading-tight tracking-wide text-ink-soft">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dummy copy — swap in real product details once the launch is finalised.
function SlideFutureProducts() {
  return (
    <div className="bg-parchment-alt px-4 pb-15 pt-19 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <RecTag variant="teal">Coming Soon</RecTag>
            <h2 className="max-w-lg text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              New solutions are on their way to your lab.
            </h2>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              We&apos;re expanding our catalogue with new principal partnerships and in-house
              solutions, built around the same workflows you already trust us with. Details to be
              announced soon.
            </p>

            <div className="mb-11 flex flex-wrap gap-3.5">
              <Link
                href="/products"
                className="border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
              >
                Browse Solutions
              </Link>
              <Link
                href="/contact"
                className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                Get Notified
              </Link>
            </div>
          </div>

          <div className="relative border border-line-light bg-white p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-teal before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-teal after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-parchment-alt">
              <Image
                src={BUILDING_IMAGE}
                alt="Inkarp scientific solutions, coming soon"
                loading="eager"
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
              <span>Fig. 02 — Expanding Our Range</span>
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [SlideWorkflow, SlideAbout, SlideFutureProducts];

export default function HomeAboutHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
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
    </section>
  );
}
