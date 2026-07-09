'use client';
import { useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiCpu, FiInfo, FiWifi } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

const DETAIL_ICONS = [FiCpu, FiInfo, FiCheckCircle];
const DETAIL_LABELS = [
  'What it supports',
  'What the lab should confirm',
  'End result',
];

export default function ConnectivityPlanner({ data, productName = 'this system' }) {
  const options = data?.options ?? [];
  const [active, setActive] = useState(0);

  if (!options.length) return null;
  const option = options[active];
  const rows = [option.support, option.confirm, option.result];

  return (
    <section id={data?.sectionId ?? 'connectivity'} className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-16 sm:px-6 lg:px-8 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative mx-auto max-w-[1180px] w-full">
        <SectionHeader
          number="12"
          eyebrow={data?.eyebrow ?? 'Connectivity & control planner'}
          title={data?.title ?? `How connected should your ${productName} setup be?`}
          description={data?.description}
        />

        <div className="relative mt-9 grid gap-6 lg:grid-cols-[294px_1fr]">
          <div className="space-y-2">
            {options.map((item, index) => (
              <button
                className={`flex min-h-12 w-full items-center gap-3 border px-5 py-3 text-left transition ${
                  active === index
                    ? 'border-black bg-red text-white'
                    : 'border-line-light bg-parchment text-black hover:border-line-light'
                }`}
                key={item.title}
                onClick={() => setActive(index)}
                type="button"
              >
                <FiWifi className={active === index ? 'shrink-0' : 'shrink-0 text-red'} />
                <span className="text-sm font-bold">{item.title}</span>
              </button>
            ))}
          </div>

          <div className="border border-line-light bg-parchment p-6 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight text-ink">{option.title}</h3>
            {option.meaning && (
              <p className="mt-2 text-sm leading-6 text-black">{option.meaning}</p>
            )}

            <div className="mt-6 space-y-4">
              {rows.map((row, index) => {
                if (!row) return null;
                const Icon = DETAIL_ICONS[index] ?? FiInfo;
                const label = DETAIL_LABELS[index];
                return (
                  <div className="grid gap-4 sm:grid-cols-[36px_1fr]" key={`${option.title}-${label}`}>
                    <div className="flex size-9 items-center justify-center border border-line-light bg-parchment-alt text-red">
                      <Icon className="text-base" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-black">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-black">{row}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 bg-red px-5 text-sm font-bold text-white transition hover:bg-transparent hover:text-red"
              href="#booking"
            >
              {option.cta ?? 'Discuss this setup with Inkarp'}
              <FiArrowRight />
            </a>
          </div>
        </div>

        <SectionDisclaimer>{data?.disclaimer}</SectionDisclaimer>
      </div>
    </section>
  );
}
