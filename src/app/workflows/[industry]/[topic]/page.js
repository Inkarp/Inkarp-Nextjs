import { notFound } from "next/navigation";
import WorkflowExplorer from "@/components/products/WorkflowExplorer";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { topicSlug, workflowIndustries, workflowTopics } from "@/data/homeShowcase";
import { buildDynamicMetadata } from "@/data/pageSeo";

function resolve(industry, topic) {
  const activeIndustry = workflowIndustries.find((item) => item.cat === industry);
  if (!activeIndustry) return {};
  const topics = workflowTopics[activeIndustry.cat] ?? [];
  const activeTopic = topics.find((t) => topicSlug(t.tag) === topic);
  return { activeIndustry, activeTopic };
}

export async function generateMetadata({ params }) {
  const { industry, topic } = await params;
  const { activeIndustry, activeTopic } = resolve(industry, topic);
  if (!activeIndustry || !activeTopic) return { title: "Workflow Not Found - Inkarp" };

  return buildDynamicMetadata({
    path: `/workflows/${industry}/${topic}`,
    title: `${activeTopic.title} — Inkarp Instruments`,
    description: activeTopic.desc,
    keywords: `${activeTopic.tag}, ${activeIndustry.industry.toLowerCase()}, inkarp lab workflow`,
  });
}

export function generateStaticParams() {
  return workflowIndustries.flatMap((item) =>
    (workflowTopics[item.cat] ?? []).map((topic) => ({
      industry: item.cat,
      topic: topicSlug(topic.tag),
    }))
  );
}

export default async function WorkflowTopicPage({ params }) {
  const { industry, topic } = await params;
  const { activeIndustry, activeTopic } = resolve(industry, topic);
  if (!activeIndustry || !activeTopic) notFound();

  const trail = [
    { label: "Workflows", href: "/workflows" },
    { label: activeIndustry.industry, href: `/workflows/${industry}` },
    { label: activeTopic.title, href: `/workflows/${industry}/${topic}` },
  ];

  return (
    <main className="bg-parchment-alt dark:bg-zinc-950 min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd trail={trail} />
      <PageBreadcrumbs trail={trail} />
      <WorkflowExplorer industry={industry} topicSlug={topic} />
    </main>
  );
}
