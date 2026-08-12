import { FaBullseye, FaEye, FaRegGem } from"react-icons/fa";
import SectionHeading from"@/components/home/SectionHeading";

const pillars = [
  {
    title:"Our Mission",
    icon: FaBullseye,
    body:"To empower scientific progress across India by delivering cutting-edge instruments, responsive support, and trusted expertise in every partnership.",
  },
  {
    title:"Our Vision",
    icon: FaEye,
    body:"To be India's most trusted and innovative scientific solutions partner, enabling discovery, development, and diagnostics with excellence and integrity.",
    featured: true,
  },
  {
    title:"Our Core Values",
    icon: FaRegGem,
    body:"Integrity, innovation, and customer-first thinking guide everything we do, building trust and delivering long-term impact across the scientific community.",
  },
];

export default function MissionVision() {
  return (
    <section className="relative mx-auto w-full px-4 py-12 sm:px-6 lg:px-10">
      {/* Same 1180px container as the cards below, so the left-aligned heading
          lines up with the content instead of the section edge. */}
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          eyebrow="Who Are We"
          title="Our Purpose & Principles"
          description="With over four decades of experience, we partner with global leaders to empower research, diagnostics, and industry through reliable, precise instrumentation and personalized support."
        />
      </div>

      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-5 md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <article
              className={`h-full border border-line-light bg-parchment/85 p-6 text-center backdrop-blur transition hover:-translate-y-0.5 hover:border-red/35 ${
                pillar.featured ? "md:scale-[1.03] md:border-red/20 md:bg-white" : ""
              }`}
              data-scroll-reveal="true"
              key={pillar.title}
            >
              <div className="mx-auto mb-5 flex size-14 items-center justify-center bg-red text-parchment">
                <Icon aria-hidden="true" className="size-6" />
              </div>
              <h3 className="text-xl text-ink-soft">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">
                {pillar.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
