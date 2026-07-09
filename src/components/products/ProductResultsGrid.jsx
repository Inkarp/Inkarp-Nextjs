import Image from "next/image";
import Link from "next/link";
import PrincipalLogo from "@/components/products/PrincipalLogo";

function getIndustryPills(product) {
  const industries = product.applicationsExplorer?.industries;
  if (industries?.length) {
    return industries.map((industry) => industry.name).filter(Boolean);
  }
  return product.applications ?? [];
}

export default function ProductResultsGrid({ products, emptyHref = "/products", emptyLinkLabel = "Clear search" }) {
  if (!products.length) {
    return (
      <div className="mt-4 border border-dashed border-line-light bg-white p-12 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">No products found</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Try another product, principal, country, industry, application, or tag.
        </p>
        <Link
          className="mt-4 inline-flex border border-red bg-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-transparent hover:text-red"
          href={emptyHref}
        >
          {emptyLinkLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <article
          className="group flex min-h-full flex-col border border-line-light bg-white p-4 transition hover:border-red/50"
          key={`${product.principalSlug}-${product.slug}`}
        >
          <Link
            aria-label={`View ${product.name}`}
            className="mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden border border-line-light bg-parchment-alt"
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

          <div className="flex items-start justify-between gap-2">
            <PrincipalLogo
              className="h-5 w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-red"
              principalName={product.principalName}
              principalSlug={product.principalSlug}
            />
            <span className="shrink-0 border border-line-light bg-parchment-alt px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
              {product.countryOfOrigin || "-"}
            </span>
          </div>

          <h2 className="mt-3 text-base font-semibold leading-snug tracking-tight text-ink">
            <Link className="transition group-hover:text-red" href={product.href}>
              {product.name}
            </Link>
          </h2>

          <p className="mt-1 text-[11px] text-ink-soft">{product.industry}</p>

          {(() => {
            const pills = getIndustryPills(product).slice(0, 5);
            if (!pills.length) return null;
            return (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {pills.map((pill, index) => (
                  <span
                    className="border border-line-light bg-parchment-alt px-2 py-0.5 text-[10px] text-ink-soft"
                    key={`${product.principalSlug}-${product.slug}-pill-${index}`}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            );
          })()}

          <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4">
            <Link
              className="flex h-10 items-center justify-center border border-red bg-red text-xs font-semibold text-white transition hover:bg-transparent hover:text-red"
              href={product.href}
            >
              View Details
            </Link>
            <Link
              className="inline-flex h-10 items-center border border-line-light bg-white px-3 text-xs font-semibold text-ink-soft transition hover:border-red hover:text-red"
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