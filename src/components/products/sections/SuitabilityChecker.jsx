'use client';
import { useMemo, useState } from 'react';
import { FiCheck, FiDroplet } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

function getResult(selections, results) {
  for (const result of results) {
    if (result.condition === 'default') continue;
    const condition = result.condition;
    const matches = Object.entries(condition).every(([key, value]) => selections[key] === value);
    if (matches) return result;
  }
  return results.find((result) => result.condition === 'default') ?? null;
}

function normaliseText(value = '') {
  return value
    .replaceAll('–', '-')
    .replaceAll('²', '2')
    .replaceAll('°C', 'deg C');
}

export default function SuitabilityChecker({ data, productName }) {
  const fields = data?.fields ?? [];
  const results = data?.results ?? [];
  const [selections, setSelections] = useState({});
  const [checked, setChecked] = useState(false);

  const allAnswered = fields.every((field) => selections[field.key]);
  const result = allAnswered ? getResult(selections, results) : null;
  const isCheckResult = result?.verdict === 'check';

  const select = (key, val) => {
    setSelections({ ...selections, [key]: val });
    setChecked(false);
  };

  const handleCheck = () => {
    setChecked(true);
    window.dispatchEvent(new CustomEvent('product-suitability-checked'));
  };

  const completion = useMemo(() => {
    if (!fields.length) return 0;
    return Math.round((Object.keys(selections).length / fields.length) * 100);
  }, [fields.length, selections]);

  if (!fields.length || !results.length) return null;

  return (
    <section id="suitability" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px] w-full">
        <SectionHeader
          number={data?.sectionNumber ?? '05'}
          eyebrow={data?.eyebrow ?? 'Suitability checker'}
          title={data?.title ?? 'Will this fit your workflow?'}
          description={data?.description ?? 'Tell us about your needs and we will tell you if this model is the right fit - or point you to a better Heidolph option.'}
        />

        <div className="relative mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="border border-line-light bg-parchment p-5">
            <div className="mb-5 h-1.5 overflow-hidden bg-parchment-alt">
              <div className="h-full bg-red transition-all duration-300" style={{ width: `${completion}%` }} />
            </div>

            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <p className="mb-2.5 text-sm font-semibold text-black">
                    {field.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {field.options.map((option) => {
                      const active = selections[field.key] === option.val;
                      return (
                        <button
                          aria-pressed={active}
                          className={`border px-5 py-2.5 text-sm font-semibold transition ${
                            active
                              ? 'border-black bg-red text-white'
                              : 'border-line-light bg-parchment text-black hover:border-line-light hover:text-black'
                          }`}
                          key={option.val}
                          onClick={() => select(field.key, option.val)}
                          type="button"
                        >
                          {normaliseText(option.label)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-6 h-12 w-full bg-rose-50 px-6 text-left text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!allAnswered}
              onClick={handleCheck}
              type="button"
            >
              Check suitability
            </button>
          </div>

          <div className="border border-line-light bg-parchment p-5 lg:flex lg:items-center">
            {checked && result ? (
              <div className="w-full">
                <div className={`mb-4 inline-flex size-11 items-center justify-center border text-xl ${isCheckResult ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                  <FiCheck />
                </div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight text-ink">
                  {normaliseText(result.title)}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-black">
                  {normaliseText(result.body)}
                </p>
                {result.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.tags.map((tag) => (
                      <span className="border border-line-light bg-parchment-alt px-4 py-1.5 text-xs font-semibold text-black" key={tag}>
                        {normaliseText(tag)}
                      </span>
                    ))}
                  </div>
                ) : null}
                {data?.ctaNote && (
                  <p className="mt-4 max-w-xl text-sm leading-6 text-black">{data.ctaNote}</p>
                )}
                <LeadCaptureForm
                  className="mt-5"
                  formType="suitability-check"
                  productName={productName}
                  successMessage={(name) =>
                    `Thank you${name ? `, ${name}` : ''}. We have sent your suitability check to our team.`
                  }
                  summary={`Selections:\n${fields
                    .map((field) => `- ${field.label}: ${normaliseText(field.options.find((opt) => opt.val === selections[field.key])?.label ?? selections[field.key])}`)
                    .join('\n')}\n\nResult: ${normaliseText(result.title)}\n${normaliseText(result.body)}`}
                  triggerLabel={data?.ctaLabel ?? 'Discuss your needs with us'}
                />
              </div>
            ) : (
              <div className="mx-auto max-w-sm text-center">
                <FiDroplet className="mx-auto mb-3 text-red" size={44} />
                <p className="text-sm text-ink-soft">Select your needs and click check</p>
              </div>
            )}
          </div>
        </div>

        <SectionDisclaimer>
          {data?.disclaimer ?? 'This is a quick fit check. Inkarp can confirm the final model, glassware, vacuum pump and chiller based on your real workflow.'}
        </SectionDisclaimer>
      </div>
    </section>
  );
}
