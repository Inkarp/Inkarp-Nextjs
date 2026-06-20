'use client';
import SectionHeader from './SectionHeader';

export default function WhyLabsChoose({ cards = [] }) {
  if (!cards.length) return null;
  return (
    <section id="benefits" className="scroll-mt-16 border-b border-zinc-200 bg-[#F6F6F6] px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          number="15"
          eyebrow="Benefits"
          title="What you gain with the Hei-VAP Core"
          description="A concise summary of the practical value in day-to-day laboratory use."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const icons = ['🎓', '✅', '🛡️', '⚙️', '🤝'];
            return (
              <div key={c.title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-[#BE0010]/30 hover:shadow-md transition">
                <div className="mb-3 text-2xl">{icons[i % icons.length]}</div>
                <h3 className="font-maxot font-bold text-sm text-zinc-950 mb-2">{c.title}</h3>
                <p className="text-sm leading-6 text-zinc-600">{c.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
