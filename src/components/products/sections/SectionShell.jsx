'use client';

export default function SectionShell({ id, eyebrow, title, description, bg = 'white', children, className = '' }) {
  return (
    <section
      id={id}
      className={`px-4 py-14 sm:px-6 lg:px-8 scroll-mt-16 ${bg === 'gray' ? 'bg-[#F6F6F6] dark:bg-zinc-900' : bg === 'dark' ? 'bg-navy' : 'bg-parchment dark:bg-zinc-950'} ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || description) && (
          <div className="mb-8 max-w-3xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-widest text-red">{eyebrow}</p>
            )}
            {title && (
              <h2 className={`mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl ${bg === 'dark' ? 'text-parchment' : 'text-ink dark:text-zinc-100'}`}>
                {title}
              </h2>
            )}
            {description && (
              <p className={`mt-3 text-sm leading-7 sm:text-base ${bg === 'dark' ? 'text-parchment/60' : 'text-ink-soft dark:text-zinc-400'}`}>
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
