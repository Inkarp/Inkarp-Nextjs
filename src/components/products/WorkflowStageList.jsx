import Link from "next/link";
import { workflowIntros, workflowWheelLinks, workflowWheelSteps } from "@/data/workflowWheel";

/**
 * The eight analytical stages for an industry, from the "Laboratory Analytical
 * Workflows" reference. Each card links to the workflow topic that covers that
 * stage; stages without a dedicated topic fall back to the industry page.
 */
export default function WorkflowStageList({ cat, industry }) {
  const steps = workflowWheelSteps[cat] ?? [];
  const links = workflowWheelLinks[cat] ?? [];
  const intro = workflowIntros[cat];

  if (!steps.length) return null;

  const hrefFor = (i) => (links[i] ? `/workflows/${cat}/${links[i]}` : `/workflows/${cat}`);

  return (
    <section className="border-t border-line-light bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-red">
          The {steps.length}-step workflow
        </p>
        <h2 className="mt-1 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
          How a {industry.toLowerCase()} sample moves through the lab
        </h2>
        {intro ? (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{intro}</p>
        ) : null}

        <ol className="mt-8 grid grid-cols-1 gap-px border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.name} className="bg-white">
              <Link
                href={hrefFor(i)}
                className="group flex h-full flex-col p-5 transition hover:bg-parchment-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red"
                aria-label={`Stage ${i + 1}: ${step.name} — ${step.description}`}
              >
                <span className="font-mono text-[11px] text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-red">
                  {step.name}
                </span>
                <span className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  {step.description}
                </span>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-wide text-ink-soft transition-colors group-hover:text-red">
                  Open workflow →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
