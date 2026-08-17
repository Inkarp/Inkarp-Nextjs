'use client';
import { useMemo, useState } from 'react';
import { FiClock, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

function toNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
}

function NumberField({ field, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-black">{field.label}</span>
      {field.note ? <span className="mt-1 block text-xs leading-5 text-ink-soft">{field.note}</span> : null}
      <div className="mt-2 flex h-12 overflow-hidden border border-line-light bg-white focus-within:border-red focus-within:ring-4 focus-within:ring-red/10">
        <input
          className="min-w-0 flex-1 bg-transparent px-4 text-base font-semibold text-ink outline-none"
          min={field.min ?? 0}
          onChange={(event) => onChange(toNumber(event.target.value))}
          step={field.step ?? 1}
          type="number"
          value={value}
        />
        {field.unit ? (
          <span className="flex items-center border-l border-line-light bg-parchment-alt px-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
            {field.unit}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export default function UnattendedHoursPlanner({ data, productName }) {
  const fields = data?.fields ?? [];
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((field) => [field.key, field.default ?? 0])));
  const [blockedByPersonnel, setBlockedByPersonnel] = useState(Boolean(data?.blockedDefault));

  const results = useMemo(() => {
    const operatorHours = toNumber(values.operatorHours);
    const runsPerWeek = toNumber(values.runsPerWeek);
    const idleHours = toNumber(values.idleHours);
    const analyticalLitersMonthly = toNumber(values.analyticalLitersMonthly);
    const wasteLitersMonthly = toNumber(values.wasteLitersMonthly);

    const annualOperatorHours = Math.round(operatorHours * 52);
    const annualTouchpoints = Math.round(runsPerWeek * 52);
    const annualIdleWindow = Math.round(idleHours * 52);
    const annualSolventVolume = Math.round((analyticalLitersMonthly + wasteLitersMonthly) * 12);
    const caseScore =
      (operatorHours >= 4 ? 1 : 0) +
      (idleHours >= 10 ? 1 : 0) +
      (annualSolventVolume >= 600 ? 1 : 0) +
      (blockedByPersonnel ? 1 : 0);

    return {
      annualOperatorHours,
      annualTouchpoints,
      annualIdleWindow,
      annualSolventVolume,
      caseStrength: caseScore >= 3 ? 'Strong review case' : caseScore >= 2 ? 'Worth reviewing' : 'Early-stage review',
    };
  }, [blockedByPersonnel, values]);

  if (!fields.length) return null;

  const summary = [
    `Product: ${productName}`,
    `Operator hours spent on refilling/collector emptying per week: ${values.operatorHours ?? 0}`,
    `Distillation runs per week: ${values.runsPerWeek ?? 0}`,
    `Idle hours outside working hours per week: ${values.idleHours ?? 0}`,
    `Analytical-grade solvent bought per month: ${values.analyticalLitersMonthly ?? 0} L`,
    `Solvent waste sent for disposal per month: ${values.wasteLitersMonthly ?? 0} L`,
    `In-house reprocessing ruled out on personnel cost: ${blockedByPersonnel ? 'Yes' : 'No'}`,
    `Estimated annual operator hours to review: ${results.annualOperatorHours}`,
    `Estimated annual unattended window to review: ${results.annualIdleWindow}`,
    `Estimated annual solvent volume to review: ${results.annualSolventVolume} L`,
    `Planner signal: ${results.caseStrength}`,
  ].join('\n');

  return (
    <section id={data?.sectionId ?? 'cost-recovery'} className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeader
          number={data?.number ?? '13'}
          eyebrow={data?.eyebrow}
          title={data?.title}
          description={data?.description}
        />

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border border-line-light bg-parchment p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <NumberField
                  field={field}
                  key={field.key}
                  onChange={(nextValue) => setValues((current) => ({ ...current, [field.key]: nextValue }))}
                  value={values[field.key] ?? 0}
                />
              ))}
            </div>

            <label className="mt-5 flex items-start gap-3 border border-line-light bg-parchment-alt p-4 text-sm font-semibold text-black">
              <input
                checked={blockedByPersonnel}
                className="mt-1 h-4 w-4 accent-red"
                onChange={(event) => setBlockedByPersonnel(event.target.checked)}
                type="checkbox"
              />
              <span>
                In-house solvent reprocessing has been ruled out mainly because the manual work is too high.
              </span>
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <LeadCaptureForm
                formType="unattended-hours-planner"
                productName={productName}
                submitLabel={data?.ctaLabel ?? 'Build my cost case'}
                successMessage={(name) =>
                  `Thank you${name ? `, ${name}` : ''}. Inkarp will review these operating numbers and work through the setup case with you.`
                }
                summary={summary}
                triggerLabel={data?.ctaLabel ?? 'Build my cost case'}
              />
              <button
                className="inline-flex h-11 items-center gap-2 border border-line-light px-5 text-sm font-bold text-black transition hover:border-red hover:text-red"
                onClick={() => {
                  setValues(Object.fromEntries(fields.map((field) => [field.key, field.default ?? 0])));
                  setBlockedByPersonnel(Boolean(data?.blockedDefault));
                }}
                type="button"
              >
                <FiRefreshCw className="text-red" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="border border-line-light bg-parchment p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <FiClock className="text-red" />
                Operator hours to review per year
              </p>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-red">{results.annualOperatorHours}</div>
            </div>
            <div className="border border-line-light bg-parchment p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <FiClock className="text-red" />
                Unattended processing window per year
              </p>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-ink">{results.annualIdleWindow}</div>
            </div>
            <div className="border border-line-light bg-parchment p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <FiTrendingUp className="text-red" />
                Annual solvent volume to assess
              </p>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-ink">{results.annualSolventVolume} L</div>
            </div>
            <div className="border border-line-light bg-red p-5 text-white">
              <p className="text-sm font-semibold text-white/80">Planner signal</p>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{results.caseStrength}</div>
              <p className="mt-3 text-sm leading-6 text-white/85">
                {data?.resultNote}
              </p>
            </div>
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
