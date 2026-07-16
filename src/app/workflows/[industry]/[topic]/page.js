import { notFound } from "next/navigation";
import WorkflowExplorer from "@/components/products/WorkflowExplorer";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { topicSlug, workflowIndustries, workflowTopics } from "@/data/homeShowcase";
import { buildDynamicMetadata } from "@/data/pageSeo";
import { buildWorkflowSeo } from "@/lib/workflowContent";

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

  const seo = buildWorkflowSeo({ activeIndustry, activeTopic, industry, topic });

  return buildDynamicMetadata({
    path: `/workflows/${industry}/${topic}`,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
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
    <main className="bg-parchment-alt min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd trail={trail} />
      <PageBreadcrumbs trail={trail} />
      <WorkflowExplorer industry={industry} topicSlug={topic} />
    </main>
  );
}
