'use client';
import { useEffect, useMemo, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const PUBLISHED_RATES = {
  Toluene: 8.5,
  Acetone: 5.8,
  Ethanol: 3.5,
  Water: 1.2,
};

const DEFAULT_SOLVENTS = [
  { name: 'Toluene', rate: 8.5 },
  { name: 'Acetone', rate: 5.8 },
  { name: 'Ethanol', rate: 3.5 },
  { name: 'Water', rate: 1.2 },
];

function formatLitres(value) {
  if (value >= 100) return `${Math.round(value).toLocaleString('en-IN')} L`;
  return `${Number(value.toFixed(1)).toLocaleString('en-IN')} L`;
}

function formatCurrency(value) {
  return `\u20B9${Math.round(value).toLocaleString('en-IN')}`;
}

function RecoverySlider({ label, value, display, min, max, step = 1, onChange }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <label className="text-sm font-semibold text-black dark:text-zinc-100">{label}</label>
        <span className="min-w-24 text-right text-base font-bold text-[#BE0010]">{display}</span>
      </div>
      <input
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-[#BE0010] dark:bg-zinc-700"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </div>
  );
}

export default function SolventCalculator({ data }) {
  const sourceSolvents = data?.solvents?.length ? data.solvents : DEFAULT_SOLVENTS;
  const solvents = useMemo(() => {
    const primaryNames = ['Toluene', 'Acetone', 'Ethanol', 'Water'];
    return primaryNames.map((name) => {
      const match = sourceSolvents.find((item) => item.name === name) ?? {};
      return { ...match, name, rate: match.rate ?? PUBLISHED_RATES[name] };
    });
  }, [sourceSolvents]);

  const [selIdx, setSelIdx] = useState(0);
  const [volumeMl, setVolumeMl] = useState(1000);
  const [batchesPerWeek, setBatchesPerWeek] = useState(23);
  const [solventCost, setSolventCost] = useState(600);
  const [recoveryShare, setRecoveryShare] = useState(70);

  const solvent = solvents[selIdx] ?? solvents[0];
  const volumeL = volumeMl / 1000;
  const distillationMinutes = Math.max(1, Math.round((volumeL / (solvent.rate || 1)) * 60));
  const processedPerWeek = volumeL * batchesPerWeek;
  const recoveredPerWeek = processedPerWeek * (recoveryShare / 100);
  const annualRecoveredLitres = recoveredPerWeek * 48;
  const annualRecoveredValue = annualRecoveredLitres * solventCost;

  useEffect(() => {
    const payload = {
      solvent: solvent.name,
      annualRecoveredValue: Math.round(annualRecoveredValue),
      annualRecoveredLitres: Math.round(annualRecoveredLitres),
    };

    window.sessionStorage.setItem('product-solvent-calculator-update', JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('product-solvent-calculator-update', { detail: payload }));
  }, [annualRecoveredLitres, annualRecoveredValue, solvent.name]);

  const emailResults = () => {
    const body = [
      'Hei-VAP Core solvent recovery estimate',
      '',
      `Solvent: ${solvent.name}`,
      `Published evaporation rate: ${solvent.rate} L/h`,
      `Volume per batch: ${volumeMl} mL`,
      `Batches per week: ${batchesPerWeek}`,
      `Solvent cost: INR ${solventCost} / litre`,
      `Share recovered and reused: ${recoveryShare}%`,
      '',
      `Distillation time per batch: ${distillationMinutes} min`,
      `Solvent processed per week: ${formatLitres(processedPerWeek)}`,
      `Solvent recovered per week: ${formatLitres(recoveredPerWeek)}`,
      `Annual recovered solvent value: ${formatCurrency(annualRecoveredValue)}`,
      `Litres recovered per year: ${Math.round(annualRecoveredLitres).toLocaleString('en-IN')} L`,
      '',
      'Please help me turn this estimate into a tailored Hei-VAP Core quote.',
    ].join('\n');

    window.dispatchEvent(new CustomEvent('product-calculator-results'));
    window.location.href = `mailto:info@inkarp.com?subject=${encodeURIComponent('Hei-VAP Core - solvent recovery estimate')}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="calculator" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="04"
          eyebrow="Interactive calculator"
          title="How much time & solvent could you recover?"
          description="Estimate distillation time and the value of recovered solvent on the Hei-VAP Core, based on Heidolph&apos;s published evaporation rates."
        />

        <div className="relative mt-9 grid gap-7 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <p className="mb-4 text-sm font-semibold text-black dark:text-zinc-100">Solvent</p>
              <div className="flex flex-wrap gap-2">
                {solvents.map((item, index) => (
                  <button
                    className={`min-w-24 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                      selIdx === index
                        ? 'border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                        : 'border-zinc-200 bg-white text-black hover:border-zinc-400 hover:text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:text-zinc-100'
                    }`}
                    key={item.name}
                    onClick={() => setSelIdx(index)}
                    type="button"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <RecoverySlider
                display={`${volumeMl} mL`}
                label="Volume per batch (mL)"
                max={3000}
                min={100}
                onChange={setVolumeMl}
                step={100}
                value={volumeMl}
              />
              <RecoverySlider
                display={batchesPerWeek}
                label="Batches per week"
                max={60}
                min={1}
                onChange={setBatchesPerWeek}
                value={batchesPerWeek}
              />
              <RecoverySlider
                display={`\u20B9${solventCost}`}
                label={"Solvent cost (\u20B9 / litre)"}
                max={3000}
                min={100}
                onChange={setSolventCost}
                step={50}
                value={solventCost}
              />
              <RecoverySlider
                display={`${recoveryShare}%`}
                label="Share of solvent recovered & reused (%)"
                max={90}
                min={0}
                onChange={setRecoveryShare}
                step={5}
                value={recoveryShare}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
              {[
                { label: 'Distillation time per batch', value: `${distillationMinutes} min (${solvent.name})`, accent: false },
                { label: 'Solvent processed per week', value: formatLitres(processedPerWeek), accent: true },
                { label: 'Solvent recovered per week', value: formatLitres(recoveredPerWeek), accent: false },
                { label: 'Annual recovered-solvent value (\u20B9, 48 wks)', value: formatCurrency(annualRecoveredValue), accent: true },
              ].map((row, index, rows) => (
                <div className={`flex items-center justify-between gap-6 py-5 ${index < rows.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`} key={row.label}>
                  <span className="text-base text-black dark:text-zinc-100">{row.label}</span>
                  <span className={`text-right font-maxot text-lg font-bold ${row.accent ? 'text-[#BE0010]' : 'text-black dark:text-zinc-100'}`}>{row.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-[#D30013] px-6 py-9 text-center text-white shadow-sm">
              <div className="font-maxot text-6xl font-bold leading-none sm:text-7xl">
                {Math.round(annualRecoveredLitres).toLocaleString('en-IN')}
              </div>
              <p className="mt-3 text-sm font-semibold text-white/90">
                litres of solvent recovered per year
              </p>
            </div>

            <button
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-zinc-900 bg-white px-6 text-sm font-semibold text-black transition hover:border-[#BE0010] hover:bg-[#BE0010] hover:text-white dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-100"
              onClick={emailResults}
              type="button"
            >
              <FiMail className="text-base" />
              Email these results to Inkarp for a tailored quote
            </button>
          </div>
        </div>

        <p className="relative mt-6 text-center text-xs text-black dark:text-zinc-400">
          Indicative estimate only. Actual recovery depends on solvent purity, vacuum level, condenser efficiency, cooling and operating practice.
        </p>
      </div>
    </section>
  );
}
