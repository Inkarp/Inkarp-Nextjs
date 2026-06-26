import Directors from "@/components/about/Directors";
import EmpathyTeam from "@/components/about/EmpathyTeam";
import InkarpBio from "@/components/about/InkarpBio";
import MissionVision from "@/components/about/MissionVision";
import TrustedClients from "@/components/about/TrustedClients";
import PageBreadcrumbs, { BreadcrumbJsonLd } from "@/components/common/PageBreadcrumbs";
import { buildPageMetadata } from "@/data/pageSeo";

export const metadata = buildPageMetadata("/our-story");

export default function OurStory() {
  return (
    <main className="overflow-hidden">
      <BreadcrumbJsonLd path="/our-story" />
      <PageBreadcrumbs path="/our-story" />
      <MissionVision />
      <InkarpBio />
      <TrustedClients />
      <section
        className="relative overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/assets/our-story/InkarpBuilding.jpg')",
        }}
      >
        <div className="absolute inset-0  backdrop-blur-[1px]" />
        <div className="relative z-10">
          <EmpathyTeam />
          <Directors />
       
        </div>
      </section>
    </main>
  );
}
