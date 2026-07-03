import Image from "next/image";
import Link from "next/link";
import RecTag from "./RecTag";

export default function HomeAboutHero() {
  return (
    <section className="bg-white pb-15 pt-19" id="about" data-reveal>
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mx-auto mb-16 flex max-w-3xl flex-col items-center border-b border-line-light pb-16 text-center">
          <RecTag>Built Around Your Workflow</RecTag>
          <h1 className="max-w-[18ch] text-[34px] font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl">
            Your lab has a workflow.
            <br />
            We help build the right <em className="italic text-red">solution</em> around it.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            From global technologies to Inkarp&apos;s own solutions, we match your requirement with
            the right fit, guidance, and support path.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="#categories"
              className="border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
            >
              Find My Industry
            </Link>
            <Link
              href="#workflow-wheel"
              className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
            >
              See a Workflow
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 flex items-start gap-6">
              <div className="relative flex h-[104px] w-[104px] shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-red text-center text-red">
                <div className="absolute inset-2 rounded-full border border-dashed border-red/40" />
                <span className="text-[19px] font-semibold tracking-wide">1985</span>
                <span className="mt-0.5 text-[8.5px] uppercase tracking-[0.16em]">Est. &amp; Trusted</span>
              </div>
              <div>
                <RecTag>About Inkarp</RecTag>
                <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                  Four decades of supporting
                  <br />
                  India&apos;s <em className="italic text-red">laboratories.</em>
                </h2>
              </div>
            </div>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              Since 1985, Inkarp has helped Indian laboratories move from scientific need to supported
              use — bringing together global principals, product lines, application guidance,
              installation support, and service across India.
            </p>

            <div className="mb-11 flex flex-wrap gap-3.5">
              <Link
                href="/products"
                className="border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
              >
                Browse Solutions
              </Link>
              <Link
                href="/contact"
                className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>

          <div className="relative border border-line-light bg-parchment-alt p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white">
              <Image
                src="/assets/our-story/InkarpBuilding.jpg"
                alt="Inkarp scientific solutions and support network"
                loading="eager"
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
              <span>Fig. 01 — Inkarp Scientific Solutions</span>
              <span>Pan-India Support</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line-light pt-5">
              {[
                { num: "1985", label: "Serving Indian Science Since" },
                { num: "49", label: "Global Principals" },
                { num: "191", label: "Product Lines" },
                { num: "18", label: "Offices Across India" },
                { num: "All India", label: "Installation and Service", full: true },
              ].map((stat) => (
                <div key={stat.label} className={stat.full ? "col-span-2" : undefined}>
                  <div className="text-lg font-semibold text-red">{stat.num}</div>
                  <div className="mt-0.5 text-[9.5px] uppercase tracking-wide text-ink-soft">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
