"use client";

import Image from "next/image";
import { useRef } from "react";
import Digits from "./Digits";
import Eyebrow from "./Eyebrow";
import { BRANCHES, FACTS, HERO } from "./storyContent";
import { clamp01, useScrollFrame } from "./motion";
import styles from "./StoryPreview.module.css";

const LINES = ["Four decades of scientific partnerships,", "built on service and trust."];
const FACT_CODES = ["SINCE", "PRINCIPALS", "BRANCHES"];

// 0 with the photo's top at the bottom of the screen, 1 once it has climbed to the top.
function zoomProgress(element) {
  const rect = element.getBoundingClientRect();
  return clamp01((window.innerHeight - rect.top) / window.innerHeight);
}

/**
 * Hero: the heading is scanned in line by line, the three figures read
 * out like instrument displays, and the head office photo sits on a drawing
 * sheet, zooming out to its frame as you scroll, with dimension lines drawn
 * along its edges.
 */
export default function FrameHero({ address }) {
  const photoRef = useRef(null);
  useScrollFrame(photoRef, (progress, element) => element.style.setProperty("--z", progress.toFixed(4)), zoomProgress);
  const hq = BRANCHES.find((branch) => branch.headOffice);

  return (
    <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow className={styles.rise}>{HERO.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-[38px] leading-[1.04] text-ink sm:text-[56px] lg:text-[64px]">
          {LINES.map((line, index) => (
            <span className={`${styles.scan} ${index ? "text-red" : ""}`} key={line} style={{ "--i": index }}>
              {line}{" "}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
          <p className={`${styles.rise} max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg`} style={{ "--i": 3 }}>
            {HERO.lede}
          </p>
          <dl className="grid grid-cols-3 border border-ink bg-ink text-white">
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

        <figure className="relative mt-14 pl-6 pt-6 sm:pl-10 sm:pt-10">
          {/* Dimension lines along the top and left edges of the drawing. */}
          <span aria-hidden="true" className={`${styles.dimH} left-6 right-0 top-2 sm:left-10 sm:top-4`} />
          <span aria-hidden="true" className={`${styles.dimV} bottom-0 left-2 top-6 sm:left-4 sm:top-10`} />
          <span aria-hidden="true" className="absolute left-1/2 top-0 -translate-x-1/2 bg-white px-2 font-mono text-[10px] tracking-[0.14em] text-red sm:top-1">
            HEAD OFFICE
          </span>
          <div className={styles.ticks}>
            <div className="relative aspect-[4/3] overflow-hidden bg-parchment-alt sm:aspect-[16/8]" ref={photoRef}>
              <Image alt={HERO.imageAlt} className={`${styles.zoomImg} object-cover object-[50%_60%]`} fetchPriority="high" fill loading="eager" sizes="(min-width: 1280px) 1140px, 90vw" src={HERO.image} />
              <span className="absolute bottom-0 left-0 bg-white px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink">{address}</span>
              {hq ? (
                <span className="absolute right-0 top-0 bg-white px-3 py-2 font-mono text-[10.5px] tracking-[0.12em] text-ink">
                  {hq.coords.lat.toFixed(2)}° N · {hq.coords.lon.toFixed(2)}° E
                </span>
              ) : null}
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
