'use client';
import SectionHeader from './SectionHeader';
import SectionDisclaimer from './SectionDisclaimer';

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
    <section id="comparison" className="scroll-mt-32 border-b border-line-light bg-parchment-alt px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="relative mx-auto w-full max-w-[1180px]">
        <SectionHeader
          number="11"
          eyebrow={eyebrow ?? 'Method comparison'}
          title={title ?? 'Method comparison'}
          description={description ?? 'How the system compares with a basic manually controlled evaporation setup across the parameters that matter day to day.'}
        />

        <p className="mt-6 text-xs font-semibold text-ink-soft sm:hidden">Swipe horizontally to compare all columns.</p>
        <div className="relative mt-3 overflow-hidden border border-line-light bg-parchment sm:mt-9">
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full min-w-[680px] border-collapse sm:min-w-[820px]">
              <thead>
                <tr className="border-b border-line-light">
                  <th className="sticky left-0 z-10 w-[28%] bg-parchment px-3 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-black sm:px-6 sm:py-5 sm:text-xs sm:tracking-widest">
                    Parameter
                  </th>
                  {columns.map((column, index) => {
                    const isHighlighted = column.highlight;
                    return (
                      <th
                        className={`px-4 py-5 text-center text-sm font-bold sm:px-6 ${
                          isHighlighted
                            ? 'bg-parchment-alt text-ink'
                            : 'text-black'
                        }`}
                        key={column.label}
                      >
                        {isHighlighted && (
                          <span className="mb-3 inline-flex bg-red px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
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
                  <tr className="border-b border-line-light last:border-b-0" key={row.feature}>
                    <td className="sticky left-0 z-10 max-w-36 bg-parchment px-3 py-3 text-xs font-semibold text-black sm:max-w-none sm:px-6 sm:py-4 sm:text-sm">
                      {cleanText(row.feature)}
                    </td>
                    {(row.values ?? []).map((value, index) => {
                      const isHighlighted = index === highlightedIndex;
                      return (
                        <td
                          className={`px-4 py-4 text-center text-sm sm:px-6 ${
                            isHighlighted
                              ? 'bg-parchment-alt font-bold text-black'
                              : 'text-black'
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
          {/* Signals there's more to scroll — the table has no native scrollbar
              visible on most devices, and its sticky first column can otherwise
              make it look fully visible when it isn't. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-parchment to-transparent lg:hidden"
          />
        </div>

        <SectionDisclaimer>
          {disclaimer ?? 'This is a generalised comparison with a typical basic manual setup for illustration - not a comparison with any specific competitor product. Capabilities depend on the exact equipment compared.'}
        </SectionDisclaimer>
      </div>
    </section>
  );
}
