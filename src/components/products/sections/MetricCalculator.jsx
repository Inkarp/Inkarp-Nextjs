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

  // Chamber/shelf load fit against published per-model per-shelf, per-shelf-count
  // and total weight limits. `data.modelLimits` (ordered smallest to largest)
  // supplies the limits so this stays reusable across any chamber-style
  // product rather than hard-coding one model's numbers here.
  'shelf-load-fit-check': ({ nums, data }) => {
    const shelvesUsed = Math.max(0, nums.shelvesUsed ?? 0);
    const loadPerShelf = Math.max(0, nums.loadPerShelfKg ?? 0);
    const totalLoad = shelvesUsed * loadPerShelf;

    const models = data?.modelLimits ?? [];
    const smallest = models[0];
    const widest = models[models.length - 1];
    const fits = (m) =>
      loadPerShelf <= m.maxLoadPerShelfKg && totalLoad <= m.maxLoadKg && shelvesUsed <= m.maxShelves;
    const fitting = models.find(fits);

    let recommendedModel;
    let usableShelves;
    let loadCheck;
    let fitResult;

    if (fitting && smallest && fitting === smallest) {
      recommendedModel = smallest.name;
      usableShelves = `${count(shelvesUsed)} of up to ${count(smallest.maxShelves)}`;
      loadCheck = `Well within ${count(smallest.maxLoadPerShelfKg)} kg/shelf and ${count(smallest.maxLoadKg)} kg total`;
      fitResult = 'Fits comfortably';
    } else if (fitting) {
      recommendedModel = fitting.name;
      usableShelves = `${count(shelvesUsed)} of up to ${count(fitting.maxShelves)}`;
      loadCheck = smallest && loadPerShelf > smallest.maxLoadPerShelfKg
        ? `${count(loadPerShelf)} kg exceeds ${count(smallest.maxLoadPerShelfKg)} kg/shelf on the ${smallest.shortName} but is within ${count(fitting.maxLoadPerShelfKg)} kg on the ${fitting.shortName}`
        : `${count(totalLoad)} kg total exceeds the ${count(smallest?.maxLoadKg)} kg limit of the ${smallest?.shortName}`;
      fitResult = `Step up to ${fitting.name} for headroom`;
    } else {
      recommendedModel = 'Beyond TH3-E range';
      usableShelves = 'Not sufficient';
      if (widest && loadPerShelf > widest.maxLoadPerShelfKg) {
        loadCheck = `${count(loadPerShelf)} kg/shelf exceeds the ${widest.shortName}'s ${count(widest.maxLoadPerShelfKg)} kg/shelf limit`;
      } else if (widest && shelvesUsed > widest.maxShelves) {
        loadCheck = `${count(shelvesUsed)} shelves exceeds the ${widest.shortName}'s ${count(widest.maxShelves)}-shelf maximum`;
      } else {
        loadCheck = `${count(totalLoad)} kg exceeds the ${count(widest?.maxLoadKg)} kg maximum of the ${widest?.shortName}`;
      }
      fitResult = 'Split across two units or use a larger TH3 model';
    }

    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: 'Recommended model', value: recommendedModel },
        { label: 'Usable shelves', value: usableShelves },
        { label: 'Load check', value: loadCheck },
        { label: 'Fit result', value: fitResult },
      ],
    };
  },

  // Manual refills a recirculating water supply removes over a test run —
  // pure arithmetic from the visitor's own current refill schedule, not a
  // manufacturer-published rate (there isn't one), so the disclaimer says so.
  // Tier thresholds (`data.tiers`) are Inkarp's own guidance, not JeioTech's.
  'water-refill-savings': ({ nums, data }) => {
    const testDays = Math.max(0, nums.testDurationDays ?? 0);
    const currentRefillsPerDay = Math.max(0, nums.currentRefillsPerDay ?? 0);
    const refillsAvoided = testDays * currentRefillsPerDay;

    const tiers = data?.tiers ?? [];
    const tier = tiers.find((t) => testDays <= t.maxDays) ?? tiers[tiers.length - 1];

    return {
      cards: [
        { label: 'Refills avoided', value: `About ${count(refillsAvoided)}`,
          note: 'Assumes recirculation covers the full run instead of the manual schedule entered above.' },
        { label: 'Unattended run time', value: tier?.unattendedRunTime ?? `${count(testDays)} day(s) without a top-up` },
        { label: 'Risk reduced', value: tier?.riskReduced ?? 'Low-water alarm prevents dry running' },
        { label: 'Recommended option', value: tier?.recommendedOption ?? 'Recirculation tank is sufficient' },
      ],
    };
  },

  // Confirms a setpoint sits inside the published operating envelope, then
  // interpolates heat-up/cool-down time between JeioTech's own stated
  // reference points (`data.heatAnchors`/`coolAnchors`, each an ambient
  // starting point) rather than inventing a physics curve — every anchor is
  // a figure JeioTech/Inkarp has already published, this just connects them.
  'chamber-envelope-check': ({ nums, picks, data }) => {
    const tempMin = data?.tempRange?.[0] ?? 0;
    const tempMax = data?.tempRange?.[1] ?? 90;
    const humidityMin = data?.humidityRange?.[0] ?? 35;
    const humidityMax = data?.humidityRange?.[1] ?? 85;
    const targetTemp = nums.targetTemp ?? 0;
    const targetHumidity = nums.targetHumidity ?? 0;
    const holdDays = Math.max(0, nums.holdDays ?? 0);
    const needsHumidity = (picks?.humidityControlNeeded ?? 'yes') === 'yes';

    const tempOk = targetTemp >= tempMin && targetTemp <= tempMax;
    const humidityOk = !needsHumidity || (targetHumidity >= humidityMin && targetHumidity <= humidityMax);

    if (!tempOk) {
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: 'Range check', value: `Out of range — exceeds ${tempMax}°C maximum` },
          { label: 'Heating time', value: 'Not applicable' },
          { label: 'Cooling time', value: 'Not applicable' },
          { label: 'Water guidance', value: 'Not applicable' },
          { label: 'Stability note', value: `Lower the target to ${tempMax}°C or below` },
        ],
      };
    }
    if (!humidityOk) {
      return {
        assumption: data?.assumptionNote ?? '',
        cards: [
          { label: 'Range check', value: `Out of range — outside ${humidityMin}–${humidityMax} %RH` },
          { label: 'Heating time', value: 'Not applicable' },
          { label: 'Cooling time', value: 'Not applicable' },
          { label: 'Water guidance', value: 'Not applicable' },
          { label: 'Stability note', value: `Set humidity within ${humidityMin}–${humidityMax} %RH, or turn humidity control off` },
        ],
      };
    }

    const interpolate = (target, anchors = []) => {
      if (!anchors.length) return 0;
      if (target <= anchors[0][0]) return anchors[0][1];
      if (target >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1];
      for (let i = 0; i < anchors.length - 1; i += 1) {
        const [x0, y0] = anchors[i];
        const [x1, y1] = anchors[i + 1];
        if (target >= x0 && target <= x1) {
          return y0 + ((target - x0) / (x1 - x0)) * (y1 - y0);
        }
      }
      return anchors[anchors.length - 1][1];
    };

    const heatMinutes = Math.round(interpolate(targetTemp, data?.heatAnchors));
    const coolMinutes = Math.round(interpolate(targetTemp, data?.coolAnchors));

    let waterGuidance;
    if (!needsHumidity) {
      waterGuidance = 'No water needed';
    } else if (holdDays <= 7) {
      waterGuidance = '20 L tank with recirculation should be sufficient';
    } else {
      waterGuidance = 'Direct Water System recommended for the long hold';
    }

    return {
      assumption: data?.assumptionNote ?? '',
      cards: [
        { label: 'Range check', value: 'Within range — achievable' },
        { label: 'Heating time', value: `About ${count(heatMinutes)} minutes from ambient` },
        { label: 'Cooling time', value: `About ${count(coolMinutes)} minutes to ambient` },
        { label: 'Water guidance', value: waterGuidance },
        { label: 'Stability note', value: `Holds within ± 0.5°C${needsHumidity ? ' and ± 1 %RH' : ''}` },
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
            {results.cards.map((card) => {
              // Short numeric/₹ readouts (most calculators) stay big and punchy.
              // A checker-style calculator can return a full phrase instead of a
              // number (e.g. "Within range — achievable") — that shouldn't blow
              // up to the same huge size, or it wraps awkwardly and overwhelms
              // the card, so long text drops to a smaller, wrap-friendly size.
              const isLongText = typeof card.value === 'string' && card.value.length > 20;
              const valueSizeClass = isLongText
                ? 'text-lg leading-snug sm:text-xl'
                : card.primary
                  ? 'text-4xl leading-none sm:text-5xl'
                  : 'text-2xl leading-none sm:text-3xl';

              return (
              <div
                className={`border border-line-light p-5 sm:p-6 ${card.primary ? 'bg-parchment-alt' : 'bg-parchment'}`}
                key={card.label}
              >
                <p className={`text-sm font-semibold ${card.primary ? 'text-ink-soft' : 'text-black'}`}>
                  {card.label}
                </p>
                <div
                  className={`mt-4 font-semibold tracking-tight ${valueSizeClass} ${
                    card.primary ? 'text-red' : 'text-ink'
                  }`}
                >
                  {card.value}
                </div>
                {card.note ? <p className="mt-3 text-sm leading-6 text-ink-soft">{card.note}</p> : null}
              </div>
              );
            })}
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
