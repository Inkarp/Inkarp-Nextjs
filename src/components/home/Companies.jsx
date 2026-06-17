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
  const companiesByCategory = groupCompanies.companies.reduce(
    (categories, company) => {
      const category = company.name;
      return {
        ...categories,
        [category]: [...(categories[category] ?? []), company],
      };
    },
    {},
  );

  return (
    <section className="relative mx-auto w-[98%] overflow-hidden px-4 py-16 sm:px-6 lg:px-20 lg:py-20">
      <SectionHeading eyebrow={groupCompanies.heading} />

      <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.8fr] lg:gap-12">
        <div className="mx-auto max-w-md text-center lg:mx-0">
          <p className="font-maxot text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
            INKARP
          </p>
          <h2 className="font-maxot mt-4 text-xl leading-tight text-[#BE0010] sm:text-2xl">
            {groupCompanies.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base">
            {groupCompanies.description}
          </p>
        </div>

        <div className="w-full space-y-6 lg:hidden">
          {Object.entries(companiesByCategory).map(([category, companies]) => (
            <div key={category}>
              <h3 className="font-maxot text-sm font-bold uppercase tracking-wide text-[#BE0010]">
                {category}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {companies.map((company) => (
                  <Link
                    className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-center shadow-sm shadow-zinc-900/5"
                    href={company.href}
                    key={`${category}-${company.logo}`}
                  >
                    <span className="flex h-14 w-full items-center justify-center gap-2">
                      {company.badge ? (
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#BE0010] text-sm text-white">
                          {badgeIcons[company.badge]}
                        </span>
                      ) : null}
                      <span className="relative h-12 flex-1">
                        <Image
                          alt={category}
                          className="object-contain"
                          fill
                          sizes="45vw"
                          src={company.logo}
                        />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative mx-auto hidden h-[620px] w-full max-w-5xl lg:block xl:h-[680px]">
          <div className="absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dotted border-zinc-500 bg-zinc-100/60" />
          {/* <div className="absolute left-1/2 top-1/2 size-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-200" /> */}

          <div className="absolute left-1/2 top-1/2 z-10 flex size-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur">
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
                  className="flex w-[42%] min-w-32 max-w-56 animate-[company-card_38s_linear_infinite] flex-col items-center justify-center gap-3 rounded-lg bg-white p-4 text-center shadow-lg shadow-zinc-900/10 transition hover:shadow-xl sm:w-[36%] lg:w-[30%]"
                  href={company.href}
                  style={{
                    animationDelay: `-${(38 / itemCount) * index}s`,
                  }}
                >
                  <span className="font-maxot text-xs font-bold uppercase text-zinc-800">
                    {company.name}
                  </span>
                  <span className="flex h-16 w-full items-center justify-center gap-3">
                    {company.badge ? (
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#BE0010] text-sm text-white">
                        {badgeIcons[company.badge]}
                      </span>
                    ) : null}
                    <span className="relative h-12 flex-1">
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
