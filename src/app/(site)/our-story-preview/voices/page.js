import BranchMapScene from "@/components/our-story-preview/BranchMapScene";
import ChapterAccordion from "@/components/our-story-preview/ChapterAccordion";
import ClientLogos from "@/components/our-story-preview/ClientLogos";
import Directors from "@/components/our-story-preview/Directors";
import Eyebrow from "@/components/our-story-preview/Eyebrow";
import FrameHero from "@/components/our-story-preview/FrameHero";
import LitQuote from "@/components/our-story-preview/LitQuote";
import NamesRoad from "@/components/our-story-preview/NamesRoad";
import PreviewBar from "@/components/our-story-preview/PreviewBar";
import StackedPurpose from "@/components/our-story-preview/StackedPurpose";
import StoryRoot from "@/components/our-story-preview/StoryRoot";
import { LEADERS } from "@/components/our-story-preview/storyContent";

export const metadata = {
  title: "Our Story preview B · In their words | Inkarp",
};

export default function VoicesPreview() {
  const [chairman, director] = LEADERS.people;

  return (
    <main className="bg-white text-ink" data-scroll-skip>
      <PreviewBar active="voices" />
      <StoryRoot>
        <FrameHero address="Nacharam, Hyderabad" />
        <BranchMapScene />
        <div className="mx-auto max-w-[1180px] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <Eyebrow>{LEADERS.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
            {LEADERS.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg" data-reveal style={{ "--i": 1 }}>
            {LEADERS.description}
          </p>
        </div>
        <LitQuote person={chairman} />
        <LitQuote flip person={director} />
        <StackedPurpose />
        <ChapterAccordion />
        <NamesRoad />
        <Directors variant="portraits" />
        <ClientLogos variant="wall" />
      </StoryRoot>
    </main>
  );
}
