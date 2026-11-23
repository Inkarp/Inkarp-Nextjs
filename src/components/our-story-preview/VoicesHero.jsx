"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import Digits from "./Digits";
import Eyebrow from "./Eyebrow";
import { FACTS, HERO } from "./storyContent";
import { clamp01, useScrollFrame } from "./motion";
import styles from "./StoryPreview.module.css";

const WORDS = HERO.title.split(" ");
// Words set in red: the promise the heading ends on.
const ACCENT = new Set(["service", "trust."]);

// 0 when the photo's top is at the bottom of the screen, 1 when it reaches a fifth of the way down.
function widenProgress(element) {
  const rect = element.getBoundingClientRect();
  return clamp01((window.innerHeight - rect.top) / (window.innerHeight * 0.8));
}

/** B · hero: the heading arrives word by word, then the head office photo widens to fill its frame as you scroll. */
export default function VoicesHero() {
  const photoRef = useRef(null);
  useScrollFrame(photoRef, (progress, element) => element.style.setProperty("--w", progress.toFixed(4)), widenProgress);

  return (
    <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow className={styles.rise}>{HERO.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[16ch] text-[42px] leading-[1] text-ink sm:text-7xl lg:text-[88px]">
          {WORDS.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span className={`${styles.word} ${ACCENT.has(word) ? "text-red" : ""}`} style={{ "--i": index }}>
                {word}
              </span>{" "}
            </Fragment>
          ))}
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p className={`${styles.rise} max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg`} style={{ "--i": 6 }}>
            {HERO.lede}
          </p>
          <dl className="flex gap-8 sm:gap-12">
            {FACTS.map((fact, index) => (
              <div className="flex flex-col-reverse" key={fact.label}>
                <dt className="mt-2 max-w-[11ch] text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-ink-soft">{fact.label}</dt>
                <dd className="text-[34px] font-bold leading-none text-ink sm:text-[44px]">
                  <Digits delay={10 + index * 4} value={`${fact.value}${fact.suffix ?? ""}`} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={`${styles.widen} relative mx-auto mt-12 aspect-[4/3] max-w-[1180px] overflow-hidden bg-parchment-alt sm:aspect-[21/9]`} ref={photoRef}>
        <Image alt={HERO.imageAlt} className={`${styles.widenImg} object-cover object-[50%_62%]`} fetchPriority="high" fill loading="eager" sizes="(min-width: 1280px) 1180px, 92vw" src={HERO.image} />
      </div>
    </section>
  );
}
