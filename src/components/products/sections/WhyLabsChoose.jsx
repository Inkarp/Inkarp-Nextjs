'use client';

import {
  FiDroplet,
  FiFlag,
  FiSettings,
  FiShield,
  FiSliders,
  FiThermometer,
} from 'react-icons/fi';

const CARD_ICONS = [FiSliders, FiShield, FiDroplet, FiThermometer, FiSettings, FiFlag];

export default function WhyLabsChoose({ cards = [], section, productName }) {
  if (!cards.length) return null;

  const title = section?.title ?? `What you gain with ${productName ?? 'this product'}`;
  const description =
    section?.description ??
    "Concrete, capability-based benefits drawn from the product's real specifications - not customer testimonials. Ask Inkarp for verifiable references in your field.";

  return (
    <section id="benefits" className="scroll-mt-16 border-b border-zinc-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 -top-8 select-none font-maxot text-[120px] font-bold leading-none text-zinc-100 sm:text-[150px]"
        >
          15
        </span>

        <div className="relative mb-8 max-w-3xl">
          <p className="font-maxot flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <span className="inline-block size-2 rounded-full bg-[#BE0010]" />
            Why labs choose it
          </p>
          <h2 className="font-maxot mt-4 text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            {description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = CARD_ICONS[i % CARD_ICONS.length];
            const tag = c.tag ?? c.category ?? c.title;
            const isAccent = c.accent ?? (i === 0 || i === cards.length - 1);

            return (
              <article
                className="group relative flex min-h-[278px] flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 transition hover:border-[#BE0010]/25 hover:shadow-lg hover:shadow-zinc-900/5"
                key={c.title}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-1 font-serif text-7xl font-bold leading-none text-zinc-100 transition group-hover:text-[#BE0010]/10"
                >
                  &ldquo;
                </span>

                <div className="relative inline-flex size-12 items-center justify-center rounded-lg border border-[#BE0010]/20 bg-[#fff3f4] text-[#BE0010]">
                  <Icon className="size-5" />
                </div>

                <h3 className="font-maxot relative mt-6 text-lg font-bold leading-snug text-zinc-950">
                  {c.title}
                </h3>
                {c.description && (
                  <p className="relative mt-6 text-sm leading-7 text-zinc-600">
                    {c.description}
                  </p>
                )}

                <div
                  className={`relative mt-auto flex h-7 items-center rounded-full px-3 text-xs font-bold ${
                    isAccent
                      ? 'bg-[#fff0f1] text-[#BE0010]'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {tag}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
