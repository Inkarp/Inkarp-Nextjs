'use client';
import { useState } from 'react';

export default function FAQSection({ faqs = [] }) {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  if (!faqs.length) return null;

  const filtered = search
    ? faqs.filter((f) =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
      )
    : faqs;

  return (
    <section id="faq" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">FAQ</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Frequently asked questions</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Direct answers for product capability, configuration, pricing, installation and service discussions.
        </p>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2.5 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#BE0010] focus:outline-none focus:ring-2 focus:ring-[#BE0010]/20"
          />
        </div>

        <div className="space-y-2 max-w-4xl">
          {filtered.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`rounded-xl border transition ${isOpen ? 'border-[#BE0010]/30 bg-[#BE0010]/5' : 'border-zinc-200 bg-white hover:border-[#BE0010]/20'}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-sm text-zinc-900 pr-4">{faq.question}</span>
                  <span className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold transition ${isOpen ? 'bg-[#BE0010] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm leading-7 text-zinc-600">{faq.answer}</div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-zinc-400 py-4">No questions match your search. <button onClick={() => setSearch('')} className="text-[#BE0010] underline">Clear search</button></p>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between max-w-4xl">
          <div>
            <p className="font-semibold text-sm text-zinc-900">Have a question not listed here?</p>
            <p className="text-xs text-zinc-500 mt-0.5">Contact Inkarp for detailed technical discussions about the Hei-VAP Core and configurations.</p>
          </div>
          <a href="/contact-us" className="shrink-0 rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
            Ask Inkarp →
          </a>
        </div>
      </div>
    </section>
  );
}
