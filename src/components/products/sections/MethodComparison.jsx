'use client';

export default function MethodComparison({ data }) {
  const { columns = [], rows = [], eyebrow, title } = data ?? {};
  if (!rows.length) return null;

  return (
    <section id="comparison" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">{eyebrow ?? 'Comparison'}</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">{title ?? 'Product comparison'}</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Why the Hei-VAP Core is a stronger daily-lab option than an unassisted manual evaporation workflow.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr>
                <th className="rounded-tl-xl bg-zinc-200 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 w-40">Feature</th>
                {columns.map((col, i) => (
                  <th
                    key={col.label}
                    className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide ${
                      col.highlight
                        ? 'bg-[#BE0010] text-white rounded-tr-xl'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {col.highlight && <span className="mr-1.5">★</span>}
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.feature} className={ri % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                  <td className="px-5 py-3.5 text-sm font-semibold text-zinc-700">{row.feature}</td>
                  {(row.values ?? []).map((val, vi) => (
                    <td
                      key={vi}
                      className={`px-5 py-3.5 text-sm ${columns[vi]?.highlight ? 'font-semibold text-zinc-900' : 'text-zinc-500'}`}
                    >
                      {columns[vi]?.highlight ? (
                        <span className="flex items-start gap-2">
                          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#BE0010]" />
                          {val}
                        </span>
                      ) : (
                        <span className="flex items-start gap-2 text-zinc-400">
                          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-zinc-300" />
                          {val}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
