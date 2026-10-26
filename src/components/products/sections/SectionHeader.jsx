'use client';

// `lead` is an optional one-line introduction shown between the eyebrow and the title.
export default function SectionHeader({ eyebrow, lead, title, description, dark = false }) {
  return (
    <div className="relative mb-8">
      {eyebrow && (
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red">
          <span className="inline-block h-2 w-2 bg-red" />
          {eyebrow}
        </p>
      )}

      {lead && (
        <p className={`relative mt-2 text-sm leading-6 ${dark ? 'text-white/70' : 'text-ink-soft'}`}>{lead}</p>
      )}

      {title && (
        <h2 className={`relative mt-2 text-xl font-semibold leading-tight tracking-tight sm:text-2xl ${dark ? 'text-white' : 'text-ink'}`}>
          {title}
        </h2>
      )}

      {description && (
        <p className={`relative mt-3 text-sm leading-7 ${dark ? 'text-white/60' : 'text-ink-soft'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
