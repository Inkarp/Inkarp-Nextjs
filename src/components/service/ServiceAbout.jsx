"use client";

import { useEffect, useRef, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { FiTool } from "react-icons/fi";

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
    info: "Serving pharma, biotech, diagnostics, academia, and more.",
  },
  {
    icon: FiTool,
    number: 184,
    plus: "k+",
    label: "Service",
    info: "Global leaders across instruments, automation, and workflows.",
  },
];

function StatCard({ icon: Icon, number, plus, label, info }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const value = useCountUp(number, 0, 1600, inView);

  return (
    <div className="group relative flex items-center rounded-2xl border border-zinc-100 bg-white/90 p-1 pr-4 shadow backdrop-blur transition-all duration-300 hover:scale-[1.015] dark:border-zinc-800 dark:bg-zinc-900/90">
      <div
        aria-hidden="true"
        className="ml-2 mr-4 inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,#BE0010,#E63946)] text-2xl text-white shadow-md transition group-hover:opacity-90"
      >
        <Icon className="size-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="font-bold text-2xl text-black dark:text-zinc-100" ref={ref}>
            {value}
          </span>
          <span className="text-[#E63946]">{plus}</span>
        </div>
        <h3 className="font-maxot text-sm uppercase tracking-wider text-[#E63946] md:text-base">
          {label}
        </h3>
        <p className="mt-1 text-xs font-light leading-tight text-black/70 md:text-sm dark:text-zinc-400">
          {info}
        </p>
      </div>
    </div>
  );
}

export default function ServiceAbout() {
  return (
    <section className="relative mx-auto w-[95%] py-10 md:px-10 lg:px-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.08),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.08),transparent)] dark:bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.12),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.12),transparent)]" />

      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <span className="font-maxot rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs uppercase sm:text-sm dark:bg-zinc-900 dark:text-zinc-100">
          Our Impact
        </span>
        <h2 className="font-maxot text-xl leading-tight text-[#E63946] sm:text-2xl">
          Ensuring Consistent Results Through Proven Service
        </h2>
      </div>

      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
        {statisticsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
