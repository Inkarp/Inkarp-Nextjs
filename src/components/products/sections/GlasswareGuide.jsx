'use client';
import { FiCheckCircle } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

function codeFor(title) {
  if (title.includes('G3 XL')) return 'G3+';
  if (title.includes('G3')) return 'G3';
  if (title.includes('G5')) return 'G5';
  if (title.includes('G6')) return 'G6';
  if (title.includes('G1')) return 'G1';
  if (title.toLowerCase().includes('coat')) return 'COATING';
  return '◈';
}

export default function GlasswareGuide({ cards = [] }) {
  if (!cards.length) return null;

  return (
    <section id="glassware" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          number="13"
          eyebrow="Glassware guide"
          title="Choose the right glassware set"
          description="Heidolph offers a range of condenser sets for the Hei-VAP Core. Pick the one that matches your solvents, recovery needs and bench space. This model ships with coated G3."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const standard = i === 0;
            return (
              <div
                key={c.title}
                className={`relative rounded-2xl border-2 p-5 text-left transition ${
                  standard ? 'border-ink shadow-sm dark:border-zinc-100 dark:bg-zinc-900' : 'border-line-light bg-parchment hover:border-red/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                {standard && (
                  <span className="absolute -top-3 right-4 rounded-full bg-red px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-parchment">
                    Standard
                  </span>
                )}

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-parchment-alt text-base font-bold text-ink dark:bg-zinc-800 dark:text-zinc-100">
                  {codeFor(c.title).length > 3 ? <FiCheckCircle className="text-red" /> : codeFor(c.title)}
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-widest text-black dark:text-zinc-100">{codeFor(c.title)}</p>
                <h3 className="mt-1 mb-2 text-base font-semibold tracking-tight text-ink dark:text-zinc-100">{c.title}</h3>
                <p className="mb-4 text-sm leading-6 text-black dark:text-zinc-100">{c.description}</p>

                {c.best && (
                  <div className="flex items-start gap-2 rounded-lg bg-parchment-alt px-3 py-2.5 text-xs font-semibold text-black dark:bg-zinc-800 dark:text-zinc-100">
                    <FiCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {c.best}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
