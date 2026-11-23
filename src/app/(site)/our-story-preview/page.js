import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export const metadata = {
  title: "Our Story previews | Inkarp",
};

const DIRECTIONS = [
  {
    key: "voices",
    letter: "B",
    name: "In their words",
    image: "/assets/our-story/team/BaluFullImage.jpg",
    position: "object-left",
    summary: "The page being finalised. The head office photo zooms out in its frame, lines run from Hyderabad to all twelve branches, mission, vision and values stack like cards, the chapters open one after another, and the leadership section comes in two versions to choose from.",
    motion: ["Photo zooms out", "Branches appear on the map", "Cards stack on scroll", "Chapters open in turn", "Two leadership versions", "Logo wall pops in"],
  },
];

export default function OurStoryPreviews() {
  return (
    <main className="bg-white" data-scroll-skip>
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-red">
          <span aria-hidden="true" className="h-px w-6 bg-current" />
          Our Story preview
        </p>
        <h1 className="mt-4 text-4xl leading-tight text-ink sm:text-5xl">The Inkarp story, in their words</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Same content as the live page, word for word, plus the names from the history collage and the branches. Every section moves as you scroll.
        </p>
        <ul className="mt-12 grid max-w-[620px] gap-6">
          {DIRECTIONS.map((item) => (
            <li key={item.key}>
              <Link className="group flex h-full flex-col border border-line-light bg-white transition hover:border-red" href={`/our-story-preview/${item.key}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-parchment-alt">
                  <Image alt="" className={`object-cover transition duration-700 group-hover:scale-105 ${item.position ?? ""}`} fill loading="eager" sizes="(min-width: 768px) 560px, 92vw" src={item.image} />
                  <span className="absolute left-4 top-4 grid size-10 place-items-center bg-red font-mono text-lg font-semibold text-white">{item.letter}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-2xl text-ink">{item.name}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{item.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {item.motion.map((entry) => (
                      <li className="bg-parchment-alt px-2 py-1 text-[12px] text-ink" key={entry}>
                        {entry}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red">
                    Open preview <FiArrowRight aria-hidden="true" className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-ink-soft">
          The live page stays as it is at{" "}
          <Link className="font-semibold text-red hover:underline" href="/our-story">
            /our-story
          </Link>{" "}
          until this one is approved.
        </p>
      </div>
    </main>
  );
}
