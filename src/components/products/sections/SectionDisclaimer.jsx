'use client';

import { FiInfo } from 'react-icons/fi';

export default function SectionDisclaimer({ children, className = '' }) {
  if (!children) return null;

  return (
    <div
      className={`relative mt-6 rounded-2xl border border-line-light bg-parchment-alt px-5 py-4 text-xs leading-6 text-ink-soft dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 ${className}`}
    >
      <FiInfo aria-hidden className="mr-2 inline-block shrink-0 align-[-2px] text-sm text-ink-soft dark:text-zinc-500" />
      <span className="font-semibold text-ink dark:text-zinc-200">Disclaimer: </span>
      {children}
    </div>
  );
}
