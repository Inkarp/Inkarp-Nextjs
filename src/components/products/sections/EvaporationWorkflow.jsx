'use client';
import { useState, useEffect, useCallback } from 'react';
import SectionHeader from './SectionHeader';

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
      <div className={`h-px w-6 ${active ? 'bg-[#BE0010]' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
      <div className={`h-2.5 w-2.5 rounded-full border-2 ${active ? 'border-[#BE0010] bg-[#BE0010]' : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}`} />
    </div>
  );
}

/* ── Single step card ────────────────────────────────── */
function StepCard({ step, index, isActive, isPast, onClick, totalDuration }) {
  const isFuture = !isActive && !isPast;

  return (
    <button
      onClick={onClick}
      className={`relative flex h-full w-full min-w-[160px] flex-col  border-2 pt-5 px-5 pb-5 text-left transition-all duration-300 ${
        isActive
          ? 'border-[#BE0010] shadow-lg shadow-[#BE0010]/15'
          : isFuture
            ? 'border-zinc-100 bg-white hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
            : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600'
      }`}
      style={isActive ? { background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)' } : {}}
    >
      {/* Progress bar — hugs the top edge of the card, radius matches card */}
      {isActive && (
        <div className="absolute -top-0.5 -left-0.5 -right-0.5 h-1 rounded-t-2xl overflow-hidden bg-[#BE0010]/15">
          <div
            key={`progress-${index}`}
            className="h-full bg-[#BE0010] rounded-full"
            style={{ animation: `hvc-progress-fill ${totalDuration}ms linear forwards` }}
          />
        </div>
      )}

      {/* Step number */}
      <span className={`absolute top-3 right-4 text-xs font-bold tabular-nums ${isActive ? 'text-[#BE0010]' : 'text-black dark:text-zinc-100'}`}>
        {index + 1}
      </span>

      {/* Icon chip — in-flow soft-square, light red tint on inactive, solid red on active */}
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 transition-colors duration-300 ${
          isActive ? 'bg-[#BE0010] text-white' : 'bg-[#BE0010]/10 text-[#BE0010]'
        }`}
      >
        {STEP_ICON_MAP[step.title.toLowerCase()] ?? <span className="text-sm font-bold">{index + 1}</span>}
      </div>

      {/* Title */}
      <h3 className="font-maxot font-bold text-sm mb-2 text-black dark:text-zinc-100">
        {step.title}
      </h3>

      {/* Description — min-h reserves 3 lines (3 × leading-5 = 60px) so all cards
          hold the same height even when shorter descriptions produce fewer lines. */}
      <p className={`text-xs leading-5 min-h-[60px] ${isActive ? 'text-[#BE0010]' : 'text-black dark:text-zinc-400'}`}>
        {step.description}
      </p>
    </button>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function EvaporationWorkflow({ section = {} }) {
  const steps = section.steps ?? [];
  const disclaimer = section.disclaimer;
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
    <section id="workflow" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">

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
              className={`h-2 rounded-full transition-all ${active === i ? 'w-6 bg-[#BE0010]' : 'w-2 bg-zinc-200 dark:bg-zinc-800'}`}
            />
          ))}
        </div>

        {disclaimer && (
          <p className="mt-8 rounded-xl border border-[#BE0010]/15 bg-[#BE0010]/5 p-4 text-xs leading-6 text-black dark:text-zinc-100">
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
