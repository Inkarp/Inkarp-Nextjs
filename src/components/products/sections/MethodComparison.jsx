'use client';
import { FiInfo } from 'react-icons/fi';
import SectionHeader from './SectionHeader';

function cleanText(value = '') {
  return String(value)
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/\u00c2\u00b0/g, ' deg')
    .replace(/\u00b0/g, ' deg')
    .replace(/\u00c2\u00b1/g, '+/-')
    .replace(/\u00b1/g, '+/-');
}

export default function MethodComparison({ data }) {
  const { columns = [], rows = [], eyebrow, title, description, disclaimer } = data ?? {};
  if (!rows.length) return null;

  const highlightedIndex = columns.findIndex((column) => column.highlight);

  return (
    <section id="comparison" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-16 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="11"
          eyebrow={eyebrow ?? 'Method comparison'}
          title={title ?? 'Method comparison'}
          description={description ?? 'How the system compares with a basic manually controlled evaporation setup across the parameters that matter day to day.'}
        />

        <div className="relative mt-9 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="w-[28%] px-4 py-5 text-left text-xs font-bold uppercase tracking-widest text-black sm:px-6 dark:text-zinc-100">
                    Parameter
                  </th>
                  {columns.map((column, index) => {
                    const isHighlighted = column.highlight;
                    return (
                      <th
                        className={`px-4 py-5 text-center text-sm font-bold sm:px-6 ${
                          isHighlighted
                            ? 'bg-[#D30013]/[0.08] text-[#D30013]'
                            : 'text-black dark:text-zinc-100'
                        }`}
                        key={column.label}
                      >
                        {isHighlighted && (
                          <span className="mb-3 inline-flex rounded-full bg-[#D30013] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                            Recommended
                          </span>
                        )}
                        <span className="block">{cleanText(column.label)}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800" key={row.feature}>
                    <td className="px-4 py-4 text-sm font-semibold text-black sm:px-6 dark:text-zinc-100">
                      {cleanText(row.feature)}
                    </td>
                    {(row.values ?? []).map((value, index) => {
                      const isHighlighted = index === highlightedIndex;
                      return (
                        <td
                          className={`px-4 py-4 text-center text-sm sm:px-6 ${
                            isHighlighted
                              ? 'bg-[#D30013]/[0.08] font-bold text-black dark:text-zinc-100'
                              : 'text-black dark:text-zinc-100'
                          }`}
                          key={`${row.feature}-${index}`}
                        >
                          {cleanText(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="relative mt-5 max-w-5xl rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-xs leading-6 text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
          <FiInfo className="mr-2 inline-block text-sm" />
          Disclaimer: {disclaimer ?? 'This is a generalised comparison with a typical basic manual setup for illustration - not a comparison with any specific competitor product. Capabilities depend on the exact equipment compared.'}
        </div>
      </div>
    </section>
  );
}
