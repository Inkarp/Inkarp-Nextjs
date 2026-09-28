import { Fragment } from "react";
import { FiCheckCircle, FiCpu, FiFileText } from "react-icons/fi";

function renderSpecValue(value) {
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-1.5">
        {value.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="mt-2 size-1 shrink-0 bg-red" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return value;
}

/**
 * A row may open a titled sub-table (`groupTitle`, optional `groupIntro`, and a
 * `groupNote` shown after the group's last row) - the group runs until the next
 * row with a `groupTitle`. Rows without these keys render as a plain list.
 */
function groupNoteAfter(specs, index) {
  const next = specs[index + 1];
  if (next && !next.groupTitle) return null;
  for (let i = index; i >= 0; i -= 1) {
    if (specs[i].groupTitle) return specs[i].groupNote ?? null;
  }
  return null;
}

export default function TechnicalSpecsTable({ note, specs = [] }) {
  if (!specs.length) {
    return null;
  }

  return (
    <div className="overflow-hidden border border-line-light bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="grid gap-4 border-b border-line-light bg-[linear-gradient(135deg,#161616_0%,#242424_62%,#be0010_100%)] p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center bg-white/10 text-xl ring-1 ring-white/15">
            <FiCpu aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/65">
              Specification matrix
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
              Technical data at a glance
            </h3>
          </div>
        </div>
        <div className="inline-flex w-fit items-center gap-2 border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
          <FiFileText aria-hidden="true" className="text-base" />
          {specs.length} specs
        </div>
      </div>

      <div className="divide-y divide-line-light sm:hidden">
        {specs.map((row, index) => (
          <Fragment key={`${row.label}-mobile-${index}`}>
            {row.groupTitle ? (
              <div className="bg-parchment-alt p-4">
                <h4 className="text-sm font-bold text-ink">{row.groupTitle}</h4>
                {row.groupIntro ? <p className="mt-1 text-xs leading-5 text-ink-soft">{row.groupIntro}</p> : null}
              </div>
            ) : null}
            <div className="bg-white p-4">
              <div className="flex items-start gap-2 text-sm font-semibold leading-6 text-ink">
                <FiCheckCircle aria-hidden="true" className="mt-1 shrink-0 text-red" />
                <span>{row.label}</span>
              </div>
              <div className="mt-2 break-words pl-6 text-sm font-medium leading-6 text-ink-soft">
                {renderSpecValue(row.value)}
              </div>
            </div>
            {groupNoteAfter(specs, index) ? (
              <p className="bg-white px-4 py-3 text-xs leading-5 text-ink-soft">{groupNoteAfter(specs, index)}</p>
            ) : null}
          </Fragment>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">Technical specifications table</caption>
          <thead>
            <tr className="border-b border-line-light bg-parchment-alt text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
              <th className="w-[34%] px-5 py-4" scope="col">Parameter</th>
              <th className="px-5 py-4" scope="col">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {specs.map((row, index) => (
              <Fragment key={`${row.label}-${index}`}>
              {row.groupTitle ? (
                <tr className="bg-parchment-alt">
                  <th className="px-5 py-3 text-left" colSpan={2} scope="colgroup">
                    <span className="block text-sm font-bold text-ink">{row.groupTitle}</span>
                    {row.groupIntro ? <span className="mt-1 block text-xs font-medium leading-5 text-ink-soft">{row.groupIntro}</span> : null}
                  </th>
                </tr>
              ) : null}
              <tr className="group bg-white transition hover:bg-red/[0.03]">
                <th className="align-top px-5 py-4 text-sm font-semibold leading-6 text-ink" scope="row">
                  <span className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center bg-parchment-alt text-red transition group-hover:bg-red group-hover:text-white">
                      <FiCheckCircle aria-hidden="true" className="text-sm" />
                    </span>
                    <span>{row.label}</span>
                  </span>
                </th>
                <td className="px-5 py-4 text-sm font-medium leading-6 text-ink-soft">
                  {renderSpecValue(row.value)}
                </td>
              </tr>
              {groupNoteAfter(specs, index) ? (
                <tr className="bg-white">
                  <td className="px-5 py-3 text-xs leading-5 text-ink-soft" colSpan={2}>{groupNoteAfter(specs, index)}</td>
                </tr>
              ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {note ? (
        <p className="border-t border-line-light bg-parchment-alt px-5 py-3 text-xs leading-6 text-ink-soft">
          {note}
        </p>
      ) : null}
    </div>
  );
}
