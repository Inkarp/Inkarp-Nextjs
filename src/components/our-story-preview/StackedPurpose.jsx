import Eyebrow from "./Eyebrow";
import { PURPOSE } from "./storyContent";
import styles from "./StoryPreview.module.css";

const SURFACES = ["bg-white", "bg-parchment-alt", "bg-[#fbeaec]"];

/** B · mission, vision and values as cards that pin and stack over one another as the page scrolls. */
export default function StackedPurpose() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">{PURPOSE.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
            {PURPOSE.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg" data-reveal style={{ "--i": 1 }}>
            {PURPOSE.description}
          </p>
        </div>

        <div className="mt-14">
          {PURPOSE.pillars.map((pillar, index) => (
            <article
              className={`${styles.stackCard} ${SURFACES[index]} sticky mb-[18vh] grid min-h-[58vh] gap-6 border border-line-light p-7 transition-[top] duration-300 ease-out last:mb-0 sm:p-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center lg:gap-14 lg:p-16`}
              key={pillar.key}
              style={{ top: `calc(var(--header-offset, 0px) + ${20 + index * 26}px)` }}
            >
              <span aria-hidden="true" className="font-display text-[96px] font-bold leading-none text-transparent [-webkit-text-stroke:2px_#be0010] sm:text-[150px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-mono text-[13px] uppercase tracking-[0.18em] text-red">{pillar.title}</h3>
                <p className="mt-5 text-[24px] leading-[1.25] text-ink sm:text-[34px] lg:text-[40px]">{pillar.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
