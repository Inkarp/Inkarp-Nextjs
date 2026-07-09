'use client';

import { FiInfo } from 'react-icons/fi';

export default function SectionDisclaimer({ children, className = '' }) {
  if (!children) return null;

  return (
    <div
      className={`relative mt-6 border border-line-light bg-parchment-alt px-5 py-4 text-xs leading-6 text-red ${className}`}
    >
      <FiInfo aria-hidden className="mr-2 inline-block shrink-0 align-[-2px] text-sm text-red" />
      <span className="font-semibold text-red">Disclaimer: </span>
      {children}
    </div>
  );
}
