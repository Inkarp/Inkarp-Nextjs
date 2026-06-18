import Image from "next/image";
import Link from "next/link";
import {
  FiArrowUpRight,
  FiPhoneCall,
  FiTool,
  FiUsers,
  FiGlobe,
  FiCpu,
  FiShare2,
  FiZap,
} from "react-icons/fi";
import { groupCompanies } from "@/data/homeSections";

const badgeIcons = {
  Phone: <FiPhoneCall aria-hidden="true" />,
  Service: <FiTool aria-hidden="true" />,
};

const featureItems = [
  {
    icon: <FiUsers aria-hidden="true" />,
    title: "Strong Group",
    description: "A network of companies working together for growth.",
  },
  {
    icon: <FiZap aria-hidden="true" />,
    title: "Innovation Driven",
    description: "Focused on delivering advanced solutions worldwide.",
  },
  {
    icon: <FiShare2 aria-hidden="true" />,
    title: "Collaborative Ventures",
    description: "Building global partnerships for a better tomorrow.",
  },
  {
    icon: <FiGlobe aria-hidden="true" />,
    title: "Global Presence",
    description: "Operating across industries and scientific markets.",
  },
];

const nodePlacements = [
  {
    x: 53,
    y: 5,
    icon: <FiUsers aria-hidden="true" />,
    color: "from-blue-500 to-blue-700",
    connector: "left-[50%] top-[22%] h-[90px] w-px",
  },
  {
    x: 86,
    y: 30,
    icon: <FiGlobe aria-hidden="true" />,
    color: "from-orange-400 to-orange-600",
    connector: "left-[63%] top-[42%] h-px w-[170px] rotate-[-22deg]",
  },
  {
    x: 86,
    y: 67,
    icon: <FiCpu aria-hidden="true" />,
    color: "from-[#BE0010] to-red-700",
    connector: "left-[63%] top-[57%] h-px w-[170px] rotate-[22deg]",
  },
  {
    x: 53,
    y: 89,
    icon: <FiTool aria-hidden="true" />,
    color: "from-purple-500 to-purple-700",
    connector: "left-[50%] bottom-[20%] h-[90px] w-px",
  },
  {
    x: 16,
    y: 50,
    icon: <FiShare2 aria-hidden="true" />,
    color: "from-teal-400 to-teal-600",
    connector: "left-[28%] top-[50%] h-px w-[160px]",
  },
];

const relationshipTags = [
  "Collaborative Venture",
  "Group Company",
  "Group Company",
  "Group Company",
  "Collaborative Venture",
];

function CompanyCard({ company, index }) {
  const placement = nodePlacements[index % nodePlacements.length];
  const relationshipTag = relationshipTags[index % relationshipTags.length];

  return (
    <Link
      href={company.href}
      className="group relative flex h-[126px] w-[300px] overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div
        className={`flex w-[82px] shrink-0 items-center justify-center bg-gradient-to-br ${placement.color}`}
      >
        <span className="flex size-11 items-center justify-center rounded-full border border-white/30 text-2xl text-white">
          {company.badge ? badgeIcons[company.badge] : placement.icon}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-6">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          {relationshipTag}
        </p>

        <div className="relative h-12 w-full">
          <Image
            src={company.logo}
            alt={company.name}
            fill
            sizes="220px"
            className="object-contain object-left"
          />
        </div>

        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-[#BE0010]/7 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#BE0010] opacity-0 transition group-hover:opacity-100">
          View Details
          <FiArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

function MobileCompanyCard({ company, index }) {
  const relationshipTag = relationshipTags[index % relationshipTags.length];

  return (
    <Link
      href={company.href}
      className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70 transition hover:-translate-y-1"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-[#BE0010]/7 px-3 py-1 text-xs font-bold text-[#BE0010]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="flex size-9 items-center justify-center rounded-full bg-[#BE0010] text-white">
          <FiArrowUpRight aria-hidden="true" />
        </span>
      </div>

      <div className="relative h-16 w-full">
        <Image
          src={company.logo}
          alt={company.name}
          fill
          sizes="260px"
          className="object-contain"
        />
      </div>

      <p className="mt-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
        {relationshipTag}
      </p>
    </Link>
  );
}

function CenterHub() {
  return (
    <div className="absolute left-1/2 top-1/2 z-20 flex size-[250px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
      <div className="absolute inset-5 rounded-full border border-white bg-gradient-to-br from-slate-50 to-white shadow-inner" />

      <div className="relative z-10 text-center">
        <span className="block text-4xl font-black uppercase leading-[0.9] tracking-tight text-[#BE0010]">
          Our
        </span>
        <span className="block text-4xl font-black uppercase leading-[0.9] tracking-tight text-[#BE0010]">
          Group
        </span>

        <span className="mx-auto mt-5 flex w-fit items-center gap-1.5 rounded-full bg-[#BE0010]/7 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#BE0010]">
          Ecosystem
          <FiArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

export default function CompaniesAlternate() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f8fbff] to-[#eef5ff] px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#BE0010]/5 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 size-[420px] rounded-full bg-blue-100/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-[420px] rounded-full bg-red-100/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 lg:grid-cols-[0.38fr_0.62fr] lg:gap-12">
        <div>
          <span className="mb-5 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-[#BE0010]">
            <span className="h-px w-8 bg-[#BE0010]" />
            {groupCompanies.heading || "Our Group"}
          </span>

          <h2 className="font-maxot text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {groupCompanies.title || "INKARP"}
          </h2>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-700">
            {groupCompanies.description ||
              "Explore our subsidiaries and joint ventures that drive our shared vision forward."}
          </p>

          <div className="mt-12 space-y-5">
            {featureItems.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-xl text-[#BE0010] shadow-lg shadow-slate-200/80">
                  {item.icon}
                </div>

                <div className="border-l border-slate-200 pl-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="mb-12 flex justify-center">
            <div className="flex size-56 items-center justify-center rounded-full bg-white shadow-2xl shadow-slate-200">
              <div className="text-center">
                <span className="block text-3xl font-black uppercase leading-tight text-[#BE0010]">
                  Our
                </span>
                <span className="block text-3xl font-black uppercase leading-tight text-[#BE0010]">
                  Group
                </span>
                <span className="mt-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Ecosystem
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {groupCompanies.companies.map((company, index) => (
              <MobileCompanyCard
                key={`${company.name}-${company.logo}-${index}`}
                company={company}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="relative hidden h-[800px] lg:block">
          <div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/35 shadow-inner backdrop-blur-sm" />

          <div className="absolute left-1/2 top-1/2 size-[465px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-400/50" />

          <div className="absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[28px] border-white/70" />

          <div className="absolute left-1/2 top-1/2 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100" />

          {groupCompanies.companies.map((company, index) => {
            const placement = nodePlacements[index % nodePlacements.length];

            return (
              <div
                key={`connector-${company.name}-${index}`}
                className={`absolute z-10 bg-gradient-to-r from-blue-400/70 to-transparent ${placement.connector}`}
                aria-hidden="true"
              />
            );
          })}

          {groupCompanies.companies.map((company, index) => {
            const placement = nodePlacements[index % nodePlacements.length];

            return (
              <span
                key={`dot-${company.name}-${index}`}
                className="absolute z-20 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
                style={{
                  left: `${placement.x}%`,
                  top: `${placement.y}%`,
                }}
                aria-hidden="true"
              >
                <span className="size-3 rounded-full bg-[#BE0010]" />
              </span>
            );
          })}

          <CenterHub />

          {groupCompanies.companies.map((company, index) => {
            const placement = nodePlacements[index % nodePlacements.length];

            return (
              <div
                key={`${company.name}-${company.logo}-${index}`}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${placement.x}%`,
                  top: `${placement.y}%`,
                }}
              >
                <CompanyCard company={company} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}