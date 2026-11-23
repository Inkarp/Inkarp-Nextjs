"use client";

import Image from "next/image";
import { useRef } from "react";
import Digits from "./Digits";
import Eyebrow from "./Eyebrow";
import { BRANCHES, FACTS, HERO } from "./storyContent";
import { passProgress, useScrollFrame } from "./motion";
import styles from "./StoryPreview.module.css";

const LINES = ["Four decades of scientific partnerships,", "built on service and trust."];
const FACT_CODES = ["SINCE", "PRINCIPALS", "BRANCHES"];

/**
 * Hero: the head office building fills the top of the page behind the
 * heading, under a soft white fade (from the left on wide screens, downward
 * on phones) so the text stays readable. The heading is scanned in line by
 * line, the three figures read out like instrument displays, and the photo
 * eases out of a slight zoom as the page scrolls.
 */
export default function FrameHero({ address }) {
  const sectionRef = useRef(null);
  useScrollFrame(sectionRef, (progress, element) => element.style.setProperty("--z", Math.min(1, Math.max(0, progress + 0.3)).toFixed(4)), passProgress);
  const hq = BRANCHES.find((branch) => branch.headOffice);

  return (
    <section className="relative isolate overflow-hidden" ref={sectionRef}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[56vh] min-h-[320px] overflow-hidden lg:inset-y-0 lg:h-auto">
        <Image alt="" className={`${styles.zoomImg} object-cover object-[55%_45%]`} fetchPriority="high" fill loading="eager" sizes="100vw" src={HERO.image} />
        {/* Phones: clear at the top, fading to white into the text. Wide screens: white on the left behind the text, clear on the right. */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/70 to-white lg:bg-gradient-to-r lg:from-white lg:from-[28%] lg:via-white/80 lg:via-[48%] lg:to-white/0" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-white/0" />
      </div>

      <div className="mx-auto flex max-w-[1180px] flex-col justify-center px-4 pb-16 pt-[34vh] sm:px-6 lg:min-h-[640px] lg:px-8 lg:pb-24 lg:pt-20">
        <div className="lg:max-w-[640px]">
          <Eyebrow className={styles.rise}>{HERO.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[38px] leading-[1.04] text-ink sm:text-[56px] lg:text-[60px]">
            {LINES.map((line, index) => (
              <span className={`${styles.scan} ${index ? "text-red" : ""}`} key={line} style={{ "--i": index }}>
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className={`${styles.rise} mt-7 max-w-xl text-base leading-relaxed text-ink sm:text-lg`} style={{ "--i": 3 }}>
            {HERO.lede}
          </p>
          <dl className="mt-9 grid max-w-[560px] grid-cols-3 border border-ink bg-ink text-white shadow-[0_24px_50px_-30px_rgba(0,0,0,0.6)]">
            {FACTS.map((fact, index) => (
              <div className={`flex flex-col-reverse px-4 py-4 sm:px-5 ${index ? "border-l border-white/15" : ""}`} key={fact.label}>
                <dt className="mt-2 text-[10.5px] font-semibold uppercase leading-snug tracking-[0.08em] text-white/60 sm:text-[11px]">{fact.label}</dt>
                <dd>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-white/50">
                    <span aria-hidden="true" className={`${styles.led} size-1.5 rounded-full bg-[#ff3b4a]`} style={{ animationDelay: `${index * 300}ms` }} />
                    {FACT_CODES[index]}
                  </span>
                  <span className="mt-2 block font-mono text-[28px] font-semibold leading-none text-white sm:text-[40px]">
                    <Digits delay={8 + index * 4} value={`${fact.value}${fact.suffix ?? ""}`} />
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p className="absolute right-3 top-3 bg-white/90 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink shadow-sm backdrop-blur sm:text-[10.5px] lg:bottom-8 lg:right-8 lg:top-auto">
        <span className="text-red">Head office</span> · {address}
        {hq ? <span className="hidden sm:inline"> · {hq.coords.lat.toFixed(2)}° N {hq.coords.lon.toFixed(2)}° E</span> : null}
      </p>
    </section>
  );
}
