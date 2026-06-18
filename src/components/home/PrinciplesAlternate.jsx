import Image from "next/image";
import Link from "next/link";
import { principalLogoRows } from "@/data/homeSections";

const principalLogos = principalLogoRows.flat();

function PrincipalLogoTile({ logo, index }) {
  const isPriorityLogo = index < 10;

  return (
    <Link
      aria-label={logo.name}
      className="group flex h-20 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 shadow-sm shadow-zinc-950/5 transition duration-300 hover:-translate-y-1 hover:border-[#BE0010]/35 hover:bg-white hover:shadow-md hover:shadow-[#BE0010]/10 sm:h-24"
      href={logo.href ?? "/products"}
    >
      <span className="relative h-full w-full">
        <Image
          alt={logo.name}
          className="object-contain p-2 transition duration-300 group-hover:scale-105"
          fill
          priority={isPriorityLogo}
          sizes="(min-width: 1024px) 150px, (min-width: 640px) 28vw, 42vw"
          src={logo.logo}
          unoptimized={logo.logo.endsWith(".gif")}
        />
      </span>
    </Link>
  );
}

function FrameDot({ className }) {
  return (
    <span
      className={`absolute size-3 rounded-full bg-[#BE0010] shadow-sm shadow-[#BE0010]/30 ${className}`}
    />
  );
}

export default function PrinciplesAlternate() {
  return (
    <section className="relative overflow-hidden bg-[#fff3f4] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(30deg,#BE0010_1px,transparent_1px),linear-gradient(150deg,#BE0010_1px,transparent_1px)] [background-size:46px_46px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center text-center">
          <span className="mb-3 rounded-full border border-[#BE0010]/25 bg-white px-4 py-1 text-xs font-semibold uppercase text-zinc-800">
            Our Principals
          </span>
          <h2 className="font-maxot text-2xl leading-tight text-[#BE0010] sm:text-3xl">
            Strategic Alliances with Global Scientific Leaders
          </h2>
        </div>

        <div className="mx-auto w-full">
          <div className="relative rounded-2xl bg-white px-4 pb-5 pt-14 shadow-2xl shadow-zinc-950/10 sm:px-6 sm:pb-8 sm:pt-16 lg:px-10">
            {/* <div className="absolute left-1/2 top-11 hidden h-px w-[82%] -translate-x-1/2 bg-zinc-300 sm:block" />
            <span className="absolute left-[9%] top-[38px] hidden size-3 rounded-full bg-[#BE0010] sm:block" />
            <span className="absolute right-[9%] top-[38px] hidden size-3 rounded-full bg-[#BE0010] sm:block" /> */}

            <div className="absolute left-1/2 top-5 z-20 flex h-16 w-32 -translate-x-1/2 items-center justify-center rounded-lg border border-zinc-200 bg-white p-3 shadow-lg shadow-zinc-950/10 sm:h-20 sm:w-40">
              <Image
                alt="Inkarp"
                className="object-contain p-1"
                fill
                priority
                sizes="160px"
                src="/InkarpLogo.svg"
              />
            </div>

            <div className="relative rounded-xl border border-zinc-300 px-3 pb-3 pt-12 sm:px-5 sm:pb-5 sm:pt-14">
              <FrameDot className="-left-1.5 -top-1.5" />
              <FrameDot className="-right-1.5 -top-1.5" />
              <FrameDot className="-bottom-1.5 -left-1.5" />
              <FrameDot className="-bottom-1.5 -right-1.5" />

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-6 lg:grid-cols-7">
                {principalLogos.map((logo, index) => (
                  <PrincipalLogoTile
                    index={index}
                    key={`${logo.name}-${logo.logo}`}
                    logo={logo}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
