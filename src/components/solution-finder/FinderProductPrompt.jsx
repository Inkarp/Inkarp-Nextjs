"use client";

import { FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

/**
 * Product pages carry no site-wide finder stripe — it would push the product
 * itself down. This in-page prompt sits after the details instead, for the
 * visitor who has read about the product and is still unsure it fits.
 * `objective` ({ value, label }) pre-selects the interest the product serves.
 */
export default function FinderProductPrompt({ objective, productName }) {
  const open = () => {
    window.dispatchEvent(new CustomEvent("inkarp:open-solution-finder", {
      detail: { objective, source: "product-page" },
    }));
  };

  return (
    <section className="bg-white px-4 py-10 print:hidden sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 rounded-[24px] border border-fuchsia-300/35 bg-[radial-gradient(circle_at_12%_20%,rgba(168,85,247,.34),transparent_26%),radial-gradient(circle_at_88%_75%,rgba(236,72,153,.26),transparent_28%),linear-gradient(110deg,#100822_0%,#24114a_48%,#0d1938_100%)] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-fuchsia-400/15 text-xl text-fuchsia-200 shadow-[0_0_24px_rgba(232,121,249,.28)]">
          <HiSparkles aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Not sure this is the right model?</h2>
          <p className="mt-1 text-sm leading-6 text-white/70">
            Tell us where you work and what you need{objective ? ` for ${objective.label.toLowerCase()}` : ""}.
            We&apos;ll match a shortlist of instruments, including alternatives to the {productName}.
          </p>
        </div>
        <button
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#7c3aed,#c026d3_55%,#ec4899)] px-6 text-sm font-bold text-white shadow-[0_10px_28px_rgba(192,38,211,.35)] transition hover:-translate-y-0.5"
          onClick={open}
          type="button"
        >
          Get a recommendation <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
