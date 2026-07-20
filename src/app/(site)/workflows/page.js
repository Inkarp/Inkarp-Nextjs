import Link from"next/link";
import { FiBox, FiGitBranch } from"react-icons/fi";
import WorkflowJourneyExplorer from"@/components/products/WorkflowJourneyExplorer";
import PageBreadcrumbs, { BreadcrumbJsonLd } from"@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from"@/data/pageSeo";

export const metadata = buildPageMetadata("/workflows");

const VIEW_TABS = [
  { href:"/products", label:"By Product", active: false, Icon: FiBox },
  { href:"/workflows", label:"By Workflow", active: true, Icon: FiGitBranch },
];

const HOW_TO_WORKFLOW_STEPS = [
  {
    num:"01",
    title:"Choose an industry",
    description:"Start with the lab type, process area, or sample context.",
  },
  {
    num:"02",
    title:"Select a workflow",
    description:"Open the method, task, or application your team needs to run.",
  },
  {
    num:"03",
    title:"Map the instruments",
    description:"See which equipment supports each step of the workflow.",
  },
  {
    num:"04",
    title:"Plan with Inkarp",
    description:"Get help matching brands, capacity, service, and budget.",
  },
];

export default function WorkflowsIndexPage() {
  return (
    <main className="bg-white min-h-screen" data-scroll-skip>
      <BreadcrumbJsonLd path="/workflows" />
      <PageBreadcrumbs path="/workflows" />

      <section className="border-b border-line-light bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-red">
                Laboratory Workflows for Research and Industry
              </p>
              <h1 className="font-maxot mt-3 text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-[64px]">
                Workflows &amp; Solutions
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                Start from the way your lab works, not our product catalogue. Pick an industry,
                follow its process step by step, and land on the instruments built for each
                stage.
              </p>
            </div>

            <div className="inline-flex border border-line-light bg-parchment-alt p-1">
              {VIEW_TABS.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    tab.active
                      ?"bg-red text-parchment"
                      :"text-ink-soft hover:text-red"
                  }`}
                >
                  <tab.Icon aria-hidden className="h-4 w-4" />
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 divide-x divide-line-light border-y border-line-light sm:grid-cols-4">
            {HOW_TO_WORKFLOW_STEPS.map((step) => (
              <div key={step.num} className="px-4 py-5 first:pl-0 sm:px-6">
                <span className="font-mono text-[11px] text-red">{step.num}</span>
                <p className="mt-1.5 text-sm font-semibold text-ink">{step.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment-alt px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-red">
            Step inside the process
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            Pick an industry, follow the workflow
          </h2>

          <div className="mt-8">
            <WorkflowJourneyExplorer />
          </div>
        </div>
      </section>
    </main>
  );
}
