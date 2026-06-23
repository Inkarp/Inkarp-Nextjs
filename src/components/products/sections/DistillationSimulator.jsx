'use client';
import { useMemo, useState, useEffect } from 'react';
import SectionHeader from './SectionHeader';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function RecoveryChart({ points }) {
  const safePoints = points.length ? points : [{ time: 0, recovered: 0 }];
  const maxTime = Math.max(...safePoints.map((p) => p.time), 1);
  const polyline = safePoints
    .map((point) => {
      const x = 16 + (point.time / maxTime) * 268;
      const y = 124 - (point.recovered / 100) * 96;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="h-full w-full" viewBox="0 0 300 150" role="img" aria-label="Recovered solvent over time">
      <rect x="0" y="0" width="300" height="150" rx="14" fill="#ffffff" />
      {[0, 25, 50, 75, 100].map((tick) => {
        const y = 124 - (tick / 100) * 96;
        return <line key={tick} x1="16" x2="284" y1={y} y2={y} stroke="#E5E7EB" strokeWidth="1" />;
      })}
      <polyline fill="none" points={polyline} stroke="#BE0010" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      <circle cx={polyline.split(' ').at(-1)?.split(',')[0] ?? 16} cy={polyline.split(' ').at(-1)?.split(',')[1] ?? 124} r="4" fill="#BE0010" />
      <text x="16" y="142" fill="#71717A" fontSize="10">Start</text>
      <text x="244" y="142" fill="#71717A" fontSize="10">Recovered</text>
    </svg>
  );
}

function EvaporatorStage({ remaining, recovered, running }) {
  const sampleHeight = clamp(remaining, 0, 100) * 0.62;
  const receiverHeight = clamp(recovered, 0, 100) * 0.5;

  return (
    <svg className="h-full min-h-[280px] w-full" viewBox="0 0 420 300" aria-hidden>
      <rect x="14" y="236" width="392" height="18" rx="9" fill="#E5E7EB" />
      <rect x="64" y="72" width="72" height="148" rx="16" fill="#F8FAFC" stroke="#D4D4D8" strokeWidth="2" />
      <rect x="76" y={206 - sampleHeight} width="48" height={sampleHeight} rx="10" fill="#BE0010" opacity="0.22" />
      <circle cx="100" cy="146" r="43" fill="none" stroke="#A1A1AA" strokeWidth="2" />
      <line
        x1="100"
        x2="100"
        y1="104"
        y2="188"
        stroke="#BE0010"
        strokeWidth="3"
        strokeLinecap="round"
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: running ? 'hvc-spin 1.1s linear infinite' : undefined,
        }}
      />
      <path d="M136 120 C184 86 222 86 270 120" fill="none" stroke="#71717A" strokeWidth="8" strokeLinecap="round" />
      <path d="M145 118 C188 96 221 96 261 118" fill="none" stroke="#E4E4E7" strokeWidth="3" strokeLinecap="round" />
      <rect x="260" y="76" width="30" height="100" rx="12" fill="#F8FAFC" stroke="#A1A1AA" strokeWidth="2" />
      <g opacity={running ? 1 : 0.25}>
        {[88, 108, 128].map((y, index) => (
          <line key={y} x1="270" x2="280" y1={y} y2={y + 18} stroke="#BE0010" strokeWidth="2" opacity={0.5 + index * 0.12} />
        ))}
      </g>
      <path d="M275 176 C275 206 250 214 224 218" fill="none" stroke="#71717A" strokeWidth="7" strokeLinecap="round" />
      <path d="M200 216 L248 216 L236 246 L212 246 Z" fill="#F8FAFC" stroke="#A1A1AA" strokeWidth="2" />
      <rect x="210" y={246 - receiverHeight} width="28" height={receiverHeight} rx="6" fill="#BE0010" opacity="0.3" />
      {running ? (
        <g fill="#BE0010" opacity="0.55">
          <circle cx="206" cy="122" r="3" style={{ animation: 'hvc-flow-pulse 1.2s ease-in-out infinite' }} />
          <circle cx="226" cy="112" r="2.5" style={{ animation: 'hvc-flow-pulse 1.2s ease-in-out 0.2s infinite' }} />
          <circle cx="246" cy="122" r="2.5" style={{ animation: 'hvc-flow-pulse 1.2s ease-in-out 0.4s infinite' }} />
          <circle cx="248" cy="218" r="3" style={{ animation: 'hvc-marquee-drop 1.4s ease-in-out infinite' }} />
        </g>
      ) : null}
      <text x="100" y="276" textAnchor="middle" fill="#71717A" fontSize="11">evaporation flask</text>
      <text x="276" y="276" textAnchor="middle" fill="#71717A" fontSize="11">receiver</text>
    </svg>
  );
}

export default function DistillationSimulator({ data }) {
  const solvents = data?.solvents ?? [];
  const [selIdx, setSelIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [fill, setFill] = useState(80);
  const [elapsed, setElapsed] = useState(0);
  const [bathTemp, setBathTemp] = useState(solvents[0]?.bathTemp ?? 60);
  const [points, setPoints] = useState([{ time: 0, recovered: 0 }]);
  const [finished, setFinished] = useState(false);

  const solv = solvents[selIdx] ?? {};
  const recommendedVacuum = solv.vp ?? 100;
  const deltaT = Math.max(5, bathTemp - (solv.condTemp ?? 10));
  const adjustedRate = ((solv.rate ?? 1) * (deltaT / 40)).toFixed(2);
  const recovered = clamp(80 - fill, 0, 80);
  const recoveredPct = Math.round((recovered / 80) * 100);

  const monitorStatus = useMemo(() => {
    if (finished) return 'Run complete - review the recovery result';
    if (running) return 'Evaporating - condenser and receiver active';
    return 'Ready - choose a solvent and press Start';
  }, [finished, running]);

  useEffect(() => {
    if (!running) return undefined;

    const id = window.setInterval(() => {
      setFill((current) => {
        const next = Math.max(5, current - 0.9);
        const nextRecovered = Math.round(((80 - next) / 80) * 100);
        setElapsed((seconds) => {
          const nextSeconds = seconds + 1;
          setPoints((chartPoints) => [
            ...chartPoints.slice(-28),
            { time: nextSeconds, recovered: nextRecovered },
          ]);
          return nextSeconds;
        });

        if (next <= 5) {
          window.clearInterval(id);
          setRunning(false);
          setFinished(true);
          window.dispatchEvent(new CustomEvent('product-simulator-complete'));
        }

        return next;
      });
    }, 220);

    return () => window.clearInterval(id);
  }, [running]);

  const reset = () => {
    setFill(80);
    setElapsed(0);
    setRunning(false);
    setFinished(false);
    setPoints([{ time: 0, recovered: 0 }]);
  };

  const selectSolvent = (index) => {
    if (running) return;
    setSelIdx(index);
    setBathTemp(solvents[index]?.bathTemp ?? 60);
    reset();
  };

  return (
    <section id="simulator" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="03"
          eyebrow="Interactive simulator"
          title="Distillation simulator"
          description="Select a solvent, tune the bath temperature and watch the evaporation path from flask to condenser to receiver. Illustrative only; real rates depend on your setup."
        />

        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="rounded-xl bg-zinc-950 p-4 text-white dark:bg-black">
              <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-black dark:text-zinc-400">
                <span>Hei-VAP Core monitor</span>
                <span>{formatTime(elapsed)}</span>
              </div>
              <div className="font-maxot text-3xl font-bold">{recoveredPct}<span className="text-base text-black dark:text-zinc-400">% recovered</span></div>
              <p className="mt-2 min-h-5 text-xs text-black dark:text-zinc-400">{monitorStatus}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-white/10 p-2"><span className="block text-[9px] uppercase text-black dark:text-zinc-400">Bath</span>{bathTemp} deg C</div>
                <div className="rounded-lg bg-white/10 p-2"><span className="block text-[9px] uppercase text-black dark:text-zinc-400">Speed</span>180 rpm</div>
                <div className="rounded-lg bg-white/10 p-2"><span className="block text-[9px] uppercase text-black dark:text-zinc-400">Vacuum</span>{recommendedVacuum} mbar</div>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black dark:text-zinc-100">Solvent</p>
              <div className="space-y-2">
                {solvents.map((s, i) => (
                  <button
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selIdx === i
                        ? 'border-[#BE0010] bg-[#BE0010]/5 text-black dark:text-zinc-100'
                        : 'border-zinc-200 bg-zinc-50 text-black hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600'
                    } ${running ? 'cursor-not-allowed opacity-55' : ''}`}
                    disabled={running}
                    key={s.name}
                    onClick={() => selectSolvent(i)}
                    type="button"
                  >
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-xs text-black dark:text-zinc-400">{s.rate} L/h</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wide text-black dark:text-zinc-100">
                <span>Bath temperature</span>
                <span className="text-black dark:text-zinc-400">{bathTemp} deg C</span>
              </label>
              <input
                className="w-full accent-[#BE0010]"
                disabled={running}
                max={100}
                min={30}
                onChange={(event) => setBathTemp(Number(event.target.value))}
                type="range"
                value={bathTemp}
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition ${running ? 'bg-zinc-900 hover:bg-black dark:bg-zinc-700 dark:hover:bg-zinc-600' : 'bg-[#BE0010] hover:bg-[#9f000d]'}`}
                disabled={finished}
                onClick={() => setRunning((current) => !current)}
                type="button"
              >
                {running ? 'Pause' : finished ? 'Done' : 'Start'}
              </button>
              <button className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700" onClick={reset} type="button">
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <EvaporatorStage recovered={recoveredPct} remaining={fill} running={running} />
            </div>

            <div className="space-y-4">
              <div className="h-[210px] rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <RecoveryChart points={points} />
              </div>

              <div className={`rounded-2xl border p-5 shadow-sm ${finished ? 'border-[#BE0010]/30 bg-[#BE0010]/5' : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}`}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-maxot text-lg font-semibold text-black dark:text-zinc-100">Run result</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${finished ? 'bg-[#BE0010] text-white' : 'bg-zinc-100 text-black dark:bg-zinc-800 dark:text-zinc-100'}`}>
                    {finished ? 'Recovered' : 'In progress'}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Solvent', value: solv.name ?? '-' },
                    { label: 'Recovered', value: `${recoveredPct}%` },
                    { label: 'Estimated rate', value: `${adjustedRate} L/h` },
                    { label: 'Recommended vacuum', value: `${recommendedVacuum} mbar` },
                  ].map((item) => (
                    <div className="rounded-xl bg-white p-3 text-sm dark:bg-zinc-900" key={item.label}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-black dark:text-zinc-100">{item.label}</p>
                      <p className="mt-1 font-maxot text-base font-bold text-black dark:text-zinc-100">{item.value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-black dark:text-zinc-400">
                  This simulation is for workflow discussion only. Inkarp can verify real rates with your solvents, vacuum pump, chiller and glassware setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
