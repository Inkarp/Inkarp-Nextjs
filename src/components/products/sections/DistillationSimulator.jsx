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
  const minTime = safePoints[0].time;
  const maxTime = Math.max(...safePoints.map((p) => p.time), minTime + 1);
  const timeRange = maxTime - minTime;

  const L = 52, R = 342, T = 14, B = 148;
  const W = R - L, H = B - T;

  const coordStrs = safePoints.map((p) => {
    const x = (L + ((p.time - minTime) / timeRange) * W).toFixed(1);
    const y = (B - (p.recovered / 100) * H).toFixed(1);
    return `${x},${y}`;
  });
  const polyline = coordStrs.join(' ');
  const areaPoints = `${L},${B} ${polyline} ${R},${B}`;
  const lastCoord = (coordStrs.at(-1) ?? `${L},${B}`).split(',');

  const yTicks = [0, 20, 40, 60, 80, 100];
  const xTicks = Array.from({ length: 7 }, (_, i) =>
    Math.round(minTime + (i / 6) * timeRange)
  );

  return (
    <svg className="h-full w-full" viewBox="0 0 360 190" role="img" aria-label="Recovered solvent over time">
      <rect x="0" y="0" width="360" height="190" rx="14" fill="#ffffff" />

      {/* Y-axis rotated label */}
      <text
        transform={`translate(11,${(T + B) / 2}) rotate(-90)`}
        fill="#9CA3AF"
        fontSize="8"
        textAnchor="middle"
      >
        Solvent recovered (%)
      </text>

      {/* Y-axis gridlines + tick labels */}
      {yTicks.map((tick) => {
        const y = B - (tick / 100) * H;
        return (
          <g key={tick}>
            <line x1={L} x2={R} y1={y} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            <text x={L - 4} y={y + 3.5} fill="#9CA3AF" fontSize="8.5" textAnchor="end">{tick}</text>
          </g>
        );
      })}

      {/* Area fill */}
      <polygon fill="#BE0010" fillOpacity="0.09" points={areaPoints} />

      {/* Line */}
      <polyline fill="none" points={polyline} stroke="#BE0010" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

      {/* Live dot */}
      <circle cx={Number(lastCoord[0])} cy={Number(lastCoord[1])} r="4" fill="#BE0010" />

      {/* X-axis baseline */}
      <line x1={L} x2={R} y1={B} y2={B} stroke="#D4D4D8" strokeWidth="1" />

      {/* X-axis tick labels */}
      {xTicks.map((t, i) => {
        const x = (L + ((t - minTime) / timeRange) * W).toFixed(1);
        return (
          <text key={i} x={x} y={B + 13} fill="#9CA3AF" fontSize="8.5" textAnchor="middle">{t}</text>
        );
      })}

      {/* X-axis label */}
      <text x={(L + R) / 2} y={B + 27} fill="#9CA3AF" fontSize="8" textAnchor="middle">
        Time (min)
      </text>
    </svg>
  );
}

function EvaporatorStage({ remaining, running, recoveredPct }) {
  const sampleHeight = clamp(remaining, 0, 100) * 0.62;
  const recvFillH = (clamp(recoveredPct, 0, 100) / 100) * 72;
  const recvFillY = 206 - recvFillH;

  return (
    <svg className="h-full min-h-[160px] w-full" viewBox="0 0 420 300" aria-hidden>
      <defs>
        <clipPath id="recv-clip">
          <circle cx="330" cy="170" r="36" />
        </clipPath>
      </defs>

      {/* bench line */}
      <rect x="14" y="236" width="392" height="18" rx="9" fill="#E5E7EB" />

      {/* evaporation flask body */}
      <rect x="64" y="72" width="72" height="148" rx="16" fill="#F8FAFC" stroke="#D4D4D8" strokeWidth="2" />
      {/* liquid fill — very faint tint, drains as evaporation runs */}
      <rect x="76" y={206 - sampleHeight} width="48" height={sampleHeight} rx="10" fill="#BE0010" opacity="0.1" />
      {/* flask circle */}
      <circle cx="100" cy="146" r="43" fill="none" stroke="#C4C4C8" strokeWidth="2" />
      {/* spinning rod */}
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

      {/* diagonal condenser tube */}
      <line x1="136" y1="108" x2="322" y2="136" stroke="#C4C4C8" strokeWidth="8" strokeLinecap="round" />
      <line x1="136" y1="108" x2="322" y2="136" stroke="#E4E4E7" strokeWidth="3" strokeLinecap="round" />

      {/* receiving flask: fill rises with recovery, clipped to circle shape */}
      <rect
        x="294"
        y={recvFillY}
        width="72"
        height={recvFillH}
        fill="#BE0010"
        opacity="0.18"
        clipPath="url(#recv-clip)"
      />
      {/* receiving flask outline */}
      <circle cx="330" cy="170" r="36" fill="none" stroke="#C4C4C8" strokeWidth="2" />
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
            ...chartPoints,
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
    <section id="simulator" className={`scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-5 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950 lg:min-h-screen lg:flex lg:flex-col ${finished ? 'lg:justify-start' : 'lg:justify-center'}`}>
      <div className="mx-auto w-full">
        <SectionHeader
          number="03"
          eyebrow="Interactive simulator"
          title="Run a simulated evaporation"
          description="Pick a solvent, set the bath temperature and vacuum, then press Start and watch the Hei-VAP Core distil it off — flask spinning, vapour rising, solvent collecting. (Simulation runs far faster than real time and is illustrative only.)"
        />

        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          {/* Left controls panel */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="rounded-xl bg-zinc-950 p-3 text-white dark:bg-black">
              <div className="mb-1.5 flex items-center justify-between text-[9px] uppercase tracking-widest text-black dark:text-zinc-400">
                <span>Hei-VAP Core monitor</span>
                <span>{formatTime(elapsed)}</span>
              </div>
              <div className="font-maxot text-2xl font-bold">{recoveredPct}<span className="text-sm text-black dark:text-zinc-400">% recovered</span></div>
              <p className="mt-1 text-[10px] leading-4 text-black dark:text-zinc-400">{monitorStatus}</p>
              <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
                <div className="rounded-lg bg-white/10 p-1.5"><span className="block text-[8px] uppercase text-black dark:text-zinc-400">Bath</span>{bathTemp}°C</div>
                <div className="rounded-lg bg-white/10 p-1.5"><span className="block text-[8px] uppercase text-black dark:text-zinc-400">Speed</span>180 rpm</div>
                <div className="rounded-lg bg-white/10 p-1.5"><span className="block text-[8px] uppercase text-black dark:text-zinc-400">Vacuum</span>{recommendedVacuum} mbar</div>
              </div>
            </div>

            <div className="mt-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-black dark:text-zinc-100">Solvent</p>
              <div className="space-y-1">
                {solvents.map((s, i) => (
                  <button
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-1.5 text-left text-xs transition ${
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
                    <span className="text-[10px] text-black dark:text-zinc-400">{s.rate} L/h · {s.vp} mbar</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <label className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-black dark:text-zinc-100">
                <span>Bath temperature</span>
                <span className="text-black dark:text-zinc-400">{bathTemp}°C</span>
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

            <div className="mt-3 flex gap-2">
              <button
                className={`flex-1 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition ${running ? 'bg-zinc-900 hover:bg-black dark:bg-zinc-700 dark:hover:bg-zinc-600' : 'bg-[#BE0010] hover:bg-[#9f000d]'}`}
                disabled={finished}
                onClick={() => setRunning((current) => !current)}
                type="button"
              >
                {running ? 'Pause' : finished ? 'Done' : 'Start'}
              </button>
              <button className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700" onClick={reset} type="button">
                Reset
              </button>
            </div>
          </div>

          {/* Right column — stacked */}
          <div className="space-y-6">
            <div className="flex h-[380px] gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex h-full w-1/2 items-center">
                <EvaporatorStage remaining={fill} running={running} recoveredPct={recoveredPct} />
              </div>
              <div className="h-full w-1/2">
                <RecoveryChart points={points} />
              </div>
            </div>

            {finished && (
              <div className="rounded-2xl border border-[#BE0010]/30 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-maxot text-lg font-semibold text-black dark:text-zinc-100">Distillation complete</h3>
                  <span className="rounded-full bg-[#BE0010] px-3 py-1 text-xs font-bold uppercase text-white">
                    RECOVERED
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Solvent', value: solv.name ?? '-', highlight: true },
                    { label: 'Recovered', value: '~100%', highlight: false },
                    { label: 'Evaporation rate', value: `${adjustedRate} L/h`, highlight: false },
                    { label: 'Recommended vacuum', value: `${recommendedVacuum} mbar`, highlight: false },
                  ].map((item) => (
                    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800" key={item.label}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{item.label}</p>
                      <p className={`mt-1 font-maxot text-base font-bold ${item.highlight ? 'text-[#BE0010]' : 'text-black dark:text-zinc-100'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Illustrative figures based on Heidolph evaporation-rate data (ΔT 40°C). Want to see it with your real solvents?{' '}
                  <a className="font-semibold text-[#BE0010] hover:underline" href="#contact">Book a demo</a>
                  {' '}at inkarp.co.in.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
