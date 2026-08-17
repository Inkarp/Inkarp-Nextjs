'use client';
import { useEffect, useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

function formatCurrency(value, currencySymbol = '₹') {
  return `${currencySymbol}${Math.round(value || 0).toLocaleString('en-IN')}`;
}

function cleanNumber(value) {
  const nextValue = Number(value);
  if (!Number.isFinite(nextValue)) return 0;
  return Math.max(0, Math.round(nextValue));
}

function RoiInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black">{label}</span>
      <input
        className="mt-2 h-11 w-full border border-line-light bg-parchment-alt px-4 text-lg font-semibold tracking-tight text-ink outline-none transition focus:border-red focus:bg-parchment focus:ring-4 focus:ring-red/10"
        min="0"
        onChange={(event) => onChange(cleanNumber(event.target.value))}
        step="1000"
        type="number"
        value={value}
      />
    </label>
  );
}

// Legacy defaults preserve the original solvent-recovery payback calculator
// for any product that supplies a `roi` section without explicit fields.
const DEFAULT_PURCHASE_FIELD = {
  key: 'purchasePrice',
  label: 'Estimated purchase price (₹) - ask Inkarp for your quote',
  default: 450000,
  summaryLabel: 'Estimated purchase price',
};
const DEFAULT_VALUE_FIELDS = [
  { key: 'recoveredSolventValue', label: 'Annual value of recovered solvent (₹) - see the calculator above', default: 180000, summaryLabel: 'Annual recovered solvent value' },
  { key: 'disposalSavings', label: 'Annual solvent-disposal / waste savings (₹)', default: 60000, summaryLabel: 'Annual disposal / waste savings' },
  { key: 'otherAnnualValue', label: 'Other annual value - time saved, fewer reruns (₹)', default: 40000, summaryLabel: 'Other annual value' },
];

export default function ROICalculator({ data, sectionNumber = '07', productName = 'this product' }) {
  // purchasePriceField absent => "cost summary" mode: sum the entered values
  // and hand off to Inkarp for a savings estimate, rather than computing a
  // payback period that would require a purchase price the content doesn't give.
  const hasPurchasePrice = data ? Object.prototype.hasOwnProperty.call(data, 'purchasePriceField') : false;
  const purchaseField = hasPurchasePrice ? (data.purchasePriceField ?? null) : DEFAULT_PURCHASE_FIELD;
  const isPaybackMode = Boolean(purchaseField);

  const valueFields = data?.valueFields?.length ? data.valueFields : DEFAULT_VALUE_FIELDS;
  const currencySymbol = data?.currencySymbol ?? '₹';

  const [purchasePrice, setPurchasePrice] = useState(purchaseField?.default ?? 0);
  const [values, setValues] = useState(() =>
    Object.fromEntries(valueFields.map((field) => [field.key, field.default ?? 0]))
  );

  useEffect(() => {
    // Legacy bridge: the standalone SolventCalculator dispatches this event.
    // Only relevant when a value field is actually named 'recoveredSolventValue'.
    const targetKey = valueFields.find((field) => field.key === 'recoveredSolventValue') ? 'recoveredSolventValue' : null;
    if (!targetKey) return undefined;

    const applyCalculatorValue = (payload) => {
      const nextValue = cleanNumber(payload?.annualRecoveredValue);
      if (nextValue > 0) setValues((current) => ({ ...current, [targetKey]: nextValue }));
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
  }, [valueFields]);

  const results = useMemo(() => {
    const totalAnnualValue = valueFields.reduce((sum, field) => sum + (values[field.key] ?? 0), 0);
    const paybackMonths = isPaybackMode && totalAnnualValue > 0
      ? Math.max(1, Math.round((purchasePrice / totalAnnualValue) * 12))
      : null;
    const fiveYearNetValue = (totalAnnualValue * 5) - purchasePrice;

    return { totalAnnualValue, paybackMonths, fiveYearNetValue };
  }, [isPaybackMode, purchasePrice, values, valueFields]);

  const roiSummary = [
    ...(isPaybackMode ? [`${purchaseField.summaryLabel ?? 'Estimated purchase price'}: INR ${purchasePrice.toLocaleString('en-IN')}`] : []),
    ...valueFields.map((field) => `${field.summaryLabel ?? field.label}: INR ${(values[field.key] ?? 0).toLocaleString('en-IN')}`),
    ...(isPaybackMode
      ? [
          `Estimated payback period: ${results.paybackMonths ? `${results.paybackMonths} months` : '-'}`,
          `Total annual value: INR ${results.totalAnnualValue.toLocaleString('en-IN')}`,
          `5-year net value after purchase: INR ${results.fiveYearNetValue.toLocaleString('en-IN')}`,
        ]
      : [`${data?.totalValueLabel ?? 'Current total annual cost'}: INR ${results.totalAnnualValue.toLocaleString('en-IN')}`]),
  ].join('\n');

  const cards = data?.cards ?? [];

  return (
    <section id="roi" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeader
          number={sectionNumber}
          eyebrow={data?.eyebrow}
          title={data?.title}
          description={data?.description}
        />

        {cards.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="border border-line-light bg-parchment-alt p-4">
                <p className="text-sm font-semibold text-black">{card.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-ink-soft">{card.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="relative mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="border border-line-light bg-parchment p-5 sm:p-6">
            <div className="space-y-4">
              {isPaybackMode && (
                <RoiInput
                  label={purchaseField.label}
                  onChange={setPurchasePrice}
                  value={purchasePrice}
                />
              )}
              {valueFields.map((field) => (
                <RoiInput
                  key={field.key}
                  label={field.label}
                  onChange={(next) => setValues((current) => ({ ...current, [field.key]: next }))}
                  value={values[field.key] ?? 0}
                />
              ))}
            </div>

            <LeadCaptureForm
              className="mt-5 w-full"
              formType="roi-calculator"
              productName={productName}
              successMessage={(name) =>
                `Thank you${name ? `, ${name}` : ''}. We have sent your numbers to our team.`
              }
              summary={roiSummary}
              triggerLabel={data?.submitLabel ?? (isPaybackMode ? 'Email my ROI numbers to Inkarp' : 'Get my savings estimate from Inkarp')}
            />
          </div>

          <div className="space-y-3">
            {isPaybackMode ? (
              <>
                <div className="border border-line-light bg-parchment-alt p-5 sm:p-6">
                  <p className="text-sm font-semibold text-ink-soft">Estimated payback period</p>
                  <div className="mt-4 text-4xl font-semibold tracking-tight leading-none text-red sm:text-5xl">
                    {results.paybackMonths ? `${results.paybackMonths} months` : '-'}
                  </div>
                </div>

                <div className="border border-line-light bg-parchment p-5 sm:p-6">
                  <p className="text-sm font-semibold text-black">Total annual value</p>
                  <div className="mt-4 text-3xl font-semibold leading-none tracking-tight text-ink sm:text-4xl">
                    {formatCurrency(results.totalAnnualValue, currencySymbol)}
                  </div>
                </div>

                <div className="border border-line-light bg-parchment p-5 sm:p-6">
                  <p className="text-sm font-semibold text-black">5-year net value (after purchase)</p>
                  <div className="mt-4 text-3xl font-semibold leading-none tracking-tight text-ink sm:text-4xl">
                    {formatCurrency(results.fiveYearNetValue, currencySymbol)}
                  </div>
                </div>
              </>
            ) : (
              <div className="border border-line-light bg-parchment-alt p-5 sm:p-6">
                <p className="text-sm font-semibold text-ink-soft">{data?.totalValueLabel ?? 'Current total annual cost'}</p>
                <div className="mt-4 text-4xl font-semibold tracking-tight leading-none text-red sm:text-5xl">
                  {formatCurrency(results.totalAnnualValue, currencySymbol)}
                </div>
                {data?.totalValueNote && (
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{data.totalValueNote}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
