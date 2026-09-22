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
    <section id="faq" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px]">
        <SectionHeader
          number="18"
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Direct answers for product capability, configuration, pricing, installation and service discussions."
        />

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full border border-line-light bg-parchment-alt py-2.5 pl-9 pr-4 text-sm text-black placeholder:text-black focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              type="search"
              value={search}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                className={`w-full border px-3 py-2 text-xs font-semibold transition sm:w-auto ${category === item.key ? 'border-black bg-red text-white' : 'border-line-light bg-parchment text-black hover:border-line-light hover:text-black'}`}
                key={item.key}
                onClick={() => { setCategory(item.key); setOpen(null); }}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1180px] mx-auto space-y-2">
          {filtered.map((faq, i) => {
            const faqId = `${faq.category}-${faq.question}`;
            const isOpen = open === faqId;
            return (
              <div className={`border transition ${isOpen ? 'border-line-light bg-parchment-alt' : 'border-line-light bg-parchment hover:border-line-light'}`} key={faqId}>
                <button className="flex w-full items-start justify-between px-5 py-4 text-left" onClick={() => setOpen(isOpen ? null : faqId)} type="button">
                  <span className="pr-4 text-sm font-semibold text-black">{faq.question}</span>
                  <span className={`flex size-6 shrink-0 items-center justify-center text-sm font-bold transition ${isOpen ? 'bg-red text-white' : 'bg-parchment-alt text-black'}`}>
                    {isOpen ? '-' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm leading-7 text-black">
                    <p>{faq.answer}</p>
                 
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="border border-dashed border-line-light bg-parchment-alt p-6 text-sm text-black">
              <p>No questions match your search.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="text-sm font-semibold text-ink underline" onClick={() => { setSearch(''); setCategory('all'); }} type="button">Clear filters</button>
                <a className="text-sm font-semibold text-red underline" href="#booking">Ask us directly</a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex max-w-[1180px] mx-auto flex-col justify-between gap-4 border border-line-light bg-parchment-alt p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-black">Have a question not listed here?</p>
            <p className="mt-0.5 text-xs text-black">Contact Inkarp for detailed technical discussions about {productName ?? 'this product'} and configurations.</p>
          </div>
          <a className="shrink-0 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100" href="#booking">
            Ask Inkarp
          </a>
        </div>
      </div>
    </section>
  );
}
