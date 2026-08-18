"use client";

import Link from "next/link";
import { useState } from "react";
import StepIcon from "@/components/home/StepIcon";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import { topicSlug, workflowIndustries, workflowTopics } from "@/data/homeShowcase";
import {
  stageSlugForLegacyTopic,
  stagesWithSlugs,
  workflowIntros,
} from "@/data/workflowWheel";

const TOP_H = 58;
const DOT_H = 60;
const BOTTOM_H = 58;
const LINE_TOP = TOP_H + DOT_H / 2;

function StepRail({ cat, industry }) {
  // Each stage opens its own page of challenges, solutions and instruments.
  const steps = stagesWithSlugs(cat);
  const stepHref = (index) => `/workflows/${cat}/${steps[index].slug}`;

  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="relative min-w-[860px]"
        style={{ height: TOP_H + DOT_H + BOTTOM_H }}
      >
        <span
          className="pointer-events-none absolute left-0 right-0 z-0 h-px bg-line-light"
          style={{ top: LINE_TOP }}
          aria-hidden="true"
        />

        <div
          className="relative z-10 grid h-full grid-flow-col gap-x-1"
          style={{
            gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))`,
            gridTemplateRows: `${TOP_H}px ${DOT_H}px ${BOTTOM_H}px`,
          }}
        >
          {steps.map((step, i) => {
            const isUp = i % 2 === 0;
            const label = (
              <>
                <span className="block font-mono text-[11px] text-ink-soft transition-colors group-hover:text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block text-[13px] font-semibold leading-tight text-ink underline decoration-line-light decoration-1 underline-offset-2 transition-colors group-hover:text-red group-hover:decoration-red">
                  {step.name}
                </span>
              </>
            );

            return (
              <Link
                key={step.name}
                href={stepHref(i)}
                title={step.description}
                aria-label={`Step ${i + 1}: ${step.name} — ${step.description}`}
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
                  {/* White gutter so the connecting line stops short of the
                      node instead of running into its border. */}
                  <span className="flex items-center justify-center bg-white px-3.5">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-all group-hover:-translate-y-0.5 group-hover:shadow-[0_2px_8px_rgba(190,0,16,0.18)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-red ${
                        isUp
                          ? "border-red text-red group-hover:border-red group-hover:bg-red/5"
                          : "border-teal text-teal group-hover:border-teal group-hover:bg-teal/5"
                      }`}
                    >
                      <StepIcon index={i} className="h-6 w-6" />
                    </span>
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
                  {stagesWithSlugs(item.cat).length}-step process
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
              {workflowIntros[active.cat] ?? active.tagline}
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
            Click any stage to open that workflow →
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
                href={`/workflows/${active.cat}/${
                  stageSlugForLegacyTopic(active.cat, topicSlug(topic.tag)) ??
                  topicSlug(topic.tag)
                }`}
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
