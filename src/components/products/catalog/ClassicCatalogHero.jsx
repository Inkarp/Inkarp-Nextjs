import Link from "next/link";
import RecTag from "@/components/home/RecTag";
import { HOW_TO_FIND_STEPS, VIEW_TABS } from "./catalogCopy";

/** The /products hero as it is today: heading, view buttons and the how-to-find steps. */
export default function ClassicCatalogHero({ brandCount, totalProducts }) {
  return (
        <section className="bg-white px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <RecTag>Scientific Instruments</RecTag>
                <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                  Products and solutions for 
                  <em className="italic text-red"> every lab workflow.</em>
                </h1>
                <p className="my-5 max-w-[560px] text-base leading-relaxed text-ink-soft sm:text-lg">
                  Find the right instrument by product category, application, industry, or
                  principal brand. Built for scientists, lab managers, and procurement teams who
                  need clear choices quickly.
                </p>

                <div className="mt-8 flex flex-wrap gap-3.5">
                  {VIEW_TABS.map((tab) => (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`inline-flex items-center gap-2 border px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
                        tab.active
                          ? "border-red bg-red text-white hover:bg-transparent hover:text-red"
                          : "border-line-light bg-white text-ink hover:border-red hover:text-red"
                      }`}
                    >
                      <tab.Icon aria-hidden className="h-4 w-4" />
                      {tab.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative border border-line-light bg-parchment-alt p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
                <div className="grid gap-3">
                  {HOW_TO_FIND_STEPS.map((step) => (
                    <div key={step.num} className="flex items-start gap-4 border border-line-light bg-white p-4">
                      <span className="text-lg font-semibold leading-none text-red">
                        {step.num}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{step.title}</p>
                        <p className="mt-1 text-sm leading-snug text-ink-soft">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
                  <span>{totalProducts} products indexed</span>
                  <span>{brandCount} principal brands</span>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}
