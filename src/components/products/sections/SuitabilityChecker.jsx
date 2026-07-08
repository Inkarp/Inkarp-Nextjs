'use client';
import { useMemo, useState } from 'react';
import { FiCheck, FiDroplet } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

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

export default function SuitabilityChecker({ data }) {
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

  return (
    <section id="suitability" className="scroll-mt-16 border-b border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-12 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative mx-auto max-w-7xl w-full">
        <SectionHeader
          number={data?.sectionNumber ?? '05'}
          eyebrow="Suitability checker"
          title="Will the Hei-VAP Core fit your workflow?"
          description="Tell us about your evaporation needs and we will tell you if this model is the right fit - or point you to a better Heidolph option."
        />

        <div className="relative mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 p-5 shadow-sm">
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-parchment-alt dark:bg-zinc-800">
              <div className="h-full rounded-full bg-navy dark:bg-zinc-500 transition-all duration-300" style={{ width: `${completion}%` }} />
            </div>

            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <p className="mb-2.5 text-sm font-semibold text-black dark:text-zinc-100">
                    {field.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {field.options.map((option) => {
                      const active = selections[field.key] === option.val;
                      return (
                        <button
                          className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                            active
                              ? 'border-black dark:border-zinc-100 bg-navy dark:bg-zinc-100 text-parchment dark:text-zinc-900'
                              : 'border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 text-black dark:text-zinc-100 hover:border-zinc-400 hover:text-black dark:hover:text-zinc-100'
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
              className="mt-6 h-12 w-full rounded-full bg-red px-6 text-left text-sm font-bold text-parchment transition hover:bg-[#9f000d] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!allAnswered}
              onClick={handleCheck}
              type="button"
            >
              Check suitability
            </button>
          </div>

          <div className="rounded-2xl border border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 p-5 shadow-sm lg:flex lg:items-center">
            {checked && result ? (
              <div className="w-full">
                <div className={`mb-4 inline-flex size-11 items-center justify-center rounded-2xl border text-xl ${isCheckResult ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'}`}>
                  <FiCheck />
                </div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight text-ink dark:text-zinc-100">
                  {normaliseText(result.title)}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-black dark:text-zinc-400">
                  {normaliseText(result.body)}
                </p>
                {result.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.tags.map((tag) => (
                      <span className="rounded-full border border-line-light dark:border-zinc-800 bg-parchment-alt dark:bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-black dark:text-zinc-100" key={tag}>
                        {normaliseText(tag)}
                      </span>
                    ))}
                  </div>
                ) : null}
                <a
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-red px-5 text-sm font-bold text-parchment transition hover:bg-[#9f000d]"
                  href="#booking"
                >
                  Discuss your needs with us
                </a>
              </div>
            ) : (
              <div className="mx-auto max-w-sm text-center">
                <FiDroplet className="mx-auto mb-3 text-red" size={44} />
                <p className="text-sm text-ink-soft dark:text-zinc-500">Select your needs and click check</p>
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
