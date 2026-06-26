import Link from "next/link";
import { getAllProducts, searchProducts } from "@/data/products/principals";
import ProductFilterForm from "@/components/products/ProductFilterForm";
import StickyProductSearch from "@/components/products/StickyProductSearch";
import PrincipalLogo from "@/components/products/PrincipalLogo";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/products");

function getParam(searchParams, key) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value ?? "";
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    q: getParam(params, "q"),
  };
  const totalProducts = getAllProducts().length;
  const products = searchProducts(filters);

  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd path="/products" />
      <PageBreadcrumbs path="/products" />
      {/* Page header */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-center gap-2">
          <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-[#BE0010]">
            Products
          </p>
          <h1 className="font-maxot  text-3xl text-zinc-950 dark:text-zinc-100 sm:text-4xl">
            Explore Inkarp products
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Type a product, principal, country, industry, application, or tag to
            see matching products instantly.
          </p>
        </div>
      </section>

      {/* Sticky search toolbar */}
      <StickyProductSearch>
        <ProductFilterForm
          key={filters.q}
          productCount={products.length}
          query={filters.q}
          totalCount={totalProducts}
        />
      </StickyProductSearch>

      {/* Product grid */}
      <section className="relative px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {products.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  className="group flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm transition hover:border-[#BE0010]/40 hover:shadow-md"
                  key={`${product.principalSlug}-${product.slug}`}
                >
                  {/* Principal + country */}
                  <div className="flex items-start justify-between gap-2">
                    <PrincipalLogo
                      className="h-5 w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[#BE0010]"
                      principalName={product.principalName}
                      principalSlug={product.principalSlug}
                    />
                    <span className="shrink-0 rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                      {product.countryOfOrigin || "-"}
                    </span>
                  </div>

                  {/* Product name */}
                  <h2 className="font-maxot mt-1.5 text-base font-bold leading-snug text-zinc-950 dark:text-zinc-100">
                    <Link
                      className="transition group-hover:text-[#BE0010]"
                      href={product.href}
                    >
                      {product.name}
                    </Link>
                  </h2>

                  {/* Industry */}
                  <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">{product.industry}</p>

                  {/* Applications */}
                  {(product.applications ?? []).length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {(product.applications ?? []).slice(0, 3).map((app, index) => (
                        <span
                          className="rounded border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:text-zinc-400"
                          key={`${product.principalSlug}-${product.slug}-app-${index}`}
                        >
                          {app}
                        </span>
                      ))}
                      {(product.applications ?? []).length > 3 ? (
                        <span className="rounded border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                          +{product.applications.length - 3}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 pt-3">
                    <Link
                      className="flex h-8 flex-1 items-center justify-center rounded-lg bg-zinc-950 dark:bg-zinc-800 text-xs font-semibold text-white transition hover:bg-[#BE0010]"
                      href={product.href}
                    >
                      View
                    </Link>
                    <Link
                      className="inline-flex h-8 items-center rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 transition hover:border-[#BE0010] hover:text-[#BE0010]"
                      href={product.apiPath}
                    >
                      API
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
              <h2 className="font-maxot text-2xl font-bold text-zinc-950 dark:text-zinc-100">
                No products found
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Try another product, principal, country, industry, application,
                or tag.
              </p>
              <Link 
                className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#BE0010] px-4 text-sm font-semibold text-white transition hover:bg-[#9f000d]"
                href="/products"
              >
                Clear search
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
