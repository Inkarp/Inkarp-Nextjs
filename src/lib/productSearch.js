function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .trim();
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
  return normalizeSearchValue(
    flattenSearchValues([
      product.name,
      product.slug,
      product.principalName,
      product.principalSlug,
      product.countryOfOrigin,
      getCountryAliases(product.countryOfOrigin),
      product.industry,
      product.category,
      product.applications,
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
}

export function productMatchesSearch(product, query) {
  const terms = normalizeSearchValue(query).split(" ").filter(Boolean);

  if (!terms.length) {
    return true;
  }

  const searchableText = getProductSearchText(product);

  return terms.every((term) => searchableText.includes(term));
}
