'use client';
import { useState, useEffect, useCallback } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

const STEP_DURATION = 4000; // ms per step

/* Step icons as inline SVGs */
// Keyed by step.title.toLowerCase() so icon assignment survives JSON reordering.
// Falls back to a numbered circle if a title doesn't match any key.
const STEP_ICON_MAP = {
  rotate: (
    <svg key="rotate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
  ),
  heat: (
    <svg key="heat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  evaporate: (
    <svg key="evap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  condense: (
    <svg key="cond" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 2L8 8H4l4 4-1.5 5L12 14l5.5 3L16 12l4-4h-4z" />
    </svg>
  ),
  collect: (
    <svg key="coll" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M8 3l-1 7H5a2 2 0 0 0-2 2v1a9 9 0 0 0 18 0v-1a2 2 0 0 0-2-2h-2L16 3H8z" />
    </svg>
  ),
};

/* Connector between cards */
function Connector({ complete }) {
  return (
    <div className="hidden shrink-0 items-center gap-1 px-1 lg:flex">
      <div className={`h-px w-7 transition-colors duration-300 ${complete ? 'bg-red' : 'bg-line-light'}`} />
      <div className={`h-2.5 w-2.5 border-2 transition-colors duration-300 ${complete ? 'border-red bg-red' : 'border-line-light bg-parchment-alt'}`} />
    </div>
  );
}

/* Single step card */
function StepCard({ step, index, isActive, isPast, onClick, totalDuration }) {
  const isFuture = !isActive && !isPast;

  return (
    <button
      aria-pressed={isActive}
      onClick={onClick}
      className={`group relative flex h-full w-full min-w-[160px] flex-col border-2 px-5 pb-5 pt-5 text-left transition-all duration-300 ${
        isActive
          ? 'z-10 scale-[1.02] border-red bg-white shadow-[0_18px_45px_rgba(190,0,16,0.16)] ring-4 ring-red/10'
          : isFuture
            ? 'border-line-light bg-parchment-alt opacity-45 saturate-0 hover:opacity-80 hover:saturate-100'
            : 'border-line-light bg-parchment opacity-55 saturate-0 hover:opacity-85 hover:saturate-100'
      }`}
    >
      {/* Progress bar at the top edge of the active card. */}
      {isActive && (
        <div className="absolute -left-0.5 -right-0.5 -top-0.5 h-1 overflow-hidden bg-red/15">
          <div
            key={`progress-${index}`}
            className="h-full bg-red"
            style={{ animation: `hvc-progress-fill ${totalDuration}ms linear forwards` }}
          />
        </div>
      )}

      <span className={`absolute right-4 top-3 text-xs font-bold tabular-nums transition-colors ${isActive ? 'text-red' : 'text-ink-soft'}`}>
        {isActive ? 'Active' : String(index + 1).padStart(2, '0')}
      </span>

      <div
        className={`mb-3 inline-flex h-10 w-10 items-center justify-center transition-colors duration-300 ${
          isActive ? 'bg-red text-white' : 'bg-white text-ink-soft'
        }`}
      >
        {STEP_ICON_MAP[step.title.toLowerCase()] ?? <span className="text-sm font-bold">{index + 1}</span>}
      </div>

      <h3 className={`mb-2 text-sm font-semibold tracking-tight transition-colors ${isActive ? 'text-ink' : 'text-ink-soft'}`}>
        {step.title}
      </h3>

      <p className={`min-h-[60px] text-xs leading-5 transition-colors ${isActive ? 'text-black' : 'text-ink-soft'}`}>
        {step.description}
      </p>
    </button>
  );
}

/* Evaporation-rate reference strip */
// Reuses the same metrics feeding the Performance tab/table, so the
// workflow section never carries its own copy of the numbers.
function RateStrip({ metrics }) {
  if (!metrics?.length) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <div
          className="border border-line-light bg-parchment-alt p-3 text-center"
          key={m.label}
        >
          <div className="text-lg font-semibold tracking-tight text-red">{m.value}</div>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-black">{m.label}</p>
        </div>
      ))}
    </div>
  );
}

/* Main component */
export default function EvaporationWorkflow({ section = {}, metrics }) {
  const steps = section.steps ?? [];
  const disclaimer = section.disclaimer;
  const rateMetrics = metrics ?? section.metrics;
  const [active, setActive] = useState(0);

  const advance = useCallback(() => {
    setActive((a) => (a + 1) % steps.length);
  }, [steps.length]);

  useEffect(() => {
    if (!steps.length) return;
    const id = setInterval(advance, STEP_DURATION);
    return () => clearInterval(id);
  }, [advance, steps.length]);

  if (!steps.length) return null;

  return (
    <section id="workflow" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">

        {/* number="02" is fixed for now; derive from section position once a
            master sections array drives page assembly. */}
        <SectionHeader
          number="02"
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        {/* Cards with connectors */}
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2 pt-6 lg:gap-0 lg:overflow-visible lg:pt-0">
          {steps.map((step, i) => (
            <div key={`step-${i}`} className="flex min-w-[160px] flex-1 items-stretch">
              <StepCard
                step={step}
                index={i}
                isActive={active === i}
                isPast={i < active}
                onClick={() => setActive(i)}
                totalDuration={STEP_DURATION}
              />
              {i < steps.length - 1 && (
                <Connector complete={i < active} />
              )}
            </div>
          ))}
        </div>

        {/* Step dots (mobile progress indicator) */}
        <div className="mt-6 flex justify-center gap-2 lg:hidden">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 transition-all ${active === i ? 'w-6 bg-red' : 'w-2 bg-parchment-alt'}`}
            />
          ))}
        </div>

        <SectionDisclaimer>{disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
