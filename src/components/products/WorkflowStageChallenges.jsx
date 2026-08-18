'use client';

import { useState } from 'react';
import Link from 'next/link';
import { workflowChallenges } from '@/data/workflowChallenges';
import { workflowWheelSteps } from '@/data/workflowWheel';

/**
 * The five challenges an industry meets at each workflow stage, with the
 * instruments that address them. Products that exist in the catalogue link to
 * their page; ones named in the source document but not yet built render as
 * plain text.
 */
export default function WorkflowStageChallenges({
  cat,
  industry,
  embedded = false,
  stageNames = null,
  heading,
  intro,
}) {
  const allStages = workflowWheelSteps[cat] ?? [];
  // On a topic page only the stages that feed that topic are relevant.
  const stages = stageNames?.length
    ? allStages.filter((s) => stageNames.includes(s.name))
    : allStages;
  const byStage = workflowChallenges[cat] ?? {};
  const [active, setActive] = useState(0);

  const stage = stages[active];
  const challenges = stage ? byStage[stage.name] ?? [] : [];

  if (!stages.length || !Object.keys(byStage).length) return null;

  const inner = (
    <>
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          Challenges &amp; solutions
        </p>
        {!embedded && (
          <h2 className="mt-1 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            {heading ?? 'What goes wrong at each stage, and what solves it'}
          </h2>
        )}
        <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-ink-soft">
          {intro ??
            `Pick a stage to see the problems ${industry.toLowerCase()} labs hit there, and the instruments Inkarp matches to each one.`}
        </p>

        <div role="tablist" aria-label="Workflow stages" className={`mt-7 flex-wrap gap-2 ${stages.length > 1 ? 'flex' : 'hidden'}`}>
          {stages.map((s, i) => (
            <button
              key={s.name}
              type="button"
              role="tab"
              id={`challenge-tab-${i}`}
              aria-selected={i === active}
              aria-controls="challenge-panel"
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 border px-3.5 py-2 text-[12.5px] font-semibold transition ${
                i === active
                  ? 'border-black bg-red text-white'
                  : 'border-line-light bg-white text-ink hover:border-red hover:text-red'
              }`}
            >
              <span className={`font-mono text-[10px] ${i === active ? 'text-white/70' : 'text-red'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.name}
            </button>
          ))}
        </div>

        <div
          id="challenge-panel"
          role="tabpanel"
          aria-labelledby={`challenge-tab-${active}`}
          tabIndex={0}
          className="mt-6 border border-line-light bg-white"
        >
          <div className="border-b border-line-light px-5 py-4 sm:px-7">
            <h3 className="text-lg font-semibold tracking-tight text-ink">{stage?.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{stage?.description}</p>
          </div>

          <ol className="divide-y divide-line-light">
            {challenges.map((c, i) => (
              <li key={i} className="px-5 py-6 sm:px-7">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-red">
                      Challenge {i + 1}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{c.challenge}</p>
                  </div>
                  <div className="border-l-0 lg:border-l lg:border-line-light lg:pl-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-teal">
                      Solution
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{c.solution}</p>
                  </div>
                </div>

                {c.products.length > 0 && (
                  <div className="mt-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
                      Supported instruments ({c.products.length})
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.products.map((p) =>
                        p.slug ? (
                          <Link
                            key={p.slug}
                            href={`/products/${p.slug}`}
                            title={p.principal ? `${p.name} — ${p.principal}` : p.name}
                            className="border border-line-light bg-parchment-alt px-2.5 py-1.5 text-[12px] text-ink transition hover:border-red hover:text-red"
                          >
                            {p.name}
                          </Link>
                        ) : (
                          <span
                            key={p.name}
                            title={`${p.name} — not yet listed on the site`}
                            className="border border-dashed border-line-light bg-parchment-alt px-2.5 py-1.5 text-[12px] text-ink-soft"
                          >
                            {p.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );

  if (embedded) return inner;

  return (
    <section
      id="challenges"
      className="scroll-mt-16 border-t border-line-light bg-parchment-alt px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="mx-auto max-w-[1180px]">{inner}</div>
    </section>
  );
}
