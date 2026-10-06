import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import WorkflowIcon from "@/components/home/WorkflowIcon";
import { workflowIndustries } from "@/data/homeShowcase";
import { workflowIntros, stagesWithSlugs } from "@/data/workflowWheel";

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

function WorkflowList({ activeIndustry }) {
  // The eight document stages replace the old six hand-written topic cards.
  const cat = activeIndustry.cat;
  const stages = stagesWithSlugs(cat);

  // Every stage has its own page of challenges, solutions and instruments.
  const hrefFor = (i) => `/workflows/${cat}/${stages[i].slug}`;

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
      <IndustryTabs activeCat={activeIndustry.cat} />

      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-red">Top workflows</p>
      <h1 className="mt-1 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
        {activeIndustry.industry} laboratory workflows
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-ink-soft">
        {workflowIntros[activeIndustry.cat] ?? activeIndustry.tagline}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((stage, index) => (
          <div
            key={stage.name}
            className="flex flex-col border border-line-light bg-white p-5 transition hover:-translate-y-0.5 hover:border-red/40"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-red">
                #{String(index + 1).padStart(2, "0")}
              </span>
              <span className="bg-red/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red">
                Challenges &amp; solutions
              </span>
            </div>
            <h3 className="text-[15px] font-semibold leading-snug text-ink">
              {stage.name}
            </h3>
            <p className="mt-2 flex-1 text-[13px] text-ink-soft">{stage.description}</p>
            <Link
              href={hrefFor(index)}
              className="group mt-5 inline-flex h-10 w-fit items-center gap-2 border border-rose-200 bg-rose-50 px-4 text-xs font-semibold text-rose-700 shadow-[0_8px_18px_rgba(201,0,22,0.14)] transition hover:-translate-y-0.5 hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
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

export default function WorkflowExplorer({ industry }) {
  const activeIndustry =
    workflowIndustries.find((item) => item.cat === industry) ?? workflowIndustries[0];

  return <WorkflowList activeIndustry={activeIndustry} />;
}
