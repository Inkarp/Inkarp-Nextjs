'use client';
import { useState } from 'react';
import SectionHeader from './SectionHeader';

function getRecommendation(recommendations, solventType, priority) {
  return (
    recommendations.find((r) => {
      if (!r.when) return false;
      const { when } = r;
      const sMatch = !when.solventType || when.solventType === solventType;
      const pMatch = !when.priority || when.priority === priority;
      return sMatch && pMatch;
    }) ??
    recommendations.find((r) => r.when?.solventType === solventType) ??
    recommendations.find((r) => r.default) ??
    null
  );
}

export default function VacuumChillerPairing({ data }) {
  const { solventTypes = [], priorities = [], recommendations = [], eyebrow, title } = data ?? {};
  const [solventType, setSolventType] = useState('');
  const [priority, setPriority] = useState('');

  const rec = solventType ? getRecommendation(recommendations, solventType, priority) : null;

  return (
    <section id="pairing" className="scroll-mt-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="14"
          eyebrow={eyebrow ?? 'Pairing guide'}
          title={title ?? 'Pair the right vacuum pump and chiller'}
          description="The rotary evaporator performs best when the vacuum and cooling setup are matched to your solvent behaviour."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Selectors */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
              <p className="font-maxot font-semibold text-sm text-black dark:text-zinc-100 mb-3">What solvent type do you primarily use?</p>
              <div className="flex flex-col gap-2">
                {solventTypes.map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSolventType(s.val)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold text-left transition ${
                      solventType === s.val ? 'border-[#BE0010] bg-[#BE0010]/5 text-[#BE0010]' : 'border-zinc-200 dark:border-zinc-800 text-black dark:text-zinc-100 hover:border-[#BE0010]/30'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {solventType && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                <p className="font-maxot font-semibold text-sm text-black dark:text-zinc-100 mb-3">What is your priority?</p>
                <div className="flex flex-col gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.val}
                      onClick={() => setPriority(p.val)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold text-left transition ${
                        priority === p.val ? 'border-[#BE0010] bg-[#BE0010]/5 text-[#BE0010]' : 'border-zinc-200 dark:border-zinc-800 text-black dark:text-zinc-100 hover:border-[#BE0010]/30'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div>
            {rec ? (
              <div className="rounded-2xl border-2 border-[#BE0010]/30 bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4">✓ Recommended configuration</div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-black dark:text-zinc-100 mb-1">Vacuum pump</div>
                    <div className="font-maxot font-bold text-lg text-black dark:text-zinc-100">{rec.pump}</div>
                    {rec.pumpNote && <div className="text-xs text-black dark:text-zinc-400 mt-1">{rec.pumpNote}</div>}
                  </div>

                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-black dark:text-zinc-100 mb-1">Chiller</div>
                    <div className="font-maxot font-bold text-lg text-black dark:text-zinc-100">{rec.chiller}</div>
                    {rec.chillerNote && <div className="text-xs text-black dark:text-zinc-400 mt-1">{rec.chillerNote}</div>}
                  </div>

                  {rec.accessory && (
                    <div className="rounded-xl bg-[#BE0010]/5 border border-[#BE0010]/20 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-[#BE0010] mb-1">Recommended accessory</div>
                      <div className="font-maxot font-bold text-black dark:text-zinc-100">{rec.accessory}</div>
                      {rec.accessoryNote && <div className="text-xs text-black dark:text-zinc-400 mt-1">{rec.accessoryNote}</div>}
                    </div>
                  )}
                </div>

                <a href="/contact" className="mt-5 inline-flex items-center rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
                  Request this pairing quote →
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-10 text-center h-full min-h-[300px]">
                <div className="text-4xl mb-3">⚗️</div>
                <p className="font-maxot text-black dark:text-zinc-100">Select your solvent type to see the recommended vacuum and chiller pairing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
