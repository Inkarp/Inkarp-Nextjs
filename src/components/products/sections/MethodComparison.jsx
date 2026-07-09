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
    <section id="comparison" className="scroll-mt-16 border-b border-line-light bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px]">
        <SectionHeader
          number="11"
          eyebrow={eyebrow ?? 'Method comparison'}
          title={title ?? 'Method comparison'}
          description={description ?? 'How the system compares with a basic manually controlled evaporation setup across the parameters that matter day to day.'}
        />

        <div className="relative mt-9 overflow-hidden border border-line-light bg-parchment">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="border-b border-line-light">
                  <th className="w-[28%] px-4 py-5 text-left text-xs font-bold uppercase tracking-widest text-black sm:px-6">
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
                    <td className="px-4 py-4 text-sm font-semibold text-black sm:px-6">
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
        </div>

        <SectionDisclaimer>
          {disclaimer ?? 'This is a generalised comparison with a typical basic manual setup for illustration - not a comparison with any specific competitor product. Capabilities depend on the exact equipment compared.'}
        </SectionDisclaimer>
      </div>
    </section>
  );
}
