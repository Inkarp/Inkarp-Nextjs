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

export default function StatsBar({ stats = [], showAll = false, title, intro }) {
  // Four by default; content can opt in to every stat plus a short title / intro line.
  const visibleStats = showAll ? stats : stats.slice(0, 4);

  if (!visibleStats.length) return null;

  return (
    <section className="border-y border-line-light bg-parchment-alt px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        {title || intro ? (
          <div className="mb-4 max-w-3xl">
            {title ? <p className="text-xs font-semibold uppercase tracking-widest text-red">{title}</p> : null}
            {intro ? <p className="mt-1 text-sm leading-6 text-ink-soft">{intro}</p> : null}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {visibleStats.map((s, index) => {
            const Icon = resolveIcon(s.label);
            const isHighlight = index === 0;
            return (
              <div className="flex items-center gap-2.5 border border-line-light bg-white p-3 sm:gap-4 sm:p-5" key={s.label}>
                <span className="flex size-8 shrink-0 items-center justify-center bg-red/8 text-sm text-red sm:size-11 sm:text-lg">
                  <Icon />
                </span>
                <div className="min-w-0">
                  <div className={`text-sm font-bold leading-tight tracking-tight sm:text-xl sm:leading-normal lg:text-2xl ${isHighlight ? 'text-red' : 'text-ink'}`}>
                    {s.value}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-tight text-ink-soft sm:text-xs">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
