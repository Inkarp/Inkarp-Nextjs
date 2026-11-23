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
 * The four chapters as panels side by side. Pinned on wide screens, the
 * panel being read opens wide and the others fold to a spine with their
 * name, in turn as the page scrolls; a spine can also be clicked. Phones get
 * the chapters one under another.
 */
export default function ChapterAccordion() {
  const sectionRef = useRef(null);
  const [open, setOpen] = useState(0);
  const { items } = CHAPTERS;

  const reduced = useScrollFrame(sectionRef, (progress) => {
    if (!window.matchMedia(WIDE).matches) return;
    setOpen(Math.min(items.length - 1, Math.floor(progress * items.length * 0.999)));
  });

  // Scroll to where a chapter opens.
  function openChapter(index) {
    const section = sectionRef.current;
    if (reduced || !section) {
      setOpen(index);
      return;
    }
    const travel = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY + (travel * (index + 0.5)) / items.length;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section className={reduced ? "" : "lg:h-[320vh]"} ref={sectionRef}>
      <div className={`${reduced ? "" : "lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center"} py-16 lg:py-8`}>
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>{CHAPTERS.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[32px] leading-[1.08] text-ink sm:text-5xl" data-reveal>
              {CHAPTERS.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft" data-reveal style={{ "--i": 1 }}>
              {CHAPTERS.description}
            </p>
          </div>

          {/* Wide screens: the accordion. */}
          <ol className="mt-10 hidden h-[min(58vh,520px)] gap-3 lg:flex">
            {items.map((item, index) => (
              <li
                className={`${styles.panel} relative min-w-0 overflow-hidden bg-ink`}
                data-open={index === open ? "" : undefined}
                key={item.key}
                style={{ flexGrow: index === open ? 6 : 1, flexBasis: 0 }}
              >
                <Image alt={item.label} className={`object-cover transition duration-700 ${index === open ? "opacity-100" : "opacity-45"}`} fill sizes="(min-width: 1024px) 760px, 1px" src={item.img} />
                <button
                  aria-expanded={index === open}
                  aria-label={`${pad(index + 1)} ${item.label}`}
                  className="absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 text-left"
                  onClick={() => openChapter(index)}
                  type="button"
                >
                  <span className={`${styles.panelLabel} font-mono text-[12px] uppercase tracking-[0.18em] text-white`}>
                    {pad(index + 1)} · {item.label}
                  </span>
                </button>
                <div className={`${styles.panelBody} absolute bottom-5 left-5 z-20 max-w-[440px] bg-white p-6`}>
                  <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-red">
                    <span className="text-ink">{pad(index + 1)}</span>
                    <span aria-hidden="true" className="h-px w-8 bg-red" />
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-[24px] font-semibold leading-tight text-ink">{item.heading}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Phones and tablets: one under another. */}
          <ol className="mt-10 grid gap-8 lg:hidden">
            {items.map((item, index) => (
              <li className="border border-line-light bg-white" data-reveal key={item.key}>
                <div className="relative aspect-[4/3] overflow-hidden bg-parchment-alt">
                  <Image alt={item.label} className="object-cover" fill sizes="92vw" src={item.img} />
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-red">
                    <span className="text-ink">{pad(index + 1)}</span>
                    <span aria-hidden="true" className="h-px w-8 bg-red" />
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-[22px] font-semibold leading-tight text-ink">{item.heading}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
