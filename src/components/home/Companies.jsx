import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiPhoneCall, FiTool } from "react-icons/fi";
import RecTag from "./RecTag";
import { groupCompanies } from "@/data/homeSections";

const badgeIcons = {
  Phone: <FiPhoneCall aria-hidden="true" />,
  Service: <FiTool aria-hidden="true" />,
};

const featureIconPaths = {
  diamond: <path d="M12 3l9 9-9 9-9-9 9-9z" />,
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinecap="round" strokeLinejoin="round" />,
  hexagon: <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" strokeLinejoin="round" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </>
  ),
};

function FeatureIcon({ name, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      {featureIconPaths[name]}
    </svg>
  );
}

const featureItems = [
  { icon: "diamond", title: "Strong group", description: "A network of companies working together for growth." },
  { icon: "bolt", title: "Innovation driven", description: "Focused on delivering advanced solutions worldwide." },
  { icon: "hexagon", title: "Collaborative ventures", description: "Building global partnerships for a better tomorrow." },
  { icon: "target", title: "Global presence", description: "Operating across industries and scientific markets." },
];

export default function Companies() {
  const companies = groupCompanies.companies;

  return (
    <section className="bg-parchment px-4 py-16 sm:px-6 lg:px-8 lg:py-20" data-reveal>
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <RecTag>{groupCompanies.heading}</RecTag>
          <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
            {groupCompanies.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-ink-soft sm:text-base">
            {groupCompanies.description}
          </p>

          <div className="mt-8 space-y-5">
            {featureItems.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red/8 text-red">
                  <FeatureIcon name={item.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-ink-soft">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/our-story"
            className="mt-9 inline-flex items-center gap-2 bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-soft"
          >
            About Inkarp
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>

        <ul className="space-y-5">
          {companies.map((company, index) => (
            <li key={`${company.displayName}-${company.logo}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="mt-5 size-2.5 shrink-0 rounded-full bg-red" />
                {index < companies.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-red/15" />
                ) : null}
              </div>

              <Link
                href={company.href}
                className="flex-1 rounded-xl bg-parchment-alt p-5 transition hover:bg-parchment-alt/70"
              >
                {/* <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                  {company.name}
                </p> */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {company.badge ? (
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-red text-xs text-white">
                      {badgeIcons[company.badge]}
                    </span>
                  ) : null}
                  <span className="relative h-12 w-32 shrink-0">
                    <Image
                      src={company.logo}
                      alt={company.displayName}
                      fill
                      sizes="180px"
                      className="object-contain object-left"
                    />
                  </span>
                  <span className="text-sm text-ink-soft">{company.description}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
