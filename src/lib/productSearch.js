const productSearchTextCache = new WeakMap();

function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .trim();
}

function normalizeCompactSearchValue(value) {
  return normalizeSearchValue(value).replace(/\s+/g, "");
}

function flattenSearchValues(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenSearchValues);
  }

  if (typeof value === "object") {
    return Object.values(value).flatMap(flattenSearchValues);
  }

  return [value];
}

function getCountryAliases(countryOfOrigin) {
  const country = normalizeSearchValue(countryOfOrigin);
  const aliases = [];

  if (country.includes("united states")) {
    aliases.push("USA", "US", "America");
  }

  if (country.includes("united kingdom")) {
    aliases.push("UK", "Britain", "England");
  }

  if (country.includes("czech republic")) {
    aliases.push("Czechia");
  }

  return aliases;
}

export function getProductSearchText(product) {
  if (typeof product === "object" && product !== null) {
    const cachedText = productSearchTextCache.get(product);

    if (cachedText) {
      return cachedText;
    }
  }

  const searchText = normalizeSearchValue(
    flattenSearchValues([
      product.name,
      product.slug,
      product.principalName,
      product.principalSlug,
      product.countryOfOrigin,
      getCountryAliases(product.countryOfOrigin),
      product.industry,
      product.category,
      product.processApplication,
      product.applications,
      product.synonymUseCaseKeywords,
      product.searchKeywords,
      product.industryTags,
      product.workflowTags,
      product.problemSolutionTags,
      product.tags,
      product.searchTags,
      product.keywords,
      product.overview,
      product.metaTitle,
      product.metaDescription,
      product.features,
      product.technicalSpecs,
      product.caseStudies,
      product.faqs,
    ]).join(" ")
  );

  if (typeof product === "object" && product !== null) {
    productSearchTextCache.set(product, searchText);
  }

  return searchText;
}

export function productMatchesSearch(product, query) {
  const normalizedQuery = normalizeSearchValue(query);
  const terms = normalizedQuery.split(" ").filter(Boolean);

  if (!terms.length) {
    return true;
  }

  const searchableText = getProductSearchText(product);
  const compactSearchableText = normalizeCompactSearchValue(searchableText);
  const compactQuery = normalizeCompactSearchValue(query);

  if (compactQuery && compactSearchableText.includes(compactQuery)) {
    return true;
  }

  return terms.every((term) => {
    const compactTerm = normalizeCompactSearchValue(term);

    return (
      searchableText.includes(term) ||
      (compactTerm && compactSearchableText.includes(compactTerm))
    );
  });
}

// How directly a product's own name answers the query: its exact name or slug
// first, then a name that starts with it, then a name holding it as a word.
// Matching alone is unranked, so a short name like "RIMA" sat behind every
// product whose text mentions "primary" and fell off the first page.
export function productSearchRank(product, query) {
  const q = normalizeSearchValue(query);
  if (!q) return 0;
  const name = normalizeSearchValue(product.name);
  if (name === q || normalizeSearchValue(product.slug) === q) return 4;
  if (name.startsWith(`${q} `)) return 3;
  if (` ${name} `.includes(` ${q} `)) return 2;
  if (normalizeCompactSearchValue(product.name).includes(normalizeCompactSearchValue(q))) return 1;
  return 0;
}

/** Products in search order: best name matches first, otherwise unchanged. */
export function sortBySearchRank(products, query) {
  if (!normalizeSearchValue(query)) return products;
  return products
    .map((product, index) => [product, productSearchRank(product, query), index])
    .sort((a, b) => b[1] - a[1] || a[2] - b[2])
    .map(([product]) => product);
}
