'use client';
import { useMemo, useState } from 'react';
import { FiClock, FiRefreshCw, FiShield, FiZap } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

function toNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

function NumberInput({ label, note, suffix, value, onChange, min = 0, step = 1 }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-black">{label}</span>
      {note ? <span className="mt-1 block text-xs leading-5 text-ink-soft">{note}</span> : null}
      <div className="mt-2 flex h-12 overflow-hidden border border-line-light bg-white focus-within:border-red focus-within:ring-4 focus-within:ring-red/10">
        <input
          className="min-w-0 flex-1 bg-transparent px-4 text-base font-semibold text-ink outline-none"
          min={min}
          onChange={(event) => onChange(toNumber(event.target.value))}
          step={step}
          type="number"
          value={value}
        />
        {suffix ? (
          <span className="flex items-center border-l border-line-light bg-parchment-alt px-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export default function ServiceLifePlanner({ data, productName }) {
  const defaults = data?.defaults ?? {};
  const [replacementCycle, setReplacementCycle] = useState(defaults.replacementCycleYears ?? 3);
  const [fleetSize, setFleetSize] = useState(defaults.fleetSize ?? 4);
  const [hoursPerWeek, setHoursPerWeek] = useState(defaults.hoursPerWeek ?? 35);
  const [failedRunsPerYear, setFailedRunsPerYear] = useState(defaults.failedRunsPerYear ?? 1);
  const [standbyHoursPerWeek, setStandbyHoursPerWeek] = useState(defaults.standbyHoursPerWeek ?? 20);
  const [plateDamage, setPlateDamage] = useState(Boolean(defaults.plateDamage));

  const warrantyYears = data?.warrantyYears ?? 10;
  const normalPowerW = data?.normalPowerW ?? 25;
  const standbyPowerW = data?.standbyPowerW ?? 1.7;

  const results = useMemo(() => {
    const replacementEvents = replacementCycle > 0 ? Math.max(0, Math.floor(warrantyYears / replacementCycle) - 1) * fleetSize : 0;
    const annualRunHours = hoursPerWeek * 52 * fleetSize;
    const annualStandbyKwh = (standbyHoursPerWeek * 52 * standbyPowerW * fleetSize) / 1000;
    const annualRunKwh = (hoursPerWeek * 52 * normalPowerW * fleetSize) / 1000;
    const reviewScore =
      (replacementCycle < warrantyYears ? 1 : 0) +
      (fleetSize >= 3 ? 1 : 0) +
      (hoursPerWeek >= 30 ? 1 : 0) +
      (failedRunsPerYear > 0 ? 1 : 0) +
      (plateDamage ? 1 : 0);

    return {
      annualRunHours: Math.round(annualRunHours),
      annualRunKwh: Math.round(annualRunKwh),
      annualStandbyKwh: Math.round(annualStandbyKwh),
      replacementEvents,
      reviewSignal: reviewScore >= 4 ? 'Strong uptime case' : reviewScore >= 2 ? 'Worth reviewing' : 'Low replacement pressure',
    };
  }, [failedRunsPerYear, fleetSize, hoursPerWeek, normalPowerW, plateDamage, replacementCycle, standbyHoursPerWeek, standbyPowerW, warrantyYears]);

  if (!data) return null;

  const reset = () => {
    setReplacementCycle(defaults.replacementCycleYears ?? 3);
    setFleetSize(defaults.fleetSize ?? 4);
    setHoursPerWeek(defaults.hoursPerWeek ?? 35);
    setFailedRunsPerYear(defaults.failedRunsPerYear ?? 1);
    setStandbyHoursPerWeek(defaults.standbyHoursPerWeek ?? 20);
    setPlateDamage(Boolean(defaults.plateDamage));
  };

  const summary = [
    `Product: ${productName}`,
    `Current replacement cycle: ${replacementCycle} years`,
    `Fleet size: ${fleetSize}`,
    `Run hours per week per stirrer: ${hoursPerWeek}`,
    `Failed runs per year linked to stirrer issues: ${failedRunsPerYear}`,
    `Standby hours per week per stirrer: ${standbyHoursPerWeek}`,
    `Plate scratching/chemical attack observed: ${plateDamage ? 'Yes' : 'No'}`,
    `Warranty period: ${warrantyYears} years after registration`,
    `Replacement events to review inside warranty window: ${results.replacementEvents}`,
    `Annual run hours across fleet: ${results.annualRunHours}`,
    `Annual running energy estimate: ${results.annualRunKwh} kWh`,
    `Annual standby energy estimate: ${results.annualStandbyKwh} kWh`,
    `Planner signal: ${results.reviewSignal}`,
  ].join('\n');

  return (
    <section id={data.sectionId ?? 'service-life'} className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-8">
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeader
          number={data.number ?? '13'}
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border border-line-light bg-parchment p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberInput label="Current replacement cycle" note="How often you replace comparable stirrers today." onChange={setReplacementCycle} suffix="years" value={replacementCycle} />
              <NumberInput label="Stirrers in service" note="Fleet size across this workflow or lab area." onChange={setFleetSize} suffix="units" value={fleetSize} />
              <NumberInput label="Run hours per week per stirrer" note="Continuous operation matters most on long-running benches." onChange={setHoursPerWeek} suffix="hrs/wk" value={hoursPerWeek} />
              <NumberInput label="Failed runs per year" note="Sample or batch losses linked to stirrer failure." onChange={setFailedRunsPerYear} suffix="runs" value={failedRunsPerYear} />
              <NumberInput label="Standby hours per week per stirrer" note="The listed standby draw is 1.7 W." onChange={setStandbyHoursPerWeek} suffix="hrs/wk" value={standbyHoursPerWeek} />
            </div>

            <label className="mt-5 flex items-start gap-3 border border-line-light bg-parchment-alt p-4 text-sm font-semibold text-black">
              <input
                checked={plateDamage}
                className="mt-1 h-4 w-4 accent-red"
                onChange={(event) => setPlateDamage(event.target.checked)}
                type="checkbox"
              />
              <span>Plates in this lab are often scratched or chemically attacked.</span>
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <LeadCaptureForm
                formType="service-life-planner"
                productName={productName}
                submitLabel={data.ctaLabel ?? 'Build my case'}
                successMessage={(name) =>
                  `Thank you${name ? `, ${name}` : ''}. Inkarp will review your uptime and service-life figures.`
                }
                summary={summary}
                triggerLabel={data.ctaLabel ?? 'Build my case'}
              />
              <button
                className="inline-flex h-11 items-center gap-2 border border-line-light px-5 text-sm font-bold text-black transition hover:border-red hover:text-red"
                onClick={reset}
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
                <FiShield className="text-red" />
                Replacement events to review
              </p>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-red">{results.replacementEvents}</div>
              <p className="mt-2 text-xs leading-5 text-ink-soft">Inside a {warrantyYears}-year registered warranty window.</p>
            </div>

            <div className="border border-line-light bg-parchment p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <FiClock className="text-red" />
                Annual run hours across fleet
              </p>
              <div className="mt-3 text-4xl font-semibold tracking-tight text-ink">{results.annualRunHours}</div>
            </div>

            <div className="border border-line-light bg-parchment p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
                <FiZap className="text-red" />
                Annual energy estimate
              </p>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-ink">{results.annualRunKwh + results.annualStandbyKwh} kWh</div>
              <p className="mt-2 text-xs leading-5 text-ink-soft">Uses {normalPowerW} W running and {standbyPowerW} W standby.</p>
            </div>

            <div className="border border-line-light bg-red p-5 text-white">
              <p className="text-sm font-semibold text-white/80">Planner signal</p>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{results.reviewSignal}</div>
              <p className="mt-3 text-sm leading-6 text-white/85">{data.resultNote}</p>
            </div>
          </div>
        </div>

        <SectionDisclaimer>{data.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
