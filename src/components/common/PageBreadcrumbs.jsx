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
// full-width, self-contained bar. `tone="neutral"` drops the brand red for
// pages that keep to greys (the blog).
const TONES = {
  brand: { link: "transition hover:text-red", current: "text-red" },
  neutral: { link: "transition hover:text-slate-950", current: "text-slate-900" },
};

export default function PageBreadcrumbs({ path, trail, className = DEFAULT_CLASSNAME, tone = "brand" }) {
  const steps = trail ?? (path && path !== "/" && pageSeo[path] ? [{ label: pageSeo[path].label, href: path }] : []);
  const colors = TONES[tone] ?? TONES.brand;

  if (steps.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
    >
      <Link className={colors.link} href="/">
        Home
      </Link>
      {steps.map((step, index) => (
        <Fragment key={step.href}>
          <span aria-hidden="true" className="text-zinc-300">
            /
          </span>
          {index === steps.length - 1 ? (
            <span className={colors.current}>{step.label}</span>
          ) : (
            <Link className={colors.link} href={step.href}>
              {step.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
