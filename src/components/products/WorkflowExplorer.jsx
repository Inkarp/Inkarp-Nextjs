import Link from "next/link";
import ChallengeAccordion from "@/components/products/ChallengeAccordion";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import { topicSlug, workflowIndustries, workflowTopics } from "@/data/homeShowcase";
import { searchProducts } from "@/data/products/principals";

const CHALLENGE_SLOTS = 10;
const MAX_INSTRUMENTS_SHOWN = 9;

function IndustryTabs({ activeCat }) {
  return (
    <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Industries">
      {workflowIndustries.map((item) => (
        <Link
          key={item.cat}
          href={`/workflows/${item.cat}`}
          role="tab"
          aria-selected={item.cat === activeCat}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
            item.cat === activeCat
              ? "border-red bg-red text-white"
              : "border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-red dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          }`}
        >
          <WorkflowIcon cat={item.cat} className="h-3.5 w-3.5" />
          {item.industry}
        </Link>
      ))}
    </div>
  );
}

// Workflow detail screen: one topic's description plus the real products that support it.
function WorkflowDetail({ activeIndustry, topics, activeTopic }) {
  const topicMatches = searchProducts({ q: activeTopic.tag });
  // Topic tags are narrow multi-word phrases that often match zero real products
  // (search requires every term to hit) — fall back to the broader industry term
  // so opening a workflow always surfaces relevant products.
  const matchingProducts = topicMatches.length ? topicMatches : searchProducts({ q: activeIndustry.cat });
  const topicIndex = topics.indexOf(activeTopic);

  // Only this workflow's own topic is real content — the remaining slots mirror
  // the reference's "to be added" placeholder pattern until more challenges are written.
  const challenges = Array.from({ length: CHALLENGE_SLOTS }, (_, index) => {
    if (index === 0) {
      return {
        title: activeTopic.title,
        solution: activeTopic.desc,
        products: matchingProducts.slice(0, MAX_INSTRUMENTS_SHOWN),
        empty: false,
      };
    }

    return { title: `Challenge ${index + 1} — to be added`, empty: true };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <IndustryTabs activeCat={activeIndustry.cat} />

      <Link
        href={`/workflows/${activeIndustry.cat}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-red"
      >
        ← Back to workflows
      </Link>

      <p className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-zinc-500">
        Workflow #{topicIndex + 1} · {activeIndustry.industry}
      </p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink dark:text-zinc-100 sm:text-3xl">
        {activeTopic.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft dark:text-zinc-400">{activeTopic.desc}</p>

      <div className="mt-8 border-t border-line-light pt-8 dark:border-zinc-800">
        <ChallengeAccordion challenges={challenges} />
      </div>
    </div>
  );
}

// Workflow list screen: the industry's top workflows, ranked, each opening its own detail screen.
function WorkflowList({ activeIndustry, topics }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <IndustryTabs activeCat={activeIndustry.cat} />

      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-red">Top workflows</p>
      <h2 className="mt-1 text-2xl font-semibold leading-tight text-ink dark:text-zinc-100 sm:text-3xl">
        {activeIndustry.industry}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft dark:text-zinc-400">{activeIndustry.tagline}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, index) => (
          <div
            key={topic.tag}
            className="flex flex-col rounded-xl border border-line-light bg-white p-5 transition hover:-translate-y-0.5 hover:border-red/40 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-red">#{index + 1}</span>
              <span className="rounded-full bg-red/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red">
                {topic.tag}
              </span>
            </div>
            <h3 className="text-[15px] font-semibold leading-snug text-ink dark:text-zinc-100">
              {topic.title}
            </h3>
            <p className="mt-2 flex-1 text-[13px] text-ink-soft dark:text-zinc-400">{topic.desc}</p>
            <Link
              href={`/workflows/${activeIndustry.cat}/${topicSlug(topic.tag)}`}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-red px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#9f000d]"
            >
              Open workflow →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkflowExplorer({ industry, topicSlug: activeTopicSlug }) {
  const activeIndustry =
    workflowIndustries.find((item) => item.cat === industry) ?? workflowIndustries[0];
  const topics = workflowTopics[activeIndustry.cat] ?? [];
  const activeTopic = activeTopicSlug
    ? topics.find((topic) => topicSlug(topic.tag) === activeTopicSlug) ?? null
    : null;

  return activeTopic ? (
    <WorkflowDetail activeIndustry={activeIndustry} topics={topics} activeTopic={activeTopic} />
  ) : (
    <WorkflowList activeIndustry={activeIndustry} topics={topics} />
  );
}
