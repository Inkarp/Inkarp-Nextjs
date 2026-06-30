'use client';
import { useMemo, useState } from 'react';
import { FiCheck, FiInfo, FiMail, FiRefreshCw, FiSettings } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

const STEP_LABEL_HINTS = [
  { match: /workflow|use|application/i, label: 'Workflow' },
  { match: /lift/i, label: 'Lift' },
  { match: /glassware|condenser/i, label: 'Condenser' },
  { match: /coat/i, label: 'Coating' },
  { match: /vacuum|pump/i, label: 'Vacuum' },
  { match: /cool|chiller/i, label: 'Cooling' },
];

function titleCase(value = '') {
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStepLabel(stepDef, index) {
  if (stepDef.shortLabel || stepDef.label) return stepDef.shortLabel ?? stepDef.label;

  const source = `${stepDef.key ?? ''} ${stepDef.question ?? ''}`;
  const hinted = STEP_LABEL_HINTS.find((item) => item.match.test(source));
  return hinted?.label ?? titleCase(stepDef.key) ?? `Step ${index + 1}`;
}

function getResultLabel(stepDef, index) {
  return stepDef.resultLabel ?? stepDef.summaryLabel ?? getStepLabel(stepDef, index);
}

function cleanText(value = '') {
  return String(value)
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/\u00c2\u00b0/g, ' deg')
    .replace(/\u00b0/g, ' deg');
}

export default function ConfigWizard({ data, productName = 'Hei-VAP Core' }) {
  const steps = data?.steps ?? [];
  const result = data?.result ?? {};
  const eyebrow = data?.eyebrow ?? 'Configuration helper';
  const heading = data?.title ?? `Which ${productName} setup should I start from?`;
  const intro = data?.description ?? 'Answer a few quick questions and get a recommended starting configuration.';
  const disclaimer = data?.disclaimer ?? 'This helper gives a generic starting point only. Your final package, glassware set, vacuum pump and chiller are confirmed with Inkarp specialists.';
  const emptyState = data?.emptyState ?? 'Complete the steps to see your recommended package';

  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [done, setDone] = useState(false);

  const current = steps[step];
  const selectedRows = useMemo(() => Object.entries(selections).map(([key, val]) => {
    const stepIndex = steps.findIndex((item) => item.key === key);
    const stepDef = steps[stepIndex];
    const optDef = stepDef?.options.find((option) => option.val === val);
    return {
      key,
      label: stepDef ? getResultLabel(stepDef, stepIndex) : titleCase(key),
      value: cleanText(optDef?.label ?? val),
      desc: optDef?.desc ? cleanText(optDef.desc) : undefined,
    };
  }), [selections, steps]);

  const recommendedTitle = selectedRows.length
    ? `${productName} starting setup`
    : `${productName} configuration`;

  if (!steps.length || !current) return null;

  const reset = () => {
    setStep(0);
    setSelections({});
    setDone(false);
  };

  const select = (val) => {
    const next = { ...selections, [current.key]: val };
    setSelections(next);

    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    setDone(true);
    window.dispatchEvent(new CustomEvent('product-config-ready'));
  };

  const emailConfiguration = () => {
    const body = [
      `${productName} configuration request`,
      '',
      ...selectedRows.map((row) => `${row.label}: ${row.value}`),
      '',
      result.ctaNote ?? 'Please confirm availability and current pricing for this setup.',
    ].join('\n');

    window.dispatchEvent(new CustomEvent('product-config-ready'));
    window.location.href = `mailto:info@inkarp.com?subject=${encodeURIComponent(`${productName} - my configuration`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="config" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-10 sm:px-6 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-zinc-200 bg-[#F6F6F6] px-5 py-12 sm:px-8 lg:px-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative overflow-hidden">
          <SectionHeader number="09" eyebrow={eyebrow} title={heading} description={intro} />

          <div className="relative mt-8 flex flex-wrap items-center gap-x-3 gap-y-4">
            {steps.map((item, index) => {
              const isComplete = done || index < step;
              const isActive = !done && index === step;
              return (
                <div className="flex items-center gap-3" key={item.key ?? index}>
                  <button
                    aria-label={`Go to ${getStepLabel(item, index)}`}
                    className={`flex size-9 items-center justify-center rounded-full text-sm font-bold transition ${
                      isComplete
                        ? 'bg-black text-white dark:bg-zinc-100 dark:text-zinc-950'
                        : isActive
                          ? 'bg-[#D30013] text-white shadow-[0_0_0_6px_rgba(211,0,19,0.10)]'
                          : 'bg-white text-black ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700'
                    }`}
                    disabled={!isComplete && !isActive}
                    onClick={() => {
                      setStep(index);
                      setDone(false);
                    }}
                    type="button"
                  >
                    {isComplete ? <FiCheck className="text-sm" /> : index + 1}
                  </button>
                  <span className={`text-sm ${isActive ? 'font-bold text-black dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>
                    {getStepLabel(item, index)}
                  </span>
                  {index < steps.length - 1 && <span className="hidden h-px w-10 bg-zinc-300 sm:block dark:bg-zinc-700" />}
                </div>
              );
            })}
          </div>

          <div className="relative mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="font-maxot text-lg font-bold text-black dark:text-zinc-100">{cleanText(current.question)}</h3>
              <div className="mt-5 space-y-3">
                {(current.options ?? []).map((option) => {
                  const isSelected = selections[current.key] === option.val;
                  return (
                    <button
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? 'border-[#BE0010] bg-[#BE0010]/5 text-black dark:text-zinc-100'
                          : 'border-zinc-200 bg-white text-black hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500'
                      }`}
                      key={option.val}
                      onClick={() => select(option.val)}
                      type="button"
                    >
                      <span className="block text-base font-medium">{cleanText(option.label)}</span>
                      {option.desc && <span className="mt-1 block text-sm leading-6 text-black dark:text-zinc-400">{cleanText(option.desc)}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  className="text-sm font-semibold text-black transition hover:text-black disabled:cursor-not-allowed disabled:opacity-30 dark:text-zinc-100 dark:hover:text-zinc-100"
                  disabled={step === 0 && !done}
                  onClick={() => {
                    setDone(false);
                    setStep(Math.max(0, step - 1));
                  }}
                  type="button"
                >
                  Back
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  onClick={reset}
                  type="button"
                >
                  <FiRefreshCw className="text-sm" />
                  Reset
                </button>
              </div>
            </div>

            <div className="flex min-h-[270px] items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
              {!done ? (
                <div className="text-center text-black dark:text-zinc-100">
                  <FiSettings className="mx-auto text-4xl text-black dark:text-zinc-100" />
                  <p className="mt-4 text-sm leading-6">{emptyState}</p>
                </div>
              ) : (
                <div className="w-full">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#BE0010]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#BE0010]">
                    <FiCheck />
                    Configuration ready
                  </div>
                  <h3 className="font-maxot mt-4 text-2xl font-bold text-black dark:text-zinc-100">{result.title ?? recommendedTitle}</h3>
                  <div className="mt-5 space-y-2">
                    {selectedRows.map((row) => (
                      <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900" key={row.key}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-bold uppercase tracking-wide text-black dark:text-zinc-100">{row.label}</span>
                          <span className="text-right text-sm font-bold text-black dark:text-zinc-100">{row.value}</span>
                        </div>
                        {row.desc && <p className="mt-1 text-xs leading-5 text-black dark:text-zinc-400">{row.desc}</p>}
                      </div>
                    ))}
                  </div>
                  {result.ctaNote && <p className="mt-4 text-sm leading-6 text-black dark:text-zinc-400">{result.ctaNote}</p>}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-[#D30013] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#BE0010]"
                      onClick={emailConfiguration}
                      type="button"
                    >
                      <FiMail />
                      Email this configuration
                    </button>
                    <a className="rounded-full border border-zinc-900 px-5 py-3 text-sm font-bold text-black transition hover:border-[#BE0010] hover:text-[#BE0010] dark:border-zinc-100 dark:text-zinc-100" href="#booking">
                      {result.ctaLabel ?? 'Request quote'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative mt-5 max-w-5xl rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-xs leading-6 text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <FiInfo className="mr-2 inline-block text-sm" />
            Disclaimer: {disclaimer}
          </div>
        </div>
      </div>
    </section>
  );
}