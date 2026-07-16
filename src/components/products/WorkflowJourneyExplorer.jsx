"use client";

import Link from "next/link";
import { useState } from "react";
import StepIcon from "@/components/home/StepIcon";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import { topicSlug, workflowIndustries, workflowTopics } from "@/data/homeShowcase";
import { workflowWheelSteps } from "@/data/workflowWheel";

const TOP_H = 52;
const DOT_H = 40;
const BOTTOM_H = 52;
const LINE_TOP = TOP_H + DOT_H / 2;

function StepRail({ cat, industry }) {
  const steps = workflowWheelSteps[cat] ?? [];
  const href = `/workflows/${cat}`;

  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="relative min-w-[720px]"
        style={{ height: TOP_H + DOT_H + BOTTOM_H }}
      >
        <span
          className="pointer-events-none absolute left-0 right-0 h-px bg-line-light"
          style={{ top: LINE_TOP }}
          aria-hidden="true"
        />

        <div
          className="grid h-full grid-flow-col gap-x-1"
          style={{
            gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))`,
            gridTemplateRows: `${TOP_H}px ${DOT_H}px ${BOTTOM_H}px`,
          }}
        >
          {steps.map((step, i) => {
            const isUp = i % 2 === 0;
            const label = (
              <>
                <span className="block font-mono text-[10px] text-ink-soft transition-colors group-hover:text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block text-[11.5px] font-medium leading-tight text-ink underline decoration-line-light decoration-1 underline-offset-2 transition-colors group-hover:text-red group-hover:decoration-red">
                  {step}
                </span>
              </>
            );

            return (
              <Link
                key={step}
                href={href}
                title={`View the ${industry} workflow`}
                aria-label={`Step ${i + 1}: ${step} — view the ${industry} workflow`}
                className="group contents"
              >
                <div
                  className="flex items-end justify-center px-1 text-center"
                  style={{ gridRow: 1, gridColumn: i + 1 }}
                >
                  {isUp ? label : null}
                </div>
                <div
                  className="flex items-center justify-center"
                  style={{ gridRow: 2, gridColumn: i + 1 }}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white transition-all group-hover:-translate-y-0.5 group-hover:shadow-[0_2px_8px_rgba(190,0,16,0.18)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-red ${
                      isUp
                        ? "border-red/30 text-red group-hover:border-red"
                        : "border-teal/30 text-teal group-hover:border-teal"
                    }`}
                  >
                    <StepIcon index={i} className="h-[18px] w-[18px]" />
                  </span>
                </div>
                <div
                  className="flex items-start justify-center px-1 pt-1 text-center"
                  style={{ gridRow: 3, gridColumn: i + 1 }}
                >
                  {isUp ? null : label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function WorkflowJourneyExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = workflowIndustries[activeIndex];
  const topics = workflowTopics[active.cat] ?? [];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <div className="flex flex-row gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:h-fit lg:flex-col lg:gap-0 lg:overflow-visible lg:border lg:border-line-light lg:bg-white">
        {workflowIndustries.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={item.cat}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex shrink-0 items-center gap-3 border-l-2 px-4 py-3 text-left transition lg:border-b lg:border-l-2 lg:last:border-b-0 ${
                isActive
                  ? "border-red bg-parchment-alt"
                  : "border-transparent hover:bg-parchment-alt/60 lg:border-b-line-light"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center ${
                  isActive ? "bg-red text-parchment" : "bg-parchment-alt text-ink-soft"
                }`}
              >
                <WorkflowIcon cat={item.cat} className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-[13.5px] font-semibold leading-tight ${
                    isActive ? "text-red" : "text-ink"
                  }`}
                >
                  {item.industry}
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-wide text-ink-soft lg:block">
                  {(workflowWheelSteps[item.cat] ?? []).length}-step process
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-w-0 border border-line-light bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-red">
              The process
            </p>
            <h3 className="mt-1 text-xl font-semibold leading-tight text-ink sm:text-2xl">
              {active.industry}
            </h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
              {active.tagline}
            </p>
          </div>
          <Link
            href={`/workflows/${active.cat}`}
            className="inline-flex shrink-0 items-center gap-2 bg-red px-4 py-2 text-xs font-semibold uppercase tracking-wide text-parchment transition hover:bg-red-soft"
          >
            Open full workflow →
          </Link>
        </div>

        <div className="mt-6 border-t border-line-light pt-6">
          <p className="mb-1 text-[11.5px] text-ink-soft">
            Click any step to open the {active.industry.toLowerCase()} workflow →
          </p>
          <StepRail cat={active.cat} industry={active.industry} />
        </div>

        <div className="mt-6 border-t border-line-light pt-6">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            Jump to a specific workflow
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Link
                key={topic.tag}
                href={`/workflows/${active.cat}/${topicSlug(topic.tag)}`}
                className="border border-line-light px-3 py-1.5 text-[12px] text-ink transition hover:border-red hover:text-red"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
