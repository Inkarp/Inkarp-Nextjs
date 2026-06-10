import Link from "next/link";
import {
  getAllProducts,
  getProductFilterOptions,
  searchProducts,
} from "@/data/products/principals";
import ProductFilterForm from "@/components/products/ProductFilterForm";

export const metadata = {
  title: "Products - Inkarp Instruments Pvt Ltd",
  description:
    "Search and filter Inkarp products by principal, country of origin, industry, application, and product details.",
};

function getParam(searchParams, key) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value ?? "";
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    q: getParam(params, "q"),
    principal: getParam(params, "principal"),
    country: getParam(params, "country"),
    industry: getParam(params, "industry"),
    application: getParam(params, "application"),
    details: getParam(params, "details") === "true",
  };
  const options = getProductFilterOptions();
  const products = searchProducts(filters);

  return (
    <main className="bg-zinc-50 min-h-screen">
      {/* Page header */}
      <section className="border-b border-zinc-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">
            Products
          </p>
          <h1 className="font-maxot mt-2 text-3xl font-bold text-zinc-950 sm:text-4xl">
            Explore Inkarp products
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Search and filter across principals, countries, industries, and applications.
          </p>
        </div>
      </section>

      {/* Sticky search + filter toolbar */}
      <div className="sticky top-24 z-30 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductFilterForm
            filters={filters}
            options={options}
            productCount={products.length}
          />
        </div>
      </div>

      {/* Product grid */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {products.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-[#BE0010]/40 hover:shadow-md"
                  key={`${product.principalSlug}-${product.slug}`}
                >
                  {/* Principal + country */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-[#BE0010]">
                      {product.principalName}
                    </p>
                    <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500">
                      {product.countryOfOrigin || "—"}
                    </span>
                  </div>

                  {/* Product name */}
                  <h2 className="font-maxot mt-1.5 text-base font-bold leading-snug text-zinc-950">
                    <Link
                      className="transition group-hover:text-[#BE0010]"
                      href={product.href}
                    >
                      {product.name}
                    </Link>
                  </h2>

                  {/* Industry */}
                  <p className="mt-1 text-[11px] text-zinc-400">{product.industry}</p>

                  {/* Applications */}
                  {(product.applications ?? []).length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {(product.applications ?? []).slice(0, 3).map((app) => (
                        <span
                          className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500"
                          key={app}
                        >
                          {app}
                        </span>
                      ))}
                      {(product.applications ?? []).length > 3 ? (
                        <span className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400">
                          +{product.applications.length - 3}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 pt-3">
                    <Link
                      className="flex h-8 flex-1 items-center justify-center rounded-lg bg-zinc-950 text-xs font-semibold text-white transition hover:bg-[#BE0010]"
                      href={product.href}
                    >
                      View
                    </Link>
                    <Link
                      className="inline-flex h-8 items-center rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-600 transition hover:border-[#BE0010] hover:text-[#BE0010]"
                      href={product.apiPath}
                    >
                      API
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-12 text-center">
              <h2 className="font-maxot text-2xl font-bold text-zinc-950">
                No products found
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Try changing the search text or removing one of the filters.
              </p>
              <Link 
                className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#BE0010] px-4 text-sm font-semibold text-white transition hover:bg-[#9f000d]"
                href="/products"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
