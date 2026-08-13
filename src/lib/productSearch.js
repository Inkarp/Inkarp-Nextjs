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
