import workflowCatalog from "@/data/workflowCatalog.json";
import { topicSlug } from "@/data/homeShowcase";
import { getAllProducts, searchProducts } from "@/data/products/principals";

const MAX_PROBLEM_PRODUCTS = 8;
const MAX_WORKFLOW_PRODUCTS = 12;

export function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

export function normalizeTag(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLowerCase()
    .trim();
}

export function normalizeTags(values) {
  return [...new Set(toArray(values).flat().map(normalizeTag).filter(Boolean))];
}

export function formatWorkflowTag(tag) {
  return String(tag)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function uniqueProducts(products) {
  const seen = new Set();

  return products.filter((product) => {
    const key = `${product.principalSlug}-${product.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniqueByTitle(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = normalizeTag(item.title ?? item.problem ?? item.solution);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getWorkflowCatalogEntry(activeIndustry, activeTopic) {
  const topicKey = activeTopic
    ? `${activeIndustry.cat}/${topicSlug(activeTopic.tag)}`
    : activeIndustry.cat;

  return {
    topicKey,
    defaults: workflowCatalog.defaults ?? {},
    industry: workflowCatalog.industries?.[activeIndustry.cat] ?? {},
    topic: activeTopic ? workflowCatalog.topics?.[topicKey] ?? {} : {},
  };
}

export function mergeWorkflowContent(activeIndustry, activeTopic) {
  const { topicKey, defaults, industry, topic } = getWorkflowCatalogEntry(
    activeIndustry,
    activeTopic
  );

  // `defaults` is a genuine fallback, not an extra card: it only applies when
  // neither the topic nor the industry supplies any problem/solution content.
  // Appending it unconditionally put a "not yet mapped to a product set"
  // placeholder on every workflow page, including fully populated ones.
  const authored = uniqueByTitle([
    ...toArray(topic.problemSolutions),
    ...toArray(industry.problemSolutions),
  ]);

  const problemSolutions = authored.length
    ? authored
    : uniqueByTitle(toArray(defaults.problemSolutions));

  return {
    topicKey,
    seo: {
      ...(defaults.seo ?? {}),
      ...(industry.seo ?? {}),
      ...(topic.seo ?? {}),
    },
    workflowTags: [
      activeTopic?.tag,
      activeTopic?.title,
      ...toArray(defaults.workflowTags),
      ...toArray(industry.workflowTags),
      ...toArray(topic.workflowTags),
    ],
    industryTags: [
      activeIndustry.cat,
      activeIndustry.industry,
      ...toArray(industry.industryTags),
      ...toArray(topic.industryTags),
    ],
    problemSolutionTags: [
      ...toArray(defaults.problemSolutionTags),
      ...toArray(industry.problemSolutionTags),
      ...toArray(topic.problemSolutionTags),
      ...problemSolutions.flatMap((item) => toArray(item.tags)),
      ...problemSolutions.flatMap((item) => toArray(item.productTags)),
    ],
    productQueryTags: [
      ...toArray(topic.productQueryTags),
      ...toArray(industry.productQueryTags),
      activeTopic?.tag,
      activeIndustry.cat,
    ],
    problemSolutions,
  };
}

function countMatches(productTags, targetTags) {
  const targets = new Set(targetTags);
  return productTags.filter((tag) => targets.has(tag)).length;
}

function productTagSet(product) {
  return {
    workflow: normalizeTags(product.workflowTags),
    industry: normalizeTags(product.industryTags),
    problem: normalizeTags(product.problemSolutionTags),
    general: normalizeTags([
      product.category,
      product.industry,
      product.applications,
      product.tags,
      product.searchTags,
    ]),
  };
}

function scoreProduct(product, target) {
  const productTags = productTagSet(product);
  const workflowTags = normalizeTags(target.workflowTags);
  const industryTags = normalizeTags(target.industryTags);
  const problemTags = normalizeTags(target.problemSolutionTags);
  const productTagsTarget = normalizeTags(target.productTags);

  return (
    countMatches(productTags.workflow, productTagsTarget) * 12 +
    countMatches(productTags.problem, productTagsTarget) * 10 +
    countMatches(productTags.general, productTagsTarget) * 6 +
    countMatches(productTags.workflow, workflowTags) * 5 +
    countMatches(productTags.problem, problemTags) * 4 +
    countMatches(productTags.industry, industryTags) * 2 +
    countMatches(productTags.general, workflowTags) +
    countMatches(productTags.general, problemTags)
  );
}

function getCuratedProducts(productSlugs) {
  const slugs = new Set(toArray(productSlugs));
  if (!slugs.size) return [];

  return getAllProducts().filter((product) => slugs.has(product.slug));
}

export function getProductsForProblem(workflowContent, problem) {
  const curatedProducts = getCuratedProducts(problem.productSlugs);
  if (curatedProducts.length) {
    return uniqueProducts(curatedProducts).slice(0, MAX_PROBLEM_PRODUCTS);
  }

  const target = {
    industryTags: workflowContent.industryTags,
    workflowTags: [
      ...toArray(workflowContent.workflowTags),
      ...toArray(problem.workflowTags),
      ...toArray(problem.tags),
    ],
    problemSolutionTags: [
      ...toArray(workflowContent.problemSolutionTags),
      ...toArray(problem.problemSolutionTags),
      ...toArray(problem.tags),
      ...toArray(problem.productTags),
    ],
    productTags: [
      ...toArray(problem.productTags),
      ...toArray(problem.tags),
    ],
  };

  const scoredProducts = getAllProducts()
    .map((product) => ({ product, score: scoreProduct(product, target) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .map((item) => item.product);

  if (scoredProducts.length) {
    return uniqueProducts(scoredProducts).slice(0, MAX_PROBLEM_PRODUCTS);
  }

  const queries = [
    ...toArray(problem.productQueryTags),
    ...toArray(workflowContent.productQueryTags),
    ...toArray(problem.tags),
  ];

  return uniqueProducts(queries.flatMap((query) => searchProducts({ q: query }))).slice(
    0,
    MAX_PROBLEM_PRODUCTS
  );
}

export function getProblemProductGroups(workflowContent) {
  return workflowContent.problemSolutions.map((problem, index) => ({
    ...problem,
    index,
    products: getProductsForProblem(workflowContent, problem),
  }));
}

export function getWorkflowProducts(workflowContent) {
  return uniqueProducts(
    getProblemProductGroups(workflowContent).flatMap((problem) => problem.products)
  ).slice(0, MAX_WORKFLOW_PRODUCTS);
}

export function buildWorkflowSeo({ activeIndustry, activeTopic, industry, topic }) {
  if (activeTopic) {
    const workflowContent = mergeWorkflowContent(activeIndustry, activeTopic);
    const firstProblem = workflowContent.problemSolutions[0];
    const tags = normalizeTags([
      activeTopic.tag,
      activeIndustry.industry,
      workflowContent.workflowTags,
      workflowContent.problemSolutionTags,
    ]).slice(0, 12);

    return {
      title:
        workflowContent.seo.title ??
        `${activeTopic.title} - Problems, Solutions & Products | Inkarp`,
      description:
        workflowContent.seo.description ??
        firstProblem?.problem ??
        activeTopic.desc,
      keywords:
        workflowContent.seo.keywords ??
        [...tags, "inkarp lab workflow", "laboratory instruments india"].join(", "),
    };
  }

  const entry = workflowCatalog.industries?.[industry] ?? {};
  const tags = normalizeTags([
    activeIndustry.industry,
    activeIndustry.cat,
    entry.workflowTags,
    entry.problemSolutionTags,
  ]).slice(0, 12);

  return {
    title:
      entry.seo?.title ??
      `${activeIndustry.industry} Lab Workflows - Problems, Solutions & Products | Inkarp`,
    description: entry.seo?.description ?? activeIndustry.tagline,
    keywords:
      entry.seo?.keywords ??
      [...tags, "inkarp workflows", "laboratory instruments india"].join(", "),
  };
}
