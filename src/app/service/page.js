import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import ProductHandlingGuide from "@/components/service/ProductHandlingGuide";
import RecTag from "@/components/home/RecTag";
import ServiceAbout from "@/components/service/ServiceAbout";
import ServiceContactForm from "@/components/service/ServiceContactForm";
import ServiceTabs from "@/components/service/ServiceTabs";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/service");

const servicePromises = [
  "Principal-trained engineers",
  "Installation to long-term care",
  "Genuine spares and AMC support",
];

const serviceStats = [
  { value: "40+", label: "Years of scientific support" },
  { value: "18", label: "Offices across India" },
  { value: "184k+", label: "Service touchpoints" },
];

export default function ServicePage() {
  return (
    <main className="bg-white text-ink">
      <BreadcrumbJsonLd path="/service" />
      <PageBreadcrumbs path="/service" />

      <section className="bg-white px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <RecTag>Service Support</RecTag>
              <h1 className="max-w-[15ch] text-[32px] font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                Service that keeps your lab
                <em className="italic text-red"> running with confidence.</em>
              </h1>

              <p className="my-5 max-w-[560px] text-base leading-relaxed text-ink-soft sm:text-lg">
                At Inkarp Instruments, service is the backbone of our partnership with
                scientists, researchers, and industries across India. Our factory-trained
                engineers, application specialists, and service managers support every
                instrument journey from installation to long-term maintenance.
              </p>

              <div className="mb-9 grid max-w-[560px] gap-3 sm:grid-cols-3">
                {servicePromises.map((promise) => (
                  <div key={promise} className="flex items-start gap-2 border border-line-light bg-parchment-alt p-3">
                    <FiCheckCircle className="mt-0.5 size-4 shrink-0 text-red" />
                    <span className="text-xs font-semibold leading-snug text-ink">{promise}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3.5">
                <Link
                  href="#service-request"
                  className="inline-flex items-center gap-2 border border-red bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-transparent hover:text-red"
                >
                  Request Service
                  <FiArrowRight className="size-4" />
                </Link>
                <Link
                  href="#service-types"
                  className="border border-line-light bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-red hover:text-red"
                >
                  View Services
                </Link>
              </div>
            </div>

            <div className="relative border border-line-light bg-parchment-alt p-4.5 before:absolute before:left-[-1px] before:top-[-1px] before:h-4 before:w-4 before:border-l-[1.5px] before:border-t-[1.5px] before:border-red before:content-[''] after:absolute after:bottom-[-1px] after:right-[-1px] after:h-4 after:w-4 after:border-b-[1.5px] after:border-r-[1.5px] after:border-red after:content-['']">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-line-light bg-white">
                <Image
                  alt="Inkarp service engineer support"
                  className="object-cover object-center"
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 90vw"
                  src="/assets/service/BannerImage.jpg"
                />
              </div>
              <div className="mt-4 flex flex-wrap justify-between gap-4 text-[11px] uppercase tracking-wide text-ink-soft">
                <span>Fig. 01 - Inkarp Service Network</span>
                <span>Installation / AMC / Spares</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {serviceStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 border border-line-light bg-parchment-alt px-5 py-3">
                <span className="text-lg font-semibold text-red">{stat.value}</span>
                <span className="text-[9.5px] uppercase leading-tight tracking-wide text-ink-soft">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment-alt px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <RecTag>Partnership Mindset</RecTag>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-4xl">
              Every lab is unique. The support plan should be too.
            </h2>
          </div>
          <div className="grid gap-5 text-sm leading-6 text-ink-soft sm:grid-cols-2">
            <p>
              Our service portfolio covers installation, technical support, preventive care,
              long-term maintenance, and spares replacement. Quick response times and genuine
              parts help labs protect uptime and measurement confidence.
            </p>
            <p>
              With Inkarp, you do not just buy an instrument. You invest in a support path built
              around performance, reliability, and trust across the full lifecycle of your lab.
            </p>
          </div>
        </div>
      </section>

      <ServiceTabs />
      <ServiceAbout />
      <ProductHandlingGuide />
      <ServiceContactForm />
    </main>
  );
}