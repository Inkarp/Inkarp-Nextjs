"use client";

import Link from "next/link";
import { useState } from "react";
import BadgeIcon from "./BadgeIcon";
import RecTag from "./RecTag";
import { badgeStats, featuredProducts } from "@/data/homeShowcase";

const slideOrder = ["stats", "why", "featured"];
const slideCopy = {
  stats: { tag: "Our Numbers", h2: "Numbers that reflect four decades of trust", p: "A quick snapshot of the scale and reliability behind every Inkarp partnership." },
  why: { tag: "Why Choose Us", h2: "Why Inkarp is the right partner", p: "We combine 35+ years of lab expertise, trusted principals, and reliable service to keep your operations running smoothly." },
  featured: { tag: "Featured Products", h2: "Solutions our labs order most", p: "Browse by industry, not by catalogue page. Full specification sheets available on request." },
};
const slideTabs = [
  ["stats", "Our numbers"],
  ["why", "Why choose us"],
  ["featured", "Featured products"],
];
const productTabs = [
  ["all", "All Industries"],
  ["pharma", "Pharmaceuticals"],
  ["biotech", "Biotechnology"],
  ["rnd", "R&D Laboratories"],
  ["food", "Food & Beverage"],
];

const tabClass = (active) =>
  `border px-4 py-2.25 text-xs uppercase tracking-wide transition-all ${
    active ? "border-red bg-red text-white" : "border-line-light bg-transparent text-ink-soft hover:border-red hover:bg-red hover:text-white"
  }`;

export default function HomeShowcaseSlider() {
  const [slide, setSlide] = useState("stats");
  const [direction, setDirection] = useState("next");
  const [filter, setFilter] = useState("all");

  const goTo = (target) => {
    setDirection(slideOrder.indexOf(target) >= slideOrder.indexOf(slide) ? "next" : "prev");
    setSlide(target);
  };

  const copy = slideCopy[slide];
  const animateClass = direction === "next" ? "animate-[slideInNext_.45s_ease]" : "animate-[slideInPrev_.45s_ease]";

  return (
    <section className="border-y border-line-light bg-parchment-alt py-[78px]" id="products" data-reveal>
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <RecTag variant="teal">{copy.tag}</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">{copy.h2}</h2>
          </div>
          <p className="max-w-[420px] text-sm text-ink-soft">{copy.p}</p>
        </div>

        <div className="mb-9 flex flex-wrap gap-2">
          {slideTabs.map(([value, label]) => (
            <button key={value} type="button" className={tabClass(slide === value)} onClick={() => goTo(value)}>
              {label}
            </button>
          ))}
        </div>

        <div key={slide} className={animateClass}>
          {slide === "stats" && (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {badgeStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-3.5 border border-line-light bg-white p-8 px-5 text-center transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center bg-navy [clip-path:polygon(25%_3%,75%_3%,100%_50%,75%_97%,25%_97%,0%_50%)]">
                    <div className="absolute inset-[3px] border border-white/20 [clip-path:polygon(25%_3%,75%_3%,100%_50%,75%_97%,25%_97%,0%_50%)]" />
                    <BadgeIcon index={i} className="relative h-[26px] w-[26px] text-white" />
                  </div>
                  <div className="text-[28px] font-semibold text-red">{stat.num}</div>
                  <div className="text-xs uppercase tracking-wide text-ink-soft">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {slide === "why" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="border border-line-light bg-white p-6.5">
                <div className="mb-3 text-[11px] uppercase tracking-wide text-teal">Expertise</div>
                <h3 className="mb-2 text-lg text-ink">Deep lab and scientific domain knowledge</h3>
                <p className="text-sm text-ink-soft">
                  We help you choose the right solutions for process, compliance, and uptime across every
                  analytical and life-science workflow.
                </p>
              </div>
              <div className="border border-line-light bg-white p-6.5">
                <div className="mb-3 text-[11px] uppercase tracking-wide text-teal">Partnership</div>
                <h3 className="mb-2 text-lg text-ink">Strong global principals, local support</h3>
                <p className="text-sm text-ink-soft">
                  Trusted relationships with 45+ manufacturers make it easy to source leading instruments,
                  consumables, and service support nationwide.
                </p>
              </div>
              <div className="border border-line-light bg-white p-6.5">
                <div className="mb-3 text-[11px] uppercase tracking-wide text-teal">Service</div>
                <h3 className="mb-2 text-lg text-ink">Responsive after-sales and service</h3>
                <p className="text-sm text-ink-soft">
                  Our Hyderabad-based team provides timely installation, calibration, and support for every
                  product we supply.
                </p>
              </div>
            </div>
          )}

          {slide === "featured" && (
            <>
              <div className="mb-8 flex flex-wrap gap-2">
                {productTabs.map(([f, label]) => (
                  <button key={f} type="button" className={tabClass(filter === f)} onClick={() => setFilter(f)}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProducts
                  .filter((p) => filter === "all" || filter === p.cat)
                  .map((p) => (
                    <div
                      key={p.name}
                      className="flex flex-col border border-line-light bg-white transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative flex aspect-[4/3] items-center justify-center border-b border-line-light bg-parchment-alt p-6">
                        <span className="absolute left-2.5 top-2.5 bg-red px-2 py-1 text-[10px] uppercase tracking-wide text-white">
                          {p.tag}
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-wide text-navy/40">
                          {p.brand}
                        </span>
                      </div>
                      <div className="flex flex-grow flex-col gap-2 p-5 pb-5.5">
                        <h3 className="text-[16.5px] text-ink">{p.name}</h3>
                        <div className="text-[11px] uppercase tracking-wide text-teal">{p.brand}</div>
                        <div className="text-[11.5px] text-ink-soft">{p.spec}</div>
                        <div className="mt-auto flex flex-wrap items-start justify-between gap-3 pt-2.5">
                          <div className="text-xs text-ink-soft">{p.avail}</div>
                          <div className="flex flex-wrap justify-end gap-2">
                            <Link
                              href={`/products?q=${p.quoteQuery}`}
                              className="border border-navy px-3.5 py-2.25 text-[11px] uppercase tracking-wide transition hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
                            >
                              Show Products
                            </Link>
                            <Link
                              href="/contact"
                              className="border border-navy px-3.5 py-2.25 text-[11px] uppercase tracking-wide transition hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
                            >
                              Request Quote
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3.5">
          {slide === "stats" && (
            <button type="button" className="border border-navy px-6 py-3.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-navy hover:text-white" onClick={() => goTo("why")}>
              Up next: Why choose us
            </button>
          )}
          {slide === "why" && (
            <>
              <button type="button" className="border border-navy px-6 py-3.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-navy hover:text-white" onClick={() => goTo("stats")}>
                Back to Our numbers
              </button>
              <button type="button" className="border border-navy px-6 py-3.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-navy hover:text-white" onClick={() => goTo("featured")}>
                Up next: Featured products
              </button>
            </>
          )}
          {slide === "featured" && (
            <>
              <button type="button" className="border border-navy px-6 py-3.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-navy hover:text-white" onClick={() => goTo("why")}>
                Back to Why choose us
              </button>
              <Link href="/products" className="border border-navy px-6 py-3.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-navy hover:text-white">
                View Full Solutions Catalogue
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
