'use client';

export default function SectionHeader({ number, eyebrow, title, description, dark = false }) {
  return (
    <div className="relative mb-8 max-w-3xl">
      {number && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-4 right-0 select-none text-[90px] font-semibold leading-none tracking-tight text-zinc-100 dark:text-zinc-800 sm:text-[120px]"
        >
          {number}
        </span>
      )}

      {eyebrow && (
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red">
          <span className="inline-block h-2 w-2 rounded-full bg-red" />
          {eyebrow}
        </p>
      )}

      {title && (
        <h2 className={`relative mt-2 text-xl font-semibold leading-tight tracking-tight sm:text-2xl ${dark ? 'text-parchment' : 'text-ink dark:text-zinc-100'}`}>
          {title}
        </h2>
      )}

      {description && (
        <p className={`relative mt-3 text-sm leading-7 ${dark ? 'text-parchment/60' : 'text-ink-soft dark:text-zinc-400'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
