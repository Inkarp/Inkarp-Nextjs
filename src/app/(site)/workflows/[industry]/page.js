import { notFound } from "next/navigation";
import WorkflowExplorer from "@/components/products/WorkflowExplorer";
import WorkflowStageList from "@/components/products/WorkflowStageList";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { workflowIndustries } from "@/data/homeShowcase";
import { buildDynamicMetadata } from "@/data/pageSeo";
import { buildWorkflowSeo } from "@/lib/workflowContent";

export async function generateMetadata({ params }) {
  const { industry } = await params;
  const activeIndustry = workflowIndustries.find((item) => item.cat === industry);
  if (!activeIndustry) return { title: "Workflow Not Found - Inkarp" };

  const seo = buildWorkflowSeo({ activeIndustry, industry });

  return buildDynamicMetadata({
    path: `/workflows/${industry}`,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export function generateStaticParams() {
  return workflowIndustries.map((item) => ({ industry: item.cat }));
}

export default async function WorkflowIndustryPage({ params }) {
  const { industry } = await params;
  const activeIndustry = workflowIndustries.find((item) => item.cat === industry);
  if (!activeIndustry) notFound();

  const trail = [
    { label: "Workflows", href: "/workflows" },
    { label: activeIndustry.industry, href: `/workflows/${industry}` },
  ];

  return (
    <main className="bg-parchment-alt min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd trail={trail} />
      <PageBreadcrumbs trail={trail} />
      <WorkflowExplorer industry={industry} />
      <WorkflowStageList cat={industry} industry={activeIndustry.industry} />
    </main>
  );
}
