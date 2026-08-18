'use client';
import { useState } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

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
  const { solventTypes = [], priorities = [], recommendations = [], eyebrow, title, disclaimer } = data ?? {};
  const [solventType, setSolventType] = useState('');
  const [priority, setPriority] = useState('');

  if (!solventTypes.length) return null;

  const rec = solventType ? getRecommendation(recommendations, solventType, priority) : null;

  return (
    <section id="pairing" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px]">
        <SectionHeader
          number="14"
          eyebrow={eyebrow ?? 'Pairing guide'}
          title={title ?? 'Pair the right vacuum pump and chiller'}
          description="The rotary evaporator performs best when the vacuum and cooling setup are matched to your solvent behaviour."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Selectors */}
          <div className="space-y-6">
            <div className="border border-line-light bg-parchment p-5">
              <p className="font-semibold tracking-tight text-sm text-ink mb-3">What solvent type do you primarily use?</p>
              <div className="flex flex-col gap-2">
                {solventTypes.map((s) => (
                  <button
                    aria-pressed={solventType === s.val}
                    key={s.val}
                    onClick={() => setSolventType(s.val)}
                    type="button"
                    className={`border-2 px-4 py-3 text-sm font-semibold text-left transition ${
                      solventType === s.val ? 'border-black bg-red text-white' : 'border-line-light text-black hover:border-line-light'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {solventType && (
              <div className="border border-line-light bg-parchment p-5">
                <p className="font-semibold tracking-tight text-sm text-ink mb-3">What is your priority?</p>
                <div className="flex flex-col gap-2">
                  {priorities.map((p) => (
                    <button
                      aria-pressed={priority === p.val}
                      key={p.val}
                      onClick={() => setPriority(p.val)}
                      type="button"
                      className={`border-2 px-4 py-3 text-sm font-semibold text-left transition ${
                        priority === p.val ? 'border-black bg-red text-white' : 'border-line-light text-black hover:border-line-light'
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
              <div className="border border-line-light bg-parchment p-6">
                <div className="inline-flex items-center gap-1 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 mb-4">✓ Recommended configuration</div>

                <div className="space-y-4">
                  <div className="bg-parchment-alt p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-black mb-1">Vacuum pump</div>
                    <div className="font-semibold tracking-tight text-lg text-ink">{rec.pump}</div>
                    {rec.pumpNote && <div className="text-xs text-black mt-1">{rec.pumpNote}</div>}
                  </div>

                  <div className="bg-parchment-alt p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-black mb-1">Chiller</div>
                    <div className="font-semibold tracking-tight text-lg text-ink">{rec.chiller}</div>
                    {rec.chillerNote && <div className="text-xs text-black mt-1">{rec.chillerNote}</div>}
                  </div>

                  {rec.accessory && (
                    <div className="bg-parchment-alt border border-line-light p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-red mb-1">Recommended accessory</div>
                      <div className="font-semibold tracking-tight text-ink">{rec.accessory}</div>
                      {rec.accessoryNote && <div className="text-xs text-black mt-1">{rec.accessoryNote}</div>}
                    </div>
                  )}
                </div>

                <a href="/contact" className="mt-5 inline-flex items-center bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition">
                  Request this pairing quote →
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-line-light bg-parchment-alt p-10 text-center h-full min-h-[300px]">
                <div className="text-4xl mb-3">⚗️</div>
                <p className="font-semibold tracking-tight text-ink">Select your solvent type to see the recommended vacuum and chiller pairing.</p>
              </div>
            )}
          </div>
        </div>

        <SectionDisclaimer>
          {disclaimer ?? 'This pairing guide gives a generic starting recommendation only. Confirm the exact vacuum pump, chiller model and accessories for your lab with an Inkarp specialist.'}
        </SectionDisclaimer>
      </div>
    </section>
  );
}
