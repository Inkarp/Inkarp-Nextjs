import Link from "next/link";
import { buildBreadcrumbJsonLd, pageSeo } from "@/data/pageSeo";

export function BreadcrumbJsonLd({ path }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildBreadcrumbJsonLd(path)),
      }}
      type="application/ld+json"
    />
  );
}

export default function PageBreadcrumbs({ path }) {
  if (path === "/") {
    return null;
  }

  const current = pageSeo[path];

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:px-6 lg:px-8 dark:text-zinc-400"
    >
      <Link className="transition hover:text-red" href="/">
        Home
      </Link>
      <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
        /
      </span>
      <span className="text-red">{current.label}</span>
    </nav>
  );
}
