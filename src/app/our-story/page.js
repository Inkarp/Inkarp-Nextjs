import EmpathyTeam from "@/components/about/EmpathyTeam";
import InkarpBio from "@/components/about/InkarpBio";
import MissionVision from "@/components/about/MissionVision";
import TeamNewTwo from "@/components/about/TeamNewTwo";
import TrustedClients from "@/components/about/TrustedClients";

export const metadata = {
  title: "Our Story - Inkarp Instruments Private Ltd",
  description:
    "Discover Inkarp Instruments Pvt Ltd, our mission, values, leadership, and commitment to quality.",
};

export default function OurStory() {
  return (
    <main className="overflow-hidden">
      <MissionVision />
      <InkarpBio />
      <TrustedClients />
      <section
        className="relative overflow-hidden bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/assets/our-story/InkarpBuilding.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]" />
        <div className="relative z-10">
          <EmpathyTeam />
          <TeamNewTwo />
        </div>
      </section>
    </main>
  );
}
