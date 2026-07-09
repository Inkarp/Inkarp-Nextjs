'use client';
import { useState, useEffect, useCallback } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

const STEP_DURATION = 4000; // ms per step

/* ── Step icons as inline SVGs ───────────────────────── */
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

/* ── Connector between cards ─────────────────────────── */
function Connector({ active }) {
  return (
    <div className="hidden lg:flex items-center gap-1 shrink-0">
      <div className={`h-px w-6 ${active ? 'bg-red' : 'bg-parchment-alt'}`} />
      <div className={`h-2.5 w-2.5 border-2 ${active ? 'border-navy bg-red' : 'border-line-light bg-parchment'}`} />
    </div>
  );
}

/* ── Single step card ────────────────────────────────── */
function StepCard({ step, index, isActive, isPast, onClick, totalDuration }) {
  const isFuture = !isActive && !isPast;

  return (
    <button
      onClick={onClick}
      className={`relative flex h-full w-full min-w-[160px] flex-col  border-2 border-red pt-5 px-5 pb-5 text-left transition-all duration-300 ${
        isActive
          ? 'bg-parchment-alt'
          : isFuture
            ? 'bg-parchment hover:bg-parchment-alt'
            : 'bg-parchment hover:bg-parchment-alt'
      }`}
    >
      {/* Progress bar — hugs the top edge of the card, radius matches card */}
      {isActive && (
        <div className="absolute -top-0.5 -left-0.5 -right-0.5 h-1-2xl overflow-hidden bg-red/15">
          <div
            key={`progress-${index}`}
            className="h-full bg-red"
            style={{ animation: `hvc-progress-fill ${totalDuration}ms linear forwards` }}
          />
        </div>
      )}

      {/* Step number */}
      <span className="absolute top-3 right-4 text-xs font-bold tabular-nums text-black">
        {index + 1}
      </span>

      {/* Icon chip — in-flow soft-square, neutral tint on inactive, solid navy on active */}
      <div
        className={`inline-flex h-10 w-10 items-center justify-center mb-3 transition-colors duration-300 ${
          isActive ? 'bg-red text-white' : 'bg-parchment-alt text-ink'
        }`}
      >
        {STEP_ICON_MAP[step.title.toLowerCase()] ?? <span className="text-sm font-bold">{index + 1}</span>}
      </div>

      {/* Title */}
      <h3 className="font-semibold tracking-tight text-sm mb-2 text-ink">
        {step.title}
      </h3>

      {/* Description — min-h reserves 3 lines (3 × leading-5 = 60px) so all cards
          hold the same height even when shorter descriptions produce fewer lines. */}
      <p className="text-xs leading-5 min-h-[60px] text-black">
        {step.description}
      </p>
    </button>
  );
}

/* ── Evaporation-rate reference strip ────────────────── */
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

/* ── Main component ──────────────────────────────────── */
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
        <div className="flex items-stretch gap-0 overflow-x-auto pt-6 pb-2 lg:overflow-visible lg:pt-0">
          {steps.map((step, i) => (
            <div key={`step-${i}`} className="flex items-stretch flex-1 min-w-[160px]">
              <StepCard
                step={step}
                index={i}
                isActive={active === i}
                isPast={i < active}
                onClick={() => setActive(i)}
                totalDuration={STEP_DURATION}
              />
              {i < steps.length - 1 && (
                <Connector active={i < active || active > i} />
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
