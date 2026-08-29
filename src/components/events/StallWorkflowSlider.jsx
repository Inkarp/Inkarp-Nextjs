"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiLayers } from "react-icons/fi";
import RecTag from "@/components/home/RecTag";
import { stallWorkflowStages } from "@/data/stallWorkflows";

function ProductChip({ product }) {
  const label = product.name ? `${product.principalName} — ${product.name}` : product.principalName;

  if (!product.principalSlug) {
    return (
      <span className="inline-flex items-center border border-line-light bg-parchment px-2.5 py-1 text-[11px] font-semibold leading-4 text-ink-soft">
        {label}
      </span>
    );
  }

  return (
    <Link
      className="inline-flex items-center border border-red/25 bg-red/5 px-2.5 py-1 text-[11px] font-semibold leading-4 text-red transition hover:border-red hover:bg-red/10"
      href={`/products?brand=${product.principalSlug}`}
    >
      {label}
    </Link>
  );
}

function StepCard({ step }) {
  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-2 border border-line-light bg-white p-4">
      <p className="text-sm font-semibold text-ink">{step.label}</p>
      <div className="flex flex-wrap gap-1.5">
        {step.products.map((product, index) => (
          <ProductChip key={`${product.principalName}-${index}`} product={product} />
        ))}
      </div>
    </div>
  );
}

function StageSlide({ stage }) {
  return (
    <div className="border border-line-light bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3 bg-[linear-gradient(135deg,#161616_0%,#242424_62%,#be0010_100%)] px-5 py-4 sm:px-6">
        <span className="inline-flex size-9 shrink-0 items-center justify-center bg-white/10 text-sm font-bold text-white ring-1 ring-white/15">
          {stage.number}
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Stage {stage.number} of {stallWorkflowStages.length}</p>
          <h3 className="mt-0.5 text-lg font-semibold text-white sm:text-xl">{stage.title}</h3>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-stretch gap-3">
          {stage.steps.map((step, index) => (
            <div className="flex items-stretch gap-3" key={step.label}>
              <StepCard step={step} />
              {index < stage.steps.length - 1 ? (
                <span className="hidden shrink-0 items-center text-red/40 sm:flex" aria-hidden="true">
                  <FiArrowRight />
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {stage.footnote ? (
          <p className="mt-4 border-t border-line-light pt-3 text-xs text-ink-soft">
            {stage.footnote.principalSlug !== undefined ? (
              <>
                <span className="font-semibold text-ink">
                  {stage.footnote.principalSlug ? (
                    <Link className="text-red hover:underline" href={`/products?brand=${stage.footnote.principalSlug}`}>
                      {stage.footnote.principalName}
                    </Link>
                  ) : (
                    stage.footnote.principalName
                  )}
                </span>{" "}
                — {stage.footnote.note}
              </>
            ) : (
              stage.footnote.note
            )}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function StallWorkflowSlider() {
  const [index, setIndex] = useState(0);
  const stage = stallWorkflowStages[index];
  const goTo = (next) => setIndex((next + stallWorkflowStages.length) % stallWorkflowStages.length);

  return (
    <section className="bg-parchment-alt py-16" id="stall-workflows">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <RecTag>The 360° Solution</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              What we&apos;re showing on the stall
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
              Seven stages of a typical lab workflow, and the instruments Inkarp brings to each one —
              from sample prep through to final analysis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Previous stage"
              className="inline-flex size-10 items-center justify-center border border-line-light bg-white text-ink transition hover:border-red hover:text-red"
              onClick={() => goTo(index - 1)}
              type="button"
            >
              <FiChevronLeft />
            </button>
            <button
              aria-label="Next stage"
              className="inline-flex size-10 items-center justify-center border border-line-light bg-white text-ink transition hover:border-red hover:text-red"
              onClick={() => goTo(index + 1)}
              type="button"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {stallWorkflowStages.map((item, itemIndex) => (
            <button
              className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold transition ${
                itemIndex === index
                  ? "border-red bg-red text-white"
                  : "border-line-light bg-white text-ink-soft hover:border-red hover:text-red"
              }`}
              key={item.id}
              onClick={() => setIndex(itemIndex)}
              type="button"
            >
              <FiLayers aria-hidden="true" className={itemIndex === index ? "opacity-100" : "opacity-40"} />
              {item.number}. {item.title}
            </button>
          ))}
        </div>

        <div key={stage.id} className="animate-[hvc-fade_400ms_ease]">
          <StageSlide stage={stage} />
        </div>
      </div>
    </section>
  );
}
