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
  // `body` carries the section's supporting points as separate bullets. Sections
  // that only supply a `description` keep the single-paragraph lead-in.
  const bullets = section?.body?.length ? section.body : [];
  const description =
    section?.description ??
    (bullets.length
      ? null
      : "Concrete, capability-based benefits drawn from the product's real specifications - not customer testimonials. Ask Inkarp for verifiable references in your field.");

  return (
    <section id="benefits" className="scroll-mt-16 border-b border-line-light bg-parchment px-4 py-14 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1180px]">
        <div className="relative mb-8 max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            <span className="inline-block size-2 bg-red" />
            Why labs choose it
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-7 text-black">
              {description}
            </p>
          )}
          {section?.tabSummary && (
            <p className="mt-3 border-l-2 border-red pl-3 text-sm leading-6 text-ink-soft">
              {section.tabSummary}
            </p>
          )}
          {bullets.length > 0 && (
            <ul className="mt-4 space-y-3">
              {bullets.map((point) => (
                <li className="flex gap-3 text-base leading-7 text-black" key={point}>
                  <span aria-hidden className="mt-2.5 inline-block size-1.5 shrink-0 bg-red" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {section?.columnHeaders && (
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
            {section.columnHeaders.label}
            <span aria-hidden className="mx-2 text-red">&rarr;</span>
            {section.columnHeaders.value}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = CARD_ICONS[i % CARD_ICONS.length];
            const tag = c.tag ?? c.category ?? c.title;
            const isAccent = c.accent ?? (i === 0 || i === cards.length - 1);

            return (
              <article
                className="group relative flex min-h-[278px] flex-col overflow-hidden border border-line-light bg-parchment p-6 transition hover:border-red/25-900/5"
                key={c.title}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-1 font-serif text-7xl font-bold leading-none text-ink-soft transition group-hover:text-red/10"
                >
                  &ldquo;
                </span>

                <div className="relative inline-flex size-12 items-center justify-center border border-line-light bg-parchment-alt text-red">
                  <Icon className="size-5" />
                </div>

                <h3 className="relative mt-6 text-lg font-semibold leading-snug tracking-tight text-ink">
                  {c.title}
                </h3>
                {c.description && (
                  <p className="relative mt-6 text-sm leading-7 text-black">
                    {c.description}
                  </p>
                )}

                <div
                  className={`relative mt-auto flex min-h-7 items-center px-3 text-xs font-bold ${
                    isAccent
                      ? 'bg-red text-white'
                      : 'bg-parchment-alt text-black'
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
