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
const DEFAULT_CLASSNAME =
  "mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:px-6 lg:px-8";

// `className` lets a caller embed the breadcrumb trail inside its own row
// (e.g. centered between a logo and a button) instead of the default
// full-width, self-contained bar.
export default function PageBreadcrumbs({ path, trail, className = DEFAULT_CLASSNAME }) {
  const steps = trail ?? (path && path !== "/" && pageSeo[path] ? [{ label: pageSeo[path].label, href: path }] : []);

  if (steps.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
    >
      <Link className="transition hover:text-red" href="/">
        Home
      </Link>
      {steps.map((step, index) => (
        <Fragment key={step.href}>
          <span aria-hidden="true" className="text-zinc-300">
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
