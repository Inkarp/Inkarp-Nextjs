import Link from "next/link";
import { FiBox, FiGitBranch } from "react-icons/fi";
import { getAllPrincipals, getAllProducts, searchProducts } from "@/data/products/principals";
import ProductFilterForm from "@/components/products/ProductFilterForm";
import ProductResultsGrid from "@/components/products/ProductResultsGrid";
import RecTag from "@/components/home/RecTag";
import StickyProductSearch from "@/components/products/StickyProductSearch";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";
import { workflowIndustries } from "@/data/homeShowcase";
import {
  getWorkflowProducts,
  mergeWorkflowContent,
  normalizeTags,
} from "@/lib/workflowContent";
import { getProductIndustryCats } from "@/lib/industryMapping";

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

function toCardText(value) {
  if (value && typeof value === "object") {
    return value.title || value.name || value.label || value.description || "";
  }

  return value;
}

function toCardArray(value) {
  if (!value) {
    return [];
  }

  return (Array.isArray(value) ? value : [value]).map(toCardText).filter(Boolean);
}

function getProductApplicationValues(product) {
  const sheetApplications = toCardArray(product.processApplication);

  return sheetApplications.length ? sheetApplications : toCardArray(product.applications);
}

function toProductCard(product) {
  return {
    slug: product.slug,
    principalSlug: product.principalSlug,
    principalName: product.principalName,
    countryOfOrigin: product.countryOfOrigin,
    href: product.href,
    image: product.image,
    imageAlt: product.imageAlt,
    name: product.name,
    industry: product.industry,
    applications: getProductApplicationValues(product),
    industryTags: toCardArray(product.industryTags),
    workflowTags: toCardArray(product.workflowTags),
    problemSolutionTags: toCardArray(product.problemSolutionTags),
  };
}
function getParams(searchParams, key) {
  const value = searchParams[key];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

function productKey(product) {
  return `${product.principalSlug}:${product.slug}`;
}

function productMatchesWorkflowIndustry(product, industryContent, workflowProductKeys) {
  const productTags = normalizeTags([
    product.industry,
    product.category,
    product.industryTags,
    product.workflowTags,
    product.problemSolutionTags,
    product.tags,
    product.searchTags,
    product.applications,
    product.processApplication,
  ]);
  const industryTags = normalizeTags(industryContent.industryTags);

  return (
    workflowProductKeys.has(productKey(product)) ||
    industryTags.some((tag) => productTags.includes(tag))
  );
}

function buildWorkflowIndustryIndex(allProducts) {
  // Each product page carries an Industry Explorer section written in free
  // prose. Map those labels onto the nine filter industries once for the whole
  // catalogue, so the Industry dropdown reflects what the product pages claim
  // rather than only the handful of products named in workflow content.
  const industryCatsByProduct = new Map(
    allProducts.map((product) => [productKey(product), getProductIndustryCats(product)])
  );

  return workflowIndustries.map((industry) => {
    const content = mergeWorkflowContent(industry, null);
    const workflowProductKeys = new Set(getWorkflowProducts(content).map(productKey));
    const productKeys = new Set(
      allProducts
        .filter(
          (product) =>
            productMatchesWorkflowIndustry(product, content, workflowProductKeys) ||
            industryCatsByProduct.get(productKey(product))?.has(industry.cat)
        )
        .map(productKey)
    );

    return {
      ...industry,
      content,
      productKeys,
    };
  });
}

function filterProductsByWorkflowIndustries(products, selectedIndustries, workflowIndustryIndex) {
  if (!selectedIndustries.length) {
    return products;
  }

  const selectedProductKeys = new Set(
    workflowIndustryIndex
      .filter((industry) => selectedIndustries.includes(industry.cat))
      .flatMap((industry) => [...industry.productKeys])
  );

  return products.filter((product) => selectedProductKeys.has(productKey(product)));
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const selectedBrands = getParams(params, "brand");
  const selectedIndustries = getParams(params, "industry");
  const selectedApplications = getParams(params, "application");
  const filters = {
    q: getParam(params, "q"),
    principals: selectedBrands,
    applications: selectedApplications,
  };
  const allProducts = getAllProducts();
  const totalProducts = allProducts.length;
  const workflowIndustryIndex = buildWorkflowIndustryIndex(allProducts);
  const products = filterProductsByWorkflowIndustries(
    searchProducts(filters),
    selectedIndustries,
    workflowIndustryIndex
  );
  const productCards = products.map(toProductCard);
  const productCountsByBrand = allProducts.reduce((counts, product) => {
    counts.set(product.principalSlug, (counts.get(product.principalSlug) ?? 0) + 1);
    return counts;
  }, new Map());
  // Principals with no live products would offer a filter that returns nothing,
  // so they are left out of the dropdown until they have a product page.
  const brandOptions = getAllPrincipals()
    .map((principal) => ({
      label: principal.principalName,
      value: principal.slug,
      count: productCountsByBrand.get(principal.slug) ?? 0,
    }))
    .filter((option) => option.count > 0);
  const industryOptions = workflowIndustryIndex.map((industry) => ({
    label: industry.industry,
    value: industry.cat,
    count: industry.productKeys.size,
  }));
  const productCountsByApplication = allProducts.reduce((counts, product) => {
    getProductApplicationValues(product).forEach((application) => {
      counts.set(application, (counts.get(application) ?? 0) + 1);
    });
    return counts;
  }, new Map());
  const applicationOptions = [...productCountsByApplication.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((application) => ({
      label: application,
      value: application,
      count: productCountsByApplication.get(application),
    }));

  return (
    <main className="min-h-screen bg-white text-ink" data-scroll-skip>
      <BreadcrumbJsonLd path="/products" />
      <PageBreadcrumbs path="/products" />

      <section className="bg-white px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <RecTag>Scientific Instruments</RecTag>
              <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                Products and solutions for 
                <em className="italic text-red"> every lab workflow.</em>
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
          key={`${filters.q}-${selectedBrands.join("|")}-${selectedIndustries.join("|")}-${selectedApplications.join("|")}`}
          applicationOptions={applicationOptions}
          brandOptions={brandOptions}
          industryOptions={industryOptions}
          productCount={products.length}
          query={filters.q}
          selectedApplications={selectedApplications}
          selectedBrands={selectedBrands}
          selectedIndustries={selectedIndustries}
          totalCount={totalProducts}
        />
      </StickyProductSearch>

      <section className="bg-parchment-alt px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <ProductResultsGrid
            key={`${filters.q}-${selectedBrands.join("|")}-${selectedIndustries.join("|")}-${selectedApplications.join("|")}`}
            // Picking a brand is a deliberate, narrow choice — show that
            // principal's full range at once rather than making the user page
            // through "Load more". Other filters keep the paged default.
            initialVisibleCount={selectedBrands.length ? productCards.length : undefined}
            products={productCards}
            query={filters.q}
          />
        </div>
      </section>
    </main>
  );
}
