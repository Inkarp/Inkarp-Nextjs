import BranchMapScene from "@/components/our-story-preview/BranchMapScene";
import ChapterAccordion from "@/components/our-story-preview/ChapterAccordion";
import ClientLogos from "@/components/our-story-preview/ClientLogos";
import Directors from "@/components/our-story-preview/Directors";
import Eyebrow from "@/components/our-story-preview/Eyebrow";
import FrameHero from "@/components/our-story-preview/FrameHero";
import LeaderSplit from "@/components/our-story-preview/LeaderSplit";
import LitQuote from "@/components/our-story-preview/LitQuote";
import NamesRoad from "@/components/our-story-preview/NamesRoad";
import PreviewBar from "@/components/our-story-preview/PreviewBar";
import StackedPurpose from "@/components/our-story-preview/StackedPurpose";
import StoryRoot from "@/components/our-story-preview/StoryRoot";
import { LEADERS } from "@/components/our-story-preview/storyContent";

export const metadata = {
  title: "Our Story preview | Inkarp",
};

// Preview only: marks the two leadership versions so a reviewer can say which
// one to keep. Remove with the version not chosen.
function VersionTag({ number, children }) {
  return (
    <div className="border-y border-dashed border-red/40 bg-[#fdf0f1]">
      <p className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-red sm:px-6 lg:px-8">
        <span className="bg-red px-2 py-0.5 font-semibold text-white">Leadership · version {number} of 2</span>
        <span className="text-ink-soft">{children}</span>
      </p>
    </div>
  );
}

export default function OurStoryPreview() {
  const [chairman, director] = LEADERS.people;

  return (
    <main className="bg-white text-ink" data-scroll-skip>
      <PreviewBar />
      <StoryRoot>
        <FrameHero address="Nacharam, Hyderabad" />
        <BranchMapScene />
        <StackedPurpose />
        <ChapterAccordion />
        <NamesRoad />

        {/* The people together at the end: two versions of the leadership section to choose from, then the directors. */}
        <VersionTag number={1}>Their words light up as you scroll</VersionTag>
        <div className="mx-auto max-w-[1180px] px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
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

        <VersionTag number={2}>Side by side, portraits drift as you scroll</VersionTag>
        <LeaderSplit />

        <Directors />
        <ClientLogos />
      </StoryRoot>
    </main>
  );
}
