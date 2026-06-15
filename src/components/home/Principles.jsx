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
      className="absolute flex h-[45px] w-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition duration-300 hover:z-30 hover:scale-125 sm:h-[58px] sm:w-[78px] lg:h-[64px] lg:w-[88px]"
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
        sizes="(min-width: 1024px) 88px, (min-width: 640px) 78px, 60px"
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
  return (
    <section className="relative min-h-screen overflow-hidden py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(230,57,70,0.08),transparent),radial-gradient(1200px_600px_at_80%_110%,rgba(230,57,70,0.08),transparent)]" />

      <SectionHeading
        eyebrow="Our Principles"
        title="Strategic Alliances with Global Scientific Leaders"
      />

      <div className="relative mx-auto h-[520px] w-full max-w-7xl overflow-visible sm:h-[640px] lg:h-[780px]">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[min(94vw,850px)] -translate-x-1/2 -translate-y-1/2">
          {principalLogoRows.map((logos, ringIndex) => (
            <OrbitRing
              key={`orbit-ring-${ringIndex}`}
              logos={logos}
              ringIndex={ringIndex}
            />
          ))}

          <div className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 shadow-[0_0_25px_rgba(230,57,70,0.3)] sm:h-28 sm:w-28">
            <Image
              alt="Inkarp"
              className="object-contain p-2"
              fill
              priority
              sizes="112px"
              src="/inkarpLogo.svg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
