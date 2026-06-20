'use client';
import { useState } from 'react';
import SectionHeader from './SectionHeader';

const REGION_COLORS = {
  South: '#BE0010',
  West: '#2563EB',
  North: '#0891B2',
  East: '#D97706',
};

export default function ServiceMap({ data }) {
  const { cities = [], title, description, eyebrow, contactEmail } = data ?? {};
  const [selected, setSelected] = useState(0);
  if (!cities.length) return null;

  const regions = [...new Set(cities.map((c) => c.region))];
  const selCity = cities[selected];

  return (
    <section id="service" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="17"
          eyebrow={eyebrow ?? 'Service'}
          title={title ?? 'Inkarp service across India'}
          description={description}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* India map with positioned city dots */}
          <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden" style={{ minHeight: 380 }}>
            <svg viewBox="0 0 100 120" className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden>
              <path d="M30 5 Q35 3 45 5 Q60 8 65 15 Q72 20 70 30 Q75 38 72 48 Q80 55 78 65 Q82 72 76 80 Q72 88 65 92 Q58 100 50 105 Q42 100 38 95 Q28 88 25 80 Q18 72 22 62 Q16 52 18 42 Q14 30 20 22 Q22 12 30 5Z" fill="#BE0010"/>
            </svg>

            <div className="absolute inset-0">
              {cities.map((city, i) => (
                <button
                  key={city.name}
                  aria-label={`Show ${city.name} branch details`}
                  onClick={() => setSelected(i)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                >
                  <span
                    className={`block rounded-full ring-2 ring-white transition ${
                      selected === i ? 'h-4 w-4 scale-110' : 'h-2.5 w-2.5'
                    }`}
                    style={{ backgroundColor: REGION_COLORS[city.region] ?? '#BE0010' }}
                  />
                  {selected === i && (
                    <span
                      className="absolute inset-0 -m-1.5 rounded-full"
                      style={{ boxShadow: `0 0 0 4px ${REGION_COLORS[city.region] ?? '#BE0010'}22` }}
                    />
                  )}
                  <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-950/85 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                    {city.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail / Contact */}
          <div className="flex flex-col gap-4">
            {/* City picker */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {cities.map((city, i) => (
                  <button
                    key={city.name}
                    onClick={() => setSelected(i)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected === i
                        ? 'border-[#BE0010] bg-[#BE0010]/5 text-[#BE0010]'
                        : 'border-zinc-200 text-zinc-600 hover:border-[#BE0010]/40'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected city detail */}
            {selCity && (
              <div className="rounded-2xl border-2 border-[#BE0010]/30 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: REGION_COLORS[selCity.region] ?? '#BE0010' }} />
                  <h3 className="font-maxot font-bold text-zinc-950">{selCity.name} branch</h3>
                  <span className="text-xs text-zinc-400">({selCity.region})</span>
                </div>
                <div className="space-y-1.5 text-sm text-zinc-600">
                  {selCity.phone && (
                    <a href={`tel:${selCity.phone.replace(/\s+/g, '')}`} className="block hover:text-[#BE0010]">
                      {selCity.phone}
                    </a>
                  )}
                  {(selCity.email ?? contactEmail) && (
                    <a href={`mailto:${selCity.email ?? contactEmail}`} className="block hover:text-[#BE0010]">
                      {selCity.email ?? contactEmail}
                    </a>
                  )}
                  {selCity.sla && <p>Response time: <span className="font-semibold text-zinc-900">{selCity.sla}</span></p>}
                </div>
                {selCity.services?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selCity.services.map((s) => (
                      <span key={s} className="rounded-full bg-[#BE0010]/5 px-2.5 py-1 text-[11px] font-semibold text-[#BE0010] ring-1 ring-[#BE0010]/15">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Region legend */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="font-maxot text-sm font-semibold uppercase tracking-wide text-zinc-400 mb-3">Regions covered</h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((r) => (
                  <span key={r} className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: REGION_COLORS[r] ?? '#BE0010' }} />
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-sm text-zinc-900 mb-1">Don&apos;t see your city?</p>
              <p className="text-xs text-zinc-500 mb-3">Inkarp covers all major cities and institutes across India. Contact us to confirm service availability in your location.</p>
              <a href="/contact-us" className="inline-flex items-center rounded-full bg-[#BE0010] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f000d] transition">
                Contact Inkarp →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
