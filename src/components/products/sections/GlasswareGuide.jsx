'use client';
import { useState } from 'react';

export default function GlasswareGuide({ cards = [] }) {
  const [active, setActive] = useState(null);
  if (!cards.length) return null;

  return (
    <section id="glassware" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Glassware guide</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Choose the right glassware set</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Glassware selection controls condensation efficiency, footprint, solvent compatibility and safety preference.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <button
              key={c.title}
              onClick={() => setActive(active === i ? null : i)}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                active === i
                  ? 'border-[#BE0010] bg-white shadow-lg'
                  : 'border-zinc-200 bg-white hover:border-[#BE0010]/40 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${active === i ? 'bg-[#BE0010] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                  {c.title.includes('G1') ? 'G1' : c.title.includes('G3 XL') ? 'G3+' : c.title.includes('G3') ? 'G3' : c.title.includes('G5') ? 'G5' : c.title.includes('G6') ? 'G6' : '◈'}
                </div>
                <div>
                  <h3 className="font-maxot font-bold text-sm text-zinc-950">{c.title}</h3>
                  {active === i && <p className="mt-1.5 text-xs leading-5 text-zinc-600">{c.description}</p>}
                </div>
              </div>
              {active !== i && (
                <p className="text-xs leading-5 text-zinc-500 line-clamp-2">{c.description}</p>
              )}
              {active === i && (
                <a href="/contact-us" onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-block text-xs font-semibold text-[#BE0010] hover:underline">
                  Ask Inkarp about this set →
                </a>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
