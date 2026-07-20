import Image from "next/image";
import Directors from "@/components/about/Directors";
import EmpathyTeam from "@/components/about/EmpathyTeam";
import InkarpBio from "@/components/about/InkarpBio";
import LeadershipRecognition from "@/components/about/LeadershipRecognition";
import MissionVision from "@/components/about/MissionVision";
import TrustedClients from "@/components/about/TrustedClients";
import RecTag from "@/components/home/RecTag";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/our-story");

export default function OurStory() {
  return (
    <main className="overflow-hidden bg-parchment text-ink">
      <BreadcrumbJsonLd path="/our-story" />
      <PageBreadcrumbs path="/our-story" />

      <section className="relative min-h-[520px] overflow-hidden border-b border-line-light bg-ink px-4 py-16 text-parchment sm:px-6 lg:px-8 lg:py-24">
        <Image
          alt="Inkarp building"
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src="/assets/our-story/InkarpBuilding.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/45 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-parchment to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1180px] flex-col justify-end">
          <div className="max-w-3xl pb-8">
            <RecTag>About Us</RecTag>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-parchment sm:text-5xl lg:text-6xl">
              Four decades of scientific partnerships, built on service and trust.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-parchment/86 sm:text-lg">
              From a focused instrumentation company to a pan-India scientific solutions partner, Inkarp has grown by staying close to researchers, laboratories, and global principals who expect reliability at every step.
            </p>
          </div>

          <div className="grid border border-line-light bg-parchment text-ink sm:grid-cols-3">
            {[
              ["40+", "Years of experience"],
              ["Pan-India", "Service network"],
              ["Global", "Principal partnerships"],
            ].map(([value, label]) => (
              <div className="border-b border-line-light px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0" key={label}>
                <p className="text-xl font-semibold text-red">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MissionVision />
      <InkarpBio />
      <TrustedClients />

      <section
        className="relative overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/assets/our-story/InkarpBuilding.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-parchment/82" />
        <div className="relative z-10">
          <EmpathyTeam />
          <Directors />
        </div>
      </section>

      {/* <LeadershipRecognition /> */}
    </main>
  );
}