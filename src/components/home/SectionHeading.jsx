export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-3 text-center">
      <span className="rounded-full border border-[#BE0010]/30 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        {eyebrow}
      </span>
      {title ? (
        <h2 className="font-maxot text-2xl leading-tight text-[#BE0010] sm:text-3xl">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
