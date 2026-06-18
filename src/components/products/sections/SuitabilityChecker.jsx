'use client';
import { useState } from 'react';

function getResult(fields, selections, results) {
  for (const r of results) {
    if (r.condition === 'default') continue;
    const cond = r.condition;
    const matches = Object.entries(cond).every(([k, v]) => selections[k] === v);
    if (matches) return r;
  }
  return results.find((r) => r.condition === 'default') ?? null;
}

function VerdictBadge({ verdict }) {
  if (verdict === 'yes') return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"><span>✓</span>Good fit</span>;
  if (verdict === 'check') return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"><span>⚠</span>Check first</span>;
  return null;
}

export default function SuitabilityChecker({ data }) {
  const fields = data?.fields ?? [];
  const results = data?.results ?? [];
  const [selections, setSelections] = useState({});
  const [checked, setChecked] = useState(false);

  const allAnswered = fields.every((f) => selections[f.key]);
  const result = checked ? getResult(fields, selections, results) : null;

  const select = (key, val) => {
    setSelections((s) => ({ ...s, [key]: val }));
    setChecked(false);
  };

  return (
    <section id="config" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Suitability checker</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Will the Hei-VAP Core fit your workflow?</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Answer 4 quick questions about your workflow to get an instant fit assessment.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Questions */}
          <div className="space-y-5">
            {fields.map((field) => (
              <div key={field.key} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="font-maxot text-sm font-semibold text-zinc-900 mb-3">{field.label}</p>
                <div className="flex flex-wrap gap-2">
                  {field.options.map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => select(field.key, opt.val)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selections[field.key] === opt.val
                          ? 'bg-[#BE0010] text-white'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              disabled={!allAnswered}
              onClick={() => setChecked(true)}
              className="w-full rounded-xl bg-[#BE0010] py-3 text-sm font-semibold text-white transition hover:bg-[#9f000d] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check suitability →
            </button>
          </div>

          {/* Result */}
          <div className="flex flex-col justify-center">
            {result ? (
              <div className={`rounded-2xl border-2 p-6 shadow-sm ${result.verdict === 'yes' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="mb-3">
                  <VerdictBadge verdict={result.verdict} />
                </div>
                <h3 className="font-maxot text-xl text-zinc-950 mb-3">{result.title}</h3>
                <p className="text-sm leading-7 text-zinc-600 mb-5">{result.body}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {(result.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">{tag}</span>
                  ))}
                </div>
                <a href="/contact-us" className="inline-flex items-center gap-1 rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
                  Talk to Inkarp →
                </a>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-8 text-center">
                <div className="text-4xl mb-3">🔬</div>
                <p className="font-maxot text-zinc-400">Answer the questions and click "Check suitability" to get your result.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
