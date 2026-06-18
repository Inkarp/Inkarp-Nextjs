'use client';
import { useState } from 'react';

export default function ROICalculator({ cards = [], disclaimer }) {
  const [price, setPrice] = useState(250000);
  const [volPerBatch, setVolPerBatch] = useState(1);
  const [batches, setBatches] = useState(5);
  const [weeks, setWeeks] = useState(48);
  const [solventCost, setSolventCost] = useState(1500);
  const [reusePercent, setReusePercent] = useState(70);

  const annualVol = volPerBatch * batches * weeks;
  const recoveredVol = (annualVol * reusePercent) / 100;
  const annualSaving = (recoveredVol * solventCost).toFixed(0);
  const paybackMonths = price > 0 && parseFloat(annualSaving) > 0
    ? Math.ceil((price / parseFloat(annualSaving)) * 12)
    : null;

  return (
    <section id="roi" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">ROI &amp; payback</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">When does it pay for itself?</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Estimate your annual solvent savings from recovery. Adjust the sliders to match your workflow.
        </p>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Inputs */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
            {[
              { label: 'Equipment price (₹)', val: price, set: setPrice, min: 50000, max: 1000000, step: 10000, fmt: (v) => `₹${v.toLocaleString('en-IN')}` },
              { label: 'Solvent per batch (L)', val: volPerBatch, set: setVolPerBatch, min: 0.1, max: 3, step: 0.1, fmt: (v) => `${v} L` },
              { label: 'Batches per day', val: batches, set: setBatches, min: 1, max: 20, step: 1, fmt: (v) => v },
              { label: 'Working weeks / year', val: weeks, set: setWeeks, min: 10, max: 52, step: 1, fmt: (v) => `${v} weeks` },
              { label: 'Solvent cost (₹/L)', val: solventCost, set: setSolventCost, min: 100, max: 10000, step: 100, fmt: (v) => `₹${v.toLocaleString('en-IN')}` },
              { label: 'Estimated reuse %', val: reusePercent, set: setReusePercent, min: 10, max: 100, step: 5, fmt: (v) => `${v}%` },
            ].map(({ label, val, set, min, max, step, fmt }) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                  <span>{label}</span><span className="text-zinc-800">{fmt(val)}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={val}
                  onChange={(e) => set(parseFloat(e.target.value))}
                  className="w-full accent-[#BE0010]" />
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="font-maxot text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-5">Estimated savings</h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Annual solvent used', value: `${annualVol.toFixed(0)} L` },
                { label: 'Annual recovered volume', value: `${recoveredVol.toFixed(0)} L` },
                { label: 'Annual solvent saving', value: `₹${parseInt(annualSaving).toLocaleString('en-IN')}` },
                { label: 'Estimated payback', value: paybackMonths ? `${paybackMonths} months` : '–' },
              ].map((r) => (
                <div key={r.label} className={`flex items-center justify-between rounded-xl px-4 py-3 ${r.label === 'Estimated payback' ? 'bg-[#BE0010]/5 border border-[#BE0010]/20' : 'bg-zinc-50'}`}>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${r.label === 'Estimated payback' ? 'text-[#BE0010]' : 'text-zinc-400'}`}>{r.label}</span>
                  <span className={`font-maxot font-bold text-lg ${r.label === 'Estimated payback' ? 'text-[#BE0010]' : 'text-zinc-950'}`}>{r.value}</span>
                </div>
              ))}
            </div>

            {cards.length > 0 && (
              <div className="space-y-3">
                {cards.map((c) => (
                  <div key={c.title} className="rounded-xl border border-zinc-200 p-4">
                    <div className="font-semibold text-sm text-zinc-900 mb-1">{c.title}</div>
                    <div className="text-xs text-zinc-500">{c.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {disclaimer && (
          <p className="mt-6 rounded-xl border border-[#BE0010]/15 bg-[#BE0010]/5 p-4 text-xs leading-6 text-zinc-600">
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
