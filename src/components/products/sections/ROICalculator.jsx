'use client';
import { useEffect, useMemo, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

function formatCurrency(value) {
  return `\u20B9${Math.round(value || 0).toLocaleString('en-IN')}`;
}

function cleanNumber(value) {
  const nextValue = Number(value);
  if (!Number.isFinite(nextValue)) return 0;
  return Math.max(0, Math.round(nextValue));
}

function RoiInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-600">{label}</span>
      <input
        className="mt-3 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 font-maxot text-lg font-bold text-zinc-950 outline-none transition focus:border-[#BE0010] focus:bg-white focus:ring-4 focus:ring-[#BE0010]/10"
        min="0"
        onChange={(event) => onChange(cleanNumber(event.target.value))}
        step="1000"
        type="number"
        value={value}
      />
    </label>
  );
}

export default function ROICalculator({ disclaimer }) {
  const [purchasePrice, setPurchasePrice] = useState(450000);
  const [recoveredSolventValue, setRecoveredSolventValue] = useState(180000);
  const [disposalSavings, setDisposalSavings] = useState(60000);
  const [otherAnnualValue, setOtherAnnualValue] = useState(40000);

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

  return (
    <section id="roi" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="06"
          eyebrow="ROI & payback"
          title="When does it pay for itself?"
          description="Reliable evaporation with solvent recovery cuts spend on fresh solvent and disposal. Combine those savings with a rough purchase price - Inkarp will give you exact pricing."
        />

        <div className="relative mt-9 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-5">
              <RoiInput
                label="Estimated purchase price (\u20B9) - ask Inkarp for your quote"
                onChange={setPurchasePrice}
                value={purchasePrice}
              />
              <RoiInput
                label="Annual value of recovered solvent (\u20B9) - see the calculator above"
                onChange={setRecoveredSolventValue}
                value={recoveredSolventValue}
              />
              <RoiInput
                label="Annual solvent-disposal / waste savings (\u20B9)"
                onChange={setDisposalSavings}
                value={disposalSavings}
              />
              <RoiInput
                label="Other annual value - time saved, fewer reruns (\u20B9)"
                onChange={setOtherAnnualValue}
                value={otherAnnualValue}
              />
            </div>

            <button
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-900 bg-white px-6 text-sm font-semibold text-zinc-900 transition hover:border-[#BE0010] hover:bg-[#BE0010] hover:text-white"
              onClick={emailResults}
              type="button"
            >
              <FiMail className="text-base" />
              Email my ROI numbers to Inkarp
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-[#D30013] p-7 text-white shadow-sm sm:p-8">
              <p className="text-sm font-semibold text-white/75">Estimated payback period</p>
              <div className="font-maxot mt-5 text-4xl font-bold leading-none sm:text-5xl">
                {results.paybackMonths ? `${results.paybackMonths} months` : '-'}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
              <p className="text-sm font-semibold text-zinc-500">Total annual value</p>
              <div className="font-maxot mt-5 text-3xl font-bold leading-none text-zinc-950 sm:text-4xl">
                {formatCurrency(results.totalAnnualValue)}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
              <p className="text-sm font-semibold text-zinc-500">5-year net value (after purchase)</p>
              <div className="font-maxot mt-5 text-3xl font-bold leading-none text-zinc-950 sm:text-4xl">
                {formatCurrency(results.fiveYearNetValue)}
              </div>
            </div>

            {disclaimer && (
              <p className="text-sm leading-6 text-zinc-500">
                Disclaimer: {disclaimer}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}