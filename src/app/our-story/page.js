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

      <section className="border-b border-line-light bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <RecTag>Our Story</RecTag>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Four decades of scientific partnerships, built on service and trust.
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-ink-soft sm:text-lg">
            From a focused instrumentation company to a pan-India scientific solutions partner, Inkarp has grown by staying close to researchers, laboratories, and global principals who expect reliability at every step.
          </p>
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

      <LeadershipRecognition />
    </main>
  );
}