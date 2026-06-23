'use client';
import { useMemo, useState } from 'react';
import { FiCheck, FiHelpCircle } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const FIELD_LABELS = {
  type: 'Main use',
  volume: 'Typical batch volume',
  throughput: 'Throughput',
  automation: 'Do you need automation (auto lift, end-point detection)?',
};

const OPTION_LABELS = {
  low: 'A few batches/day',
  mid: 'Many batches/day',
  high: 'Continuous / all day',
  no: 'No - manual is fine',
};

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
    const nextSelections = { ...selections, [key]: val };
    setSelections(nextSelections);
    setChecked(fields.every((field) => nextSelections[field.key]));
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
    <section id="suitability" className="scroll-mt-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="09"
          eyebrow="Suitability checker"
          title="Will the Hei-VAP Core fit your workflow?"
          description="Tell us about your evaporation needs and we will tell you if this model is the right fit - or point you to a better Heidolph option."
        />

        <div className="relative mt-9 grid gap-7 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm sm:p-8">
            <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div className="h-full rounded-full bg-[#BE0010] transition-all duration-300" style={{ width: `${completion}%` }} />
            </div>

            <div className="space-y-7">
              {fields.map((field) => (
                <div key={field.key}>
                  <p className="mb-3 text-sm font-semibold text-black dark:text-zinc-100">
                    {FIELD_LABELS[field.key] ?? field.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {field.options.map((option) => {
                      const active = selections[field.key] === option.val;
                      return (
                        <button
                          className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                            active
                              ? 'border-black dark:border-zinc-100 bg-black dark:bg-zinc-100 text-white dark:text-zinc-900'
                              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 hover:border-zinc-400 hover:text-black dark:hover:text-zinc-100'
                          }`}
                          key={option.val}
                          onClick={() => select(field.key, option.val)}
                          type="button"
                        >
                          {OPTION_LABELS[option.val] ?? normaliseText(option.label)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-8 h-14 w-full rounded-full bg-[#D30013] px-6 text-left text-base font-bold text-white transition hover:bg-[#BE0010] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!allAnswered}
              onClick={handleCheck}
              type="button"
            >
              Check suitability
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm sm:p-8 lg:flex lg:items-center">
            {result ? (
              <div className="w-full">
                <div className={`mb-6 inline-flex size-14 items-center justify-center rounded-2xl border text-2xl ${isCheckResult ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' : 'border-[#BE0010]/15 bg-[#BE0010]/5 text-[#BE0010]'}`}>
                  <FiCheck />
                </div>
                <h3 className="font-maxot text-2xl font-bold leading-tight text-black dark:text-zinc-100">
                  {normaliseText(result.title)}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-black dark:text-zinc-400">
                  {normaliseText(result.body)}
                </p>
                {result.tags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {result.tags.map((tag) => (
                      <span className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-xs font-semibold text-black dark:text-zinc-100" key={tag}>
                        {normaliseText(tag)}
                      </span>
                    ))}
                  </div>
                ) : null}
                <a
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#D30013] px-5 text-sm font-bold text-white transition hover:bg-[#BE0010]"
                  href="#booking"
                >
                  Discuss your needs with us
                </a>
              </div>
            ) : (
              <div className="mx-auto max-w-sm text-center">
                <div className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-2xl text-black dark:text-zinc-100">
                  <FiHelpCircle />
                </div>
                <h3 className="font-maxot text-2xl font-bold text-black dark:text-zinc-100">Answer the questions</h3>
                <p className="mt-3 text-sm leading-7 text-black dark:text-zinc-400">
                  Select one option in each group to generate a suitability recommendation dynamically.
                </p>
              </div>
            )}
          </div>
        </div>

        {checked && result ? (
          <p className="relative mt-5 text-center text-xs text-black dark:text-zinc-400">
            This is a quick fit check. Inkarp can confirm the final model, glassware, vacuum pump and chiller based on your real workflow.
          </p>
        ) : null}
      </div>
    </section>
  );
}
