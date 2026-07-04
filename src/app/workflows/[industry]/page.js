import { notFound } from "next/navigation";
import WorkflowExplorer from "@/components/products/WorkflowExplorer";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { workflowIndustries } from "@/data/homeShowcase";
import { buildDynamicMetadata } from "@/data/pageSeo";

export async function generateMetadata({ params }) {
  const { industry } = await params;
  const activeIndustry = workflowIndustries.find((item) => item.cat === industry);
  if (!activeIndustry) return { title: "Workflow Not Found - Inkarp" };

  return buildDynamicMetadata({
    path: `/workflows/${industry}`,
    title: `${activeIndustry.industry} Lab Workflows — Inkarp Instruments`,
    description: activeIndustry.tagline,
    keywords: `${activeIndustry.industry.toLowerCase()} lab workflow, ${activeIndustry.cat} laboratory instruments, inkarp ${activeIndustry.cat}`,
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
    <main className="bg-parchment-alt dark:bg-zinc-950 min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd trail={trail} />
      <PageBreadcrumbs trail={trail} />
      <WorkflowExplorer industry={industry} />
    </main>
  );
}
