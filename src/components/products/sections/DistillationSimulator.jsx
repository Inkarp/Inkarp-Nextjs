'use client';
import { useState, useEffect } from 'react';

function SimFlask({ level, color = '#BE0010' }) {
  const h = Math.min(100, Math.max(0, level));
  const r = 36;
  const cx = 50;
  const cy = 70;
  const fillY = cy + r - (2 * r * h) / 100;
  const clipId = 'flask-clip';

  return (
    <svg viewBox="0 0 100 130" className="w-28 mx-auto" aria-hidden>
      {/* Flask body */}
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* liquid fill */}
      <rect x={cx - r} y={fillY} width={r * 2} height={(cy + r) - fillY} fill={color} opacity={0.25} clipPath={`url(#${clipId})`} />
      {/* bubbles */}
      {h > 20 && [10, 30, 55].map((bx, i) => (
        <circle
          key={i}
          cx={cx - 12 + bx * 0.5}
          cy={fillY + 8 + i * 7}
          r={2 + i}
          fill={color}
          opacity={0.35}
          style={{ animation: `hvc-bounce ${1.2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      {/* flask outline */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D1D5DB" strokeWidth="1.5" />
      {/* neck */}
      <rect x={44} y={30} width={12} height={5} rx={2} fill="none" stroke="#D1D5DB" strokeWidth="1.5" />
      <path d={`M44 35 Q44 ${cy - r} ${cx - r} ${cy}`} fill="none" stroke="#D1D5DB" strokeWidth="1.5" />
      <path d={`M56 35 Q56 ${cy - r} ${cx + r} ${cy}`} fill="none" stroke="#D1D5DB" strokeWidth="1.5" />
      {/* level label */}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#374151">{Math.round(h)}%</text>
    </svg>
  );
}

export default function DistillationSimulator({ data }) {
  const solvents = data?.solvents ?? [];
  const [selIdx, setSelIdx] = useState(0);
  const [vacuum, setVacuum] = useState(200);
  const [running, setRunning] = useState(false);
  const [fill, setFill] = useState(80);
  const [elapsed, setElapsed] = useState(0);

  const solv = solvents[selIdx] ?? {};
  const deltaT = (solv.bathTemp ?? 80) - (solv.condTemp ?? 10);
  const adjRate = ((solv.rate ?? 1) * (vacuum / (solv.vp ?? 100)) * (deltaT / 40)).toFixed(2);
  const boilingPt = solv.bp ? Math.round(solv.bp - (solv.bp - 20) * (1 - vacuum / 1013)) : '–';

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setFill((f) => {
        if (f <= 5) { setRunning(false); clearInterval(id); return 5; }
        return f - 0.8;
      });
      setElapsed((e) => e + 1);
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => { setFill(80); setElapsed(0); setRunning(false); };

  return (
    <section id="simulator" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Interactive simulator</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Distillation simulator</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Select a solvent, adjust vacuum and watch the evaporation. Illustrative only – real rates depend on your setup.
        </p>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
          {/* Left: Controls */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="font-maxot text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-4">Select solvent</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {solvents.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => { setSelIdx(i); reset(); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selIdx === i ? 'bg-[#BE0010] text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <h3 className="font-maxot text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-2">Vacuum pressure</h3>
            <input
              type="range" min={50} max={900} value={vacuum}
              onChange={(e) => setVacuum(Number(e.target.value))}
              className="w-full accent-[#BE0010] mb-1"
            />
            <div className="flex justify-between text-xs text-zinc-400 mb-6">
              <span>50 mbar (deep)</span><span className="font-bold text-zinc-700">{vacuum} mbar</span><span>900 mbar (light)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Solvent', value: solv.name ?? '–' },
                { label: 'Est. BP at vacuum', value: `${boilingPt} °C` },
                { label: 'Bath temp', value: `${solv.bathTemp ?? '–'} °C` },
                { label: 'Adj. rate', value: `~${adjRate} L/h` },
              ].map((kv) => (
                <div key={kv.label} className="rounded-lg bg-zinc-50 p-3">
                  <div className="text-xs text-zinc-400 uppercase tracking-wide">{kv.label}</div>
                  <div className="font-maxot font-bold text-zinc-900 mt-0.5">{kv.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Flask */}
          <div className="flex flex-col items-center justify-center gap-4">
            <SimFlask level={fill} />
            <div className="text-xs text-zinc-400 text-center">
              <div>{Math.round(elapsed / 5)} min elapsed</div>
              <div className="font-semibold text-zinc-600">{fill < 10 ? 'Complete!' : running ? 'Evaporating…' : 'Paused'}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRunning((r) => !r)}
                className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${running ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#BE0010] hover:bg-[#9f000d]'}`}
              >
                {running ? 'Pause' : fill <= 5 ? 'Done' : 'Start'}
              </button>
              <button onClick={reset} className="rounded-full px-5 py-2 text-sm font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition">
                Reset
              </button>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="font-maxot text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-4">Evaporation progress</h3>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Volume remaining</span><span className="font-semibold">{Math.round(fill)}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-[#BE0010] transition-all duration-300"
                  style={{ width: `${fill}%` }}
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Recovered solvent</span><span className="font-semibold">{Math.round(80 - fill)}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${80 - fill}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-500">Condenser surface</span>
                <span className="font-semibold">0.22 m²</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-500">Speed range</span>
                <span className="font-semibold">10–280 rpm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100">
                <span className="text-zinc-500">Bath volume</span>
                <span className="font-semibold">4.5 L</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-500">Published rate ({solv.name})</span>
                <span className="font-semibold">{solv.rate ?? '–'} L/h</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Illustrative simulation only. Actual evaporation rates depend on solvent, vacuum level, cooling efficiency, glassware and sample conditions.
        </p>
      </div>
    </section>
  );
}
