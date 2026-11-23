"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Eyebrow from "./Eyebrow";
import { CHAPTERS } from "./storyContent";
import { useScrollFrame } from "./motion";
import styles from "./StoryPreview.module.css";

const WIDE = "(min-width: 1024px)";
const pad = (value) => String(value).padStart(2, "0");

/**
 * B · the four chapters on one strip. On wide screens the strip is pinned and
 * moves sideways as the page scrolls down, with a bar and counter below; on
 * phones the chapters simply follow one another.
 */
export default function ChapterTrack() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const { items } = CHAPTERS;

  const reduced = useScrollFrame(sectionRef, (progress, section) => {
    const track = trackRef.current;
    if (!track) return;
    if (!window.matchMedia(WIDE).matches) {
      track.style.transform = "";
      return;
    }
    const travel = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    track.style.transform = `translate3d(${(-progress * travel).toFixed(1)}px, 0, 0)`;
    section.style.setProperty("--p", progress.toFixed(4));
    setCurrent(Math.min(items.length - 1, Math.round(progress * (items.length - 1))));
  });

  return (
    <section className={reduced ? "py-20" : "py-20 lg:h-[360vh] lg:py-0"} ref={sectionRef}>
      <div className={`${reduced ? "" : "lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center"} overflow-hidden bg-parchment-alt py-16 lg:py-10`}>
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <Eyebrow>{CHAPTERS.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
                {CHAPTERS.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft" data-reveal style={{ "--i": 1 }}>
                {CHAPTERS.description}
              </p>
            </div>
            <p aria-hidden="true" className="hidden font-mono text-sm text-ink lg:block">
              <span className="text-red">{pad(current + 1)}</span> / {pad(items.length)}
            </p>
          </div>

          <div className="mt-10">
            <ol className={`${styles.track} flex flex-col gap-10 lg:w-max lg:flex-row lg:gap-8`} ref={trackRef}>
              {items.map((item, index) => (
                <li className="grid gap-6 border border-line-light bg-white p-5 sm:p-6 lg:w-[min(64vw,780px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-8" data-reveal key={item.key}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-parchment-alt">
                    <Image alt={item.label} className="object-cover" fill sizes="(min-width: 1024px) 400px, 92vw" src={item.img} />
                  </div>
                  <div>
                    <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-red">
                      <span className="text-ink">{pad(index + 1)}</span>
                      <span aria-hidden="true" className="h-px w-8 bg-red" />
                      {item.label}
                    </p>
                    <h3 className="mt-4 text-[24px] font-semibold leading-tight text-ink sm:text-[28px]">{item.heading}</h3>
                    <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div aria-hidden="true" className="mt-8 hidden h-[3px] bg-line-light lg:block">
            <div className={`${styles.trackBar} h-full bg-red`} />
          </div>
        </div>
      </div>
    </section>
  );
}
