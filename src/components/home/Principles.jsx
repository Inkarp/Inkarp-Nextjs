import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/home/SectionHeading";
import { principalLogoRows } from "@/data/homeSections";

const ringSizes = [32, 54, 76, 98];

function PrincipalOrbitLogo({ logo, angle }) {
  const x = 50 + Math.cos(angle) * 50;
  const y = 50 + Math.sin(angle) * 50;

  return (
    <Link
      aria-label={logo.name}
      className="absolute flex h-[68px] w-[96px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white p-2.5  transition duration-300 hover:z-30 hover:scale-110 xl:h-[76px] xl:w-[108px]"
      href={logo.href ?? "/products"}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <Image
        alt={logo.name}
        className="object-contain"
        fill
        sizes="(min-width: 1280px) 108px, 96px"
        src={logo.logo}
        unoptimized={logo.logo.endsWith(".gif")}
      />
    </Link>
  );
}

function OrbitRing({ logos, ringIndex }) {
  const angleStep = (2 * Math.PI) / logos.length;
  const phaseShift = ringIndex % 2 === 1 ? angleStep / 2 : 0;

  return (
    <div
      className="absolute left-1/2 top-1/2 rounded-full border-2 border-[#E63946]"
      style={{
        height: `${ringSizes[ringIndex]}%`,
        transform: "translate(-50%, -50%)",
        width: `${ringSizes[ringIndex]}%`,
      }}
    >
      {logos.map((logo, index) => (
        <PrincipalOrbitLogo
          angle={angleStep * index + phaseShift}
          key={`${logo.name}-${ringIndex}-${index}`}
          logo={logo}
        />
      ))}
    </div>
  );
}

export default function Principles() {
  const mobileLogos = principalLogoRows.flat();

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 lg:min-h-screen lg:px-8 lg:py-16">
      <SectionHeading
        eyebrow="Our Principles"
        title="Strategic Alliances with Global Scientific Leaders"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
        {mobileLogos.map((logo, index) => (
          <Link
            aria-label={logo.name}
            className="flex min-h-24 items-center justify-center rounded-lg border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-900/5"
            href={logo.href ?? "/products"}
            key={`${logo.name}-${index}`}
          >
            <span className="relative h-14 w-full">
              <Image
                alt={logo.name}
                className="object-contain p-3"
                fill
                sizes="(min-width: 600px) 30vw, 45vw"
                src={logo.logo}
                unoptimized={logo.logo.endsWith(".gif")}
              />
            </span>
          </Link>
        ))}
      </div>

      <div className="relative mx-auto hidden h-[900px] w-full max-w-7xl overflow-visible lg:block xl:h-[980px] ">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[min(88vw,980px)] -translate-x-1/2 -translate-y-1/2">
          {principalLogoRows.map((logos, ringIndex) => (
            <OrbitRing
              key={`orbit-ring-${ringIndex}`}
              logos={logos}
              ringIndex={ringIndex}
            />
          ))}

          <div className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 p-4 shadow-xl shadow-zinc-900/10">
            <Image
              alt="Inkarp"
              className="object-contain p-3"
              fill
              priority
              sizes="128px"
              src="/InkarpLogo.svg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
