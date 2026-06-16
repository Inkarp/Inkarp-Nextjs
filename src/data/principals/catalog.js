import heidolphCatalog from "./heidolph/products.json";
import rotzmeierCatalog from "./rotzmeier/products.json";
import beingCatalog from "./being/products.json";

const principalCatalogs = [heidolphCatalog, rotzmeierCatalog, beingCatalog];

function toArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

function getPrincipal(catalog) {
  return catalog.principal ?? {};
}

function getCategories(catalog) {
  return toArray(catalog.categories);
}

function normalizeProduct(product, category, principal) {
  const applications = toArray(product.applications).length
    ? toArray(product.applications)
    : toArray(category.applications);
  const categoryName = product.category ?? category.name;

  return {
    ...product,
    category: categoryName,
    categorySlug: product.categorySlug ?? category.slug,
    industry: product.industry ?? category.industry ?? categoryName,
    applications,
    tags: uniqueValues([
      ...toArray(category.tags),
      ...toArray(product.tags),
      category.name,
      principal.principalName,
    ]),
    principalSlug: principal.slug,
    principalName: principal.principalName,
    countryOfOrigin: product.countryOfOrigin ?? principal.countryOfOrigin,
    href: `/products/${product.slug}`,
    apiPath: `/api/products/${principal.slug}/${product.slug}`,
    hasDetails: true,
    source: "json-catalog",
  };
}

export function getJsonCatalogs() {
  return principalCatalogs;
}

export function getJsonCatalogCategories(principalSlug) {
  return principalCatalogs
    .filter((catalog) => {
      const principal = getPrincipal(catalog);
      return !principalSlug || principal.slug === principalSlug;
    })
    .flatMap((catalog) => {
      const principal = getPrincipal(catalog);

      return getCategories(catalog).map((category) => ({
        ...category,
        principalSlug: principal.slug,
        principalName: principal.principalName,
        products: toArray(category.products).map((product) =>
          normalizeProduct(product, category, principal)
        ),
      }));
    });
}

export function getJsonCatalogProducts() {
  return getJsonCatalogCategories().flatMap((category) => category.products);
}

export function getJsonCatalogPrincipalBySlug(principalSlug) {
  const catalog = principalCatalogs.find(
    (item) => getPrincipal(item).slug === principalSlug
  );

  if (!catalog) {
    return undefined;
  }

  const principal = getPrincipal(catalog);
  const categories = getJsonCatalogCategories(principal.slug);

  return {
    ...principal,
    categories,
    products: categories.flatMap((category) => category.products),
  };
}

export function getJsonCatalogPrincipalSummaries() {
  return principalCatalogs.map((catalog) => {
    const principal = getPrincipal(catalog);
    const categories = getJsonCatalogCategories(principal.slug);

    return {
      ...principal,
      categories,
      products: categories.flatMap((category) => category.products),
    };
  });
}

export function getJsonCatalogProductByPrincipalAndSlug(
  principalSlug,
  productSlug
) {
  return getJsonCatalogProducts().find(
    (product) =>
      product.principalSlug === principalSlug && product.slug === productSlug
  );
}

export function getJsonCatalogProductBySlug(productSlug) {
  return getJsonCatalogProducts().find((product) => product.slug === productSlug);
}
