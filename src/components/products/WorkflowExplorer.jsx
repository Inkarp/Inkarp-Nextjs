import Link from "next/link";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import ProductResultsGrid from "@/components/products/ProductResultsGrid";
import { workflowIndustries, workflowTopics } from "@/data/homeShowcase";
import { searchProducts } from "@/data/products/principals";

function buildHref(params) {
  const search = new URLSearchParams(params);
  return `/products?${search.toString()}`;
}

export default function WorkflowExplorer({ industry, topicTag }) {
  const activeIndustry =
    workflowIndustries.find((item) => item.cat === industry) ?? workflowIndustries[0];
  const topics = workflowTopics[activeIndustry.cat] ?? [];
  const activeTopic = topics.find((topic) => topic.tag === topicTag) ?? null;
  // Topic tags are often multi-word and can be too specific to match our product
  // metadata (search requires every term to hit) — fall back to the broader
  // industry term so a topic click always surfaces relevant products.
  const topicMatches = activeTopic ? searchProducts({ q: activeTopic.tag }) : [];
  const matchingProducts = activeTopic
    ? topicMatches.length
      ? topicMatches
      : searchProducts({ q: activeIndustry.cat })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Industries">
        {workflowIndustries.map((item) => (
          <Link
            key={item.cat}
            href={buildHref({ view: "workflow", industry: item.cat })}
            role="tab"
            aria-selected={item.cat === activeIndustry.cat}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              item.cat === activeIndustry.cat
                ? "border-red bg-red text-white"
                : "border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            <WorkflowIcon cat={item.cat} className="h-3.5 w-3.5" />
            {item.industry}
          </Link>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-ink dark:text-zinc-100">{activeIndustry.industry}</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft dark:text-zinc-400">{activeIndustry.tagline}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const selected = activeTopic?.tag === topic.tag;

          return (
            <Link
              key={topic.tag}
              href={buildHref({ view: "workflow", industry: activeIndustry.cat, topic: topic.tag })}
              className={`flex flex-col gap-2 rounded-xl border p-5 transition hover:-translate-y-0.5 ${
                selected
                  ? "border-red bg-red/5"
                  : "border-line-light bg-white hover:border-red/40 dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-red">{topic.tag}</span>
              <h3 className="text-[15px] font-semibold leading-snug text-ink dark:text-zinc-100">
                {topic.title}
              </h3>
              <p className="flex-1 text-[13px] text-ink-soft dark:text-zinc-400">{topic.desc}</p>
              <span className="self-start text-[11px] font-semibold uppercase tracking-wide text-red">
                {selected ? "Viewing products ↓" : "See matching products →"}
              </span>
            </Link>
          );
        })}
      </div>

      {activeTopic ? (
        <div className="mt-10 border-t border-line-light pt-8 dark:border-zinc-800">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-ink dark:text-zinc-100">
              Products for &ldquo;{activeTopic.title}&rdquo;
            </h3>
            <span className="text-xs uppercase tracking-wide text-ink-soft dark:text-zinc-500">
              {matchingProducts.length} match{matchingProducts.length === 1 ? "" : "es"}
            </span>
          </div>
          <ProductResultsGrid
            products={matchingProducts}
            emptyHref={buildHref({ view: "workflow", industry: activeIndustry.cat })}
            emptyLinkLabel="Back to workflow topics"
          />
        </div>
      ) : (
        <p className="mt-10 border-t border-line-light pt-6 text-sm text-ink-soft dark:border-zinc-800 dark:text-zinc-400">
          Pick a topic above to see the Inkarp products that support it.
        </p>
      )}
    </div>
  );
}
