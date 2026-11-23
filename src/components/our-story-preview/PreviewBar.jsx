import Link from "next/link";

const DIRECTIONS = [
  { key: "voices", label: "B · In their words" },
  { key: "network", label: "C · Across India" },
];

/** Switches between the Our Story previews. */
export default function PreviewBar({ active }) {
  return (
    <div className="border-b border-line-light bg-parchment-alt">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-soft">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red" />
          Our Story preview
        </p>
        <nav aria-label="Preview directions" className="flex flex-wrap gap-1 rounded-full border border-line-light bg-white p-1">
          {DIRECTIONS.map((item) => (
            <Link
              aria-current={item.key === active ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                item.key === active ? "bg-red text-white" : "text-ink-soft hover:text-red"
              }`}
              href={`/our-story-preview/${item.key}`}
              key={item.key}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="text-[12px] font-semibold text-ink-soft hover:text-red" href="/our-story">
          Live Our Story page
        </Link>
      </div>
    </div>
  );
}
