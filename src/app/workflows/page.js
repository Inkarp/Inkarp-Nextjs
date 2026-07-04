import WorkflowIndustryGrid from "@/components/products/WorkflowIndustryGrid";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/workflows");

export default function WorkflowsIndexPage() {
  return (
    <main className="bg-white dark:bg-zinc-950 min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd path="/workflows" />
      <PageBreadcrumbs path="/workflows" />

      <section className="border-b border-line-light dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-center gap-2 text-center">
          <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-red">Workflows</p>
          <h1 className="font-maxot text-3xl text-zinc-950 dark:text-zinc-100 sm:text-4xl">
            Lab workflows, industry by industry
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft dark:text-zinc-400">
            Pick an industry to see its top lab workflows and the Inkarp instruments that support each one.
            Hover a card to preview its workflows, or open one directly.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <WorkflowIndustryGrid />
      </div>
    </main>
  );
}
