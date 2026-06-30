'use client';
import { useEffect, useMemo, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

function formatLitres(value) {
  if (value >= 100) return `${Math.round(value).toLocaleString('en-IN')} L`;
  return `${Number(value.toFixed(1)).toLocaleString('en-IN')} L`;
}

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function RecoverySlider({ label, value, display, min, max, step = 1, onChange }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <label className="text-sm font-semibold text-black dark:text-white">{label}</label>
        <span className="min-w-24 text-right text-base font-bold text-[#BE0010]">{display}</span>
      </div>
      <input
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-[#BE0010] dark:bg-zinc-700"
        max={max}
        min={min}
        onChange={(event) => {
          window.dispatchEvent(new CustomEvent('product-calc-input'));
          onChange(Number(event.target.value));
        }}
        step={step}
        type="range"
        value={value}
      />
    </div>
  );
}

export default function SolventCalculator({ calculatorData, simulatorData }) {
  const sl = calculatorData?.sliders ?? {};

  const solvents = useMemo(() => {
    const primaryNames = calculatorData?.primarySolvents ?? [];
    const simSolvents = simulatorData?.solvents ?? [];
    return primaryNames.map((name) => {
      const match = simSolvents.find((s) => s.name === name) ?? {};
      return { ...match, name, rate: match.rate ?? null };
    });
  }, [calculatorData?.primarySolvents, simulatorData?.solvents]);

  const [selIdx, setSelIdx] = useState(0);
  const [volumeMl, setVolumeMl] = useState(sl.volumeMl?.default ?? 1000);
  const [batchesPerWeek, setBatchesPerWeek] = useState(sl.batchesPerWeek?.default ?? 23);
  const [solventCost, setSolventCost] = useState(sl.solventCost?.default ?? 600);
  const [recoveryShare, setRecoveryShare] = useState(sl.recoveryShare?.default ?? 70);

  const solvent = solvents[selIdx] ?? solvents[0] ?? { name: '', rate: 1 };
  const annualWeeks = calculatorData?.annualWeeks ?? 48;
  const volumeL = volumeMl / 1000;
  const distillationMinutes = Math.max(1, Math.round((volumeL / (solvent.rate || 1)) * 60));
  const processedPerWeek = volumeL * batchesPerWeek;
  const recoveredPerWeek = processedPerWeek * (recoveryShare / 100);
  const annualRecoveredLitres = recoveredPerWeek * annualWeeks;
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
    window.location.href = `mailto:info@inkarp.com?subject=${encodeURIComponent(calculatorData?.emailSubject ?? '')}&body=${encodeURIComponent(body)}`;
  };

  const rl = calculatorData?.resultLabels ?? {};
  const resultRows = [
    { label: rl.distillationTime ?? 'Distillation time per batch', value: `${distillationMinutes} min (${solvent.name})`, accent: false },
    { label: rl.processedPerWeek ?? 'Solvent processed per week', value: formatLitres(processedPerWeek), accent: true },
    { label: rl.recoveredPerWeek ?? 'Solvent recovered per week', value: formatLitres(recoveredPerWeek), accent: false },
    { label: rl.annualValue ?? `Annual recovered-solvent value (₹, ${annualWeeks} wks)`, value: formatCurrency(annualRecoveredValue), accent: true },
  ];

  return (
    <section id="calculator" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-0 dark:border-zinc-800 dark:bg-zinc-950 lg:h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative w-full">
        <SectionHeader
          number={calculatorData?.sectionNumber ?? '04'}
          eyebrow={calculatorData?.eyebrow ?? ''}
          title={calculatorData?.title ?? ''}
          description={calculatorData?.description ?? ''}
        />

        <div className="relative mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <p className="mb-3 text-sm font-semibold text-black dark:text-white">Solvent</p>
              <div className="flex flex-wrap gap-2">
                {solvents.map((item, index) => (
                  <button
                    className={`min-w-24 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                      item.rate === null
                        ? 'cursor-not-allowed border-zinc-100 bg-zinc-50 text-black/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white/25'
                        : selIdx === index
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-zinc-200 bg-white text-black hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-500'
                    }`}
                    disabled={item.rate === null}
                    key={item.name}
                    onClick={() => item.rate !== null && setSelIdx(index)}
                    type="button"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <RecoverySlider
                display={`${volumeMl} mL`}
                label={sl.volumeMl?.label ?? 'Volume per batch (mL)'}
                max={sl.volumeMl?.max ?? 3000}
                min={sl.volumeMl?.min ?? 100}
                onChange={setVolumeMl}
                step={sl.volumeMl?.step ?? 100}
                value={volumeMl}
              />
              <RecoverySlider
                display={batchesPerWeek}
                label={sl.batchesPerWeek?.label ?? 'Batches per week'}
                max={sl.batchesPerWeek?.max ?? 60}
                min={sl.batchesPerWeek?.min ?? 1}
                onChange={setBatchesPerWeek}
                step={sl.batchesPerWeek?.step ?? 1}
                value={batchesPerWeek}
              />
              <RecoverySlider
                display={`₹${solventCost}`}
                label={sl.solventCost?.label ?? 'Solvent cost (₹ / litre)'}
                max={sl.solventCost?.max ?? 3000}
                min={sl.solventCost?.min ?? 100}
                onChange={setSolventCost}
                step={sl.solventCost?.step ?? 50}
                value={solventCost}
              />
              <RecoverySlider
                display={`${recoveryShare}%`}
                label={sl.recoveryShare?.label ?? 'Share of solvent recovered & reused (%)'}
                max={sl.recoveryShare?.max ?? 90}
                min={sl.recoveryShare?.min ?? 0}
                onChange={setRecoveryShare}
                step={sl.recoveryShare?.step ?? 5}
                value={recoveryShare}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {resultRows.map((row, index, rows) => (
                <div className={`flex items-center justify-between gap-6 py-3 ${index < rows.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`} key={row.label}>
                  <span className="text-sm text-black dark:text-white">{row.label}</span>
                  <span className={`text-right font-maxot text-base font-bold ${row.accent ? 'text-[#BE0010]' : 'text-black dark:text-white'}`}>{row.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-[#D30013] px-6 py-6 text-center text-white shadow-sm">
              <div className="font-maxot text-5xl font-bold leading-none sm:text-6xl">
                {Math.round(annualRecoveredLitres).toLocaleString('en-IN')}
              </div>
              <p className="mt-2 text-sm font-semibold text-white/90">
                {calculatorData?.heroLabel ?? ''}
              </p>
            </div>

            <button
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-900 bg-white px-6 text-sm font-semibold text-black transition hover:border-[#BE0010] hover:bg-[#BE0010] hover:text-white dark:border-white dark:bg-zinc-900 dark:text-white"
              onClick={emailResults}
              type="button"
            >
              <FiMail className="text-base" />
              {calculatorData?.ctaLabel ?? ''}
            </button>
          </div>
        </div>

        <p className="relative mt-4 text-center text-xs text-black/50 dark:text-white/40">
          {calculatorData?.disclaimer ?? ''}
        </p>
      </div>
    </section>
  );
}
