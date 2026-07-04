import Image from "next/image";
import Link from "next/link";
import PrincipalLogo from "@/components/products/PrincipalLogo";

export default function ProductResultsGrid({ products, emptyHref = "/products", emptyLinkLabel = "Clear search" }) {
  if (!products.length) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-[whitesmoke] dark:border-zinc-700 dark:bg-zinc-900 p-12 text-center">
        <h2 className="font-maxot text-2xl font-bold text-zinc-950 dark:text-zinc-100">
          No products found
        </h2>
        <p className="mt-2 text-sm text-ink-soft dark:text-zinc-400">
          Try another product, principal, country, industry, application, or tag.
        </p>
        <Link
          className="mt-4 inline-flex h-9 items-center rounded-lg bg-red px-4 text-sm font-semibold text-parchment transition hover:bg-[#9f000d]"
          href={emptyHref}
        >
          {emptyLinkLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <article
          className="group flex flex-col rounded-2xl bg-[whitesmoke] dark:bg-zinc-900 p-4 shadow-sm ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-red/20 dark:ring-white/[0.04]"
          key={`${product.principalSlug}-${product.slug}`}
        >
          <Link
            aria-label={`View ${product.name}`}
            className="mb-3 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl dark:bg-zinc-800"
            href={product.href}
          >
            {product.image ? (
              <Image
                alt={product.imageAlt ?? product.name}
                className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                height={240}
                src={product.image}
                width={320}
              />
            ) : (
              <PrincipalLogo
                className="h-10 w-32 object-center text-center text-xs font-semibold uppercase tracking-wide text-red"
                principalName={product.principalName}
                principalSlug={product.principalSlug}
              />
            )}
          </Link>

          {/* Principal + country */}
          <div className="flex items-start justify-between gap-2">
            <PrincipalLogo
              className="h-5 w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-red"
              principalName={product.principalName}
              principalSlug={product.principalSlug}
            />
            <span className="shrink-0 rounded-full bg-white dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-ink-soft dark:text-zinc-400">
              {product.countryOfOrigin || "-"}
            </span>
          </div>

          {/* Product name */}
          <h2 className="font-maxot mt-1.5 text-base font-bold leading-snug text-zinc-950 dark:text-zinc-100">
            <Link className="transition group-hover:text-red" href={product.href}>
              {product.name}
            </Link>
          </h2>

          {/* Industry */}
          <p className="mt-1 text-[11px] text-ink-soft dark:text-zinc-500">{product.industry}</p>

          {/* Applications */}
          {(product.applications ?? []).length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {(product.applications ?? []).slice(0, 3).map((app, index) => (
                <span
                  className="rounded-full bg-white dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-ink-soft dark:text-zinc-400"
                  key={`${product.principalSlug}-${product.slug}-app-${index}`}
                >
                  {app}
                </span>
              ))}
              {(product.applications ?? []).length > 3 ? (
                <span className="rounded-full bg-white dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-ink-soft dark:text-zinc-500">
                  +{product.applications.length - 3}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Actions */}
          <div className="mt-auto flex gap-2 pt-3">
            <Link
              className="group relative flex h-9 flex-1 items-center justify-center overflow-hidden rounded-xl bg-navy dark:bg-zinc-800 text-xs font-semibold text-parchment shadow-sm transition group-hover:shadow-md"
              href={product.href}
            >
              <span className="absolute inset-y-0 left-0 w-1/2 origin-left scale-x-0 bg-red transition-transform duration-300 group-hover:scale-x-100" />
              <span className="absolute inset-y-0 right-0 w-1/2 origin-right scale-x-0 bg-red transition-transform duration-300 group-hover:scale-x-100" />
              <span className="relative z-10">View</span>
            </Link>
            <Link
              className="inline-flex h-9 items-center rounded-xl bg-white dark:bg-zinc-800 px-3 text-xs font-semibold text-ink-soft dark:text-zinc-400 transition hover:text-red"
              href={product.apiPath}
            >
              API
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
