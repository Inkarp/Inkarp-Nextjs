'use client';
import { useMemo, useState, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

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
      <polygon fill="#161616" fillOpacity="0.07" points={areaPoints} />

      {/* Line */}
      <polyline fill="none" points={polyline} stroke="#161616" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

      {/* Live dot */}
      <circle cx={Number(lastCoord[0])} cy={Number(lastCoord[1])} r="4" fill="var(--red)" />

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
      <rect x="76" y={206 - sampleHeight} width="48" height={sampleHeight} rx="10" fill="#161616" opacity="0.08" />
      {/* flask circle */}
      <circle cx="100" cy="146" r="43" fill="none" stroke="#C4C4C8" strokeWidth="2" />
      {/* spinning rod */}
      <line
        x1="100"
        x2="100"
        y1="104"
        y2="188"
        stroke="var(--red)"
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
        fill="#161616"
        opacity="0.14"
        clipPath="url(#recv-clip)"
      />
      {/* receiving flask outline */}
      <circle cx="330" cy="170" r="36" fill="none" stroke="#C4C4C8" strokeWidth="2" />
    </svg>
  );
}

export default function DistillationSimulator({ data, productName = 'this evaporator' }) {
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
    <section id="simulator" className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] w-full">
        <SectionHeader
          number="03"
          eyebrow="Interactive simulator"
          title="Run a simulated evaporation"
          description={`Pick a solvent, set the bath temperature and vacuum, then press Start and watch ${productName} distil it off - flask spinning, vapour rising, solvent collecting. (Simulation runs far faster than real time and is illustrative only.)`}
        />

        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          {/* Left controls panel */}
          <div className="border border-line-light bg-parchment p-3">
            <div className="bg-black p-3 text-white">
              <div className="mb-1.5 flex items-center justify-between text-[9px] uppercase tracking-widest text-white">
                <span>{productName} monitor</span>
                <span>{formatTime(elapsed)}</span>
              </div>
              <div className="text-2xl font-semibold tracking-tight">{recoveredPct}<span className="text-sm text-white">% recovered</span></div>
              <p className="mt-1 text-[10px] leading-4 text-white">{monitorStatus}</p>
              <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
                <div className="bg-parchment/10 p-1.5"><span className="block text-[8px] uppercase text-black">Bath</span>{bathTemp}°C</div>
                <div className="bg-parchment/10 p-1.5"><span className="block text-[8px] uppercase text-black">Speed</span>180 rpm</div>
                <div className="bg-parchment/10 p-1.5"><span className="block text-[8px] uppercase text-black">Vacuum</span>{recommendedVacuum} mbar</div>
              </div>
            </div>

            <div className="mt-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-black">Solvent</p>
              <div className="space-y-1">
                {solvents.map((s, i) => (
                  <button
                    aria-pressed={selIdx === i}
                    className={`flex w-full items-center justify-between border px-3 py-1.5 text-left text-xs transition ${
                      selIdx === i
                        ? 'border-black bg-red text-white'
                        : 'border-line-light bg-parchment-alt text-black hover:border-line-light'
                    } ${running ? 'cursor-not-allowed opacity-55' : ''}`}
                    disabled={running}
                    key={s.name}
                    onClick={() => selectSolvent(i)}
                    type="button"
                  >
                    <span className="font-semibold">{s.name}</span>
                    <span className={`text-[10px] ${selIdx === i ? 'text-white/70' : 'text-black'}`}>{s.rate} L/h · {s.vp} mbar</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <label className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-black">
                <span>Bath temperature</span>
                <span className="text-black">{bathTemp}°C</span>
              </label>
              <input
                className="w-full accent-red"
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
                className={`flex-1 px-4 py-1.5 text-xs font-semibold text-rose-700 transition ${running ? 'bg-parchment-alt hover:bg-rose-100' : 'bg-rose-50 hover:bg-rose-100'}`}
                disabled={finished}
                onClick={() => setRunning((current) => !current)}
                type="button"
              >
                {running ? 'Pause' : finished ? 'Done' : 'Start'}
              </button>
              <button className="bg-parchment-alt px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-parchment-alt" onClick={reset} type="button">
                Reset
              </button>
            </div>
          </div>

          {/* Right column — stacked */}
          <div className="space-y-6">
            <div className="flex h-auto flex-col gap-4 border border-line-light bg-parchment p-4 sm:h-[380px] sm:flex-row">
              <div className="flex h-[220px] w-full items-center sm:h-full sm:w-1/2">
                <EvaporatorStage remaining={fill} running={running} recoveredPct={recoveredPct} />
              </div>
              <div className="h-[220px] w-full sm:h-full sm:w-1/2">
                <RecoveryChart points={points} />
              </div>
            </div>

            {finished && (
              <div className="border border-line-light bg-parchment p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-ink">Distillation complete</h3>
                  <span className="bg-red px-3 py-1 text-xs font-bold uppercase text-white">
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
                    <div className="border border-line-light bg-parchment-alt p-3 text-sm" key={item.label}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{item.label}</p>
                      <p className={`mt-1 text-base font-semibold tracking-tight ${item.highlight ? 'text-red' : 'text-ink'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-ink-soft">
                  Illustrative figures based on Heidolph evaporation-rate data (ΔT 40°C). Want to see it with your real solvents?{' '}
                  <a className="font-semibold text-red hover:underline" href="#contact">Book a demo</a>
                  {' '}at inkarp.co.in.
                </p>
              </div>
            )}
          </div>
        </div>

        <SectionDisclaimer>
          {data?.disclaimer ?? 'Simulation runs far faster than real time and is illustrative only. Actual evaporation rate depends on solvent purity, vacuum level, bath temperature, condenser setup and cooling efficiency.'}
        </SectionDisclaimer>
      </div>
    </section>
  );
}
