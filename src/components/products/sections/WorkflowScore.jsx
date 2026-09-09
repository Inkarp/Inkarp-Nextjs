'use client';
import { useMemo, useState } from 'react';
import {
  FiArchive, FiCheck, FiClock, FiCpu, FiDroplet, FiEye, FiFileText, FiMove,
  FiRefreshCw, FiRepeat, FiRotateCw, FiShield, FiTarget, FiThermometer, FiUsers, FiZap,
} from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

/* Benefit-pill icons, selectable by key from product JSON */
const ICON_MAP = {
  target: FiTarget,
  shield: FiShield,
  zap: FiZap,
  rotate: FiRotateCw,
  clock: FiClock,
  cpu: FiCpu,
  repeat: FiRepeat,
  users: FiUsers,
};

/* Step-badge icons, resolved dynamically from the step label so both
   rotary-evaporator and orbital-shaker (and future) workflow steps get a
   fitting icon without needing a per-product icon key in the JSON. */
const STEP_ICON_RULES = [
  { match: (t) => t.includes('speed') || t.includes('rotation') || t.includes('rpm'), icon: FiRotateCw },
  { match: (t) => t.includes('timer') || t.includes('timing'), icon: FiClock },
  { match: (t) => t.includes('temperature') || t.includes('bath') || t.includes('heat'), icon: FiThermometer },
  { match: (t) => t.includes('immersion') || t.includes('flask') || t.includes('position') || t.includes('alignment'), icon: FiMove },
  { match: (t) => t.includes('monitor') || t.includes('checking') || t.includes('progress') || t.includes('status'), icon: FiEye },
  { match: (t) => t.includes('writing') || t.includes('logging') || t.includes('condition') || t.includes('document'), icon: FiFileText },
  { match: (t) => t.includes('accidental') || t.includes('residual') || t.includes('risk') || t.includes('safety'), icon: FiShield },
  { match: (t) => t.includes('condens'), icon: FiDroplet },
  { match: (t) => t.includes('collect') || t.includes('recover'), icon: FiArchive },
  { match: (t) => t.includes('re-entering') || t.includes('method') || t.includes('profile'), icon: FiRepeat },
  { match: (t) => t.includes('automat') || t.includes('robotic') || t.includes('coordinat'), icon: FiCpu },
  { match: (t) => t.includes('operator') || t.includes('result'), icon: FiUsers },
];

function resolveStepIcon(label = '') {
  const t = label.toLowerCase();
  return STEP_ICON_RULES.find((rule) => rule.match(t))?.icon ?? FiTarget;
}

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
        viewBox="0 0 120 120"
      >
        <circle
          className="stroke-line-light "
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
          stroke="var(--red)"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tracking-tight text-ink">
        {percent}%
      </div>
    </div>
  );
}

export default function WorkflowScore({ data, productName }) {
  const name = productName ?? 'this product';
  const steps = data?.steps ?? [];
  const benefits = data?.benefits ?? [];
  const bands = data?.bands ?? [];
  const [selected, setSelected] = useState([]);

  const selectedSteps = useMemo(() => selected.map((index) => steps[index]).filter(Boolean), [selected, steps]);
  const percent = steps.length ? Math.round((selectedSteps.length / steps.length) * 100) : 0;
  // Optional readiness bands: when the content supplies count-based tiers
  // (e.g. "0-2 manual steps = High readiness"), show that tier's summary
  // alongside the existing per-step comparisons. Absent for products that
  // don't define bands, so this stays inert for the original per-step-only
  // use (Heidolph rotary evaporators).
  const band = useMemo(
    () => bands.find((b) => selectedSteps.length >= b.min && selectedSteps.length <= b.max),
    [bands, selectedSteps.length]
  );

  if (!steps.length) return null;

  const toggleStep = (index) => {
    setSelected((current) => (
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index].sort((a, b) => a - b)
    ));
  };

  return (
    <section id="workflow-score" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px]">
        <SectionHeader
          number="10"
          eyebrow="Interactive - workflow score"
          title={data?.title ?? `How much of your workflow can ${name} simplify?`}
          description={data?.description ?? `Tap the steps your team currently manages manually. We will show how ${name} improves visibility, safety and repeatability.`}
        />

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isSelected = selected.includes(index);
              const StepIcon = resolveStepIcon(step.label);
              return (
                <button
                  aria-pressed={isSelected}
                  className={`flex min-h-14 w-full items-center gap-4 border px-5 py-3 text-left transition ${
                    isSelected
                      ? 'border-black bg-red text-white'
                      : 'border-line-light bg-parchment text-black hover:border-line-light'
                  }`}
                  key={step.label}
                  onClick={() => toggleStep(index)}
                  type="button"
                >
                  <span className={`flex size-7 shrink-0 items-center justify-center border text-sm ${
                    isSelected
                      ? 'border-black bg-red text-white'
                      : 'border-red/30 bg-parchment text-red'
                  }`}
                  >
                    {isSelected ? <FiCheck /> : <StepIcon />}
                  </span>
                  <span className="text-base font-semibold">{step.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border border-line-light bg-parchment p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <ScoreRing percent={percent} />
              <p className="max-w-xs text-base leading-7 text-black">
                of your selected steps are simplified by {name}
              </p>
            </div>

            {band ? (
              <div className="mt-6 border border-line-light bg-parchment-alt p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-red">{band.title}</p>
                <dl className="mt-3 space-y-2 text-sm leading-6">
                  {band.meaning ? (
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-black">Meaning:</dt>
                      <dd className="text-ink-soft">{band.meaning}</dd>
                    </div>
                  ) : null}
                  {band.biggestGains ? (
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-black">Biggest gains:</dt>
                      <dd className="text-ink-soft">{band.biggestGains}</dd>
                    </div>
                  ) : null}
                  {band.recommendedConfiguration ? (
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-black">Recommended configuration:</dt>
                      <dd className="text-ink-soft">{band.recommendedConfiguration}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : null}

            <div className="mt-7">
              <h3 className="text-base font-semibold tracking-tight text-ink">How {name} simplifies your selected steps:</h3>
              {selectedSteps.length ? (
                <div className="mt-4 max-h-56 space-y-4 overflow-y-auto pr-1">
                  {selectedSteps.map((step) => (
                    <div className="text-sm leading-6" key={step.label}>
                      <p className="font-bold text-black">{step.label}</p>
                      <p className="text-ink-soft">Manually: {step.manual}</p>
                      <p className="font-semibold text-red">With {name}: {makeCoreCopy(step.core)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 border border-line-light bg-parchment-alt p-6 text-center">
                  <FiTarget className="mx-auto mb-3 text-ink-soft" size={36} />
                  <p className="text-sm leading-6 text-ink-soft">
                    Select one or more manual steps to see the matched improvement.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {benefits.map(({ icon, label }) => {
                const Icon = ICON_MAP[icon];
                return (
                  <span className="inline-flex items-center gap-2 border border-line-light bg-parchment px-4 py-2 text-xs font-bold text-black" key={label}>
                    {Icon && <Icon className="text-red" />}
                    {label}
                  </span>
                );
              })}
            </div>

            <button
              className="mt-6 inline-flex items-center gap-2 border border-line-light px-4 py-2 text-sm font-semibold text-black transition hover:bg-parchment-alt"
              onClick={() => setSelected([])}
              type="button"
            >
              <FiRefreshCw className="text-sm" />
              Reset selected steps
            </button>

            {selectedSteps.length ? (
              <LeadCaptureForm
                className="mt-4 w-full"
                formType="workflow-score"
                productName={name}
                successMessage={(contactName) =>
                  `Thank you${contactName ? `, ${contactName}` : ''}. We have sent your workflow score to our team.`
                }
                summary={`Score: ${percent}%${band ? ` — ${band.title}` : ''}\n\nManual steps selected:\n${selectedSteps
                  .map((step) => `- ${step.label} (manually: ${step.manual})`)
                  .join('\n')}`}
                triggerLabel={data?.ctaLabel ?? 'Map my workflow with an expert'}
              />
            ) : null}
          </div>
        </div>

        <SectionDisclaimer>
          {data?.disclaimer ?? "This tool gives an indicative simplification score based on the steps you select. Actual time, safety and repeatability gains depend on your lab's workflow and operating practice."}
        </SectionDisclaimer>
      </div>
    </section>
  );
}
