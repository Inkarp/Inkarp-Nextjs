import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/home/SectionHeading";
import { principalLogoRows } from "@/data/homeSections";

function PrincipalLogoCard({ logo }) {
  return (
    <Link
      className="group relative flex h-20 w-40 shrink-0 items-center justify-center rounded-lg border border-zinc-100 bg-white px-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#BE0010]/40 hover:shadow-md"
      href={logo.href ?? "/products"}
    >
      <Image
        alt={logo.name}
        className="object-contain"
        fill
        sizes="160px"
        src={logo.logo}
        unoptimized={logo.logo.endsWith(".gif")}
      />
      <span className="sr-only">{logo.name}</span>
    </Link>
  );
}

export default function Principles() {
  return (
    <section className="relative overflow-hidden py-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1100px_500px_at_12%_0%,rgba(190,0,16,0.08),transparent),radial-gradient(1100px_500px_at_88%_100%,rgba(230,57,70,0.08),transparent)]" />

      <div className="mx-auto w-[98%] px-4 sm:px-6 lg:px-20">
        <SectionHeading
          eyebrow="Our Principals"
          title="Strategic Alliances with Global Scientific Leaders"
          description="Explore the global principal brands and technology partners represented by Inkarp across laboratory, analytical, process, and research workflows."
        />
      </div>

      <div className="space-y-4">
        {principalLogoRows.map((row, rowIndex) => {
          const repeatedRow = [...row, ...row];

          return (
            <div
              className="group overflow-hidden"
              key={`principal-row-${rowIndex}`}
            >
              <div
                className={`flex w-max gap-4 ${
                  rowIndex % 2 === 0
                    ? "animate-[logo-marquee_36s_linear_infinite]"
                    : "animate-[logo-marquee-reverse_40s_linear_infinite]"
                } group-hover:[animation-play-state:paused]`}
              >
                {repeatedRow.map((logo, index) => (
                  <PrincipalLogoCard
                    key={`${logo.name}-${rowIndex}-${index}`}
                    logo={logo}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
