import { FaBullseye, FaEye, FaRegGem } from "react-icons/fa";
import SectionHeading from "@/components/home/SectionHeading";

const pillars = [
  {
    title: "Our Mission",
    icon: FaBullseye,
    body: "To empower scientific progress across India by delivering cutting-edge instruments, responsive support, and trusted expertise in every partnership.",
  },
  {
    title: "Our Vision",
    icon: FaEye,
    body: "To be India's most trusted and innovative scientific solutions partner, enabling discovery, development, and diagnostics with excellence and integrity.",
    featured: true,
  },
  {
    title: "Our Core Values",
    icon: FaRegGem,
    body: "Integrity, innovation, and customer-first thinking guide everything we do, building trust and delivering long-term impact across the scientific community.",
  },
];

export default function MissionVision() {
  return (
    <section className="relative mx-auto w-full px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_460px_at_20%_0%,rgba(190,0,16,0.08),transparent),radial-gradient(1000px_460px_at_80%_100%,rgba(230,57,70,0.08),transparent)]" />

      <SectionHeading
        eyebrow="Who Are We"
        title="Our Purpose & Principles"
        description="With over four decades of experience, we partner with global leaders to empower research, diagnostics, and industry through reliable, precise instrumentation and personalized support."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <article
              className={`h-full rounded-lg border border-zinc-200 bg-white/85 p-6 text-center shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md ${
                pillar.featured ? "md:scale-[1.03] md:shadow-md" : ""
              }`}
              data-scroll-reveal="true"
              key={pillar.title}
            >
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-[#BE0010] to-[#E63946] text-white">
                <Icon aria-hidden="true" className="size-6" />
              </div>
              <h3 className="font-maxot text-xl text-zinc-950">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-700">
                {pillar.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
