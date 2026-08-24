'use client';
import { useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

const INR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function money(value) {
  return `₹${INR.format(Math.max(0, Math.round(value || 0)))}`;
}

function count(value) {
  return INR.format(Math.max(0, Math.round(value || 0)));
}

/** Minutes as the unit a lab would actually say out loud. */
function duration(minutes) {
  const mins = Math.max(0, Math.round(minutes || 0));
  if (mins < 60) return `${mins} min`;
  const hours = mins / 60;
  if (hours < 10) return `${hours.toFixed(1).replace(/\.0$/, '')} hr`;
  return `${Math.round(hours)} hr`;
}

/**
 * Each entry turns the entered figures into the readout cards for one kind of
 * calculator. Every number shown is derived from what the visitor typed plus a
 * figure the product content states — nothing is invented here, which is why
 * rates and prices are inputs rather than constants.
 */
const FORMULAS = {
  // Cycles a static SPR screening run gets through in a working day.
  'screening-throughput': ({ nums, data }) => {
    const cycleMinutes = Math.max(1, Number(data?.cycleMinutes) || 10);
    const totalCycles = (nums.samples ?? 0) * (nums.cyclesPerSample ?? 0);
    const perDay = Math.floor(((nums.hoursPerDay ?? 0) * 60) / cycleMinutes);
    const days = totalCycles > 0 && perDay > 0 ? Math.ceil(totalCycles / perDay) : null;

    return {
      assumption: `Calculated at under ${cycleMinutes} minutes per cycle.`,
      cards: [
        { label: 'Conditions screened per day', value: count(perDay), primary: true,
          note: `At under ${cycleMinutes} minutes per cycle across the hours entered.` },
        { label: 'Total cycles in this batch', value: count(totalCycles) },
        { label: 'Working days to finish the batch', value: days ?? '-' },
      ],
    };
  },

  // Time recovered against whatever method the lab runs today.
  'time-saved': ({ nums, picks, data }) => {
    const option = (data?.choices?.[0]?.options ?? []).find((o) => o.val === picks.currentMethod);
    const factor = Math.max(1, Number(option?.speedFactor) || 1);

    const perSampleNow = nums.minutesPerSample ?? 0;
    const perSampleNew = perSampleNow / factor;
    const daily = nums.samplesPerDay ?? 0;

    const savedPerDay = Math.max(0, (perSampleNow - perSampleNew) * daily);

    return {
      assumption: option?.basis ?? '',
      cards: [
        { label: 'Time recovered per day', value: duration(savedPerDay), primary: true,
          note: option?.basis },
        { label: 'Per sample: now vs after', value: `${duration(perSampleNow)} → ${duration(perSampleNew)}` },
        { label: 'Time recovered per working week', value: duration(savedPerDay * 5) },
      ],
    };
  },

  // Runs collapsed when moisture, solids and ash come off one sample.
  'workload-consolidation': ({ nums }) => {
    const perWeek = nums.samplesPerWeek ?? 0;
    const runsEach = Math.max(1, nums.runsPerSampleNow ?? 1);
    const rate = nums.costPerRun ?? 0;

    const runsNow = perWeek * runsEach * 52;
    const runsAfter = perWeek * 52;
    const removed = Math.max(0, runsNow - runsAfter);

    return {
      cards: [
        { label: 'Runs removed per year', value: count(removed), primary: true,
          note: 'One linked sequence replaces the separate runs each sample needs today.' },
        { label: 'Runs per year: now vs after', value: `${count(runsNow)} → ${count(runsAfter)}` },
        { label: 'Cost carried by those runs', value: money(removed * rate),
          note: 'Based on the per-run cost entered above.' },
      ],
    };
  },

  // Reagent spend that disappears when the method needs no chemicals at all.
  'reagent-savings': ({ nums }) => {
    const monthly = nums.reagentCostPerMonth ?? 0;
    const perWeek = nums.samplesPerWeek ?? 0;
    const annual = monthly * 12;
    const perYear = perWeek * 52;

    return {
      cards: [
        { label: 'Annual reagent spend removed', value: money(annual), primary: true,
          note: 'Vapor Pro XL uses no chemical reagents, so this line goes to zero.' },
        { label: 'Samples per year', value: count(perYear) },
        { label: 'Reagent cost per sample today', value: perYear > 0 ? money(annual / perYear) : '-' },
      ],
    };
  },
};

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

function ChoiceInput({ field, onChange, value }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black">{field.label}</span>
      <select
        className="mt-2 h-11 w-full border border-line-light bg-parchment-alt px-4 text-sm font-semibold text-ink outline-none transition focus:border-red focus:bg-parchment focus:ring-4 focus:ring-red/10"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {field.options.map((option) => (
          <option key={option.val} value={option.val}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

/**
 * Data-driven calculator: the content supplies the labels, defaults and which
 * `formula` to run; this component owns the arithmetic and the layout. Products
 * that only need a picker should use SuitabilityChecker or ConfigWizard instead.
 */
export default function MetricCalculator({ data, productName = 'this product' }) {
  const fields = data?.fields ?? [];
  const choices = data?.choices ?? [];
  const compute = FORMULAS[data?.formula];

  const [nums, setNums] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.key, field.default ?? 0]))
  );
  const [picks, setPicks] = useState(() =>
    Object.fromEntries(choices.map((choice) => [choice.key, choice.default ?? choice.options?.[0]?.val]))
  );

  const results = useMemo(
    () => (compute ? compute({ nums, picks, data }) : null),
    [compute, data, nums, picks]
  );

  if (!compute || !fields.length) return null;

  const summary = [
    ...choices.map((choice) => {
      const picked = choice.options.find((option) => option.val === picks[choice.key]);
      return `${choice.label}: ${picked?.label ?? picks[choice.key]}`;
    }),
    ...fields.map((field) => `${field.label}: ${nums[field.key] ?? 0}`),
    '',
    ...results.cards.map((card) => `${card.label}: ${card.value}`),
  ].join('\n');

  return (
    <section
      className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8"
      id={data?.sectionId ?? 'calculator'}
    >
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeader description={data?.description} eyebrow={data?.eyebrow} title={data?.title} />

        <div className="relative mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="border border-line-light bg-parchment p-5 sm:p-6">
            <div className="space-y-4">
              {choices.map((choice) => (
                <ChoiceInput
                  field={choice}
                  key={choice.key}
                  onChange={(next) => setPicks((current) => ({ ...current, [choice.key]: next }))}
                  value={picks[choice.key] ?? ''}
                />
              ))}
              {fields.map((field) => (
                <NumberInput
                  field={field}
                  key={field.key}
                  onChange={(next) => setNums((current) => ({ ...current, [field.key]: next }))}
                  value={nums[field.key] ?? 0}
                />
              ))}
            </div>

            {results.assumption ? (
              <p className="mt-4 border border-line-light bg-parchment-alt px-4 py-3 text-xs leading-6 text-ink-soft">
                {results.assumption}
              </p>
            ) : null}

            {data?.ctaNote ? (
              <p className="mt-4 text-sm leading-6 text-black">{data.ctaNote}</p>
            ) : null}

            <LeadCaptureForm
              className="mt-5 w-full"
              formType="metric-calculator"
              productName={productName}
              successMessage={(name) =>
                `Thank you${name ? `, ${name}` : ''}. We have sent your numbers to our team.`
              }
              summary={summary}
              triggerLabel={data?.submitLabel ?? 'Get Configuration Support'}
            />
          </div>

          <div className="space-y-3">
            {results.cards.map((card) => (
              <div
                className={`border border-line-light p-5 sm:p-6 ${card.primary ? 'bg-parchment-alt' : 'bg-parchment'}`}
                key={card.label}
              >
                <p className={`text-sm font-semibold ${card.primary ? 'text-ink-soft' : 'text-black'}`}>
                  {card.label}
                </p>
                <div
                  className={`mt-4 font-semibold leading-none tracking-tight ${
                    card.primary ? 'text-4xl text-red sm:text-5xl' : 'text-2xl text-ink sm:text-3xl'
                  }`}
                >
                  {card.value}
                </div>
                {card.note ? <p className="mt-3 text-sm leading-6 text-ink-soft">{card.note}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
