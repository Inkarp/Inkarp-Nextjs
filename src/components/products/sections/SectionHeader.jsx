'use client';

export default function SectionHeader({ number, eyebrow, title, description, dark = false }) {
  return (
    <div className="relative mb-8 max-w-3xl">
      {number && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-4 right-0 select-none font-maxot text-[90px] font-bold leading-none text-zinc-100 sm:text-[120px]"
        >
          {number}
        </span>
      )}

      {eyebrow && (
        <p className="font-maxot flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#BE0010]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#BE0010]" />
          {eyebrow}
        </p>
      )}

      {title && (
        <h2 className={`font-maxot relative mt-2 text-xl leading-tight sm:text-2xl ${dark ? 'text-white' : 'text-zinc-950'}`}>
          {title}
        </h2>
      )}

      {description && (
        <p className={`relative mt-3 text-sm leading-7 ${dark ? 'text-white/60' : 'text-zinc-500'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
