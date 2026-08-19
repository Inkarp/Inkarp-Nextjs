'use client';
import { useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

const DEFAULT_FIELDS = [
  { key: 'samples', label: 'Samples to screen', default: 24, min: 1 },
  { key: 'cyclesPerSample', label: 'Cycles per sample', default: 2, min: 1 },
  { key: 'hoursPerDay', label: 'Working hours available per day', default: 7, min: 1, max: 24 },
];

function cleanNumber(value, { min = 0, max } = {}) {
  const next = Math.round(Number(value));
  if (!Number.isFinite(next)) return min;
  if (max != null && next > max) return max;
  return Math.max(min, next);
}

function NumberInput({ field, onChange, value }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black">{field.label}</span>
      <input
        className="mt-2 h-11 w-full border border-line-light bg-parchment-alt px-4 text-lg font-semibold tracking-tight text-ink outline-none transition focus:border-red focus:bg-parchment focus:ring-4 focus:ring-red/10"
        max={field.max}
        min={field.min ?? 0}
        onChange={(event) => onChange(cleanNumber(event.target.value, field))}
        step="1"
        type="number"
        value={value}
      />
    </label>
  );
}

function ResultCard({ label, note, primary = false, value }) {
  return (
    <div className={`border border-line-light p-5 sm:p-6 ${primary ? 'bg-parchment-alt' : 'bg-parchment'}`}>
      <p className={`text-sm font-semibold ${primary ? 'text-ink-soft' : 'text-black'}`}>{label}</p>
      <div
        className={`mt-4 font-semibold leading-none tracking-tight ${
          primary ? 'text-4xl text-red sm:text-5xl' : 'text-3xl text-ink sm:text-4xl'
        }`}
      >
        {value}
      </div>
      {note && <p className="mt-3 text-sm leading-6 text-ink-soft">{note}</p>}
    </div>
  );
}

/**
 * Screening throughput estimator for static SPR: how many binding conditions a
 * lab can get through in a day, and how long a given batch takes. Cycle length
 * is an instrument spec rather than an input, so it comes from the data with a
 * 10-minute default and is stated alongside the result.
 */
export default function ScreeningThroughputCalculator({ data, productName = 'this system' }) {
  const fields = data?.fields?.length ? data.fields : DEFAULT_FIELDS;
  const cycleMinutes = Math.max(1, Number(data?.cycleMinutes) || 10);

  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.key, field.default ?? 0]))
  );

  const results = useMemo(() => {
    const samples = values.samples ?? 0;
    const cyclesPerSample = values.cyclesPerSample ?? 0;
    const hoursPerDay = values.hoursPerDay ?? 0;

    const totalCycles = samples * cyclesPerSample;
    const cyclesPerDay = Math.floor((hoursPerDay * 60) / cycleMinutes);
    const daysToFinish = totalCycles > 0 && cyclesPerDay > 0 ? Math.ceil(totalCycles / cyclesPerDay) : null;

    return { cyclesPerDay, daysToFinish, totalCycles };
  }, [cycleMinutes, values]);

  const summary = [
    ...fields.map((field) => `${field.label}: ${values[field.key] ?? 0}`),
    `Cycle length assumed: under ${cycleMinutes} minutes`,
    `Conditions screened per day: ${results.cyclesPerDay}`,
    `Total cycles in this batch: ${results.totalCycles}`,
    `Working days to finish the batch: ${results.daysToFinish ?? '-'}`,
  ].join('\n');

  return (
    <section
      className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8"
      id={data?.sectionId ?? 'screening-throughput'}
    >
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeader
          description={data?.description}
          eyebrow={data?.eyebrow}
          title={data?.title}
        />

        <div className="relative mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="border border-line-light bg-parchment p-5 sm:p-6">
            <div className="space-y-4">
              {fields.map((field) => (
                <NumberInput
                  field={field}
                  key={field.key}
                  onChange={(next) => setValues((current) => ({ ...current, [field.key]: next }))}
                  value={values[field.key] ?? 0}
                />
              ))}
            </div>

            <p className="mt-4 border border-line-light bg-parchment-alt px-4 py-3 text-xs leading-6 text-ink-soft">
              Calculated at under {cycleMinutes} minutes per cycle, the run time {productName} needs for one
              static screening cycle.
            </p>

            <LeadCaptureForm
              className="mt-5 w-full"
              formType="throughput-calculator"
              productName={productName}
              successMessage={(name) =>
                `Thank you${name ? `, ${name}` : ''}. We have sent your throughput numbers to our team.`
              }
              summary={summary}
              triggerLabel={data?.submitLabel ?? 'Get Configuration Support'}
            />
          </div>

          <div className="space-y-3">
            <ResultCard
              label="Conditions screened per day"
              note={`At under ${cycleMinutes} minutes per cycle across the working hours entered.`}
              primary
              value={results.cyclesPerDay}
            />
            <ResultCard label="Total cycles in this batch" value={results.totalCycles} />
            <ResultCard
              label="Working days to finish the batch"
              value={results.daysToFinish ?? '-'}
            />
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
