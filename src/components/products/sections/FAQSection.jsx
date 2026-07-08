'use client';
import { useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'capability', label: 'Capability' },
  { key: 'glassware', label: 'Glassware & accessories' },
  { key: 'safety', label: 'Safety' },
  { key: 'service', label: 'Service' },
  { key: 'pricing', label: 'Pricing' },
];

function getCategory(faq) {
  const text = `${faq.question} ${faq.answer}`.toLowerCase();
  if (text.includes('price') || text.includes('cost') || text.includes('quote')) return 'pricing';
  if (text.includes('glassware') || text.includes('condenser') || text.includes('pump') || text.includes('chiller')) return 'glassware';
  if (text.includes('safe') || text.includes('heat') || text.includes('protection') || text.includes('lock')) return 'safety';
  if (text.includes('install') || text.includes('service') || text.includes('india') || text.includes('demo')) return 'service';
  return 'capability';
}

export default function FAQSection({ faqs = [], productName }) {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [votes, setVotes] = useState({});

  const enrichedFaqs = useMemo(() => faqs.map((faq) => ({ ...faq, category: getCategory(faq) })), [faqs]);

  if (!faqs.length) return null;

  const query = search.trim().toLowerCase();
  const filtered = enrichedFaqs.filter((faq) => {
    const matchesCategory = category === 'all' || faq.category === category;
    const matchesSearch = !query || faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="18"
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Direct answers for product capability, configuration, pricing, installation and service discussions."
        />

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full rounded-full border border-line-light bg-parchment-alt py-2.5 pl-9 pr-4 text-sm text-black placeholder:text-black focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              type="search"
              value={search}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${category === item.key ? 'border-black dark:border-zinc-100 bg-navy dark:bg-zinc-100 text-parchment dark:text-zinc-900' : 'border-line-light bg-parchment text-black hover:border-zinc-400 hover:text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:text-zinc-100'}`}
                key={item.key}
                onClick={() => { setCategory(item.key); setOpen(null); }}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-2">
          {filtered.map((faq, i) => {
            const faqId = `${faq.category}-${faq.question}`;
            const isOpen = open === faqId;
            return (
              <div className={`rounded-xl border transition ${isOpen ? 'border-line-light bg-parchment-alt dark:border-zinc-700 dark:bg-zinc-900' : 'border-line-light bg-parchment hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'}`} key={faqId}>
                <button className="flex w-full items-start justify-between px-5 py-4 text-left" onClick={() => setOpen(isOpen ? null : faqId)} type="button">
                  <span className="pr-4 text-sm font-semibold text-black dark:text-zinc-100">{faq.question}</span>
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${isOpen ? 'bg-navy text-parchment dark:bg-zinc-100 dark:text-zinc-900' : 'bg-parchment-alt text-black dark:bg-zinc-800 dark:text-zinc-100'}`}>
                    {isOpen ? '-' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm leading-7 text-black dark:text-zinc-100">
                    <p>{faq.answer}</p>
                 
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-parchment-alt p-6 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              <p>No questions match your search.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="text-sm font-semibold text-ink underline dark:text-zinc-100" onClick={() => { setSearch(''); setCategory('all'); }} type="button">Clear filters</button>
                <a className="text-sm font-semibold text-red underline" href="#booking">Ask us directly</a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex max-w-7xl mx-auto flex-col justify-between gap-4 rounded-xl border border-line-light bg-parchment-alt p-5 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-sm font-semibold text-black dark:text-zinc-100">Have a question not listed here?</p>
            <p className="mt-0.5 text-xs text-black dark:text-zinc-400">Contact Inkarp for detailed technical discussions about {productName ?? 'this product'} and configurations.</p>
          </div>
          <a className="shrink-0 rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-[#9f000d]" href="#booking">
            Ask Inkarp
          </a>
        </div>
      </div>
    </section>
  );
}
