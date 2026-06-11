import Image from "next/image";
import Link from "next/link";
import { FiPhoneCall, FiTool } from "react-icons/fi";
import SectionHeading from "@/components/home/SectionHeading";
import { groupCompanies } from "@/data/homeSections";

const badgeIcons = {
  Phone: <FiPhoneCall aria-hidden="true" />,
  Service: <FiTool aria-hidden="true" />,
};

export default function Companies() {
  const itemCount = groupCompanies.companies.length;

  return (
    <section className="relative mx-auto w-[98%] overflow-hidden px-4 py-12 sm:px-6 lg:px-20">
      <SectionHeading eyebrow={groupCompanies.heading} />

      <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.8fr]">
        <div className="mx-auto max-w-md text-center lg:mx-0">
          <p className="font-maxot text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
            INKARP
          </p>
          <h2 className="font-maxot mt-4 text-xl font-bold leading-tight text-[#BE0010] sm:text-2xl">
            {groupCompanies.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base">
            {groupCompanies.description}
          </p>
        </div>

        <div className="relative mx-auto aspect-[1.8/1] w-full max-w-4xl">
          <div className="absolute left-1/2 top-1/2 size-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dotted border-zinc-500 bg-zinc-100/60" />
          <div className="absolute left-1/2 top-1/2 size-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-200" />

          <div className="absolute left-1/2 top-1/2 z-10 flex size-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 p-5 shadow-xl shadow-zinc-900/10 backdrop-blur">
            <Image
              alt="INKARP Group"
              className="object-contain"
              fill
              sizes="(min-width: 1024px) 260px, 45vw"
              src={groupCompanies.centerLogo}
            />
          </div>

          <ul
            className="absolute inset-0 list-none"
            style={{ "--company-count": itemCount }}
          >
            {groupCompanies.companies.map((company, index) => (
              <li
                className="absolute left-0 top-1/2 w-full -translate-y-1/2 animate-[company-orbit_38s_linear_infinite]"
                key={`${company.name}-${company.logo}`}
                style={{
                  animationDelay: `-${(38 / itemCount) * index}s`,
                }}
              >
                <Link
                  className="flex w-[31%] max-w-48 animate-[company-card_38s_linear_infinite] flex-col items-center justify-center gap-2 rounded-lg bg-white p-3 text-center shadow-lg shadow-zinc-900/10 transition hover:shadow-xl"
                  href={company.href}
                  style={{
                    animationDelay: `-${(38 / itemCount) * index}s`,
                  }}
                >
                  <span className="font-maxot text-xs font-bold uppercase text-zinc-800">
                    {company.name}
                  </span>
                  <span className="flex h-12 w-full items-center justify-center gap-2">
                    {company.badge ? (
                      <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#BE0010] text-sm text-white">
                        {badgeIcons[company.badge]}
                      </span>
                    ) : null}
                    <span className="relative h-10 flex-1">
                      <Image
                        alt={company.name}
                        className="object-contain"
                        fill
                        sizes="180px"
                        src={company.logo}
                      />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
