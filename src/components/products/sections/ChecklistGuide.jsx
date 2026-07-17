'use client';
import { useState } from 'react';
import { FiCheck, FiClipboard, FiRefreshCw } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';
import LeadCaptureForm from './LeadCaptureForm';

export default function ChecklistGuide({ data, productName, sectionId = 'readiness' }) {
  const items = data?.items ?? [];
  const [selected, setSelected] = useState([]);

  if (!items.length) return null;

  const toggle = (index) => {
    setSelected((current) => (
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index].sort((a, b) => a - b)
    ));
  };

  const selectedItems = selected.map((index) => items[index]).filter(Boolean);

  return (
    <section id={sectionId} className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative mx-auto max-w-[1180px] w-full">
        <SectionHeader
          eyebrow={data?.eyebrow}
          title={data?.title}
          description={data?.description}
        />

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-2">
            {items.map((item, index) => {
              const isSelected = selected.includes(index);
              return (
                <button
                  className={`flex min-h-14 w-full items-center gap-4 border px-5 py-3 text-left transition ${
                    isSelected
                      ? 'border-black bg-red text-white'
                      : 'border-line-light bg-parchment text-black hover:border-line-light'
                  }`}
                  key={item.label}
                  onClick={() => toggle(index)}
                  type="button"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center border text-sm ${
                      isSelected ? 'border-black bg-red text-white' : 'border-red/30 bg-parchment text-red'
                    }`}
                  >
                    {isSelected ? <FiCheck /> : <FiClipboard />}
                  </span>
                  <span className="text-base font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border border-line-light bg-parchment p-6 sm:p-8">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              {selectedItems.length ? 'What Inkarp should check for you:' : data?.emptyState ?? 'Select what you already have to see what Inkarp should check.'}
            </h3>

            {selectedItems.length ? (
              <div className="mt-4 max-h-80 space-y-4 overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div className="border border-line-light bg-parchment-alt p-4" key={item.label}>
                    <p className="font-bold text-black">{item.label}</p>
                    {item.meaning && <p className="mt-1 text-sm leading-6 text-ink-soft">{item.meaning}</p>}
                    {item.check && (
                      <p className="mt-1 text-sm font-semibold leading-6 text-red">Inkarp checks: {item.check}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 border border-line-light bg-parchment-alt p-6 text-center">
                <FiClipboard className="mx-auto mb-3 text-ink-soft" size={36} />
                <p className="text-sm leading-6 text-ink-soft">
                  Select one or more items to see what Inkarp should check before quotation.
                </p>
              </div>
            )}

            <button
              className="mt-6 inline-flex items-center gap-2 border border-line-light px-4 py-2 text-sm font-semibold text-black transition hover:bg-parchment-alt"
              onClick={() => setSelected([])}
              type="button"
            >
              <FiRefreshCw className="text-sm" />
              Reset selection
            </button>

            {selectedItems.length ? (
              <LeadCaptureForm
                className="mt-4 w-full"
                formType="readiness-checklist"
                productName={productName}
                successMessage={(name) =>
                  `Thank you${name ? `, ${name}` : ''}. We have sent your readiness checklist to our team.`
                }
                summary={`Items already in place:\n${selectedItems.map((item) => `- ${item.label}`).join('\n')}`}
                triggerLabel={data?.ctaLabel ?? 'Check my installation readiness'}
              />
            ) : null}
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
