import BranchMapScene from "@/components/our-story-preview/BranchMapScene";
import ChapterAccordion from "@/components/our-story-preview/ChapterAccordion";
import ClientLogos from "@/components/our-story-preview/ClientLogos";
import Directors from "@/components/our-story-preview/Directors";
import FrameHero from "@/components/our-story-preview/FrameHero";
import LeaderSplit from "@/components/our-story-preview/LeaderSplit";
import PreviewBar from "@/components/our-story-preview/PreviewBar";
import StackedPurpose from "@/components/our-story-preview/StackedPurpose";
import StoryRoot from "@/components/our-story-preview/StoryRoot";

export const metadata = {
  title: "Our Story preview C · Across India | Inkarp",
};

export default function NetworkPreview() {
  return (
    <main className="bg-white text-ink" data-scroll-skip>
      <PreviewBar active="network" />
      <StoryRoot>
        <FrameHero address="Nacharam, Hyderabad" />
        <BranchMapScene />
        <ChapterAccordion />
        <StackedPurpose />
        <LeaderSplit />
        <Directors variant="rows" />
        <ClientLogos variant="scroll" />
      </StoryRoot>
    </main>
  );
}
