import { posts } from "@/data/blogs";
import { catalystCards } from "@/data/catalystCue";
import { pageSeo, SITE_URL } from "@/data/pageSeo";
import { getAllProducts } from "@/data/products/principals";
import { workflowIndustries } from "@/data/homeShowcase";
import { stagesWithSlugs } from "@/data/workflowWheel";

const STATIC_ROUTES = [
  ...Object.keys(pageSeo),
  "/privacy-policy",
  "/terms-and-conditions",
];

function absoluteUrl(path) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

function entry(path, options = {}) {
  return {
    url: absoluteUrl(path),
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency ?? "weekly",
    priority: options.priority ?? 0.7,
  };
}

function parseDate(value) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default function sitemap() {
  const staticEntries = STATIC_ROUTES.map((path) =>
    entry(path, {
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : 0.75,
    })
  );

  const productEntries = getAllProducts()
    .filter((product) => product?.slug)
    .map((product) =>
      entry(`/products/${product.slug}`, {
        changeFrequency: "weekly",
        priority: 0.85,
      })
    );

  const blogEntries = posts
    .filter((post) => post?.slug)
    .map((post) =>
      entry(`/blog/${post.slug}`, {
        lastModified: parseDate(post.date),
        changeFrequency: "monthly",
        priority: 0.65,
      })
    );

  const magazineEntries = catalystCards
    .filter((card) => card?.slug)
    .map((card) =>
      entry(`/magazine/${card.slug}`, {
        changeFrequency: "monthly",
        priority: 0.6,
      })
    );

  const workflowIndustryEntries = workflowIndustries.map((industry) =>
    entry(`/workflows/${industry.cat}`, {
      changeFrequency: "monthly",
      priority: 0.75,
    })
  );

  // One page per workflow stage: nine industries x eight stages.
  const workflowTopicEntries = workflowIndustries.flatMap((industry) =>
    stagesWithSlugs(industry.cat).map((stage) =>
      entry(`/workflows/${industry.cat}/${stage.slug}`, {
        changeFrequency: "monthly",
        priority: 0.7,
      })
    )
  );

  return [
    ...staticEntries,
    ...productEntries,
    ...blogEntries,
    ...magazineEntries,
    ...workflowIndustryEntries,
    ...workflowTopicEntries,
  ];
}
