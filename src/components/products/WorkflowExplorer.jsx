import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import WorkflowProblemProductPanel from "@/components/products/WorkflowProblemProductPanel";
import { topicSlug, workflowIndustries, workflowTopics } from "@/data/homeShowcase";
import {
  getProblemProductGroups,
  mergeWorkflowContent,
} from "@/lib/workflowContent";

function IndustryTabs({ activeCat }) {
  return (
    <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Industries">
      {workflowIndustries.map((item) => (
        <Link
          key={item.cat}
          href={`/workflows/${item.cat}`}
          role="tab"
          aria-selected={item.cat === activeCat}
          className={`inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
            item.cat === activeCat
              ? "border-red bg-red text-parchment"
              : "border-line-light bg-white text-ink-soft hover:border-red/40 hover:text-red"
          }`}
        >
          <WorkflowIcon cat={item.cat} className="h-3.5 w-3.5" />
          {item.industry}
        </Link>
      ))}
    </div>
  );
}

function WorkflowDetail({ activeIndustry, topics, activeTopic }) {
  const topicIndex = topics.indexOf(activeTopic);
  const workflowContent = mergeWorkflowContent(activeIndustry, activeTopic);
  const problemGroups = getProblemProductGroups(workflowContent);
  const productSearchTerm = workflowContent.productQueryTags[0] ?? activeTopic.tag;

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
      <IndustryTabs activeCat={activeIndustry.cat} />

      <Link
        href={`/workflows/${activeIndustry.cat}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-red"
      >
        Back to workflows
      </Link>

      <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
        Workflow #{topicIndex + 1} / {activeIndustry.industry}
      </p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
        {activeTopic.title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">{activeTopic.desc}</p>

      <WorkflowProblemProductPanel
        problemGroups={problemGroups}
        productSearchHref={`/products?q=${encodeURIComponent(productSearchTerm)}`}
      />
    </div>
  );
}

function WorkflowList({ activeIndustry, topics }) {
  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
      <IndustryTabs activeCat={activeIndustry.cat} />

      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-red">Top workflows</p>
      <h2 className="mt-1 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
        {activeIndustry.industry}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">{activeIndustry.tagline}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, index) => (
          <div
            key={topic.tag}
            className="flex flex-col border border-line-light bg-white p-5 transition hover:-translate-y-0.5 hover:border-red/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-red">#{index + 1}</span>
              <span className="bg-red/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red">
                {topic.tag}
              </span>
            </div>
            <h3 className="text-[15px] font-semibold leading-snug text-ink">
              {topic.title}
            </h3>
            <p className="mt-2 flex-1 text-[13px] text-ink-soft">{topic.desc}</p>
            <Link
              href={`/workflows/${activeIndustry.cat}/${topicSlug(topic.tag)}`}
              className="group mt-5 inline-flex h-10 w-fit items-center gap-2 border border-red bg-red px-4 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(201,0,22,0.14)] transition hover:-translate-y-0.5 hover:bg-red-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            >
              <span>Open workflow</span>
              <FiArrowRight
                aria-hidden="true"
                className="text-sm transition-transform group-hover:translate-x-0.5"
              />
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
