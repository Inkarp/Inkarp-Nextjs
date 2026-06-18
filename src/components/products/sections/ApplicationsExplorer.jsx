'use client';
import { useState } from 'react';

const COLORS = ['#BE0010', '#2563EB', '#0891B2', '#D97706', '#16A34A', '#7C3AED'];

export default function ApplicationsExplorer({ data }) {
  const industries = data?.industries ?? [];
  const [active, setActive] = useState(0);

  if (!industries.length) return null;
  const ind = industries[active];
  const color = COLORS[active % COLORS.length];

  return (
    <section id="industries" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Applications</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">How is the Hei-VAP Core used in your industry?</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Select your industry to see typical tasks and the capabilities that matter for your workflow.
        </p>

        {/* Industry tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {industries.map((ind, i) => (
            <button
              key={ind.name}
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active === i ? 'text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
              style={active === i ? { backgroundColor: COLORS[i % COLORS.length] } : {}}
            >
              {ind.shortName ?? ind.name}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border p-6 shadow-sm" style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}>
            <h3 className="font-maxot text-xl text-zinc-950 mb-4">{ind.name}</h3>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {(ind.tasks ?? []).map((task) => (
                <div key={task} className="flex items-center gap-2 text-sm text-zinc-700">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  {task}
                </div>
              ))}
            </div>
            {ind.note && <p className="text-sm leading-6 text-zinc-600 mt-4 pt-4 border-t border-zinc-200">{ind.note}</p>}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-[#F6F6F6] p-6 shadow-sm">
            <h4 className="font-maxot text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-4">Key highlights</h4>
            <div className="space-y-3">
              {(ind.highlights ?? []).map((h) => (
                <div key={h.label} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{h.label}</span>
                  <span className="font-semibold text-sm text-zinc-900">{h.value}</span>
                </div>
              ))}
            </div>
            <a href="/contact-us" className="mt-5 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: color }}>
              Discuss {ind.shortName ?? ind.name} workflow →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
