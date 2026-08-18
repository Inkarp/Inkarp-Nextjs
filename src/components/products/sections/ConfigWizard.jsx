'use client';
import { useMemo, useState } from 'react';
import { FiCheck, FiRefreshCw, FiSettings } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

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
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStepLabel(stepDef, index) {
  if (stepDef.shortLabel || stepDef.label) return stepDef.shortLabel ?? stepDef.label;

  // Match against the step `key` only - matching the full question text let
  // coincidental words (e.g. "application" inside a package question, or
  // "glassware" inside a coating question) hijack unrelated steps' labels.
  const hinted = STEP_LABEL_HINTS.find((item) => item.match.test(stepDef.key ?? ''));
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

  const configurationSummary = selectedRows
    .map((row) => `- ${row.label}: ${row.desc ? `${row.value} (${row.desc})` : row.value}`)
    .join('\n');

  return (
    <section id="config" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] border border-line-light bg-parchment-alt px-5 py-12 sm:px-8 lg:px-12">
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
                    className={`flex size-9 items-center justify-center text-sm font-bold transition ${
                      isComplete
                        ? 'bg-red text-white'
                        : isActive
                          ? 'border-2 border-red bg-parchment text-red'
                          : 'bg-parchment text-black ring-1 ring-line-light'
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
                  <span className={`text-sm ${isActive ? 'font-bold text-black' : 'text-black'}`}>
                    {getStepLabel(item, index)}
                  </span>
                  {index < steps.length - 1 && <span className="hidden h-px w-10 bg-parchment-alt sm:block" />}
                </div>
              );
            })}
          </div>

          <div className="relative mt-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-stretch">
            <div className="flex h-[520px] flex-col border border-line-light bg-parchment p-6 sm:p-8">
              <h3 className="shrink-0 text-lg font-semibold tracking-tight text-ink">{cleanText(current.question)}</h3>
              <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {(current.options ?? []).map((option) => {
                  const isSelected = selections[current.key] === option.val;
                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`w-full border px-4 py-3 text-left transition ${
                        isSelected
                          ? 'border-ink bg-parchment-alt text-black'
                          : 'border-line-light bg-parchment text-black hover:border-line-light'
                      }`}
                      key={option.val}
                      onClick={() => select(option.val)}
                      type="button"
                    >
                      <span className="block text-base font-medium">{cleanText(option.label)}</span>
                      {option.desc && <span className="mt-1 block text-sm leading-6 text-black">{cleanText(option.desc)}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <button
                  className="text-sm font-semibold text-black transition hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
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
                  className="inline-flex items-center gap-2 border border-line-light px-4 py-2 text-sm font-semibold text-black transition hover:bg-parchment-alt"
                  onClick={reset}
                  type="button"
                >
                  <FiRefreshCw className="text-sm text-red" />
                  Reset
                </button>
              </div>
            </div>

            <div className="flex h-[520px] flex-col overflow-y-auto border border-line-light bg-parchment p-6 sm:p-8">
              {!done ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-black">
                  <FiSettings className="mx-auto text-4xl text-red" />
                  <p className="mt-4 text-sm leading-6">{emptyState}</p>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col">
                  <div className="inline-flex shrink-0 items-center gap-2 self-start bg-red/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red">
                    <FiCheck />
                    Configuration ready
                  </div>
                  <h3 className="mt-4 shrink-0 text-2xl font-semibold tracking-tight text-ink">{result.title ?? recommendedTitle}</h3>
                  <div className="mt-5 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                    {selectedRows.map((row) => (
                      <div className="border border-line-light bg-parchment-alt px-4 py-3" key={row.key}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-bold uppercase tracking-wide text-black">{row.label}</span>
                          <span className="text-right text-sm font-bold text-black">{row.value}</span>
                        </div>
                        {row.desc && <p className="mt-1 text-xs leading-5 text-black">{row.desc}</p>}
                      </div>
                    ))}
                  </div>
                  {result.ctaNote && <p className="mt-4 shrink-0 text-sm leading-6 text-black">{result.ctaNote}</p>}
                  <div className="mt-5 flex shrink-0 flex-wrap items-start gap-3">
                    <LeadCaptureForm
                      formType="config-wizard"
                      productName={productName}
                      successMessage={(name) =>
                        `Thank you${name ? `, ${name}` : ''}. We have sent your configuration to our team.`
                      }
                      summary={configurationSummary}
                      triggerLabel="Email this configuration"
                    />
                    <a className="inline-flex h-11 items-center justify-center border border-line-light px-5 text-sm font-bold text-black transition hover:border-red hover:text-red" href="#booking">
                      {result.ctaLabel ?? 'Request quote'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <SectionDisclaimer>{disclaimer}</SectionDisclaimer>
        </div>
      </div>
    </section>
  );
}
