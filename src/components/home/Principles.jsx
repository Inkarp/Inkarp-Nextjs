import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/home/SectionHeading";
import { principalLogoRows } from "@/data/homeSections";

const INNER_RING_SIZE = 30;
const OUTER_RING_SIZE = 92;
const ORBIT_COUNT = 4;

function buildOrbits(items) {
  const total = items.length;
  const baseSizes = Array.from({ length: ORBIT_COUNT }, (_, i) => i + 5);
  const baseTotal = baseSizes.reduce((sum, size) => sum + size, 0);
  const extra = Math.max(total - baseTotal, 0);

  const sizes = baseSizes.map((size) =>
    size + Math.round((extra * size) / baseTotal),
  );

  let diff = total - sizes.reduce((sum, size) => sum + size, 0);
  let i = sizes.length - 1;

  while (diff !== 0) {
    sizes[i] += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
    i = (i - 1 + sizes.length) % sizes.length;
  }

  const orbits = [];
  let cursor = 0;

  for (const size of sizes) {
    orbits.push(items.slice(cursor, cursor + size));
    cursor += size;
  }

  return orbits;
}

function PrincipalOrbitLogo({ logo, angle }) {
  const x = 50 + Math.cos(angle) * 50;
  const y = 50 + Math.sin(angle) * 50;

  return (
    <Link
      aria-label={logo.name}
      className="absolute flex h-12 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white transition duration-300 hover:z-30 hover:scale-110 xl:h-14 xl:w-20 dark:bg-zinc-900"
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
        sizes="(min-width: 1280px) 80px, 64px"
        src={logo.logo}
        unoptimized={logo.logo.endsWith(".gif")}
      />
    </Link>
  );
}

function OrbitRing({ logos, ringIndex, ringSize }) {
  const angleStep = (2 * Math.PI) / logos.length;
  const phaseShift = ringIndex % 2 === 1 ? angleStep / 2 : 0;

  return (
    <div
      className="absolute left-1/2 top-1/2 rounded-full border-2 border-dotted border-[#E63946]"
      style={{
        height: `${ringSize}%`,
        transform: "translate(-50%, -50%)",
        width: `${ringSize}%`,
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
  const principalLogos = principalLogoRows.flat();
  const orbits = buildOrbits(principalLogos);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16 dark:bg-zinc-950">
      <SectionHeading
        eyebrow="Our Principles"
        title="Strategic Alliances with Global Scientific Leaders"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
        {principalLogos.map((logo, index) => (
          <Link
            aria-label={logo.name}
            className="flex min-h-24 items-center justify-center rounded-lg border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900"
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

      <div className="relative mx-auto hidden h-[760px] w-full max-w-7xl overflow-visible lg:block xl:h-[860px]">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[min(82vw,860px)] -translate-x-1/2 -translate-y-1/2">
          {orbits.map((logos, ringIndex) => {
            const ringSize =
              orbits.length === 1
                ? INNER_RING_SIZE
                : INNER_RING_SIZE +
                  (ringIndex * (OUTER_RING_SIZE - INNER_RING_SIZE)) /
                    (orbits.length - 1);

            return (
              <OrbitRing
                key={`orbit-ring-${ringIndex}`}
                logos={logos}
                ringIndex={ringIndex}
                ringSize={ringSize}
              />
            );
          })}

          <div className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 p-3 shadow-xl shadow-zinc-900/10 dark:bg-zinc-900/85">
            <Image
              alt="Inkarp"
              className="object-contain p-2"
              fill
              priority
              sizes="96px"
              src="/InkarpLogo.svg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
