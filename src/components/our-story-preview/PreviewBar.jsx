import Link from "next/link";

/** Marks the page as the Our Story preview, with a link to the live page. */
export default function PreviewBar() {
  return (
    <div className="border-b border-line-light bg-parchment-alt">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-soft">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red" />
          Our Story preview
        </p>
        <Link className="text-[12px] font-semibold text-ink-soft hover:text-red" href="/our-story">
          Live Our Story page
        </Link>
      </div>
    </div>
  );
}
