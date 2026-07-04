import Link from "next/link";
import { Fragment } from "react";
import { buildBreadcrumbJsonLd, pageSeo } from "@/data/pageSeo";

export function BreadcrumbJsonLd({ path, trail }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildBreadcrumbJsonLd(trail ?? path)),
      }}
      type="application/ld+json"
    />
  );
}

// Pass `path` for a static top-level page (label comes from the pageSeo table),
// or `trail` — an array of { label, href } — for nested routes like
// /workflows/[industry]/[topic] that aren't in that table.
export default function PageBreadcrumbs({ path, trail }) {
  const steps = trail ?? (path && path !== "/" && pageSeo[path] ? [{ label: pageSeo[path].label, href: path }] : []);

  if (steps.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:px-6 lg:px-8 dark:text-zinc-400"
    >
      <Link className="transition hover:text-red" href="/">
        Home
      </Link>
      {steps.map((step, index) => (
        <Fragment key={step.href}>
          <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
            /
          </span>
          {index === steps.length - 1 ? (
            <span className="text-red">{step.label}</span>
          ) : (
            <Link className="transition hover:text-red" href={step.href}>
              {step.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
