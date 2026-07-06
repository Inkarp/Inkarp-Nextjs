"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import { topicSlug, workflowIndustries, workflowTopics } from "@/data/homeShowcase";

export default function WorkflowIndustryGrid() {
  const router = useRouter();
  const [hoveredCat, setHoveredCat] = useState(null);
  const hoverTimeout = useRef(null);

  const showTopics = (cat) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredCat(cat);
  };
  const hideTopics = () => {
    hoverTimeout.current = setTimeout(() => setHoveredCat(null), 150);
  };

  useEffect(() => () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, []);

  const rows = [];
  for (let i = 0; i < workflowIndustries.length; i += 3) {
    rows.push(workflowIndustries.slice(i, i + 3));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {rows.map((row, ri) => {
        const activeIndex = row.findIndex((item) => item.cat === hoveredCat);

        return (
          <Fragment key={ri}>
            {row.map((item) => {
              const isActive = item.cat === hoveredCat;

              return (
                <div
                  key={item.cat}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/workflows/${item.cat}`)}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") router.push(`/workflows/${item.cat}`);
                  // }}
                  onMouseEnter={() => showTopics(item.cat)}
                  onMouseLeave={hideTopics}
                  onFocus={() => showTopics(item.cat)}
                  onBlur={hideTopics}
                  className={`relative z-10 flex cursor-pointer flex-col gap-3  border p-5 transition ${
                    isActive
                      ? "border-red bg-white shadow-lg dark:bg-zinc-900"
                      : "border-line-light bg-[whitesmoke] hover:-translate-y-0.5 hover:border-red/40 dark:border-zinc-800 dark:bg-zinc-900"
                  }`}
                >
                  <WorkflowIcon cat={item.cat} className="h-8 w-8 text-black" />
                  <h2 className="text-[15px] font-semibold leading-snug text-black dark:text-zinc-100">
                    {item.industry}
                  </h2>
                  <p className="flex-1 text-[13px] text-ink-soft dark:text-zinc-400">{item.tagline}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-fit rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-black">
                      {item.steps}-Step Workflow
                    </span>
                    <Link
                      href={`/workflows/${item.cat}`}
                      onClick={(e) => e.stopPropagation()}
                      className="whitespace-nowrap border-b border-transparent text-[11px] uppercase tracking-wide text-red transition-colors hover:border-red"
                    >
                      Open workflow →
                    </Link>
                  </div>
                </div>
              );
            })}

            {activeIndex !== -1 && (
              <div
                className="relative col-span-full -mt-2 animate-[topicReveal_.25s_ease]  border border-black bg-white p-6 pt-8 shadow-lg dark:bg-zinc-900"
                onMouseEnter={() => showTopics(hoveredCat)}
                onMouseLeave={hideTopics}
              >
                {/* Caret linking this panel back to the hovered industry card above */}
                <span
                  aria-hidden="true"
                  className="absolute -top-[9px] h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-red bg-white dark:bg-zinc-900"
                  style={{ left: `calc((100% / 3) * ${activeIndex + 0.5})` }}
                />

                <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-red">
                  {workflowIndustries.find((item) => item.cat === hoveredCat)?.industry} workflows
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(workflowTopics[hoveredCat] ?? []).map((topic) => (
                    <Link
                      key={topic.tag}
                      href={`/workflows/${hoveredCat}/${topicSlug(topic.tag)}`}
                      className="flex flex-col gap-2 rounded-lg border border-line-light bg-[whitesmoke] p-5 transition hover:-translate-y-0.5 hover:border-red dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      <div className="text-[10px] uppercase tracking-wide text-red">{topic.tag}</div>
                      <h4 className="text-[15px] font-semibold leading-snug text-ink dark:text-zinc-100">
                        {topic.title}
                      </h4>
                      <p className="flex-grow text-[12.5px] text-ink-soft dark:text-zinc-400">{topic.desc}</p>
                      <span className="self-start border-b border-transparent text-[11px] uppercase tracking-wide text-red transition-colors hover:border-red">
                        Open workflow →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
