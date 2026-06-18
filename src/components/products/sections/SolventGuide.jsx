'use client';
import { useState } from 'react';

export default function SolventGuide({ cards = [], disclaimer }) {
  const [active, setActive] = useState(0);

  if (!cards.length) return null;
  const card = cards[active];

  return (
    <section id="solvents" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Solvent setup guide</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Which solvent are you evaporating?</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Starting guidance for common solvents – glassware, cooling, vacuum and accessory choices.
        </p>

        {/* Solvent selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {cards.map((c, i) => (
            <button
              key={c.title}
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active === i ? 'bg-[#BE0010] text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Detail card */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#BE0010]/10">
                <svg className="h-5 w-5 text-[#BE0010]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-maxot text-xl text-zinc-950">{card.title}</h3>
            </div>
            <p className="text-sm leading-7 text-zinc-600 mb-4">{card.description}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-[#F6F6F6] p-6 shadow-sm">
            <h4 className="font-maxot text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-4">Recommended setup</h4>
            {(card.items ?? []).map((item, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#BE0010]/10 text-[#BE0010] text-xs font-bold">{i + 1}</span>
                <p className="text-sm leading-6 text-zinc-700">{item}</p>
              </div>
            ))}
            <a href="/contact-us" className="mt-5 inline-flex items-center rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
              Ask Inkarp about {card.title} →
            </a>
          </div>
        </div>

        {disclaimer && (
          <p className="mt-6 rounded-xl border border-[#BE0010]/15 bg-[#BE0010]/5 p-4 text-xs leading-6 text-zinc-600">
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
