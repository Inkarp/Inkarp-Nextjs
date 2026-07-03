export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-3 text-center">
      <span className="rounded-full border border-red/30 bg-parchment px-4 py-1 text-xs font-semibold uppercase tracking-wide text-ink dark:bg-zinc-900 dark:text-zinc-100">
        {eyebrow}
      </span>
      {title ? (
        <h2 className="font-maxot text-2xl leading-tight text-red sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-ink-soft sm:text-base dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
