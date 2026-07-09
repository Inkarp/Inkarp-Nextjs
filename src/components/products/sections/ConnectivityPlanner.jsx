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
    <section id={data?.sectionId ?? 'connectivity'} className="scroll-mt-16 border-b border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="relative mx-auto max-w-7xl w-full">
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
                className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-5 py-3 text-left transition ${
                  active === index
                    ? 'border-black dark:border-zinc-100 bg-navy dark:bg-zinc-100 text-parchment dark:text-zinc-900'
                    : 'border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 text-black dark:text-zinc-100 hover:border-zinc-300'
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

          <div className="rounded-2xl border border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight text-ink dark:text-zinc-100">{option.title}</h3>
            {option.meaning && (
              <p className="mt-2 text-sm leading-6 text-black dark:text-zinc-400">{option.meaning}</p>
            )}

            <div className="mt-6 space-y-4">
              {rows.map((row, index) => {
                if (!row) return null;
                const Icon = DETAIL_ICONS[index] ?? FiInfo;
                const label = DETAIL_LABELS[index];
                return (
                  <div className="grid gap-4 sm:grid-cols-[36px_1fr]" key={`${option.title}-${label}`}>
                    <div className="flex size-9 items-center justify-center rounded-xl border border-line-light bg-parchment-alt text-red dark:border-zinc-800 dark:bg-zinc-900">
                      <Icon className="text-base" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-black dark:text-zinc-100">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-black dark:text-zinc-400">{row}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red px-5 text-sm font-bold text-parchment transition hover:bg-[#9f000d]"
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
