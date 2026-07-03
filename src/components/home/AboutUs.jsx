import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiHeadphones, FiPhoneCall, FiTool } from "react-icons/fi";
import { siteConfig } from "@/data/siteConfig";

const features = [
  {
    title: "Free Product Demo",
    icon: FiTool,
    body: "Our specialists help you evaluate the right instrument for your lab with hands-on demos and expert consultation.",
  },
  {
    title: "Nationwide Support",
    icon: FiHeadphones,
    body: "A dedicated pan-India service and applications team keeps your instruments accurate, calibrated, and running.",
  },
];

const checklist = [
  "40+ years of trusted scientific instrumentation expertise",
  "Authorized partner for leading global instrument brands",
  "Pan-India sales, service, and application support network",
];

export default function AboutUs() {
  const phone = siteConfig.contact.phone;

  return (
    <section className="relative mx-auto w-full px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div className="relative mx-auto w-full max-w-md pb-8 sm:pb-10 lg:mx-0 lg:max-w-none">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              alt="Inkarp Instruments office building"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 520px, 90vw"
              src="/assets/our-story/InkarpBuilding.jpg"
            />
          </div>

          <div className="absolute -bottom-6 left-1/2 flex w-[92%] -translate-x-1/2 items-center gap-4 rounded-xl border border-line-light bg-parchment p-4 shadow-xl sm:w-auto sm:max-w-xs">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red to-[#E63946] text-parchment">
              <FiPhoneCall aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-ink-soft">
                Call us anytime
              </p>
              <a
                className="font-maxot block truncate text-lg text-zinc-950"
                href={`tel:${phone.replaceAll(" ", "")}`}
              >
                {phone}
              </a>
            </div>
          </div>
        </div>

        <div>
          <span className="rounded-full border border-red/30 bg-parchment px-4 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
            About Us
          </span>
          <h2 className="font-maxot mt-4 text-2xl leading-tight text-red sm:text-3xl">
            Diverse Technologies with Global Impact
          </h2>
          <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-base">
            With over four decades of experience, we partner with global
            leaders to empower research, diagnostics, and industry through
            reliable, precise instrumentation and personalized support.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title}>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red/10 text-red">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h4 className="font-maxot text-base text-zinc-950">
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>

          <ul className="mt-8 space-y-3">
            {checklist.map((item) => (
              <li className="flex items-start gap-2 text-sm text-ink-soft" key={item}>
                <FiCheckCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[#E63946]"
                />
                {item}
              </li>
            ))}
          </ul>

          <Link
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red to-[#E63946] px-6 py-3 text-sm font-semibold text-parchment shadow hover:opacity-95"
            href="/our-story"
          >
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
}
