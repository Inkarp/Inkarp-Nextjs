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
    summary: "People first. The chairman's and managing director's words light up as you read, mission, vision and values stack like cards, and the chapters slide sideways.",
    motion: ["Words light as you scroll", "Building photo widens", "Cards stack on scroll", "Chapters move sideways", "Logo wall pops in"],
  },
  {
    key: "network",
    letter: "C",
    name: "Across India",
    image: "/assets/our-story/InkarpBuilding.jpg",
    summary: "The network. Lines run from the Hyderabad head office to all twelve branches as you scroll, the years read off a ruler, and the chapters open one after another.",
    motion: ["Branches appear on the map", "Year ruler slides", "Chapters open in turn", "Readouts scan in", "Logo rows slide"],
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
        <h1 className="mt-4 text-4xl leading-tight text-ink sm:text-5xl">Two ways to tell the Inkarp story</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Same content as the live page, word for word, plus the names from the history collage, the awards and the branches. Each one moves differently as you scroll; sections can be mixed between them.
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
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
          until you pick one.
        </p>
      </div>
    </main>
  );
}
