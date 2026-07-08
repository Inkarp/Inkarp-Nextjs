import Link from "next/link";
import { FiBox, FiGitBranch } from "react-icons/fi";
import { getAllPrincipals, getAllProducts, searchProducts } from "@/data/products/principals";
import ProductFilterForm from "@/components/products/ProductFilterForm";
import ProductResultsGrid from "@/components/products/ProductResultsGrid";
import StickyProductSearch from "@/components/products/StickyProductSearch";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

const VIEW_TABS = [
  { href: "/products", label: "By Product", active: true, Icon: FiBox },
  { href: "/workflows", label: "By Workflow", active: false, Icon: FiGitBranch },
];

const HOW_TO_FIND_STEPS = [
  {
    num: "01",
    title: "Search directly",
    description: "Use a product name, brand, or method.",
  },
  {
    num: "02",
    title: "Browse by workflow",
    description: "Start from the lab workflow or sample type.",
  },
  {
    num: "03",
    title: "Filter to narrow down",
    description: "Use task, industry, and brand filters to shrink the list fast.",
  },
  {
    num: "04",
    title: "Ask a specialist",
    description: "Get guided support when specifications are unclear.",
  },
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
    <main className="bg-white dark:bg-zinc-950 min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd path="/products" />
      <PageBreadcrumbs path="/products" />
      {/* Page header */}
      <section className="border-b border-line-light dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red">
                Scientific Instruments for Research and Industry
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-ink dark:text-zinc-100 sm:text-5xl lg:text-6xl">
                Products &amp; Solutions
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft dark:text-zinc-400 sm:text-lg">
                Find the right instrument by product category, application, industry, or
                principal brand. Built for scientists, lab managers, and procurement teams who
                need clear choices quickly.
              </p>
            </div>

            <div className="rounded-2xl border border-line-light bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/40 sm:p-4">
              <div className="flex flex-col gap-3">
                {HOW_TO_FIND_STEPS.map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-4 rounded-xl border border-line-light bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red/10 text-sm font-semibold text-red">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink dark:text-zinc-100">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-snug text-ink-soft dark:text-zinc-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center lg:justify-start">
            <div className="inline-flex rounded-lg border border-line-light bg-[whitesmoke] p-1 dark:border-zinc-700 dark:bg-zinc-800">
              {VIEW_TABS.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    tab.active
                      ? "bg-red text-white"
                      : "text-ink-soft hover:text-red dark:text-zinc-300"
                  }`}
                >
                  <tab.Icon aria-hidden className="h-4 w-4" />
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

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
    </main>
  );
}
