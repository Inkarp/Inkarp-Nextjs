"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import RecTag from "./RecTag";
import WorkflowIcon from "./WorkflowIcon";
import { workflowIndustries } from "@/data/homeShowcase";
import { workflowWheelSteps } from "@/data/workflowWheel";

const STEP_COUNT = 8;
const SPOKE_INNER_R = 104;
const SPOKE_OUTER_R = 278;
const NODE_RADIUS = 205;
const EASE = "cubic-bezier(0.22,0.9,0.28,1)";

const STEP_ICON_PATHS = [
  <path key="0" d="M9.5 3h5M10.5 3v14a1.5 1.5 0 0 0 3 0V3M10.5 12h3" />,
  <path key="1" d="M12 4c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z" />,
  <path key="2" d="M5 5h14l-5.5 6.5V19l-3-1.5v-6L5 5z" />,
  <path key="3" d="M10 3h4M11 3v6l-4.3 7.4A2 2 0 0 0 8.4 19.5h7.2a2 2 0 0 0 1.7-3.1L13 9V3" />,
  <path key="4" d="M3 12h3l2.5-6 4 12 2.5-6H21" />,
  <path key="5" d="M5 20v-8M12 20V5M19 20v-6" />,
  <g key="6">
    <circle cx="10.5" cy="10.5" r="5.5" />
    <path d="M14.8 14.8 20 20" />
  </g>,
  <g key="7">
    <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />
    <path d="M9 11.5l2 2 4-4" />
  </g>,
];

function StepIcon({ index, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {STEP_ICON_PATHS[index]}
    </svg>
  );
}

function polarPoint(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export default function HomeWorkflowWheel() {
  const industries = workflowIndustries;
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [hubSwapping, setHubSwapping] = useState(false);
  const [visibleLabels, setVisibleLabels] = useState(() => new Set());
  const timeoutsRef = useRef([]);

  const active = industries[activeIndex];
  const steps = workflowWheelSteps[active.cat] ?? [];

  const spokeAngles = useMemo(
    () => Array.from({ length: STEP_COUNT }, (_, i) => i * (360 / STEP_COUNT)),
    []
  );

  useEffect(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];

    setHubSwapping(true);
    setVisibleLabels(new Set());

    const reveal = setTimeout(() => {
      setHubSwapping(false);
      for (let i = 0; i < STEP_COUNT; i++) {
        const t = setTimeout(() => {
          setVisibleLabels((prev) => new Set(prev).add(i));
        }, i * 40);
        timeoutsRef.current.push(t);
      }
    }, 280);
    timeoutsRef.current.push(reveal);

    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [activeIndex]);

  function selectIndustry(index) {
    if (index === activeIndex) return;
    const diff = ((index - activeIndex) % industries.length + industries.length) % industries.length;
    setRotation((r) => r + diff * (360 / STEP_COUNT));
    setActiveIndex(index);
  }

  return (
    <section className="overflow-x-hidden bg-parchment-alt px-4 py-[78px] sm:px-6 lg:px-8" id="workflow-wheel" data-reveal>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag>See The Full Picture</RecTag>
            <h2 className="max-w-[20ch] text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Every industry runs on one workflow wheel
            </h2>
          </div>
          <p className="max-w-[420px] text-sm text-ink-soft">
            Every lab process turns through eight stages, from the first sample to the final QC
            release. Pick your industry and watch the wheel turn to your workflow.
          </p>
        </div>

        <div className="flex flex-col-reverse items-center gap-8 lg:flex-row lg:items-center lg:gap-11">
          <div className="flex w-full flex-1 flex-col items-center">
            <div className="mx-auto h-[310px] w-[620px] origin-top scale-[0.5] sm:h-[360px] sm:scale-[0.58] lg:h-[620px] lg:scale-100">
              <div className="relative h-[620px] w-[620px]">
                <div
                  className="absolute inset-[10px] rounded-full border border-line-light bg-white transition-transform duration-1000 will-change-transform"
                  style={{ transform: `rotate(${rotation}deg)`, transitionTimingFunction: EASE }}
                >
                  <div className="absolute inset-[14px] rounded-full border border-dashed border-line-light" />
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 600" aria-hidden="true">
                    {spokeAngles.map((angle, i) => {
                      const inner = polarPoint(300, 300, SPOKE_INNER_R, angle);
                      const outer = polarPoint(300, 300, SPOKE_OUTER_R, angle);
                      return (
                        <line
                          key={i}
                          x1={inner.x}
                          y1={inner.y}
                          x2={outer.x}
                          y2={outer.y}
                          stroke="var(--line-light)"
                          strokeWidth={1.25}
                        />
                      );
                    })}
                  </svg>

                  {spokeAngles.map((angle, i) => (
                    <div
                      key={i}
                      className="absolute left-1/2 top-1/2 h-0 w-0"
                      style={{ transform: `rotate(${angle}deg) translate(0,-${NODE_RADIUS}px)` }}
                    >
                      <div
                        className="absolute w-[118px] text-center transition-transform duration-1000"
                        style={{
                          transform: `translate(-50%,-50%) rotate(${-(rotation + angle)}deg)`,
                          transitionTimingFunction: EASE,
                        }}
                      >
                        <span
                          className={`relative mx-auto flex h-[66px] w-[66px] items-center justify-center rounded-full border-2 border-white shadow-sm ${
                            i % 2 === 0 ? "bg-red/8 text-red" : "bg-teal/10 text-teal"
                          }`}
                        >
                          <StepIcon index={i} className="h-6 w-6" />
                          <span className="absolute -right-1 -top-1 flex h-[19px] w-[19px] items-center justify-center rounded-full border border-line-light bg-white font-mono text-[9.5px] text-ink-soft">
                            {i + 1}
                          </span>
                        </span>
                        <span
                          className={`mt-1.5 block text-[11.5px] font-medium leading-tight text-ink transition-opacity duration-300 ${
                            visibleLabels.has(i) ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {steps[i]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute left-1/2 top-1/2 flex h-[196px] w-[196px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-line-light bg-white p-4 text-center">
                  <span
                    className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-parchment-alt text-red transition-opacity duration-300 ${
                      hubSwapping ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <WorkflowIcon cat={active.cat} className="h-[22px] w-[22px]" />
                  </span>
                  <div
                    className={`text-[15.5px] font-semibold leading-tight text-ink transition-opacity duration-300 ${
                      hubSwapping ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {active.industry}
                  </div>
                  <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-teal">
                    8-step workflow
                  </div>
                  <Link
                    href={`/products?q=${active.cat}`}
                    className="mt-2 border-b border-transparent text-[10.5px] uppercase tracking-wide text-red transition hover:border-red"
                  >
                    Open workflow →
                  </Link>
                </div>
              </div>
            </div>

            <ol className="mt-6 w-full max-w-md divide-y divide-line-light border-t border-line-light lg:hidden">
              {steps.map((step, i) => (
                <li key={step} className="flex items-baseline gap-3 py-2.5 text-sm text-ink">
                  <span className="font-mono text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div
            role="tablist"
            aria-label="Industries"
            className="flex w-full shrink-0 flex-row gap-1 overflow-x-auto pb-1 lg:w-[300px] lg:flex-col lg:gap-0 lg:overflow-visible lg:border-l lg:border-line-light lg:pb-0"
          >
            {industries.map((ind, i) => (
              <button
                key={ind.cat}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                onClick={() => selectIndustry(i)}
                className={`-ml-px flex shrink-0 items-baseline gap-3 border-l-2 px-4 py-3.5 text-left transition lg:px-5 ${
                  i === activeIndex
                    ? "border-red bg-white"
                    : "border-transparent text-ink-soft hover:bg-white/60"
                }`}
              >
                <span className={`hidden font-mono text-[11px] lg:inline ${i === activeIndex ? "text-red" : "text-ink-soft"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`text-[15px] font-semibold leading-tight ${i === activeIndex ? "text-red" : "text-ink"}`}>
                  {ind.industry}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="border-b border-line-light pb-0.5 text-xs text-ink-soft transition-colors hover:border-teal hover:text-teal"
          >
            Explore every workflow, with the Inkarp products used at each stage →
          </Link>
        </div>
      </div>
    </section>
  );
}
