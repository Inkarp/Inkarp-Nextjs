import Image from "next/image";
import Eyebrow from "./Eyebrow";
import { COLLAGE, NAMES } from "./storyContent";
import styles from "./StoryPreview.module.css";

/** The names on the history collage's road, a line drawing across them as it arrives, beside the collage. */
export default function NamesRoad() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>Our Journey</Eyebrow>
            <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
              From INCORP in {NAMES[0].year} to today
            </h2>
            <ol className={`${styles.rule} mt-10 grid grid-cols-5 gap-x-3 border-t border-line-light pt-6`} data-reveal="fade">
              {NAMES.map((item, index) => (
                <li className="relative" data-reveal key={item.year} style={{ "--i": index + 1 }}>
                  <span aria-hidden="true" className="absolute -top-[29px] left-0 size-2.5 rounded-full bg-red ring-4 ring-white" />
                  <span className="block font-mono text-[12px] text-ink-soft sm:text-sm">{item.year}</span>
                  <span className="mt-2 block font-display text-[14px] font-bold leading-tight text-ink [font-stretch:88%] sm:text-[21px]">{item.name}</span>
                </li>
              ))}
            </ol>
          </div>
          <figure data-reveal="wipe">
            <div className="relative aspect-[1315/868] overflow-hidden border border-line-light">
              <Image alt={COLLAGE.alt} className="object-cover" fill sizes="(min-width: 1024px) 640px, 92vw" src={COLLAGE.image} />
            </div>
            <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">From our history collage</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
