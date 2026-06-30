'use client';
import { useMemo, useState } from 'react';
import { FiCheck, FiPlus, FiRefreshCw, FiShield, FiTarget, FiZap } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const ICON_MAP = {
  target: FiTarget,
  shield: FiShield,
  zap: FiZap,
};

function makeCoreCopy(value = '') {
  return String(value)
    .replace(/â€[""]/g, '-')
    .replace(/Â°/g, '°')
    .replace(/Â±/g, '±')
    .replace(/Â²/g, '2');
}

function ScoreRing({ percent }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;
  const glowPx = Math.min(6, Math.round(percent / 16));

  return (
    <div className="relative size-32 shrink-0">
      <svg
        aria-hidden="true"
        className="size-full -rotate-90"
        style={percent > 0 ? { filter: `drop-shadow(0 0 ${glowPx}px rgba(190,0,16,0.35))` } : undefined}
        viewBox="0 0 120 120"
      >
        <circle
          className="stroke-zinc-200 dark:stroke-zinc-800"
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="#BE0010"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-maxot text-3xl font-bold text-black dark:text-zinc-100">
        {percent}%
      </div>
    </div>
  );
}

export default function WorkflowScore({ data }) {
  const steps = data?.steps ?? [];
  const benefits = data?.benefits ?? [];
  const [selected, setSelected] = useState([]);

  const selectedSteps = useMemo(() => selected.map((index) => steps[index]).filter(Boolean), [selected, steps]);
  const percent = steps.length ? Math.round((selectedSteps.length / steps.length) * 100) : 0;

  if (!steps.length) return null;

  const toggleStep = (index) => {
    setSelected((current) => (
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index].sort((a, b) => a - b)
    ));
  };

  return (
    <section id="workflow-score" className="scroll-mt-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="10"
          eyebrow="Interactive - workflow score"
          title={data?.title ?? 'How much of your evaporation workflow can be simplified?'}
          description="Tap the steps your team currently manages manually. We will show how the Hei-VAP Core improves visibility, safety and repeatability."
        />

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isSelected = selected.includes(index);
              return (
                <button
                  className={`flex min-h-14 w-full items-center gap-4 rounded-2xl border px-5 py-3 text-left transition ${
                    isSelected
                      ? 'border-[#BE0010] bg-[#BE0010]/5 text-black dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 hover:border-zinc-400'
                  }`}
                  key={step.label}
                  onClick={() => toggleStep(index)}
                  type="button"
                >
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg border text-sm ${
                    isSelected
                      ? 'border-[#BE0010] bg-[#BE0010] text-white'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100'
                  }`}
                  >
                    {isSelected ? <FiCheck /> : <FiPlus />}
                  </span>
                  <span className="text-base font-semibold">{step.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <ScoreRing percent={percent} />
              <p className="max-w-xs text-base leading-7 text-black dark:text-zinc-400">
                of your selected steps are simplified by the Hei-VAP Core
              </p>
            </div>

            <div className="mt-7">
              <h3 className="font-maxot text-base font-bold text-black dark:text-zinc-100">How the Hei-VAP Core simplifies your selected steps:</h3>
              {selectedSteps.length ? (
                <div className="mt-4 max-h-56 space-y-4 overflow-y-auto pr-1">
                  {selectedSteps.map((step) => (
                    <div className="text-sm leading-6" key={step.label}>
                      <p className="font-bold text-black dark:text-zinc-100">{step.label}</p>
                      <p className="text-zinc-400 dark:text-zinc-500">Manually: {step.manual}</p>
                      <p className="font-semibold text-[#BE0010]">With Hei-VAP Core: {makeCoreCopy(step.core)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 text-center">
                  <FiTarget className="mx-auto mb-3 text-zinc-300 dark:text-zinc-600" size={36} />
                  <p className="text-sm leading-6 text-zinc-400 dark:text-zinc-500">
                    Select one or more manual steps to see the matched Hei-VAP Core improvement.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {benefits.map(({ icon, label }) => {
                const Icon = ICON_MAP[icon];
                return (
                  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-black dark:text-zinc-100" key={label}>
                    {Icon && <Icon className="text-[#BE0010]" />}
                    {label}
                  </span>
                );
              })}
            </div>

            <button
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm font-semibold text-black dark:text-zinc-100 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={() => setSelected([])}
              type="button"
            >
              <FiRefreshCw className="text-sm" />
              Reset selected steps
            </button>

            <a
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#BE0010] px-6 text-sm font-semibold text-white transition hover:bg-[#9f000d]"
              href="#booking"
            >
              Map my evaporation workflow with an expert
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
