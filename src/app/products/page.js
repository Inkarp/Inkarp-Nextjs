import Link from "next/link";
import { getAllPrincipals, getAllProducts, searchProducts } from "@/data/products/principals";
import ProductFilterForm from "@/components/products/ProductFilterForm";
import ProductResultsGrid from "@/components/products/ProductResultsGrid";
import StickyProductSearch from "@/components/products/StickyProductSearch";
import WorkflowExplorer from "@/components/products/WorkflowExplorer";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

const VIEW_TABS = [
  { value: "product", label: "By Product" },
  { value: "workflow", label: "By Workflow" },
];

export const metadata = buildPageMetadata("/products");

function getParam(searchParams, key) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value ?? "";
}

function getParams(searchParams, key) {
  const value = searchParams[key];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const view = getParam(params, "view") === "workflow" ? "workflow" : "product";
  const selectedBrands = getParams(params, "brand");
  const filters = {
    q: getParam(params, "q"),
    principals: selectedBrands,
  };
  const allProducts = getAllProducts();
  const totalProducts = allProducts.length;
  const products = searchProducts(filters);
  const productCountsByBrand = allProducts.reduce((counts, product) => {
    counts.set(product.principalSlug, (counts.get(product.principalSlug) ?? 0) + 1);
    return counts;
  }, new Map());
  const brandOptions = getAllPrincipals().map((principal) => ({
    label: principal.principalName,
    value: principal.slug,
    count: productCountsByBrand.get(principal.slug) ?? 0,
  }));

  return (
    <main className="bg-parchment-alt dark:bg-zinc-950 min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd path="/products" />
      <PageBreadcrumbs path="/products" />
      {/* Page header */}
      <section className="border-b border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-center gap-2">
          <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-red">
            Products
          </p>
          <h1 className="font-maxot  text-3xl text-zinc-950 dark:text-zinc-100 sm:text-4xl">
            Explore Inkarp products
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft dark:text-zinc-400">
            Type a product, principal, country, industry, application, or tag to
            see matching products instantly. Or browse by lab workflow, industry by industry.
          </p>

          <div className="mt-3 inline-flex rounded-lg border border-line-light bg-parchment-alt p-1 dark:border-zinc-700 dark:bg-zinc-800">
            {VIEW_TABS.map((tab) => (
              <Link
                key={tab.value}
                href={tab.value === "product" ? "/products" : "/products?view=workflow"}
                className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  view === tab.value
                    ? "bg-red text-white"
                    : "text-ink-soft hover:text-red dark:text-zinc-300"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {view === "workflow" ? (
        <WorkflowExplorer industry={getParam(params, "industry")} topicTag={getParam(params, "topic")} />
      ) : (
        <>
          {/* Sticky search toolbar */}
          <StickyProductSearch>
            <ProductFilterForm
              key={`${filters.q}-${selectedBrands.join("|")}`}
              brandOptions={brandOptions}
              productCount={products.length}
              query={filters.q}
              selectedBrands={selectedBrands}
              totalCount={totalProducts}
            />
          </StickyProductSearch>

          {/* Product grid */}
          <section className="relative px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <ProductResultsGrid products={products} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
