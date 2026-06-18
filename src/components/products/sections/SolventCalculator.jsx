'use client';
import { useState } from 'react';

export default function SolventCalculator({ data }) {
  const solvents = data?.solvents ?? [];
  const [selIdx, setSelIdx] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [concentration, setConcentration] = useState(100);
  const [batches, setBatches] = useState(5);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  const solv = solvents[selIdx] ?? {};
  const pureVolume = (volume * concentration) / 100;
  const mass = (pureVolume * (solv.density ?? 1)).toFixed(3);
  const moles = (((pureVolume * (solv.density ?? 1) * 1000) / (solv.mw ?? 100))).toFixed(2);
  const weeklyVol = (pureVolume * batches * daysPerWeek).toFixed(2);
  const annualVol = (parseFloat(weeklyVol) * 52).toFixed(0);

  return (
    <section id="calculator" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Solvent calculator</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Recovery &amp; throughput calculator</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Estimate solvent mass, moles and annual throughput from batch volume and frequency.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
            {/* Solvent selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Solvent</label>
              <div className="flex flex-wrap gap-2">
                {solvents.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setSelIdx(i)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selIdx === i ? 'bg-[#BE0010] text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                Flask volume (L): <span className="text-zinc-800">{volume} L</span>
              </label>
              <input type="range" min={0.1} max={3} step={0.1} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#BE0010]" />
              <div className="flex justify-between text-xs text-zinc-400 mt-1"><span>0.1 L</span><span>3 L</span></div>
            </div>

            {/* Concentration */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                Solvent concentration: <span className="text-zinc-800">{concentration}%</span>
              </label>
              <input type="range" min={10} max={100} step={5} value={concentration} onChange={(e) => setConcentration(Number(e.target.value))}
                className="w-full accent-[#BE0010]" />
              <div className="flex justify-between text-xs text-zinc-400 mt-1"><span>10%</span><span>100%</span></div>
            </div>

            {/* Batches / day */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                Batches / day: <span className="text-zinc-800">{batches}</span>
              </label>
              <input type="range" min={1} max={20} value={batches} onChange={(e) => setBatches(Number(e.target.value))}
                className="w-full accent-[#BE0010]" />
              <div className="flex justify-between text-xs text-zinc-400 mt-1"><span>1</span><span>20</span></div>
            </div>

            {/* Days / week */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                Days / week: <span className="text-zinc-800">{daysPerWeek}</span>
              </label>
              <input type="range" min={1} max={7} value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full accent-[#BE0010]" />
              <div className="flex justify-between text-xs text-zinc-400 mt-1"><span>1</span><span>7</span></div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-zinc-200 bg-[#F6F6F6] p-6 shadow-sm">
            <h3 className="font-maxot text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-5">Results</h3>

            <div className="space-y-3">
              {[
                { label: 'Pure solvent per batch', value: `${pureVolume.toFixed(3)} L`, sub: `${(pureVolume * 1000).toFixed(0)} mL` },
                { label: 'Mass per batch', value: `${mass} kg`, sub: `${(parseFloat(mass) * 1000).toFixed(0)} g` },
                { label: 'Moles per batch', value: `${moles} mol`, sub: `MW = ${solv.mw ?? '–'} g/mol` },
                { label: 'Weekly throughput', value: `${weeklyVol} L`, sub: `${batches} batches × ${daysPerWeek} days` },
                { label: 'Annual throughput', value: `${annualVol} L`, sub: `52 weeks / year estimate` },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{r.label}</div>
                    {r.sub && <div className="text-xs text-zinc-400 mt-0.5">{r.sub}</div>}
                  </div>
                  <div className="font-maxot text-lg font-bold text-zinc-950">{r.value}</div>
                </div>
              ))}
            </div>

            {/* Solvent properties */}
            <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-3">{solv.name ?? '–'} properties</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><div className="font-maxot font-bold text-zinc-900">{solv.density ?? '–'}</div><div className="text-xs text-zinc-400">g/mL</div></div>
                <div><div className="font-maxot font-bold text-zinc-900">{solv.mw ?? '–'}</div><div className="text-xs text-zinc-400">g/mol</div></div>
                <div><div className="font-maxot font-bold text-zinc-900">{solv.bp ?? '–'} °C</div><div className="text-xs text-zinc-400">BP (1 atm)</div></div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Indicative estimates only. Actual recovery depends on vacuum level, condenser efficiency, solvent purity and operating conditions.
        </p>
      </div>
    </section>
  );
}
