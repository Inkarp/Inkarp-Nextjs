import Image from "next/image";
import Link from "next/link";
import RecTag from "./RecTag";

export default function HomeAboutHero() {
  return (
    <section className="bg-white pb-15 pt-19" id="about" data-reveal>
      <div className="mx-auto max-w-[1180px] px-8">
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
                <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                  Forty years of equipping
                  <br />
                  India&apos;s <em className="italic text-red">laboratories.</em>
                </h1>
              </div>
            </div>

            <p className="my-4 max-w-[520px] text-base leading-relaxed text-ink-soft sm:text-lg">
              Founded in 1985 by Mr. S. Balu, Inkarp Instruments has grown into one of India&apos;s most
              established suppliers of scientific and analytical solutions — serving Pharma, Biotechnology,
              Life Sciences, and Diagnostics laboratories from our Hyderabad headquarters and a network of
              branch offices across the country.
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
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["40+ Years", "14 Branch Offices", "45+ Principal Brands", "Scientific Support"].map((chip) => (
                <span
                  key={chip}
                  className="border border-line-light bg-white px-2.5 py-1.5 text-[10.5px] uppercase tracking-wide text-ink-soft"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
