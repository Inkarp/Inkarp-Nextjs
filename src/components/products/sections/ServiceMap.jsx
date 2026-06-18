'use client';
import { useState } from 'react';

const REGION_COLORS = {
  South: '#BE0010',
  West: '#2563EB',
  North: '#0891B2',
  East: '#D97706',
};

export default function ServiceMap({ data }) {
  const { cities = [], title, description, eyebrow, contactEmail } = data ?? {};
  const [selected, setSelected] = useState(null);
  if (!cities.length) return null;

  const regions = [...new Set(cities.map((c) => c.region))];
  const selCity = cities[selected];

  return (
    <section id="service" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">{eyebrow ?? 'Service'}</p>
        <h2 className="font-maxot mt-2 text-2xl leading-tight text-zinc-950 sm:text-3xl">{title ?? 'Inkarp service across India'}</h2>
        {description && <p className="mt-3 mb-8 text-sm leading-7 text-zinc-500 max-w-3xl">{description}</p>}

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Map placeholder with dot overlay */}
          <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden" style={{ minHeight: 340 }}>
            {/* India silhouette – simplified vector */}
            <svg viewBox="0 0 100 120" className="w-full h-full absolute inset-0 opacity-10" aria-hidden>
              <path d="M30 5 Q35 3 45 5 Q60 8 65 15 Q72 20 70 30 Q75 38 72 48 Q80 55 78 65 Q82 72 76 80 Q72 88 65 92 Q58 100 50 105 Q42 100 38 95 Q28 88 25 80 Q18 72 22 62 Q16 52 18 42 Q14 30 20 22 Q22 12 30 5Z" fill="#BE0010"/>
            </svg>

            {/* City dots as grid overlay */}
            <div className="relative z-10 p-6 grid grid-cols-3 gap-3">
              {cities.map((city, i) => (
                <button
                  key={city.name}
                  onClick={() => setSelected(selected === i ? null : i)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition ${
                    selected === i
                      ? 'border-[#BE0010] bg-[#BE0010]/5'
                      : 'border-zinc-200 bg-white hover:border-[#BE0010]/40'
                  }`}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: REGION_COLORS[city.region] ?? '#BE0010' }}
                  />
                  <span className="text-xs font-semibold text-zinc-800 text-center leading-4">{city.name}</span>
                  <span className="text-xs text-zinc-400">{city.region}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail / Contact */}
          <div className="flex flex-col gap-4">
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

            {/* Selected city */}
            {selCity ? (
              <div className="rounded-2xl border-2 border-[#BE0010]/30 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: REGION_COLORS[selCity.region] ?? '#BE0010' }} />
                  <h3 className="font-maxot font-bold text-zinc-950">{selCity.name}</h3>
                  <span className="text-xs text-zinc-400">({selCity.region})</span>
                </div>
                <p className="text-sm text-zinc-600 mb-3">Inkarp provides product consultation, installation, training and service support in and around {selCity.name}.</p>
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} className="text-sm font-semibold text-[#BE0010] hover:underline">
                    {contactEmail} →
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-5 text-center">
                <p className="text-sm text-zinc-400">Click a city to see service details.</p>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-sm text-zinc-900 mb-1">Don't see your city?</p>
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
