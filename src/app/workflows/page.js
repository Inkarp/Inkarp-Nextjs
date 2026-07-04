import Link from "next/link";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import { workflowIndustries } from "@/data/homeShowcase";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/workflows");

export default function WorkflowsIndexPage() {
  return (
    <main className="bg-parchment-alt dark:bg-zinc-950 min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd path="/workflows" />
      <PageBreadcrumbs path="/workflows" />

      <section className="border-b border-line-light dark:border-zinc-800 bg-parchment dark:bg-zinc-900 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-center gap-2 text-center">
          <p className="font-maxot text-xs font-semibold uppercase tracking-widest text-red">Workflows</p>
          <h1 className="font-maxot text-3xl text-zinc-950 dark:text-zinc-100 sm:text-4xl">
            Lab workflows, industry by industry
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft dark:text-zinc-400">
            Pick an industry to see its top lab workflows and the Inkarp instruments that support each one.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflowIndustries.map((item) => (
            <Link
              key={item.cat}
              href={`/workflows/${item.cat}`}
              className="flex flex-col gap-3 rounded-xl border border-line-light bg-white p-5 transition hover:-translate-y-0.5 hover:border-red/40 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <WorkflowIcon cat={item.cat} className="h-8 w-8 text-red" />
              <h2 className="text-[15px] font-semibold leading-snug text-ink dark:text-zinc-100">
                {item.industry}
              </h2>
              <p className="flex-1 text-[13px] text-ink-soft dark:text-zinc-400">{item.tagline}</p>
              <span className="w-fit rounded-full bg-red/10 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-red">
                {item.steps}-Step Workflow
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
