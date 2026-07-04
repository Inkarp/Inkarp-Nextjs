"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import RecTag from "./RecTag";
import WorkflowIcon from "./WorkflowIcon";
import { workflowIndustries, workflowTopics } from "@/data/homeShowcase";

export default function HomeWorkflows() {
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
    <section className="bg-parchment py-[78px]" id="categories" data-reveal>
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag variant="teal text-[#Be0010]">Lab Workflows</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              See how our workflows fit together, industry by industry
            </h2>
          </div>
          <p className="max-w-[420px] text-sm text-ink-soft">
            From first step to final QC — explore how Inkarp&apos;s featured solutions come together in a
            real lab process, for each industry we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px border border-line-light bg-line-light md:grid-cols-3">
          {rows.map((row, ri) => (
            <Fragment key={ri}>
              {row.map((wf) => (
                <div
                  key={wf.cat}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/products?view=workflow&industry=${wf.cat}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push(`/products?view=workflow&industry=${wf.cat}`);
                  }}
                  onMouseEnter={() => showTopics(wf.cat)}
                  onMouseLeave={hideTopics}
                  className="flex min-h-[196px] cursor-pointer flex-col gap-3.5 bg-white p-[30px_26px] transition-colors hover:bg-parchment-alt"
                >
                  <WorkflowIcon cat={wf.cat} className="h-8 w-8 text-navy" />
                  <h3 className="text-lg text-ink">{wf.industry}</h3>
                  <p className="flex-grow text-[13px] text-ink-soft">{wf.tagline}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[10.5px] uppercase tracking-wide text-teal">
                      {wf.steps}-Step Workflow
                    </span>
                    <Link
                      href={`/products?view=workflow&industry=${wf.cat}`}
                      onClick={(e) => e.stopPropagation()}
                      className="whitespace-nowrap border-b border-transparent text-[11px] uppercase tracking-wide text-red transition-colors hover:border-red"
                    >
                      Open Workflow →
                    </Link>
                  </div>
                </div>
              ))}
              {row.some((wf) => wf.cat === hoveredCat) && (
                <div
                  className="col-span-full animate-[topicReveal_.3s_ease] bg-parchment-alt p-[28px_26px]"
                  onMouseEnter={() => showTopics(hoveredCat)}
                  onMouseLeave={hideTopics}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {workflowTopics[hoveredCat].map((topic) => (
                      <div
                        key={topic.title}
                        className="flex flex-col gap-2 border border-line-light bg-white p-5 transition hover:-translate-y-0.5 hover:border-red"
                      >
                        <div className="text-[10px] uppercase tracking-wide text-red">{topic.tag}</div>
                        <h4 className="text-[15px] font-semibold leading-snug text-ink">{topic.title}</h4>
                        <p className="flex-grow text-[12.5px] text-ink-soft">{topic.desc}</p>
                        <Link
                          href={`/products?view=workflow&industry=${hoveredCat}&topic=${encodeURIComponent(topic.tag)}`}
                          className="self-start border-b border-transparent text-[11px] uppercase tracking-wide text-red transition-colors hover:border-red"
                        >
                          Open workflow →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/products?view=workflow"
            className="border-b border-line-light pb-0.5 text-xs text-ink-soft transition-colors hover:border-teal hover:text-teal"
          >
            Explore every workflow, with the Inkarp products used at each stage →
          </Link>
        </div>
      </div>
    </section>
  );
}
