'use client';
import { useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiClipboard, FiCpu, FiInfo, FiWifi } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';
import PeristalticPumpInteractive, { isPeristalticPumpTool } from './PeristalticPumpInteractive';

const DETAIL_ICONS = [FiCpu, FiInfo, FiCheckCircle];
const DEFAULT_FIELDS = [
  { key: 'support', label: 'What it supports' },
  { key: 'confirm', label: 'What the lab should confirm' },
  { key: 'result', label: 'End result' },
];

function parseChoices(raw) {
  return String(raw ?? '')
    .split(';')
    .map((choice) => choice.trim())
    .filter(Boolean);
}

export default function ConnectivityPlanner({ data, productName = 'this system' }) {
  if (isPeristalticPumpTool(data)) {
    return <PeristalticPumpInteractive data={data} productName={productName} />;
  }

  return <GenericConnectivityPlanner data={data} productName={productName} />;
}

function GenericConnectivityPlanner({ data, productName = 'this system' }) {
  const options = data?.options ?? [];
  const fields = data?.fields?.length ? data.fields : DEFAULT_FIELDS;
  const choicesField = fields.find((field) => field.key === 'choices');
  const isPicker = Boolean(choicesField);

  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [view, setView] = useState('questions');

  if (!options.length) return null;
  const option = options[activeIndex];
  const rows = fields.map((field) => ({ label: field.label, value: option[field.key] }));
  const answeredCount = Object.keys(answers).length;

  const goToQuestion = (index) => {
    setView('questions');
    setActiveIndex(index);
  };

  const handlePick = (choice) => {
    const wasComplete = answeredCount === options.length;
    setAnswers((current) => ({ ...current, [activeIndex]: choice }));

    if (wasComplete) {
      setView('summary');
      return;
    }

    const nextIndex = activeIndex + 1;
    if (nextIndex < options.length) {
      setActiveIndex(nextIndex);
    } else {
      setView('summary');
    }
  };

  const summaryConfiguration = options
    .map((opt, index) => `${index + 1}. ${opt.title}\n   -> ${answers[index] ?? 'Not answered'}`)
    .join('\n\n');

  const scenarioSummary = [
    option.title,
    ...rows.filter((row) => row.value).map((row) => `${row.label}: ${row.value}`),
  ].join('\n');

  return (
    <section id={data?.sectionId ?? 'connectivity'} className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px] w-full">
        <SectionHeader
          number="12"
          eyebrow={data?.eyebrow ?? 'Connectivity & control planner'}
          title={data?.title ?? `How connected should your ${productName} setup be?`}
          description={data?.description}
        />

        <div className="relative mt-9 grid gap-6 lg:grid-cols-[294px_1fr]">
          <div className="space-y-2">
            {options.map((item, index) => {
              const isActive = view === 'questions' && activeIndex === index;
              const answer = isPicker ? answers[index] : undefined;

              return (
                <button
                  className={`flex min-h-12 w-full items-start gap-3 border px-5 py-3 text-left transition ${
                    isActive
                      ? 'border-black bg-red text-white'
                      : answer
                      ? 'border-red/40 bg-parchment text-black'
                      : 'border-line-light bg-parchment text-black hover:border-line-light'
                  }`}
                  key={item.title}
                  onClick={() => goToQuestion(index)}
                  type="button"
                >
                  {answer ? (
                    <FiCheckCircle className={isActive ? 'shrink-0' : 'shrink-0 text-red'} />
                  ) : (
                    <FiWifi className={isActive ? 'shrink-0' : 'shrink-0 text-red'} />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{item.title}</span>
                    {answer ? (
                      <span className={`mt-0.5 block truncate text-xs ${isActive ? 'text-white/80' : 'text-ink-soft'}`}>
                        {answer}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}

            {isPicker ? (
              <button
                className={`flex min-h-12 w-full items-center gap-3 border px-5 py-3 text-left transition ${
                  view === 'summary'
                    ? 'border-black bg-red text-white'
                    : 'border-dashed border-line-light bg-parchment-alt text-black hover:border-red/40'
                }`}
                onClick={() => setView('summary')}
                type="button"
              >
                <FiClipboard className={view === 'summary' ? 'shrink-0' : 'shrink-0 text-red'} />
                <span className="text-sm font-bold">
                  Review my answers ({answeredCount}/{options.length})
                </span>
              </button>
            ) : null}
          </div>

          {isPicker && view === 'summary' ? (
            <div className="border border-line-light bg-parchment p-6 sm:p-8">
              <h3 className="text-2xl font-semibold tracking-tight text-ink">Your setup so far</h3>
              <p className="mt-2 text-sm leading-6 text-black">
                Review your answers below, then send them to Inkarp for a complete quotation.
              </p>

              <div className="mt-6 space-y-3">
                {options.map((opt, index) => (
                  <div
                    className="grid gap-1 border-b border-line-light pb-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4"
                    key={opt.title}
                  >
                    <button
                      className="text-left text-sm font-semibold text-black hover:text-red"
                      onClick={() => goToQuestion(index)}
                      type="button"
                    >
                      {opt.title}
                    </button>
                    <p className={`text-sm ${answers[index] ? 'font-semibold text-red' : 'text-ink-soft'}`}>
                      {answers[index] ?? 'Not answered'}
                    </p>
                  </div>
                ))}
              </div>

              <LeadCaptureForm
                className="mt-6"
                formType="setup-configurator"
                productName={productName}
                startExpanded
                submitLabel="Email my configuration to Inkarp"
                successMessage={(name) =>
                  `Thank you${name ? `, ${name}` : ''}. Your configuration has been sent to our team. We will reach out with a complete setup quotation shortly.`
                }
                summary={summaryConfiguration}
                triggerLabel="Email my configuration to Inkarp"
              />

              <button
                className="mt-4 text-sm font-semibold text-ink-soft transition hover:text-red"
                onClick={() => goToQuestion(0)}
                type="button"
              >
                ← Back to questions
              </button>
            </div>
          ) : isPicker ? (
            <div className="border border-line-light bg-parchment p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-red">
                Question {activeIndex + 1} of {options.length}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{option.title}</h3>

              <div className="mt-6 flex flex-wrap gap-3">
                {parseChoices(option[choicesField.key]).map((choice) => {
                  const isChosen = answers[activeIndex] === choice;
                  return (
                    <button
                      className={`border px-5 py-3 text-sm font-semibold transition ${
                        isChosen
                          ? 'border-black bg-red text-white'
                          : 'border-line-light bg-white text-black hover:border-red hover:text-red'
                      }`}
                      key={choice}
                      onClick={() => handlePick(choice)}
                      type="button"
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {answeredCount > 0 ? (
                <button
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red hover:underline"
                  onClick={() => setView('summary')}
                  type="button"
                >
                  Review my answers so far ({answeredCount}/{options.length}) <FiArrowRight />
                </button>
              ) : null}
            </div>
          ) : (
            <div className="border border-line-light bg-parchment p-6 sm:p-8">
              <h3 className="text-2xl font-semibold tracking-tight text-ink">{option.title}</h3>
              {option.meaning && (
                <p className="mt-2 text-sm leading-6 text-black">{option.meaning}</p>
              )}

              <div className="mt-6 space-y-4">
                {rows.map((row, index) => {
                  if (!row.value) return null;
                  const Icon = DETAIL_ICONS[index] ?? FiInfo;
                  return (
                    <div className="grid gap-4 sm:grid-cols-[36px_1fr]" key={`${option.title}-${row.label}`}>
                      <div className="flex size-9 items-center justify-center border border-line-light bg-parchment-alt text-red">
                        <Icon className="text-base" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-black">{row.label}</p>
                        <p className="mt-1 text-sm leading-6 text-black">{row.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <LeadCaptureForm
                className="mt-6"
                formType="scenario-picker"
                key={option.title}
                productName={productName}
                successMessage={(name) =>
                  `Thank you${name ? `, ${name}` : ''}. We have sent this scenario to our team and will follow up with guidance.`
                }
                summary={scenarioSummary}
                triggerLabel={option.cta ?? 'Discuss this setup with Inkarp'}
              />
            </div>
          )}
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
