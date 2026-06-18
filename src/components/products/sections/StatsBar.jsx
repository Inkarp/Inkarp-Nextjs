'use client';

export default function StatsBar({ stats = [] }) {
  if (!stats.length) return null;
  return (
    <section className="border-y border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center py-6 px-4 text-center">
              <span className="font-maxot text-2xl font-bold text-zinc-950 sm:text-3xl">{s.value}</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
