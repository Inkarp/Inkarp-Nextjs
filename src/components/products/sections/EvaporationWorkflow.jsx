'use client';
import { useState, useEffect, useCallback } from 'react';

const STEP_DURATION = 4000; // ms per step

/* ── Step icons as inline SVGs ───────────────────────── */
const STEP_ICONS = [
  /* Rotate */
  <svg key="rotate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>,
  /* Heat */
  <svg key="heat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>,
  /* Evaporate */
  <svg key="evap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>,
  /* Condense */
  <svg key="cond" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M12 2L8 8H4l4 4-1.5 5L12 14l5.5 3L16 12l4-4h-4z" />
  </svg>,
  /* Collect */
  <svg key="coll" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M8 3l-1 7H5a2 2 0 0 0-2 2v1a9 9 0 0 0 18 0v-1a2 2 0 0 0-2-2h-2L16 3H8z" />
  </svg>,
];

/* ── Connector between cards ─────────────────────────── */
function Connector({ active }) {
  return (
    <div className="hidden lg:flex items-center gap-1 shrink-0">
      <div className={`h-px w-6 ${active ? 'bg-[#BE0010]' : 'bg-zinc-200'}`} />
      <div className={`h-2.5 w-2.5 rounded-full border-2 ${active ? 'border-[#BE0010] bg-[#BE0010]' : 'border-zinc-200 bg-white'}`} />
    </div>
  );
}

/* ── Single step card ────────────────────────────────── */
function StepCard({ step, index, isActive, isPast, onClick, totalDuration }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 min-w-[160px] rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
        isActive
          ? 'border-[#BE0010] shadow-lg shadow-[#BE0010]/15'
          : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
      style={isActive ? { background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)' } : {}}
    >
      {/* Progress bar at top — only on active card */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl overflow-hidden bg-[#BE0010]/15">
          <div
            key={`progress-${index}`}
            className="h-full bg-[#BE0010] rounded-full"
            style={{ animation: `hvc-progress-fill ${totalDuration}ms linear forwards` }}
          />
        </div>
      )}

      {/* Step number */}
      <span className={`absolute top-3 right-4 text-xs font-bold tabular-nums ${isActive ? 'text-[#BE0010]' : 'text-zinc-300'}`}>
        {index + 1}
      </span>

      {/* Icon circle */}
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
        isActive ? 'bg-[#BE0010] text-white' : 'bg-[#BE0010]/10 text-[#BE0010]'
      }`}>
        {STEP_ICONS[index] ?? <span className="text-sm font-bold">{index + 1}</span>}
      </div>

      {/* Title */}
      <h3 className={`font-maxot font-bold text-sm mb-2 ${isActive ? 'text-zinc-950' : 'text-zinc-700'}`}>
        {step.title}
      </h3>

      {/* Description */}
      <p className={`text-xs leading-5 ${isActive ? 'text-[#BE0010]' : 'text-zinc-500'}`}>
        {step.description}
      </p>
    </button>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function EvaporationWorkflow({ steps = [], disclaimer }) {
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
    <section id="workflow" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header with watermark */}
        <div className="relative mb-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-4 right-0 select-none font-maxot text-[120px] font-bold leading-none text-zinc-100 sm:text-[160px]"
          >
            02
          </span>

          <p className="flex items-center gap-2 font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#BE0010]" />
            How it works
          </p>
          <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">
            The rotary evaporation cycle
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-500">
            How the Hei-VAP Core gently removes solvent — a continuous loop of rotate, heat, evaporate, condense and collect.
          </p>
        </div>

        {/* Cards with connectors */}
        <div className="flex items-stretch gap-0 overflow-x-auto pb-2 lg:overflow-visible">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-center flex-1 min-w-[160px]">
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
              className={`h-2 rounded-full transition-all ${active === i ? 'w-6 bg-[#BE0010]' : 'w-2 bg-zinc-200'}`}
            />
          ))}
        </div>

        {disclaimer && (
          <p className="mt-8 rounded-xl border border-[#BE0010]/15 bg-[#BE0010]/5 p-4 text-xs leading-6 text-zinc-500">
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
