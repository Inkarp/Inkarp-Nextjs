"use client";

import Link from "next/link";
import { useState } from "react";
import RecTag from "./RecTag";
import { solutionAreaTabs, solutionAreas } from "@/data/homeShowcase";

const tabClass = (active) =>
  `border px-4 py-2.25 text-xs uppercase tracking-wide transition-all ${
    active ? "border-red bg-red text-white" : "border-line-light bg-transparent text-ink-soft hover:border-red hover:bg-red hover:text-white"
  }`;

export default function HomeShowcaseSlider() {
  const [filter, setFilter] = useState("all");

  return (
    <section className="border-y border-line-light bg-parchment-alt py-[78px]" id="products" data-reveal>
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag variant="teal">Featured Solution Areas</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Common starting points for lab requirements
            </h2>
          </div>
          <p className="max-w-[420px] text-sm text-ink-soft">
            Explore solution areas frequently used across preparation, analysis, quality control,
            research, and scale-up workflows.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {solutionAreaTabs.map(([f, label]) => (
            <button key={f} type="button" className={tabClass(filter === f)} onClick={() => setFilter(f)}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutionAreas
            .filter((p) => filter === "all" || filter === p.cat)
            .map((p) => (
              <div
                key={p.name}
                className="flex flex-col border border-line-light bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center border-b border-line-light bg-parchment-alt p-6">
                  <span className="absolute left-2.5 top-2.5 bg-red px-2 py-1 text-[10px] uppercase tracking-wide text-white">
                    {p.tag}
                  </span>
                  <span className="text-center text-sm font-semibold uppercase tracking-wide text-navy/40">
                    {p.name}
                  </span>
                </div>
                <div className="flex flex-grow flex-col gap-2 p-5 pb-5.5">
                  <h3 className="text-[16.5px] text-ink">{p.name}</h3>
                  <div className="text-[11px] uppercase tracking-wide text-teal">{p.tag}</div>
                  <div className="text-[11.5px] text-ink-soft">{p.description}</div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2.5">
                    <Link
                      href={`/products?q=${p.query}`}
                      className="border border-navy px-3.5 py-2.25 text-[11px] uppercase tracking-wide transition hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
                    >
                      View Solutions
                    </Link>
                    <Link
                      href="/contact"
                      className="border border-navy px-3.5 py-2.25 text-[11px] uppercase tracking-wide transition hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
                    >
                      Request Guidance
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex border border-navy px-6 py-3.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-navy hover:text-white"
          >
            View Full Solutions Catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
