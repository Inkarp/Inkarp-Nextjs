"use client";

import Link from "next/link";
import { useRef, useState } from "react";

function ChallengeCoverage({ challenges, onJump }) {
  const counts = challenges.map((challenge) => (challenge.empty ? 0 : challenge.products.length));
  const filledCount = challenges.filter((challenge) => !challenge.empty).length;
  const maxCount = Math.max(4, ...counts);

  return (
    <div className="rounded-xl border border-line-light bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-zinc-500">
          Challenge coverage · {filledCount}/{challenges.length} filled
        </span>
        <span className="flex flex-wrap gap-3 font-mono text-[10.5px] text-ink-soft dark:text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-sm bg-red" aria-hidden="true" />
            filled (bar = instruments)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-sm bg-zinc-200 dark:bg-zinc-700" aria-hidden="true" />
            empty slot
          </span>
        </span>
      </div>

      <div className="flex h-[100px] items-end gap-2">
        {challenges.map((challenge, index) => {
          const filled = !challenge.empty;
          const count = counts[index];
          const heightPct = filled ? Math.max(6, Math.round((count / maxCount) * 100)) : 4;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onJump(index)}
              title={`Challenge ${index + 1}`}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            >
              <span
                className={`w-full max-w-[42px] rounded-t transition-all ${
                  filled ? "bg-red" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
                style={{ height: `${heightPct}%` }}
              />
              <span className="font-mono text-[11px] text-ink-soft dark:text-zinc-500">{index + 1}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 font-mono text-xs text-ink-soft dark:text-zinc-500">
        Taller bar = more supported instruments. Click a bar to jump to that challenge.
      </p>
    </div>
  );
}

export default function ChallengeAccordion({ challenges }) {
  const [openIndex, setOpenIndex] = useState(0);
  const itemRefs = useRef([]);

  const jumpToChallenge = (index) => {
    setOpenIndex(index);
    requestAnimationFrame(() => {
      itemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div>
      <ChallengeCoverage challenges={challenges} onJump={jumpToChallenge} />

      <p className="mt-6 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-zinc-500">
        Top 10 challenges &amp; solutions
      </p>

      <div className="mt-3 space-y-3">
        {challenges.map((challenge, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={`overflow-hidden rounded-xl border transition ${
                isOpen ? "border-red" : "border-line-light dark:border-zinc-800"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                    challenge.empty ? "bg-zinc-800 dark:bg-zinc-700" : "bg-red"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-ink dark:text-zinc-100">
                  {challenge.title}
                </span>
                <span
                  className={`text-red transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-line-light px-5 py-5 dark:border-zinc-800">
                  {challenge.empty ? (
                    <div className="rounded-lg border border-dashed border-line-light bg-parchment-alt p-4 font-mono text-xs text-ink-soft dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                      Add the challenge, its solution, and the recommended products for this slot.
                    </div>
                  ) : (
                    <>
                      <div className="rounded-lg border border-line-light bg-parchment-alt p-4 dark:border-zinc-800 dark:bg-zinc-800">
                        <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-red">
                          Solution
                        </p>
                        <p className="text-sm leading-6 text-ink-soft dark:text-zinc-300">
                          {challenge.solution}
                        </p>
                      </div>

                      {challenge.products.length > 0 ? (
                        <div className="mt-5">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-zinc-500">
                            Supported instruments
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {challenge.products.map((product) => (
                              <Link
                                key={`${product.principalSlug}-${product.slug}`}
                                href={product.href}
                                className="rounded-lg border border-line-light bg-white p-4 transition hover:border-red/40 dark:border-zinc-700 dark:bg-zinc-900"
                              >
                                <p className="text-sm font-semibold text-ink dark:text-zinc-100">
                                  {product.name}
                                </p>
                                <span className="mt-1 inline-block rounded-full bg-red/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red">
                                  {product.principalName}
                                </span>
                                <p className="mt-2 text-xs font-semibold text-red">View product →</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
