'use client';
import { useMemo, useState } from 'react';
import { FiCheck, FiPlus, FiRefreshCw, FiShield, FiTarget, FiZap } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const LABEL_OVERRIDES = {
  'Bath temperature setting': 'Setting bath temperature',
  'Rotation speed': 'Setting rotation speed',
  'Flask immersion depth': 'Adjusting flask immersion',
  'Status monitoring': 'Monitoring heating status',
  'Accidental setting change': 'Preventing accidental setting changes',
  'Post-run safety': 'Managing residual heat risk',
  'Solvent condensation': 'Condensing solvent vapour',
  'Solvent recovery': 'Collecting recovered solvent',
};

const BENEFIT_TAGS = [
  { icon: FiTarget, label: 'Manual effort reduced' },
  { icon: FiShield, label: 'Safety improved' },
  { icon: FiZap, label: 'Repeatability improved' },
];

function getStepLabel(step) {
  return LABEL_OVERRIDES[step.label] ?? step.label;
}

function makeCoreCopy(value = '') {
  return String(value)
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/\u00c2\u00b0/g, '\u00B0')
    .replace(/\u00c2\u00b1/g, '\u00B1')
    .replace(/\u00c2\u00b2/g, '2');
}

function ScoreRing({ percent }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative size-32 shrink-0">
      <svg className="size-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" fill="none" r={radius} stroke="#ECECEC" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="#D30013"
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
  const initialSelected = useMemo(() => steps.map((_, index) => index).slice(0, Math.min(6, steps.length)), [steps]);
  const [selected, setSelected] = useState(initialSelected);

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
    <section id="workflow-score" className="scroll-mt-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
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
                      ? 'border-[#D30013] bg-[#D30013]/[0.07] text-black dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 hover:border-zinc-300'
                  }`}
                  key={step.label}
                  onClick={() => toggleStep(index)}
                  type="button"
                >
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg border text-sm ${
                    isSelected
                      ? 'border-[#D30013] bg-[#D30013] text-white'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100'
                  }`}
                  >
                    {isSelected ? <FiCheck /> : <FiPlus />}
                  </span>
                  <span className="text-base font-semibold">{getStepLabel(step)}</span>
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
                <div className="mt-4 space-y-3">
                  {selectedSteps.map((step) => (
                    <div className="flex items-start gap-3 text-sm leading-6 text-black dark:text-zinc-400" key={step.label}>
                      <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border border-[#D30013] text-[#D30013]">
                        <FiCheck className="text-[10px]" />
                      </span>
                      <p>
                        <span className="font-bold text-black dark:text-zinc-100">{getStepLabel(step)}:</span> {makeCoreCopy(step.core)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 text-sm leading-6 text-black dark:text-zinc-400">
                  Select one or more manual steps to see the matched Hei-VAP Core improvement.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {BENEFIT_TAGS.map(({ icon: Icon, label }) => (
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-black dark:text-zinc-100" key={label}>
                  <Icon className="text-[#D30013]" />
                  {label}
                </span>
              ))}
            </div>

            <button
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm font-semibold text-black dark:text-zinc-100 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={() => setSelected(initialSelected)}
              type="button"
            >
              <FiRefreshCw className="text-sm" />
              Reset selected steps
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
