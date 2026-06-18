'use client';

const CERT_ICONS = {
  'CE': <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/><text x="20" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">CE</text></svg>,
  'NRTL': <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2"/><text x="20" y="23" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor">NRTL</text></svg>,
  'default': <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none"><path d="M20 4l4 8 9 1.3-6.5 6.3 1.5 9L20 24l-8 4.6 1.5-9L7 13.3 16 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
};

export default function StandardsCerts({ cards = [] }) {
  if (!cards.length) return null;

  return (
    <section id="standards" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">Quality &amp; safety</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">Standards, safety &amp; certification</h2>
        <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">
          Documentation and engineering details that support regulated and safety-conscious laboratories.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => {
            const iconKey = c.title.startsWith('CE') ? 'CE' : c.title.startsWith('NRTL') ? 'NRTL' : 'default';
            return (
              <div key={c.title} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-[#BE0010]/30 hover:shadow-md transition">
                <div className="shrink-0 text-[#BE0010]">
                  {CERT_ICONS[iconKey] ?? CERT_ICONS.default}
                </div>
                <div>
                  <h3 className="font-maxot font-bold text-sm text-zinc-950 mb-1">{c.title}</h3>
                  <p className="text-xs leading-5 text-zinc-600">{c.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-zinc-900">Need compliance documentation?</p>
            <p className="text-xs text-zinc-500 mt-0.5">EU Declaration of Conformity, NRTL certificate and continuous-operation certificate available on request.</p>
          </div>
          <a href="/contact-us" className="shrink-0 rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
            Request documents →
          </a>
        </div>
      </div>
    </section>
  );
}
