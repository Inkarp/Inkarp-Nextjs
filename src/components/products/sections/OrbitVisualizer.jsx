'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

const DEFAULT_MODES = [
  { key: 'touch', label: 'Touch (press)', explain: 'Press to engage the orbit; release and the motion stops.', holdToRun: true },
  { key: 'cont', label: 'Continuous', explain: 'The orbit runs hands-free and keeps going.', holdToRun: false },
];

function formatNumber(value) {
  return value.toLocaleString('en-US');
}

export default function OrbitVisualizer({ data, productName = 'this mixer' }) {
  const speedCfg = data?.speed ?? { min: 100, max: 3200, step: 100, default: 1600, unit: 'rpm' };
  const modes = useMemo(() => (data?.modes?.length ? data.modes : DEFAULT_MODES), [data?.modes]);

  const [speed, setSpeed] = useState(speedCfg.default ?? speedCfg.min);
  const [modeKey, setModeKey] = useState(data?.defaultMode ?? modes[0]?.key);

  const svgRef = useRef(null);
  const rigRef = useRef(null);
  const dotRef = useRef(null);
  const liquidRef = useRef(null);
  const vortexRef = useRef(null);

  const speedRef = useRef(speed);
  const modeKeyRef = useRef(modeKey);
  const runningRef = useRef(false);
  const angRef = useRef(0);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { modeKeyRef.current = modeKey; }, [modeKey]);

  useEffect(() => {
    let rafId;

    const range = Math.max(1, (speedCfg.max ?? 3200) - (speedCfg.min ?? 100));

    function frame() {
      const activeMode = modes.find((m) => m.key === modeKeyRef.current) ?? modes[0];
      const engaged = activeMode?.holdToRun ? runningRef.current : true;

      const t = (speedRef.current - (speedCfg.min ?? 100)) / range;
      const amp = engaged ? 2.2 + t * 3 : 0;
      angRef.current += 0.15 + t * 0.9;
      const ang = angRef.current;
      const ox = Math.cos(ang) * amp;
      const oy = Math.sin(ang) * amp * 0.4;

      if (rigRef.current) {
        rigRef.current.setAttribute('transform', `translate(${ox.toFixed(2)},${oy.toFixed(2)})`);
      }
      if (dotRef.current) {
        dotRef.current.setAttribute('cx', (100 + Math.cos(ang) * 18).toFixed(2));
        dotRef.current.setAttribute('cy', (196 + Math.sin(ang) * 6).toFixed(2));
      }

      const depth = engaged ? 6 + t * 104 : 0;
      const halfW = engaged ? 2 + t * 12 : 0;
      const coneTop = Math.max(150 - t * 24, 44);
      if (vortexRef.current) {
        vortexRef.current.setAttribute(
          'd',
          `M${100 - halfW},${coneTop} Q100,${coneTop + 4} ${100 + halfW},${coneTop} L101,${coneTop + depth} L99,${coneTop + depth} Z`
        );
      }

      const surfTop = engaged ? Math.max(150 - t * 20, 42) : 150;
      if (liquidRef.current) {
        liquidRef.current.setAttribute('d', `M84,${surfTop} L116,${surfTop} L116,188 L84,188 Z`);
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [modes, speedCfg.max, speedCfg.min]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

    const press = () => {
      if (modes.find((m) => m.key === modeKeyRef.current)?.holdToRun) runningRef.current = true;
    };
    const release = () => {
      if (modes.find((m) => m.key === modeKeyRef.current)?.holdToRun) runningRef.current = false;
    };
    const touchStart = (event) => { press(); event.preventDefault(); };

    svg.addEventListener('mousedown', press);
    svg.addEventListener('mouseup', release);
    svg.addEventListener('mouseleave', release);
    svg.addEventListener('touchstart', touchStart, { passive: false });
    svg.addEventListener('touchend', release);

    return () => {
      svg.removeEventListener('mousedown', press);
      svg.removeEventListener('mouseup', release);
      svg.removeEventListener('mouseleave', release);
      svg.removeEventListener('touchstart', touchStart);
      svg.removeEventListener('touchend', release);
    };
  }, [modes]);

  if (!data) return null;

  const activeMode = modes.find((m) => m.key === modeKey) ?? modes[0];

  return (
    <section id={data.sectionId ?? 'mechanism'} className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader
          eyebrow={data.eyebrow ?? 'How it works'}
          title={data.title ?? `How the ${productName} works`}
          description={data.description}
        />

        <div className="flex flex-col gap-6 border border-line-light bg-white p-5 sm:p-6 lg:flex-row lg:items-stretch">
          <div className="flex flex-1 items-center justify-center bg-parchment-alt py-6 lg:max-w-[220px]">
            <svg
              ref={svgRef}
              viewBox="0 0 200 260"
              className="h-[220px] w-[170px] cursor-pointer touch-none select-none"
              role="img"
              aria-label={`Cutaway of the ${productName} head tracing a circular orbit`}
            >
              <ellipse cx="100" cy="196" rx="18" ry="6" fill="none" stroke="#C3CCD1" strokeWidth="1.5" strokeDasharray="3 3" />
              <g ref={rigRef}>
                <clipPath id="orbit-tube-clip">
                  <rect x="82" y="40" width="36" height="150" rx="16" />
                </clipPath>
                <g clipPath="url(#orbit-tube-clip)">
                  <path ref={liquidRef} d="M84,150 L116,150 L116,188 L84,188 Z" fill="#BE0010" />
                  <path ref={vortexRef} d="M100,150 Z" fill="#F5F7F8" opacity="0.92" />
                </g>
                <rect x="80" y="38" width="40" height="154" rx="18" fill="none" stroke="#C3CCD1" strokeWidth="2" />
                <rect x="74" y="192" width="52" height="20" rx="6" fill="#B4B2A9" />
              </g>
              <circle ref={dotRef} cx="100" cy="196" r="4" fill="#12232E" />
              {data.orbitLabel && (
                <text x="100" y="238" textAnchor="middle" fontSize="11" fill="#8A959B">{data.orbitLabel}</text>
              )}
            </svg>
          </div>

          <div className="flex-1">
            <label className="text-sm font-semibold text-black">Speed</label>
            <div className="mb-1 mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-ink">{formatNumber(speed)}</span>
              <span className="text-sm text-ink-soft">{speedCfg.unit ?? 'rpm'}</span>
            </div>
            <input
              className="w-full accent-red"
              max={speedCfg.max ?? 3200}
              min={speedCfg.min ?? 100}
              onChange={(event) => setSpeed(Number(event.target.value))}
              step={speedCfg.step ?? 100}
              type="range"
              value={speed}
            />
            <div className="mt-1 flex justify-between text-xs text-ink-soft">
              <span>{formatNumber(speedCfg.min ?? 100)}</span>
              <span>{formatNumber(speedCfg.max ?? 3200)}</span>
            </div>

            {modes.length > 1 && (
              <>
                <p className="mb-2 mt-5 text-sm font-semibold text-black">Operating mode</p>
                <div className="flex gap-2">
                  {modes.map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => setModeKey(mode.key)}
                      type="button"
                      aria-pressed={modeKey === mode.key}
                      className={`flex-1 border px-3 py-2.5 text-sm font-semibold transition ${
                        modeKey === mode.key
                          ? 'border-red bg-red/5 text-red'
                          : 'border-line-light bg-white text-ink hover:border-red/40'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="mt-5 min-h-[64px] text-sm leading-6 text-ink-soft">{activeMode?.explain}</p>

            {data.note && (
              <p className="mt-2 border-t border-line-light pt-3 text-xs leading-5 text-ink-soft">{data.note}</p>
            )}
          </div>
        </div>

        {data.footer && (
          <p className="mt-4 text-xs text-ink-soft">{data.footer}</p>
        )}

        <SectionDisclaimer>{data.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
