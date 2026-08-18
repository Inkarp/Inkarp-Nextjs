import Link from "next/link";
import StepIcon from "@/components/home/StepIcon";

const TOP_H = 58;
const DOT_H = 60;
const BOTTOM_H = 58;

/**
 * The remaining stages of a workflow, drawn with the same icon treatment as the
 * step rail on /workflows — alternating labels above and below the nodes — but
 * without the connecting line, since these are siblings rather than a sequence
 * being walked through.
 */
export default function WorkflowOtherStages({ cat, stages, currentSlug }) {
  const others = stages.filter((s) => s.slug !== currentSlug);
  if (!others.length) return null;

  return (
    <nav aria-label="Other stages in this workflow" className="mt-12 border-t border-line-light pt-6">
      <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
        Other stages in this workflow
      </p>

      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-[860px]" style={{ height: TOP_H + DOT_H + BOTTOM_H }}>
          <div
            className="grid h-full grid-flow-col gap-x-1"
            style={{
              gridTemplateColumns: `repeat(${others.length}, minmax(0,1fr))`,
              gridTemplateRows: `${TOP_H}px ${DOT_H}px ${BOTTOM_H}px`,
            }}
          >
            {others.map((step, i) => {
              const isUp = i % 2 === 0;
              const label = (
                <>
                  <span className="block font-mono text-[11px] text-ink-soft transition-colors group-hover:text-red">
                    {step.number}
                  </span>
                  <span className="block text-[13px] font-semibold leading-tight text-ink underline decoration-line-light decoration-1 underline-offset-2 transition-colors group-hover:text-red group-hover:decoration-red">
                    {step.name}
                  </span>
                </>
              );

              return (
                <Link
                  aria-label={`Stage ${step.number}: ${step.name} — ${step.description}`}
                  className="group contents"
                  href={`/workflows/${cat}/${step.slug}`}
                  key={step.slug}
                  title={step.description}
                >
                  <div
                    className="flex items-end justify-center px-1 text-center"
                    style={{ gridRow: 1, gridColumn: i + 1 }}
                  >
                    {isUp ? label : null}
                  </div>
                  <div
                    className="flex items-center justify-center"
                    style={{ gridRow: 2, gridColumn: i + 1 }}
                  >
                    {/* Gutter painted in the page background, so any rule behind
                        the row stops short of the node. */}
                    <span className="flex items-center justify-center bg-parchment-alt px-3.5">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-all group-hover:-translate-y-0.5 group-hover:shadow-[0_2px_8px_rgba(190,0,16,0.18)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-red ${
                        isUp
                          ? "border-red text-red group-hover:border-red group-hover:bg-red/5"
                          : "border-teal text-teal group-hover:border-teal group-hover:bg-teal/5"
                      }`}
                    >
                      <StepIcon className="h-6 w-6" index={step.index} />
                    </span>
                    </span>
                  </div>
                  <div
                    className="flex items-start justify-center px-1 pt-1 text-center"
                    style={{ gridRow: 3, gridColumn: i + 1 }}
                  >
                    {isUp ? null : label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
