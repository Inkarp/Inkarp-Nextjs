'use client';
import { useEffect, useMemo, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

function formatCurrency(value) {
  return `₹${Math.round(value || 0).toLocaleString('en-IN')}`;
}

function cleanNumber(value) {
  const nextValue = Number(value);
  if (!Number.isFinite(nextValue)) return 0;
  return Math.max(0, Math.round(nextValue));
}

function RoiInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black dark:text-zinc-100">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 font-maxot text-lg font-bold text-black outline-none transition focus:border-[#BE0010] focus:bg-white focus:ring-4 focus:ring-[#BE0010]/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-900"
        min="0"
        onChange={(event) => onChange(cleanNumber(event.target.value))}
        step="1000"
        type="number"
        value={value}
      />
    </label>
  );
}

export default function ROICalculator({ data, sectionNumber = '07' }) {
  const defaults = data?.defaults ?? {};
  const [purchasePrice, setPurchasePrice] = useState(defaults.purchasePrice ?? 450000);
  const [recoveredSolventValue, setRecoveredSolventValue] = useState(defaults.recoveredSolventValue ?? 180000);
  const [disposalSavings, setDisposalSavings] = useState(defaults.disposalSavings ?? 60000);
  const [otherAnnualValue, setOtherAnnualValue] = useState(defaults.otherAnnualValue ?? 40000);

  useEffect(() => {
    const applyCalculatorValue = (payload) => {
      const nextValue = cleanNumber(payload?.annualRecoveredValue);
      if (nextValue > 0) setRecoveredSolventValue(nextValue);
    };

    try {
      const storedPayload = JSON.parse(window.sessionStorage.getItem('product-solvent-calculator-update') || 'null');
      applyCalculatorValue(storedPayload);
    } catch {
      // Ignore malformed session data and keep the editable default.
    }

    const handleCalculatorUpdate = (event) => applyCalculatorValue(event.detail);
    window.addEventListener('product-solvent-calculator-update', handleCalculatorUpdate);
    return () => window.removeEventListener('product-solvent-calculator-update', handleCalculatorUpdate);
  }, []);

  const results = useMemo(() => {
    const totalAnnualValue = recoveredSolventValue + disposalSavings + otherAnnualValue;
    const paybackMonths = totalAnnualValue > 0 ? Math.max(1, Math.round((purchasePrice / totalAnnualValue) * 12)) : null;
    const fiveYearNetValue = (totalAnnualValue * 5) - purchasePrice;

    return { totalAnnualValue, paybackMonths, fiveYearNetValue };
  }, [disposalSavings, otherAnnualValue, purchasePrice, recoveredSolventValue]);

  const emailResults = () => {
    const body = [
      'Hei-VAP Core ROI estimate',
      '',
      `Estimated purchase price: INR ${purchasePrice.toLocaleString('en-IN')}`,
      `Annual recovered solvent value: INR ${recoveredSolventValue.toLocaleString('en-IN')}`,
      `Annual disposal / waste savings: INR ${disposalSavings.toLocaleString('en-IN')}`,
      `Other annual value: INR ${otherAnnualValue.toLocaleString('en-IN')}`,
      '',
      `Estimated payback period: ${results.paybackMonths ? `${results.paybackMonths} months` : '-'}`,
      `Total annual value: INR ${results.totalAnnualValue.toLocaleString('en-IN')}`,
      `5-year net value after purchase: INR ${results.fiveYearNetValue.toLocaleString('en-IN')}`,
      '',
      'Please review these numbers and share a configured quote.',
    ].join('\n');

    window.dispatchEvent(new CustomEvent('product-roi-results'));
    window.location.href = `mailto:info@inkarp.com?subject=${encodeURIComponent('Hei-VAP Core - ROI estimate')}&body=${encodeURIComponent(body)}`;
  };

  const cards = data?.cards ?? [];

  return (
    <section id="roi" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-16 sm:px-6 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative mx-auto w-full max-w-7xl">
        <SectionHeader
          number={sectionNumber}
          eyebrow={data?.eyebrow}
          title={data?.title}
          description={data?.description}
        />

        {cards.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-semibold text-black dark:text-zinc-100">{card.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{card.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="relative mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-4">
              <RoiInput
                label="Estimated purchase price (₹) - ask Inkarp for your quote"
                onChange={setPurchasePrice}
                value={purchasePrice}
              />
              <RoiInput
                label="Annual value of recovered solvent (₹) - see the calculator above"
                onChange={setRecoveredSolventValue}
                value={recoveredSolventValue}
              />
              <RoiInput
                label="Annual solvent-disposal / waste savings (₹)"
                onChange={setDisposalSavings}
                value={disposalSavings}
              />
              <RoiInput
                label="Other annual value - time saved, fewer reruns (₹)"
                onChange={setOtherAnnualValue}
                value={otherAnnualValue}
              />
            </div>

            <button
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-zinc-900 bg-white px-6 text-sm font-semibold text-black transition hover:border-[#BE0010] hover:bg-[#BE0010] hover:text-white dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-100"
              onClick={emailResults}
              type="button"
            >
              <FiMail className="text-base" />
              Email my ROI numbers to Inkarp
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-[#D30013] p-5 text-white shadow-sm sm:p-6">
              <p className="text-sm font-semibold text-white/75">Estimated payback period</p>
              <div className="font-maxot mt-4 text-4xl font-bold leading-none sm:text-5xl">
                {results.paybackMonths ? `${results.paybackMonths} months` : '-'}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-black dark:text-zinc-100">Total annual value</p>
              <div className="font-maxot mt-4 text-3xl font-bold leading-none text-black sm:text-4xl dark:text-zinc-100">
                {formatCurrency(results.totalAnnualValue)}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-black dark:text-zinc-100">5-year net value (after purchase)</p>
              <div className="font-maxot mt-4 text-3xl font-bold leading-none text-black sm:text-4xl dark:text-zinc-100">
                {formatCurrency(results.fiveYearNetValue)}
              </div>
            </div>

            {data?.disclaimer && (
              <p className="text-sm leading-6 text-black dark:text-zinc-400">
                Disclaimer: {data.disclaimer}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
