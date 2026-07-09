'use client';
import { useEffect, useMemo, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import { buildTableEmailBody, openMailto } from './emailUtils';

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
        className="mt-2 h-11 w-full rounded-2xl border border-line-light bg-parchment-alt px-4 text-lg font-semibold tracking-tight text-ink outline-none transition focus:border-red focus:bg-parchment focus:ring-4 focus:ring-red/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-900"
        min="0"
        onChange={(event) => onChange(cleanNumber(event.target.value))}
        step="1000"
        type="number"
        value={value}
      />
    </label>
  );
}

export default function ROICalculator({ data, sectionNumber = '07', productName = 'this product' }) {
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
    const body = buildTableEmailBody({
      productName: `${productName} ROI estimate`,
      sectionName: 'ROI Calculator',
      rows: [
        { label: 'Estimated purchase price', value: `INR ${purchasePrice.toLocaleString('en-IN')}` },
        { label: 'Annual recovered solvent value', value: `INR ${recoveredSolventValue.toLocaleString('en-IN')}` },
        { label: 'Annual disposal / waste savings', value: `INR ${disposalSavings.toLocaleString('en-IN')}` },
        { label: 'Other annual value', value: `INR ${otherAnnualValue.toLocaleString('en-IN')}` },
        { label: 'Estimated payback period', value: results.paybackMonths ? `${results.paybackMonths} months` : '-' },
        { label: 'Total annual value', value: `INR ${results.totalAnnualValue.toLocaleString('en-IN')}` },
        { label: '5-year net value after purchase', value: `INR ${results.fiveYearNetValue.toLocaleString('en-IN')}` },
      ],
      note: 'Please review these numbers and share a configured quote.',
    });

    window.dispatchEvent(new CustomEvent('product-roi-results'));
    openMailto({ subject: `${productName} - ROI estimate`, body });
  };

  const cards = data?.cards ?? [];

  return (
    <section id="roi" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
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
              <div key={card.title} className="rounded-xl border border-line-light bg-parchment-alt p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-semibold text-black dark:text-zinc-100">{card.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-ink-soft dark:text-zinc-400">{card.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="relative mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-line-light bg-parchment p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
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
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-zinc-900 bg-parchment px-6 text-sm font-semibold text-black transition hover:border-red hover:bg-red hover:text-parchment dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-100"
              onClick={emailResults}
              type="button"
            >
              <FiMail className="text-base" />
              Email my ROI numbers to Inkarp
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-line-light bg-parchment-alt p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
              <p className="text-sm font-semibold text-ink-soft dark:text-zinc-400">Estimated payback period</p>
              <div className="mt-4 text-4xl font-semibold tracking-tight leading-none text-red sm:text-5xl">
                {results.paybackMonths ? `${results.paybackMonths} months` : '-'}
              </div>
            </div>

            <div className="rounded-2xl border border-line-light bg-parchment p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-black dark:text-zinc-100">Total annual value</p>
              <div className="mt-4 text-3xl font-semibold leading-none tracking-tight text-ink sm:text-4xl dark:text-zinc-100">
                {formatCurrency(results.totalAnnualValue)}
              </div>
            </div>

            <div className="rounded-2xl border border-line-light bg-parchment p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-semibold text-black dark:text-zinc-100">5-year net value (after purchase)</p>
              <div className="mt-4 text-3xl font-semibold leading-none tracking-tight text-ink sm:text-4xl dark:text-zinc-100">
                {formatCurrency(results.fiveYearNetValue)}
              </div>
            </div>
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
