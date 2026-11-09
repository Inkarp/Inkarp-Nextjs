import { getAllPrincipals, getAllProducts, searchProducts } from "@/data/products/principals";
import { workflowIndustries } from "@/data/homeShowcase";
import {
  getWorkflowProducts,
  mergeWorkflowContent,
  normalizeTags,
} from "@/lib/workflowContent";
import { getProductIndustryCats } from "@/lib/industryMapping";

// Everything the /products page builds from the
// catalogue and the URL's filters: the result cards and the filter options.

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

/** The products page's data for one request's search params. */
export function getProductsCatalogData(params) {
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


  return {
    allProducts,
    applicationOptions,
    brandOptions,
    filters,
    industryOptions,
    productCards,
    selectedApplications,
    selectedBrands,
    selectedIndustries,
    totalProducts,
  };
}
