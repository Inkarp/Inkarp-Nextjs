import RecTag from "./RecTag";
import { clientReviews } from "@/data/homeSections";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function HomeQuoteWall() {
  return (
    <section className="bg-parchment-alt px-4 py-16 sm:px-6 lg:px-8 lg:py-20" id="voices" data-reveal>
      <div className="mx-auto max-w-[1180px]">
        <RecTag>In Their Words</RecTag>
        <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
          What our customers tell us directly
        </h2>
        <p className="mt-3 max-w-xl text-sm text-ink-soft">
          Unfiltered notes from the labs and engineers we work with every day.
        </p>

        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {clientReviews.slice(0, 6).map((review) => (
            <div className="flex flex-col" key={review.name}>
              <div className="relative rounded-xl bg-white p-6 pb-8 shadow-lg">
                <span
                  aria-hidden="true"
                  className="font-maxot absolute left-5 top-1 text-4xl leading-none text-line-light"
                >
                  &ldquo;
                </span>
                <p className="relative text-sm leading-6 text-ink-soft">{review.message}</p>
                <span
                  aria-hidden="true"
                  className="font-maxot absolute bottom-0 right-5 text-4xl leading-none text-line-light"
                >
                  &rdquo;
                </span>
                <span className="absolute -bottom-2.5 left-9 h-5 w-5 rotate-45 bg-white" />
              </div>

              <div className="ml-9 mt-6 flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red text-sm font-bold text-white ring-4 ring-parchment-alt">
                  {getInitials(review.name)}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink">
                    {review.name}
                  </p>
                  <p className="text-xs text-ink-soft">Inkarp Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
