import Link from "next/link";
import { FiBox, FiGitBranch } from "react-icons/fi";
import { getAllPrincipals, getAllProducts, searchProducts } from "@/data/products/principals";
import ProductFilterForm from "@/components/products/ProductFilterForm";
import ProductResultsGrid from "@/components/products/ProductResultsGrid";
import RecTag from "@/components/home/RecTag";
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
    <main className="min-h-screen bg-white text-ink" data-product-page data-scroll-skip>
      <BreadcrumbJsonLd path="/products" />
      <PageBreadcrumbs path="/products" />

      <section className="bg-white px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <RecTag>Scientific Instruments</RecTag>
              <h1 className="max-w-[13ch] text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                Products and solutions
                <em className="italic text-red"> for every lab workflow.</em>
              </h1>
              <p className="my-5 max-w-[560px] text-base leading-relaxed text-ink-soft sm:text-lg">
                Find the right instrument by product category, application, industry, or
                principal brand. Built for scientists, lab managers, and procurement teams who
                need clear choices quickly.
              </p>

              <div className="mt-8 flex flex-wrap gap-3.5">
                {VIEW_TABS.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`inline-flex items-center gap-2 border px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
                      tab.active
                        ? "border-red bg-red text-white hover:bg-transparent hover:text-red"
                        : "border-line-light bg-white text-ink hover:border-red hover:text-red"
                    }`}
                  >
                    <tab.Icon aria-hidden className="h-4 w-4" />
                    {tab.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative border border-line-light bg-parchment-alt p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
              <div className="grid gap-3">
                {HOW_TO_FIND_STEPS.map((step) => (
                  <div key={step.num} className="flex items-start gap-4 border border-line-light bg-white p-4">
                    <span className="text-lg font-semibold leading-none text-red">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{step.title}</p>
                      <p className="mt-1 text-sm leading-snug text-ink-soft">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
                <span>{totalProducts} products indexed</span>
                <span>{brandOptions.length} principal brands</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="bg-parchment-alt px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <ProductResultsGrid products={products} />
        </div>
      </section>
    </main>
  );
}
