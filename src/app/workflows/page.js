import Link from"next/link";
import { FiBox, FiGitBranch } from"react-icons/fi";
import WorkflowIndustryGrid from"@/components/products/WorkflowIndustryGrid";
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

      <section className="border-b border-line-light bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red">
                Laboratory Workflows for Research and Industry
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Workflows &amp; Solutions
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                Start from the way your lab works: industry, sample type, method, or
                application. Explore practical workflows and the instruments that support each
                step from preparation to analysis.
              </p>
            </div>

            <div className="border border-line-light bg-white p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                {HOW_TO_WORKFLOW_STEPS.map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-4 border border-line-light bg-white p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-red/10 text-sm font-semibold text-red">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-snug text-ink-soft">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center lg:justify-start">
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
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
        <WorkflowIndustryGrid />
      </div>
    </main>
  );
}
