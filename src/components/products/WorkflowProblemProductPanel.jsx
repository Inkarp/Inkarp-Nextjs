"use client";

import { useState } from "react";
import Link from "next/link";
import PrincipalLogo from "@/components/products/PrincipalLogo";

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function getBrandCount(products) {
  return uniqueValues(products.map((product) => product.principalName)).length;
}

function ProductInstrumentCard({ product }) {
  return (
    <Link
      href={product.href}
      className="group flex min-h-[116px] flex-col justify-between rounded-lg border border-line-light bg-white p-5 transition hover:border-red/50 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]"
    >
      <div>
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink group-hover:text-red">
          {product.name}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-6 items-center rounded-full bg-red/10 px-2.5 py-0.5 text-[11px] font-medium text-red">
            <PrincipalLogo
              className="h-4 max-w-24 object-contain text-[11px] font-medium text-red"
              principalName={product.principalName}
              principalSlug={product.principalSlug}
            />
          </span>
          {product.countryOfOrigin ? (
            <span className="inline-flex min-h-6 items-center rounded-full border border-line-light bg-parchment-alt px-2.5 py-0.5 text-[11px] text-ink-soft">
              {product.countryOfOrigin}
            </span>
          ) : null}
        </div>
      </div>
      <span className="mt-4 font-mono text-xs font-semibold text-red">View product -&gt;</span>
    </Link>
  );
}

export default function WorkflowProblemProductPanel({ problemGroups }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!problemGroups.length) return null;

  return (
    <section className="mt-10">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-soft">
        Top {problemGroups.length} challenges &amp; solutions
      </p>

      <div className="mt-4 space-y-3">
        {problemGroups.map((item, index) => {
          const isOpen = index === openIndex;
          const brandCount = getBrandCount(item.products);

          return (
            <article
              key={`${item.title}-${index}`}
              className={`overflow-hidden rounded-lg border bg-white transition ${
                isOpen ? "border-red" : "border-line-light"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                aria-expanded={isOpen}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                    isOpen ? "bg-red" : "bg-black"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="flex-1 text-lg font-semibold leading-tight text-ink sm:text-xl">
                  {item.title}
                </span>
                <span className="font-mono text-xs font-semibold text-red" aria-hidden="true">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen ? (
                <div className="px-5 pb-6 sm:px-6">
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-lg border border-red/20 bg-red/10 p-5 sm:p-6">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-red">
                        Challenge
                      </p>
                      <p className="mt-4 text-base leading-7 text-ink-soft">
                        {item.problem}
                      </p>
                    </div>

                    <div className="rounded-lg border border-line-light bg-white p-5 sm:p-6 lg:border-l-red">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-red">
                        Solution
                      </p>
                      <p className="mt-4 text-base leading-7 text-ink-soft">
                        {item.solution}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                        Supported instruments
                      </p>
                      {brandCount ? (
                        <span className="rounded-full bg-parchment-alt px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                          {brandCount} {brandCount === 1 ? "brand" : "brands"}
                        </span>
                      ) : null}
                    </div>

                    {item.products.length ? (
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {item.products.map((product) => (
                          <ProductInstrumentCard
                            key={`${product.principalSlug}-${product.slug}`}
                            product={product}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-line-light bg-parchment-alt p-5 font-mono text-xs text-ink-soft">
                        Add product tags or product slugs in the workflow JSON to connect supported instruments.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}