"use client";

import { useEffect, useRef, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { FiTool } from "react-icons/fi";
import RecTag from "@/components/home/RecTag";

function useCountUp(end, start = 0, duration = 1500, inView) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!inView) {
      setValue(start);
      return;
    }

    let frame;
    let startTime;

    function animateCount(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(start + (end - start) * progress));
      if (progress < 1) frame = requestAnimationFrame(animateCount);
      else setValue(end);
    }

    frame = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(frame);
  }, [end, start, duration, inView]);

  return value;
}

function useInView(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
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
  const inView = useInView(ref);
  const value = useCountUp(number, 0, 1600, inView);

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

export default function ServiceAbout() {
  return (
    <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8" data-reveal>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag>Our Impact</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Proven service behind consistent results.
            </h2>
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