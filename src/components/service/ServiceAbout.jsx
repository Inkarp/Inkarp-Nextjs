"use client";

import { useEffect, useRef, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { FiTool } from "react-icons/fi";
import RecTag from "@/components/home/RecTag";
import FlaskDock, { SERVICE_FLASK_STOPS } from "@/components/home/FlaskDock";

/**
 * The real number is what the page HTML carries, so search engines, link
 * previews and visitors without JavaScript never read "0". The count-up is
 * only a flourish: a counter still below the fold is set to 0 while out of
 * sight, then counts up once, the first time it scrolls into view. One
 * already on screen at load, or with reduced motion, just shows the number.
 */
function useCountUpOnce(ref, end, duration = 1600) {
  const [value, setValue] = useState(end);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame;
    let armed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (!armed) {
            armed = true;
            setValue(0);
          }
          return;
        }

        observer.disconnect();
        if (!armed) return;

        let startTime;
        const tick = (ts) => {
          startTime ??= ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          setValue(Math.round(end * progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref, end, duration]);

  return value;
}

const statisticsData = [
  {
    icon: FaBuilding,
    number: 39,
    plus: "k+",
    label: "Installations",
    info: "Serving pharma, biotech, diagnostics, academia, and industrial laboratories.",
  },
  {
    icon: FiTool,
    number: 184,
    plus: "k+",
    label: "Service Touchpoints",
    info: "Installation, maintenance, troubleshooting, AMC, and spares support across India.",
  },
];

function StatCard({ icon: Icon, number, plus, label, info }) {
  const ref = useRef(null);
  const value = useCountUpOnce(ref, number);

  return (
    <div className="border border-line-light bg-white p-6">
      <span className="flex size-11 items-center justify-center rounded-lg bg-red/8 text-red">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="mt-5 flex items-end gap-1">
        <span className="text-4xl font-semibold leading-none text-ink" ref={ref}>
          {value}
        </span>
        <span className="text-xl font-semibold text-red">{plus}</span>
      </div>
      <h3 className="mt-3 text-xs font-bold uppercase tracking-wide text-ink">
        {label}
      </h3>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{info}</p>
    </div>
  );
}

// `flask`: on wide screens, a landing spot left of the heading for the
// travelling sample (FlaskJourney) down the Service page.
export default function ServiceAbout({ flask = false } = {}) {
  return (
    <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8" data-reveal>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div className={flask ? "lg:flex lg:items-center lg:gap-6" : undefined}>
            {flask ? <FlaskDock className="hidden shrink-0 lg:block" stop={3} stops={SERVICE_FLASK_STOPS} /> : null}
            <div>
              <RecTag>Our Impact</RecTag>
              <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
                Proven service behind consistent results.
              </h2>
            </div>
          </div>
          <p className="max-w-[430px] text-sm leading-6 text-ink-soft">
            Our service network is built for laboratories that need dependable uptime,
            clear documentation, and engineers who understand scientific workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {statisticsData.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}