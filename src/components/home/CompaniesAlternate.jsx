import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiPhoneCall, FiTool } from "react-icons/fi";
import { groupCompanies } from "@/data/homeSections";

const badgeIcons = {
  Phone: <FiPhoneCall aria-hidden="true" />,
  Service: <FiTool aria-hidden="true" />,
};

const nodePlacements = [
  { angle: -90, x: 50, y: 13 },
  { angle: -18, x: 88, y: 33 },
  { angle: 54, x: 73, y: 84 },
  { angle: 126, x: 27, y: 84 },
  { angle: 198, x: 12, y: 33 },
];

const relationshipTags = [
  "Group Company",
  "Telecom Division",
  "Service Division",
  "Collaborative Venture",
  "Joint Venture",
];

function CompanyTile({ company, index, isOrbit = false }) {
  const relationshipTag = relationshipTags[index % relationshipTags.length];

  return (
    <Link
      className={`group relative flex min-h-36 flex-col justify-between rounded-lg border border-[#BE0010]/12 bg-white px-4 py-4 text-center shadow-lg shadow-[#BE0010]/10 transition duration-300 hover:-translate-y-1 hover:border-[#BE0010]/35 hover:shadow-xl hover:shadow-[#BE0010]/15 ${
        isOrbit ? "w-64" : ""
      }`}
      href={company.href}
    >
      <span className="flex w-full items-center justify-between gap-3">
        <span className="rounded-full bg-[#BE0010]/7 px-3 py-1 text-xs font-bold text-[#BE0010]">
          {String(index + 1).padStart(2, "0")}
        </span>
        {company.badge ? (
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#BE0010] text-sm text-white">
            {badgeIcons[company.badge]}
          </span>
        ) : (
          <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#BE0010]/20 text-[#BE0010] transition group-hover:bg-[#BE0010] group-hover:text-white">
            <FiArrowUpRight aria-hidden="true" />
          </span>
        )}
      </span>

      <span className="relative my-3 h-20 w-full">
        <Image
          alt={company.name}
          className="object-contain"
          fill
          sizes={isOrbit ? "230px" : "45vw"}
          src={company.logo}
        />
      </span>

      <span className="flex w-full items-center justify-between gap-3">
        <span className="min-w-0 rounded-full border border-[#BE0010]/15 bg-[#fff3f4] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#BE0010]">
          {relationshipTag}
        </span>
        {company.badge ? (
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[#BE0010]/20 text-[#BE0010] transition group-hover:bg-[#BE0010] group-hover:text-white">
            <FiArrowUpRight aria-hidden="true" />
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function CenterGroupLogo({ isMobile = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full border border-[#BE0010]/15 bg-white text-center shadow-2xl shadow-[#BE0010]/15 ${
        isMobile ? "mx-auto mb-5 size-64 p-8" : "absolute left-1/2 top-1/2 z-20 size-80 -translate-x-1/2 -translate-y-1/2 p-9"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BE0010]">
        Our Group
      </span>
      <span className="relative mt-4 h-28 w-64 max-w-full">
        <Image
          alt="INKARP Group"
          className="object-contain"
          fill
          priority
          sizes={isMobile ? "220px" : "256px"}
          src={groupCompanies.centerLogo}
        />
      </span>
      <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#BE0010]/7 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#BE0010]">
        Group ecosystem
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#BE0010] text-white">
          <FiArrowUpRight aria-hidden="true" />
        </span>
      </span>
    </div>
  );
}

export default function CompaniesAlternate() {
  return (
    <section className="relative overflow-hidden bg-[#fff3f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-[#BE0010]/20 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#BE0010]">
            {groupCompanies.heading}
          </span>
          <h2 className="font-maxot mt-4 text-3xl leading-tight text-zinc-950 sm:text-4xl">
            {groupCompanies.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            {groupCompanies.description}
          </p>
        </div>

        <div className="mt-10 lg:hidden">
          <CenterGroupLogo isMobile />

          <div className="grid gap-3 sm:grid-cols-2">
            {groupCompanies.companies.map((company, index) => (
              <CompanyTile
                company={company}
                index={index}
                key={`${company.name}-${company.logo}-${index}`}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-12 hidden h-[720px] max-w-6xl lg:block">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#BE0010]/12"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#BE0010]/20"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55 blur-2xl"
          />

          {groupCompanies.companies.map((company, index) => {
            const placement = nodePlacements[index % nodePlacements.length];

            return (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-px w-[270px] bg-gradient-to-r from-[#BE0010]/35 to-transparent"
                key={`connector-${company.logo}`}
                style={{
                  transform: `rotate(${placement.angle}deg)`,
                  transformOrigin: "left center",
                }}
              />
            );
          })}

          <CenterGroupLogo />

          {groupCompanies.companies.map((company, index) => {
            const placement = nodePlacements[index % nodePlacements.length];

            return (
              <div
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                key={`${company.name}-${company.logo}-${index}`}
                style={{
                  left: `${placement.x}%`,
                  top: `${placement.y}%`,
                }}
              >
                <CompanyTile company={company} index={index} isOrbit />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
