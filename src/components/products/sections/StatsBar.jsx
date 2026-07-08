'use client';

import { FiActivity, FiDroplet, FiRotateCw, FiZap } from 'react-icons/fi';
import { TbArrowsVertical } from 'react-icons/tb';

const ICON_RULES = [
  { match: (t) => t.includes('speed') || t.includes('rotation'), icon: FiRotateCw },
  { match: (t) => t.includes('power') || t.includes('heating'), icon: FiZap },
  { match: (t) => t.includes('volume') || t.includes('bath'), icon: FiDroplet },
  { match: (t) => t.includes('immersion') || t.includes('depth'), icon: TbArrowsVertical },
];

function resolveIcon(label = '') {
  const t = label.toLowerCase();
  return ICON_RULES.find((rule) => rule.match(t))?.icon ?? FiActivity;
}

export default function StatsBar({ stats = [] }) {
  if (!stats.length) return null;

  return (
    <section className="border-y border-line-light bg-parchment px-4 py-10 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, index) => {
            const Icon = resolveIcon(s.label);
            const isHighlight = index === 0;
            return (
              <div
                className="flex items-center gap-4 rounded-2xl border border-line-light bg-parchment-alt p-5 dark:border-zinc-800 dark:bg-zinc-900"
                key={s.label}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red/10 text-lg text-red">
                  <Icon />
                </span>
                <div>
                  <div
                    className={`text-xl font-bold tracking-tight sm:text-2xl ${
                      isHighlight ? 'text-red' : 'text-ink dark:text-zinc-100'
                    }`}
                  >
                    {s.value}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-soft dark:text-zinc-400">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
